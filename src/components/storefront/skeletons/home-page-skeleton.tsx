import { Skeleton } from '@/components/ui/skeleton';
import { StoreShellSkeleton } from '@/components/storefront/skeletons/store-shell-skeleton';

export const HomePageSkeleton = () => (
  <StoreShellSkeleton>
    <section className="bg-hero">
      <div className="mx-auto grid min-h-[min(100svh,880px)] max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-24">
        <div className="space-y-6">
          <Skeleton className="h-4 w-40 bg-primary-foreground/20" />
          <Skeleton className="h-14 w-full max-w-lg bg-primary-foreground/20" />
          <Skeleton className="h-14 w-4/5 max-w-md bg-primary-foreground/15" />
          <Skeleton className="h-5 w-full max-w-xl bg-primary-foreground/15" />
          <Skeleton className="h-5 w-3/4 max-w-lg bg-primary-foreground/15" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-36 rounded-full bg-primary-foreground/20" />
            <Skeleton className="h-12 w-36 rounded-full bg-primary-foreground/15" />
          </div>
        </div>
        <Skeleton className="aspect-[4/5] w-full rounded-3xl bg-primary-foreground/15 md:aspect-[3/4]" />
      </div>
    </section>

    <section className="border-y border-border py-4">
      <Skeleton className="mx-auto h-4 w-96 max-w-full" />
    </section>

    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/5] rounded-2xl" />
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-56" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="aspect-[4/5] rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </section>
  </StoreShellSkeleton>
);
