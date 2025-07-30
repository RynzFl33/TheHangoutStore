import { createClient } from "../../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface FavoriteItem {
  id: string;
  created_at: string;
  products: {
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
  };
}

async function getFavorites() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: favorites, error } = await supabase
    .from("favorites")
    .select(
      `
      *,
      products (
        id,
        name,
        description,
        price,
        sale_price,
        image_url,
        is_on_sale,
        is_featured,
        sizes,
        colors,
        stock_quantity
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  return favorites as FavoriteItem[];
}

export default async function FavoritesPage() {
  const favorites = await getFavorites();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {favorites.length} {favorites.length === 1 ? "item" : "items"} in
            your favorites
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start browsing and add items to your favorites to see them here.
            </p>
            <Link href="/shop">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            <div className="mb-8 flex flex-wrap gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Add All to Cart
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Clear All Favorites
              </Button>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite) => (
                <ProductCard
                  key={favorite.id}
                  product={favorite.products}
                  showAddToCart={true}
                  showFavorite={true}
                />
              ))}
            </div>

            {/* Recommendations */}
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                You might also like
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Based on your favorites, here are some similar items you might
                enjoy.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Placeholder for recommended products */}
                <div className="bg-gray-100 dark:bg-slate-800 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Recommended Product 1
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-slate-800 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Recommended Product 2
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-slate-800 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Recommended Product 3
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-slate-800 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Recommended Product 4
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
