import Link from 'next/link';

import { CartView } from '@/components/storefront/cart-view';
import { StoreShell } from '@/components/storefront/store-shell';
import { getAccountNavProps } from '@/lib/account-nav';
import { fetchSiteData } from '@/lib/site-data';
import type { BagContent } from '@/lib/types';

export default async function BolsaPage() {
  const [{ data, isFallback }, accountNav] = await Promise.all([
    fetchSiteData(),
    getAccountNavProps(),
  ]);
  const bag = data.sections.bag?.content as BagContent;

  return (
    <StoreShell data={data} showFallbackBanner={isFallback} {...accountNav}>
      <div className="mx-auto max-w-3xl px-5 py-16">
        <nav aria-label="Miga de pan" className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="transition hover:text-foreground">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Mi bolsa</span>
        </nav>
        <CartView bag={bag} />
      </div>
    </StoreShell>
  );
}
