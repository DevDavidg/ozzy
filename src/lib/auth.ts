import 'server-only';

import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/db';
import { loginSchema, registerSchema } from '@/lib/validators';

const sessionCookieName = 'ozzy_session';
const encoder = new TextEncoder();

const getSessionSecret = () => {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error('SESSION_SECRET is required');
  }

  return encoder.encode(secret);
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export const createSession = async (userId: string) => {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSessionSecret());

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const destroySession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
};

export const getCurrentUser = async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    const userId = payload.userId;

    if (typeof userId !== 'string') {
      return null;
    }

    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });
  } catch {
    return null;
  }
};

export const requireAdmin = async (): Promise<SessionUser> => {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.ADMIN) {
    redirect('/login');
  }

  return user;
};

export const requireCustomer = async (): Promise<SessionUser> => {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.CUSTOMER) {
    redirect('/cuenta/ingresar');
  }

  return user;
};

export const login = async (
  formData: FormData,
  options?: { requiredRole?: UserRole },
) => {
  const payload = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!payload.success) {
    return { ok: false as const, message: 'Completá email y contraseña.' };
  }

  const user = await prisma.user.findUnique({
    where: { email: payload.data.email },
  });

  if (!user) {
    return { ok: false as const, message: 'Credenciales incorrectas.' };
  }

  if (options?.requiredRole && user.role !== options.requiredRole) {
    return { ok: false as const, message: 'Credenciales incorrectas.' };
  }

  const isValidPassword = await bcrypt.compare(payload.data.password, user.passwordHash);

  if (!isValidPassword) {
    return { ok: false as const, message: 'Credenciales incorrectas.' };
  }

  await createSession(user.id);

  return { ok: true as const, message: 'Sesión iniciada.', role: user.role };
};

export const registerCustomer = async (formData: FormData) => {
  const payload = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!payload.success) {
    const firstError = payload.error.issues[0]?.message;
    return { ok: false as const, message: firstError ?? 'Revisá los datos del formulario.' };
  }

  const existing = await prisma.user.findUnique({
    where: { email: payload.data.email },
  });

  if (existing) {
    return { ok: false as const, message: 'Ya existe una cuenta con ese email.' };
  }

  const passwordHash = await bcrypt.hash(payload.data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: payload.data.name,
      email: payload.data.email,
      passwordHash,
      role: UserRole.CUSTOMER,
    },
  });

  await createSession(user.id);

  return { ok: true as const, message: 'Cuenta creada.' };
};
