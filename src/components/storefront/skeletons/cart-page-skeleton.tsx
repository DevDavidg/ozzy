import { Skeleton } from '@/components/ui/skeleton';
import { StoreShellSkeleton } from '@/components/storefront/skeletons/store-shell-skeleton';

export const CartPageSkeleton = () => (
  <StoreShellSkeleton>
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Skeleton className="mb-6 h-4 w-36" />
      <Skeleton className="h-10 w-48" />
      <div className="mt-12 space-y-6 rounded-2xl border border-border p-6">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-11 w-44 rounded-full" />
      </div>
    </div>
  </StoreShellSkeleton>
);
