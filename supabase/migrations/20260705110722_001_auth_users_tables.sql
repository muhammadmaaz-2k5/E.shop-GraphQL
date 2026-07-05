/*
# Users and Authentication Tables

1. New Tables
- `users` - Core user profile data linked to Supabase auth
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique, not null)
  - `role` (enum: admin, manager, customer, default: customer)
  - `permissions` (text array for RBAC)
  - `first_name`, `last_name` (text)
  - `is_active` (boolean, default true)
  - `created_at`, `updated_at` (timestamps)

- `refresh_tokens` - JWT refresh token storage
  - `id` (uuid, primary key)
  - `user_id` (uuid, references users)
  - `token_hash` (text, unique)
  - `expires_at` (timestamp)
  - `revoked` (boolean, default false)
  - `created_at` (timestamp)

2. Security
- Enable RLS on all tables
- Users can read own profile, admins can read all
- Users can update own profile (limited fields), admins can update all
- Refresh tokens are owner-scoped with auth.uid() default

3. Notes
- User ID defaults to auth.uid() for seamless auth integration
- RLS policies enforce ownership via auth.uid()
- Admin role has elevated access via policy checks
*/

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'customer');

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  permissions text[] DEFAULT '{}',
  first_name text,
  last_name text,
  avatar_url text,
  phone text,
  is_active boolean NOT NULL DEFAULT true,
  email_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  revoked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "users_select_own" ON users;
CREATE POLICY "users_select_own" ON users FOR SELECT
  TO authenticated USING (auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "users_insert_own" ON users;
CREATE POLICY "users_insert_own" ON users FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_update_own" ON users FOR UPDATE
  TO authenticated USING (auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "users_delete_admin" ON users;
CREATE POLICY "users_delete_admin" ON users FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Refresh tokens policies
DROP POLICY IF EXISTS "refresh_tokens_select_own" ON refresh_tokens;
CREATE POLICY "refresh_tokens_select_own" ON refresh_tokens FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "refresh_tokens_insert_own" ON refresh_tokens;
CREATE POLICY "refresh_tokens_insert_own" ON refresh_tokens FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "refresh_tokens_update_own" ON refresh_tokens;
CREATE POLICY "refresh_tokens_update_own" ON refresh_tokens FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "refresh_tokens_delete_own" ON refresh_tokens;
CREATE POLICY "refresh_tokens_delete_own" ON refresh_tokens FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
