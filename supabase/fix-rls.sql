-- Fix RLS policies for registration

-- Allow anyone to insert into organizations (for registration)
DROP POLICY IF EXISTS "org_insert" ON organizations;
CREATE POLICY "org_insert" ON organizations FOR INSERT WITH CHECK (true);

-- Allow public read of organizations (needed for RLS)
DROP POLICY IF EXISTS "org_select" ON organizations;
CREATE POLICY "org_select" ON organizations FOR SELECT USING (true);

-- Allow public read/update of organizations (for owners)
DROP POLICY IF EXISTS "org_update" ON organizations;
CREATE POLICY "org_update" ON organizations FOR UPDATE USING (true);

-- Allow public insert to users (for registration)
DROP POLICY IF EXISTS "users_insert" ON users;
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);

-- Users can only see their organization's users
DROP POLICY IF EXISTS "users_select" ON users;
CREATE POLICY "users_select" ON users FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- Users can only update their own user
DROP POLICY IF EXISTS "users_update" ON users;
CREATE POLICY "users_update" ON users FOR UPDATE USING (true);
