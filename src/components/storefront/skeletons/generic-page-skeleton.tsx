import { Skeleton } from '@/components/ui/skeleton';
import { StoreShellSkeleton } from '@/components/storefront/skeletons/store-shell-skeleton';

export const GenericPageSkeleton = () => (
  <StoreShellSkeleton>
    <div className="mx-auto max-w-7xl px-5 py-16">
      <Skeleton className="h-10 w-64 max-w-full" />
      <Skeleton className="mt-4 h-5 w-96 max-w-full" />
      <Skeleton className="mt-12 h-64 w-full rounded-2xl" />
    </div>
  </StoreShellSkeleton>
);
