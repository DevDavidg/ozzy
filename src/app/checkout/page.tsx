import { UserRole } from '@prisma/client';

import { CheckoutClient } from '@/components/storefront/checkout-client';
import { StoreShell } from '@/components/storefront/store-shell';
import { getAccountNavProps } from '@/lib/account-nav';
import { getCurrentUser } from '@/lib/auth';
import { getSiteData } from '@/lib/site-data';

export default async function CheckoutPage() {
  const [data, user, accountNav] = await Promise.all([
    getSiteData(),
    getCurrentUser(),
    getAccountNavProps(),
  ]);
  const customer =
    user?.role === UserRole.CUSTOMER
      ? user
      : null;

  return (
    <StoreShell data={data} {...accountNav}>
      <section className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <p className="text-label text-muted-foreground">Checkout</p>
        <h1 className="font-display mt-2 text-3xl font-semibold md:text-4xl">
          Finalizar compra
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Revisá tu bolsa y confirmá el pedido. El flujo de pago está en desarrollo.
        </p>
        <div className="mt-10">
          <CheckoutClient user={customer} />
        </div>
      </section>
    </StoreShell>
  );
}
