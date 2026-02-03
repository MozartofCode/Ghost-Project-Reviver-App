# Database Schema: Project Phoenix

```sql
-- Users Table (via GitHub OAuth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_id BIGINT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Repositories Table
CREATE TABLE repositories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_repo_id BIGINT UNIQUE NOT NULL,
  full_name TEXT NOT NULL, -- e.g., "user/repo"
  description TEXT,
  language TEXT,
  stars_count INT DEFAULT 0,
  last_commit_at TIMESTAMP WITH TIME ZONE,
  abandonment_status TEXT CHECK (status IN ('active', 'at-risk', 'abandoned', 'adopted')),
  maintenance_score FLOAT, -- The MDS calculation result
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adoption Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_id UUID REFERENCES repositories(id),
  applicant_id UUID REFERENCES users(id),
  pitch_text TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scoring Metrics (Detailed breakdown for UI)
CREATE TABLE repo_metrics (
  repo_id UUID REFERENCES repositories(id),
  dependency_debt_score FLOAT,
  issue_backlog_score FLOAT,
  doc_coverage_score FLOAT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);