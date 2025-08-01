import { createClient } from "../../supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, ChevronRight, X } from "lucide-react";
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
    `
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
    <div className="min-h-screen bg-[#f7f9f9] dark:bg-[#001a1a]">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-[#5a7270]">
          <Link href="/" className="hover:text-[#034C36] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/account" className="hover:text-[#034C36] transition-colors">
            Account
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-[#003332] font-medium">Favorites</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#003332] dark:text-[#BDCDCF] mb-2">
            My Favorites
          </h1>
          <p className="text-[#5a7270] dark:text-[#9bb0b3]">
            {favorites.length} {favorites.length === 1 ? "item" : "items"} in
            your favorites
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16 max-w-2xl mx-auto">
            <div className="bg-[#e6f0f0] dark:bg-[#003332] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-[#034C36] dark:text-[#8ac0b0]" />
            </div>
            <h2 className="text-2xl font-bold text-[#003332] dark:text-white mb-4">
              Your favorites list is empty
            </h2>
            <p className="text-[#5a7270] dark:text-[#9bb0b3] mb-8">
              Start adding items you love to your favorites. Click the heart icon on any product to save it here for later.
            </p>
            <Link href="/shop">
              <Button className="bg-[#034C36] hover:bg-[#003332] text-white px-8 py-6 font-medium transition-all duration-300 transform hover:-translate-y-1">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Discover New Arrivals
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            <div className="mb-8 flex flex-wrap gap-4">
              <Button className="bg-[#034C36] hover:bg-[#003332] text-white px-6 py-5 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Add All to Cart
              </Button>
              <Button variant="outline" className="text-[#003332] dark:text-[#BDCDCF] border-[#BDCDCF] hover:bg-[#f0f5f5] dark:hover:bg-[#003332] px-6 py-5 flex items-center gap-2">
                <X className="w-5 h-5" />
                Clear All Favorites
              </Button>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="bg-white dark:bg-[#002626] rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative">
                    <div className="absolute top-3 right-3 bg-white dark:bg-[#002626] rounded-full p-2 shadow-md">
                      <Heart className="w-5 h-5 text-[#d44949] fill-[#d44949]" />
                    </div>
                    <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-64" />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-[#003332] dark:text-white">{favorite.products.name}</h3>
                      <div className="flex flex-col items-end">
                        {favorite.products.is_on_sale ? (
                          <>
                            <span className="text-[#034C36] font-bold text-lg">${favorite.products.sale_price.toFixed(2)}</span>
                            <span className="text-gray-400 dark:text-[#9bb0b3] line-through text-sm">${favorite.products.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="text-[#003332] dark:text-white font-bold text-lg">${favorite.products.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-[#5a7270] dark:text-[#9bb0b3] text-sm mb-4 line-clamp-2">
                      {favorite.products.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {favorite.products.colors.slice(0, 3).map((color, index) => (
                          <div 
                            key={index} 
                            className="w-5 h-5 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        {favorite.products.colors.length > 3 && (
                          <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                            +{favorite.products.colors.length - 3}
                          </div>
                        )}
                      </div>
                      
                      <Button size="sm" className="bg-[#034C36] hover:bg-[#003332]">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <section className="mt-20 pt-10 border-t border-[#dde7e7] dark:border-[#003332]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#003332] dark:text-white">
                  Recommended for you
                </h2>
                <Link href="/shop" className="flex items-center text-[#034C36] hover:text-[#003332] transition-colors font-medium">
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <p className="text-[#5a7270] dark:text-[#9bb0b3] mb-8 max-w-2xl">
                Based on your favorites, here are some similar items you might enjoy.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Recommended Product 1 */}
                <div className="bg-white dark:bg-[#002626] rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-56" />
                  <div className="p-5">
                    <h3 className="font-bold text-[#003332] dark:text-white mb-1">Premium Wool Coat</h3>
                    <p className="text-[#5a7270] dark:text-[#9bb0b3] text-sm mb-3">Classic winter essential</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-[#034C36]">$189.99</span>
                      <Button size="sm" className="bg-[#034C36] hover:bg-[#003332]">Add to Cart</Button>
                    </div>
                  </div>
                </div>
                
                {/* Recommended Product 2 */}
                <div className="bg-white dark:bg-[#002626] rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-56" />
                  <div className="p-5">
                    <h3 className="font-bold text-[#003332] dark:text-white mb-1">Designer Jeans</h3>
                    <p className="text-[#5a7270] dark:text-[#9bb0b3] text-sm mb-3">Slim fit, premium denim</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-[#034C36]">$129.99</span>
                      <Button size="sm" className="bg-[#034C36] hover:bg-[#003332]">Add to Cart</Button>
                    </div>
                  </div>
                </div>
                
                {/* Recommended Product 3 */}
                <div className="bg-white dark:bg-[#002626] rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-56" />
                  <div className="p-5">
                    <h3 className="font-bold text-[#003332] dark:text-white mb-1">Leather Boots</h3>
                    <p className="text-[#5a7270] dark:text-[#9bb0b3] text-sm mb-3">Waterproof, all-season</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-[#034C36]">$159.99</span>
                      <Button size="sm" className="bg-[#034C36] hover:bg-[#003332]">Add to Cart</Button>
                    </div>
                  </div>
                </div>
                
                {/* Recommended Product 4 */}
                <div className="bg-white dark:bg-[#002626] rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-56" />
                  <div className="p-5">
                    <h3 className="font-bold text-[#003332] dark:text-white mb-1">Silk Blouse</h3>
                    <p className="text-[#5a7270] dark:text-[#9bb0b3] text-sm mb-3">Elegant evening wear</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-[#034C36]">$89.99</span>
                      <Button size="sm" className="bg-[#034C36] hover:bg-[#003332]">Add to Cart</Button>
                    </div>
                  </div>
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