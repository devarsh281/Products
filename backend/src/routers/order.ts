import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { db } from "../db";
import { orders, products } from "../schema";
import { eq } from "drizzle-orm";

export const orderRouter = router({
  add: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(orders).values(input);
      return { success: true };
    }),

  getAll: publicProcedure.query(async () => {
    const allOrders = await db.select().from(orders);
    return { success: true, orders: allOrders };
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .execute();
      if (order) {
        return { success: true, order };
      } else {
        return { success: false, message: "Order not found" };
      }
    }),
  updateOrder: publicProcedure
    .input(
      z.object({
        id: z.number(),
        quantity: z.number().min(1).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existingOrder = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .execute();

      if (!existingOrder || existingOrder.length !== 0) {
        return { success: false, message: "Order not found" };
      }

      const updateValues: any = {};
      if (input.quantity) updateValues.quantity = input.quantity;

      await db
        .update(orders)
        .set(updateValues)
        .where(eq(orders.id, input.id))
        .execute();

      return { success: true, message: "Order updated successfully" };
    }),
  deleteOrder: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const existingOrder = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .execute();

      if (!existingOrder || existingOrder.length === 0) {
        return { success: false, message: "Order not found" };
      }
    
      await db.delete(orders).where(eq(orders.id, input.id)).execute();

      return { success: true, message: "Order deleted successfully" };
    }),
});
