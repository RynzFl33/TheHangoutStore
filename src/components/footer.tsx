import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              TheHangout
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your destination for the latest streetwear and fashion trends.
              Express yourself with our curated collection.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/hoodies"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Hoodies & Sweatshirts
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/tees"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Graphic Tees
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/streetwear"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Streetwear
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/accessories"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Subscribe to get special offers, free giveaways, and exclusive
              deals.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800">
          <div className="text-gray-400 mb-4 md:mb-0 text-sm">
            © {currentYear} TheHangout Store. All rights reserved.
          </div>

          <div className="flex space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
