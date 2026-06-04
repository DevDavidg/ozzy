import { notFound } from 'next/navigation';

import {
  ProductBackLink,
  ProductDetailClient,
} from '@/components/storefront/product-detail-client';
import { StoreShell } from '@/components/storefront/store-shell';
import { TemporaryUnavailable } from '@/components/storefront/temporary-unavailable';
import { getAccountNavProps } from '@/lib/account-nav';
import { fetchSiteData, getProductBySlug } from '@/lib/site-data';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [{ data, isFallback }, product, accountNav] = await Promise.all([
    fetchSiteData(),
    getProductBySlug(slug),
    getAccountNavProps(),
  ]);

  if (!product) {
    if (isFallback) {
      return (
        <TemporaryUnavailable
          data={data}
          title="Producto no disponible"
          description="No pudimos cargar este producto porque la base de datos no responde. Probá de nuevo en unos minutos."
        />
      );
    }

    notFound();
  }

  return (
    <StoreShell data={data} {...accountNav}>
      <div className="mx-auto max-w-7xl px-5 py-16">
        <ProductBackLink />
        <ProductDetailClient product={product} />
      </div>
    </StoreShell>
  );
}
