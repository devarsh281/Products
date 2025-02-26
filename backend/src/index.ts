import express from "express";
import cors from "cors";
import * as trpcExpress from '@trpc/server/adapters/express'; 
import { productRouter } from "./routers/product";
import { orderRouter } from "./routers/order";
import { renderTrpcPanel } from "trpc-ui";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";


const app = express();
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());

const t = initTRPC.create({
  transformer: superjson, 
});

app.use("/uploads", express.static("uploads"));

const appRouter = t.router({
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
        url: `http://localhost:8082`,
      })
    );
  } catch (error) {
    console.error("Error rendering tRPC panel:", error);
    res.status(500).send("Failed to load tRPC Panel.");
  }
});

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = Number(process.env.PORT) || 8081;
app.listen(PORT, () => {
  console.log(`Server running on Port:${PORT}`);
});


export type AppRouter = typeof appRouter;
