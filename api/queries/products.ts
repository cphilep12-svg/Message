import { eq, and, like, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb, isDbAvailable } from "./connection";
import { productsData, variantsData } from "./memory-store";

export async function findProducts(filters?: { collection?: string; search?: string; status?: string; page?: number; limit?: number }) {
  if (!isDbAvailable()) {
    let result = [...productsData];
    if (filters?.status) result = result.filter(p => p.status === filters.status);
    else result = result.filter(p => p.status === "active");
    if (filters?.search) result = result.filter(p => p.name.toLowerCase().includes(filters.search!.toLowerCase()));
    return result;
  }
  const db = getDb();
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;
  const offset = (page - 1) * limit;

  let query = db.select().from(schema.products);
  const conditions = [];
  const statusValue = (filters?.status ?? "active") as "active" | "draft" | "archived";
  conditions.push(eq(schema.products.status, statusValue));
  if (filters?.search) conditions.push(like(schema.products.name, `%${filters.search}%`));

  if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;
  return query.orderBy(desc(schema.products.createdAt)).limit(limit).offset(offset);
}

export async function findProductBySlug(slug: string) {
  if (!isDbAvailable()) {
    const product = productsData.find(p => p.slug === slug);
    if (!product) return null;
    const variants = variantsData.filter(v => v.productId === product.id);
    return { ...product, variants };
  }
  const db = getDb();
  const rows = await db.select().from(schema.products).where(eq(schema.products.slug, slug)).limit(1);
  const product = rows.at(0);
  if (!product) return null;
  const variants = await db.select().from(schema.productVariants).where(eq(schema.productVariants.productId, product.id));
  return { ...product, variants };
}

export async function findFeaturedProducts() {
  if (!isDbAvailable()) {
    return productsData.filter(p => p.isFeatured && p.status === "active");
  }
  const db = getDb();
  return db.select().from(schema.products).where(and(eq(schema.products.isFeatured, true), eq(schema.products.status, "active")));
}

export async function findProductVariants(productId: number) {
  if (!isDbAvailable()) return variantsData.filter(v => v.productId === productId);
  const db = getDb();
  return db.select().from(schema.productVariants).where(eq(schema.productVariants.productId, productId));
}

export async function createProduct(data: schema.InsertProduct) {
  if (!isDbAvailable()) {
    const newProduct = { ...data, id: productsData.length + 1, createdAt: new Date(), updatedAt: new Date() } as schema.Product;
    productsData.push(newProduct);
    return { insertId: BigInt(newProduct.id) };
  }
  const db = getDb();
  return db.insert(schema.products).values(data);
}

export async function updateProduct(id: number, data: Partial<schema.InsertProduct>) {
  if (!isDbAvailable()) {
    const idx = productsData.findIndex(p => p.id === id);
    if (idx >= 0) productsData[idx] = { ...productsData[idx], ...data, updatedAt: new Date() } as schema.Product;
    return;
  }
  const db = getDb();
  await db.update(schema.products).set(data).where(eq(schema.products.id, id));
}

export async function deleteProduct(id: number) {
  if (!isDbAvailable()) {
    const idx = productsData.findIndex(p => p.id === id);
    if (idx >= 0) productsData.splice(idx, 1);
    return;
  }
  const db = getDb();
  await db.delete(schema.products).where(eq(schema.products.id, id));
}
