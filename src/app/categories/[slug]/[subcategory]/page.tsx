import { createClient } from "../../../../../supabase/server";
import { createBuildClient } from "../../../../../supabase/client-build";
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
  subcategories: {
    name: string;
    slug: string;
    categories: {
      name: string;
      slug: string;
    };
  };
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  categories: {
    name: string;
    slug: string;
  };
}

async function getSubcategory(categorySlug: string, subcategorySlug: string) {
  const supabase = await createClient();
  const { data: subcategory, error } = await supabase
    .from("subcategories")
    .select(
      `
      *,
      categories (
        name,
        slug
      )
    `,
    )
    .eq("slug", subcategorySlug)
    .eq("categories.slug", categorySlug)
    .single();

  if (error || !subcategory) {
    return null;
  }

  return subcategory as Subcategory;
}

async function getSubcategoryProducts(subcategorySlug: string) {
  const supabase = await createClient();

  // First get the subcategory ID
  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("id")
    .eq("slug", subcategorySlug)
    .single();

  if (!subcategory) {
    return [];
  }

  // Then get products that belong to this subcategory
  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      subcategories (
        name,
        slug,
        categories (
          name,
          slug
        )
      )
    `,
    )
    .eq("subcategory_id", subcategory.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching subcategory products:", error);
    return [];
  }

  return products as Product[];
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No products found
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Check back soon for new arrivals in this subcategory.
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

export default async function SubcategoryPage({
  params,
}: {
  params: { slug: string; subcategory: string };
}) {
  const [subcategory, products] = await Promise.all([
    getSubcategory(params.slug, params.subcategory),
    getSubcategoryProducts(params.subcategory),
  ]);

  if (!subcategory) {
    notFound();
  }

  const featuredProducts = products.filter((p) => p.is_featured);
  const saleProducts = products.filter((p) => p.is_on_sale);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={subcategory.image_url}
            alt={subcategory.name}
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="flex items-center gap-2 text-purple-100 hover:text-white mb-4 transition-colors">
            <Link href="/categories" className="hover:underline">
              Categories
            </Link>
            <span>/</span>
            <Link
              href={`/categories/${subcategory.categories.slug}`}
              className="hover:underline"
            >
              {subcategory.categories.name}
            </Link>
            <span>/</span>
            <span>{subcategory.name}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {subcategory.name}
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl">
            {subcategory.description}
          </p>
          <div className="mt-6">
            <Badge className="bg-white/20 text-white border-white/30">
              {products.length} {products.length === 1 ? "Product" : "Products"}
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={`Search ${subcategory.name.toLowerCase()}...`}
                className="pl-10 bg-white dark:bg-slate-800"
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
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Featured {subcategory.name}
            </h2>
            <Suspense fallback={<div>Loading featured products...</div>}>
              <ProductGrid products={featuredProducts} />
            </Suspense>
          </section>
        )}

        {/* Sale Products */}
        {saleProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              {subcategory.name} on Sale
            </h2>
            <Suspense fallback={<div>Loading sale products...</div>}>
              <ProductGrid products={saleProducts} />
            </Suspense>
          </section>
        )}

        {/* All Products */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            All {subcategory.name}
          </h2>
          <Suspense fallback={<div>Loading products...</div>}>
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
  const { data: subcategories } = await supabase.from("subcategories").select(
    `
      slug,
      categories (
        slug
      )
    `,
  );

  return (
    subcategories?.map((subcategory) => ({
      slug: Array.isArray(subcategory.categories)
        ? (subcategory.categories[0]?.slug as string)
        : (subcategory.categories as { slug: string }).slug,
      subcategory: subcategory.slug,
    })) || []
  );
}
