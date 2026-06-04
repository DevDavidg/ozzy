import 'server-only';

import { OrderStatus, type Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import type { AdminOrder, CommerceStats, CustomerOrder } from '@/lib/types';

const orderNumberPrefix = 'OZ';

export const generateOrderNumber = async () => {
  const count = await prisma.order.count();
  const sequence = String(count + 1).padStart(5, '0');
  return `${orderNumberPrefix}-${sequence}`;
};

export const getCustomerOrders = async (userId: string): Promise<CustomerOrder[]> => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    createdAt: order.createdAt.toISOString(),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
  }));
};

export const getAdminOrders = async (): Promise<AdminOrder[]> => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    notes: order.notes,
    createdAt: order.createdAt.toISOString(),
    customerName: order.user.name,
    customerEmail: order.user.email,
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      productSlug: item.productSlug,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    })),
  }));
};

export const getCommerceStats = async (): Promise<CommerceStats> => {
  const [totalOrders, pendingOrders, confirmedOrders, soldItems, lowStockProducts] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      prisma.order.findMany({
        where: { status: { in: [OrderStatus.CONFIRMED, OrderStatus.SHIPPED] } },
        select: { subtotal: true },
      }),
      prisma.orderItem.aggregate({
        where: {
          order: { status: { in: [OrderStatus.CONFIRMED, OrderStatus.SHIPPED] } },
        },
        _sum: { quantity: true },
      }),
      prisma.product.findMany({
        where: { isVisible: true, stock: { lte: 5 } },
        orderBy: { stock: 'asc' },
        take: 10,
        select: { id: true, name: true, stock: true },
      }),
    ]);

  return {
    totalOrders,
    pendingOrders,
    confirmedRevenue: confirmedOrders.reduce((sum, order) => sum + order.subtotal, 0),
    totalUnitsSold: soldItems._sum.quantity ?? 0,
    lowStockProducts,
  };
};

const restoreStockForOrder = async (
  tx: Prisma.TransactionClient,
  orderId: string,
) => {
  const items = await tx.orderItem.findMany({ where: { orderId } });

  for (const item of items) {
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
};

const deductStockForOrder = async (
  tx: Prisma.TransactionClient,
  orderId: string,
) => {
  const items = await tx.orderItem.findMany({ where: { orderId } });

  for (const item of items) {
    const product = await tx.product.findUnique({ where: { id: item.productId } });

    if (!product || product.stock < item.quantity) {
      throw new Error(`Stock insuficiente para ${item.productName}`);
    }

    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }
};

export const updateOrderStatus = async (
  orderId: string,
  nextStatus: OrderStatus,
  notes?: string | null,
) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    const previousStatus = order.status;

    if (previousStatus === nextStatus) {
      return order;
    }

    const wasStockDeducted =
      previousStatus === OrderStatus.CONFIRMED || previousStatus === OrderStatus.SHIPPED;
    const willDeductStock =
      nextStatus === OrderStatus.CONFIRMED || nextStatus === OrderStatus.SHIPPED;

    if (!wasStockDeducted && willDeductStock) {
      await deductStockForOrder(tx, orderId);
    }

    if (wasStockDeducted && nextStatus === OrderStatus.CANCELLED) {
      await restoreStockForOrder(tx, orderId);
    }

    return tx.order.update({
      where: { id: orderId },
      data: {
        status: nextStatus,
        ...(notes !== undefined ? { notes } : {}),
      },
    });
  });
};

export type CheckoutLine = {
  productId: string;
  quantity: number;
};

export const createPendingOrder = async (
  userId: string,
  lines: CheckoutLine[],
  notes?: string,
) => {
  if (lines.length === 0) {
    throw new Error('La bolsa está vacía');
  }

  const productIds = lines.map((line) => line.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isVisible: true },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  let subtotal = 0;
  const orderItems: {
    productId: string;
    productName: string;
    productSlug: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[] = [];

  for (const line of lines) {
    const product = productMap.get(line.productId);

    if (!product) {
      throw new Error('Un producto de tu bolsa ya no está disponible');
    }

    if (product.stock < line.quantity) {
      throw new Error(`Stock insuficiente para ${product.name}`);
    }

    const lineTotal = product.price * line.quantity;
    subtotal += lineTotal;

    orderItems.push({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      unitPrice: product.price,
      quantity: line.quantity,
      lineTotal,
    });
  }

  const orderNumber = await generateOrderNumber();

  return prisma.order.create({
    data: {
      orderNumber,
      status: OrderStatus.PENDING,
      subtotal,
      userId,
      notes: notes?.trim() || null,
      items: { create: orderItems },
    },
    include: { items: true },
  });
};
