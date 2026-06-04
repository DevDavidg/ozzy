import type { OrderStatus } from '@/lib/types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente (WIP)',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  CANCELLED: 'Cancelado',
};
