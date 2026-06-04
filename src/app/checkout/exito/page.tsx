import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { StoreShell } from '@/components/storefront/store-shell';
import { getAccountNavProps } from '@/lib/account-nav';
import { getSiteData } from '@/lib/site-data';

type PageProps = {
  searchParams: Promise<{ pedido?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const [data, accountNav] = await Promise.all([getSiteData(), getAccountNavProps()]);
  const { pedido } = await searchParams;

  return (
    <StoreShell data={data} {...accountNav}>
      <section className="mx-auto max-w-lg px-5 py-16 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="size-7" aria-hidden />
        </div>
        <h1 className="font-display mt-6 text-3xl font-semibold">Pedido registrado</h1>
        {pedido ? (
          <p className="mt-3 text-lg font-medium">{pedido}</p>
        ) : null}
        <p className="mt-4 text-muted-foreground leading-7">
          Tu pedido quedó en estado pendiente. Te vamos a contactar para coordinar el pago y el
          envío. Podés ver el estado en tu cuenta.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/cuenta">Ver mi cuenta</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tienda">Seguir comprando</Link>
          </Button>
        </div>
      </section>
    </StoreShell>
  );
}
