import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { fallbackSiteData } from '@/lib/fallback-data';
import {
  categorySchema,
  globalSettingsSchema,
  productSchema,
  sectionSchemaByKey,
} from '@/lib/validators';
import type { BagContent, EditableSection, FooterContent, GlobalSettings, SiteData, StoreProduct } from '@/lib/types';
import { normalizeFooterLinks } from '@/lib/store-links';

const fallbackBag: BagContent = {
  emptyTitle: 'Tu bolsa',
  emptyDescription: 'Tu bolsa está vacía. Empezá a explorar la colección.',
  emptyCta: 'Explorar colección',
  emptyCtaHref: '/tienda',
  checkoutCta: 'Finalizar compra',
  checkoutHref: '/#contacto',
};

const sectionTitles: Record<string, string> = {
  hero: 'Hero principal',
  ticker: 'Cinta de beneficios',
  categories: 'Categorías',
  featured: 'Productos destacados',
  campaign: 'Campaña',
  benefits: 'Beneficios',
  community: 'Comunidad',
  bag: 'Bolsa',
  footer: 'Footer',
};

const fallbackSettings: GlobalSettings = {
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
};

const parseJsonArray = (value: Prisma.JsonValue): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export type SiteDataResult = {
  data: SiteData;
  isFallback: boolean;
};

const logDatabaseError = (context: string, error: unknown) => {
  console.error(`[site-data] ${context}:`, error);
};

const normalizeSectionContent = (key: string, content: unknown) => {
  if (key === 'footer') {
    const footer = content as FooterContent;
    return {
      ...footer,
      shopLinks: normalizeFooterLinks(footer.shopLinks as unknown[], 'shop'),
      supportLinks: normalizeFooterLinks(footer.supportLinks as unknown[], 'support'),
    };
  }

  return content;
};

const buildSiteData = async (): Promise<SiteData> => {
  const [settingsRow, sections, categories, products] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { key: 'global' } }),
    prisma.pageSection.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  const settings = settingsRow
    ? globalSettingsSchema.catch(fallbackSettings).parse(settingsRow.value)
    : fallbackSettings;

  const sectionEntries = sections.map((section) => {
    const parser = sectionSchemaByKey[section.key as keyof typeof sectionSchemaByKey];
    const parsed = parser ? parser.parse(section.content) : section.content;
    const content = normalizeSectionContent(section.key, parsed);

    return [
      section.key,
      {
        id: section.id,
        key: section.key,
        title: section.title,
        sortOrder: section.sortOrder,
        isVisible: section.isVisible,
        content,
      },
    ] as const;
  });

  const normalizedProducts: StoreProduct[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    badge: product.badge,
    imageUrl: product.imageUrl,
    gallery: parseJsonArray(product.gallery),
    isFeatured: product.isFeatured,
    isVisible: product.isVisible,
    sortOrder: product.sortOrder,
    categoryId: product.categoryId,
    categoryName: product.category.name,
  }));

  return {
    settings,
    sections: {
      ...(Object.fromEntries(sectionEntries) as Record<string, EditableSection>),
      ...(!sectionEntries.some(([key]) => key === 'bag')
        ? {
            bag: {
              id: 'fallback-bag',
              key: 'bag',
              title: 'Bolsa',
              sortOrder: 8,
              isVisible: true,
              content: fallbackBag,
            },
          }
        : {}),
    },
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      sortOrder: category.sortOrder,
      isVisible: category.isVisible,
    })),
    products: normalizedProducts,
  };
};

export const fetchSiteData = async (): Promise<SiteDataResult> => {
  try {
    return {
      data: await buildSiteData(),
      isFallback: false,
    };
  } catch (error) {
    logDatabaseError('fetchSiteData', error);
    return {
      data: fallbackSiteData,
      isFallback: true,
    };
  }
};

export const getSiteData = async (): Promise<SiteData> => {
  const { data } = await fetchSiteData();
  return data;
};

export const saveGlobalSettings = async (settings: GlobalSettings) => {
  const value = globalSettingsSchema.parse(settings);

  return prisma.siteSettings.upsert({
    where: { key: 'global' },
    update: { value },
    create: { key: 'global', value },
  });
};

export const saveSectionContent = async (key: string, content: unknown) => {
  const parser = sectionSchemaByKey[key as keyof typeof sectionSchemaByKey];

  if (!parser) {
    throw new Error(`Unsupported section: ${key}`);
  }

  const value = parser.parse(content);

  return prisma.pageSection.upsert({
    where: { key },
    update: { content: value },
    create: {
      key,
      title: sectionTitles[key] ?? key,
      content: value,
      sortOrder: 99,
    },
  });
};

export const saveProduct = async (formData: FormData) => {
  const payload = productSchema.parse({
    id: formData.get('id')?.toString() || undefined,
    name: formData.get('name'),
    slug: formData.get('slug') || slugify(formData.get('name')?.toString() ?? ''),
    description: formData.get('description'),
    price: formData.get('price'),
    badge: formData.get('badge')?.toString() || null,
    imageUrl: formData.get('imageUrl'),
    isFeatured: formData.get('isFeatured') === 'on',
    isVisible: formData.get('isVisible') === 'on',
    sortOrder: formData.get('sortOrder'),
    categoryId: formData.get('categoryId'),
  });

  const data = {
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    price: payload.price,
    badge: payload.badge,
    imageUrl: payload.imageUrl,
    gallery: [payload.imageUrl],
    isFeatured: payload.isFeatured,
    isVisible: payload.isVisible,
    sortOrder: payload.sortOrder,
    categoryId: payload.categoryId,
  };

  if (!payload.id) {
    return prisma.product.create({ data });
  }

  return prisma.product.update({
    where: { id: payload.id },
    data,
  });
};

export const saveCategory = async (formData: FormData) => {
  const payload = categorySchema.parse({
    id: formData.get('id')?.toString() || undefined,
    name: formData.get('name'),
    slug: formData.get('slug') || slugify(formData.get('name')?.toString() ?? ''),
    sortOrder: formData.get('sortOrder'),
    isVisible: formData.get('isVisible') === 'on',
  });

  const data = {
    name: payload.name,
    slug: payload.slug,
    sortOrder: payload.sortOrder,
    isVisible: payload.isVisible,
  };

  if (!payload.id) {
    return prisma.category.create({ data });
  }

  return prisma.category.update({
    where: { id: payload.id },
    data,
  });
};

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product || !product.isVisible) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      badge: product.badge,
      imageUrl: product.imageUrl,
      gallery: parseJsonArray(product.gallery),
      isFeatured: product.isFeatured,
      isVisible: product.isVisible,
      sortOrder: product.sortOrder,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      categorySlug: product.category.slug,
    };
  } catch (error) {
    logDatabaseError(`getProductBySlug(${slug})`, error);
    return null;
  }
};

export const getCategoryBySlug = async (slug: string) => {
  try {
    const category = await prisma.category.findUnique({ where: { slug } });

    if (!category || !category.isVisible) {
      return null;
    }

    return category;
  } catch (error) {
    logDatabaseError(`getCategoryBySlug(${slug})`, error);
    return null;
  }
};

export const getVisibleProducts = async (categorySlug?: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isVisible: true,
        ...(categorySlug
          ? {
              category: {
                slug: categorySlug,
                isVisible: true,
              },
            }
          : {}),
      },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      badge: product.badge,
      imageUrl: product.imageUrl,
      gallery: parseJsonArray(product.gallery),
      isFeatured: product.isFeatured,
      isVisible: product.isVisible,
      sortOrder: product.sortOrder,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      categorySlug: product.category.slug,
    }));
  } catch (error) {
    logDatabaseError('getVisibleProducts', error);
    return [];
  }
};
