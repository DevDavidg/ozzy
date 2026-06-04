import Link from 'next/link';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/admin/login-form';
import { getCurrentUser } from '@/lib/auth';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/admin');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5efe6] px-5 py-12 text-[#17120d]">
      <section className="w-full max-w-md rounded-[2rem] border border-[#17120d]/10 bg-white/65 p-8 shadow-2xl shadow-[#17120d]/10">
        <Link href="/" className="text-sm font-bold uppercase tracking-[0.24em] text-[#8b5e34]">
          Ozzy Gist
        </Link>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.05em]">Panel editable</h1>
        <p className="mt-3 leading-7 text-[#5d5146]">
          Iniciá sesión para cambiar productos, imágenes, precios, textos y secciones de la
          tienda local.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
