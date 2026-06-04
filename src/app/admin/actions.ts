'use server';

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { destroySession, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  saveCategory,
  saveGlobalSettings,
  saveProduct,
  saveSectionContent,
  slugify,
} from '@/lib/site-data';
import type {
  BenefitsContent,
  CampaignContent,
  CommunityContent,
  FooterContent,
  GlobalSettings,
  HeaderContent,
  HeroContent,
  TickerContent,
} from '@/lib/types';

const revalidateStore = () => {
  revalidatePath('/');
  revalidatePath('/admin');
};

const splitLines = (value: FormDataEntryValue | null) =>
  value
    ?.toString()
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

export const updateSettingsAction = async (formData: FormData) => {
  await requireAdmin();

  const settings: GlobalSettings = {
    brandName: formData.get('brandName')?.toString() ?? '',
    instagram: formData.get('instagram')?.toString() ?? '',
    announcement: formData.get('announcement')?.toString() ?? '',
    navLinks: splitLines(formData.get('navLinks')).map((line) => {
      const [label = '', href = '#'] = line.split('|').map((item) => item.trim());
      return { label, href };
    }),
  };

  await saveGlobalSettings(settings);
  revalidateStore();
};

export const updateHeroAction = async (formData: FormData) => {
  await requireAdmin();

  const content: HeroContent = {
    eyebrow: formData.get('eyebrow')?.toString() ?? '',
    title: formData.get('title')?.toString() ?? '',
    description: formData.get('description')?.toString() ?? '',
    primaryCta: formData.get('primaryCta')?.toString() ?? '',
    secondaryCta: formData.get('secondaryCta')?.toString() ?? '',
    meta: formData.get('meta')?.toString() ?? '',
    counter: formData.get('counter')?.toString() ?? '',
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
  };

  await saveSectionContent('hero', content);
  revalidateStore();
};

export const updateTickerAction = async (formData: FormData) => {
  await requireAdmin();

  const content: TickerContent = {
    text: formData.get('text')?.toString() ?? '',
  };

  await saveSectionContent('ticker', content);
  revalidateStore();
};

export const updateHeaderSectionAction = async (key: 'categories' | 'featured', formData: FormData) => {
  await requireAdmin();

  const content: HeaderContent = {
    eyebrow: formData.get('eyebrow')?.toString() || undefined,
    heading: formData.get('heading')?.toString() ?? '',
    cta: formData.get('cta')?.toString() ?? '',
  };

  await saveSectionContent(key, content);
  revalidateStore();
};

export const updateCampaignAction = async (formData: FormData) => {
  await requireAdmin();

  const content: CampaignContent = {
    eyebrow: formData.get('eyebrow')?.toString() ?? '',
    heading: formData.get('heading')?.toString() ?? '',
    cta: formData.get('cta')?.toString() ?? '',
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
  };

  await saveSectionContent('campaign', content);
  revalidateStore();
};

export const updateBenefitsAction = async (formData: FormData) => {
  await requireAdmin();

  const content: BenefitsContent = {
    items: [0, 1, 2].map((index) => ({
      title: formData.get(`benefitTitle${index}`)?.toString() ?? '',
      description: formData.get(`benefitDescription${index}`)?.toString() ?? '',
    })),
  };

  await saveSectionContent('benefits', content);
  revalidateStore();
};

export const updateCommunityAction = async (formData: FormData) => {
  await requireAdmin();

  const content: CommunityContent = {
    eyebrow: formData.get('eyebrow')?.toString() ?? '',
    heading: formData.get('heading')?.toString() ?? '',
    description: formData.get('description')?.toString() ?? '',
    cta: formData.get('cta')?.toString() ?? '',
  };

  await saveSectionContent('community', content);
  revalidateStore();
};

export const updateFooterAction = async (formData: FormData) => {
  await requireAdmin();

  const content: FooterContent = {
    description: formData.get('description')?.toString() ?? '',
    shopLinks: splitLines(formData.get('shopLinks')),
    supportLinks: splitLines(formData.get('supportLinks')),
  };

  await saveSectionContent('footer', content);
  revalidateStore();
};

export const saveProductAction = async (formData: FormData) => {
  await requireAdmin();
  await saveProduct(formData);
  revalidateStore();
};

export const deleteProductAction = async (formData: FormData) => {
  await requireAdmin();
  const id = formData.get('id')?.toString();

  if (!id) {
    return;
  }

  await prisma.product.delete({ where: { id } });
  revalidateStore();
};

export const saveCategoryAction = async (formData: FormData) => {
  await requireAdmin();
  await saveCategory(formData);
  revalidateStore();
};

export const deleteCategoryAction = async (formData: FormData) => {
  await requireAdmin();
  const id = formData.get('id')?.toString();

  if (!id) {
    return;
  }

  const productCount = await prisma.product.count({ where: { categoryId: id } });

  if (productCount > 0) {
    return;
  }

  await prisma.category.delete({ where: { id } });
  revalidateStore();
};

export type UploadMediaResult = {
  ok: boolean;
  message?: string;
  url?: string;
};

const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;

export const uploadMediaAction = async (formData: FormData): Promise<UploadMediaResult> => {
  await requireAdmin();
  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: 'Seleccioná una imagen válida' };
  }

  if (!file.type.startsWith('image/')) {
    return { ok: false, message: 'Solo se permiten archivos de imagen' };
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return { ok: false, message: 'La imagen no puede superar 10 MB' };
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const extension = path.extname(file.name) || '.jpg';
    const safeName = `${Date.now()}-${slugify(path.basename(file.name, extension))}${extension}`;
    const uploadDirectory = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDirectory, safeName);
    const publicUrl = `/uploads/${safeName}`;

    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(filePath, bytes);
    await prisma.mediaAsset.create({
      data: {
        fileName: file.name,
        url: publicUrl,
        mimeType: file.type,
        size: file.size,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/manage');

    return { ok: true, url: publicUrl };
  } catch {
    return { ok: false, message: 'No se pudo subir la imagen. Revisá la base de datos y volvé a intentar.' };
  }
};

export const logoutAction = async () => {
  await destroySession();
  redirect('/login');
};
