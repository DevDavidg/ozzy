'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth';
import { applyPathToSiteData } from '@/lib/editor-paths';
import {
  getSiteData,
  saveCategory,
  saveGlobalSettings,
  saveProduct,
  saveSectionContent,
} from '@/lib/site-data';
import type { SiteData } from '@/lib/types';

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
): Promise<PatchResult> => {
  await requireAdmin();

  try {
    const currentData = await getSiteData();
    const nextData = applyPathToSiteData(currentData, editorPath, value);
    await persistSiteDataPatch(nextData, editorPath);
    revalidateStore();
    return { ok: true };
  } catch {
    return { ok: false, message: 'No se pudo guardar el cambio.' };
  }
};

