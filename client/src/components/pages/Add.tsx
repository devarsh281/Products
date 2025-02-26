import { useState, FormEvent } from "react";
import { trpc } from "../../utils/trpc";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CircleCheck, Loader2, CircleX } from "lucide-react";

export default function AddProdForm() {
  const [prod, setProd] = useState({
    name: "",
    price: 0,
    imageUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  
  const createProd = trpc.product.addProd.useMutation({
    onSuccess: () => {
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!prod.name || !prod.price || !prod.imageUrl) {
      setIsAlertVisible(true);
      return;
    }
  
    setIsLoading(true);
  
    console.log({
      name: prod.name,
      price: prod.price,
      imageUrl: prod.imageUrl,
    });
  
    await createProd.mutateAsync({
      name: prod.name,
      price: prod.price,
      imageUrl: prod.imageUrl,
    });
  };
  

  const handleReset = () => setProd({ name: "", price: 0, imageUrl: "" });

  const handleChange = (field: keyof typeof prod, value: string | number) => {
    setProd((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (prod.name && prod.price && prod.imageUrl) {
      setIsAlertVisible(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-400">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md">
        <div className="bg-gray-800 text-white p-6">
          <h2 className="text-2xl font-bold">Create New Product</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-red-600">
              Product Name
            </label>
            <Input
              id="name"
              type="text"
              value={prod.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter Product name"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium text-red-600">
              Price
            </label>
            <Input
              id="price"
              type="number"
              value={prod.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              placeholder="Enter Product Price"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium text-red-600">
              Product Image URL
            </label>
            <Input
              id="image"
              type="url"
              value={prod.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="Enter Image URL"
              disabled={isLoading}
            />
          </div>
          <div className="flex space-x-2">
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <CircleCheck className="w-5 h-5 mr-2" />
              )}
              <span>{isLoading ? "Creating..." : "Create"}</span>
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
              disabled={isLoading}
            >
              <CircleX className="w-5 h-5 mr-2" />
              <span>Reset</span>
            </Button>
          </div>
          {isAlertVisible && (
            <Alert variant="destructive">
              <CircleX />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Please fill all fields.</AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}
