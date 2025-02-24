import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useState } from "react";
import AddProdForm from "./Add";
import { trpc } from "@/utils/trpc";
import superjson from "superjson";
import Display from "./Display";


const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
    transformer: superjson,
    links: [],
  });

export default function Home() {
  const [showAdd, setShowAdd] = useState(true);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Products
            </h1>
            <div className="flex justify-center mb-4">
              <button
                className={`px-4 py-2 rounded-md font-medium ${
                  showAdd ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
                onClick={() => setShowAdd(true)}
              >
                Add Product
              </button>
              <button
                className={`ml-2 px-4 py-2 rounded-md font-medium ${
                  !showAdd ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
                onClick={() => setShowAdd(false)}
              >
                View Products
              </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              {showAdd ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Add New Product
                  </h2>
                  <AddProdForm />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Task List
                  </h2>
                  <Display />
                </>
              )}
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
