'use server';

import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

import { destroySession, login, registerCustomer } from '@/lib/auth';

import type { AuthFormState } from '@/lib/auth-form-state';

export const customerLoginAction = async (
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const result = await login(formData, { requiredRole: UserRole.CUSTOMER });

  if (result.ok) {
    const redirectTo = formData.get('redirect')?.toString() || '/cuenta';
    redirect(redirectTo.startsWith('/') ? redirectTo : '/cuenta');
  }

  return { message: result.message };
};

export const registerAction = async (
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const result = await registerCustomer(formData);

  if (result.ok) {
    const redirectTo = formData.get('redirect')?.toString() || '/cuenta';
    redirect(redirectTo.startsWith('/') ? redirectTo : '/cuenta');
  }

  return { message: result.message };
};

export const customerLogoutAction = async () => {
  await destroySession();
  redirect('/cuenta/ingresar');
};
