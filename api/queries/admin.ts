import { getDb, isDbAvailable } from "./connection";
import { productsData, testimonialsData, ordersData, collectionsData, blogPostsData } from "./memory-store";
import * as schema from "@db/schema";
import { sql, desc } from "drizzle-orm";

export async function getAdminStats() {
  if (!isDbAvailable()) {
    const totalRevenue = ordersData.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + Number(o.total), 0);
    return {
      totalRevenue,
      totalProducts: productsData.length,
      totalOrders: ordersData.length,
      totalCustomers: 0,
      totalTestimonials: testimonialsData.length,
      totalCollections: collectionsData.length,
      totalBlogPosts: blogPostsData.length,
      recentOrders: [...ordersData].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10),
    };
  }
  const db = getDb();
  const productsCount = await db.select({ count: sql<number>`count(*)` }).from(schema.products);
  const ordersCount = await db.select({ count: sql<number>`count(*)` }).from(schema.orders);
  const usersCount = await db.select({ count: sql<number>`count(*)` }).from(schema.users);
  const testimonialsCount = await db.select({ count: sql<number>`count(*)` }).from(schema.testimonials);
  const paidOrders = await db.select().from(schema.orders).where(sql`paymentStatus = 'paid'`);
  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const recentOrders = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).limit(10);

  return {
    totalRevenue,
    totalProducts: productsCount[0]?.count ?? 0,
    totalOrders: ordersCount[0]?.count ?? 0,
    totalCustomers: usersCount[0]?.count ?? 0,
    totalTestimonials: testimonialsCount[0]?.count ?? 0,
    totalCollections: collectionsData.length,
    totalBlogPosts: blogPostsData.length,
    recentOrders,
  };
}
