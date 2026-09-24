/*
# Core Knowledge Model — Living Zimbabwe Heritage Platform

## Overview
This migration creates the foundational database schema for a unified Zimbabwean
cultural heritage, education, and creator platform. The central design principle
is: ONE knowledge object (e.g. an oral history interview) should be reusable across
stories, map entries, lessons, quizzes, collections, and creator portfolios.

## New Tables

1. `places` — Geographic locations with lat/lng, province, category. Powers the heritage map.
2. `stories` — The core knowledge object. Each story links to a place, has a verification
   status, visibility level, media, and rich metadata. One story can appear on the map,
   in a collection, in a lesson, and in search results.
3. `people` — Historical and contemporary figures (elders, artists, leaders, creators).
4. `collections` — Thematic groupings of stories, people, places, and media.
5. `collection_items` — Join table linking collections to stories/places/people.
6. `creators` — Artist/craftsperson profiles with skills, portfolio, location.
7. `educational_resources` — Lessons, notes, flashcards tied to curriculum (subject, grade, topic).
8. `quizzes` — Quizzes with questions/answers, linked to educational resources.
9. `quiz_questions` — Individual questions within a quiz.
10. `submissions` — Community contribution workflow tracking verification status.
11. `verification_records` — Audit trail of each verification step for a submission.

## Security
- RLS enabled on all tables.
- All tables use `TO anon, authenticated` policies (public read, public write) since
  this is a prototype/demo platform. In production, write access would be restricted
  to authenticated users with role-based policies.
- This allows the anon-key frontend to read seed data and submit new content.

## Important Notes
1. The `stories` table is the central hub — its `content_type` field (story, oral_history,
   artwork, music, craft, photo, event, tradition) determines how it's displayed.
2. Verification status tracks the human review pipeline: DRAFT → SUBMITTED → AI_PROCESSED
   → RESEARCH_REVIEW → COMMUNITY_REVIEW → VERIFIED → PUBLISHED.
3. Visibility levels: PUBLIC, COMMUNITY_ONLY, RESTRICTED, PRIVATE — built into the model
   from the start for cultural privacy.
4. `educational_resources` link to stories via `story_id`, enabling one interview to
   become a Grade 5 lesson, Grade 6 lesson, quiz, and revision notes.
*/

-- ============================================================
-- PLACES
-- ============================================================
CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  province text,
  district text,
  latitude numeric(10, 7) NOT NULL,
  longitude numeric(10, 7) NOT NULL,
  category text NOT NULL DEFAULT 'heritage',
  historical_period text,
  image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE places ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_places" ON places;
CREATE POLICY "anon_select_places" ON places FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_places" ON places;
CREATE POLICY "anon_insert_places" ON places FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_places" ON places;
CREATE POLICY "anon_update_places" ON places FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_places" ON places;
CREATE POLICY "anon_delete_places" ON places FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- PEOPLE
-- ============================================================
CREATE TABLE IF NOT EXISTS people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  bio text,
  role text,
  community text,
  province text,
  image_url text,
  birth_year integer,
  death_year integer,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE people ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_people" ON people;
CREATE POLICY "anon_select_people" ON people FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_people" ON people;
CREATE POLICY "anon_insert_people" ON people FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_people" ON people;
CREATE POLICY "anon_update_people" ON people FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_people" ON people;
CREATE POLICY "anon_delete_people" ON people FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- STORIES — the central knowledge object
-- ============================================================
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text NOT NULL,
  content text,
  content_type text NOT NULL DEFAULT 'story',
  category text NOT NULL DEFAULT 'heritage',
  language text DEFAULT 'English',
  community text,
  historical_period text,
  place_id uuid REFERENCES places(id) ON DELETE SET NULL,
  person_id uuid REFERENCES people(id) ON DELETE SET NULL,
  image_url text,
  audio_url text,
  video_url text,
  verification_status text NOT NULL DEFAULT 'published',
  visibility text NOT NULL DEFAULT 'public',
  interviewee text,
  interviewer text,
  interview_date date,
  topics text[],
  sources text,
  featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_stories" ON stories;
CREATE POLICY "anon_select_stories" ON stories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_stories" ON stories;
CREATE POLICY "anon_insert_stories" ON stories FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_stories" ON stories;
CREATE POLICY "anon_update_stories" ON stories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_stories" ON stories;
CREATE POLICY "anon_delete_stories" ON stories FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- COLLECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'heritage',
  image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_collections" ON collections;
CREATE POLICY "anon_select_collections" ON collections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_collections" ON collections;
CREATE POLICY "anon_insert_collections" ON collections FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_collections" ON collections;
CREATE POLICY "anon_update_collections" ON collections FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_collections" ON collections;
CREATE POLICY "anon_delete_collections" ON collections FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- COLLECTION_ITEMS — join table
-- ============================================================
CREATE TABLE IF NOT EXISTS collection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE,
  place_id uuid REFERENCES places(id) ON DELETE CASCADE,
  person_id uuid REFERENCES people(id) ON DELETE CASCADE,
  item_type text NOT NULL DEFAULT 'story',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_collection_items" ON collection_items;
CREATE POLICY "anon_select_collection_items" ON collection_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_collection_items" ON collection_items;
CREATE POLICY "anon_insert_collection_items" ON collection_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_collection_items" ON collection_items;
CREATE POLICY "anon_update_collection_items" ON collection_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_collection_items" ON collection_items;
CREATE POLICY "anon_delete_collection_items" ON collection_items FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- CREATORS
-- ============================================================
CREATE TABLE IF NOT EXISTS creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  bio text,
  category text NOT NULL,
  skills text[],
  community text,
  province text,
  image_url text,
  portfolio_images text[],
  story_id uuid REFERENCES stories(id) ON DELETE SET NULL,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_creators" ON creators;
CREATE POLICY "anon_select_creators" ON creators FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_creators" ON creators;
CREATE POLICY "anon_insert_creators" ON creators FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_creators" ON creators;
CREATE POLICY "anon_update_creators" ON creators FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_creators" ON creators;
CREATE POLICY "anon_delete_creators" ON creators FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- EDUCATIONAL_RESOURCES
-- ============================================================
CREATE TABLE IF NOT EXISTS educational_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  subject text NOT NULL,
  grade text NOT NULL,
  topic text,
  curriculum_objective text,
  learning_outcomes text,
  difficulty text DEFAULT 'intermediate',
  language text DEFAULT 'English',
  estimated_duration text,
  resource_type text NOT NULL DEFAULT 'lesson',
  content text,
  story_id uuid REFERENCES stories(id) ON DELETE SET NULL,
  image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE educational_resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_educational_resources" ON educational_resources;
CREATE POLICY "anon_select_educational_resources" ON educational_resources FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_educational_resources" ON educational_resources;
CREATE POLICY "anon_insert_educational_resources" ON educational_resources FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_educational_resources" ON educational_resources;
CREATE POLICY "anon_update_educational_resources" ON educational_resources FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_educational_resources" ON educational_resources;
CREATE POLICY "anon_delete_educational_resources" ON educational_resources FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- QUIZZES
-- ============================================================
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  subject text NOT NULL,
  grade text NOT NULL,
  resource_id uuid REFERENCES educational_resources(id) ON DELETE CASCADE,
  story_id uuid REFERENCES stories(id) ON DELETE SET NULL,
  passing_score integer DEFAULT 70,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_quizzes" ON quizzes;
CREATE POLICY "anon_select_quizzes" ON quizzes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_quizzes" ON quizzes;
CREATE POLICY "anon_insert_quizzes" ON quizzes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_quizzes" ON quizzes;
CREATE POLICY "anon_update_quizzes" ON quizzes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_quizzes" ON quizzes;
CREATE POLICY "anon_delete_quizzes" ON quizzes FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- QUIZ_QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL,
  explanation text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_quiz_questions" ON quiz_questions;
CREATE POLICY "anon_select_quiz_questions" ON quiz_questions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_quiz_questions" ON quiz_questions;
CREATE POLICY "anon_insert_quiz_questions" ON quiz_questions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_quiz_questions" ON quiz_questions;
CREATE POLICY "anon_update_quiz_questions" ON quiz_questions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_quiz_questions" ON quiz_questions;
CREATE POLICY "anon_delete_quiz_questions" ON quiz_questions FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- SUBMISSIONS — community contribution workflow
-- ============================================================
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content_type text NOT NULL DEFAULT 'story',
  description text,
  contributor_name text NOT NULL,
  contributor_email text,
  community text,
  language text,
  province text,
  place_name text,
  place_id uuid REFERENCES places(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'submitted',
  image_url text,
  audio_url text,
  consent_given boolean DEFAULT false,
  admin_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_submissions" ON submissions;
CREATE POLICY "anon_select_submissions" ON submissions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_submissions" ON submissions;
CREATE POLICY "anon_insert_submissions" ON submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_submissions" ON submissions;
CREATE POLICY "anon_update_submissions" ON submissions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_submissions" ON submissions;
CREATE POLICY "anon_delete_submissions" ON submissions FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- VERIFICATION_RECORDS — audit trail
-- ============================================================
CREATE TABLE IF NOT EXISTS verification_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE,
  stage text NOT NULL,
  reviewer_name text,
  notes text,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_verification_records" ON verification_records;
CREATE POLICY "anon_select_verification_records" ON verification_records FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_verification_records" ON verification_records;
CREATE POLICY "anon_insert_verification_records" ON verification_records FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_verification_records" ON verification_records;
CREATE POLICY "anon_update_verification_records" ON verification_records FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_verification_records" ON verification_records;
CREATE POLICY "anon_delete_verification_records" ON verification_records FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_stories_place_id ON stories(place_id);
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_verification ON stories(verification_status);
CREATE INDEX IF NOT EXISTS idx_stories_featured ON stories(featured);
CREATE INDEX IF NOT EXISTS idx_educational_resources_subject_grade ON educational_resources(subject, grade);
CREATE INDEX IF NOT EXISTS idx_educational_resources_story_id ON educational_resources(story_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_places_province ON places(province);
