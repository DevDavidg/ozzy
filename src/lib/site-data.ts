import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import {
  categorySchema,
  globalSettingsSchema,
  productSchema,
  sectionSchemaByKey,
} from '@/lib/validators';
import type { EditableSection, GlobalSettings, SiteData, StoreProduct } from '@/lib/types';

const fallbackSettings: GlobalSettings = {
  brandName: 'Ozzy Gist',
  instagram: '@ozzygist',
  announcement:
    'Envío gratis desde $120.000 · Cambios sin cargo · Nueva colección — Otoño 26 · Pagá hasta en 6 cuotas',
  navLinks: [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Tienda', href: '#tienda' },
    { label: 'Contacto', href: '#contacto' },
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

export const getSiteData = async (): Promise<SiteData> => {
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
    const content = parser ? parser.parse(section.content) : section.content;

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
    sections: Object.fromEntries(sectionEntries) as Record<string, EditableSection>,
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

  return prisma.pageSection.update({
    where: { key },
    data: { content: value },
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
