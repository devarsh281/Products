import express from "express";
import cors from "cors";
import * as trpcExpress from '@trpc/server/adapters/express'; 
import { productRouter } from "./routers/product";
import { orderRouter } from "./routers/order";
import { renderTrpcPanel } from "trpc-ui";
import { inferRouterInputs, inferRouterOutputs, initTRPC } from "@trpc/server";
import { router } from "./trpc";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8081;

const t = initTRPC.create({
  errorFormatter: ({ shape }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
      },
    };
  },
});

app.use("/uploads", express.static("uploads"));

export const appRouter = t.router({
  product: productRouter,
  order: orderRouter,
});



const createContext = ({ req, res }: { req: express.Request; res: express.Response }) => {
  console.log('Context initialized');
  return {};
};

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);


app.use("/panel", (_, res) => {
  try {
    res.send(
      renderTrpcPanel(appRouter, {
        url: `http://localhost:${PORT}/trpc`,
      })
    );
  } catch (error) {
    console.error("Error rendering tRPC panel:", error);
    res.status(500).send("Failed to load tRPC Panel.");
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;