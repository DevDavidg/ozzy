'use client';

import { ImageIcon, LayoutGrid, Package, Settings2 } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

type AdminTab = 'media' | 'products' | 'content';

type AdminTabsProps = {
  media: React.ReactNode;
  products: React.ReactNode;
  content: React.ReactNode;
};

const tabs: { id: AdminTab; label: string; icon: typeof Package }[] = [
  { id: 'media', label: 'Imágenes', icon: ImageIcon },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'content', label: 'Contenido', icon: Settings2 },
];

export const AdminTabs = ({ media, products, content }: AdminTabsProps) => {
  const [active, setActive] = useState<AdminTab>('media');

  const panels: Record<AdminTab, React.ReactNode> = {
    media,
    products,
    content,
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Secciones de gestión"
        className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-border bg-card/60 p-2"
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active === id}
            aria-controls={`panel-${id}`}
            id={`tab-${id}`}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition sm:flex-none sm:px-6',
              active === id
                ? 'bg-foreground text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            onClick={() => setActive(id)}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {tabs.map(({ id }) => (
        <div
          key={id}
          role="tabpanel"
          id={`panel-${id}`}
          aria-labelledby={`tab-${id}`}
          hidden={active !== id}
          className="grid gap-8"
        >
          {panels[id]}
        </div>
      ))}
    </div>
  );
};
