'use server';

import { OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth';
import { updateOrderStatus } from '@/lib/orders';

const revalidateCommerce = () => {
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/manage');
  revalidatePath('/cuenta');
  revalidatePath('/tienda');
};

export const updateOrderStatusAction = async (formData: FormData) => {
  await requireAdmin();

  const orderId = formData.get('orderId')?.toString();
  const status = formData.get('status')?.toString() as OrderStatus | undefined;
  const notes = formData.get('notes')?.toString();

  if (!orderId || !status) {
    return;
  }

  const validStatuses: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.SHIPPED,
    OrderStatus.CANCELLED,
  ];

  if (!validStatuses.includes(status)) {
    return;
  }

  try {
    await updateOrderStatus(orderId, status, notes ?? null);
    revalidateCommerce();
  } catch (error) {
    console.error('[commerce] updateOrderStatus:', error);
    throw error;
  }
};
