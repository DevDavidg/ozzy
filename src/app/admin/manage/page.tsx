import Link from 'next/link';
import { ArrowLeft, Paintbrush } from 'lucide-react';

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
    <main className="min-h-screen bg-[#f5efe6] px-5 py-8 text-[#17120d]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8b5e34]">
              Panel de gestión
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">{data.settings.brandName}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5d5146]">
              Formularios clásicos para productos, contenido e imágenes. Para editar la tienda en
              vivo, usá el canvas editable.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin">
              <ArrowLeft aria-hidden />
              Volver al canvas
            </Link>
          </Button>
        </header>

        <div className="mb-10 flex items-center gap-2 rounded-2xl border border-[#17120d]/10 bg-white/60 px-4 py-3 text-sm text-[#5d5146]">
          <Paintbrush className="size-4 shrink-0 text-[#8b5e34]" aria-hidden />
          Tip: los cambios en formularios se reflejan al recargar la tienda publicada.
        </div>

        <div className="grid gap-8">
          <MediaManager assets={assets} />
          <ProductForms data={data} />
          <ContentForms data={data} />
        </div>
      </div>
    </main>
  );
}
