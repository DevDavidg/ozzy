'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ reset }: ErrorProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#111] px-5 py-16 text-center text-white">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
        <AlertTriangle className="size-6" aria-hidden />
      </div>
      <h1 className="font-display mt-6 text-3xl font-semibold">Error en el panel</h1>
      <p className="mt-3 max-w-md leading-7 text-white/60">
        No pudimos conectar con la base de datos. Verificá que el servidor esté activo y que la
        variable DATABASE_URL sea correcta.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={reset}>
          <RefreshCw aria-hidden />
          Reintentar
        </Button>
        <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
          <Link href="/">Volver a la tienda</Link>
        </Button>
      </div>
    </main>
  );
}
