import { Suspense } from "react";
import { createClient } from "../../supabase/server";
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
import { Search } from "lucide-react";
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
        <h3 className="text-xl font-semibold text-[#003332] dark:text-[#BDCDCF] mb-2">
          No products found
        </h3>
        <p className="text-[#034C36] dark:text-[#9ab3b5]">
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
      <h3 className="text-lg font-semibold mb-4 text-[#003332] dark:text-[#BDCDCF]">
        Shop by Category
      </h3>
      <div className="flex flex-wrap gap-3">
        <Badge
          variant="outline"
          className="cursor-pointer hover:bg-[#034C36]/10 hover:text-[#034C36] hover:border-[#034C36] transition-colors border-[#BDCDCF] text-[#003332] dark:text-[#BDCDCF] dark:border-[#034C36] dark:hover:bg-[#034C36]/20"
        >
          All Products
        </Badge>
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-[#034C36]/10 hover:text-[#034C36] hover:border-[#034C36] transition-colors border-[#BDCDCF] text-[#003332] dark:text-[#BDCDCF] dark:border-[#034C36] dark:hover:bg-[#034C36]/20"
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
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f5] to-[#e1ece9] dark:from-[#001a19] dark:to-[#002b29]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#034C36] via-[#003332] to-[#003332] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Your Style
          </h1>
          <p className="text-xl text-[#BDCDCF] max-w-2xl mx-auto mb-8">
            Curated collections of the hottest streetwear and fashion trends
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge className="bg-[#003332] text-[#BDCDCF] border-[#034C36]">
              New Arrivals Daily
            </Badge>
            <Badge className="bg-[#003332] text-[#BDCDCF] border-[#034C36]">
              Exclusive Deals
            </Badge>
            <Badge className="bg-[#003332] text-[#BDCDCF] border-[#034C36]">
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#034C36] w-4 h-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 bg-white dark:bg-[#002b29] border-2 border-[#BDCDCF] focus:border-[#034C36]"
              />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-48 bg-white dark:bg-[#002b29] border-[#BDCDCF] text-[#003332] dark:text-[#BDCDCF]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#002b29] border-[#BDCDCF]">
                  <SelectItem value="newest" className="hover:bg-[#034C36]/10 focus:bg-[#034C36]/20">Newest First</SelectItem>
                  <SelectItem value="price-low" className="hover:bg-[#034C36]/10 focus:bg-[#034C36]/20">Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className="hover:bg-[#034C36]/10 focus:bg-[#034C36]/20">Price: High to Low</SelectItem>
                  <SelectItem value="popular" className="hover:bg-[#034C36]/10 focus:bg-[#034C36]/20">Most Popular</SelectItem>
                  <SelectItem value="rating" className="hover:bg-[#034C36]/10 focus:bg-[#034C36]/20">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32 bg-white dark:bg-[#002b29] border-[#BDCDCF] text-[#003332] dark:text-[#BDCDCF]">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#002b29] border-[#BDCDCF]">
                  <SelectItem value="all" className="hover:bg-[#034C36]/10 focus:bg-[#034C36]/20">All Prices</SelectItem>
                  <SelectItem value="under-25" className="hover:bg-[#034C36]/10 focus:bg-[#034C36]/20">Under $25</SelectItem>
                  <SelectItem value="25-50" className="hover:bg-[#034C36]/10 focus:bg-[#034C36]/20">$25 - $50</SelectItem>
                  <SelectItem value="50-100" className="hover:bg-[#034C36]/10 focus:bg-[#034C36]/20">$50 - $100</SelectItem>
                  <SelectItem value="over-100" className="hover:bg-[#034C36]/10 focus:bg-[#034C36]/20">Over $100</SelectItem>
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
              <h2 className="text-3xl font-bold text-[#003332] dark:text-[#BDCDCF]">
                New Arrivals
              </h2>
              <Badge className="bg-[#034C36] text-[#BDCDCF]">
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
              <h2 className="text-3xl font-bold text-[#003332] dark:text-[#BDCDCF]">
                Featured Collection
              </h2>
              <Badge className="bg-gradient-to-r from-[#034C36] to-[#003332] text-[#BDCDCF]">
                Editor&apos;s Choice
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
              <h2 className="text-3xl font-bold text-[#003332] dark:text-[#BDCDCF]">
                Hot Deals
              </h2>
              <Badge className="bg-[#003332] text-[#BDCDCF] animate-pulse">
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
              <h2 className="text-3xl font-bold text-[#003332] dark:text-[#BDCDCF]">
                Premium Collection
              </h2>
              <Badge className="bg-gradient-to-r from-[#034C36] to-[#003332] text-[#BDCDCF]">
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
              <h2 className="text-3xl font-bold text-[#003332] dark:text-[#BDCDCF]">
                Budget Friendly
              </h2>
              <Badge className="bg-[#034C36] text-[#BDCDCF]">
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
              <h2 className="text-3xl font-bold text-[#003332] dark:text-[#BDCDCF]">
                In Stock & Ready
              </h2>
              <Badge className="bg-gradient-to-r from-[#034C36] to-[#003332] text-[#BDCDCF]">
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
              <h2 className="text-3xl font-bold text-[#003332] dark:text-[#BDCDCF]">
                More to Explore
              </h2>
              <Badge variant="outline" className="border-[#BDCDCF] text-[#003332] dark:text-[#BDCDCF]">
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