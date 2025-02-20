import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { router } from "./trpc";
import { productRouter } from "./routers/product";
import { orderRouter } from "./routers/order";
import { renderTrpcPanel } from 'trpc-ui';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8081;

// app.use("/api", router);

app.use("/uploads", express.static("uploads"));

export const appRouter = router({
  product: productRouter,
  order: orderRouter,
});

app.use("/trpc", createExpressMiddleware({ router: appRouter }));


app.use("/panel", async (_, res) => {
   
    
     res.send(
      renderTrpcPanel(appRouter, {
        url: `http://localhost:${PORT}/trpc`, 
        
      })
    );
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export type AppRouter = typeof appRouter;
