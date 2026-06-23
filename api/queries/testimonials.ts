import { eq, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb, isDbAvailable } from "./connection";
import { testimonialsData, nextId } from "./memory-store";

export async function findTestimonials(status?: string) {
  if (!isDbAvailable()) {
    if (status) return testimonialsData.filter(t => t.status === status);
    return [...testimonialsData];
  }
  const db = getDb();
  if (status) {
    return db.select().from(schema.testimonials).where(eq(schema.testimonials.status, status as schema.Testimonial["status"])).orderBy(desc(schema.testimonials.createdAt));
  }
  return db.select().from(schema.testimonials).orderBy(desc(schema.testimonials.createdAt));
}

export async function createTestimonial(data: { name: string; email: string; text: string; verse?: string }) {
  if (!isDbAvailable()) {
    const newTestimonial = {
      id: nextId("testimonials"),
      name: data.name,
      email: data.email,
      text: data.text,
      verse: data.verse ?? null,
      status: "pending" as const,
      createdAt: new Date(),
    };
    testimonialsData.push(newTestimonial);
    return newTestimonial.id;
  }
  const db = getDb();
  const result = await db.insert(schema.testimonials).values({ ...data, status: "pending" });
  return Number(result[0].insertId);
}

export async function updateTestimonialStatus(id: number, status: string) {
  if (!isDbAvailable()) {
    const t = testimonialsData.find(t => t.id === id);
    if (t) (t as schema.Testimonial).status = status as schema.Testimonial["status"];
    return;
  }
  const db = getDb();
  await db.update(schema.testimonials).set({ status: status as schema.Testimonial["status"] }).where(eq(schema.testimonials.id, id));
}

export async function deleteTestimonial(id: number) {
  if (!isDbAvailable()) {
    const idx = testimonialsData.findIndex(t => t.id === id);
    if (idx >= 0) testimonialsData.splice(idx, 1);
    return;
  }
  const db = getDb();
  await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));
}
