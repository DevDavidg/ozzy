import type { NavigationLink } from '@/lib/types';

export const isExternalHref = (href: string) =>
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:');

export const slugifyLabel = (label: string) =>
  label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const SHOP_LINK_DEFAULTS: Record<string, string> = {
  todos: '/tienda',
  hoodies: '/categoria/hoodies',
  pantalones: '/categoria/pantalones',
  remeras: '/categoria/remeras',
  abrigos: '/categoria/abrigos',
  accesorios: '/tienda',
};

const SUPPORT_LINK_DEFAULTS: Record<string, string> = {
  contacto: '/#contacto',
  envios: '/tienda',
  'cambios y devoluciones': '/tienda',
  'guia de talles': '/tienda',
};

export const inferShopLinkHref = (label: string) => {
  const key = label.toLowerCase().trim();
  return SHOP_LINK_DEFAULTS[key] ?? `/categoria/${slugifyLabel(label)}`;
};

export const inferSupportLinkHref = (label: string) => {
  const key = label.toLowerCase().trim();
  return SUPPORT_LINK_DEFAULTS[key] ?? '/#contacto';
};

export const normalizeFooterLinks = (
  links: unknown[],
  type: 'shop' | 'support',
): NavigationLink[] =>
  links.map((item) => {
    if (typeof item === 'string') {
      return {
        label: item,
        href: type === 'shop' ? inferShopLinkHref(item) : inferSupportLinkHref(item),
      };
    }

    const link = item as NavigationLink;
    return {
      label: link.label,
      href: link.href,
    };
  });
