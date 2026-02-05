-- Migration 003: Create Squad System Tables
-- This migration creates the squad and squad_members tables for the squad system feature

-- Create squads table
CREATE TABLE IF NOT EXISTS squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  CONSTRAINT unique_repo_squad_name UNIQUE(repo_id, name)
);

-- Create squad_members table
CREATE TABLE IF NOT EXISTS squad_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('creator', 'member', 'moderator')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_squad_user UNIQUE(squad_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_squads_repo ON squads(repo_id);
CREATE INDEX IF NOT EXISTS idx_squads_created_by ON squads(created_by);
CREATE INDEX IF NOT EXISTS idx_squad_members_squad ON squad_members(squad_id);
CREATE INDEX IF NOT EXISTS idx_squad_members_user ON squad_members(user_id);

-- Create function to auto-update member count
CREATE OR REPLACE FUNCTION update_squad_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE squads SET member_count = member_count + 1 WHERE id = NEW.squad_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE squads SET member_count = member_count - 1 WHERE id = OLD.squad_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic member count updates
DROP TRIGGER IF EXISTS squad_member_count_trigger ON squad_members;
CREATE TRIGGER squad_member_count_trigger
AFTER INSERT OR DELETE ON squad_members
FOR EACH ROW EXECUTE FUNCTION update_squad_member_count();

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at on squads
DROP TRIGGER IF EXISTS update_squads_updated_at ON squads;
CREATE TRIGGER update_squads_updated_at
BEFORE UPDATE ON squads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for squads table
-- Everyone can view squads
CREATE POLICY "Squads are viewable by everyone" ON squads
  FOR SELECT USING (true);

-- Authenticated users can create squads
CREATE POLICY "Authenticated users can create squads" ON squads
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only squad creator can update their squad
CREATE POLICY "Squad creator can update their squad" ON squads
  FOR UPDATE USING (created_by = auth.uid());

-- Only squad creator can delete their squad
CREATE POLICY "Squad creator can delete their squad" ON squads
  FOR DELETE USING (created_by = auth.uid());

-- RLS Policies for squad_members table
-- Everyone can view squad members
CREATE POLICY "Squad members are viewable by everyone" ON squad_members
  FOR SELECT USING (true);

-- Authenticated users can join squads (insert their own membership)
CREATE POLICY "Users can join squads" ON squad_members
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- Users can leave squads (delete their own membership)
CREATE POLICY "Users can leave squads" ON squad_members
  FOR DELETE USING (user_id = auth.uid());
