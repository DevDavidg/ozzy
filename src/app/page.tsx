import { Storefront } from '@/components/storefront/storefront';
import { getAccountNavProps } from '@/lib/account-nav';
import { fetchSiteData } from '@/lib/site-data';

export default async function Home() {
  const [{ data, isFallback }, accountNav] = await Promise.all([
    fetchSiteData(),
    getAccountNavProps(),
  ]);

  return (
    <Storefront
      data={data}
      showFallbackBanner={isFallback}
      loginHref={accountNav.loginHref}
      loginLabel={accountNav.loginLabel}
    />
  );
}
