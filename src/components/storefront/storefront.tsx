"use client";

import {
  ArrowRight,
  AtSign,
  Package,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { EditableImage } from "@/components/admin/editor/editable-image";
import { EditableText } from "@/components/admin/editor/editable-text";
import { MobileNav } from "@/components/storefront/mobile-nav";
import { ParallaxLayer } from "@/components/storefront/parallax-layer";
import { Reveal } from "@/components/storefront/reveal";
import { formatPrice } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import type {
  BenefitsContent,
  CampaignContent,
  CommunityContent,
  FooterContent,
  HeaderContent,
  HeroContent,
  SiteData,
  TickerContent,
} from "@/lib/types";

type StorefrontProps = {
  data: SiteData;
  editable?: boolean;
};

const BENEFIT_ICONS = [Truck, RefreshCw, ShieldCheck] as const;

const getContent = <T,>(data: SiteData, key: string) =>
  data.sections[key]?.content as T;

export const Storefront = ({ data, editable = false }: StorefrontProps) => {
  const hero = getContent<HeroContent>(data, "hero");
  const ticker = getContent<TickerContent>(data, "ticker");
  const categoriesHeader = getContent<HeaderContent>(data, "categories");
  const featuredHeader = getContent<HeaderContent>(data, "featured");
  const campaign = getContent<CampaignContent>(data, "campaign");
  const benefits = getContent<BenefitsContent>(data, "benefits");
  const community = getContent<CommunityContent>(data, "community");
  const footer = getContent<FooterContent>(data, "footer");
  const visibleProducts = data.products.filter((product) => product.isVisible);
  const featuredProducts = visibleProducts.filter(
    (product) => product.isFeatured,
  );
  const visibleCategories = data.categories.filter(
    (category) => category.isVisible,
  );

  const Text = editable ? EditableText : StaticText;
  const loginHref = editable ? "/admin" : "/login";
  const loginLabel = editable ? "Editando" : "Iniciar sesión";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section
        className="overflow-hidden border-b border-border bg-foreground py-2 text-label text-primary-foreground/90"
        aria-label="Anuncios"
      >
        <div className="marquee-track flex min-w-max gap-8 whitespace-nowrap">
          <Text
            path="settings.announcement"
            value={data.settings.announcement}
          />
          <Text
            path="settings.announcement"
            value={data.settings.announcement}
          />
        </div>
      </section>

      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-lg">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5"
        >
          {editable ? (
            <EditableText
              path="settings.brandName"
              value={data.settings.brandName}
              as="span"
              className="brand-wordmark text-base md:text-lg"
            />
          ) : (
            <Link
              href="#inicio"
              className="brand-wordmark text-base transition hover:opacity-60 md:text-lg"
            >
              {data.settings.brandName}
            </Link>
          )}

          <div className="hidden items-center gap-10 text-sm font-normal text-muted-foreground md:flex">
            {data.settings.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="#bolsa"
              className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground sm:flex"
              aria-label="Ver bolsa"
            >
              <ShoppingBag className="size-4" aria-hidden />
            </Link>
            <Link
              href={loginHref}
              className={cn(
                "hidden rounded-full px-5 py-2 text-sm font-medium transition md:inline-flex",
                editable
                  ? "bg-foreground text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {loginLabel}
            </Link>
            <MobileNav
              brandName={data.settings.brandName}
              navLinks={data.settings.navLinks}
              loginHref={loginHref}
              loginLabel={loginLabel}
            />
          </div>
        </nav>
      </header>

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
                {editable ? (
                  <>
                    <span className="inline-flex items-center gap-2 rounded-full bg-hero-foreground px-6 py-3.5 text-sm font-medium text-hero">
                      <Text
                        path="sections.hero.primaryCta"
                        value={hero.primaryCta}
                      />
                      <ArrowRight className="size-4" aria-hidden />
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-hero-foreground">
                      <Text
                        path="sections.hero.secondaryCta"
                        value={hero.secondaryCta}
                      />
                    </span>
                  </>
                ) : (
                  <>
                    <Link
                      href="#tienda"
                      className="group inline-flex items-center gap-2 rounded-full bg-hero-foreground px-6 py-3.5 text-sm font-medium text-hero transition hover:bg-white"
                    >
                      {hero.primaryCta}
                      <ArrowRight
                        className="size-4 transition group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                    <Link
                      href="#productos"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-hero-foreground transition hover:border-white/40 hover:bg-white/5"
                    >
                      {hero.secondaryCta}
                    </Link>
                  </>
                )}
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
                <HeroImage src={hero.imageUrl} alt={hero.title} />
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
            <Text
              path="sections.categories.cta"
              value={categoriesHeader.cta}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            />
          </div>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {visibleCategories.map((category, index) => (
            <Reveal key={category.id} delay={index * 80}>
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition duration-300 hover:border-foreground/15 hover:shadow-sm">
                <span className="font-display text-3xl font-light leading-none text-muted-foreground/40 transition group-hover:text-muted-foreground/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Text
                  path={`categories.${category.id}.name`}
                  value={category.name}
                  as="span"
                  className="mt-4 block text-lg font-medium"
                />
                <ArrowRight
                  className="absolute bottom-6 right-6 size-5 translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden
                />
              </div>
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
                value={featuredHeader.eyebrow ?? ""}
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
            <Text
              path="sections.featured.cta"
              value={featuredHeader.cta}
              className="text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            />
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <Reveal key={product.id} delay={(index % 4) * 80}>
              <ParallaxLayer
                speed={0.06 + (index % 2) * 0.04}
                mobileOnly
              >
                <article className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                    {editable ? (
                      <EditableImage
                        path={`products.${product.id}.imageUrl`}
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(min-width: 768px) 25vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                        containerClassName="absolute inset-0"
                      />
                    ) : (
                      <ProductImage product={product} />
                    )}
                    {!editable ? (
                      <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-foreground/60 via-transparent to-transparent p-6 opacity-0 transition duration-300 group-hover:opacity-100">
                        <span className="rounded-full bg-primary-foreground px-4 py-2 text-label text-foreground">
                          Ver detalle
                        </span>
                      </div>
                    ) : null}
                    {product.badge ? (
                      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-label text-primary-foreground">
                        {editable ? (
                          <EditableText
                            path={`products.${product.id}.badge`}
                            value={product.badge}
                          />
                        ) : (
                          product.badge
                        )}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4">
                    <p className="text-label text-muted-foreground">
                      {product.categoryName}
                    </p>
                    <Text
                      path={`products.${product.id}.name`}
                      value={product.name}
                      as="h3"
                      className="mt-1 text-base font-medium"
                    />
                    <Text
                      path={`products.${product.id}.description`}
                      value={product.description}
                      as="p"
                      multiline
                      className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground"
                    />
                    {editable ? (
                      <EditableText
                        path={`products.${product.id}.price`}
                        value={String(product.price)}
                        as="p"
                        className="mt-3 text-base font-semibold"
                      />
                    ) : (
                      <p className="mt-3 text-base font-semibold">
                        {formatPrice(product.price)}
                      </p>
                    )}
                  </div>
                </article>
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
                value={campaign.eyebrow ?? ""}
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
            <span className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground px-6 py-3.5 text-sm font-medium text-foreground transition hover:opacity-90">
              <Text path="sections.campaign.cta" value={campaign.cta} />
              <ArrowRight className="size-4" aria-hidden />
            </span>
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
                <CampaignImage src={campaign.imageUrl} alt={campaign.heading} />
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
                  <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                    <Text path="sections.community.cta" value={community.cta} />
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <aside id="bolsa" className="mx-auto mb-24 max-w-7xl px-5">
        <Reveal>
          <div className="rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-5 text-muted-foreground" aria-hidden />
            </div>
            <Text
              path="settings.instagram"
              value={data.settings.instagram}
              as="p"
              className="mt-5 text-label text-muted-foreground"
            />
            <h2 className="font-display mt-3 text-xl font-semibold">Tu bolsa</h2>
            <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
              Tu bolsa está vacía. Empezá a explorar la colección.
            </p>
            {!editable ? (
              <Link
                href="#productos"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Explorar colección
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </Reveal>
      </aside>

      <footer className="border-t border-border bg-foreground px-6 py-16 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Text
              path="settings.brandName"
              value={data.settings.brandName}
              as="h2"
              className="brand-wordmark text-2xl"
            />
            <Text
              path="sections.footer.description"
              value={footer.description}
              as="p"
              multiline
              className="mt-4 max-w-sm leading-7 text-secondary"
            />
            <a
              href={`https://instagram.com/${data.settings.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-secondary transition hover:text-primary-foreground"
              aria-label={`Instagram ${data.settings.instagram}`}
            >
              <AtSign className="size-4" aria-hidden />
              {data.settings.instagram}
            </a>
          </div>
          <FooterList
            title="Tienda"
            items={footer.shopLinks}
            prefix="sections.footer.shopLinks"
            editable={editable}
          />
          <FooterList
            title="Soporte"
            items={footer.supportLinks}
            prefix="sections.footer.supportLinks"
            editable={editable}
          />
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-secondary">
          <span className="inline-flex items-center gap-2">
            <Package className="size-4 shrink-0" aria-hidden />
            © 2026 {data.settings.brandName}. Todos los derechos reservados.
          </span>
          <Text
            path="settings.instagram"
            value={data.settings.instagram}
            as="span"
          />
        </div>
      </footer>
    </main>
  );
};

type TextTag = "span" | "p" | "h1" | "h2" | "h3";

const StaticText = ({
  value,
  as: Tag = "span",
  className,
}: {
  path?: string;
  value: string;
  as?: TextTag;
  className?: string;
  multiline?: boolean;
}) => <Tag className={className}>{value}</Tag>;

const HeroImage = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    fill
    priority
    className="object-cover"
    unoptimized={src.startsWith("/uploads/")}
  />
);

const CampaignImage = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    fill
    className="object-cover"
    unoptimized={src.startsWith("/uploads/")}
  />
);

const ProductImage = ({
  product,
}: {
  product: { imageUrl: string; name: string };
}) => (
  <Image
    src={product.imageUrl}
    alt={product.name}
    fill
    sizes="(min-width: 768px) 25vw, 100vw"
    className="object-cover transition duration-500 group-hover:scale-105"
    unoptimized={product.imageUrl.startsWith("/uploads/")}
  />
);

const FooterList = ({
  title,
  items,
  prefix,
  editable,
}: {
  title: string;
  items: string[];
  prefix: string;
  editable: boolean;
}) => (
  <div>
    <h3 className="text-label text-secondary">{title}</h3>
    <ul className="mt-4 space-y-3 text-secondary">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>
          {editable ? (
            <EditableText path={`${prefix}.${index}`} value={item} as="span" />
          ) : (
            <span className="cursor-default transition hover:text-primary-foreground">
              {item}
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
);
