import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import * as queries from "./queries/collections";

export const collectionRouter = createRouter({
  list: publicQuery.query(async () => {
    return queries.findCollections();
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return queries.findCollectionBySlug(input.slug);
    }),

  getProducts: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return queries.findProductsByCollectionSlug(input.slug);
    }),
});
