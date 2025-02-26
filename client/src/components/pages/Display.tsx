import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Check, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "../../utils/trpc";
import { Badge } from "@/components/ui/badge";
import { useToast } from "../../hooks/use-toast";

interface Prod {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

interface ProductResponse {
  success: boolean;
  products: Prod[];
}

interface DisplayProps {
  onCartUpdate?: (count: number) => void;
  onWishlistUpdate?: (count: number) => void;
}

export default function Display({
  onCartUpdate,
  onWishlistUpdate,
}: DisplayProps) {
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState<Prod | null>(null);
  const { toast } = useToast();

  const { data } = trpc.product.getAll.useQuery<ProductResponse>();
  if (data) {
    console.log(data);
  }
  const prods: Prod[] = data?.success ? data?.products : [];

  useEffect(() => {
    onCartUpdate?.(cartItems.length);
  }, [cartItems, onCartUpdate]);

  useEffect(() => {
    onWishlistUpdate?.(wishlistItems.length);
  }, [wishlistItems, onWishlistUpdate]);

  const addToCart = (product: Prod) => {
    setCartItems((prev) => [...prev, product.id]);
    setAddedProduct(product);
    setIsCartModalOpen(true);

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });

    setTimeout(() => {
      setIsCartModalOpen(false);
    }, 3000);
  };

  const addToWishlist = (product: Prod) => {
    if (wishlistItems.includes(product.id)) {
      setWishlistItems((prev) => prev.filter((id) => id !== product.id));
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      setWishlistItems((prev) => [...prev, product.id]);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <div>
      {prods.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No products available
          </h3>
          <p className="mt-1 text-gray-500">
            Check back later for new products or add some products to get
            started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {prods.map((prod) => (
            <motion.div
              key={prod.id}
              className="bg-white rounded-lg shadow-lg relative group overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {wishlistItems.includes(prod.id) && (
                <Badge className="absolute top-2 right-2 z-10 bg-red-500">
                  <Heart className="w-3 h-3 fill-white" />
                </Badge>
              )}
              <div className="relative overflow-hidden">
                <img
                  src={prod.imageUrl || "/placeholder.svg?height=300&width=300"}
                  alt={prod.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                <Button
                  onClick={() => addToWishlist(prod)}
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white hover:bg-white/90 text-red-500"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      wishlistItems.includes(prod.id) ? "fill-red-500" : ""
                    }`}
                  />
                </Button>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 3
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">(24)</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                  {prod.name}
                </h2>
                <p className="text-gray-600 font-medium mt-1">
                  {prod.price.toFixed(2)}
                </p>
                <div className="mt-4">
                  <Button
                    onClick={() => addToCart(prod)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isCartModalOpen && addedProduct && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-50"
        >
          <div className="flex items-start gap-4">
            <img
              src={
                addedProduct.imageUrl || "/placeholder.svg?height=100&width=100"
              }
              alt={addedProduct.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-900">
                  {addedProduct.name}
                </h3>
                <button
                  onClick={() => setIsCartModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">Added to your cart</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">
                  {addedProduct.price.toFixed(2)}
                </span>
                <Check className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsCartModalOpen(false)}
            >
              Continue Shopping
            </Button>
            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
              View Cart
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
