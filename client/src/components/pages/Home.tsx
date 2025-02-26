import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Search, ShoppingCart, Heart, Menu, User, X } from 'lucide-react';
import AddProdForm from "./Add";
import { trpc } from "@/utils/trpc";
import superjson from "superjson";
import Display from "./Display";
import { httpBatchLink } from "@trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: "http://localhost:8082/trpc",
    }),
  ],
});

export default function Home() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const categories = [
    "All Products",
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Beauty",
    "Sports"
  ];

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <button 
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-2xl font-bold text-blue-600">ShopEase</span>
                  </div>
                </div>

                <nav className="hidden md:flex space-x-8">
                  {categories.slice(0, 4).map((category) => (
                    <a 
                      key={category}
                      href="#" 
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                    >
                      {category}
                    </a>
                  ))}
                  <div className="relative group">
                    <button className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                      More
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                      {categories.slice(4).map((category) => (
                        <a 
                          key={category}
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {category}
                        </a>
                      ))}
                    </div>
                  </div>
                </nav>

                <div className="flex-1 max-w-lg mx-4 hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-6 w-6 text-gray-600" />
                        {cartCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs">
                            {cartCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <div className="h-full flex flex-col">
                        <div className="py-6 border-b">
                          <h3 className="text-lg font-medium">Your Cart</h3>
                          <p className="text-sm text-gray-500">
                            {cartCount === 0 ? "Your cart is empty" : `${cartCount} items in your cart`}
                          </p>
                        </div>
                        <div className="flex-1 overflow-auto py-4">
                          {cartCount === 0 && (
                            <div className="text-center py-10">
                              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                              <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                              <p className="mt-1 text-sm text-gray-500">
                                Start shopping to add items to your cart
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="py-4 border-t">
                          <Button className="w-full" disabled={cartCount === 0}>
                            Checkout
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Button variant="ghost" size="icon" className="relative">
                    <Heart className="h-6 w-6 text-gray-600" />
                    {wishlistCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                        {wishlistCount}
                      </Badge>
                    )}
                  </Button>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-6 w-6 text-gray-600" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <div className="py-6">
                        <h3 className="text-lg font-medium">Account</h3>
                        <div className="mt-6 space-y-4">
                          <Button variant="outline" className="w-full justify-start">
                            Sign In
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            Register
                          </Button>
                          <Button 
                            variant={isAdminMode ? "default" : "outline"} 
                            className="w-full justify-start"
                            onClick={() => setIsAdminMode(!isAdminMode)}
                          >
                            {isAdminMode ? "Exit Admin Mode" : "Admin Mode"}
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {categories.map((category) => (
                    <a
                      key={category}
                      href="#"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {category}
                    </a>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="px-2 space-y-1">
                    <a
                      href="#"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      Settings
                    </a>
                    <button
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      onClick={() => setIsAdminMode(!isAdminMode)}
                    >
                      {isAdminMode ? "Exit Admin Mode" : "Admin Mode"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </header>

          <div className="md:hidden bg-white p-4 shadow-sm">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {!isAdminMode && (
            <div className="bg-blue-600 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="md:flex md:items-center md:justify-between">
                  <div className="md:w-1/2">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                      Summer Sale
                    </h1>
                    <p className="mt-3 text-lg">
                      Up to 50% off on selected items. Limited time offer.
                    </p>
                    <div className="mt-6">
                      <Button className="bg-white text-blue-600 hover:bg-gray-100">
                        Shop Now
                      </Button>
                    </div>
                  </div>
                  <div className="mt-8 md:mt-0 md:w-1/2">
                    <img 
                      src="/placeholder.svg?height=300&width=500" 
                      alt="Summer Sale" 
                      className="rounded-lg shadow-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isAdminMode ? (
              <Tabs defaultValue="add">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
                  <TabsList>
                    <TabsTrigger value="add">Add Product</TabsTrigger>
                    <TabsTrigger value="view">View Products</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="add" className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Add New Product
                  </h3>
                  <AddProdForm />
                </TabsContent>
                
                <TabsContent value="view">
                  <Display 
                    onCartUpdate={(count) => setCartCount(count)}
                    onWishlistUpdate={(count) => setWishlistCount(count)}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <>
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category, index) => (
                      <div key={index} className="bg-white rounded-lg shadow overflow-hidden group cursor-pointer">
                        <div className="aspect-square relative">
                          <img 
                            src={`/placeholder.svg?height=200&width=200&text=${encodeURIComponent(category)}`}
                            alt={category}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3 text-center">
                          <h3 className="font-medium text-gray-900">{category}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                    <Button variant="outline">View All</Button>
                  </div>
                  <Display 
                    onCartUpdate={(count) => setCartCount(count)}
                    onWishlistUpdate={(count) => setWishlistCount(count)}
                  />
                </div>
              </>
            )}
          </main>

          <footer className="bg-gray-800 text-white mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">ShopEase</h3>
                  <p className="text-gray-400 text-sm">
                    Your one-stop destination for all your shopping needs. Quality products, competitive prices, and exceptional service.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Shop</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    {categories.map((category) => (
                      <li key={category}>
                        <a href="#" className="hover:text-white">
                          {category}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    <li><a href="#" className="hover:text-white">FAQs</a></li>
                    <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
                    <li><a href="#" className="hover:text-white">Returns & Refunds</a></li>
                    <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Subscribe to our newsletter for updates on new products and special offers.
                  </p>
                  <div className="flex">
                    <Input
                      type="email"
                      placeholder="Your email"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button className="ml-2">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
