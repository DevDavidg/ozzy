import { Skeleton } from '@/components/ui/skeleton';

export const StoreShellSkeleton = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background text-foreground">
    <Skeleton className="h-9 w-full rounded-none" />
    <header className="border-b border-border/80 bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
        <Skeleton className="h-5 w-28" />
        <div className="hidden items-center gap-8 md:flex">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="hidden h-9 w-28 rounded-full md:block" />
        </div>
      </div>
    </header>
    {children}
    <footer className="border-t border-border bg-foreground text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-5 w-32 bg-primary-foreground/20" />
          <Skeleton className="h-4 w-full max-w-sm bg-primary-foreground/15" />
          <Skeleton className="h-4 w-3/4 max-w-xs bg-primary-foreground/15" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-20 bg-primary-foreground/20" />
          <Skeleton className="h-3 w-24 bg-primary-foreground/15" />
          <Skeleton className="h-3 w-28 bg-primary-foreground/15" />
          <Skeleton className="h-3 w-24 bg-primary-foreground/15" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-24 bg-primary-foreground/20" />
          <Skeleton className="h-3 w-28 bg-primary-foreground/15" />
          <Skeleton className="h-3 w-32 bg-primary-foreground/15" />
          <Skeleton className="h-3 w-24 bg-primary-foreground/15" />
        </div>
      </div>
    </footer>
  </div>
);
