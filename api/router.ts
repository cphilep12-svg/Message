import { authRouter } from "./auth-router";
import { productRouter } from "./product-router";
import { collectionRouter } from "./collection-router";
import { cartRouter } from "./cart-router";
import { orderRouter } from "./order-router";
import { testimonialRouter } from "./testimonial-router";
import { blogRouter } from "./blog-router";
import { contactRouter } from "./contact-router";
import { paymentRouter } from "./payment-router";
import { adminRouter } from "./admin-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  collection: collectionRouter,
  cart: cartRouter,
  order: orderRouter,
  testimonial: testimonialRouter,
  blog: blogRouter,
  contact: contactRouter,
  payment: paymentRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
