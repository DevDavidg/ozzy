import { Skeleton } from '@/components/ui/skeleton';
import { StoreShellSkeleton } from '@/components/storefront/skeletons/store-shell-skeleton';

type ProductGridSkeletonProps = {
  title?: boolean;
  count?: number;
};

export const ProductGridSkeleton = ({ title = true, count = 8 }: ProductGridSkeletonProps) => (
  <StoreShellSkeleton>
    <div className="mx-auto max-w-7xl px-5 py-16">
      <Skeleton className="mb-6 h-4 w-40" />
      {title ? (
        <>
          <Skeleton className="h-10 w-72 max-w-full" />
          <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        </>
      ) : null}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  </StoreShellSkeleton>
);
