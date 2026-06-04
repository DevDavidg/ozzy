import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Blob storage not configured' }, { status: 503 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'image/avif',
        ],
        maximumSizeInBytes: MAX_IMAGE_BYTES,
        tokenPayload: JSON.stringify({ userId: user.id }),
      }),
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 },
    );
  }
}
