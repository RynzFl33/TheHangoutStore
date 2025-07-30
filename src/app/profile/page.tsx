"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit,
  Save,
  X,
  Package,
  Heart,
  Settings,
  Shield,
} from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  order_code: string;
  total_amount: number;
  status: string;
  created_at: string;
  product_ids: any[];
}

interface Favorite {
  id: string;
  created_at: string;
  products: {
    id: string;
    name: string;
    price: number;
    sale_price: number;
    image_url: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/sign-in");
          return;
        }

        setUser(user);

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          setUserProfile(profile);
          setEditForm({
            full_name: profile.full_name || "",
            email: profile.email || user.email || "",
          });
        }

        // Get recent orders
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
        } else {
          setRecentOrders(orders || []);
        }

        // Get favorites
        const { data: favs, error: favsError } = await supabase
          .from("favorites")
          .select(
            `
            *,
            products (
              id,
              name,
              price,
              sale_price,
              image_url
            )
          `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(6);

        if (favsError) {
          console.error("Error fetching favorites:", favsError);
        } else {
          setFavorites(favs || []);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [supabase, router]);

  const handleUpdateProfile = async () => {
    if (!user || !userProfile) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: editForm.full_name,
          email: editForm.email,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setUserProfile({
        ...userProfile,
        full_name: editForm.full_name,
        email: editForm.email,
      });

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-600">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-green-600">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-emerald-600">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading your profile...
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
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={userProfile?.avatar_url}
                    alt={userProfile?.full_name || "User"}
                  />
                  <AvatarFallback className="text-2xl bg-purple-100 text-purple-600">
                    {userProfile?.full_name
                      ? getInitials(userProfile.full_name)
                      : "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={editForm.full_name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            full_name: e.target.value,
                          })
                        }
                        placeholder="Full Name"
                        className="text-lg font-semibold"
                      />
                      <Input
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        placeholder="Email"
                        type="email"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleUpdateProfile}
                          disabled={updating}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {updating ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {userProfile?.full_name || "User"}
                        </h1>
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                        <Mail className="w-4 h-4" />
                        <span>{userProfile?.email || user?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Member since{" "}
                          {formatDate(userProfile?.created_at || "")}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            userProfile?.role === "admin"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            userProfile?.role === "admin" ? "bg-purple-600" : ""
                          }
                        >
                          {userProfile?.role === "admin" ? (
                            <Shield className="w-3 h-3 mr-1" />
                          ) : (
                            <User className="w-3 h-3 mr-1" />
                          )}
                          {userProfile?.role || "user"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card className="bg-white dark:bg-slate-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Orders
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {recentOrders.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lifetime orders placed
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Favorites
                  </CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{favorites.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Items in wishlist
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Account Type
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">
                    {userProfile?.role || "User"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current account level
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="mt-6 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            Order {order.order_code}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(order.total_amount)}
                          </p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                    No recent activity
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order History</CardTitle>
                <Link href="/orders">
                  <Button variant="outline" size="sm">
                    View All Orders
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">
                            Order {order.order_code}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {order.product_ids.length} items •{" "}
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-2 md:mt-0">
                          <span className="font-medium">
                            {formatPrice(order.total_amount)}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      No orders found
                    </p>
                    <Link href="/shop">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Favorite Items</CardTitle>
                <Link href="/favorites">
                  <Button variant="outline" size="sm">
                    View All Favorites
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((favorite) => (
                      <div
                        key={favorite.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <img
                          src={favorite.products.image_url}
                          alt={favorite.products.name}
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                        <h3 className="font-medium text-sm mb-2">
                          {favorite.products.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-600">
                            {formatPrice(
                              favorite.products.sale_price ||
                                favorite.products.price,
                            )}
                          </span>
                          {favorite.products.sale_price && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatPrice(favorite.products.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      No favorite items yet
                    </p>
                    <Link href="/shop">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
