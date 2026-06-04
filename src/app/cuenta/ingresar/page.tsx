import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

import { CustomerLoginForm } from '@/components/storefront/account-auth-form';
import { AccountLayout } from '@/components/storefront/account-layout';
import { getCurrentUser } from '@/lib/auth';

type PageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function CustomerLoginPage({ searchParams }: PageProps) {
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
      title="Iniciar sesión"
      description="Ingresá a tu cuenta para comprar y ver tus pedidos."
    >
      <CustomerLoginForm redirectTo={redirectTo} />
    </AccountLayout>
  );
}
