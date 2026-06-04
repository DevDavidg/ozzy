'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

export const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="light"
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          'group toast group-[.toaster]:bg-[#17120d] group-[.toaster]:text-[#f5efe6] group-[.toaster]:border-[#17120d]/20 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl',
        description: 'group-[.toast]:text-[#d2bd9f]',
        actionButton: 'group-[.toast]:bg-[#f5efe6] group-[.toast]:text-[#17120d]',
        cancelButton: 'group-[.toast]:bg-[#2a221b] group-[.toast]:text-[#f5efe6]',
        success: 'group-[.toaster]:bg-[#17120d] group-[.toaster]:text-[#f5efe6]',
        error: 'group-[.toaster]:bg-red-700 group-[.toaster]:text-white',
      },
    }}
    {...props}
  />
);
