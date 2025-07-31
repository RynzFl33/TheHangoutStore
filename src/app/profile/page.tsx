import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { UserCircle, Mail, Calendar, Shield, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user profile data from database
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get user's order count
  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Get user's favorites count
  const { count: favoritesCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {userProfile?.avatar_url ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                    <Image
                      src={userProfile.avatar_url}
                      alt="Profile"
                      fill
                      sizes="96px" // since w-24/h-24 = 96px
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="w-16 h-16 text-primary" />
                  </div>
                )}

              </div>
              <CardTitle className="text-2xl">
                {userProfile?.full_name || userProfile?.name || "User"}
              </CardTitle>
              <div className="flex justify-center">
                <Badge
                  variant={
                    userProfile?.role === "admin" ? "default" : "secondary"
                  }
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {userProfile?.role || "user"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Information
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(userProfile?.created_at || user.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Statistics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {orderCount || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Orders
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {favoritesCount || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Favorite Items
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono text-xs">{user.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>
                      {userProfile?.updated_at
                        ? formatDate(userProfile.updated_at)
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Email Verified:
                    </span>
                    <span>
                      {user.email_confirmed_at ? (
                        <Badge variant="outline" className="text-green-600">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600">
                          Pending
                        </Badge>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
