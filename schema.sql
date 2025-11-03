-- schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table: both candidates and company users (role differentiates)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('candidate','company-admin')),
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Candidate profiles (one per candidate user)
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  headline TEXT,
  summary TEXT,
  experience_years NUMERIC(4,2) DEFAULT 0,
  location TEXT,
  resume_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Candidate skills (one row per skill)
CREATE TABLE candidate_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  skill_level INT DEFAULT 0, -- 0..10 optional
  UNIQUE(candidate_id, lower(skill))
);

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Job posts
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  required_experience_min NUMERIC(4,2) DEFAULT 0,
  location TEXT,
  remote BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Job required skills
CREATE TABLE job_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  weight NUMERIC(5,2) DEFAULT 1.0,
  UNIQUE(job_id, lower(skill))
);

-- Matches (audit of matching events)
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  score NUMERIC(6,4),
  matched_at TIMESTAMPTZ DEFAULT now(),
  notified_candidate BOOLEAN DEFAULT false,
  notified_company BOOLEAN DEFAULT false
);

-- Notifications log (for emails)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT,
  payload JSONB,
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for quick lookup
CREATE INDEX idx_candidate_skills_skill ON candidate_skills (lower(skill));
CREATE INDEX idx_job_skills_skill ON job_skills (lower(skill));
CREATE INDEX idx_candidates_location ON candidates (location);
CREATE INDEX idx_jobs_location ON jobs (location);
