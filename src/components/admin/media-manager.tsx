import Image from 'next/image';

import { Card } from '@/components/admin/admin-fields';
import { MediaUploadZone } from '@/components/admin/media-upload-zone';

type MediaAsset = {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
};

export const MediaManager = ({ assets }: { assets: MediaAsset[] }) => (
  <Card title="Imágenes locales">
    <MediaUploadZone />
    <div className="mt-6 grid gap-4 md:grid-cols-4">
      {assets.map((asset) => (
        <div key={asset.id} className="rounded-2xl border border-[#17120d]/10 bg-white p-3">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f0dfc9]">
            <Image src={asset.url} alt={asset.fileName} fill className="object-cover" unoptimized />
          </div>
          <p className="mt-3 break-all text-xs font-bold">{asset.url}</p>
          <p className="mt-1 text-xs text-[#5d5146]">{Math.round(asset.size / 1024)} KB</p>
        </div>
      ))}
    </div>
  </Card>
);
