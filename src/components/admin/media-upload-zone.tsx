'use client';

import { Upload } from 'lucide-react';
import { useCallback, useTransition } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { uploadMediaAction } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const MediaUploadZone = () => {
  const [isPending, startTransition] = useTransition();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.set('file', file);

    startTransition(async () => {
      const result = await uploadMediaAction(formData);

      if (result.ok) {
        toast.success('Imagen subida correctamente');
        return;
      }

      toast.error(result.message ?? 'Error al subir imagen');
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: isPending,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'cursor-pointer rounded-[1.25rem] border-2 border-dashed p-8 text-center transition-colors',
        isDragActive && !isDragReject && 'border-[#8b5e34] bg-[#f0dfc9]/50',
        isDragReject && 'border-red-500 bg-red-50',
        !isDragActive && 'border-[#17120d]/20 hover:border-[#8b5e34]/50 hover:bg-white/50',
        isPending && 'pointer-events-none opacity-60',
      )}
    >
      <input {...getInputProps()} aria-label="Subir imagen" />
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#17120d]/5">
        <Upload className="size-5 text-[#8b5e34]" aria-hidden />
      </div>
      <p className="mt-4 text-sm font-bold text-[#17120d]">
        {isPending ? 'Subiendo...' : isDragActive ? 'Soltá la imagen aquí' : 'Arrastrá una imagen o hacé click'}
      </p>
      <p className="mt-1 text-xs text-[#5d5146]">PNG, JPG, WebP — se guarda en /uploads</p>
      <Button type="button" variant="secondary" size="sm" className="mt-4" disabled={isPending}>
        {isPending ? 'Subiendo...' : 'Elegir archivo'}
      </Button>
    </div>
  );
};
