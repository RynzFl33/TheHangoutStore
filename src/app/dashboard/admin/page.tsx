import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import DashboardNavbar from "@/components/dashboard-navbar";
import ProductManagement from "./components/ProductManagement";
import MessageManagement from "./components/MessageManagement";
import { InfoIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch products for the admin dashboard
  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(name),
      subcategories(name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  // Fetch categories for the form
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // Fetch subcategories for the form
  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("*")
    .order("name");

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <div className="bg-blue-50 dark:bg-blue-900/20 text-sm p-3 px-4 rounded-lg text-blue-700 dark:text-blue-300 flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Manage your store products, categories, and inventory from this
                dashboard
              </span>
            </div>
          </header>

          {/* Management Sections */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-6">
              <ProductManagement
                initialProducts={products || []}
                categories={categories || []}
                subcategories={subcategories || []}
              />
            </TabsContent>
            <TabsContent value="messages" className="mt-6">
              <MessageManagement />
            </TabsContent>
            <TabsContent value="orders" className="mt-6">
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Order management is available on a dedicated page for better
                  performance.
                </p>
                <Link href="/dashboard/admin/orders">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Go to Order Management
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
