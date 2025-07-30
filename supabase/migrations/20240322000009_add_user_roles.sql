ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

alter publication supabase_realtime add table users;
