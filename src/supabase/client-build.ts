import { createClient } from "@supabase/supabase-js";

// Client for build-time operations (like generateStaticParams)
export const createBuildClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
