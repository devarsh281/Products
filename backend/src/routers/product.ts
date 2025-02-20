import { z } from "zod";
import { db } from "../db";
import { products } from "../schema";
import { publicProcedure, router } from "../trpc";
import { eq } from "drizzle-orm";

export const productRouter = router({
  add: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        price: z.number().min(1, "Price must be at least 1"),
        imageUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(products).values(input);
      return { success: true, message: "Product added successfully" };
    }),

  getAll: publicProcedure.query(async () => {
    const allProducts = await db.select().from(products).execute();
    return { success: true, products: allProducts };
  }),

  getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        if (!input || !input.id) {
          return { success: false, message: "Invalid input" };
        }
        const { id } = input;
        const product = await db
          .select()
          .from(products)
          .where(eq(products.id, id))
          .execute();

        if (product.length > 0) {
          return { success: true, product: product[0] };
        } else {
          return { success: false, message: "Product not found" };
        }
      }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        price: z.number().min(1, "Price must be at least 1").optional(),
        imageUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;

      if (Object.keys(updates).length === 0) {
        return { success: false, message: "No updates provided" };
      }

      await db
        .update(products)
        .set(updates)
        .where(eq(products.id, id))
        .execute();
      return { success: true, message: "Product updated successfully" };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(products).where(eq(products.id, input.id)).execute();
      return { success: true, message: "Product deleted successfully" };
    }),
});
