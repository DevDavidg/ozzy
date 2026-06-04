'use client';

import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { EditableText } from '@/components/admin/editor/editable-text';
import { CtaLink } from '@/components/storefront/cta-link';
import { useCartOptional } from '@/context/cart-context';
import { formatPrice } from '@/lib/site-data';
import type { BagContent } from '@/lib/types';

type CartViewProps = {
  bag: BagContent;
  editable?: boolean;
};

export const CartView = ({ bag, editable = false }: CartViewProps) => {
  const cart = useCartOptional();
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const itemCount = cart?.itemCount ?? 0;

  if (editable) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-5 text-muted-foreground" aria-hidden />
        </div>
        <EditableText
          path="sections.bag.emptyTitle"
          value={bag.emptyTitle}
          as="h2"
          className="font-display mt-5 text-xl font-semibold"
        />
        <EditableText
          path="sections.bag.emptyDescription"
          value={bag.emptyDescription}
          as="p"
          multiline
          className="mx-auto mt-2 max-w-sm text-muted-foreground"
        />
        <div className="mt-6 flex justify-center">
          <CtaLink
            href={bag.emptyCtaHref}
            label={bag.emptyCta}
            labelPath="sections.bag.emptyCta"
            hrefPath="sections.bag.emptyCtaHref"
            editable
          />
        </div>
        <div className="mt-4 flex justify-center">
          <CtaLink
            href={bag.checkoutHref}
            label={bag.checkoutCta}
            labelPath="sections.bag.checkoutCta"
            hrefPath="sections.bag.checkoutHref"
            editable
          />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-5 text-muted-foreground" aria-hidden />
        </div>
        <h2 className="font-display mt-5 text-xl font-semibold">{bag.emptyTitle}</h2>
        <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
          {bag.emptyDescription}
        </p>
        <CtaLink
          href={bag.emptyCtaHref}
          label={bag.emptyCta}
          labelPath="sections.bag.emptyCta"
          hrefPath="sections.bag.emptyCtaHref"
          className="mt-6"
          showArrow
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-6 py-5">
        <h2 className="font-display text-xl font-semibold">
          {bag.emptyTitle}{' '}
          <span className="text-muted-foreground">({itemCount})</span>
        </h2>
      </div>

      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 px-6 py-5">
            <Link
              href={`/producto/${item.slug}`}
              className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted"
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                unoptimized={item.imageUrl.startsWith('/uploads/')}
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <Link
                  href={`/producto/${item.slug}`}
                  className="font-medium transition hover:opacity-70"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPrice(item.price)}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-border">
                  <button
                    type="button"
                    onClick={() => cart?.updateQuantity(item.productId, item.quantity - 1)}
                    className="flex size-8 items-center justify-center transition hover:bg-muted"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="size-3.5" aria-hidden />
                  </button>
                  <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => cart?.updateQuantity(item.productId, item.quantity + 1)}
                    className="flex size-8 items-center justify-center transition hover:bg-muted"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="size-3.5" aria-hidden />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => cart?.removeItem(item.productId)}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label={`Eliminar ${item.name}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            </div>
            <p className="shrink-0 font-semibold">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="border-t border-border bg-muted/30 px-6 py-5">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <CtaLink
          href={bag.checkoutHref}
          label={bag.checkoutCta}
          labelPath="sections.bag.checkoutCta"
          hrefPath="sections.bag.checkoutHref"
          className="mt-5 w-full justify-center"
          showArrow
        />
      </div>
    </div>
  );
};
