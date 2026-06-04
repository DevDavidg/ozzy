'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type NavLink = {
  label: string;
  href: string;
};

type MobileNavProps = {
  brandName: string;
  navLinks: NavLink[];
  loginHref: string;
  loginLabel: string;
};

export const MobileNav = ({
  brandName,
  navLinks,
  loginHref,
  loginLabel,
}: MobileNavProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleClose = () => setOpen(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="flex size-10 items-center justify-center rounded-full border border-foreground/15 transition hover:bg-foreground/5 md:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </button>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        onKeyDown={handleKeyDown}
      >
        <div
          className={cn(
            'absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden="true"
          onClick={handleClose}
        />
        <nav
          className={cn(
            'absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-background shadow-2xl transition-transform duration-300 ease-out',
            open ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-5">
            <span className="brand-wordmark text-base">{brandName}</span>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full transition hover:bg-foreground/5"
              aria-label="Cerrar menú"
              onClick={handleClose}
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <ul className="flex flex-1 flex-col gap-1 px-4 py-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-base font-medium transition hover:bg-muted"
                  onClick={handleClose}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-border p-5">
            <Link
              href={loginHref}
              className="flex w-full items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              onClick={handleClose}
            >
              {loginLabel}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};
