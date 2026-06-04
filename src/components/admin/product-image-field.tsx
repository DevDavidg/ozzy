'use client';

import { ImagePlus, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useId, useState, useTransition } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { uploadImageClient } from '@/lib/upload-image-client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type ProductImageFieldProps = {
  name?: string;
  defaultValue?: string;
  label?: string;
};

export const ProductImageField = ({
  name = 'imageUrl',
  defaultValue = '',
  label = 'Imagen principal',
}: ProductImageFieldProps) => {
  const inputId = useId();
  const dropzoneId = useId();
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  const handleUpload = useCallback((file: File) => {
    startTransition(async () => {
      const result = await uploadImageClient(file);

      if (result.ok && result.url) {
        setImageUrl(result.url);
        toast.success('Imagen subida correctamente');
        return;
      }

      toast.error(result.message ?? 'Error al subir imagen');
    });
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        return;
      }
      handleUpload(file);
    },
    [handleUpload],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: isPending,
    noClick: true,
    noKeyboard: true,
  });

  const hasPreview = imageUrl.trim().length > 0;
  const isLocalUpload = imageUrl.startsWith('/uploads/');
  const isExternalUrl = imageUrl.startsWith('http');

  return (
    <div className="space-y-3">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-accent">{label}</span>

      <div
        {...getRootProps({
          id: dropzoneId,
          'aria-labelledby': inputId,
          'aria-describedby': `${dropzoneId}-hint`,
        })}
        className={cn(
          'relative overflow-hidden rounded-[1.25rem] border-2 border-dashed transition-colors',
          isDragActive && !isDragReject && 'border-[#8b5e34] bg-[#f0dfc9]/50',
          isDragReject && 'border-red-500 bg-red-50',
          !isDragActive && 'border-[#17120d]/20 hover:border-[#8b5e34]/50',
          isPending && 'pointer-events-none opacity-70',
        )}
      >
        <input {...getInputProps()} aria-label="Subir imagen del producto" />

        {hasPreview ? (
          <div className="relative aspect-[4/3] w-full bg-muted/30">
            <Image
              src={imageUrl}
              alt="Vista previa del producto"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={isLocalUpload || isExternalUrl}
            />
            <div
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#17120d]/55 px-4 text-center transition-opacity',
                isDragActive || isPending ? 'opacity-100' : 'opacity-0 hover:opacity-100 focus-within:opacity-100',
              )}
            >
              {isPending ? (
                <Loader2 className="size-8 animate-spin text-white" aria-hidden />
              ) : (
                <Upload className="size-8 text-white" aria-hidden />
              )}
              <p className="text-sm font-bold text-white">
                {isPending
                  ? 'Subiendo...'
                  : isDragActive
                    ? 'Soltá para reemplazar'
                    : 'Arrastrá otra imagen aquí'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#17120d]/5">
              {isPending ? (
                <Loader2 className="size-5 animate-spin text-[#8b5e34]" aria-hidden />
              ) : (
                <ImagePlus className="size-5 text-[#8b5e34]" aria-hidden />
              )}
            </div>
            <p className="mt-4 text-sm font-bold text-[#17120d]">
              {isPending
                ? 'Subiendo...'
                : isDragActive
                  ? 'Soltá la imagen aquí'
                  : 'Arrastrá una imagen o elegí un archivo'}
            </p>
            <p id={`${dropzoneId}-hint`} className="mt-1 text-xs text-[#5d5146]">
              PNG, JPG, WebP — también podés pegar una URL abajo
            </p>
            <button
              type="button"
              disabled={isPending}
              onClick={(event) => {
                event.stopPropagation();
                open();
              }}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-[#17120d]/15 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#17120d] transition hover:border-[#8b5e34]/50 hover:bg-[#f0dfc9]/30 disabled:opacity-60"
            >
              Elegir archivo
            </button>
          </div>
        )}
      </div>

      <label htmlFor={inputId} className="block">
        <span className="sr-only">URL de imagen o ruta local</span>
        <Input
          id={inputId}
          name={name}
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="/uploads/... o https://..."
          className="mt-0"
        />
      </label>
    </div>
  );
};
