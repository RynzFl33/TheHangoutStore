"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { User, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Get user role from database
        const { data: userProfile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        setUserRole(userProfile?.role || "user");
      } else {
        setUserRole(null);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        // Get user role from database
        const { data: userProfile } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        setUserRole(userProfile?.role || "user");
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          TheHangout
        </Link>
        <div className="flex gap-4 items-center">
          <Link
            href="/shop"
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Shop
          </Link>
          <Link
            href="/categories"
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Categories
          </Link>
          {user ? (
            <>
              <Link
                href="/orders"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                My Orders
              </Link>
              <Link
                href="/favorites"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Favorites
              </Link>
              {userRole === "admin" && (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <Button>Dashboard</Button>
                </Link>
              )}
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
