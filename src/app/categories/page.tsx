import { createClient } from "../../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  product_count?: number;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  product_count?: number;
}

async function getCategories() {
  const supabase = await createClient();

  // Get categories with subcategories and product counts
  const { data: categories, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      products(count),
      subcategories(
        *,
        products(count)
      )
    `,
    )
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return categories.map((category) => ({
    ...category,
    product_count: category.products?.[0]?.count || 0,
    subcategories:
      category.subcategories?.map((sub: any) => ({
        ...sub,
        product_count: sub.products?.[0]?.count || 0,
      })) || [],
  })) as Category[];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Shop by Category
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Explore our curated collections of streetwear and fashion essentials
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Categories with Subcategories */}
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category.id} className="space-y-6">
              {/* Main Category Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {category.description}
                  </p>
                </div>
                <Link href={`/categories/${category.slug}`}>
                  <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2">
                    View All ({category.product_count} items)
                  </Badge>
                </Link>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.subcategories?.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/categories/${category.slug}/${subcategory.slug}`}
                  >
                    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900">
                      <div className="relative overflow-hidden">
                        <img
                          src={subcategory.image_url}
                          alt={subcategory.name}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                        {/* Product Count Badge */}
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white/90 text-gray-900 hover:bg-white text-xs">
                            {subcategory.product_count}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                          {subcategory.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {subcategory.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">
                            {subcategory.product_count} items
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Featured Categories Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            Popular Collections
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Large Featured Category */}
            <div className="lg:row-span-2">
              <Link href="/categories/hoodies">
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full bg-white dark:bg-slate-900">
                  <div className="relative overflow-hidden h-64 lg:h-full">
                    <img
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                      alt="Hoodies Collection"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        Hoodies & Sweatshirts
                      </h3>
                      <p className="text-gray-200 mb-4">
                        Cozy vibes for every season
                      </p>
                      <Badge className="bg-purple-600 hover:bg-purple-700">
                        Shop Now
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>

            {/* Smaller Featured Categories */}
            <div className="space-y-4">
              <Link href="/categories/tees">
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900">
                  <div className="relative overflow-hidden h-24">
                    <img
                      src="https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80"
                      alt="T-Shirts Collection"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center left-4 text-white">
                      <div>
                        <h3 className="text-lg font-bold">Graphic Tees</h3>
                        <p className="text-gray-200 text-xs">
                          Express your style
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/categories/streetwear">
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900">
                  <div className="relative overflow-hidden h-24">
                    <img
                      src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80"
                      alt="Streetwear Collection"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center left-4 text-white">
                      <div>
                        <h3 className="text-lg font-bold">Streetwear</h3>
                        <p className="text-gray-200 text-xs">
                          Urban fashion essentials
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/categories/accessories">
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900">
                  <div className="relative overflow-hidden h-24">
                    <img
                      src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80"
                      alt="Accessories Collection"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center left-4 text-white">
                      <div>
                        <h3 className="text-lg font-bold">Accessories</h3>
                        <p className="text-gray-200 text-xs">
                          Complete your look
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
