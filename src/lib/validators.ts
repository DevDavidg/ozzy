import { z } from 'zod';

export const globalSettingsSchema = z.object({
  brandName: z.string().min(1),
  instagram: z.string().min(1),
  announcement: z.string().min(1),
  navLinks: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string().min(1),
    }),
  ),
});

export const heroContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  primaryCta: z.string().min(1),
  secondaryCta: z.string().min(1),
  meta: z.string().min(1),
  counter: z.string().min(1),
  imageUrl: z.string().min(1),
});

export const tickerContentSchema = z.object({
  text: z.string().min(1),
});

export const headerContentSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  cta: z.string().min(1),
});

export const campaignContentSchema = headerContentSchema.extend({
  imageUrl: z.string().min(1),
});

export const benefitsContentSchema = z.object({
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1),
});

export const communityContentSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  description: z.string().min(1),
  cta: z.string().min(1),
});

export const footerContentSchema = z.object({
  description: z.string().min(1),
  shopLinks: z.array(z.string().min(1)).min(1),
  supportLinks: z.array(z.string().min(1)).min(1),
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().int().min(0),
  badge: z.string().nullable().optional(),
  imageUrl: z.string().min(1),
  isFeatured: z.coerce.boolean().default(false),
  isVisible: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  categoryId: z.string().min(1),
});

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  sortOrder: z.coerce.number().int().default(0),
  isVisible: z.coerce.boolean().default(true),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const sectionSchemaByKey = {
  hero: heroContentSchema,
  ticker: tickerContentSchema,
  categories: headerContentSchema,
  featured: headerContentSchema,
  campaign: campaignContentSchema,
  benefits: benefitsContentSchema,
  community: communityContentSchema,
  footer: footerContentSchema,
};
