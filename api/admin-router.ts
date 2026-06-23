import { createRouter, adminQuery } from "./middleware";
import { getAdminStats } from "./queries/admin";

export const adminRouter = createRouter({
  getStats: adminQuery.query(async () => {
    return getAdminStats();
  }),
});
