import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import DashboardNavbar from "@/components/dashboard-navbar";
import OrderManagement from "./components/OrderManagement";
import { InfoIcon } from "lucide-react";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is admin
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = userData?.role || "user";

  if (userRole !== "admin") {
    return redirect("/dashboard");
  }

  // Fetch orders for the admin dashboard
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Order Management
            </h1>
            <div className="bg-blue-50 dark:bg-blue-900/20 text-sm p-3 px-4 rounded-lg text-blue-700 dark:text-blue-300 flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Manage customer orders, update statuses, and track order history
              </span>
            </div>
          </header>

          {/* Order Management */}
          <OrderManagement initialOrders={orders || []} />
        </div>
      </main>
    </>
  );
}
