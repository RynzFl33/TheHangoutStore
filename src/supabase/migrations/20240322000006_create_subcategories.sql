CREATE TABLE IF NOT EXISTS public.subcategories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    image_url text,
    category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory_id uuid REFERENCES public.subcategories(id);

INSERT INTO public.subcategories (name, slug, description, image_url, category_id) VALUES
('Baseball Caps', 'baseball-caps', 'Classic and modern baseball caps', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80', (SELECT id FROM categories WHERE slug = 'accessories')),
('Beanies', 'beanies', 'Warm and stylish beanies for all seasons', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', (SELECT id FROM categories WHERE slug = 'accessories')),
('Jewelry', 'jewelry', 'Chains, rings, and statement pieces', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', (SELECT id FROM categories WHERE slug = 'accessories')),
('Bags & Backpacks', 'bags-backpacks', 'Functional and stylish bags', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', (SELECT id FROM categories WHERE slug = 'accessories')),

('Urban Streetwear', 'urban-streetwear', 'City-inspired street fashion', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', (SELECT id FROM categories WHERE slug = 'streetwear')),
('Skate Style', 'skate-style', 'Skateboard culture inspired clothing', 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400&q=80', (SELECT id FROM categories WHERE slug = 'streetwear')),
('Hip-Hop Fashion', 'hip-hop-fashion', 'Bold and expressive hip-hop style', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', (SELECT id FROM categories WHERE slug = 'streetwear')),
('Vintage Streetwear', 'vintage-streetwear', 'Retro and throwback street styles', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80', (SELECT id FROM categories WHERE slug = 'streetwear')),

('Band Tees', 'band-tees', 'Music and band inspired graphic tees', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&q=80', (SELECT id FROM categories WHERE slug = 'tees')),
('Vintage Graphics', 'vintage-graphics', 'Retro and nostalgic graphic designs', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80', (SELECT id FROM categories WHERE slug = 'tees')),
('Minimalist Tees', 'minimalist-tees', 'Clean and simple graphic designs', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', (SELECT id FROM categories WHERE slug = 'tees')),
('Statement Tees', 'statement-tees', 'Bold messages and eye-catching designs', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', (SELECT id FROM categories WHERE slug = 'tees')),

('Pullover Hoodies', 'pullover-hoodies', 'Classic pullover style hoodies', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80', (SELECT id FROM categories WHERE slug = 'hoodies')),
('Zip-Up Hoodies', 'zip-up-hoodies', 'Convenient zip-up hoodies', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', (SELECT id FROM categories WHERE slug = 'hoodies')),
('Oversized Hoodies', 'oversized-hoodies', 'Relaxed fit oversized hoodies', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80', (SELECT id FROM categories WHERE slug = 'hoodies')),
('Cropped Hoodies', 'cropped-hoodies', 'Trendy cropped style hoodies', 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400&q=80', (SELECT id FROM categories WHERE slug = 'hoodies'))
ON CONFLICT (slug) DO NOTHING;

UPDATE public.products SET subcategory_id = (SELECT id FROM subcategories WHERE slug = 'baseball-caps') WHERE name = 'Street Cap';
UPDATE public.products SET subcategory_id = (SELECT id FROM subcategories WHERE slug = 'jewelry') WHERE name = 'Chain Necklace';
UPDATE public.products SET subcategory_id = (SELECT id FROM subcategories WHERE slug = 'pullover-hoodies') WHERE name = 'Urban Hoodie';
UPDATE public.products SET subcategory_id = (SELECT id FROM subcategories WHERE slug = 'oversized-hoodies') WHERE name = 'Oversized Hoodie';
UPDATE public.products SET subcategory_id = (SELECT id FROM subcategories WHERE slug = 'band-tees') WHERE name = 'Graphic Tee Supreme';
UPDATE public.products SET subcategory_id = (SELECT id FROM subcategories WHERE slug = 'vintage-graphics') WHERE name = 'Vintage Tee';

alter publication supabase_realtime add table subcategories;