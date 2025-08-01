"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

interface CartItem {
  products: {
    id: string;
    name: string;
    price: number;
    sale_price?: number;
  };
  quantity: number;
  size: string;
  color: string;
}


export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const supabase = await createClient();
  const headerList = await headers();
  const origin = headerList.get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
      },
    },
  });

  console.log("After signUp", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      // The user profile will be created automatically by the database trigger
      console.log("User created successfully:", user.id);
    } catch (err) {
      console.error("Error in user profile creation:", err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const headerList = await headers();
  const origin = headerList.get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const addToCartAction = async (formData: FormData) => {
  const productId = formData.get("productId")?.toString();
  const quantity = parseInt(formData.get("quantity")?.toString() || "1");
  const size = formData.get("size")?.toString();
  const color = formData.get("color")?.toString();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Make sure to return here!
    return encodedRedirect(
      "error",
      "/sign-in",
      "Please sign in to add items to cart",
    );
  }

  if (!productId) {
    return encodedRedirect("error", "/shop", "Product not found");
  }

  const { error } = await supabase.from("cart_items").upsert(
    {
      user_id: user.id,
      product_id: productId,
      quantity,
      size,
      color,
    },
    {
      onConflict: "user_id,product_id,size,color",
    },
  );

  if (error) {
    console.error("Error adding to cart:", error);
    return encodedRedirect("error", "/shop", "Failed to add item to cart");
  }

  return encodedRedirect(
    "success",
    "/cart",
    "Item added to cart successfully!",
  );
};

export const addToFavoritesAction = async (formData: FormData) => {
  const productId = formData.get("productId")?.toString();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "Please sign in to add favorites",
    );
  }

  if (!productId) {
    return encodedRedirect("error", "/shop", "Product not found");
  }

  const { error } = await supabase.from("favorites").upsert(
    {
      user_id: user.id,
      product_id: productId,
    },
    {
      onConflict: "user_id,product_id",
    },
  );

  if (error) {
    console.error("Error adding to favorites:", error);
    return encodedRedirect("error", "/shop", "Failed to add to favorites");
  }

  return encodedRedirect("success", "/favorites", "Item added to favorites!");
};

export const removeFromCartAction = async (formData: FormData) => {
  const cartItemId = formData.get("cartItemId")?.toString();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "Please sign in");
  }

  if (!cartItemId) {
    return encodedRedirect("error", "/cart", "Item not found");
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error removing from cart:", error);
    return encodedRedirect("error", "/cart", "Failed to remove item");
  }

  return encodedRedirect("success", "/cart", "Item removed from cart");
};

export const removeFromFavoritesAction = async (formData: FormData) => {
  const favoriteId = formData.get("favoriteId")?.toString();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "Please sign in");
  }

  if (!favoriteId) {
    return encodedRedirect("error", "/favorites", "Item not found");
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", favoriteId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error removing from favorites:", error);
    return encodedRedirect("error", "/favorites", "Failed to remove item");
  }

  return encodedRedirect(
    "success",
    "/favorites",
    "Item removed from favorites",
  );
};

// Generate a random unique order code
function generateOrderCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "ORDER-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const placeOrderAction = async (formData: FormData) => {
  const cartItemsJson = formData.get("cartItems")?.toString();
  const totalAmount = parseFloat(
    formData.get("totalAmount")?.toString() || "0",
  );

  if (!cartItemsJson) {
    return { success: false, error: "No cart items provided" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartItems;
try {
  cartItems = JSON.parse(cartItemsJson);
} catch (error) {
  console.error("JSON parse error:", error);
  return { success: false, error: "Invalid cart data" };
}

  // Generate unique order code
  let orderCode = generateOrderCode();
  let isUnique = false;
  let attempts = 0;

  // Ensure order code is unique
  while (!isUnique && attempts < 10) {
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("order_code", orderCode)
      .single();

    if (!existingOrder) {
      isUnique = true;
    } else {
      orderCode = generateOrderCode();
      attempts++;
    }
  }

  if (!isUnique) {
    return { success: false, error: "Failed to generate unique order code" };
  }

  // Prepare product data for the order
const productIds = (cartItems as CartItem[]).map((item) => ({
  product_id: item.products.id,
  name: item.products.name,
  price: item.products.sale_price ?? item.products.price,
  quantity: item.quantity,
  size: item.size,
  color: item.color,
}));


  // Create the order
const { error } = await supabase
  .from("orders")
  .insert({
    user_id: user?.id || null,
    user_email: user?.email || null,
    product_ids: productIds,
    order_code: orderCode,
    total_amount: totalAmount,
    status: "pending",
  })
  .select()
  .single();


  if (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }

  // Clear the user's cart after successful order
  if (user) {
    await supabase.from("cart_items").delete().eq("user_id", user.id);
  }

  return {
    success: true,
    orderCode: orderCode,
    totalAmount: totalAmount,
  };
};
