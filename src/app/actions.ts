'use server';

import { sql } from '@/lib/neon';

export const getData = async () => {
  const data = await sql`
    SELECT id, name, slug, price, "isVisible"
    FROM "Product"
    WHERE "isVisible" = true
    ORDER BY "sortOrder" ASC
    LIMIT 20
  `;
  return data;
};
