import { Storefront } from '@/components/storefront/storefront';
import { getSiteData } from '@/lib/site-data';

export default async function Home() {
  const data = await getSiteData();

  return <Storefront data={data} />;
}
