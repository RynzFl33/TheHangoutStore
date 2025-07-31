"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";
import { addToCartAction, addToFavoritesAction } from "@/app/actions";
import { useToast } from "./ui/use-toast";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  image_url?: string;
  is_on_sale?: boolean;
  is_featured?: boolean;
  sizes?: string[];
  colors?: string[];
  stock_quantity?: number;
}

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  showFavorite?: boolean;
}

export default function ProductCard({
  product,
  showAddToCart = true,
  showFavorite = true,
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("productId", product.id);
      formData.append("quantity", "1");
      if (product.sizes && product.sizes.length > 0) {
        formData.append("size", product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        formData.append("color", product.colors[0]);
      }

      await addToCartAction(formData);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      const formData = new FormData();
      formData.append("productId", product.id);

      await addToFavoritesAction(formData);
      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Removed from Favorites" : "Added to Favorites",
        description: `${product.name} has been ${isFavorited ? "removed from" : "added to"
          } your favorites.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const displayPrice = product.sale_price || product.price;
  const originalPrice = product.sale_price ? product.price : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -5, boxShadow: "0 12px 20px rgba(0,0,0,0.12)" }}
      className="group cursor-pointer select-none"
    >
      <Card className="relative rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-xl">
          <Link href={`/product/${product.id}`}>
            <motion.img
              src={
                product.image_url ||
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80"
              }
              alt={product.name}
              className="w-full h-64 object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.4 }}
              loading="lazy"
              draggable={false}
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.is_on_sale && (
              <Badge
                variant="destructive"
                className="text-xs font-semibold bg-red-100 text-red-700 border-none shadow-sm"
              >
                SALE
              </Badge>
            )}
            {product.is_featured && (
              <Badge
                className="text-xs font-semibold bg-yellow-100 text-yellow-800 border-none shadow-sm"
              >
                FEATURED
              </Badge>
            )}
          </div>

          {/* Favorite */}
          {showFavorite && (
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToFavorites}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-900 rounded-full shadow text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : ""
                  }`}
              />
            </motion.button>
          )}
        </div>

        {/* Content */}
        <CardContent className="px-6 py-5 text-gray-900 dark:text-gray-100">
          <Link href={`/product/${product.id}`}>
            <motion.h3
              className="font-semibold text-lg mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              whileHover={{ scale: 1.02 }}
              tabIndex={0}
            >
              {product.name}
            </motion.h3>
          </Link>

          {product.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              ${displayPrice.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock status */}
          {product.stock_quantity !== undefined && (
            <div>
              {product.stock_quantity > 0 ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium tracking-wide text-xs"
                >
                  In Stock ({product.stock_quantity} available)
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 font-medium tracking-wide"
                >
                  Out of Stock
                </motion.span>
              )}
            </div>
          )}
        </CardContent>

        {/* Add to Cart */}
        {showAddToCart && (
          <CardFooter className="px-6 pb-6 pt-0">
            <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleAddToCart}
                disabled={
                  isLoading ||
                  (product.stock_quantity !== undefined && product.stock_quantity <= 0)
                }
                className="w-full bg-[#F5DEB3] hover:bg-[#36454F] focus:ring-indigo-500 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-3 select-none"
                aria-label="Add product to cart"
              >
                {isLoading ? (
                  <motion.div
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                    aria-hidden="true"
                  />
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
                {isLoading ? "Adding..." : "Add to Cart"}
              </Button>
            </motion.div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
