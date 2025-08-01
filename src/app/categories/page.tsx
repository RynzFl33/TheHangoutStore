import { createClient } from "../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
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
  products?: { count: number }[];
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
      category.subcategories?.map((sub: Subcategory) => ({
        ...sub,
        product_count: sub.products?.[0]?.count || 0,
      })) || [],
  })) as Category[];
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f5f5] to-[#e1e8e8] dark:from-[#001818] dark:to-[#001111]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#003332] to-[#034C36] text-[#BDCDCF] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
            SHOP BY CATEGORY
          </h1>
          <p className="text-lg text-[#BDCDCF]/90 max-w-2xl mx-auto font-light tracking-wide">
            Explore our curated collections of streetwear and fashion essentials
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Categories with Subcategories */}
        <div className="space-y-16">
          {categories.map((category) => (
            <div key={category.id} className="space-y-8">
              {/* Main Category Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#BDCDCF]/30 pb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#003332] dark:text-[#BDCDCF] uppercase tracking-wide">
                    {category.name}
                  </h2>
                  <p className="text-[#034C36] dark:text-[#BDCDCF]/80 mt-1 max-w-3xl">
                    {category.description}
                  </p>
                </div>
                <Link href={`/categories/${category.slug}`}>
                  <Badge className="bg-[#034C36] hover:bg-[#003332] text-[#BDCDCF] px-4 py-2 rounded-md transition-colors duration-300 group">
                    <span>View All ({category.product_count} items)</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Badge>
                </Link>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.subcategories?.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/categories/${category.slug}/${subcategory.slug}`}
                  >
                    <Card className="group overflow-hidden border border-[#BDCDCF]/20 hover:border-[#034C36]/50 transition-all duration-300 cursor-pointer bg-white dark:bg-[#001818] shadow-sm hover:shadow-md">
                      <div className="relative overflow-hidden">
                        <div className="aspect-square">
                          <Image
                            src={subcategory.image_url}
                            alt={subcategory.name}
                            width={500}
                            height={500}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#003332]/70 to-transparent" />

                        {/* Product Count Badge */}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-[#034C36]/90 text-[#BDCDCF] hover:bg-[#034C36] rounded px-2 py-1 text-xs">
                            {subcategory.product_count} items
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2 text-[#003332] dark:text-[#BDCDCF] group-hover:text-[#034C36] transition-colors">
                          {subcategory.name}
                        </h3>
                        <p className="text-sm text-[#034C36] dark:text-[#BDCDCF]/70 line-clamp-2">
                          {subcategory.description}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-[#034C36] dark:text-[#BDCDCF]/60">
                            Explore collection
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#034C36] dark:text-[#BDCDCF]/60 group-hover:text-[#003332] group-hover:translate-x-1 transition-all" />
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
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#003332] dark:text-[#BDCDCF] tracking-wide">
            POPULAR COLLECTIONS
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Large Featured Category */}
            <div className="lg:row-span-2">
              <Link href="/categories/hoodies">
                <Card className="group overflow-hidden border border-[#BDCDCF]/20 hover:border-[#034C36]/50 transition-all duration-300 cursor-pointer h-full bg-white dark:bg-[#001818]">
                  <div className="relative overflow-hidden h-[400px] lg:h-full">
                    <Image
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                      alt="Hoodies Collection"
                      width={800}
                      height={800}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003332]/80 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-[#BDCDCF]">
                      <h3 className="text-2xl font-bold mb-2">HOODIES & SWEATSHIRTS</h3>
                      <p className="text-[#BDCDCF]/90 mb-4 max-w-md">
                        Cozy vibes for every season with our premium collection
                      </p>
                      <Badge className="bg-[#034C36] hover:bg-[#003332] text-[#BDCDCF] px-4 py-2 rounded-md group-hover:bg-[#003332] transition-colors">
                        <span>Shop Collection</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>

            {/* Smaller Featured Categories */}
            <div className="space-y-6">
              <Link href="/categories/tees">
                <Card className="group overflow-hidden border border-[#BDCDCF]/20 hover:border-[#034C36]/50 transition-all duration-300 cursor-pointer bg-white dark:bg-[#001818]">
                  <div className="relative overflow-hidden h-40">
                    <Image
                      src="https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80"
                      alt="T-Shirts Collection"
                      width={600}
                      height={360}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#003332]/80 to-transparent" />
                    <div className="absolute inset-0 flex items-center left-6 text-[#BDCDCF]">
                      <div>
                        <h3 className="text-xl font-bold">GRAPHIC TEES</h3>
                        <p className="text-[#BDCDCF]/90 text-sm mt-1">
                          Express your unique style
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <ArrowRight className="w-5 h-5 text-[#BDCDCF] group-hover:text-[#034C36] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/categories/streetwear">
                <Card className="group overflow-hidden border border-[#BDCDCF]/20 hover:border-[#034C36]/50 transition-all duration-300 cursor-pointer bg-white dark:bg-[#001818]">
                  <div className="relative overflow-hidden h-40">
                    <Image
                      src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80"
                      alt="Streetwear Collection"
                      width={600}
                      height={360}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#003332]/80 to-transparent" />
                    <div className="absolute inset-0 flex items-center left-6 text-[#BDCDCF]">
                      <div>
                        <h3 className="text-xl font-bold">STREETWEAR</h3>
                        <p className="text-[#BDCDCF]/90 text-sm mt-1">
                          Urban fashion essentials
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <ArrowRight className="w-5 h-5 text-[#BDCDCF] group-hover:text-[#034C36] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/categories/accessories">
                <Card className="group overflow-hidden border border-[#BDCDCF]/20 hover:border-[#034C36]/50 transition-all duration-300 cursor-pointer bg-white dark:bg-[#001818]">
                  <div className="relative overflow-hidden h-40">
                    <Image
                      src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80"
                      alt="Accessories Collection"
                      width={600}
                      height={360}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#003332]/80 to-transparent" />
                    <div className="absolute inset-0 flex items-center left-6 text-[#BDCDCF]">
                      <div>
                        <h3 className="text-xl font-bold">ACCESSORIES</h3>
                        <p className="text-[#BDCDCF]/90 text-sm mt-1">
                          Complete your look
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <ArrowRight className="w-5 h-5 text-[#BDCDCF] group-hover:text-[#034C36] group-hover:translate-x-1 transition-all" />
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