'use client';

import { StoreErrorFallback } from '@/components/storefront/store-error-fallback';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TiendaError({ reset }: ErrorProps) {
  return (
    <StoreErrorFallback
      reset={reset}
      title="No pudimos cargar la tienda"
      description="Ocurrió un error al obtener el catálogo. Si el problema persiste, puede ser un fallo temporal de la base de datos."
    />
  );
}
