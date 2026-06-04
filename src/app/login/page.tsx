import { ArrowLeft, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/admin/login-form';
import { UserRole } from '@prisma/client';

import { getCurrentUser } from '@/lib/auth';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user?.role === UserRole.ADMIN) {
    redirect('/admin');
  }

  if (user?.role === UserRole.CUSTOMER) {
    redirect('/cuenta');
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/70 to-foreground/40" aria-hidden="true" />
        <div className="relative z-10 p-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-label text-secondary transition hover:text-primary-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Volver a la tienda
          </Link>
        </div>
        <div className="relative z-10 p-10">
          <p className="text-label text-white/60">
            <Sparkles className="mr-2 inline size-3.5" aria-hidden />
            Panel editable
          </p>
          <h1 className="font-display mt-6 max-w-md text-4xl font-semibold leading-tight text-primary-foreground md:text-5xl">
            Editá tu tienda en vivo
          </h1>
          <p className="mt-4 max-w-sm leading-7 text-secondary">
            Cambiá productos, imágenes, precios y textos sin tocar código.
          </p>
        </div>
      </section>

      <section className="flex flex-col justify-center bg-background px-5 py-12">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-label text-muted-foreground lg:hidden"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Ozzy Gist
          </Link>
          <div className="mt-6 flex size-12 items-center justify-center rounded-2xl bg-muted text-accent lg:mt-0">
            <Lock className="size-5" aria-hidden />
          </div>
          <h2 className="font-display mt-5 text-2xl font-semibold md:text-3xl">
            Iniciar sesión
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Accedé al panel para gestionar la tienda local.
          </p>
          <div className="mt-8 rounded-[1.5rem] border border-border bg-card/70 p-6 shadow-sm">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
