import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-2xl border border-[#17120d]/15 bg-white px-4 py-3 text-sm text-[#17120d] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#5d5146]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17120d]/20 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
