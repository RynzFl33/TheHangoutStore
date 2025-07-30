"use client";

import Link from "next/link";
import { ArrowUpRight, Check, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-pink-200 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                New Collection Drop
              </span>
            </motion.div>

            <motion.h1
              className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800">
                Hangout
              </span>{" "}
              Store
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover the latest in streetwear fashion. Express your unique
              style with our curated collection of premium clothing and
              accessories.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                href="/shop"
                className="group inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <ShoppingBag className="mr-3 w-5 h-5" />
                Shop Collection
                <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>

              <Link
                href="/categories"
                className="inline-flex items-center px-8 py-4 text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 text-lg font-medium border border-gray-200 dark:border-gray-700 hover:shadow-lg"
              >
                Browse Categories
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Free shipping over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>30-day returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Exclusive member perks</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured product preview */}
      <motion.div
        className="absolute bottom-10 right-10 hidden lg:block"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80"
            alt="Featured Product"
            className="w-24 h-24 object-cover rounded-xl mb-2"
          />
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Trending Now
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Urban Hoodie
          </p>
        </div>
      </motion.div>
    </div>
  );
}
