-- Organization invitations table
CREATE TABLE organization_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT encode(extensions.gen_random_bytes(16), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

CREATE INDEX idx_organization_invitations_email ON organization_invitations(email);
CREATE INDEX idx_organization_invitations_token ON organization_invitations(token);
CREATE INDEX idx_organization_invitations_organization_id ON organization_invitations(organization_id);
CREATE INDEX idx_organization_invitations_status ON organization_invitations(status);

-- Unique constraint: one pending invitation per email per organization
CREATE UNIQUE INDEX idx_organization_invitations_unique_pending
  ON organization_invitations(organization_id, email)
  WHERE status = 'pending';

ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;

-- Members of the organization can view invitations they sent
CREATE POLICY "Users can view invitations for their organization"
  ON organization_invitations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
    OR email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Members of the organization can insert invitations
CREATE POLICY "Users can create invitations for their organization"
  ON organization_invitations FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Invited users can update their own invitations (accept/decline)
CREATE POLICY "Invited users can update their invitations"
  ON organization_invitations FOR UPDATE
  USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );
