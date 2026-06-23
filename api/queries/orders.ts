import { eq, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb, isDbAvailable } from "./connection";
import { ordersData, nextId } from "./memory-store";

export async function createOrder(data: {
  userId?: number | null;
  orderNumber: string;
  subtotal: number;
  total: number;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  shippingAddress?: Record<string, string> | null;
  billingAddress?: Record<string, string> | null;
  shippingCost?: number;
}) {
  if (!isDbAvailable()) {
    const newOrder = {
      id: nextId("orders"),
      userId: data.userId ?? null,
      orderNumber: data.orderNumber,
      subtotal: String(data.subtotal),
      total: String(data.total),
      shippingCost: String(data.shippingCost ?? 0),
      customerName: data.customerName ?? null,
      customerEmail: data.customerEmail ?? null,
      customerPhone: data.customerPhone ?? null,
      shippingAddress: data.shippingAddress ?? null,
      billingAddress: data.billingAddress ?? null,
      notes: null,
      status: "pending" as const,
      paymentStatus: "pending" as const,
      paymentMethod: null as "yoco" | "payfast" | "stripe" | null,
      paymentRef: null,
      shippingMethod: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    ordersData.push(newOrder);
    return newOrder.id;
  }
  const db = getDb();
  const result = await db.insert(schema.orders).values({
    ...data,
    shippingCost: String(data.shippingCost ?? 0),
    subtotal: String(data.subtotal),
    total: String(data.total),
  });
  return Number(result[0].insertId);
}

export async function createOrderItems(orderId: number, items: Array<{
  productId: number;
  variantId?: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  subtotal: number;
}>) {
  if (!isDbAvailable()) return;
  const db = getDb();
  for (const item of items) {
    await db.insert(schema.orderItems).values({
      ...item,
      orderId,
      price: String(item.price),
      subtotal: String(item.subtotal),
    });
  }
}

export async function findOrderById(id: number) {
  if (!isDbAvailable()) {
    const order = ordersData.find(o => o.id === id);
    return order ?? null;
  }
  const db = getDb();
  const rows = await db.select().from(schema.orders).where(eq(schema.orders.id, id)).limit(1);
  if (!rows[0]) return null;
  const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, id));
  return { ...rows[0], items };
}

export async function findOrderByNumber(orderNumber: string) {
  if (!isDbAvailable()) {
    const order = ordersData.find(o => o.orderNumber === orderNumber);
    return order ?? null;
  }
  const db = getDb();
  const rows = await db.select().from(schema.orders).where(eq(schema.orders.orderNumber, orderNumber)).limit(1);
  if (!rows[0]) return null;
  const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, rows[0].id));
  return { ...rows[0], items };
}

export async function findOrders(filters?: { status?: string; page?: number; limit?: number }) {
  if (!isDbAvailable()) {
    let result = [...ordersData];
    if (filters?.status) result = result.filter(o => o.status === filters.status);
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  const db = getDb();
  const limit = filters?.limit ?? 20;
  const offset = ((filters?.page ?? 1) - 1) * limit;
  let query = db.select().from(schema.orders);
  if (filters?.status) {
    query = query.where(eq(schema.orders.status, filters.status as schema.Order["status"])) as typeof query;
  }
  return query.orderBy(desc(schema.orders.createdAt)).limit(limit).offset(offset);
}

export async function updateOrderStatus(id: number, status: string) {
  if (!isDbAvailable()) {
    const order = ordersData.find(o => o.id === id);
    if (order) order.status = status as schema.Order["status"];
    return;
  }
  const db = getDb();
  await db.update(schema.orders).set({ status: status as schema.Order["status"] }).where(eq(schema.orders.id, id));
}

export async function updatePaymentStatus(id: number, paymentStatus: string, paymentRef?: string) {
  if (!isDbAvailable()) {
    const order = ordersData.find(o => o.id === id);
    if (order) {
      order.paymentStatus = paymentStatus as schema.Order["paymentStatus"];
      if (paymentRef) order.paymentRef = paymentRef;
    }
    return;
  }
  const db = getDb();
  const updates: Record<string, unknown> = { paymentStatus: paymentStatus as schema.Order["paymentStatus"] };
  if (paymentRef) updates.paymentRef = paymentRef;
  await db.update(schema.orders).set(updates).where(eq(schema.orders.id, id));
}

export async function getOrderStats() {
  const allOrders = isDbAvailable() ? await findOrders() : ordersData;
  const totalRevenue = allOrders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = allOrders.length;
  return { totalRevenue, totalOrders };
}
