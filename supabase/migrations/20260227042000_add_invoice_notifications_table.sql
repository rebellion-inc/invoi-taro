CREATE TABLE invoice_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('uploaded', 'due_date_morning')),
  notification_key TEXT NOT NULL UNIQUE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoice_notifications_invoice_id ON invoice_notifications(invoice_id);
CREATE INDEX idx_invoice_notifications_organization_id ON invoice_notifications(organization_id);

ALTER TABLE invoice_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notification logs in their organization"
  ON invoice_notifications FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );
