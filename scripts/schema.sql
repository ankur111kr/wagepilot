-- WagePilot Supabase Schema
-- Run this in your Supabase SQL editor to create all required tables

-- ─── Blog Posts ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  content         TEXT NOT NULL DEFAULT '',
  category        TEXT NOT NULL CHECK (category IN (
    'tax-guides','salary-guides','overtime-laws','cost-of-living',
    'financial-planning','uk-paye','irs-updates'
  )),
  author_name     TEXT NOT NULL DEFAULT 'WagePilot Team',
  author_bio      TEXT,
  author_avatar   TEXT,
  published_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ,
  read_time       INTEGER NOT NULL DEFAULT 5,
  tags            TEXT[] DEFAULT '{}',
  featured        BOOLEAN DEFAULT FALSE,
  seo_title       TEXT,
  seo_description TEXT,
  image_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = TRUE;

-- ─── SEO Pages ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.seo_pages (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug             TEXT UNIQUE NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  h1               TEXT NOT NULL,
  content          TEXT NOT NULL DEFAULT '',
  faq_items        JSONB DEFAULT '[]',
  internal_links   JSONB DEFAULT '[]',
  calculator_type  TEXT NOT NULL,
  location         JSONB,
  published_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_pages_slug ON seo_pages(slug);
CREATE INDEX IF NOT EXISTS idx_seo_pages_calculator ON seo_pages(calculator_type);

-- ─── Tax Years ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tax_years (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year        INTEGER NOT NULL,
  country     TEXT NOT NULL CHECK (country IN ('US','UK')),
  data        JSONB NOT NULL,
  is_current  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ,
  UNIQUE(year, country)
);

CREATE INDEX IF NOT EXISTS idx_tax_years_country_year ON tax_years(country, year);
CREATE INDEX IF NOT EXISTS idx_tax_years_current ON tax_years(is_current) WHERE is_current = TRUE;

-- ─── Newsletter Subscribers ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email          TEXT UNIQUE NOT NULL,
  subscribed_at  TIMESTAMPTZ DEFAULT NOW(),
  confirmed      BOOLEAN DEFAULT FALSE,
  source         TEXT,
  unsubscribed   BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- ─── Contact Messages ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT NOT NULL DEFAULT 'General Enquiry',
  message     TEXT NOT NULL,
  replied     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_replied ON contact_messages(replied) WHERE replied = FALSE;

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can read published blog posts
CREATE POLICY "Public read blog_posts" ON blog_posts
  FOR SELECT USING (true);

-- Public can read SEO pages
CREATE POLICY "Public read seo_pages" ON seo_pages
  FOR SELECT USING (true);

-- Public can read tax years
CREATE POLICY "Public read tax_years" ON tax_years
  FOR SELECT USING (true);

-- Public can insert newsletter (signup)
CREATE POLICY "Public insert newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Public can insert contact messages
CREATE POLICY "Public insert contact" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Service role (admin) has full access to everything
-- (handled by service role key in server-side code)

-- ─── Sample blog post ─────────────────────────────────────────────────────────
INSERT INTO blog_posts (slug, title, description, content, category, author_name, read_time, tags, featured)
VALUES (
  '2025-tax-brackets-explained',
  '2025 Federal Tax Brackets Explained',
  'A complete guide to the 2025 IRS income tax brackets, standard deductions, and how to calculate your effective tax rate.',
  '<h2>What changed for 2025?</h2><p>The IRS has adjusted all federal income tax brackets upward by approximately 2.8% for inflation. The standard deduction increased to <strong>$15,000</strong> for single filers and <strong>$30,000</strong> for married filing jointly.</p><h2>2025 Federal Tax Brackets (Single)</h2><ul><li>10%: $0 – $11,925</li><li>12%: $11,925 – $48,475</li><li>22%: $48,475 – $103,350</li><li>24%: $103,350 – $197,300</li><li>32%: $197,300 – $250,525</li><li>35%: $250,525 – $626,350</li><li>37%: Over $626,350</li></ul>',
  'tax-guides',
  'WagePilot Team',
  8,
  ARRAY['taxes', '2025', 'IRS', 'brackets'],
  true
) ON CONFLICT (slug) DO NOTHING;
