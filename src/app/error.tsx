'use client';

import { StoreErrorFallback } from '@/components/storefront/store-error-fallback';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ reset }: ErrorProps) {
  return <StoreErrorFallback reset={reset} />;
}
