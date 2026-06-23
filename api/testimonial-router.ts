import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import * as queries from "./queries/testimonials";

export const testimonialRouter = createRouter({
  list: publicQuery
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return queries.findTestimonials(input?.status ?? "approved");
    }),

  create: publicQuery
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      text: z.string().min(10),
      verse: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return queries.createTestimonial(input);
    }),

  updateStatus: adminQuery
    .input(z.object({ id: z.number(), status: z.enum(["pending", "approved", "rejected"]) }))
    .mutation(async ({ input }) => {
      await queries.updateTestimonialStatus(input.id, input.status);
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await queries.deleteTestimonial(input.id);
      return { success: true };
    }),
});
