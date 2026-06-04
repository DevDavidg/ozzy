import Link from 'next/link';

import { ProductCard } from '@/components/storefront/product-card';
import { StoreShell } from '@/components/storefront/store-shell';
import { TemporaryUnavailable } from '@/components/storefront/temporary-unavailable';
import { fetchSiteData, getVisibleProducts } from '@/lib/site-data';

export default async function TiendaPage() {
  const [{ data, isFallback }, products] = await Promise.all([
    fetchSiteData(),
    getVisibleProducts(),
  ]);

  if (isFallback) {
    return (
      <TemporaryUnavailable
        data={data}
        title="Tienda no disponible"
        description="No pudimos cargar el catálogo porque la base de datos no responde. Probá de nuevo en unos minutos."
      />
    );
  }

  return (
    <StoreShell data={data}>
      <div className="mx-auto max-w-7xl px-5 py-16">
        <nav aria-label="Miga de pan" className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="transition hover:text-foreground">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Tienda</span>
        </nav>
        <h1 className="font-display text-4xl font-semibold">Todos los productos</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Explorá la colección completa de piezas esenciales.
        </p>

        {products.length === 0 ? (
          <p className="mt-12 text-muted-foreground">No hay productos disponibles.</p>
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
