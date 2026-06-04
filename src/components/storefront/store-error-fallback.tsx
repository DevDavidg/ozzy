'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

type StoreErrorFallbackProps = {
  reset: () => void;
  title?: string;
  description?: string;
};

export const StoreErrorFallback = ({
  reset,
  title = 'Algo salió mal',
  description = 'Ocurrió un error al cargar la tienda. Si el problema persiste, puede ser un fallo temporal de la base de datos.',
}: StoreErrorFallbackProps) => (
  <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-16 text-center">
    <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
      <AlertTriangle className="size-6" aria-hidden />
    </div>
    <h1 className="font-display mt-6 text-3xl font-semibold">{title}</h1>
    <p className="mt-3 max-w-md leading-7 text-muted-foreground">{description}</p>
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Button type="button" onClick={reset}>
        <RefreshCw aria-hidden />
        Reintentar
      </Button>
      <Button asChild variant="outline">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  </main>
);
