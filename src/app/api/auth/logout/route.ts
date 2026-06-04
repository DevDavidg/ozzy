import { redirect } from 'next/navigation';

import { destroySession } from '@/lib/auth';

export const POST = async () => {
  await destroySession();
  redirect('/login');
};
