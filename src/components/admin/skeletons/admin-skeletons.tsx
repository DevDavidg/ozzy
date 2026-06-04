import { Skeleton } from '@/components/ui/skeleton';

export const AdminCanvasSkeleton = () => (
  <main className="min-h-screen bg-[#111]">
    <div className="border-b border-white/10 px-5 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Skeleton className="h-5 w-40 bg-white/10" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-full bg-white/10" />
          <Skeleton className="h-9 w-28 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
    <div className="mx-auto max-w-7xl px-5 py-8">
      <Skeleton className="aspect-[16/9] w-full rounded-2xl bg-white/10" />
    </div>
  </main>
);

export const AdminManageSkeleton = () => (
  <main className="min-h-screen bg-background">
    <div className="border-b border-border bg-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32 bg-primary-foreground/20" />
          <Skeleton className="h-9 w-48 bg-primary-foreground/20" />
        </div>
        <Skeleton className="h-10 w-40 rounded-full bg-primary-foreground/15" />
      </div>
    </div>
    <div className="mx-auto max-w-6xl px-5 py-8">
      <Skeleton className="mb-8 h-16 w-full rounded-2xl" />
      <Skeleton className="mb-6 h-10 w-72 rounded-full" />
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    </div>
  </main>
);
