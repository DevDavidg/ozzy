import type { ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
};

export const Card = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <section className="overflow-hidden rounded-[1.5rem] border border-border bg-card/80 shadow-sm">
    <div className="border-b border-border bg-muted/30 px-6 py-5">
      <h2 className="font-display text-xl font-black tracking-[-0.04em] md:text-2xl">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
    <div className="p-6">{children}</div>
  </section>
);

export const Field = ({
  label,
  name,
  defaultValue = '',
  type = 'text',
  required = true,
}: FieldProps) => (
  <label className="block">
    <span className="text-xs font-black uppercase tracking-[0.18em] text-accent">{label}</span>
    <Input
      name={name}
      type={type}
      defaultValue={defaultValue}
      required={required}
      className="mt-2"
    />
  </label>
);

export const TextArea = ({
  label,
  name,
  defaultValue = '',
  rows = 4,
}: FieldProps & { rows?: number }) => (
  <label className="block">
    <span className="text-xs font-black uppercase tracking-[0.18em] text-accent">{label}</span>
    <textarea
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      className={cn(
        'mt-2 flex w-full rounded-2xl border border-input bg-white px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    />
  </label>
);

export const Checkbox = ({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked: boolean;
}) => (
  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold transition hover:border-accent/30 hover:bg-muted/30">
    <input
      name={name}
      type="checkbox"
      defaultChecked={defaultChecked}
      className="size-4 accent-foreground"
    />
    {label}
  </label>
);

export const SaveButton = ({ label = 'Guardar cambios' }: { label?: string }) => (
  <button
    type="submit"
    className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
  >
    {label}
  </button>
);
