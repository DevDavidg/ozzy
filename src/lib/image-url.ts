export const isUnoptimizedImageUrl = (url: string) =>
  url.startsWith('/uploads/') || url.includes('.blob.vercel-storage.com');
