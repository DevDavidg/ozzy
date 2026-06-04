import { Skeleton } from '@/components/ui/skeleton';
import { StoreShellSkeleton } from '@/components/storefront/skeletons/store-shell-skeleton';

export const ProductDetailSkeleton = () => (
  <StoreShellSkeleton>
    <div className="mx-auto max-w-7xl px-5 py-16">
      <Skeleton className="mb-8 h-4 w-32" />
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-3/4 max-w-md" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="mt-6 flex items-center gap-4">
            <Skeleton className="h-11 w-32 rounded-full" />
            <Skeleton className="h-11 flex-1 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </StoreShellSkeleton>
);
