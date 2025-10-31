-- Run this SQL in Supabase SQL Editor to create the required tables
-- Go to: https://supabase.com/dashboard/project/qaanvcxzdjekeabrdrqlu/sql/new

-- Drop existing tables if they exist (careful! this deletes all data)
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS competitions;

-- Create competitions table
CREATE TABLE competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'family-public', -- 'family-public' or 'family-private'
  total_pool DECIMAL DEFAULT 0,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create members table
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_code TEXT REFERENCES competitions(code) ON DELETE CASCADE,
  member_id TEXT NOT NULL,
  name TEXT NOT NULL,
  contribution DECIMAL DEFAULT 0,
  portfolio JSONB DEFAULT '{"cash": 100000, "positions": {}, "history": []}'::jsonb,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competition_code, member_id)
);

-- Enable Row Level Security
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for now (you can tighten this later)
CREATE POLICY "Allow all operations on competitions"
  ON competitions
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on members"
  ON members
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verify tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('competitions', 'members');
