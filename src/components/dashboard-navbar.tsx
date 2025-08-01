"use client";

import Link from "next/link";
import { createClient } from "../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCircle, Settings, LogOut, LayoutDashboard, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("role, email")
          .eq("id", user.id)
          .single();
        setUserRole(userData?.role || "user");
        setUserEmail(userData?.email || user.email);
      }
    };
    getUserDetails();
  }, [supabase]);

  return (
    <nav className="w-full border-b border-[#BDCDCF] bg-[#003332] py-3 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#034C36] p-2 rounded-lg group-hover:bg-[#026548] transition-colors">
              <ShoppingBag className="h-5 w-5 text-[#BDCDCF]" />
            </div>
            <span className="text-xl font-bold text-[#BDCDCF] group-hover:text-white transition-colors">
              TheHangout Store
            </span>
          </Link>
          
          <div className="hidden md:flex gap-1">
            <Link href="/dashboard" className="px-3 py-1.5 rounded-md text-[#BDCDCF] hover:bg-[#014c4a] hover:text-white transition-colors text-sm font-medium">
              Overview
            </Link>
            {userRole === "admin" && (
              <>
                <Link href="/dashboard/admin" className="px-3 py-1.5 rounded-md text-[#BDCDCF] hover:bg-[#014c4a] hover:text-white transition-colors text-sm font-medium">
                  Admin
                </Link>
                <Link href="/dashboard/admin/orders" className="px-3 py-1.5 rounded-md text-[#BDCDCF] hover:bg-[#014c4a] hover:text-white transition-colors text-sm font-medium">
                  Orders
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="hidden md:block text-sm text-[#9CB0B3]">
            {userEmail ? (
              <span className="font-medium text-[#BDCDCF]">{userEmail}</span>
            ) : (
              <span className="animate-pulse">Loading...</span>
            )}
          </div>
          
          <DropdownMenu onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`p-2 rounded-full ${isMenuOpen ? 'bg-[#014c4a] text-white' : 'text-[#BDCDCF] hover:bg-[#014c4a] hover:text-white'}`}
              >
                <UserCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="bg-[#003332] border border-[#BDCDCF] rounded-lg shadow-lg min-w-[200px]"
            >
              <div className="px-4 py-3 border-b border-[#BDCDCF]/20">
                <p className="text-sm text-[#BDCDCF]">Signed in as</p>
                <p className="text-sm font-medium text-white truncate max-w-[180px]">
                  {userEmail || "user@example.com"}
                </p>
              </div>
              
              <DropdownMenuItem asChild>
                <Link 
                  href="/dashboard" 
                  className="flex items-center px-4 py-2 text-sm text-[#BDCDCF] hover:bg-[#014c4a] hover:text-white cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4 mr-3" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              
              {userRole === "admin" && (
                <DropdownMenuItem asChild>
                  <Link 
                    href="/dashboard/admin" 
                    className="flex items-center px-4 py-2 text-sm text-[#BDCDCF] hover:bg-[#014c4a] hover:text-white cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem 
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
                className="flex items-center px-4 py-2 text-sm text-[#BDCDCF] hover:bg-[#014c4a] hover:text-white cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden border-t border-[#BDCDCF]/20 mt-3 pt-3 pb-2 px-4 flex gap-1 overflow-x-auto">
        <Link href="/dashboard" className="px-3 py-1.5 rounded-md text-[#BDCDCF] hover:bg-[#014c4a] hover:text-white transition-colors text-xs font-medium whitespace-nowrap">
          Overview
        </Link>
        {userRole === "admin" && (
          <>
            <Link href="/dashboard/admin" className="px-3 py-1.5 rounded-md text-[#BDCDCF] hover:bg-[#014c4a] hover:text-white transition-colors text-xs font-medium whitespace-nowrap">
              Admin
            </Link>
            <Link href="/dashboard/admin/orders" className="px-3 py-1.5 rounded-md text-[#BDCDCF] hover:bg-[#014c4a] hover:text-white transition-colors text-xs font-medium whitespace-nowrap">
              Orders
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}