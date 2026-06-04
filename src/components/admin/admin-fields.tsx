import type { ReactNode } from 'react';

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
};

export const Card = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-[1.5rem] border border-[#17120d]/10 bg-white/70 p-6 shadow-sm">
    <h2 className="text-2xl font-black tracking-[-0.04em]">{title}</h2>
    <div className="mt-5">{children}</div>
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
    <span className="text-xs font-black uppercase tracking-[0.18em] text-[#8b5e34]">{label}</span>
    <input
      name={name}
      type={type}
      defaultValue={defaultValue}
      required={required}
      className="mt-2 w-full rounded-2xl border border-[#17120d]/15 bg-white px-4 py-3 text-sm"
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
    <span className="text-xs font-black uppercase tracking-[0.18em] text-[#8b5e34]">{label}</span>
    <textarea
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      className="mt-2 w-full rounded-2xl border border-[#17120d]/15 bg-white px-4 py-3 text-sm"
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
  <label className="flex items-center gap-3 rounded-2xl border border-[#17120d]/10 bg-white px-4 py-3 text-sm font-bold">
    <input name={name} type="checkbox" defaultChecked={defaultChecked} className="size-4 accent-[#17120d]" />
    {label}
  </label>
);

export const SaveButton = ({ label = 'Guardar cambios' }: { label?: string }) => (
  <button
    type="submit"
    className="rounded-full bg-[#17120d] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#f5efe6] transition hover:scale-[1.01]"
  >
    {label}
  </button>
);
