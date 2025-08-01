import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import { UserCircle, Mail, Calendar, Shield, User, ShoppingBag, Heart, Package, Settings, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Added missing Button import

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
    <div className="min-h-screen bg-[#f7f9f9] dark:bg-[#001a1a]">
      <Navbar />
      
      <div className="bg-gradient-to-r from-[#003332] to-[#034C36] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              {userProfile?.avatar_url ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/30">
                  <Image
                    src={userProfile.avatar_url}
                    alt="Profile"
                    fill
                    sizes="96px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#BDCDCF] flex items-center justify-center border-4 border-white/30">
                  <UserCircle className="w-16 h-16 text-[#034C36]" />
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">
                {userProfile?.full_name || userProfile?.name || "User"}
              </h1>
              <div className="flex justify-center md:justify-start mt-2">
                <Badge className="bg-[#BDCDCF] text-[#003332] px-3 py-1">
                  <Shield className="w-4 h-4 mr-1" />
                  {userProfile?.role || "user"}
                </Badge>
              </div>
              <p className="text-[#BDCDCF] mt-2">
                Member since {formatDate(userProfile?.created_at || user.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 -mt-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-[#002626] border border-[#dde7e7] rounded-xl overflow-hidden shadow-sm">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <Link href="#" className="flex items-center gap-3 p-3 bg-[#e6f0f0] dark:bg-[#003332] rounded-lg text-[#003332] dark:text-white font-medium">
                    <User className="w-5 h-5" />
                    Profile Overview
                  </Link>
                  <Link href="#" className="flex items-center gap-3 p-3 hover:bg-[#e6f0f0] dark:hover:bg-[#003332] rounded-lg text-[#5a7270] dark:text-[#9bb0b3] transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                    My Orders
                    <Badge className="ml-auto bg-[#034C36] text-white">{orderCount || 0}</Badge>
                  </Link>
                  <Link href="#" className="flex items-center gap-3 p-3 hover:bg-[#e6f0f0] dark:hover:bg-[#003332] rounded-lg text-[#5a7270] dark:text-[#9bb0b3] transition-colors">
                    <Heart className="w-5 h-5" />
                    My Favorites
                    <Badge className="ml-auto bg-[#034C36] text-white">{favoritesCount || 0}</Badge>
                  </Link>
                  <Link href="#" className="flex items-center gap-3 p-3 hover:bg-[#e6f0f0] dark:hover:bg-[#003332] rounded-lg text-[#5a7270] dark:text-[#9bb0b3] transition-colors">
                    <Package className="w-5 h-5" />
                    Shipping Addresses
                  </Link>
                  <Link href="#" className="flex items-center gap-3 p-3 hover:bg-[#e6f0f0] dark:hover:bg-[#003332] rounded-lg text-[#5a7270] dark:text-[#9bb0b3] transition-colors">
                    <Settings className="w-5 h-5" />
                    Account Settings
                  </Link>
                  <Link href="/sign-out" className="flex items-center gap-3 p-3 hover:bg-[#e6f0f0] dark:hover:bg-[#003332] rounded-lg text-[#5a7270] dark:text-[#9bb0b3] transition-colors">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </Link>
                </nav>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-[#002626] border border-[#dde7e7] rounded-xl overflow-hidden shadow-sm mt-8">
              <CardHeader className="border-b border-[#dde7e7] dark:border-[#003332] py-4">
                <CardTitle className="text-lg font-bold text-[#003332] dark:text-white">
                  Account Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#e6f0f0] dark:bg-[#003332] w-10 h-10 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-[#034C36] dark:text-[#8ac0b0]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#5a7270] dark:text-[#9bb0b3]">Total Orders</p>
                        <p className="font-bold text-lg text-[#003332] dark:text-white">{orderCount || 0}</p>
                      </div>
                    </div>
                    <Link href="#" className="text-sm font-medium text-[#034C36] hover:text-[#003332]">
                      View All
                    </Link>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#e6f0f0] dark:bg-[#003332] w-10 h-10 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-[#034C36] dark:text-[#8ac0b0]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#5a7270] dark:text-[#9bb0b3]">Favorite Items</p>
                        <p className="font-bold text-lg text-[#003332] dark:text-white">{favoritesCount || 0}</p>
                      </div>
                    </div>
                    <Link href="#" className="text-sm font-medium text-[#034C36] hover:text-[#003332]">
                      View All
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-[#002626] border border-[#dde7e7] rounded-xl overflow-hidden shadow-sm">
              <CardHeader className="border-b border-[#dde7e7] dark:border-[#003332] py-4">
                <CardTitle className="text-lg font-bold text-[#003332] dark:text-white">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#e6f0f0] dark:bg-[#003332] w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#034C36] dark:text-[#8ac0b0]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#003332] dark:text-white">Personal Information</h3>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#5a7270] dark:text-[#9bb0b3]">Full Name</p>
                          <p className="text-[#003332] dark:text-white">
                            {userProfile?.full_name || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a7270] dark:text-[#9bb0b3]">Username</p>
                          <p className="text-[#003332] dark:text-white">
                            {userProfile?.username || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a7270] dark:text-[#9bb0b3]">Phone</p>
                          <p className="text-[#003332] dark:text-white">
                            {userProfile?.phone || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a7270] dark:text-[#9bb0b3]">Date of Birth</p>
                          <p className="text-[#003332] dark:text-white">
                            {userProfile?.dob ? formatDate(userProfile.dob) : "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-[#dde7e7] dark:bg-[#003332]" />
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-[#e6f0f0] dark:bg-[#003332] w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#034C36] dark:text-[#8ac0b0]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#003332] dark:text-white">Email Address</h3>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-[#003332] dark:text-white">{user.email}</p>
                          <div className="mt-1">
                            {user.email_confirmed_at ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                Verified
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                Pending verification
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button className="bg-white dark:bg-[#003332] border border-[#dde7e7] dark:border-[#034C36] text-[#034C36] hover:bg-[#e6f0f0] dark:hover:bg-[#034C36]/20">
                          Change Email
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-[#dde7e7] dark:bg-[#003332]" />
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-[#e6f0f0] dark:bg-[#003332] w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-[#034C36] dark:text-[#8ac0b0]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#003332] dark:text-white">Security</h3>
                      <div className="mt-2">
                        <p className="text-sm text-[#5a7270] dark:text-[#9bb0b3]">
                          Manage your password and security settings
                        </p>
                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-[#003332] dark:text-white">Password</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm text-[#003332] dark:text-white">2FA</span>
                          </div>
                        </div>
                        <Button className="mt-4 bg-white dark:bg-[#003332] border border-[#dde7e7] dark:border-[#034C36] text-[#034C36] hover:bg-[#e6f0f0] dark:hover:bg-[#034C36]/20">
                          Update Security Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-[#dde7e7] dark:bg-[#003332]" />
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-[#e6f0f0] dark:bg-[#003332] w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-[#034C36] dark:text-[#8ac0b0]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#003332] dark:text-white">Account Details</h3>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#5a7270] dark:text-[#9bb0b3]">User ID</p>
                          <p className="text-sm text-[#003332] dark:text-white truncate">{user.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a7270] dark:text-[#9bb0b3]">Last Updated</p>
                          <p className="text-sm text-[#003332] dark:text-white">
                            {userProfile?.updated_at ? formatDate(userProfile.updated_at) : "Never"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a7270] dark:text-[#9bb0b3]">Account Status</p>
                          <p className="text-sm text-[#003332] dark:text-white">Active</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#5a7270] dark:text-[#9bb0b3]">Plan</p>
                          <p className="text-sm text-[#003332] dark:text-white">Standard</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 flex justify-end">
              <Button className="bg-[#034C36] hover:bg-[#003332] text-white px-6 py-5">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}