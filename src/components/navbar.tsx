"use client";

import Link from "next/link";
import { createClient } from "../supabase/client";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import UserProfile from "./user-profile";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const menuItems = [
    { href: "/shop", label: "Shop" },
    { href: "/categories", label: "Categories" },
    ...(user ? [
      { href: "/orders", label: "My Orders" },
      { href: "/favorites", label: "Favorites" },
    ] : []),
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full z-50 border-b border-[#BDCDCF]/30 bg-[#003332] backdrop-blur-md sticky top-0 shadow-lg"
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-3xl font-bold bg-gradient-to-r from-[#BDCDCF] to-white bg-clip-text text-transparent"
              onClick={closeMenu}
            >
              TheHangout
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 items-center">
            {menuItems.map((item) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={item.href}
              >
                <Link
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-[#BDCDCF] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {user && userRole === "admin" && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/dashboard/admin">
                  <Button variant="default" className="bg-[#034C36] hover:bg-[#003332] text-white">
                    Admin Dashboard
                  </Button>
                </Link>
              </motion.div>
            )}

            {user ? (
              <UserProfile />
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium px-4 py-2 text-[#BDCDCF] hover:text-white transition"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    href="/sign-up"
                    className="text-sm font-medium px-4 py-2 rounded-md bg-[#034C36] text-white hover:bg-[#003332] transition"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {user && (
              <div className="mr-4">
                <UserProfile />
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#BDCDCF] hover:text-white transition"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 bg-[#034C36] z-40 overflow-hidden shadow-xl"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block py-4 px-2 text-lg font-medium text-[#BDCDCF] hover:text-white transition-colors border-b border-[#003332]"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {user && userRole === "admin" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: menuItems.length * 0.1 }}
                    className="mt-4"
                  >
                    <Link 
                      href="/dashboard/admin" 
                      onClick={closeMenu}
                      className="block py-4 px-2 text-lg font-medium text-[#BDCDCF] hover:text-white transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  </motion.div>
                )}

                {!user && (
                  <div className="flex flex-col mt-4 gap-3 pb-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (menuItems.length + 1) * 0.1 }}
                    >
                      <Link
                        href="/sign-in"
                        onClick={closeMenu}
                        className="block w-full text-center py-3 px-4 rounded-md bg-[#003332] text-white hover:bg-opacity-90 transition"
                      >
                        Sign In
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (menuItems.length + 2) * 0.1 }}
                    >
                      <Link
                        href="/sign-up"
                        onClick={closeMenu}
                        className="block w-full text-center py-3 px-4 rounded-md bg-[#BDCDCF] text-[#003332] hover:bg-opacity-90 transition"
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}