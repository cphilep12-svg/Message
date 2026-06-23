import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import * as queries from "./queries/blog";

export const blogRouter = createRouter({
  list: publicQuery
    .input(z.object({
      category: z.string().optional(),
      page: z.number().optional(),
      limit: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return queries.findBlogPosts(input ?? {});
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return queries.findBlogPostBySlug(input.slug);
    }),
});
