import { eq, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb, isDbAvailable } from "./connection";

const contactMessagesData: Array<{
  id: number; name: string; email: string; subject: string; message: string;
  status: "new" | "read" | "replied" | "archived"; createdAt: Date;
}> = [];
let contactId = 0;

export async function findContactMessages(status?: string) {
  if (!isDbAvailable()) {
    if (status) return contactMessagesData.filter(m => m.status === status);
    return [...contactMessagesData];
  }
  const db = getDb();
  if (status) {
    return db.select().from(schema.contactMessages).where(eq(schema.contactMessages.status, status as "new" | "read" | "replied" | "archived")).orderBy(desc(schema.contactMessages.createdAt));
  }
  return db.select().from(schema.contactMessages).orderBy(desc(schema.contactMessages.createdAt));
}

export async function createContactMessage(data: { name: string; email: string; subject: string; message: string }) {
  if (!isDbAvailable()) {
    const newMsg = { id: ++contactId, ...data, status: "new" as const, createdAt: new Date() };
    contactMessagesData.push(newMsg);
    return newMsg.id;
  }
  const db = getDb();
  const result = await db.insert(schema.contactMessages).values(data);
  return Number(result[0].insertId);
}

export async function updateContactStatus(id: number, status: "new" | "read" | "replied" | "archived") {
  if (!isDbAvailable()) {
    const msg = contactMessagesData.find(m => m.id === id);
    if (msg) msg.status = status;
    return;
  }
  const db = getDb();
  await db.update(schema.contactMessages).set({ status }).where(eq(schema.contactMessages.id, id));
}
