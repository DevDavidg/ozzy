import Link from 'next/link';
import { ArrowLeft, BarChart3, Sparkles } from 'lucide-react';

import { CommerceDashboard } from '@/components/admin/commerce-dashboard';
import { Button } from '@/components/ui/button';
import { requireAdmin } from '@/lib/auth';
import { getAdminOrders, getCommerceStats } from '@/lib/orders';
import { getSiteData } from '@/lib/site-data';

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [data, stats, orders] = await Promise.all([
    getSiteData(),
    getCommerceStats(),
    getAdminOrders(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-foreground text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-secondary">
              <Sparkles className="size-3.5" aria-hidden />
              Dashboard comercial
            </p>
            <h1 className="font-display mt-1 flex items-center gap-2 text-3xl font-black tracking-[-0.05em] md:text-4xl">
              <BarChart3 className="size-8" aria-hidden />
              {data.settings.brandName}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-foreground"
            >
              <Link href="/admin/manage">
                <ArrowLeft aria-hidden />
                Gestión CMS
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-foreground"
            >
              <Link href="/admin">Canvas</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <CommerceDashboard stats={stats} orders={orders} products={data.products} />
      </div>
    </main>
  );
}
