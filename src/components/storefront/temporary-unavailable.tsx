import { Database, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import { StoreShell } from '@/components/storefront/store-shell';
import { Button } from '@/components/ui/button';
import { getAccountNavProps } from '@/lib/account-nav';
import type { SiteData } from '@/lib/types';

type TemporaryUnavailableProps = {
  data: SiteData;
  title?: string;
  description?: string;
};

export const TemporaryUnavailable = async ({
  data,
  title = 'Contenido no disponible',
  description = 'No pudimos cargar esta página porque la base de datos no responde. Probá de nuevo en unos minutos.',
}: TemporaryUnavailableProps) => {
  const accountNav = await getAccountNavProps();

  return (
    <StoreShell data={data} showFallbackBanner {...accountNav}>
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Database className="size-6" aria-hidden />
        </div>
        <h1 className="font-display mt-6 text-3xl font-semibold">{title}</h1>
        <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">
              <RefreshCw aria-hidden />
              Volver al inicio
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tienda">Ir a la tienda</Link>
          </Button>
        </div>
      </div>
    </StoreShell>
  );
};
