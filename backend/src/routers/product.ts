import { z } from "zod";
import { db } from "../db";
import { products } from "../schema";
import { publicProcedure, router } from "../trpc";
import axios from "axios";
import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";

const saveImage = async (imageUrl: string): Promise<string | null> => {
  try {
    const { data, headers } = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const contentType = headers["content-type"];
    const extension = contentType ? contentType.split("/")[1] : "jpg"; 

    const fileName = `product_${Date.now()}.${extension}`;

    const uploadPath = path.join(__dirname, "../../uploads", fileName); 
    if (!fs.existsSync(path.dirname(uploadPath))) {
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
    }

    fs.writeFileSync(uploadPath, Buffer.from(data));

    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("Error saving image:", error);
    return null;
  }
};

export const productRouter = router({
  addProd: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        price: z.number().min(1, "Price must be at least 1"),
        imageUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      let imageUrl = input.imageUrl;

      if (imageUrl) {
        const savedImagePath = await saveImage(imageUrl);
        if (savedImagePath) {
          imageUrl = savedImagePath;
        } else {
          return { success: false, message: "Failed to save the image." };
        }
      }

      await db.insert(products).values({ ...input, imageUrl });
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
      const { id,  ...updates } = input;

      if (updates.imageUrl) {
        const savedImagePath = await saveImage(updates.imageUrl);
        if (savedImagePath) {
          updates.imageUrl = savedImagePath;
        } else {
          return { success: false, message: "Failed to save the image." };
        }
      }

      if (Object.keys(updates).length === 0) {
        return { success: false, message: "No updates provided" };
      }

      await db.update(products).set(updates).where(eq(products.id, id)).execute();
      return { success: true, message: "Product updated successfully" };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(products).where(eq(products.id, input.id)).execute();
      return { success: true, message: "Product deleted successfully" };
    }),
});
