'use client';

import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/site-data';
import type { StoreProduct } from '@/lib/types';

type ProductDetailClientProps = {
  product: StoreProduct & { categorySlug: string };
};

export const ProductDetailClient = ({ product }: ProductDetailClientProps) => {
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    cart.addItem(product, quantity);
    toast.success(
      quantity === 1
        ? `${product.name} agregado a tu bolsa`
        : `${quantity} unidades agregadas a tu bolsa`,
    );
  };

  const handleDecrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleIncrease = () => {
    setQuantity((current) => current + 1);
  };

  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-16">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority
          className="object-cover"
          unoptimized={product.imageUrl.startsWith('/uploads/')}
        />
        {product.badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-label text-primary-foreground">
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col">
        <Link
          href={`/categoria/${product.categorySlug}`}
          className="text-label text-muted-foreground transition hover:text-foreground"
        >
          {product.categoryName}
        </Link>
        <h1 className="font-display mt-2 text-3xl font-semibold md:text-4xl">
          {product.name}
        </h1>
        <p className="mt-4 text-2xl font-semibold">{formatPrice(product.price)}</p>
        <p className="mt-6 leading-8 text-muted-foreground">{product.description}</p>

        <div className="mt-8 flex items-center gap-4">
          <div className="inline-flex items-center rounded-full border border-border">
            <button
              type="button"
              onClick={handleDecrease}
              className="flex size-10 items-center justify-center transition hover:bg-muted"
              aria-label="Reducir cantidad"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <span className="min-w-10 text-center font-medium">{quantity}</span>
            <button
              type="button"
              onClick={handleIncrease}
              className="flex size-10 items-center justify-center transition hover:bg-muted"
              aria-label="Aumentar cantidad"
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            size="lg"
            onClick={handleAddToCart}
            className="gap-2"
            aria-label={`Agregar ${product.name} a la bolsa`}
          >
            <ShoppingBag className="size-4" aria-hidden />
            Agregar a la bolsa
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link href="/bolsa">Ver bolsa</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ProductBackLink = () => (
  <Link
    href="/tienda"
    className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
  >
    <ArrowLeft className="size-4" aria-hidden />
    Volver a la tienda
  </Link>
);
