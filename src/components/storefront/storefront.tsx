"use client";

import Image from "next/image";
import Link from "next/link";

import { EditableImage } from "@/components/admin/editor/editable-image";
import { EditableText } from "@/components/admin/editor/editable-text";
import { ParallaxLayer } from "@/components/storefront/parallax-layer";
import { formatPrice } from "@/lib/site-data";
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

  return (
    <main className="min-h-screen bg-[#f5efe6] text-[#17120d]">
      <section className="overflow-hidden bg-[#17120d] py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#f5efe6]">
        <div className="flex min-w-max animate-[marquee_26s_linear_infinite] gap-8 whitespace-nowrap">
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

      <header className="sticky top-0 z-30 border-b border-[#17120d]/10 bg-[#f5efe6]/90 backdrop-blur">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5"
        >
          {editable ? (
            <EditableText
              path="settings.brandName"
              value={data.settings.brandName}
              as="span"
              className="text-2xl font-black tracking-tight"
            />
          ) : (
            <Link href="#inicio" className="text-2xl font-black tracking-tight">
              {data.settings.brandName}
            </Link>
          )}
          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            {data.settings.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:opacity-60"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href={editable ? "/admin" : "/login"}
            className="rounded-full border border-[#17120d] px-5 py-2 text-sm font-bold transition hover:bg-[#17120d] hover:text-[#f5efe6]"
          >
            {editable ? "Editando" : "Iniciar sesión"}
          </Link>
        </nav>
      </header>

      <section
        id="inicio"
        className="relative overflow-hidden bg-[#0a0a0a] text-[#f5f5f5]"
      >
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/80 md:bg-gradient-to-r md:from-[#0a0a0a]/70 md:via-[#0a0a0a]/20 md:to-[#0a0a0a]/60"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto grid min-h-[min(100svh,920px)] max-w-7xl gap-8 px-5 py-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12 md:py-20">
          <ParallaxLayer speed={0.14} mobileOnly className="flex flex-col justify-between gap-10">
            <div>
              <Text
                path="sections.hero.eyebrow"
                value={hero.eyebrow}
                as="p"
                className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#9a9a9a]"
              />
              <Text
                path="sections.hero.title"
                value={hero.title}
                as="h1"
                className="max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-8xl"
              />
              <Text
                path="sections.hero.description"
                value={hero.description}
                as="p"
                multiline
                className="mt-8 max-w-xl text-base leading-7 text-[#b0b0b0] md:text-lg md:leading-8"
              />
              <div className="mt-10 flex flex-wrap gap-3">
                {editable ? (
                  <>
                    <span className="rounded-full bg-[#f5f5f5] px-7 py-4 text-sm font-bold text-[#0a0a0a]">
                      <Text
                        path="sections.hero.primaryCta"
                        value={hero.primaryCta}
                      />
                    </span>
                    <span className="rounded-full border border-[#f5f5f5]/40 px-7 py-4 text-sm font-bold text-[#f5f5f5]">
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
                      className="rounded-full bg-[#f5f5f5] px-7 py-4 text-sm font-bold text-[#0a0a0a] transition hover:bg-white"
                    >
                      {hero.primaryCta}
                    </Link>
                    <Link
                      href="#productos"
                      className="rounded-full border border-[#f5f5f5]/40 px-7 py-4 text-sm font-bold text-[#f5f5f5] transition hover:border-[#f5f5f5]"
                    >
                      {hero.secondaryCta}
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between border-y border-white/10 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#8a8a8a]">
              <Text path="sections.hero.meta" value={hero.meta} />
              <Text path="sections.hero.counter" value={hero.counter} />
            </div>
          </ParallaxLayer>

          <ParallaxLayer speed={0.22} mobileOnly>
            <div className="relative min-h-[min(72vw,420px)] overflow-hidden rounded-2xl bg-[#1a1a1a] md:min-h-[560px] md:rounded-3xl">
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
              <span className="pointer-events-none absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
                Limited Quantities
              </span>
            </div>
          </ParallaxLayer>
        </div>
      </section>

      <section className="overflow-hidden border-y border-[#17120d] bg-[#f0dfc9] py-4 text-sm font-black uppercase tracking-[0.3em]">
        <div className="flex min-w-max animate-[marquee_30s_linear_infinite] gap-10 whitespace-nowrap">
          <Text path="sections.ticker.text" value={ticker.text} />
          <Text path="sections.ticker.text" value={ticker.text} />
        </div>
      </section>

      <section id="tienda" className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 flex items-end justify-between">
          <Text
            path="sections.categories.heading"
            value={categoriesHeader.heading}
            as="h2"
            className="text-4xl font-black tracking-[-0.04em]"
          />
          <Text
            path="sections.categories.cta"
            value={categoriesHeader.cta}
            className="text-sm font-bold underline underline-offset-4"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {visibleCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-3xl border border-[#17120d]/15 bg-white/45 p-6 text-xl font-black transition hover:-translate-y-1 hover:bg-white"
            >
              <Text
                path={`categories.${category.id}.name`}
                value={category.name}
                as="span"
              />
            </div>
          ))}
        </div>
      </section>

      <section id="productos" className="mx-auto max-w-7xl px-5 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <Text
              path="sections.featured.eyebrow"
              value={featuredHeader.eyebrow ?? ""}
              as="p"
              className="text-sm font-bold uppercase tracking-[0.28em] text-[#8b5e34]"
            />
            <Text
              path="sections.featured.heading"
              value={featuredHeader.heading}
              as="h2"
              className="mt-2 text-4xl font-black tracking-[-0.04em]"
            />
          </div>
          <Text
            path="sections.featured.cta"
            value={featuredHeader.cta}
            className="text-sm font-bold underline underline-offset-4"
          />
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <ParallaxLayer
              key={product.id}
              speed={0.06 + (index % 2) * 0.04}
              mobileOnly
            >
            <article className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#e0c9a8]">
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
                {product.badge ? (
                  <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-[#17120d] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#f5efe6]">
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
                <p className="text-sm font-semibold text-[#8b5e34]">
                  {product.categoryName}
                </p>
                <Text
                  path={`products.${product.id}.name`}
                  value={product.name}
                  as="h3"
                  className="mt-1 text-xl font-black"
                />
                <Text
                  path={`products.${product.id}.description`}
                  value={product.description}
                  as="p"
                  multiline
                  className="mt-2 line-clamp-2 text-sm leading-6 text-[#5d5146]"
                />
                {editable ? (
                  <EditableText
                    path={`products.${product.id}.price`}
                    value={String(product.price)}
                    as="p"
                    className="mt-3 text-lg font-black"
                  />
                ) : (
                  <p className="mt-3 text-lg font-black">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
            </article>
            </ParallaxLayer>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-[#17120d] p-8 text-[#f5efe6] md:p-12">
          <Text
            path="sections.campaign.eyebrow"
            value={campaign.eyebrow ?? ""}
            as="p"
            className="text-sm font-bold uppercase tracking-[0.28em] text-[#d2bd9f]"
          />
          <Text
            path="sections.campaign.heading"
            value={campaign.heading}
            as="h2"
            className="mt-6 text-5xl font-black leading-none tracking-[-0.05em]"
          />
          <span className="mt-10 inline-flex rounded-full bg-[#f5efe6] px-7 py-4 text-sm font-bold text-[#17120d]">
            <Text path="sections.campaign.cta" value={campaign.cta} />
          </span>
        </div>
        <ParallaxLayer speed={0.16} mobileOnly>
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[#d2bd9f]">
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
          </div>
        </ParallaxLayer>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-20 md:grid-cols-3">
        {benefits.items.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="rounded-[1.5rem] border border-[#17120d]/10 bg-white/45 p-7"
          >
            <Text
              path={`sections.benefits.items.${index}.title`}
              value={item.title}
              as="h3"
              className="text-xl font-black"
            />
            <Text
              path={`sections.benefits.items.${index}.description`}
              value={item.description}
              as="p"
              multiline
              className="mt-3 leading-7 text-[#5d5146]"
            />
          </div>
        ))}
      </section>

      <section id="contacto" className="mx-auto max-w-7xl px-5 pb-20">
        <div className="rounded-[2rem] bg-[#f0dfc9] p-8 md:p-12">
          <Text
            path="sections.community.eyebrow"
            value={community.eyebrow}
            as="p"
            className="text-sm font-bold uppercase tracking-[0.28em] text-[#8b5e34]"
          />
          <div className="mt-5 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <Text
              path="sections.community.heading"
              value={community.heading}
              as="h2"
              className="text-5xl font-black tracking-[-0.05em]"
            />
            <div>
              <Text
                path="sections.community.description"
                value={community.description}
                as="p"
                multiline
                className="text-lg leading-8 text-[#5d5146]"
              />
              <span className="mt-8 inline-flex rounded-full bg-[#17120d] px-7 py-4 text-sm font-bold text-[#f5efe6]">
                <Text path="sections.community.cta" value={community.cta} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <aside className="mx-auto mb-20 max-w-7xl px-5">
        <div className="rounded-[1.5rem] border border-dashed border-[#17120d]/25 p-8 text-center">
          <Text
            path="settings.instagram"
            value={data.settings.instagram}
            as="p"
            className="text-sm font-bold uppercase tracking-[0.25em]"
          />
          <h2 className="mt-3 text-2xl font-black">Tu bolsa</h2>
          <p className="mt-2 text-[#5d5146]">
            Tu bolsa está vacía. Empezá a explorar la colección.
          </p>
        </div>
      </aside>

      <footer className="border-t border-[#17120d]/10 bg-[#17120d] px-5 py-12 text-[#f5efe6]">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Text
              path="settings.brandName"
              value={data.settings.brandName}
              as="h2"
              className="text-3xl font-black"
            />
            <Text
              path="sections.footer.description"
              value={footer.description}
              as="p"
              multiline
              className="mt-4 max-w-sm leading-7 text-[#d2bd9f]"
            />
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
        <div className="mx-auto mt-10 flex max-w-7xl justify-between border-t border-white/10 pt-6 text-sm text-[#d2bd9f]">
          <span>
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
    <h3 className="text-sm font-black uppercase tracking-[0.25em]">{title}</h3>
    <ul className="mt-4 space-y-3 text-[#d2bd9f]">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>
          {editable ? (
            <EditableText path={`${prefix}.${index}`} value={item} as="span" />
          ) : (
            item
          )}
        </li>
      ))}
    </ul>
  </div>
);
