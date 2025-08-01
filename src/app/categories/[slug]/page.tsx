import { createClient } from "../../../supabase/server";
import { createBuildClient } from "../../../supabase/client-build";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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

async function getCategory(slug: string) {
  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !category) {
    return null;
  }

  return category as Category;
}

async function getCategoryProducts(slug: string) {
  const supabase = await createClient();

  // First get the category ID
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!category) {
    return [];
  }

  // Then get products that belong to this category
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
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching category products:", error);
    return [];
  }

  return products as Product[];
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-[#003332] dark:text-[#BDCDCF] mb-2">
          No products found
        </h3>
        <p className="text-[#034C36] dark:text-[#BDCDCF]/80">
          Check back soon for new arrivals in this category.
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

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const { params } = props;
  const { slug } = await params;

  const [category, products] = await Promise.all([
    getCategory(slug),
    getCategoryProducts(slug),
  ]);

  if (!category) {
    notFound();
  }

  const featuredProducts = products.filter((p) => p.is_featured);
  const saleProducts = products.filter((p) => p.is_on_sale);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f5f5] to-[#e1e8e8] dark:from-[#001818] dark:to-[#001111]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#003332] to-[#034C36] text-[#BDCDCF] py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001818] to-transparent" />
        </div>
        <div className="relative container mx-auto px-4">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-[#BDCDCF] hover:text-white mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Categories
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            {category.name.toUpperCase()}
          </h1>
          <p className="text-lg text-[#BDCDCF]/90 max-w-2xl">
            {category.description}
          </p>
          <div className="mt-6">
            <Badge className="bg-[#034C36] text-[#BDCDCF] border-[#003332]">
              {products.length} {products.length === 1 ? "Product" : "Products"}
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Bar */}
        <div className="mb-10 p-4 bg-white dark:bg-[#001818] rounded-lg border border-[#BDCDCF]/20 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#034C36] w-4 h-4" />
              <Input
                placeholder={`Search ${category.name.toLowerCase()}...`}
                className="pl-10 bg-[#f0f5f5] dark:bg-[#002020] border-[#BDCDCF]/40 text-[#003332] dark:text-[#BDCDCF] focus:border-[#034C36]"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select>
                <SelectTrigger className="bg-[#f0f5f5] dark:bg-[#002020] border-[#BDCDCF]/40 text-[#003332] dark:text-[#BDCDCF] focus:border-[#034C36]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#002020] border-[#BDCDCF]/40">
                  <SelectItem value="newest" className="hover:bg-[#f0f5f5] dark:hover:bg-[#003332]">Newest First</SelectItem>
                  <SelectItem value="price-low" className="hover:bg-[#f0f5f5] dark:hover:bg-[#003332]">Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className="hover:bg-[#f0f5f5] dark:hover:bg-[#003332]">Price: High to Low</SelectItem>
                  <SelectItem value="popular" className="hover:bg-[#f0f5f5] dark:hover:bg-[#003332]">Most Popular</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="bg-[#f0f5f5] dark:bg-[#002020] border-[#BDCDCF]/40 text-[#003332] dark:text-[#BDCDCF] focus:border-[#034C36]">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#002020] border-[#BDCDCF]/40">
                  <SelectItem value="all" className="hover:bg-[#f0f5f5] dark:hover:bg-[#003332]">All Prices</SelectItem>
                  <SelectItem value="under-25" className="hover:bg-[#f0f5f5] dark:hover:bg-[#003332]">Under $25</SelectItem>
                  <SelectItem value="25-50" className="hover:bg-[#f0f5f5] dark:hover:bg-[#003332]">$25 - $50</SelectItem>
                  <SelectItem value="50-100" className="hover:bg-[#f0f5f5] dark:hover:bg-[#003332]">$50 - $100</SelectItem>
                  <SelectItem value="over-100" className="hover:bg-[#f0f5f5] dark:hover:bg-[#003332]">Over $100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-16 bg-[#034C36]"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#003332] dark:text-[#BDCDCF] tracking-wide">
                FEATURED {category.name.toUpperCase()}
              </h2>
              <div className="h-px flex-1 bg-[#034C36]/20"></div>
            </div>
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-[#f0f5f5] dark:bg-[#002020] rounded-lg border border-[#BDCDCF]/20 p-4 animate-pulse">
                    <div className="bg-[#BDCDCF]/30 rounded-lg aspect-square mb-4"></div>
                    <div className="h-5 bg-[#BDCDCF]/30 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-[#BDCDCF]/30 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-[#BDCDCF]/30 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            }>
              <ProductGrid products={featuredProducts} />
            </Suspense>
          </section>
        )}

        {/* Sale Products */}
        {saleProducts.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-16 bg-[#034C36]"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#003332] dark:text-[#BDCDCF] tracking-wide">
                {category.name.toUpperCase()} ON SALE
              </h2>
              <div className="h-px flex-1 bg-[#034C36]/20"></div>
            </div>
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-[#f0f5f5] dark:bg-[#002020] rounded-lg border border-[#BDCDCF]/20 p-4 animate-pulse">
                    <div className="bg-[#BDCDCF]/30 rounded-lg aspect-square mb-4"></div>
                    <div className="h-5 bg-[#BDCDCF]/30 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-[#BDCDCF]/30 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-[#BDCDCF]/30 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            }>
              <ProductGrid products={saleProducts} />
            </Suspense>
          </section>
        )}

        {/* All Products */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-[#034C36]"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#003332] dark:text-[#BDCDCF] tracking-wide">
              ALL {category.name.toUpperCase()}
            </h2>
            <div className="h-px flex-1 bg-[#034C36]/20"></div>
          </div>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#f0f5f5] dark:bg-[#002020] rounded-lg border border-[#BDCDCF]/20 p-4 animate-pulse">
                  <div className="bg-[#BDCDCF]/30 rounded-lg aspect-square mb-4"></div>
                  <div className="h-5 bg-[#BDCDCF]/30 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-[#BDCDCF]/30 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-[#BDCDCF]/30 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          }>
            <ProductGrid products={products} />
          </Suspense>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const supabase = createBuildClient();
  const { data: categories } = await supabase.from("categories").select("slug");

  return (
    categories?.map((category) => ({
      slug: category.slug,
    })) || []
  );
}