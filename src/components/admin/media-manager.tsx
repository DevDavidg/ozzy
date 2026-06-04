'use client';

import { Check, Copy } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { Card } from '@/components/admin/admin-fields';
import { MediaUploadZone } from '@/components/admin/media-upload-zone';
import { Button } from '@/components/ui/button';

type MediaAsset = {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
};

const CopyUrlButton = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('URL copiada');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="mt-2 h-8 w-full text-xs"
      onClick={handleCopy}
      aria-label={`Copiar URL ${url}`}
    >
      {copied ? (
        <>
          <Check className="size-3.5" aria-hidden />
          Copiado
        </>
      ) : (
        <>
          <Copy className="size-3.5" aria-hidden />
          Copiar URL
        </>
      )}
    </Button>
  );
};

export const MediaManager = ({ assets }: { assets: MediaAsset[] }) => (
  <Card title="Imágenes locales" description="Subí archivos y copiá la URL para usarlas en productos o secciones.">
    <MediaUploadZone />
    {assets.length === 0 ? (
      <p className="mt-6 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center text-sm text-muted-foreground">
        Todavía no hay imágenes. Subí la primera arriba.
      </p>
    ) : (
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-accent/25 hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              <Image
                src={asset.url}
                alt={asset.fileName}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                unoptimized
              />
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-bold">{asset.fileName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {Math.round(asset.size / 1024)} KB
              </p>
              <CopyUrlButton url={asset.url} />
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);
