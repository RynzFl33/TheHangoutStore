"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
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
        description: `${product.name} has been ${isFavorited ? "removed from" : "added to"} your favorites.`,
      });
    } catch (error) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900">
        <div className="relative overflow-hidden">
          <Link href={`/product/${product.id}`}>
            <img
              src={
                product.image_url ||
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80"
              }
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_on_sale && (
              <Badge variant="destructive" className="text-xs font-bold">
                SALE
              </Badge>
            )}
            {product.is_featured && (
              <Badge className="text-xs font-bold bg-purple-600 hover:bg-purple-700">
                FEATURED
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          {showFavorite && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToFavorites}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </motion.button>
          )}
        </div>

        <CardContent className="p-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ${displayPrice}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
              (4.8)
            </span>
          </div>

          {/* Stock Status */}
          {product.stock_quantity !== undefined && (
            <div className="mb-3">
              {product.stock_quantity > 0 ? (
                <span className="text-sm text-green-600 font-medium">
                  In Stock ({product.stock_quantity} available)
                </span>
              ) : (
                <span className="text-sm text-red-600 font-medium">
                  Out of Stock
                </span>
              )}
            </div>
          )}
        </CardContent>

        {showAddToCart && (
          <CardFooter className="p-4 pt-0">
            <motion.div className="w-full">
              <Button
                onClick={handleAddToCart}
                disabled={
                  isLoading ||
                  (product.stock_quantity !== undefined &&
                    product.stock_quantity <= 0)
                }
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                <motion.div
                  className="flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isLoading ? "Adding..." : "Add to Cart"}
                </motion.div>
              </Button>
            </motion.div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
