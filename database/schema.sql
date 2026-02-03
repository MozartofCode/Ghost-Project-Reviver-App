-- ============================================================================
-- Ghost Project Reviver Database Schema (MVP Version)
-- ============================================================================
-- This is a simplified version for MVP focusing on core functionality
-- Complex features like metrics calculation will use dummy data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_id BIGINT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website_url TEXT,
  twitter_username TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- ============================================================================
-- REPOSITORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS repositories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_repo_id BIGINT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  language TEXT,
  stars_count INT DEFAULT 0,
  forks_count INT DEFAULT 0,
  watchers_count INT DEFAULT 0,
  open_issues_count INT DEFAULT 0,
  size_kb INT DEFAULT 0,
  default_branch TEXT DEFAULT 'main',
  homepage_url TEXT,
  topics TEXT[],
  license_name TEXT,
  created_at_github TIMESTAMP WITH TIME ZONE,
  last_commit_at TIMESTAMP WITH TIME ZONE,
  last_push_at TIMESTAMP WITH TIME ZONE,
  abandonment_status TEXT DEFAULT 'unknown' 
    CHECK (abandonment_status IN ('active', 'at-risk', 'abandoned', 'reviving', 'unknown')),
  maintenance_score FLOAT CHECK (maintenance_score >= 0 AND maintenance_score <= 100),
  owner_github_id BIGINT, -- GitHub owner ID, not our user ID
  owner_username TEXT, -- GitHub owner username
  is_analyzed BOOLEAN DEFAULT FALSE,
  last_analyzed_at TIMESTAMP WITH TIME ZONE,
  analysis_error TEXT,
  views_count INT DEFAULT 0,
  interest_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for repositories
CREATE INDEX IF NOT EXISTS idx_repos_github_id ON repositories(github_repo_id);
CREATE INDEX IF NOT EXISTS idx_repos_full_name ON repositories(full_name);
CREATE INDEX IF NOT EXISTS idx_repos_abandonment ON repositories(abandonment_status);
CREATE INDEX IF NOT EXISTS idx_repos_maintenance ON repositories(maintenance_score DESC);
CREATE INDEX IF NOT EXISTS idx_repos_stars ON repositories(stars_count DESC);
CREATE INDEX IF NOT EXISTS idx_repos_language ON repositories(language);
CREATE INDEX IF NOT EXISTS idx_repos_last_commit ON repositories(last_commit_at DESC);
CREATE INDEX IF NOT EXISTS idx_repos_topics ON repositories USING GIN(topics);

-- ============================================================================
-- SQUADS TABLE (Revival teams for each repository)
-- ============================================================================
CREATE TABLE IF NOT EXISTS squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Revival Squad',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(repo_id) -- One squad per repository
);

CREATE INDEX IF NOT EXISTS idx_squads_repo ON squads(repo_id);

-- ============================================================================
-- SQUAD MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS squad_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'contributor'
    CHECK (role IN ('lead', 'frontend', 'backend', 'designer', 'qa', 'docs', 'contributor')),
  is_lead BOOLEAN DEFAULT FALSE,
  availability TEXT, -- e.g., "weekends", "evenings", "full-time"
  skills TEXT[], -- Array of skills/technologies
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(squad_id, user_id) -- User can join a squad only once
);

CREATE INDEX IF NOT EXISTS idx_squad_members_squad ON squad_members(squad_id);
CREATE INDEX IF NOT EXISTS idx_squad_members_user ON squad_members(user_id);
CREATE INDEX IF NOT EXISTS idx_squad_members_role ON squad_members(role);

-- ============================================================================
-- ACTIVITY FEED TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  repo_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL 
    CHECK (activity_type IN (
      'repo_added', 'squad_joined', 'squad_created', 'milestone_reached', 
      'role_assigned', 'repo_updated'
    )),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_repo ON activity_feed(repo_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON activity_feed(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_public ON activity_feed(is_public, created_at DESC);

-- ============================================================================
-- REPOSITORY METRICS TABLE (Simplified for MVP - mostly dummy data)
-- ============================================================================
CREATE TABLE IF NOT EXISTS repo_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  
  -- Maintenance Difficulty Score Components
  dependency_debt_score FLOAT CHECK (dependency_debt_score >= 0 AND dependency_debt_score <= 100),
  issue_backlog_score FLOAT CHECK (issue_backlog_score >= 0 AND issue_backlog_score <= 100),
  doc_coverage_score FLOAT CHECK (doc_coverage_score >= 0 AND doc_coverage_score <= 100),
  cyclomatic_complexity_avg FLOAT,
  
  -- Additional Metrics
  commit_frequency_score FLOAT,
  contributor_diversity_score FLOAT,
  test_coverage_percentage FLOAT,
  
  -- Raw Data (will be dummy for MVP)
  total_dependencies INT DEFAULT 0,
  outdated_dependencies INT DEFAULT 0,
  total_issues INT DEFAULT 0,
  stale_issues INT DEFAULT 0,
  has_readme BOOLEAN DEFAULT FALSE,
  has_contributing_guide BOOLEAN DEFAULT FALSE,
  has_license BOOLEAN DEFAULT FALSE,
  has_tests BOOLEAN DEFAULT FALSE,
  code_comment_ratio FLOAT,
  
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(repo_id)
);

CREATE INDEX IF NOT EXISTS idx_metrics_repo ON repo_metrics(repo_id);
CREATE INDEX IF NOT EXISTS idx_metrics_calculated ON repo_metrics(calculated_at DESC);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repositories_updated_at BEFORE UPDATE ON repositories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_squads_updated_at BEFORE UPDATE ON squads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repo_metrics_updated_at BEFORE UPDATE ON repo_metrics 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE repo_metrics ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users are viewable by everyone" 
  ON users FOR SELECT 
  USING (is_active = TRUE);

CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Repositories policies
CREATE POLICY "Repositories are viewable by everyone" 
  ON repositories FOR SELECT 
  USING (TRUE);

CREATE POLICY "Authenticated users can insert repositories" 
  ON repositories FOR INSERT 
  TO authenticated
  WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can update repositories" 
  ON repositories FOR UPDATE 
  TO authenticated
  USING (TRUE);

-- Squads policies
CREATE POLICY "Squads are viewable by everyone" 
  ON squads FOR SELECT 
  USING (TRUE);

CREATE POLICY "Authenticated users can create squads" 
  ON squads FOR INSERT 
  TO authenticated
  WITH CHECK (TRUE);

-- Squad members policies
CREATE POLICY "Squad members are viewable by everyone" 
  ON squad_members FOR SELECT 
  USING (TRUE);

CREATE POLICY "Users can join squads" 
  ON squad_members FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their squad membership" 
  ON squad_members FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can leave squads" 
  ON squad_members FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Activity feed policies
CREATE POLICY "Public activities are viewable by everyone" 
  ON activity_feed FOR SELECT 
  USING (is_public = TRUE);

CREATE POLICY "Users can view their own activities" 
  ON activity_feed FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create activities" 
  ON activity_feed FOR INSERT 
  TO authenticated
  WITH CHECK (TRUE);

-- Repo metrics policies
CREATE POLICY "Metrics are viewable by everyone" 
  ON repo_metrics FOR SELECT 
  USING (TRUE);

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- This will be handled by the application, not in the schema
