-- Allow authenticated users to delete invoices in their organization
CREATE POLICY "Users can delete invoices in their organization"
  ON invoices FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );
