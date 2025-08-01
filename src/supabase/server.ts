import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side client for use in Server Components ONLY
// DO NOT import this in client components - use supabase/client.ts instead
export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The error occurs when cookies() is called outside a request context
            // This is expected in some cases, so we handle it gracefully
            console.warn("Cookie setting failed:", error);
          }
        },
      },
    },
  );
};
