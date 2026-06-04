'use client';

import { BarChart3, ExternalLink, LayoutGrid, LogOut, MousePointerClick, Type } from 'lucide-react';
import Link from 'next/link';

import { logoutAction } from '@/app/admin/actions';
import type { SaveStatus } from '@/components/admin/editor/editor-provider';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type EditorToolbarProps = {
  brandName: string;
  userEmail: string;
  saveStatus: SaveStatus;
};

const statusLabel: Record<SaveStatus, string> = {
  idle: 'Listo para editar',
  saving: 'Guardando...',
  saved: 'Guardado',
  error: 'Error al guardar',
};

const statusColor: Record<SaveStatus, string> = {
  idle: 'bg-[#d2bd9f] text-[#17120d]',
  saving: 'bg-[#fbbf24] text-[#17120d]',
  saved: 'bg-[#22c55e] text-white',
  error: 'bg-[#ef4444] text-white',
};

export const EditorToolbar = ({ brandName, userEmail, saveStatus }: EditorToolbarProps) => (
  <header className="sticky top-0 z-50 border-b border-white/10 bg-foreground/95 text-primary-foreground backdrop-blur-md">
    <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-3.5">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-secondary">
          Canvas editable
        </p>
        <h1 className="font-display text-xl font-black tracking-[-0.04em]">{brandName}</h1>
      </div>

      <div className="hidden items-center gap-4 text-sm text-secondary lg:flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-2">
              <Type className="size-4" aria-hidden />
              Doble click en textos
            </span>
          </TooltipTrigger>
          <TooltipContent>Editá cualquier texto con doble click</TooltipContent>
        </Tooltip>
        <span aria-hidden>·</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-2">
              <MousePointerClick className="size-4" aria-hidden />
              Drag & drop en imágenes
            </span>
          </TooltipTrigger>
          <TooltipContent>Arrastrá o hacé click para cambiar imágenes</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            'rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em]',
            statusColor[saveStatus],
          )}
          aria-live="polite"
        >
          {statusLabel[saveStatus]}
        </span>
        <span className="hidden text-sm text-secondary md:inline">{userEmail}</span>
        <Button asChild variant="outline" size="sm" className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-foreground">
          <Link href="/admin/dashboard">
            <BarChart3 aria-hidden />
            Ventas
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-foreground">
          <Link href="/admin/manage">
            <LayoutGrid aria-hidden />
            Gestión
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-foreground">
          <Link href="/" target="_blank">
            <ExternalLink aria-hidden />
            Ver publicada
          </Link>
        </Button>
        <form action={logoutAction}>
          <Button type="submit" variant="secondary" size="sm">
            <LogOut aria-hidden />
            Salir
          </Button>
        </form>
      </div>
    </div>
  </header>
);
