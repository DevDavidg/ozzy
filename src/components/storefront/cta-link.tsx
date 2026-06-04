'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { EditableText } from '@/components/admin/editor/editable-text';
import { isExternalHref } from '@/lib/store-links';
import { cn } from '@/lib/utils';

type CtaLinkProps = {
  href: string;
  label: string;
  labelPath: string;
  hrefPath: string;
  editable?: boolean;
  className?: string;
  showArrow?: boolean;
  variant?: 'primary' | 'secondary' | 'text';
};

const variantClasses = {
  primary:
    'inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-primary-foreground transition hover:opacity-90',
  secondary:
    'inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-hero-foreground transition hover:border-white/40 hover:bg-white/5',
  text: 'inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline',
};

export const CtaLink = ({
  href,
  label,
  labelPath,
  hrefPath,
  editable = false,
  className,
  showArrow = false,
  variant = 'primary',
}: CtaLinkProps) => {
  const classes = cn(variantClasses[variant], className);

  if (editable) {
    return (
      <span className={cn(classes, 'flex-col items-start gap-1 py-4')}>
        <span className="inline-flex items-center gap-2">
          <EditableText path={labelPath} value={label} />
          {showArrow ? <ArrowRight className="size-4" aria-hidden /> : null}
        </span>
        <EditableText
          path={hrefPath}
          value={href}
          className="text-xs font-normal opacity-60"
          placeholder="URL del enlace"
        />
      </span>
    );
  }

  const content = (
    <>
      {label}
      {showArrow ? <ArrowRight className="size-4" aria-hidden /> : null}
    </>
  );

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
};
