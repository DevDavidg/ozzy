'use client';

import { upload } from '@vercel/blob/client';

import { registerMediaAssetAction, uploadMediaAction } from '@/app/admin/actions';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const SERVER_ACTION_MAX_BYTES = 4 * 1024 * 1024;

export type UploadImageResult = {
  ok: boolean;
  url?: string;
  message?: string;
};

export const uploadImageClient = async (file: File): Promise<UploadImageResult> => {
  if (file.size === 0) {
    return { ok: false, message: 'Seleccioná una imagen válida.' };
  }

  if (!file.type.startsWith('image/')) {
    return { ok: false, message: 'Solo se permiten archivos de imagen.' };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: 'La imagen no puede superar 10 MB.' };
  }

  const shouldUseDirectUpload =
    process.env.NODE_ENV === 'production' || file.size > SERVER_ACTION_MAX_BYTES;

  if (shouldUseDirectUpload) {
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      const registered = await registerMediaAssetAction({
        url: blob.url,
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
      });

      if (!registered.ok) {
        return { ok: false, message: registered.message ?? 'No se pudo registrar la imagen.' };
      }

      return { ok: true, url: blob.url };
    } catch {
      if (process.env.NODE_ENV === 'production') {
        return {
          ok: false,
          message:
            'No se pudo subir la imagen. Activá Vercel Blob en el proyecto y agregá BLOB_READ_WRITE_TOKEN.',
        };
      }
    }
  }

  if (file.size > SERVER_ACTION_MAX_BYTES) {
    return {
      ok: false,
      message: 'En local, las imágenes mayores a 4 MB requieren Vercel Blob configurado.',
    };
  }

  const formData = new FormData();
  formData.set('file', file);
  return uploadMediaAction(formData);
};
