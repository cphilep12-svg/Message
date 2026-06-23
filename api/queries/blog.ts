import { eq, desc, and } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb, isDbAvailable } from "./connection";
import { blogPostsData } from "./memory-store";

export async function findBlogPosts(filters?: { category?: string; status?: string; page?: number; limit?: number }) {
  if (!isDbAvailable()) {
    let result = [...blogPostsData];
    if (filters?.category) result = result.filter(b => b.category === filters.category);
    if (filters?.status) result = result.filter(b => b.status === filters.status);
    else result = result.filter(b => b.status === "published");
    return result.sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
  }
  const db = getDb();
  const limit = filters?.limit ?? 10;
  const offset = ((filters?.page ?? 1) - 1) * limit;

  let query = db.select().from(schema.blogPosts);
  const conditions = [];
  if (filters?.category) conditions.push(eq(schema.blogPosts.category, filters.category as schema.BlogPost["category"]));
  if (filters?.status) conditions.push(eq(schema.blogPosts.status, filters.status as schema.BlogPost["status"]));
  else conditions.push(eq(schema.blogPosts.status, "published"));

  if (conditions.length > 0) query = query.where(and(...conditions)) as typeof query;
  return query.orderBy(desc(schema.blogPosts.publishedAt)).limit(limit).offset(offset);
}

export async function findBlogPostBySlug(slug: string) {
  if (!isDbAvailable()) return blogPostsData.find(b => b.slug === slug) ?? null;
  const db = getDb();
  const rows = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, slug)).limit(1);
  return rows.at(0) ?? null;
}
