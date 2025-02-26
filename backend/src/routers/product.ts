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
    const { data, headers } = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const contentType = headers["content-type"];
    if (!contentType || !contentType.startsWith("image/")) {
      console.error("Invalid image type:", contentType);
      return null;
    }

    const extension = contentType.split("/")[1] || "jpg";
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
      try {
        let imageUrl = input.imageUrl ? await saveImage(input.imageUrl) : null;

        await db.insert(products).values({ ...input, imageUrl });

        return { success: true, message: "Product added successfully" };
      } catch (error) {
        console.error("Error adding product:", error);
        return { success: false, message: "Database error" };
      }
    }),

  getAll: publicProcedure.query(async () => {
    try {
      const allProducts = await db.select().from(products);
      console.log("Fetched products:", allProducts);
      return { success: true, products: allProducts };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, message: "Failed to retrieve products" };
    }
  }),

  getById: publicProcedure
    .input(z.object({ id: z.coerce.number() }))
    .query(async ({ input }) => {
      try {
        console.log(input.id);
        const product =
          (await db.select().from(products).where(eq(products.id, input.id))) ||
          [];

        console.log(product);
        if (product.length > 0) {
          return { success: true, product: product };
        } else {
          return { success: false, message: "Product not found" };
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        return { success: false, message: "Database error" };
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
      try {
        const { id, ...updates } = input;

        const productExists = await db
          .select()
          .from(products)
          .where(eq(products.id, id));
        if (productExists.length === 0) {
          return { success: false, message: "Product not found" };
        }

        if (updates.imageUrl) {
          const savedImagePath = await saveImage(updates.imageUrl);
          if (savedImagePath) {
            updates.imageUrl = savedImagePath;
          }
        }

        await db.update(products).set(updates).where(eq(products.id, id));
        return { success: true, message: "Product updated successfully" };
      } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, message: "Database error" };
      }
    }),

    

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      console.log("Input received for deletion:", input);

      try {
        const productExists = await db
          .select()
          .from(products)
          .where(eq(products.id, input.id));

        if (productExists.length === 0) {
          return { success: false, message: "Product not found" };
        }
        await db.delete(products).where(eq(products.id, input.id));

        return { success: true, message: "Product deleted successfully" };
      } catch (error) {
        console.error("Error deleting product:", error);
        return { success: false, message: "Database error" };
      }
    }),

  deleteAll: publicProcedure.mutation(async () => {
    try {
      await db.delete(products);
      return {
        success: true,
        message: "All products and related orders deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting all products:", error);
      return { success: false, message: "Database error" };
    }
  }),


});
