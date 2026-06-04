import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type AccountLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export const AccountLayout = ({ title, description, children }: AccountLayoutProps) => (
  <main className="min-h-screen bg-background px-5 py-12">
    <div className="mx-auto w-full max-w-md">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-label text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Volver a la tienda
      </Link>
      <h1 className="font-display mt-6 text-2xl font-semibold md:text-3xl">{title}</h1>
      <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
      <div className="mt-8 rounded-[1.5rem] border border-border bg-card/70 p-6 shadow-sm">
        {children}
      </div>
    </div>
  </main>
);
