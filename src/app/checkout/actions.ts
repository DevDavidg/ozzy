'use server';

import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { createPendingOrder } from '@/lib/orders';

export type CheckoutState = {
  ok: boolean;
  message: string;
  orderNumber?: string;
};

export const placeOrderAction = async (
  _state: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> => {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.CUSTOMER) {
    return {
      ok: false,
      message: 'Tenés que iniciar sesión para comprar.',
    };
  }

  const rawItems = formData.get('items')?.toString();

  if (!rawItems) {
    return { ok: false, message: 'Tu bolsa está vacía.' };
  }

  let lines: { productId: string; quantity: number }[];

  try {
    lines = JSON.parse(rawItems) as { productId: string; quantity: number }[];
  } catch {
    return { ok: false, message: 'No se pudo leer tu bolsa.' };
  }

  if (!Array.isArray(lines) || lines.length === 0) {
    return { ok: false, message: 'Tu bolsa está vacía.' };
  }

  const notes = formData.get('notes')?.toString();

  try {
    const order = await createPendingOrder(user.id, lines, notes);
    revalidatePath('/cuenta');
    revalidatePath('/admin/dashboard');
    redirect(`/checkout/exito?pedido=${encodeURIComponent(order.orderNumber)}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo crear el pedido. Intentá de nuevo.';
    return { ok: false, message };
  }
};
