'use client';

import { StoreErrorFallback } from '@/components/storefront/store-error-fallback';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CategoryError({ reset }: ErrorProps) {
  return (
    <StoreErrorFallback
      reset={reset}
      title="No pudimos cargar la categoría"
      description="Ocurrió un error al obtener los productos de esta categoría. Probá de nuevo en unos minutos."
    />
  );
}
