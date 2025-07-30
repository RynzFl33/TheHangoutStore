CREATE TABLE IF NOT EXISTS public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    image_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price decimal(10,2) NOT NULL,
    sale_price decimal(10,2),
    category_id uuid REFERENCES public.categories(id),
    image_url text,
    images text[],
    sizes text[],
    colors text[],
    stock_quantity integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    is_on_sale boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    quantity integer NOT NULL DEFAULT 1,
    size text,
    color text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, product_id, size, color)
);

CREATE TABLE IF NOT EXISTS public.favorites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, product_id)
);

INSERT INTO public.categories (name, slug, description, image_url) VALUES
('Hoodies & Sweatshirts', 'hoodies', 'Cozy vibes for every season', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80'),
('Graphic Tees', 'tees', 'Express your unique style', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&q=80'),
('Streetwear', 'streetwear', 'Urban fashion essentials', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80'),
('Accessories', 'accessories', 'Complete your look', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, description, price, sale_price, category_id, image_url, images, sizes, colors, stock_quantity, is_featured, is_on_sale) VALUES
('Urban Hoodie', 'Premium cotton blend hoodie with modern fit', 89.99, 69.99, (SELECT id FROM categories WHERE slug = 'hoodies'), 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'White', 'Gray'], 50, true, true),
('Graphic Tee Supreme', 'Bold graphic design on premium cotton', 34.99, null, (SELECT id FROM categories WHERE slug = 'tees'), 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'White'], 75, true, false),
('Street Cap', 'Adjustable streetwear cap with embroidered logo', 24.99, 19.99, (SELECT id FROM categories WHERE slug = 'accessories'), 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80'], ARRAY['One Size'], ARRAY['Black', 'Navy', 'White'], 100, false, true),
('Oversized Hoodie', 'Relaxed fit hoodie perfect for layering', 79.99, null, (SELECT id FROM categories WHERE slug = 'hoodies'), 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Beige', 'Black', 'Brown'], 30, false, false),
('Vintage Tee', 'Retro-inspired graphic tee with distressed finish', 29.99, 24.99, (SELECT id FROM categories WHERE slug = 'tees'), 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Vintage Black', 'Faded Blue'], 60, true, true),
('Chain Necklace', 'Stainless steel chain with pendant', 49.99, null, (SELECT id FROM categories WHERE slug = 'accessories'), 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80', ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80'], ARRAY['One Size'], ARRAY['Silver', 'Gold'], 25, false, false);

alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table cart_items;
alter publication supabase_realtime add table favorites;