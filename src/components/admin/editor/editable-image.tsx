'use client';

import Image from 'next/image';
import { isUnoptimizedImageUrl } from '@/lib/image-url';
import { ImagePlus, Loader2, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { useEditorOptional } from '@/components/admin/editor/editor-provider';
import { useEditorFileDrag } from '@/components/admin/editor/use-editor-file-drag';

type EditableImageProps = {
  path: string;
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  containerClassName?: string;
};

const imageAccept = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
  'image/avif': ['.avif'],
  'image/svg+xml': ['.svg'],
} as const;

export const EditableImage = ({
  path,
  src,
  alt,
  fill = false,
  priority = false,
  sizes,
  className,
  containerClassName,
}: EditableImageProps) => {
  const editor = useEditorOptional();
  const [isUploading, setIsUploading] = useState(false);
  const isFileDraggingOnPage = useEditorFileDrag(Boolean(editor));

  const handleUpload = useCallback(
    async (file: File) => {
      if (!editor) {
        return;
      }

      setIsUploading(true);

      try {
        await editor.uploadImage(path, file);
      } finally {
        setIsUploading(false);
      }
    },
    [editor, path],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    accept: imageAccept,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: !editor || isUploading,
    noClick: true,
    noKeyboard: true,
    onDropAccepted: (files) => {
      const file = files[0];
      if (file) {
        void handleUpload(file);
      }
    },
    onDropRejected: () => {
      toast.error('La imagen no puede superar 10 MB o el formato no es válido.');
    },
  });

  const handleClick = () => {
    if (editor && !isUploading) {
      open();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const imageElement = (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={className}
      unoptimized={isUnoptimizedImageUrl(src)}
    />
  );

  if (!editor) {
    return fill ? (
      <div className={cn('relative', containerClassName)}>{imageElement}</div>
    ) : (
      imageElement
    );
  }

  const showDropTarget = isDragActive && isDragAccept;
  const showDropReject = isDragActive && isDragReject;
  const showPageDragHint = isFileDraggingOnPage && !isDragActive;

  const overlayMessage = isUploading
    ? 'Subiendo...'
    : showDropReject
      ? 'Solo imágenes'
      : showDropTarget
        ? 'Soltá para reemplazar'
        : showPageDragHint
          ? 'Soltá acá'
          : 'Arrastrá imagen o click';

  const OverlayIcon = isUploading ? Loader2 : showDropTarget ? Upload : ImagePlus;

  return (
    <div
      {...getRootProps({
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        className: cn(
          'relative outline-none',
          containerClassName,
          'editable-image group cursor-pointer rounded-[inherit]',
          showPageDragHint && 'ring-2 ring-[#2563eb]/45 ring-offset-2 ring-offset-transparent',
          showDropTarget && 'ring-4 ring-[#2563eb] ring-offset-2 ring-offset-[#f5efe6] scale-[1.01]',
          showDropReject && 'ring-4 ring-red-500 ring-offset-2 ring-offset-[#f5efe6]',
        ),
        role: 'button',
        tabIndex: 0,
        'aria-label': 'Arrastrá o hacé click para cambiar imagen',
        'aria-busy': isUploading,
      })}
    >
      {imageElement}

      <div
        className={cn(
          'pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center transition-all duration-200',
          showDropTarget && 'bg-[#2563eb]/35',
          showDropReject && 'bg-red-950/50',
          !showDropTarget &&
            !showDropReject &&
            (isUploading || showPageDragHint
              ? 'bg-[#17120d]/50'
              : 'bg-[#17120d]/55 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'),
          (showDropTarget || showDropReject || isUploading || showPageDragHint) && 'opacity-100',
        )}
        aria-hidden
      >
        <div
          className={cn(
            'flex size-14 items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200',
            showDropTarget && 'scale-110 border-white bg-white/20',
            showDropReject && 'border-red-200 bg-red-500/20',
            showPageDragHint && !showDropTarget && 'border-[#2563eb]/70 bg-[#2563eb]/15 animate-pulse',
            !showDropTarget &&
              !showDropReject &&
              !showPageDragHint &&
              'border-white/50 bg-black/25 group-hover:scale-105',
          )}
        >
          <OverlayIcon
            className={cn(
              'size-7 text-white',
              isUploading && 'animate-spin',
              showDropReject && 'text-red-100',
            )}
            strokeWidth={2}
            aria-hidden
          />
        </div>
        <p
          className={cn(
            'max-w-[14rem] text-sm font-bold leading-snug text-white drop-shadow-sm',
            showDropReject && 'text-red-100',
          )}
        >
          {overlayMessage}
        </p>
      </div>

      <div
        className={cn(
          'pointer-events-none absolute inset-3 rounded-[inherit] border-2 border-dashed transition-opacity duration-200',
          showDropTarget && 'border-white/90 opacity-100',
          showPageDragHint && !showDropTarget && 'border-[#2563eb]/60 opacity-100',
          showDropReject && 'border-red-300/90 opacity-100',
          !showDropTarget && !showPageDragHint && !showDropReject && 'opacity-0',
        )}
        aria-hidden
      />

      <input {...getInputProps({ className: 'hidden' })} />
    </div>
  );
};
