import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import * as queries from "./queries/orders";
import * as cartQueries from "./queries/cart";

export const orderRouter = createRouter({
  create: publicQuery
    .input(z.object({
      sessionId: z.string().optional(),
      customerName: z.string().optional(),
      customerEmail: z.string().email().optional(),
      customerPhone: z.string().optional(),
      shippingAddress: z.record(z.string(), z.string()).optional(),
      billingAddress: z.record(z.string(), z.string()).optional(),
      shippingCost: z.number().default(0),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const cart = await cartQueries.findOrCreateCart(input.sessionId, undefined);
      const cartWithItems = await cartQueries.getCartWithItems(cart.id);
      if (!cartWithItems || cartWithItems.items.length === 0) {
        throw new Error("Cart is empty");
      }

      const subtotal = cartWithItems.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
      const total = subtotal + (input.shippingCost ?? 0);
      const orderNumber = `MSG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const orderId = await queries.createOrder({
        userId: cart.userId ?? null,
        orderNumber,
        subtotal,
        total,
        customerName: input.customerName ?? null,
        customerEmail: input.customerEmail ?? null,
        customerPhone: input.customerPhone ?? null,
        shippingAddress: (input.shippingAddress ?? null) as Record<string, string> | null,
        billingAddress: (input.billingAddress ?? null) as Record<string, string> | null,
        shippingCost: input.shippingCost,
      });

      await queries.createOrderItems(orderId, cartWithItems.items.map(item => ({
        productId: item.productId,
        variantId: item.variantId ?? undefined,
        productName: item.product?.name ?? "Unknown Product",
        productImage: item.product?.featuredImage ?? undefined,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.price) * item.quantity,
      })));

      await cartQueries.clearCart(cart.id);

      return { orderId, orderNumber };
    }),

  getByNumber: publicQuery
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => {
      return queries.findOrderByNumber(input.orderNumber);
    }),

  list: adminQuery
    .input(z.object({
      status: z.string().optional(),
      page: z.number().optional(),
      limit: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return queries.findOrders({ status: input?.status ?? undefined, page: input?.page, limit: input?.limit });
    }),

  updateStatus: adminQuery
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input }) => {
      await queries.updateOrderStatus(input.id, input.status);
      return { success: true };
    }),
});
