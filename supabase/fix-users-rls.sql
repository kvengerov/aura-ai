-- Fix RLS policies - remove infinite recursion

-- Drop all existing policies
DROP POLICY IF EXISTS "allow_all_users" ON users;
DROP POLICY IF EXISTS "users_select" ON users;
DROP POLICY IF EXISTS "users_insert" ON users;
DROP POLICY IF EXISTS "users_update" ON users;

-- Simpler policy - allow all for now (will fix later for production)
CREATE POLICY "users_all" ON users FOR ALL USING (true) WITH CHECK (true);
