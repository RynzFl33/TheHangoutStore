import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  CheckCircle2,
  Shield,
  Truck,
  Star,
  Heart,
  Zap,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <Hero />

      {/* Featured Categories */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Why Shop with Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-purple-600 dark:text-purple-400 mb-6 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Upgrade Your Style?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the fashion revolution and discover your perfect look today.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
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
