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
  primaryCtaHref: string;
  secondaryCta: string;
  secondaryCtaHref: string;
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
  ctaHref: string;
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
  ctaHref: string;
};

export type BagContent = {
  emptyTitle: string;
  emptyDescription: string;
  emptyCta: string;
  emptyCtaHref: string;
  checkoutCta: string;
  checkoutHref: string;
};

export type FooterContent = {
  description: string;
  shopLinks: NavigationLink[];
  supportLinks: NavigationLink[];
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export type SectionContent =
  | HeroContent
  | TickerContent
  | HeaderContent
  | CampaignContent
  | BenefitsContent
  | CommunityContent
  | BagContent
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
  stock: number;
  badge: string | null;
  imageUrl: string;
  gallery: string[];
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
  categoryId: string;
  categoryName: string;
};

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'CANCELLED';

export type CustomerOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  createdAt: string;
  itemCount: number;
};

export type AdminOrderItem = {
  id: string;
  productName: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  notes: string | null;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  items: AdminOrderItem[];
};

export type CommerceStats = {
  totalOrders: number;
  pendingOrders: number;
  confirmedRevenue: number;
  totalUnitsSold: number;
  lowStockProducts: { id: string; name: string; stock: number }[];
};

export type SiteData = {
  settings: GlobalSettings;
  sections: Record<string, EditableSection>;
  categories: StoreCategory[];
  products: StoreProduct[];
};
