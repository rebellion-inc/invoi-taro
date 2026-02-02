-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table (multi-tenant support)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors table (clients who upload invoices)
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations ON DELETE CASCADE,
  name TEXT NOT NULL,
  upload_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  amount INTEGER,
  invoice_date DATE,
  status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid')),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- Create indexes for common queries
CREATE INDEX idx_invoices_organization_id ON invoices(organization_id);
CREATE INDEX idx_invoices_vendor_id ON invoices(vendor_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_uploaded_at ON invoices(uploaded_at);
CREATE INDEX idx_vendors_organization_id ON vendors(organization_id);
CREATE INDEX idx_vendors_upload_token ON vendors(upload_token);

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- RLS Policies for vendors
CREATE POLICY "Users can view vendors in their organization"
  ON vendors FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert vendors in their organization"
  ON vendors FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update vendors in their organization"
  ON vendors FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete vendors in their organization"
  ON vendors FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for invoices
CREATE POLICY "Users can view invoices in their organization"
  ON invoices FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update invoices in their organization"
  ON invoices FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Anyone with valid vendor token can insert invoices"
  ON invoices FOR INSERT
  WITH CHECK (
    vendor_id IN (SELECT id FROM vendors WHERE upload_token IS NOT NULL)
  );

-- Storage bucket for invoices (created via SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can view files in their org"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'invoices' AND
    (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Anyone can upload files to invoices bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Authenticated users can delete files in their org"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'invoices' AND
    (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM profiles WHERE id = auth.uid()
    )
  );
