import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const productImages = [
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
];

const main = async () => {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@ozzygist.local';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin12345';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: 'Admin Ozzy Gist', passwordHash },
    create: { email: adminEmail, name: 'Admin Ozzy Gist', passwordHash },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'global' },
    update: {
      value: {
        brandName: 'Ozzy Gist',
        instagram: '@ozzygist',
        announcement:
          'Envío gratis desde $120.000 · Cambios sin cargo · Nueva colección — Otoño 26 · Pagá hasta en 6 cuotas',
        navLinks: [
          { label: 'Inicio', href: '#inicio' },
          { label: 'Tienda', href: '#tienda' },
          { label: 'Contacto', href: '#contacto' },
          { label: 'Mi cuenta', href: '/login' },
        ],
      },
    },
    create: {
      key: 'global',
      value: {
        brandName: 'Ozzy Gist',
        instagram: '@ozzygist',
        announcement:
          'Envío gratis desde $120.000 · Cambios sin cargo · Nueva colección — Otoño 26 · Pagá hasta en 6 cuotas',
        navLinks: [
          { label: 'Inicio', href: '#inicio' },
          { label: 'Tienda', href: '#tienda' },
          { label: 'Contacto', href: '#contacto' },
          { label: 'Mi cuenta', href: '/login' },
        ],
      },
    },
  });

  const sections = [
    {
      key: 'hero',
      title: 'Hero principal',
      sortOrder: 1,
      content: {
        eyebrow: 'Colección Otoño / 26',
        title: 'Esenciales, construidos para durar.',
        description:
          'Una colección reducida de piezas pesadas, cortes caídos y paletas cálidas. Fabricado en cantidades limitadas.',
        primaryCta: 'Comprar ahora',
        secondaryCta: 'Ver hoodies',
        meta: 'Argentina · Envíos a todo el país',
        counter: '006 / 24',
        imageUrl:
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80',
      },
    },
    {
      key: 'ticker',
      title: 'Cinta de beneficios',
      sortOrder: 2,
      content: {
        text: 'Premium Heavyweight Cotton ✦ Made in Argentina ✦ Limited Quantities ✦ Designed to Last ✦',
      },
    },
    {
      key: 'categories',
      title: 'Categorías',
      sortOrder: 3,
      content: {
        heading: 'Categorías',
        cta: 'Ver todo',
      },
    },
    {
      key: 'featured',
      title: 'Productos destacados',
      sortOrder: 4,
      content: {
        eyebrow: 'Destacados',
        heading: 'Lo más buscado',
        cta: 'Ver todos',
      },
    },
    {
      key: 'campaign',
      title: 'Campaña',
      sortOrder: 5,
      content: {
        eyebrow: 'Campaña 006',
        heading: 'Para los que se mueven sin apuro.',
        cta: 'Ver colección',
        imageUrl:
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=80',
      },
    },
    {
      key: 'benefits',
      title: 'Beneficios',
      sortOrder: 6,
      content: {
        items: [
          {
            title: 'Envío gratis',
            description: 'En compras desde $120.000 a todo el país.',
          },
          {
            title: 'Cambios fáciles',
            description: '30 días para cambiar tu compra.',
          },
          {
            title: 'Compra protegida',
            description: 'Pago seguro vía Mercado Pago.',
          },
        ],
      },
    },
    {
      key: 'community',
      title: 'Comunidad',
      sortOrder: 7,
      content: {
        eyebrow: '@ozzygist',
        heading: 'Comunidad',
        description:
          'Piezas esenciales para el día a día. Construidas con materiales premium en cantidades limitadas.',
        cta: 'Suscribirse',
      },
    },
    {
      key: 'footer',
      title: 'Footer',
      sortOrder: 8,
      content: {
        description:
          'Piezas esenciales para el día a día. Construidas con materiales premium en cantidades limitadas.',
        shopLinks: ['Todos', 'Hoodies', 'Pantalones', 'Accesorios'],
        supportLinks: ['Contacto', 'Envíos', 'Cambios y devoluciones', 'Guía de talles'],
      },
    },
  ];

  for (const section of sections) {
    await prisma.pageSection.upsert({
      where: { key: section.key },
      update: section,
      create: section,
    });
  }

  const categories = [
    { name: 'Hoodies', slug: 'hoodies', sortOrder: 1 },
    { name: 'Pantalones', slug: 'pantalones', sortOrder: 2 },
    { name: 'Remeras', slug: 'remeras', sortOrder: 3 },
    { name: 'Abrigos', slug: 'abrigos', sortOrder: 4 },
  ];

  const categoryRows = new Map<string, string>();

  for (const category of categories) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryRows.set(category.slug, row.id);
  }

  const products = [
    {
      name: 'Essential Hoodie — Cream',
      slug: 'essential-hoodie-cream',
      description: 'Hoodie pesado de algodón premium con calce relajado.',
      price: 89000,
      badge: 'Nuevo',
      categorySlug: 'hoodies',
      imageUrl: productImages[0],
      sortOrder: 1,
    },
    {
      name: 'Essential Hoodie — Black',
      slug: 'essential-hoodie-black',
      description: 'Hoodie negro de estructura firme y terminación suave.',
      price: 89000,
      badge: null,
      categorySlug: 'hoodies',
      imageUrl: productImages[1],
      sortOrder: 2,
    },
    {
      name: 'Wide-Leg Sweatpants',
      slug: 'wide-leg-sweatpants',
      description: 'Pantalón wide-leg con cintura elastizada y caída amplia.',
      price: 74000,
      badge: 'Nuevo',
      categorySlug: 'pantalones',
      imageUrl: productImages[2],
      sortOrder: 3,
    },
    {
      name: 'Boxy Heavy Tee',
      slug: 'boxy-heavy-tee',
      description: 'Remera boxy de algodón pesado, cuello reforzado.',
      price: 38000,
      badge: null,
      categorySlug: 'remeras',
      imageUrl: productImages[3],
      sortOrder: 4,
    },
  ];

  for (const product of products) {
    const categoryId = categoryRows.get(product.categorySlug);

    if (!categoryId) {
      throw new Error(`Missing category ${product.categorySlug}`);
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        badge: product.badge,
        categoryId,
        imageUrl: product.imageUrl,
        gallery: [product.imageUrl],
        isFeatured: true,
        sortOrder: product.sortOrder,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        badge: product.badge,
        categoryId,
        imageUrl: product.imageUrl,
        gallery: [product.imageUrl],
        isFeatured: true,
        sortOrder: product.sortOrder,
      },
    });
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
