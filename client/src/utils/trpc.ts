import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import {AppRouter} from '../../../backend/src/index'

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:8081/trpc", 
    }),
  ],
});
