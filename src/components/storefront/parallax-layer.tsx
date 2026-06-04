'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

type ParallaxLayerProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
  mobileOnly?: boolean;
};

export const ParallaxLayer = ({
  children,
  speed = 0.1,
  className,
  mobileOnly = true,
}: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion) return;
    if (mobileOnly && !isMobile) return;

    let rafId = 0;

    const update = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress =
        (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      const offset = (clamped - 0.5) * speed * 120;
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      element.style.transform = '';
    };
  }, [isMobile, mobileOnly, reducedMotion, speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
};
