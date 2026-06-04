import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProductCard } from '@/components/storefront/product-card';
import { StoreShell } from '@/components/storefront/store-shell';
import { TemporaryUnavailable } from '@/components/storefront/temporary-unavailable';
import { getAccountNavProps } from '@/lib/account-nav';
import { fetchSiteData, getCategoryBySlug, getVisibleProducts } from '@/lib/site-data';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [{ data, isFallback }, category, products, accountNav] = await Promise.all([
    fetchSiteData(),
    getCategoryBySlug(slug),
    getVisibleProducts(slug),
    getAccountNavProps(),
  ]);

  if (!category) {
    if (isFallback) {
      return (
        <TemporaryUnavailable
          data={data}
          title="Categoría no disponible"
          description="No pudimos cargar esta categoría porque la base de datos no responde. Probá de nuevo en unos minutos."
        />
      );
    }

    notFound();
  }

  return (
    <StoreShell data={data} {...accountNav}>
      <div className="mx-auto max-w-7xl px-5 py-16">
        <nav aria-label="Miga de pan" className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="transition hover:text-foreground">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tienda" className="transition hover:text-foreground">
            Tienda
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>
        <h1 className="font-display text-4xl font-semibold">{category.name}</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Productos de la categoría {category.name.toLowerCase()}.
        </p>

        {products.length === 0 ? (
          <div className="mt-12">
            <p className="text-muted-foreground">No hay productos en esta categoría.</p>
            <Link
              href="/tienda"
              className="mt-4 inline-flex text-sm font-medium underline-offset-4 hover:underline"
            >
              Ver todos los productos
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  categoryName: product.categoryName,
                }}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </StoreShell>
  );
}
