'use client';

import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import { EditableImage } from '@/components/admin/editor/editable-image';
import { EditableText } from '@/components/admin/editor/editable-text';
import { useCartOptional } from '@/context/cart-context';
import { formatPrice } from '@/lib/site-data';
import { cn } from '@/lib/utils';
import type { StoreProduct } from '@/lib/types';

type ProductCardProps = {
  product: StoreProduct;
  editable?: boolean;
  index?: number;
};

export const ProductCard = ({
  product,
  editable = false,
  index = 0,
}: ProductCardProps) => {
  const cart = useCartOptional();

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!cart) {
      return;
    }

    cart.addItem(product);
    toast.success(`${product.name} agregado a tu bolsa`);
  };

  const cardContent = (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        {editable ? (
          <EditableImage
            path={`products.${product.id}.imageUrl`}
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            containerClassName="absolute inset-0"
          />
        ) : (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            unoptimized={product.imageUrl.startsWith('/uploads/')}
          />
        )}

        {!editable ? (
          <>
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-foreground/60 via-transparent to-transparent p-6 opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="rounded-full bg-primary-foreground px-4 py-2 text-label text-foreground">
                Ver detalle
              </span>
            </div>
            {cart ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-foreground text-primary-foreground opacity-0 shadow-md transition group-hover:opacity-100 hover:scale-105"
                aria-label={`Agregar ${product.name} a la bolsa`}
              >
                <Plus className="size-4" aria-hidden />
              </button>
            ) : null}
          </>
        ) : null}

        {product.badge ? (
          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-label text-primary-foreground">
            {editable ? (
              <EditableText
                path={`products.${product.id}.badge`}
                value={product.badge}
              />
            ) : (
              product.badge
            )}
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-label text-muted-foreground">{product.categoryName}</p>
        {editable ? (
          <>
            <EditableText
              path={`products.${product.id}.name`}
              value={product.name}
              as="h3"
              className="mt-1 text-base font-medium"
            />
            <EditableText
              path={`products.${product.id}.description`}
              value={product.description}
              as="p"
              multiline
              className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground"
            />
            <EditableText
              path={`products.${product.id}.price`}
              value={String(product.price)}
              as="p"
              className="mt-3 text-base font-semibold"
            />
          </>
        ) : (
          <>
            <h3 className="mt-1 text-base font-medium">{product.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {product.description}
            </p>
            <p className="mt-3 text-base font-semibold">
              {formatPrice(product.price)}
            </p>
          </>
        )}
      </div>
    </article>
  );

  if (editable) {
    return (
      <div className={cn(index > 0 ? '' : '')} style={{ animationDelay: `${index * 80}ms` }}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/producto/${product.slug}`} className="block">
      {cardContent}
    </Link>
  );
};
