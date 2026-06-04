'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

type NavLink = {
  label: string;
  href: string;
};

type MobileNavProps = {
  brandName: string;
  navLinks: NavLink[];
  loginHref: string;
  loginLabel: string;
  cartCount?: number;
};

export const MobileNav = ({
  brandName,
  navLinks,
  loginHref,
  loginLabel,
  cartCount = 0,
}: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

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

  const menuOverlay = (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      aria-hidden={!open}
      className={cn(
        'fixed inset-0 z-[100] md:hidden',
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
          'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5 sm:py-5">
          <span className="brand-wordmark truncate text-base">{brandName}</span>
          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center rounded-full transition hover:bg-foreground/5"
            aria-label="Cerrar menú"
            onClick={handleClose}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6">
          {navLinks.map((link) => {
            const isBagLink = link.href === '/bolsa' || link.href === '#bolsa';

            return (
              <li key={`${link.label}-${link.href}`}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition hover:bg-muted"
                  onClick={handleClose}
                >
                  {link.label}
                  {isBagLink && cartCount > 0 ? (
                    <span className="rounded-full bg-foreground px-2 py-0.5 text-xs text-primary-foreground">
                      {cartCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-border p-4 sm:p-5">
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
  );

  return (
    <>
      <button
        type="button"
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full text-foreground transition hover:bg-muted md:hidden',
          open && 'invisible',
        )}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Abrir menú"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" aria-hidden />
      </button>

      {mounted ? createPortal(menuOverlay, document.body) : null}
    </>
  );
};
