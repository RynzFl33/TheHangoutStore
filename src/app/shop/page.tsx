import { Suspense } from "react";
import { createClient } from "../../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price: number;
  image_url: string;
  is_on_sale: boolean;
  is_featured: boolean;
  sizes: string[];
  colors: string[];
  stock_quantity: number;
  categories: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

async function getProducts() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        name,
        slug
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return products as Product[];
}

async function getCategories() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return categories as Category[];
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No products found
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function CategoryFilter({ categories }: { categories: Category[] }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Shop by Category
      </h3>
      <div className="flex flex-wrap gap-3">
        <Badge
          variant="outline"
          className="cursor-pointer hover:bg-purple-100 hover:border-purple-300 transition-colors"
        >
          All Products
        </Badge>
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-purple-100 hover:border-purple-300 transition-colors"
            >
              {category.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Organize products into different sections
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 8);
  const saleProducts = products.filter((p) => p.is_on_sale).slice(0, 8);
  const newArrivals = products.slice(0, 8); // Latest products
  const highRatedProducts = products
    .filter((p) => p.stock_quantity && p.stock_quantity > 10)
    .slice(0, 8);
  const premiumProducts = products.filter((p) => p.price > 75).slice(0, 6);
  const budgetFriendly = products.filter((p) => p.price <= 50).slice(0, 6);
  const remainingProducts = products.filter(
    (p) =>
      !featuredProducts.includes(p) &&
      !saleProducts.includes(p) &&
      !newArrivals.includes(p),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
            Discover Your Style
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            Curated collections of the hottest streetwear and fashion trends
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge className="bg-white/20 text-white border-white/30">
              New Arrivals Daily
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              Exclusive Deals
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              Free Shipping Over $75
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Bar */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 bg-white dark:bg-slate-800 border-2 focus:border-purple-300"
              />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-48 bg-white dark:bg-slate-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32 bg-white dark:bg-slate-800">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-25">Under $25</SelectItem>
                  <SelectItem value="25-50">$25 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="over-100">Over $100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <CategoryFilter categories={categories} />
        </div>

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                🆕 New Arrivals
              </h2>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                Just Dropped
              </Badge>
            </div>
            <Suspense fallback={<div>Loading new arrivals...</div>}>
              <ProductGrid products={newArrivals} />
            </Suspense>
          </section>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                ⭐ Featured Collection
              </h2>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Editor's Choice
              </Badge>
            </div>
            <Suspense fallback={<div>Loading featured products...</div>}>
              <ProductGrid products={featuredProducts} />
            </Suspense>
          </section>
        )}

        {/* Sale Products */}
        {saleProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                🔥 Hot Deals
              </h2>
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse">
                Limited Time
              </Badge>
            </div>
            <Suspense fallback={<div>Loading sale products...</div>}>
              <ProductGrid products={saleProducts} />
            </Suspense>
          </section>
        )}

        {/* Premium Collection */}
        {premiumProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                💎 Premium Collection
              </h2>
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                Luxury
              </Badge>
            </div>
            <Suspense fallback={<div>Loading premium products...</div>}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </Suspense>
          </section>
        )}

        {/* Budget Friendly */}
        {budgetFriendly.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                💰 Budget Friendly
              </h2>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                Under $50
              </Badge>
            </div>
            <Suspense fallback={<div>Loading budget products...</div>}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgetFriendly.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </Suspense>
          </section>
        )}

        {/* High Stock Items */}
        {highRatedProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                📦 In Stock & Ready
              </h2>
              <Badge className="bg-gradient-to-r from-teal-500 to-green-500 text-white">
                Fast Shipping
              </Badge>
            </div>
            <Suspense fallback={<div>Loading in-stock products...</div>}>
              <ProductGrid products={highRatedProducts} />
            </Suspense>
          </section>
        )}

        {/* More Products */}
        {remainingProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                🛍️ More to Explore
              </h2>
              <Badge variant="outline" className="border-gray-300">
                {remainingProducts.length} items
              </Badge>
            </div>
            <Suspense fallback={<div>Loading more products...</div>}>
              <ProductGrid products={remainingProducts} />
            </Suspense>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
