'use client';

import type { ReactNode, RefObject } from 'react';

import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={cn(
        'reveal transition-all duration-700 ease-out',
        inView ? 'reveal-visible' : 'reveal-hidden',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
