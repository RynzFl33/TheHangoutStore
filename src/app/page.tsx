import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { ArrowUpRight, Shield, Truck, Star, Heart } from "lucide-react";
import { createClient } from "../supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f5] to-[#e1ece9] dark:from-[#001a19] dark:to-[#002b29]">
      <Navbar />
      <Hero />

      {/* Featured Categories */}
      <section className="py-20 bg-[#f9fbfb] dark:bg-[#001a19]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#003332] dark:text-[#BDCDCF]">
              Shop by Category
            </h2>
            <p className="text-[#034C36] dark:text-[#9ab3b5] max-w-2xl mx-auto">
              Discover the latest trends in streetwear, designed for the next
              generation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
                title: "Hoodies & Sweatshirts",
                description: "Cozy vibes for every season",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&q=80",
                title: "Graphic Tees",
                description: "Express your unique style",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
                title: "Streetwear",
                description: "Urban fashion essentials",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
                title: "Accessories",
                description: "Complete your look",
              },
            ].map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-[#034C36]/20 group-hover:bg-[#034C36]/30 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#003332] dark:text-[#BDCDCF]">
                  {category.title}
                </h3>
                <p className="text-[#034C36] dark:text-[#9ab3b5]">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#e5edeb] dark:bg-[#001a19]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#003332] dark:text-[#BDCDCF]">
              Why Shop with Us
            </h2>
            <p className="text-[#034C36] dark:text-[#9ab3b5] max-w-2xl mx-auto">
              Experience the future of fashion with our premium service and
              quality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Truck className="w-8 h-8" />,
                title: "Free Shipping",
                description: "Free delivery on orders over $50",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure Payment",
                description: "Your data is safe with us",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Premium Quality",
                description: "Only the finest materials",
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Customer Love",
                description: "Rated 4.9/5 by our community",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white dark:bg-[#002b29] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-[#BDCDCF]/30"
              >
                <div className="text-[#034C36] dark:text-[#BDCDCF] mb-6 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#003332] dark:text-[#BDCDCF]">
                  {feature.title}
                </h3>
                <p className="text-[#034C36] dark:text-[#9ab3b5]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#003332] to-[#034C36] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Upgrade Your Style?
          </h2>
          <p className="text-[#BDCDCF] mb-8 max-w-2xl mx-auto">
            Join the fashion revolution and discover your perfect look today.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 text-[#003332] bg-[#BDCDCF] rounded-lg hover:bg-[#e6f0ee] transition-colors text-lg font-medium"
          >
            Shop Now
            <ArrowUpRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}