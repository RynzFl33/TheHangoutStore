CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text,
    full_name text,
    role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        'user'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

INSERT INTO public.users (id, email, full_name, role)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', ''),
    'user'
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

UPDATE public.users 
SET role = 'admin' 
WHERE email IN ('admin@thehangout.com', 'admin@example.com');

-- Enable realtime for users table (only if not already added)
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'users'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE users;
    END IF;
END $;