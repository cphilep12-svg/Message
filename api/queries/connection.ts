import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;
let dbAvailable = false;

export function getDb() {
  if (!instance) {
    try {
      if (env.databaseUrl && env.databaseUrl.length > 0) {
        instance = drizzle(env.databaseUrl, {
          mode: "planetscale",
          schema: fullSchema,
        });
        dbAvailable = true;
      } else {
        throw new Error("No database URL configured");
      }
    } catch {
      // No DB available - queries will use memory store
      dbAvailable = false;
      // Create a minimal mock that won't be used
      instance = {} as ReturnType<typeof drizzle<typeof fullSchema>>;
    }
  }
  return instance;
}

export function isDbAvailable() {
  return dbAvailable;
}
