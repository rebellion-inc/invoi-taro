ALTER TABLE organizations
ADD COLUMN stripe_customer_id TEXT UNIQUE,
ADD COLUMN stripe_subscription_id TEXT UNIQUE,
ADD COLUMN stripe_price_id TEXT,
ADD COLUMN subscription_status TEXT,
ADD COLUMN current_period_end TIMESTAMPTZ;

ALTER TABLE organizations
ADD CONSTRAINT organizations_subscription_status_check
CHECK (
  subscription_status IS NULL OR
  subscription_status IN (
    'active',
    'trialing',
    'past_due',
    'canceled',
    'unpaid',
    'incomplete',
    'incomplete_expired',
    'paused'
  )
);

CREATE INDEX idx_organizations_stripe_price_id
ON organizations (stripe_price_id);
