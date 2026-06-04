'use server';

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth';
import { applyPathToSiteData } from '@/lib/editor-paths';
import { prisma } from '@/lib/db';
import {
  saveCategory,
  saveGlobalSettings,
  saveProduct,
  saveSectionContent,
  slugify,
} from '@/lib/site-data';
import type { SiteData } from '@/lib/types';

const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;

const revalidateStore = () => {
  revalidatePath('/');
  revalidatePath('/admin');
};

const persistSiteDataPatch = async (data: SiteData, editorPath: string) => {
  const parts = editorPath.split('.');

  if (parts[0] === 'settings') {
    await saveGlobalSettings(data.settings);
    return;
  }

  if (parts[0] === 'sections') {
    const sectionKey = parts[1];
    const section = data.sections[sectionKey];

    if (section) {
      await saveSectionContent(sectionKey, section.content);
    }

    return;
  }

  if (parts[0] === 'products') {
    const productId = parts[1];
    const product = data.products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    const formData = new FormData();
    formData.set('id', product.id);
    formData.set('name', product.name);
    formData.set('slug', product.slug);
    formData.set('description', product.description);
    formData.set('price', String(product.price));
    formData.set('badge', product.badge ?? '');
    formData.set('imageUrl', product.imageUrl);
    formData.set('categoryId', product.categoryId);
    formData.set('sortOrder', String(product.sortOrder));

    if (product.isFeatured) {
      formData.set('isFeatured', 'on');
    }

    if (product.isVisible) {
      formData.set('isVisible', 'on');
    }

    await saveProduct(formData);
    return;
  }

  if (parts[0] === 'categories') {
    const categoryId = parts[1];
    const category = data.categories.find((item) => item.id === categoryId);

    if (!category) {
      return;
    }

    const formData = new FormData();
    formData.set('id', category.id);
    formData.set('name', category.name);
    formData.set('slug', category.slug);
    formData.set('sortOrder', String(category.sortOrder));

    if (category.isVisible) {
      formData.set('isVisible', 'on');
    }

    await saveCategory(formData);
  }
};

export type PatchResult = {
  ok: boolean;
  message?: string;
};

export const patchEditorFieldAction = async (
  editorPath: string,
  value: string | number,
  snapshot: SiteData,
): Promise<PatchResult> => {
  await requireAdmin();

  try {
    const nextData = applyPathToSiteData(snapshot, editorPath, value);
    await persistSiteDataPatch(nextData, editorPath);
    revalidateStore();
    return { ok: true };
  } catch {
    return { ok: false, message: 'No se pudo guardar el cambio.' };
  }
};

export type UploadResult = {
  ok: boolean;
  url?: string;
  message?: string;
};

export const uploadEditorImageAction = async (formData: FormData): Promise<UploadResult> => {
  await requireAdmin();

  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: 'Archivo inválido.' };
  }

  if (!file.type.startsWith('image/')) {
    return { ok: false, message: 'Solo se permiten imágenes.' };
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return { ok: false, message: 'La imagen no puede superar 10 MB.' };
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

    return { ok: true, url: publicUrl };
  } catch {
    return { ok: false, message: 'No se pudo subir la imagen. Revisá la base de datos y volvé a intentar.' };
  }
};
