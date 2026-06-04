import {
  updateBagAction,
  updateBenefitsAction,
  updateCampaignAction,
  updateCommunityAction,
  updateFooterAction,
  updateHeaderSectionAction,
  updateHeroAction,
  updateSettingsAction,
  updateTickerAction,
} from '@/app/admin/actions';
import { Card, Field, SaveButton, TextArea } from '@/components/admin/admin-fields';
import type {
  BagContent,
  BenefitsContent,
  CampaignContent,
  CommunityContent,
  FooterContent,
  GlobalSettings,
  HeaderContent,
  HeroContent,
  SiteData,
  TickerContent,
} from '@/lib/types';

const getContent = <T,>(data: SiteData, key: string) => data.sections[key]?.content as T;

const formatFooterLinks = (links: FooterContent['shopLinks']) =>
  links.map((link) => `${link.label}|${link.href}`).join('\n');

export const ContentForms = ({ data }: { data: SiteData }) => {
  const hero = getContent<HeroContent>(data, 'hero');
  const ticker = getContent<TickerContent>(data, 'ticker');
  const categories = getContent<HeaderContent>(data, 'categories');
  const featured = getContent<HeaderContent>(data, 'featured');
  const campaign = getContent<CampaignContent>(data, 'campaign');
  const benefits = getContent<BenefitsContent>(data, 'benefits');
  const community = getContent<CommunityContent>(data, 'community');
  const bag = getContent<BagContent>(data, 'bag');
  const footer = getContent<FooterContent>(data, 'footer');

  return (
    <div className="grid gap-6">
      <SettingsForm settings={data.settings} />
      <Card title="Hero principal">
        <form action={updateHeroAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow" name="eyebrow" defaultValue={hero.eyebrow} />
          <Field label="Contador" name="counter" defaultValue={hero.counter} />
          <Field label="Título" name="title" defaultValue={hero.title} />
          <Field label="Meta" name="meta" defaultValue={hero.meta} />
          <TextArea label="Descripción" name="description" defaultValue={hero.description} />
          <Field label="Imagen" name="imageUrl" defaultValue={hero.imageUrl} />
          <Field label="CTA principal" name="primaryCta" defaultValue={hero.primaryCta} />
          <Field
            label="CTA principal enlace"
            name="primaryCtaHref"
            defaultValue={hero.primaryCtaHref}
          />
          <Field label="CTA secundario" name="secondaryCta" defaultValue={hero.secondaryCta} />
          <Field
            label="CTA secundario enlace"
            name="secondaryCtaHref"
            defaultValue={hero.secondaryCtaHref}
          />
          <div className="md:col-span-2">
            <SaveButton />
          </div>
        </form>
      </Card>

      <Card title="Cintas y headers">
        <div className="grid gap-6 md:grid-cols-3">
          <form action={updateTickerAction} className="space-y-4">
            <TextArea label="Ticker" name="text" defaultValue={ticker.text} />
            <SaveButton />
          </form>
          <form action={updateHeaderSectionAction.bind(null, 'categories')} className="space-y-4">
            <Field label="Categorías título" name="heading" defaultValue={categories.heading} />
            <Field label="Categorías CTA" name="cta" defaultValue={categories.cta} />
            <Field label="Categorías enlace" name="ctaHref" defaultValue={categories.ctaHref} />
            <SaveButton />
          </form>
          <form action={updateHeaderSectionAction.bind(null, 'featured')} className="space-y-4">
            <Field label="Destacados eyebrow" name="eyebrow" defaultValue={featured.eyebrow ?? ''} required={false} />
            <Field label="Destacados título" name="heading" defaultValue={featured.heading} />
            <Field label="Destacados CTA" name="cta" defaultValue={featured.cta} />
            <Field label="Destacados enlace" name="ctaHref" defaultValue={featured.ctaHref} />
            <SaveButton />
          </form>
        </div>
      </Card>

      <Card title="Campaña">
        <form action={updateCampaignAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow" name="eyebrow" defaultValue={campaign.eyebrow ?? ''} />
          <Field label="Título" name="heading" defaultValue={campaign.heading} />
          <Field label="CTA" name="cta" defaultValue={campaign.cta} />
          <Field label="CTA enlace" name="ctaHref" defaultValue={campaign.ctaHref} />
          <Field label="Imagen" name="imageUrl" defaultValue={campaign.imageUrl} />
          <div className="md:col-span-2">
            <SaveButton />
          </div>
        </form>
      </Card>

      <Card title="Beneficios">
        <form action={updateBenefitsAction} className="grid gap-4 md:grid-cols-3">
          {benefits.items.map((item, index) => (
            <div key={item.title} className="space-y-4 rounded-2xl border border-border bg-muted/20 p-4">
              <Field label={`Título ${index + 1}`} name={`benefitTitle${index}`} defaultValue={item.title} />
              <TextArea
                label={`Descripción ${index + 1}`}
                name={`benefitDescription${index}`}
                defaultValue={item.description}
              />
            </div>
          ))}
          <div className="md:col-span-3">
            <SaveButton />
          </div>
        </form>
      </Card>

      <Card title="Comunidad, bolsa y footer">
        <div className="grid gap-6 md:grid-cols-3">
          <form action={updateCommunityAction} className="space-y-4">
            <Field label="Eyebrow" name="eyebrow" defaultValue={community.eyebrow} />
            <Field label="Título" name="heading" defaultValue={community.heading} />
            <TextArea label="Descripción" name="description" defaultValue={community.description} />
            <Field label="CTA" name="cta" defaultValue={community.cta} />
            <Field label="CTA enlace" name="ctaHref" defaultValue={community.ctaHref} />
            <SaveButton />
          </form>
          <form action={updateBagAction} className="space-y-4">
            <Field label="Título bolsa vacía" name="emptyTitle" defaultValue={bag?.emptyTitle ?? 'Tu bolsa'} />
            <TextArea
              label="Descripción bolsa vacía"
              name="emptyDescription"
              defaultValue={bag?.emptyDescription ?? ''}
            />
            <Field label="CTA explorar" name="emptyCta" defaultValue={bag?.emptyCta ?? ''} />
            <Field label="Enlace explorar" name="emptyCtaHref" defaultValue={bag?.emptyCtaHref ?? '/tienda'} />
            <Field label="CTA checkout" name="checkoutCta" defaultValue={bag?.checkoutCta ?? ''} />
            <Field label="Enlace checkout" name="checkoutHref" defaultValue={bag?.checkoutHref ?? '/#contacto'} />
            <SaveButton />
          </form>
          <form action={updateFooterAction} className="space-y-4">
            <TextArea label="Descripción footer" name="description" defaultValue={footer.description} />
            <TextArea
              label="Links tienda (label|href, uno por línea)"
              name="shopLinks"
              defaultValue={formatFooterLinks(footer.shopLinks)}
            />
            <TextArea
              label="Links soporte (label|href, uno por línea)"
              name="supportLinks"
              defaultValue={formatFooterLinks(footer.supportLinks)}
            />
            <SaveButton />
          </form>
        </div>
      </Card>
    </div>
  );
};

const SettingsForm = ({ settings }: { settings: GlobalSettings }) => (
  <Card title="Ajustes globales">
    <form action={updateSettingsAction} className="grid gap-4 md:grid-cols-2">
      <Field label="Marca" name="brandName" defaultValue={settings.brandName} />
      <Field label="Instagram" name="instagram" defaultValue={settings.instagram} />
      <TextArea label="Anuncio superior" name="announcement" defaultValue={settings.announcement} />
      <TextArea
        label="Navegación (label|href, uno por línea)"
        name="navLinks"
        defaultValue={settings.navLinks.map((link) => `${link.label}|${link.href}`).join('\n')}
      />
      <div className="md:col-span-2">
        <SaveButton />
      </div>
    </form>
  </Card>
);
