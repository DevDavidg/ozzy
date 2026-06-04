'use client';

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import { EditableText } from '@/components/admin/editor/editable-text';
import { MobileNav } from '@/components/storefront/mobile-nav';
import { useCartOptional } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import type { GlobalSettings } from '@/lib/types';

type StoreHeaderProps = {
  settings: GlobalSettings;
  editable?: boolean;
  loginHref?: string;
  loginLabel?: string;
};

export const StoreHeader = ({
  settings,
  editable = false,
  loginHref = '/login',
  loginLabel = 'Iniciar sesión',
}: StoreHeaderProps) => {
  const cart = useCartOptional();
  const itemCount = cart?.itemCount ?? 0;

  return (
    <>
      <section
        className="overflow-hidden border-b border-border bg-foreground py-2 text-label text-primary-foreground/90"
        aria-label="Anuncios"
      >
        <div className="marquee-track flex min-w-max gap-8 whitespace-nowrap">
          {editable ? (
            <>
              <EditableText
                path="settings.announcement"
                value={settings.announcement}
              />
              <EditableText
                path="settings.announcement"
                value={settings.announcement}
              />
            </>
          ) : (
            <>
              <span>{settings.announcement}</span>
              <span>{settings.announcement}</span>
            </>
          )}
        </div>
      </section>

      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-lg">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5"
        >
          {editable ? (
            <EditableText
              path="settings.brandName"
              value={settings.brandName}
              as="span"
              className="brand-wordmark text-base md:text-lg"
            />
          ) : (
            <Link
              href="/"
              className="brand-wordmark text-base transition hover:opacity-60 md:text-lg"
            >
              {settings.brandName}
            </Link>
          )}

          <div className="hidden items-center gap-10 text-sm font-normal text-muted-foreground md:flex">
            {settings.navLinks.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/bolsa"
              className="relative hidden size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground sm:flex"
              aria-label={`Ver bolsa${itemCount > 0 ? `, ${itemCount} productos` : ''}`}
            >
              <ShoppingBag className="size-4" aria-hidden />
              {itemCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-primary-foreground">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              ) : null}
            </Link>
            <Link
              href={loginHref}
              className={cn(
                'hidden rounded-full px-5 py-2 text-sm font-medium transition md:inline-flex',
                editable
                  ? 'bg-foreground text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {loginLabel}
            </Link>
            <MobileNav
              brandName={settings.brandName}
              navLinks={settings.navLinks}
              loginHref={loginHref}
              loginLabel={loginLabel}
              cartCount={itemCount}
            />
          </div>
        </nav>
      </header>
    </>
  );
};
