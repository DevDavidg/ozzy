import type { EditableSection, SiteData } from '@/lib/types';

const fallbackSections: Record<string, EditableSection> = {
  hero: {
    id: 'fallback-hero',
    key: 'hero',
    title: 'Hero principal',
    sortOrder: 1,
    isVisible: true,
    content: {
      eyebrow: 'Colección Otoño / 26',
      title: 'Esenciales, construidos para durar.',
      description:
        'Una colección reducida de piezas pesadas, cortes caídos y paletas cálidas. Fabricado en cantidades limitadas.',
      primaryCta: 'Comprar ahora',
      primaryCtaHref: '/tienda',
      secondaryCta: 'Ver hoodies',
      secondaryCtaHref: '/categoria/hoodies',
      meta: 'Argentina · Envíos a todo el país',
      counter: '006 / 24',
      imageUrl:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80',
    },
  },
  ticker: {
    id: 'fallback-ticker',
    key: 'ticker',
    title: 'Cinta de beneficios',
    sortOrder: 2,
    isVisible: true,
    content: {
      text: 'Premium Heavyweight Cotton ✦ Made in Argentina ✦ Limited Quantities ✦ Designed to Last ✦',
    },
  },
  categories: {
    id: 'fallback-categories',
    key: 'categories',
    title: 'Categorías',
    sortOrder: 3,
    isVisible: true,
    content: {
      heading: 'Categorías',
      cta: 'Ver todo',
      ctaHref: '/tienda',
    },
  },
  featured: {
    id: 'fallback-featured',
    key: 'featured',
    title: 'Productos destacados',
    sortOrder: 4,
    isVisible: true,
    content: {
      eyebrow: 'Destacados',
      heading: 'Lo más buscado',
      cta: 'Ver todos',
      ctaHref: '/tienda',
    },
  },
  campaign: {
    id: 'fallback-campaign',
    key: 'campaign',
    title: 'Campaña',
    sortOrder: 5,
    isVisible: true,
    content: {
      eyebrow: 'Campaña 006',
      heading: 'Para los que se mueven sin apuro.',
      cta: 'Ver colección',
      ctaHref: '/tienda',
      imageUrl:
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=80',
    },
  },
  benefits: {
    id: 'fallback-benefits',
    key: 'benefits',
    title: 'Beneficios',
    sortOrder: 6,
    isVisible: true,
    content: {
      items: [
        {
          title: 'Envío gratis',
          description: 'En compras desde $120.000 a todo el país.',
        },
        {
          title: 'Cambios fáciles',
          description: '30 días para cambiar tu compra.',
        },
        {
          title: 'Compra protegida',
          description: 'Pago seguro vía Mercado Pago.',
        },
      ],
    },
  },
  community: {
    id: 'fallback-community',
    key: 'community',
    title: 'Comunidad',
    sortOrder: 7,
    isVisible: true,
    content: {
      eyebrow: '@ozzygist',
      heading: 'Comunidad',
      description:
        'Piezas esenciales para el día a día. Construidas con materiales premium en cantidades limitadas.',
      cta: 'Suscribirse',
      ctaHref: 'https://instagram.com/ozzygist',
    },
  },
  bag: {
    id: 'fallback-bag',
    key: 'bag',
    title: 'Bolsa',
    sortOrder: 8,
    isVisible: true,
    content: {
      emptyTitle: 'Tu bolsa',
      emptyDescription: 'Tu bolsa está vacía. Empezá a explorar la colección.',
      emptyCta: 'Explorar colección',
      emptyCtaHref: '/tienda',
      checkoutCta: 'Finalizar compra',
      checkoutHref: '/#contacto',
    },
  },
  footer: {
    id: 'fallback-footer',
    key: 'footer',
    title: 'Footer',
    sortOrder: 9,
    isVisible: true,
    content: {
      description:
        'Piezas esenciales para el día a día. Construidas con materiales premium en cantidades limitadas.',
      shopLinks: [
        { label: 'Todos', href: '/tienda' },
        { label: 'Hoodies', href: '/categoria/hoodies' },
        { label: 'Pantalones', href: '/categoria/pantalones' },
        { label: 'Remeras', href: '/categoria/remeras' },
      ],
      supportLinks: [
        { label: 'Contacto', href: '/#contacto' },
        { label: 'Envíos', href: '/tienda' },
        { label: 'Cambios y devoluciones', href: '/tienda' },
        { label: 'Guía de talles', href: '/tienda' },
      ],
    },
  },
};

export const fallbackSiteData: SiteData = {
  settings: {
    brandName: 'Ozzy Gist',
    instagram: '@ozzygist',
    announcement:
      'Envío gratis desde $120.000 · Cambios sin cargo · Nueva colección — Otoño 26 · Pagá hasta en 6 cuotas',
    navLinks: [
      { label: 'Inicio', href: '/#inicio' },
      { label: 'Tienda', href: '/tienda' },
      { label: 'Contacto', href: '/#contacto' },
      { label: 'Mi bolsa', href: '/bolsa' },
      { label: 'Mi cuenta', href: '/login' },
    ],
  },
  sections: fallbackSections,
  categories: [
    { id: 'fallback-cat-hoodies', name: 'Hoodies', slug: 'hoodies', sortOrder: 1, isVisible: true },
    { id: 'fallback-cat-pantalones', name: 'Pantalones', slug: 'pantalones', sortOrder: 2, isVisible: true },
    { id: 'fallback-cat-remeras', name: 'Remeras', slug: 'remeras', sortOrder: 3, isVisible: true },
    { id: 'fallback-cat-abrigos', name: 'Abrigos', slug: 'abrigos', sortOrder: 4, isVisible: true },
  ],
  products: [],
};
