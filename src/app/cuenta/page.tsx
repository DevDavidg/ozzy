import { UserRole } from '@prisma/client';
import { LogOut, Package } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { customerLogoutAction } from '@/app/cuenta/actions';
import { Button } from '@/components/ui/button';
import { StoreShell } from '@/components/storefront/store-shell';
import { getAccountNavProps } from '@/lib/account-nav';
import { getCurrentUser } from '@/lib/auth';
import { getCustomerOrders } from '@/lib/orders';
import { ORDER_STATUS_LABELS } from '@/lib/order-labels';
import { formatPrice, getSiteData } from '@/lib/site-data';

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/cuenta/ingresar');
  }

  if (user.role === UserRole.ADMIN) {
    redirect('/admin');
  }

  const [data, orders, accountNav] = await Promise.all([
    getSiteData(),
    getCustomerOrders(user.id),
    getAccountNavProps(),
  ]);

  return (
    <StoreShell data={data} {...accountNav}>
      <section className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-label text-muted-foreground">Mi cuenta</p>
            <h1 className="font-display mt-2 text-3xl font-semibold">Hola, {user.name}</h1>
            <p className="mt-2 text-muted-foreground">{user.email}</p>
          </div>
          <form action={customerLogoutAction}>
            <Button type="submit" variant="outline" className="gap-2">
              <LogOut className="size-4" aria-hidden />
              Cerrar sesión
            </Button>
          </form>
        </div>

        <div className="mt-10 rounded-2xl border border-amber-200/80 bg-amber-50 px-5 py-4 text-sm text-amber-950">
          <strong className="font-semibold">Compra en desarrollo:</strong> podés crear pedidos
          pendientes. El pago online (Mercado Pago) se integrará pronto; por ahora el equipo
          confirma manualmente desde el panel admin.
        </div>

        <div className="mt-10">
          <h2 className="font-display flex items-center gap-2 text-xl font-semibold">
            <Package className="size-5" aria-hidden />
            Mis pedidos
          </h2>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center">
              <p className="text-muted-foreground">Todavía no tenés pedidos.</p>
              <Button asChild className="mt-4">
                <Link href="/tienda">Ir a la tienda</Link>
              </Button>
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {orders.map((order) => (
                <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}{' '}
                      · {order.itemCount} {order.itemCount === 1 ? 'producto' : 'productos'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.subtotal)}</p>
                    <p className="text-sm text-muted-foreground">
                      {ORDER_STATUS_LABELS[order.status]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </StoreShell>
  );
}
