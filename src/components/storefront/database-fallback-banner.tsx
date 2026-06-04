import { AlertTriangle } from 'lucide-react';

export const DatabaseFallbackBanner = () => (
  <div
    role="status"
    className="border-b border-amber-200/80 bg-amber-50 px-5 py-3 text-sm text-amber-950"
  >
    <div className="mx-auto flex max-w-7xl items-start gap-3">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
      <p>
        No pudimos conectar con la base de datos. Estás viendo contenido de respaldo y el catálogo
        puede no estar disponible.
      </p>
    </div>
  </div>
);
