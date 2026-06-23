import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import * as queries from "./queries/cart";
import * as productQueries from "./queries/products";

export const cartRouter = createRouter({
  get: publicQuery
    .input(z.object({ sessionId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const cart = await queries.findOrCreateCart(input?.sessionId);
      return queries.getCartWithItems(cart.id);
    }),

  addItem: publicQuery
    .input(z.object({
      productId: z.number(),
      variantId: z.number().optional(),
      quantity: z.number().min(1),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const cart = await queries.findOrCreateCart(input.sessionId);
      const products = await productQueries.findProducts({});
      const product = products.find(p => p.id === input.productId);
      if (!product) throw new Error("Product not found");
      await queries.addCartItem(cart.id, input.productId, input.variantId ?? null, input.quantity, Number(product.price));
      return queries.getCartWithItems(cart.id);
    }),

  updateItem: publicQuery
    .input(z.object({
      itemId: z.number(),
      quantity: z.number().min(0),
    }))
    .mutation(async ({ input }) => {
      if (input.quantity === 0) {
        await queries.removeCartItem(input.itemId);
      } else {
        await queries.updateCartItem(input.itemId, input.quantity);
      }
      return { success: true };
    }),

  removeItem: publicQuery
    .input(z.object({ itemId: z.number() }))
    .mutation(async ({ input }) => {
      await queries.removeCartItem(input.itemId);
      return { success: true };
    }),

  clear: publicQuery
    .input(z.object({ cartId: z.number() }))
    .mutation(async ({ input }) => {
      await queries.clearCart(input.cartId);
      return { success: true };
    }),

  getCount: publicQuery
    .input(z.object({ sessionId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const cart = await queries.findOrCreateCart(input?.sessionId);
      return queries.getCartItemCount(cart.id);
    }),
});
