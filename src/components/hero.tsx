"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-[#F5DEB3] min-h-screen flex items-center justify-center overflow-hidden py-20">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* TEXT BLOCK */}
        <motion.div
          className="max-w-xl space-y-6 text-[#36454F]"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Timeless Clothing & Accessories
          </h1>
          <p className="text-lg md:text-xl text-[#3c3c3c]">
            Welcome to The Hangout Store — where quality meets simplicity.
            Explore our curated collection built for everyday elegance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#36454F] text-white rounded-lg shadow hover:bg-[#2c3740] transition text-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Now
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-[#36454F] text-[#36454F] rounded-lg hover:bg-[#36454F] hover:text-white transition text-lg"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* 3D PRODUCT CARD */}
        <motion.div
          className="flex justify-center items-center w-full"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="relative group perspective w-[320px] h-[440px]">
            <motion.div
              className="relative w-full h-full rounded-3xl bg-white shadow-2xl border border-[#e4d8b4] transform-style-preserve-3d"
              whileHover={{ rotateY: 15, rotateX: -5 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            >
              {/* Card Overlay Content */}
              <div className="absolute inset-0 p-6 z-10 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <h2 className="text-[#36454F] font-semibold text-xl">
                    Linen Shirt
                  </h2>
                  <span className="text-sm text-[#555]">$49.99</span>
                </div>
                <Link
                  href="/product/linen-shirt"
                  className="mt-auto bg-[#36454F] text-white text-sm px-4 py-2 rounded-md hover:bg-[#2c3740] transition"
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
                className="rounded-3xl opacity-90 group-hover:opacity-100 transition duration-300"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent via-[#F5DEB3]/20 to-[#F5DEB3]/60" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* FLOATING DECORATIVE ELEMENTS */}
      <motion.div
        className="absolute top-10 left-10 w-48 h-48 bg-[#36454F]/10 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-60px] right-[-40px] w-72 h-72 bg-[#36454F]/10 rounded-full blur-3xl"
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
    </section>
  );
}
