import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import * as queries from "./queries/contact";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      subject: z.string().min(1),
      message: z.string().min(10),
    }))
    .mutation(async ({ input }) => {
      return queries.createContactMessage(input);
    }),

  list: adminQuery
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return queries.findContactMessages(input?.status);
    }),
});
