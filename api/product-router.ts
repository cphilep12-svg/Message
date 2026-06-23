import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import * as queries from "./queries/products";

export const productRouter = createRouter({
  list: publicQuery
    .input(z.object({
      collection: z.string().optional(),
      search: z.string().optional(),
      status: z.string().optional(),
      page: z.number().optional(),
      limit: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return queries.findProducts(input ?? {});
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return queries.findProductBySlug(input.slug);
    }),

  getFeatured: publicQuery.query(async () => {
    return queries.findFeaturedProducts();
  }),

  create: adminQuery
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      verse: z.string().optional(),
      price: z.string(),
      comparePrice: z.string().optional(),
      status: z.enum(["active", "draft", "archived"]).default("draft"),
      stockStatus: z.enum(["in_stock", "low_stock", "sold_out", "coming_soon"]).default("coming_soon"),
      quantity: z.number().default(0),
      isFeatured: z.boolean().default(false),
      images: z.array(z.string()).optional(),
      featuredImage: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return queries.createProduct(input);
    }),

  update: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      verse: z.string().optional(),
      price: z.string().optional(),
      comparePrice: z.string().optional(),
      status: z.enum(["active", "draft", "archived"]).optional(),
      stockStatus: z.enum(["in_stock", "low_stock", "sold_out", "coming_soon"]).optional(),
      quantity: z.number().optional(),
      isFeatured: z.boolean().optional(),
      images: z.array(z.string()).optional(),
      featuredImage: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await queries.updateProduct(id, data);
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await queries.deleteProduct(input.id);
      return { success: true };
    }),
});
