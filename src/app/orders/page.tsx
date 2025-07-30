"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ShoppingBag,
} from "lucide-react";

interface Order {
  id: string;
  user_id?: string;
  user_email?: string;
  product_ids: any[];
  order_code: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/sign-in");
          return;
        }

        setUser(user);

        const { data: orders, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
          setOrders([]);
        } else {
          setOrders(orders as Order[]);
          setFilteredOrders(orders as Order[]);
        }
      } catch (error) {
        console.error("Error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [supabase, router]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.order_code.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredOrders(filtered);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-600">
            <Package className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Shipped
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-emerald-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getTotalProducts = (productIds: any[]) => {
    return productIds.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading your orders...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track and manage your orders
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by order code..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-800"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "No orders found" : "No orders yet"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "Start shopping to see your orders here."}
            </p>
            {!searchTerm && (
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Start Shopping
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">
                          {order.order_code}
                        </code>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <div>
                          {getTotalProducts(order.product_ids)} items •{" "}
                          {formatPrice(order.total_amount)}
                        </div>
                        <div>Ordered on {formatDate(order.created_at)}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleViewOrder(order)}
                      className="w-full md:w-auto"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Order Code
                  </label>
                  <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    {selectedOrder.order_code}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Order Date
                  </label>
                  <p className="text-sm">
                    {formatDate(selectedOrder.created_at)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Amount
                  </label>
                  <p className="text-sm font-bold">
                    {formatPrice(selectedOrder.total_amount)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Products Ordered
                </label>
                <div className="space-y-3">
                  {selectedOrder.product_ids.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {item.size && <span>Size: {item.size} • </span>}
                            {item.color && <span>Color: {item.color} • </span>}
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatPrice(item.price)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Total: {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
