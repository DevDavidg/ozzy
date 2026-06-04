import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

import { RegisterForm } from '@/components/storefront/account-auth-form';
import { AccountLayout } from '@/components/storefront/account-layout';
import { getCurrentUser } from '@/lib/auth';

type PageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function RegisterPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const { redirect: redirectTo } = await searchParams;

  if (user?.role === UserRole.CUSTOMER) {
    redirect(redirectTo?.startsWith('/') ? redirectTo : '/cuenta');
  }

  if (user?.role === UserRole.ADMIN) {
    redirect('/admin');
  }

  return (
    <AccountLayout
      title="Crear cuenta"
      description="Registrate para guardar tus pedidos y finalizar compras."
    >
      <RegisterForm redirectTo={redirectTo} />
    </AccountLayout>
  );
}
