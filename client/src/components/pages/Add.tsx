import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CircleX, CircleCheck, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { trpc } from "../../utils/trpc";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";


interface Prod {
  name: string;
  price: number;
  image: string ;
}

export default function AddProdForm() {
  const [prod, setProd] = useState<Prod>({
    name: "",
    price: 0,
    image: "",  
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const createProd = trpc.product.addProd?.useMutation();


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); 

    if (!prod.name || !prod.price || !prod.image) { 
      setIsAlertVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      await createProd.mutateAsync(prod);
      setProd({ name: "", price: 0, image: "" });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () =>
    setProd({ name: "", price: 0, image: "" });

  const handleChange = (name: keyof Prod, value: string) => {
    setProd((prevProd) => {
      const updatedProd = { ...prevProd, [name]: value };

      if (
        updatedProd.name &&
        updatedProd.price &&
        updatedProd.image
      ) {
        setIsAlertVisible(false);
      }

      return updatedProd;
    });
  };

  
  const uploadImage = trpc.product?.addProd.useMutation(); 
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      setIsLoading(true);
      
      const response = await uploadImage.mutateAsync(formData);
      if (response.imageUrl) {
        setProd((prevProd) => ({
          ...prevProd,
          image: response.imageUrl, 
        }));
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-400">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md"
      >
        <div className="bg-gray-800 text-white p-6">
          <h2 className="text-2xl font-bold">Create New Product</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-red-600">
              Product Name
            </label>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Input
                type="text"
                id="name"
                value={prod.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter Product name"
                disabled={isLoading}
                className={`transition-all duration-300 ${
                  prod.name ? "" : "animate-shake"
                }`}
              />
            </motion.div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="text-sm font-medium text-red-600"
            >
              Price
            </label>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Input
                id="price"
                value={prod.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="Enter Product Price"
                disabled={isLoading}
                className={`transition-all duration-300 ${
                  prod.price ? "" : "animate-shake"
                }`}
              />
            </motion.div>
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium text-red-600">
              Upload Image
            </label>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="file:border file:border-gray-400 file:bg-gray-100 file:text-gray-800 file:px-3 file:py-2 file:rounded-lg"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex space-x-2"
          >
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex space-x-2 text-red-500"
          >
            {isAlertVisible && (
              <Alert
                variant="destructive"
                className=" border-red-500"
              >
                <CircleX />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Please fill all fields.</AlertDescription>
              </Alert>
            )}
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
