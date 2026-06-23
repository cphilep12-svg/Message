import { eq, and } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb, isDbAvailable } from "./connection";
import { cartsData, cartItemsData, productsData, nextId } from "./memory-store";

export async function findOrCreateCart(sessionId?: string, userId?: number) {
  if (!isDbAvailable()) {
    const existing = cartsData.find(c =>
      (userId && c.userId === userId && c.status === "active") ||
      (sessionId && c.sessionId === sessionId && c.status === "active")
    );
    if (existing) return existing;
    const newCart = {
      id: nextId("carts"),
      userId: userId ?? null,
      sessionId: sessionId || crypto.randomUUID(),
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    cartsData.push(newCart);
    return newCart;
  }
  const db = getDb();
  if (userId) {
    const existing = await db.select().from(schema.carts).where(and(eq(schema.carts.userId, userId), eq(schema.carts.status, "active"))).limit(1);
    if (existing.at(0)) return existing[0];
  }
  if (sessionId) {
    const existing = await db.select().from(schema.carts).where(and(eq(schema.carts.sessionId, sessionId), eq(schema.carts.status, "active"))).limit(1);
    if (existing.at(0)) return existing[0];
  }
  const newSessionId = sessionId || crypto.randomUUID();
  const result = await db.insert(schema.carts).values({ userId: userId || null, sessionId: newSessionId, status: "active" });
  const inserted = await db.select().from(schema.carts).where(eq(schema.carts.id, Number(result[0].insertId))).limit(1);
  return inserted[0];
}

export async function getCartWithItems(cartId: number) {
  if (!isDbAvailable()) {
    const cart = cartsData.find(c => c.id === cartId);
    if (!cart) return null;
    const items = cartItemsData.filter(i => i.cartId === cartId);
    const itemsWithProducts = items.map(item => ({
      ...item,
      product: productsData.find(p => p.id === item.productId),
    }));
    return { ...cart, items: itemsWithProducts };
  }
  const db = getDb();
  const cart = await db.select().from(schema.carts).where(eq(schema.carts.id, cartId)).limit(1);
  if (!cart[0]) return null;
  const items = await db.select().from(schema.cartItems).where(eq(schema.cartItems.cartId, cartId));
  const allProducts = await db.select().from(schema.products);
  const itemsWithProducts = items.map(item => ({
    ...item,
    product: allProducts.find(p => p.id === item.productId),
  }));
  return { ...cart[0], items: itemsWithProducts };
}

export async function addCartItem(cartId: number, productId: number, variantId: number | null, quantity: number, price: number) {
  if (!isDbAvailable()) {
    const existing = cartItemsData.find(i => i.cartId === cartId && i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
      return existing.id;
    }
    const newItem = {
      id: nextId("cartItems"),
      cartId,
      productId,
      variantId: variantId ?? null,
      quantity,
      price: String(price),
      createdAt: new Date(),
    };
    cartItemsData.push(newItem);
    return newItem.id;
  }
  const db = getDb();
  const existing = await db.select().from(schema.cartItems).where(and(eq(schema.cartItems.cartId, cartId), eq(schema.cartItems.productId, productId))).limit(1);
  if (existing[0]) {
    await db.update(schema.cartItems).set({ quantity: existing[0].quantity + quantity }).where(eq(schema.cartItems.id, existing[0].id));
    return existing[0].id;
  }
  const result = await db.insert(schema.cartItems).values({ cartId, productId, variantId, quantity, price: String(price) });
  return Number(result[0].insertId);
}

export async function updateCartItem(itemId: number, quantity: number) {
  if (!isDbAvailable()) {
    const item = cartItemsData.find(i => i.id === itemId);
    if (item) item.quantity = quantity;
    return;
  }
  const db = getDb();
  await db.update(schema.cartItems).set({ quantity }).where(eq(schema.cartItems.id, itemId));
}

export async function removeCartItem(itemId: number) {
  if (!isDbAvailable()) {
    const idx = cartItemsData.findIndex(i => i.id === itemId);
    if (idx >= 0) cartItemsData.splice(idx, 1);
    return;
  }
  const db = getDb();
  await db.delete(schema.cartItems).where(eq(schema.cartItems.id, itemId));
}

export async function clearCart(cartId: number) {
  if (!isDbAvailable()) {
    for (let i = cartItemsData.length - 1; i >= 0; i--) {
      if (cartItemsData[i].cartId === cartId) cartItemsData.splice(i, 1);
    }
    return;
  }
  const db = getDb();
  await db.delete(schema.cartItems).where(eq(schema.cartItems.cartId, cartId));
}

export async function getCartItemCount(cartId: number) {
  if (!isDbAvailable()) {
    return cartItemsData.filter(i => i.cartId === cartId).reduce((sum, item) => sum + item.quantity, 0);
  }
  const db = getDb();
  const items = await db.select().from(schema.cartItems).where(eq(schema.cartItems.cartId, cartId));
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
