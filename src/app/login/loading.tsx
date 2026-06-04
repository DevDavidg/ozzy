import { Skeleton } from '@/components/ui/skeleton';

export default function LoginLoading() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden bg-foreground lg:block" aria-hidden />
      <section className="flex flex-col justify-center bg-background px-5 py-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <Skeleton className="size-12 rounded-2xl" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-full max-w-sm" />
          <div className="rounded-[1.5rem] border border-border p-6 space-y-4">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
