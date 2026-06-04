import 'server-only';

import { UserRole } from '@prisma/client';

import { getCurrentUser } from '@/lib/auth';

export const getAccountNavProps = async (editable = false) => {
  if (editable) {
    return { loginHref: '/admin', loginLabel: 'Editando' };
  }

  const user = await getCurrentUser();

  if (user?.role === UserRole.CUSTOMER) {
    return { loginHref: '/cuenta', loginLabel: 'Mi cuenta' };
  }

  return { loginHref: '/cuenta/ingresar', loginLabel: 'Iniciar sesión' };
};
