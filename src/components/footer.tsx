import Link from "next/link";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#003332] text-[#BDCDCF]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#BDCDCF] to-[#9ab3b5] bg-clip-text text-transparent mb-4">
              TheHangout
            </h3>
            <p className="mb-6 leading-relaxed">
              Your destination for the latest streetwear and fashion trends.
              Express yourself with our curated collection.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-white transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
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
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/hoodies"
                  className="hover:text-white transition-colors"
                >
                  Hoodies & Sweatshirts
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/tees"
                  className="hover:text-white transition-colors"
                >
                  Graphic Tees
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/streetwear"
                  className="hover:text-white transition-colors"
                >
                  Streetwear
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/accessories"
                  className="hover:text-white transition-colors"
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
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="hover:text-white transition-colors"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-white transition-colors"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
            <p className="mb-4 text-sm">
              Subscribe to get special offers, free giveaways, and exclusive
              deals.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-[#002b29] border border-[#034C36] rounded-lg text-white placeholder-[#9ab3b5] focus:outline-none focus:ring-2 focus:ring-[#BDCDCF] focus:border-transparent"
              />
              <button className="px-4 py-2 bg-[#034C36] text-[#BDCDCF] rounded-lg hover:bg-[#013429] hover:text-white transition-colors text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#034C36]">
          <div className="mb-4 md:mb-0 text-sm">
            © {currentYear} TheHangout Store. All rights reserved.
          </div>

          <div className="flex space-x-6 text-sm">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}