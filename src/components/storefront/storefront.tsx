'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { EditableImage } from '@/components/admin/editor/editable-image';
import { EditableText } from '@/components/admin/editor/editable-text';
import { CartView } from '@/components/storefront/cart-view';
import { CtaLink } from '@/components/storefront/cta-link';
import { ParallaxLayer } from '@/components/storefront/parallax-layer';
import { ProductCard } from '@/components/storefront/product-card';
import { Reveal } from '@/components/storefront/reveal';
import { StoreShell } from '@/components/storefront/store-shell';
import type {
  BagContent,
  BenefitsContent,
  CampaignContent,
  CommunityContent,
  HeaderContent,
  HeroContent,
  SiteData,
  TickerContent,
} from '@/lib/types';
import { RefreshCw, ShieldCheck, Truck } from 'lucide-react';

type StorefrontProps = {
  data: SiteData;
  editable?: boolean;
  showFallbackBanner?: boolean;
};

const BENEFIT_ICONS = [Truck, RefreshCw, ShieldCheck] as const;

const getContent = <T,>(data: SiteData, key: string) =>
  data.sections[key]?.content as T;

export const Storefront = ({
  data,
  editable = false,
  showFallbackBanner = false,
}: StorefrontProps) => {
  const hero = getContent<HeroContent>(data, 'hero');
  const ticker = getContent<TickerContent>(data, 'ticker');
  const categoriesHeader = getContent<HeaderContent>(data, 'categories');
  const featuredHeader = getContent<HeaderContent>(data, 'featured');
  const campaign = getContent<CampaignContent>(data, 'campaign');
  const benefits = getContent<BenefitsContent>(data, 'benefits');
  const community = getContent<CommunityContent>(data, 'community');
  const bag = getContent<BagContent>(data, 'bag');

  const visibleProducts = data.products.filter((product) => product.isVisible);
  const featuredProducts = visibleProducts.filter((product) => product.isFeatured);
  const visibleCategories = data.categories.filter((category) => category.isVisible);

  const Text = editable ? EditableText : StaticText;

  return (
    <StoreShell data={data} editable={editable} showFallbackBanner={showFallbackBanner}>
      <section
        id="inicio"
        className="relative overflow-hidden bg-hero text-hero-foreground"
      >
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-hero/30 via-transparent to-hero/70 md:bg-gradient-to-r md:from-hero/50 md:via-transparent md:to-hero/40"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto grid min-h-[min(100svh,880px)] max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-16 md:py-24">
          <ParallaxLayer
            speed={0.14}
            mobileOnly
            className="flex flex-col justify-between gap-10"
          >
            <div>
              <Text
                path="sections.hero.eyebrow"
                value={hero.eyebrow}
                as="p"
                className="mb-8 text-label text-white/50"
              />
              <Text
                path="sections.hero.title"
                value={hero.title}
                as="h1"
                className="font-display max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl"
              />
              <Text
                path="sections.hero.description"
                value={hero.description}
                as="p"
                multiline
                className="mt-6 max-w-lg text-base font-light leading-7 text-white/60 md:text-lg md:leading-8"
              />
              <div className="mt-10 flex flex-wrap gap-3">
                <CtaLink
                  href={hero.primaryCtaHref}
                  label={hero.primaryCta}
                  labelPath="sections.hero.primaryCta"
                  hrefPath="sections.hero.primaryCtaHref"
                  editable={editable}
                  showArrow
                  variant={editable ? 'primary' : 'primary'}
                  className={
                    editable
                      ? undefined
                      : 'group bg-hero-foreground text-hero hover:bg-white'
                  }
                />
                <CtaLink
                  href={hero.secondaryCtaHref}
                  label={hero.secondaryCta}
                  labelPath="sections.hero.secondaryCta"
                  hrefPath="sections.hero.secondaryCtaHref"
                  editable={editable}
                  variant="secondary"
                />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-6 text-label text-white/40">
              <Text path="sections.hero.meta" value={hero.meta} />
              <Text path="sections.hero.counter" value={hero.counter} />
            </div>
          </ParallaxLayer>

          <ParallaxLayer speed={0.22} mobileOnly>
            <div className="relative min-h-[min(72vw,420px)] overflow-hidden rounded-xl bg-zinc-900 md:min-h-[540px] md:rounded-2xl">
              {editable ? (
                <EditableImage
                  path="sections.hero.imageUrl"
                  src={hero.imageUrl}
                  alt={hero.title}
                  fill
                  priority
                  className="object-cover"
                  containerClassName="absolute inset-0"
                />
              ) : (
                <Image
                  src={hero.imageUrl}
                  alt={hero.title}
                  fill
                  priority
                  className="object-cover"
                  unoptimized={hero.imageUrl.startsWith('/uploads/')}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <span className="pointer-events-none absolute bottom-5 left-5 text-label text-white/70">
                Edición limitada
              </span>
            </div>
          </ParallaxLayer>
        </div>
      </section>

      <section
        className="overflow-hidden border-y border-border bg-muted py-3.5 text-label text-muted-foreground"
        aria-hidden="true"
      >
        <div className="marquee-track-slow flex min-w-max gap-10 whitespace-nowrap">
          <Text path="sections.ticker.text" value={ticker.text} />
          <Text path="sections.ticker.text" value={ticker.text} />
        </div>
      </section>

      <section id="tienda" className="mx-auto max-w-7xl px-5 py-20">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <Text
              path="sections.categories.heading"
              value={categoriesHeader.heading}
              as="h2"
              className="font-display text-3xl font-semibold md:text-4xl"
            />
            <CtaLink
              href={categoriesHeader.ctaHref}
              label={categoriesHeader.cta}
              labelPath="sections.categories.cta"
              hrefPath="sections.categories.ctaHref"
              editable={editable}
              variant="text"
            />
          </div>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {visibleCategories.map((category, index) => (
            <Reveal key={category.id} delay={index * 80}>
              {editable ? (
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6">
                  <span className="font-display text-3xl font-light leading-none text-muted-foreground/40">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <EditableText
                    path={`categories.${category.id}.name`}
                    value={category.name}
                    as="span"
                    className="mt-4 block text-lg font-medium"
                  />
                </div>
              ) : (
                <Link
                  href={`/categoria/${category.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border bg-card p-6 transition duration-300 hover:border-foreground/15 hover:shadow-sm"
                >
                  <span className="font-display text-3xl font-light leading-none text-muted-foreground/40 transition group-hover:text-muted-foreground/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-4 block text-lg font-medium">{category.name}</span>
                  <ArrowRight
                    className="absolute bottom-6 right-6 size-5 translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden
                  />
                </Link>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      <section id="productos" className="mx-auto max-w-7xl px-5 pb-24">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Text
                path="sections.featured.eyebrow"
                value={featuredHeader.eyebrow ?? ''}
                as="p"
                className="text-label text-muted-foreground"
              />
              <Text
                path="sections.featured.heading"
                value={featuredHeader.heading}
                as="h2"
                className="font-display mt-2 text-3xl font-semibold md:text-4xl"
              />
            </div>
            <CtaLink
              href={featuredHeader.ctaHref}
              label={featuredHeader.cta}
              labelPath="sections.featured.cta"
              hrefPath="sections.featured.ctaHref"
              editable={editable}
              variant="text"
            />
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <Reveal key={product.id} delay={(index % 4) * 80}>
              <ParallaxLayer speed={0.06 + (index % 2) * 0.04} mobileOnly>
                <ProductCard product={product} editable={editable} index={index} />
              </ParallaxLayer>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="flex h-full flex-col justify-between rounded-2xl bg-foreground p-8 text-primary-foreground md:p-12">
            <div>
              <Text
                path="sections.campaign.eyebrow"
                value={campaign.eyebrow ?? ''}
                as="p"
                className="text-label text-secondary"
              />
              <Text
                path="sections.campaign.heading"
                value={campaign.heading}
                as="h2"
                className="font-display mt-6 text-3xl font-semibold leading-tight md:text-4xl"
              />
            </div>
            <CtaLink
              href={campaign.ctaHref}
              label={campaign.cta}
              labelPath="sections.campaign.cta"
              hrefPath="sections.campaign.ctaHref"
              editable={editable}
              showArrow
              className="mt-10 w-fit bg-primary-foreground text-foreground hover:opacity-90"
            />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ParallaxLayer speed={0.16} mobileOnly>
            <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-muted">
              {editable ? (
                <EditableImage
                  path="sections.campaign.imageUrl"
                  src={campaign.imageUrl}
                  alt={campaign.heading}
                  fill
                  className="object-cover"
                  containerClassName="absolute inset-0"
                />
              ) : (
                <Image
                  src={campaign.imageUrl}
                  alt={campaign.heading}
                  fill
                  className="object-cover"
                  unoptimized={campaign.imageUrl.startsWith('/uploads/')}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-foreground/20 to-transparent" />
            </div>
          </ParallaxLayer>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-24 md:grid-cols-3">
        {benefits.items.map((item, index) => {
          const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length];
          return (
            <Reveal key={`${item.title}-${index}`} delay={index * 100}>
              <div className="h-full rounded-2xl border border-border bg-card p-7 transition hover:border-foreground/10">
                <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
                  <Icon className="size-5" aria-hidden />
                </div>
                <Text
                  path={`sections.benefits.items.${index}.title`}
                  value={item.title}
                  as="h3"
                  className="text-lg font-medium"
                />
                <Text
                  path={`sections.benefits.items.${index}.description`}
                  value={item.description}
                  as="p"
                  multiline
                  className="mt-3 leading-7 text-muted-foreground"
                />
              </div>
            </Reveal>
          );
        })}
      </section>

      <section id="contacto" className="mx-auto max-w-7xl px-5 pb-24">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-muted/50">
            <div className="p-8 md:p-12">
              <Text
                path="sections.community.eyebrow"
                value={community.eyebrow}
                as="p"
                className="text-label text-muted-foreground"
              />
              <div className="mt-5 grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
                <Text
                  path="sections.community.heading"
                  value={community.heading}
                  as="h2"
                  className="font-display text-3xl font-semibold md:text-4xl"
                />
                <div>
                  <Text
                    path="sections.community.description"
                    value={community.description}
                    as="p"
                    multiline
                    className="text-lg leading-8 text-muted-foreground"
                  />
                  <CtaLink
                    href={community.ctaHref}
                    label={community.cta}
                    labelPath="sections.community.cta"
                    hrefPath="sections.community.ctaHref"
                    editable={editable}
                    showArrow
                    className="mt-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <aside id="bolsa" className="mx-auto mb-24 max-w-7xl px-5">
        <Reveal>
          <CartView bag={bag} editable={editable} />
        </Reveal>
      </aside>
    </StoreShell>
  );
};

type TextTag = 'span' | 'p' | 'h1' | 'h2' | 'h3';

const StaticText = ({
  value,
  as: Tag = 'span',
  className,
}: {
  path?: string;
  value: string;
  as?: TextTag;
  className?: string;
  multiline?: boolean;
}) => <Tag className={className}>{value}</Tag>;
