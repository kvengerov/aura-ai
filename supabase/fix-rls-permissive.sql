-- Completely reset RLS for testing
-- Disable RLS temporarily
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- Re-enable with permissive policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Permissive policies for all tables
CREATE POLICY "allow_all_orgs" ON organizations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_staff" ON staff FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_conversations" ON ai_conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_campaigns" ON email_campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_documents" ON documents FOR ALL USING (true) WITH CHECK (true);
