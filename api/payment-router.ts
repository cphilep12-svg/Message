import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import * as orderQueries from "./queries/orders";

export const paymentRouter = createRouter({
  createIntent: publicQuery
    .input(z.object({
      orderId: z.number(),
      method: z.enum(["yoco", "payfast", "stripe"]),
    }))
    .mutation(async ({ input }) => {
      // Mock payment intent
      const clientSecret = `mock_${input.method}_secret_${Math.random().toString(36).substring(2, 12)}`;
      const paymentUrl = `/checkout/confirm?orderId=${input.orderId}&method=${input.method}`;
      return { clientSecret, paymentUrl };
    }),

  confirm: publicQuery
    .input(z.object({
      orderId: z.number(),
      paymentRef: z.string(),
    }))
    .mutation(async ({ input }) => {
      await orderQueries.updatePaymentStatus(input.orderId, "paid", input.paymentRef);
      await orderQueries.updateOrderStatus(input.orderId, "paid");
      return { success: true, status: "paid" };
    }),
});
