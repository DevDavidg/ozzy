import { Storefront } from '@/components/storefront/storefront';
import { fetchSiteData } from '@/lib/site-data';

export default async function Home() {
  const { data, isFallback } = await fetchSiteData();

  return <Storefront data={data} showFallbackBanner={isFallback} />;
}
