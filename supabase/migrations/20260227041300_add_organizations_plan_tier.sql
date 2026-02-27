ALTER TABLE organizations
ADD COLUMN plan_tier TEXT NOT NULL DEFAULT 'free';

ALTER TABLE organizations
ADD CONSTRAINT organizations_plan_tier_check
CHECK (plan_tier IN ('free', 'pro', 'business'));
