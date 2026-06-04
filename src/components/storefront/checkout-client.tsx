'use client';

import { AlertTriangle, Construction, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';

import { placeOrderAction, type CheckoutState } from '@/app/checkout/actions';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/site-data';
const initialState: CheckoutState = {
  ok: false,
  message: '',
};

type CheckoutClientProps = {
  user: { id: string; name: string; email: string } | null;
};

export const CheckoutClient = ({ user }: CheckoutClientProps) => {
  const cart = useCart();
  const [state, formAction, isPending] = useActionState(placeOrderAction, initialState);

  useEffect(() => {
    if (state.ok && state.orderNumber) {
      cart.clearCart();
    }
  }, [state.ok, state.orderNumber, cart]);

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Para finalizar la compra necesitás una cuenta de cliente.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/cuenta/ingresar?redirect=/checkout">Iniciar sesión</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cuenta/registro?redirect=/checkout">Registrarse</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center">
        <p className="text-muted-foreground">Tu bolsa está vacía.</p>
        <Button asChild className="mt-4">
          <Link href="/tienda">Ir a la tienda</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set(
      'items',
      JSON.stringify(
        cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      ),
    );
    formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex gap-3 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3.5 text-sm text-amber-950">
          <Construction className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            <strong>Work in progress:</strong> el pago online todavía no está activo. Al confirmar
            se crea un pedido pendiente y el equipo te contactará para coordinar el pago.
          </p>
        </div>

        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {cart.items.map((item) => (
            <li key={item.productId} className="flex gap-4 px-5 py-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized={item.imageUrl.startsWith('/uploads/')} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <label className="block">
          <span className="text-sm font-medium">Notas del pedido (opcional)</span>
          <textarea
            name="notes"
            rows={3}
            className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Talle, dirección de envío, preferencias..."
          />
        </label>
      </div>

      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
          <p className="text-label text-muted-foreground">Comprando como</p>
          <p className="mt-1 font-semibold">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>

          <div className="mt-6 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>

          {state.message && !state.ok ? (
            <p className="mt-4 flex gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" aria-hidden />
              {state.message}
            </p>
          ) : null}

          <Button type="submit" disabled={isPending} className="mt-6 w-full" size="lg">
            {isPending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Creando pedido...
              </>
            ) : (
              'Confirmar pedido (WIP)'
            )}
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Sin cargo automático · Pedido pendiente de confirmación
          </p>
        </div>
      </div>
    </form>
  );
};
