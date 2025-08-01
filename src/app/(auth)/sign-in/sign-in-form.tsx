"use client";

import Link from "next/link";
import { createClient } from "@/supabase/client";
import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { signInAction } from "@/app/actions";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SignInForm({ message }: { message?: Message }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Google sign-in error:", error.message);
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="w-16 h-16 border-4 border-[#034C36] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E8F0F2] dark:from-[#001A1A] dark:to-[#002626] px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white dark:bg-[#002626] rounded-xl shadow-lg border border-[#BDCDCF] overflow-hidden"
        >
          {/* Decorative header */}
          <div className="bg-gradient-to-r from-[#034C36] to-[#026548] p-5 text-white text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight">Welcome Back</h1>
            </div>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#003332] dark:text-[#BDCDCF]">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-[#5A6C72] dark:text-[#9CB0B3]">
                Or{" "}
                <Link
                  href="/sign-up"
                  className="font-medium text-[#034C36] hover:text-[#013829] dark:text-[#4AE0B8] dark:hover:text-[#3BC9A5] transition-colors"
                >
                  create a new account
                </Link>
              </p>
            </div>

            {/* Fixed: Wrap FormMessage to add margin */}
            {message && <div className="mb-6"><FormMessage message={message} /></div>}

            <form action={signInAction} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-[#003332] dark:text-[#BDCDCF]">Email</Label>
                <div className="relative mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-[#5A6C72]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required 
                    className="pl-10 border-[#BDCDCF] focus:ring-2 focus:ring-[#034C36] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="password" className="text-[#003332] dark:text-[#BDCDCF]">Password</Label>
                <div className="relative mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-[#5A6C72]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10 border-[#BDCDCF] focus:ring-2 focus:ring-[#034C36] focus:border-transparent"
                  />
                </div>
                <div className="text-right mt-1">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#5A6C72] hover:text-[#034C36] dark:text-[#9CB0B3] dark:hover:text-[#4AE0B8] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <SubmitButton className="w-full bg-gradient-to-r from-[#034C36] to-[#026548] hover:from-[#013829] hover:to-[#013829] text-white font-medium py-3 rounded-lg transition-all shadow-md hover:shadow-lg">
                Sign in
              </SubmitButton>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#BDCDCF]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#002626] px-3 text-[#5A6C72] dark:text-[#9CB0B3]">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center bg-white border border-[#BDCDCF] text-[#003332] font-medium py-2.5 rounded-lg hover:bg-[#F0F5F7] transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Sign in with Google
            </motion.button>
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="mt-8 flex justify-center space-x-6 opacity-80">
          <div className="bg-[#BDCDCF] w-10 h-10 rounded-full"></div>
          <div className="bg-[#034C36] w-8 h-8 rounded-full"></div>
          <div className="bg-[#003332] w-6 h-6 rounded-full"></div>
        </div>
      </main>
    </>
  );
}