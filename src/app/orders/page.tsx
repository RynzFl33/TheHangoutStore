"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";
import type { User } from "@supabase/supabase-js";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

interface Product {
  name: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user_id?: string;
  user_email?: string;
  product_ids: Product[];
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
  const [, setUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
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

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      const { error } = await supabase.from("orders").delete().eq("id", orderToDelete.id);
      if (error) {
        alert("Failed to delete order.");
        return;
      }
      setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
      setFilteredOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
      setIsViewDialogOpen(false);
      setShowDeleteDialog(false);
      setOrderToDelete(null);
    } catch {
      alert("An error occurred while deleting the order.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-[#003332]/20 text-[#003332] dark:text-[#BDCDCF] border border-[#003332]/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-[#034C36]/30 text-[#034C36] dark:text-[#BDCDCF] border border-[#034C36]/40">
            <Package className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-[#006D77]/20 text-[#006D77] dark:text-[#BDCDCF] border border-[#006D77]/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Shipped
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-[#028090]/20 text-[#028090] dark:text-[#BDCDCF] border border-[#028090]/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-[#E63946]/20 text-[#E63946] dark:text-[#FFA69E] border border-[#E63946]/30">
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

  const getTotalProducts = (productIds: Product[]) => {
    return productIds.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-gradient-to-b dark:from-[#001A19] dark:to-[#022E22]">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#034C36] mx-auto"></div>
            <p className="mt-4 text-[#003332] dark:text-[#BDCDCF]">
              Loading your orders...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gradient-to-b dark:from-[#001A19] dark:to-[#022E22]">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#003332] dark:text-[#BDCDCF] mb-2">
            My Orders
          </h1>
          <p className="text-[#003332]/80 dark:text-[#BDCDCF]">
            Track and manage your orders
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#003332] w-4 h-4" />
            <Input
              placeholder="Search by order code..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white dark:bg-[#022E22] border border-[#BDCDCF] text-[#003332] dark:text-[#BDCDCF]"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-[#BDCDCF] mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-[#003332] dark:text-[#BDCDCF] mb-2">
              {searchTerm ? "No orders found" : "No orders yet"}
            </h2>
            <p className="text-[#003332]/80 dark:text-[#BDCDCF] mb-6">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "Start shopping to see your orders here."}
            </p>
            {!searchTerm && (
              <Button className="bg-[#034C36] hover:bg-[#003332] text-white">
                Start Shopping
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card 
                key={order.id} 
                className="bg-white dark:bg-[#022E22] border border-[#BDCDCF]/50"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <code className="bg-[#BDCDCF]/20 text-[#003332] dark:text-[#BDCDCF] px-2 py-1 rounded text-sm font-mono">
                          {order.order_code}
                        </code>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-[#003332]/80 dark:text-[#BDCDCF]">
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
                      className="w-full md:w-auto border-[#034C36] text-[#034C36] hover:bg-[#034C36]/10 hover:text-[#034C36] dark:border-[#BDCDCF] dark:text-[#BDCDCF] dark:hover:bg-[#003332]"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#022E22] border border-[#BDCDCF]">
          <DialogHeader>
            <DialogTitle className="text-[#003332] dark:text-[#BDCDCF]">
              Order Details
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 text-[#003332] dark:text-[#BDCDCF]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Order Code
                  </label>
                  <p className="text-sm font-mono bg-[#BDCDCF]/20 p-2 rounded">
                    {selectedOrder.order_code}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Status
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Order Date
                  </label>
                  <p className="text-sm">
                    {formatDate(selectedOrder.created_at)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Total Amount
                  </label>
                  <p className="text-sm font-bold">
                    {formatPrice(selectedOrder.total_amount)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Products Ordered
                </label>
                <div className="space-y-3">
                  {selectedOrder.product_ids.map((item: Product, index) => (
                    <div
                      key={index}
                      className="bg-[#BDCDCF]/10 dark:bg-[#003332] p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm text-[#003332]/80 dark:text-[#BDCDCF] mt-1">
                            {item.size && <span>Size: {item.size} • </span>}
                            {item.color && <span>Color: {item.color} • </span>}
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatPrice(item.price)}
                          </div>
                          <div className="text-sm text-[#003332]/80 dark:text-[#BDCDCF]">
                            Total: {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-[#E63946]/90 hover:bg-[#E63946] text-white"
                  onClick={() => {
                    setOrderToDelete(selectedOrder);
                    setShowDeleteDialog(true);
                  }}
                >
                  Delete Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white dark:bg-[#022E22] border border-[#BDCDCF]">
          <DialogHeader>
            <DialogTitle className="text-[#003332] dark:text-[#BDCDCF]">
              Delete Order
            </DialogTitle>
          </DialogHeader>
          <p className="text-[#003332] dark:text-[#BDCDCF]">
            Are you sure you want to delete this order?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="border-[#034C36] text-[#034C36] hover:bg-[#034C36]/10 dark:border-[#BDCDCF] dark:text-[#BDCDCF] dark:hover:bg-[#003332]"
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#E63946]/90 hover:bg-[#E63946] text-white"
              onClick={handleDeleteOrder}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}