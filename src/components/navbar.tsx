"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import UserProfile from "./user-profile";
import { motion } from "framer-motion";

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();
        setUserRole(userData?.role || "user");
      } else {
        setUserRole(null);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setUserRole(userData?.role || "user");
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full z-50 border-b border-[#F5DEB3]/30 bg-[#36454F]/80 backdrop-blur-md sticky top-0 shadow-md"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-3xl font-bold bg-gradient-to-r from-[#F5DEB3] to-white bg-clip-text text-transparent"
        >
          TheHangout
        </Link>

        <div className="flex gap-4 items-center">
          {[
            { href: "/shop", label: "Shop" },
            { href: "/categories", label: "Categories" },
          ].map((link) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={link.href}
            >
              <Link
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-white hover:text-[#F5DEB3] transition-colors"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}

          {user && (
            <>
              <Link
                href="/orders"
                className="px-3 py-2 text-sm font-medium text-white hover:text-[#F5DEB3] transition"
              >
                My Orders
              </Link>
              <Link
                href="/favorites"
                className="px-3 py-2 text-sm font-medium text-white hover:text-[#F5DEB3] transition"
              >
                Favorites
              </Link>

              {userRole === "admin" && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href="/dashboard/admin">
                    <Button variant="default" className="bg-[#F5DEB3] text-black hover:bg-white">
                      Admin Dashboard
                    </Button>
                  </Link>
                </motion.div>
              )}

              <UserProfile />
            </>
          )}

          {!user && (
            <>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium px-4 py-2 text-white hover:text-[#F5DEB3] transition"
                >
                  Sign In
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/sign-up"
                  className="text-sm font-medium px-4 py-2 rounded-md bg-white text-black hover:bg-[#F5DEB3] transition"
                >
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
