"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../supabase/client";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { removeFromCartAction } from "@/app/actions";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, CreditCard } from "lucide-react";
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
    <Card className="mb-4 bg-[#F8FAFC] dark:bg-[#002626] border-[#BDCDCF]">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-32 h-32 flex-shrink-0">
            <Image
              src={product.image_url}
              alt={product.name}
              width={128}
              height={128}
              className="w-full h-full object-cover rounded-lg border border-[#BDCDCF]"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-[#003332] dark:text-[#BDCDCF] mb-2">
                  {product.name}
                </h3>

                <div className="flex gap-2 mb-2">
                  {item.size && (
                    <Badge 
                      variant="outline" 
                      className="bg-[#E8F0F2] dark:bg-[#003332] border-[#BDCDCF] text-[#003332] dark:text-[#BDCDCF]"
                    >
                      Size: {item.size}
                    </Badge>
                  )}
                  {item.color && (
                    <Badge 
                      variant="outline" 
                      className="bg-[#E8F0F2] dark:bg-[#003332] border-[#BDCDCF] text-[#003332] dark:text-[#BDCDCF]"
                    >
                      Color: {item.color}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#034C36]">
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-8 h-8 p-0 border-[#BDCDCF] text-[#003332] hover:bg-[#E8F0F2]"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-[#003332]">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-8 h-8 p-0 border-[#BDCDCF] text-[#003332] hover:bg-[#E8F0F2]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-[#034C36]">
                    ${itemTotal.toFixed(2)}
                  </div>
                  <form action={removeFromCartAction} className="mt-2">
                    <input type="hidden" name="cartItemId" value={item.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-[#D94F4F] hover:text-[#C23535] hover:bg-[#FBECEC]"
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

function ShippingPromo() {
  return (
    <div className="bg-gradient-to-r from-[#034C36] to-[#026548] rounded-lg p-4 mb-6 text-white">
      <div className="flex items-center">
        <Truck className="w-6 h-6 mr-3" />
        <div>
          <h3 className="font-semibold">Free Shipping on Orders Over $50</h3>
          <p className="text-sm opacity-90">Add ${(50 - 35).toFixed(2)} more to qualify</p>
        </div>
      </div>
    </div>
  );
}

function PaymentOptions() {
  return (
    <div className="mt-6">
      <h4 className="font-medium text-[#003332] mb-3">Payment Methods</h4>
      <div className="flex gap-2">
        <div className="bg-white p-2 rounded-md border border-[#BDCDCF]">
          <CreditCard className="w-6 h-6 text-[#034C36]" />
        </div>
        <div className="bg-white p-2 rounded-md border border-[#BDCDCF]">
          <div className="w-6 h-6 bg-[#F6C84F] rounded-sm"></div>
        </div>
        <div className="bg-white p-2 rounded-md border border-[#BDCDCF]">
          <div className="w-6 h-6 bg-[#5A31F4] rounded-sm"></div>
        </div>
      </div>
    </div>
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
    <Card className="bg-[#F8FAFC] dark:bg-[#002626] border-[#BDCDCF]">
      <CardHeader>
        <CardTitle className="text-[#003332]">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-[#5A6C72]">Subtotal</span>
          <span className="font-medium text-[#003332]">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#5A6C72]">Shipping</span>
          <span className="font-medium text-[#003332]">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#5A6C72]">Tax</span>
          <span className="font-medium text-[#003332]">${tax.toFixed(2)}</span>
        </div>
        <hr className="border-[#BDCDCF]" />
        <div className="flex justify-between text-lg font-bold">
          <span className="text-[#003332]">Total</span>
          <span className="text-[#034C36]">${total.toFixed(2)}</span>
        </div>
        {shipping > 0 && (
          <p className="text-sm text-[#5A6C72]">
            Add ${(50 - subtotal).toFixed(2)} more for free shipping!
          </p>
        )}
        
        <ShippingPromo />
        
        <Button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full bg-gradient-to-r from-[#034C36] to-[#026548] hover:from-[#013829] hover:to-[#013829] text-white font-medium py-3 mt-2"
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </Button>
        
        <PaymentOptions />
        
        <Link href="/shop">
          <Button 
            variant="outline" 
            className="w-full border-[#BDCDCF] text-[#003332] hover:bg-[#E8F0F2] mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
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
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8F0F2] dark:from-[#001A1A] dark:to-[#002626]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-[#034C36] hover:text-[#013829] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
          <h1 className="text-3xl font-bold text-[#003332] mb-2">
            Shopping Cart
          </h1>
          <p className="text-[#5A6C72]">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#E8F0F2] dark:bg-[#003332] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-[#034C36]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#003332] mb-2">
              Your cart is empty
            </h2>
            <p className="text-[#5A6C72] mb-6">
              Looks like you haven&rsquo;t added any items to your cart yet.
            </p>
            <Link href="/shop">
              <Button className="bg-gradient-to-r from-[#034C36] to-[#026548] hover:from-[#013829] hover:to-[#013829] text-white">
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