import Link from 'next/link';
import { ArrowLeft, Paintbrush, Sparkles } from 'lucide-react';

import { AdminTabs } from '@/components/admin/admin-tabs';
import { ContentForms } from '@/components/admin/content-forms';
import { MediaManager } from '@/components/admin/media-manager';
import { ProductForms } from '@/components/admin/product-forms';
import { Button } from '@/components/ui/button';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getSiteData } from '@/lib/site-data';

export default async function AdminManagePage() {
  await requireAdmin();
  const [data, assets] = await Promise.all([
    getSiteData(),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-foreground text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-secondary">
              <Sparkles className="size-3.5" aria-hidden />
              Panel de gestión
            </p>
            <h1 className="font-display mt-1 text-3xl font-black tracking-[-0.05em] md:text-4xl">
              {data.settings.brandName}
            </h1>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-foreground"
          >
            <Link href="/admin">
              <ArrowLeft aria-hidden />
              Volver al canvas
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-border bg-muted/50 px-4 py-3.5 text-sm text-muted-foreground">
          <Paintbrush className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <p>
            Tip: los cambios en formularios se reflejan al recargar la tienda publicada. Para editar
            en vivo, usá el{' '}
            <Link href="/admin" className="font-bold text-accent underline-offset-2 hover:underline">
              canvas editable
            </Link>
            .
          </p>
        </div>

        <AdminTabs
          media={<MediaManager assets={assets} />}
          products={<ProductForms data={data} />}
          content={<ContentForms data={data} />}
        />
      </div>
    </main>
  );
}
