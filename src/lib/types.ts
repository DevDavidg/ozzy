export type NavigationLink = {
  label: string;
  href: string;
};

export type GlobalSettings = {
  brandName: string;
  instagram: string;
  announcement: string;
  navLinks: NavigationLink[];
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  meta: string;
  counter: string;
  imageUrl: string;
};

export type TickerContent = {
  text: string;
};

export type HeaderContent = {
  eyebrow?: string;
  heading: string;
  cta: string;
};

export type CampaignContent = HeaderContent & {
  imageUrl: string;
};

export type BenefitItem = {
  title: string;
  description: string;
};

export type BenefitsContent = {
  items: BenefitItem[];
};

export type CommunityContent = {
  eyebrow: string;
  heading: string;
  description: string;
  cta: string;
};

export type FooterContent = {
  description: string;
  shopLinks: string[];
  supportLinks: string[];
};

export type SectionContent =
  | HeroContent
  | TickerContent
  | HeaderContent
  | CampaignContent
  | BenefitsContent
  | CommunityContent
  | FooterContent;

export type EditableSection = {
  id: string;
  key: string;
  title: string;
  sortOrder: number;
  isVisible: boolean;
  content: SectionContent;
};

export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isVisible: boolean;
};

export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  badge: string | null;
  imageUrl: string;
  gallery: string[];
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
  categoryId: string;
  categoryName: string;
};

export type SiteData = {
  settings: GlobalSettings;
  sections: Record<string, EditableSection>;
  categories: StoreCategory[];
  products: StoreProduct[];
};
