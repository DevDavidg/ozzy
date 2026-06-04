import 'server-only';

import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validators';

const sessionCookieName = 'ozzy_session';
const encoder = new TextEncoder();

const getSessionSecret = () => {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error('SESSION_SECRET is required');
  }

  return encoder.encode(secret);
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

export const getCurrentUser = async () => {
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
      select: { id: true, email: true, name: true },
    });
  } catch {
    return null;
  }
};

export const requireAdmin = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return user;
};

export const login = async (formData: FormData) => {
  const payload = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!payload.success) {
    return { ok: false, message: 'Completá email y contraseña.' };
  }

  const user = await prisma.user.findUnique({
    where: { email: payload.data.email },
  });

  if (!user) {
    return { ok: false, message: 'Credenciales incorrectas.' };
  }

  const isValidPassword = await bcrypt.compare(payload.data.password, user.passwordHash);

  if (!isValidPassword) {
    return { ok: false, message: 'Credenciales incorrectas.' };
  }

  await createSession(user.id);

  return { ok: true, message: 'Sesión iniciada.' };
};
