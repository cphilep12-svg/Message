import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb, isDbAvailable } from "./connection";
import { collectionsData, productCollectionsData, productsData } from "./memory-store";

export async function findCollections() {
  if (!isDbAvailable()) return [...collectionsData];
  const db = getDb();
  return db.select().from(schema.collections).orderBy(schema.collections.sortOrder);
}

export async function findCollectionBySlug(slug: string) {
  if (!isDbAvailable()) return collectionsData.find(c => c.slug === slug) ?? null;
  const db = getDb();
  const rows = await db.select().from(schema.collections).where(eq(schema.collections.slug, slug)).limit(1);
  return rows.at(0) ?? null;
}

export async function findProductsByCollectionSlug(slug: string) {
  if (!isDbAvailable()) {
    const collection = collectionsData.find(c => c.slug === slug);
    if (!collection) return [];
    const productIds = productCollectionsData.filter(j => j.collectionId === collection.id).map(j => j.productId);
    return productsData.filter(p => productIds.includes(p.id) && p.status === "active");
  }
  const db = getDb();
  const collection = await findCollectionBySlug(slug);
  if (!collection) return [];
  const junctions = await db.select().from(schema.productCollections).where(eq(schema.productCollections.collectionId, collection.id));
  if (junctions.length === 0) return [];
  const productIds = junctions.map(j => j.productId);
  const products = await db.select().from(schema.products);
  return products.filter(p => productIds.includes(p.id) && p.status === "active");
}
