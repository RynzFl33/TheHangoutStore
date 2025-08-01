"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, ChevronDown, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4 bg-gradient-to-b from-[#003332] to-[#034C36]">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#034C36]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-60px] right-[-40px] w-72 h-72 bg-[#003332]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-[#BDCDCF]/20 rounded-full blur-2xl animate-pulse" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CiAgPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDAzMzMyIi8+CiAgPHBhdGggZD0iTTAgMEw0MCA0ME00MCAwTDAgNDAiIHN0cm9rZT0iIzAzNEMzNiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPC9zdmc+')] opacity-10" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* TEXT BLOCK */}
        <motion.div
          className="max-w-xl space-y-6 text-[#BDCDCF]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 bg-[#034C36]/30 px-4 py-2 rounded-full mb-4 border border-[#BDCDCF]/20"
          >
            <Sparkles size={16} className="text-[#BDCDCF]" />
            <span className="text-sm font-medium">New Collection</span>
          </motion.div>
          
          <motion.h1
            className="text-5xl md:text-6xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-[#BDCDCF] via-white to-[#BDCDCF] bg-clip-text text-transparent">
              Timeless Clothing
            </span>
            <br />
            <span className="font-light text-[#BDCDCF]">& Accessories</span>
          </motion.h1>
          
          <motion.p
            className="text-lg md:text-xl text-[#BDCDCF]/90 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Welcome to The Hangout Store — where quality meets simplicity. 
            Explore our curated collection built for everyday elegance.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#034C36] text-white rounded-lg hover:bg-[#003332] transition-all duration-300 text-lg font-medium group shadow-lg shadow-[#034C36]/20 hover:shadow-xl"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              Shop Now
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-center gap-2 px-8 py-4 border border-[#BDCDCF] text-[#BDCDCF] rounded-lg hover:bg-[#BDCDCF]/10 transition-all duration-300 text-lg font-medium group"
            >
              Learn More
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-6 pt-8 border-t border-[#034C36]/30 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { value: "10K+", label: "Products" },
              { value: "98%", label: "Happy Customers" },
              { value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-[#BDCDCF]/80 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* PRODUCT DISPLAY */}
        <motion.div
          className="flex justify-center items-center w-full relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative group perspective w-[320px] h-[440px]">
            {/* Main card */}
            <motion.div
              className="relative w-full h-full rounded-3xl bg-gradient-to-br from-[#003332] to-[#034C36] shadow-2xl border border-[#BDCDCF]/20 transform-style-preserve-3d overflow-hidden"
              whileHover={{ rotateY: 10, rotateX: -5 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            >
              {/* Card content */}
              <div className="absolute inset-0 p-6 z-10 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <h2 className="text-white font-bold text-xl">
                    Linen Shirt
                  </h2>
                  <span className="text-[#BDCDCF] text-sm">$49.99</span>
                </div>
                <Link
                  href="/product/linen-shirt"
                  className="mt-auto bg-[#BDCDCF] text-[#003332] text-sm px-4 py-2 rounded-md hover:bg-white transition font-medium w-fit"
                >
                  View Product
                </Link>
              </div>

              {/* Image */}
              <Image
                src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80"
                alt="Linen Shirt"
                layout="fill"
                objectFit="cover"
                className="rounded-3xl opacity-70 group-hover:opacity-80 transition duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent via-[#003332]/70 to-[#034C36]" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[#BDCDCF] text-sm mb-2">Explore more</span>
        <ChevronDown className="text-[#BDCDCF] animate-bounce" />
      </motion.div>
    </section>
  );
}