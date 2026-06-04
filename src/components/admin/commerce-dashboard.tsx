'use client';

import { Package, ShoppingCart, TrendingUp, Warehouse } from 'lucide-react';
import { useTransition } from 'react';

import { updateOrderStatusAction } from '@/app/admin/commerce-actions';
import { Button } from '@/components/ui/button';
import { ORDER_STATUS_LABELS } from '@/lib/order-labels';
import { formatPrice } from '@/lib/site-data';
import type { AdminOrder, CommerceStats, StoreProduct } from '@/lib/types';
import type { OrderStatus } from '@/lib/types';

type CommerceDashboardProps = {
  stats: CommerceStats;
  orders: AdminOrder[];
  products: StoreProduct[];
};

const statusOptions: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'CANCELLED'];

export const CommerceDashboard = ({ stats, orders, products }: CommerceDashboardProps) => {
  const soldProducts = products.filter((product) => product.isVisible);

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pedidos totales"
          value={String(stats.totalOrders)}
          icon={ShoppingCart}
        />
        <StatCard
          label="Pendientes (WIP)"
          value={String(stats.pendingOrders)}
          icon={Package}
        />
        <StatCard
          label="Ventas confirmadas"
          value={formatPrice(stats.confirmedRevenue)}
          icon={TrendingUp}
        />
        <StatCard
          label="Unidades vendidas"
          value={String(stats.totalUnitsSold)}
          icon={Warehouse}
        />
      </div>

      {stats.lowStockProducts.length > 0 ? (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50 px-5 py-4">
          <p className="font-semibold text-amber-950">Stock bajo</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm text-amber-900">
            {stats.lowStockProducts.map((product) => (
              <li
                key={product.id}
                className="rounded-full bg-amber-100/80 px-3 py-1"
              >
                {product.name}: {product.stock} u.
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <section className="rounded-[1.5rem] border border-border bg-card/60 p-6">
        <h2 className="font-display text-xl font-bold">Pedidos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirmá pedidos para descontar stock. Cancelá para restaurar si ya estaba confirmado.
        </p>

        {orders.length === 0 ? (
          <p className="mt-6 text-muted-foreground">No hay pedidos todavía.</p>
        ) : (
          <ul className="mt-6 grid gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-[1.5rem] border border-border bg-card/60 p-6">
        <h2 className="font-display text-xl font-bold">Inventario</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Stock actual de productos visibles. Editá cantidades en la pestaña Productos.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-label text-muted-foreground">
                <th className="py-3 pr-4">Producto</th>
                <th className="py-3 pr-4">Precio</th>
                <th className="py-3">Stock</th>
              </tr>
            </thead>
            <tbody>
              {soldProducts.map((product) => (
                <tr key={product.id} className="border-b border-border/60">
                  <td className="py-3 pr-4 font-medium">{product.name}</td>
                  <td className="py-3 pr-4">{formatPrice(product.price)}</td>
                  <td className="py-3">
                    <span
                      className={
                        product.stock <= 5
                          ? 'font-bold text-amber-700'
                          : 'text-muted-foreground'
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Package;
}) => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="size-4" aria-hidden />
      <span className="text-label">{label}</span>
    </div>
    <p className="font-display mt-3 text-2xl font-bold">{value}</p>
  </div>
);

const OrderCard = ({ order }: { order: AdminOrder }) => {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: OrderStatus) => {
    const formData = new FormData();
    formData.set('orderId', order.id);
    formData.set('status', status);
    formData.set('notes', order.notes ?? '');
    startTransition(() => {
      updateOrderStatusAction(formData);
    });
  };

  return (
    <li className="rounded-2xl border border-border bg-muted/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold">{order.orderNumber}</p>
          <p className="text-sm text-muted-foreground">
            {order.customerName} · {order.customerEmail}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString('es-AR')}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold">{formatPrice(order.subtotal)}</p>
          <p className="text-sm">{ORDER_STATUS_LABELS[order.status]}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-1 text-sm">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-2">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span className="text-muted-foreground">{formatPrice(item.lineTotal)}</span>
          </li>
        ))}
      </ul>

      {order.notes ? (
        <p className="mt-3 rounded-xl bg-background px-3 py-2 text-sm text-muted-foreground">
          Notas: {order.notes}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <Button
            key={status}
            type="button"
            size="sm"
            variant={order.status === status ? 'default' : 'outline'}
            disabled={isPending || order.status === status}
            onClick={() => handleStatusChange(status)}
          >
            {ORDER_STATUS_LABELS[status]}
          </Button>
        ))}
      </div>
    </li>
  );
};
