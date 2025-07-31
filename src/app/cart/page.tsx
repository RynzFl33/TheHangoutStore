"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../supabase/client";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { removeFromCartAction } from "@/app/actions";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import OrderConfirmationModal from "@/components/order-confirmation-modal";
import type { User } from "@supabase/supabase-js";

interface CartItem {
  id: string;
  quantity: number;
  size: string;
  color: string;
  products: {
    id: string;
    name: string;
    price: number;
    sale_price: number;
    image_url: string;
    stock_quantity: number;
  };
}

function CartItemCard({ item }: { item: CartItem }) {
  const product = item.products;
  const displayPrice = product.sale_price || product.price;
  const itemTotal = displayPrice * item.quantity;

  return (
    <Card className="mb-4 bg-white dark:bg-slate-900">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-32 h-32 flex-shrink-0">
            <Image
              src={product.image_url}
              alt={product.name}
              width={128}
              height={128}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h3>

                <div className="flex gap-2 mb-2">
                  {item.size && <Badge variant="outline">Size: {item.size}</Badge>}
                  {item.color && <Badge variant="outline">Color: {item.color}</Badge>}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${displayPrice}
                  </span>
                  {product.sale_price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    ${itemTotal.toFixed(2)}
                  </div>
                  <form action={removeFromCartAction} className="mt-2">
                    <input type="hidden" name="cartItemId" value={item.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CartSummary({
  items,
  onOrderPlaced,
}: {
  items: CartItem[];
  onOrderPlaced: (orderCode: string, total: number) => void;
}) {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = items.reduce((sum, item) => {
    const price = item.products.sale_price || item.products.price;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // ✅ Generate order code like "ORDER-XLCEWE"
      const generateOrderCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "ORDER-";
        for (let i = 0; i < 6; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const orderCode = generateOrderCode();

      const productIds = items.map((item) => ({
        product_id: item.products.id,
        name: item.products.name,
        price: item.products.sale_price || item.products.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const { error } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          user_email: user?.email || null,
          product_ids: productIds,
          order_code: orderCode,
          total_amount: total,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating order:", error);
        return;
      }

      if (user) {
        await supabase.from("cart_items").delete().eq("user_id", user.id);
      }

      onOrderPlaced(orderCode, total);
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
          <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Shipping</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Tax</span>
          <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
        </div>
        <hr className="border-gray-200 dark:border-gray-700" />
        <div className="flex justify-between text-lg font-bold">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
        </div>
        {shipping > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Add ${(50 - subtotal).toFixed(2)} more for free shipping!
          </p>
        )}
        <Button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 mt-2"
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </Button>
        <Link href="/shop">
          <Button variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [, setLoading] = useState(false);
  const [, setUser] = useState<User | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  const handleOrderPlaced = (code: string, total: number) => {
    setOrderCode(code);
    setOrderTotal(total);
    setShowOrderModal(true);
    setCartItems([]);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setOrderCode("");
    setOrderTotal(0);
  };

  useEffect(() => {
    let isMounted = true;
    const getCartItems = async () => {
      setLoading(true);
      try {
        const { data: { user: supaUser } } = await supabase.auth.getUser();
        if (!supaUser) {
          router.push("/sign-in");
          return;
        }

        if (isMounted) setUser(supaUser);

        const { data: cartItems, error } = await supabase
          .from("cart_items")
          .select(`
            *,
            products (
              id,
              name,
              price,
              sale_price,
              image_url,
              stock_quantity
            )
          `)
          .eq("user_id", supaUser.id)
          .order("created_at", { ascending: false });

        if (isMounted) {
          if (error) {
            console.error("Error fetching cart items:", error);
            setCartItems([]);
          } else {
            setCartItems(cartItems as CartItem[]);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error:", error);
          setCartItems([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getCartItems();
    return () => {
      isMounted = false;
    };
  }, [supabase, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Looks like you haven&rsquo;t added any items to your cart yet.
            </p>
            <Link href="/shop">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>
            <div className="lg:col-span-1 sticky top-4">
              <CartSummary items={cartItems} onOrderPlaced={handleOrderPlaced} />
            </div>
          </div>
        )}
      </div>

      <OrderConfirmationModal
        isOpen={showOrderModal}
        onClose={handleCloseOrderModal}
        orderCode={orderCode}
        totalAmount={orderTotal}
      />

      <Footer />
    </div>
  );
}
