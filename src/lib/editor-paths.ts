import type { SectionContent, SiteData } from '@/lib/types';

export type EditorPath = string;

export const setNestedValue = <T extends Record<string, unknown>>(
  obj: T,
  keys: string[],
  value: unknown,
): T => {
  if (keys.length === 0) {
    return obj;
  }

  if (keys.length === 1) {
    return { ...obj, [keys[0]]: value };
  }

  const [head, ...rest] = keys;
  const current = obj[head];

  if (Array.isArray(current)) {
    const index = Number(rest[0]);
    const clone = [...current];
    clone[index] =
      rest.length === 1
        ? value
        : setNestedValue(current[index] as Record<string, unknown>, rest.slice(1), value);
    return { ...obj, [head]: clone };
  }

  return {
    ...obj,
    [head]: setNestedValue(
      (current ?? {}) as Record<string, unknown>,
      rest,
      value,
    ),
  };
};

export const getNestedValue = (obj: unknown, keys: string[]): unknown => {
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (Array.isArray(current)) {
      current = current[Number(key)];
      continue;
    }

    current = (current as Record<string, unknown>)[key];
  }

  return current;
};

export const applyPathToSiteData = (
  data: SiteData,
  path: EditorPath,
  rawValue: string | number,
): SiteData => {
  const parts = path.split('.');

  if (parts[0] === 'settings') {
    const key = parts[1];
    return {
      ...data,
      settings: {
        ...data.settings,
        [key]: rawValue,
      },
    };
  }

  if (parts[0] === 'sections') {
    const sectionKey = parts[1];
    const section = data.sections[sectionKey];

    if (!section) {
      return data;
    }

    const contentKeys = parts.slice(2);
    const updatedContent = setNestedValue(
      section.content as Record<string, unknown>,
      contentKeys,
      rawValue,
    ) as SectionContent;

    return {
      ...data,
      sections: {
        ...data.sections,
        [sectionKey]: {
          ...section,
          content: updatedContent,
        },
      },
    };
  }

  if (parts[0] === 'products') {
    const productId = parts[1];
    const field = parts[2];

    return {
      ...data,
      products: data.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              [field]:
                field === 'price'
                  ? typeof rawValue === 'number'
                    ? rawValue
                    : Number.parseInt(String(rawValue).replace(/\D/g, ''), 10) || 0
                  : field === 'badge' && rawValue === ''
                    ? null
                    : rawValue,
            }
          : product,
      ),
    };
  }

  if (parts[0] === 'categories') {
    const categoryId = parts[1];
    const field = parts[2];

    return {
      ...data,
      categories: data.categories.map((category) =>
        category.id === categoryId ? { ...category, [field]: rawValue } : category,
      ),
    };
  }

  return data;
};
