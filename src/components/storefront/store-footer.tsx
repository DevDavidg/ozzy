import { AtSign, Package } from 'lucide-react';

import { EditableText } from '@/components/admin/editor/editable-text';
import { isExternalHref } from '@/lib/store-links';
import type { FooterContent, GlobalSettings, NavigationLink } from '@/lib/types';
import Link from 'next/link';

type StoreFooterProps = {
  settings: GlobalSettings;
  footer: FooterContent;
  editable?: boolean;
};

export const StoreFooter = ({
  settings,
  footer,
  editable = false,
}: StoreFooterProps) => (
  <footer className="border-t border-border bg-foreground px-6 py-16 text-primary-foreground">
    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
      <div>
        {editable ? (
          <EditableText
            path="settings.brandName"
            value={settings.brandName}
            as="h2"
            className="brand-wordmark text-2xl"
          />
        ) : (
          <h2 className="brand-wordmark text-2xl">{settings.brandName}</h2>
        )}
        {editable ? (
          <EditableText
            path="sections.footer.description"
            value={footer.description}
            as="p"
            multiline
            className="mt-4 max-w-sm leading-7 text-secondary"
          />
        ) : (
          <p className="mt-4 max-w-sm leading-7 text-secondary">{footer.description}</p>
        )}
        <a
          href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-secondary transition hover:text-primary-foreground"
          aria-label={`Instagram ${settings.instagram}`}
        >
          <AtSign className="size-4" aria-hidden />
          {settings.instagram}
        </a>
      </div>
      <FooterList
        title="Tienda"
        items={footer.shopLinks}
        prefix="sections.footer.shopLinks"
        editable={editable}
      />
      <FooterList
        title="Soporte"
        items={footer.supportLinks}
        prefix="sections.footer.supportLinks"
        editable={editable}
      />
    </div>
    <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-secondary">
      <span className="inline-flex items-center gap-2">
        <Package className="size-4 shrink-0" aria-hidden />
        © 2026 {settings.brandName}. Todos los derechos reservados.
      </span>
      {editable ? (
        <EditableText
          path="settings.instagram"
          value={settings.instagram}
          as="span"
        />
      ) : (
        <span>{settings.instagram}</span>
      )}
    </div>
  </footer>
);

const FooterList = ({
  title,
  items,
  prefix,
  editable,
}: {
  title: string;
  items: NavigationLink[];
  prefix: string;
  editable: boolean;
}) => (
  <div>
    <h3 className="text-label text-secondary">{title}</h3>
    <ul className="mt-4 space-y-3 text-secondary">
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`}>
          {editable ? (
            <div className="space-y-1">
              <EditableText
                path={`${prefix}.${index}.label`}
                value={item.label}
                as="span"
              />
              <EditableText
                path={`${prefix}.${index}.href`}
                value={item.href}
                as="span"
                className="block text-xs opacity-60"
              />
            </div>
          ) : (
            <FooterLink item={item} />
          )}
        </li>
      ))}
    </ul>
  </div>
);

const FooterLink = ({ item }: { item: NavigationLink }) => {
  if (isExternalHref(item.href)) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="transition hover:text-primary-foreground"
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link href={item.href} className="transition hover:text-primary-foreground">
      {item.label}
    </Link>
  );
};
