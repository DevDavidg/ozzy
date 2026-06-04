'use server';

import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

import { login } from '@/lib/auth';

export type LoginState = {
  message: string;
};

export const loginAction = async (_state: LoginState, formData: FormData): Promise<LoginState> => {
  const result = await login(formData, { requiredRole: UserRole.ADMIN });

  if (result.ok) {
    redirect('/admin');
  }

  return { message: result.message };
};
