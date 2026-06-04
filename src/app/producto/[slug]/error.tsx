'use client';

import { StoreErrorFallback } from '@/components/storefront/store-error-fallback';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProductError({ reset }: ErrorProps) {
  return (
    <StoreErrorFallback
      reset={reset}
      title="No pudimos cargar el producto"
      description="Ocurrió un error al obtener los datos del producto. Probá de nuevo en unos minutos."
    />
  );
}
