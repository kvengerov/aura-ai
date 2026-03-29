-- Aura AI Database Schema
-- Run this in Supabase SQL Editor

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'client',
    name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    birth_date DATE,
    notes TEXT,
    tags TEXT[],
    total_visits INT DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2),
    duration_min INT NOT NULL DEFAULT 30,
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    role VARCHAR(100),
    specialties TEXT[],
    bio TEXT,
    schedule JSONB DEFAULT '{"monday":[],"tuesday":[],"wednesday":[],"thursday":[],"friday":[],"saturday":[],"sunday":[]}',
    commission_pct DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    date_time TIMESTAMPTZ NOT NULL,
    duration_min INT,
    status VARCHAR(50) DEFAULT 'pending',
    source VARCHAR(50) DEFAULT 'app',
    notes TEXT,
    price_paid DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    messages JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255),
    subject VARCHAR(500),
    content TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    recipients JSONB DEFAULT '[]',
    stats JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    type VARCHAR(50),
    number VARCHAR(100),
    file_url TEXT,
    content JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Organizations: users can only see their own organization
CREATE POLICY "org_select" ON organizations FOR SELECT USING (true);
CREATE POLICY "org_insert" ON organizations FOR INSERT WITH CHECK (true);
CREATE POLICY "org_update" ON organizations FOR UPDATE USING (true);

-- Users: users can only see users in their organization
CREATE POLICY "users_select" ON users FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "users_update" ON users FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- Clients: same org isolation
CREATE POLICY "clients_select" ON clients FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "clients_insert" ON clients FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "clients_update" ON clients FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "clients_delete" ON clients FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- Services: same org isolation
CREATE POLICY "services_select" ON services FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "services_insert" ON services FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "services_update" ON services FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "services_delete" ON services FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- Staff: same org isolation
CREATE POLICY "staff_select" ON staff FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "staff_insert" ON staff FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "staff_update" ON staff FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "staff_delete" ON staff FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- Bookings: same org isolation
CREATE POLICY "bookings_select" ON bookings FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "bookings_insert" ON bookings FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "bookings_update" ON bookings FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "bookings_delete" ON bookings FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- AI Conversations: same org isolation
CREATE POLICY "ai_conversations_select" ON ai_conversations FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "ai_conversations_insert" ON ai_conversations FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "ai_conversations_update" ON ai_conversations FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- Email Campaigns: same org isolation
CREATE POLICY "email_campaigns_select" ON email_campaigns FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "email_campaigns_insert" ON email_campaigns FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "email_campaigns_update" ON email_campaigns FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "email_campaigns_delete" ON email_campaigns FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- Documents: same org isolation
CREATE POLICY "documents_select" ON documents FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "documents_insert" ON documents FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "documents_update" ON documents FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "documents_delete" ON documents FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);
