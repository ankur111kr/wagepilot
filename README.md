# WagePilot 🛫

**Free, production-ready salary, paycheck, and tax calculator platform for US & UK workers.**

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts, and Supabase.

---

## ✨ Features

- **10 Calculators**: Salary, Paycheck, Hourly↔Salary, Overtime, Contractor, UK Income Tax, Mortgage, Savings, Cost of Living, Take-Home Pay
- **51 Programmatic SEO Pages**: Auto-generated state salary calculator pages for all 50 states + DC
- **Dynamic Tax Data**: JSON-based architecture — update a tax year by swapping one file, no code changes
- **Full UK Coverage**: PAYE, National Insurance, Scottish rates, all 5 student loan plans
- **Dark / Light Mode**: System preference aware with manual toggle
- **AdSense Ready**: Leaderboard, sidebar, in-content, and mobile banner ad slots
- **Blog CMS**: Supabase-backed blog with category filtering and markdown rendering
- **Admin Panel**: Protected dashboard for managing content and tax data
- **SEO First**: Dynamic metadata, OpenGraph, Twitter Cards, structured data (FAQ, Calculator, Breadcrumb, Article schemas)
- **Sitemap**: Auto-generated with 150+ URLs including all state pages
- **Analytics**: Google Analytics 4, Microsoft Clarity, Google Search Console ready

---

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone https://github.com/yourusername/wagepilot.git
cd wagepilot
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (secret) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics → Data Streams |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense account |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity |

### 3. Set up Supabase database

Run the schema in your Supabase SQL editor:

```bash
# Copy contents of scripts/schema.sql and paste into Supabase SQL Editor
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
wagepilot/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (fonts, nav, footer, analytics)
│   ├── page.tsx                  # Homepage
│   ├── [state]-salary-calculator/ # 51 programmatic SEO state pages
│   ├── salary-calculator/
│   ├── overtime-calculator/
│   ├── contractor-calculator/
│   ├── uk-income-tax-calculator/
│   ├── hourly-to-salary-calculator/
│   ├── savings-calculator/
│   ├── mortgage-affordability-calculator/
│   ├── take-home-pay-calculator/
│   ├── blog/
│   │   ├── page.tsx              # Blog listing
│   │   └── [slug]/page.tsx       # Individual blog posts
│   ├── admin/                    # Protected admin panel
│   ├── api/                      # API routes (newsletter, contact)
│   ├── states/                   # All-states index page
│   ├── calculators/              # Calculator index
│   ├── faq/
│   ├── about/
│   ├── contact/
│   ├── privacy/
│   ├── terms/
│   ├── disclaimer/
│   ├── sitemap.ts                # Auto-generated sitemap (150+ URLs)
│   └── robots.ts
│
├── components/
│   ├── calculators/              # All 10 calculator components
│   ├── charts/                   # Recharts components
│   ├── home/                     # Hero, Calculator grid, FAQ, Trust, Features
│   ├── layout/                   # Navbar, Footer, ThemeProvider
│   ├── ads/                      # AdSlot component
│   ├── admin/                    # Admin dashboard
│   ├── seo/                      # Analytics component
│   └── ui/                       # Skeleton, shared UI
│
├── data/
│   ├── tax/
│   │   ├── us/2024.json          # US 2024 tax data
│   │   ├── us/2025.json          # US 2025 tax data (all 51 states)
│   │   ├── uk/2024.json          # UK 2024/25 tax data
│   │   └── uk/2025.json          # UK 2025/26 tax data
│   └── faqs/                     # FAQ content
│
├── hooks/
│   ├── useTaxData.ts             # Client-side tax data loading
│   ├── useDebounce.ts            # Debounce hook
│   └── useLocalStorage.ts        # Persistent preferences
│
├── lib/
│   ├── tax.ts                    # All tax calculation functions
│   ├── schema.ts                 # JSON-LD schema generators
│   ├── supabase.ts               # Supabase client
│   └── utils.ts                  # cn(), formatters, helpers
│
├── types/
│   └── index.ts                  # All TypeScript types
│
└── scripts/
    └── schema.sql                # Supabase database schema
```

---

## 📊 Tax Data Architecture

Tax logic is **entirely data-driven**. Adding a new tax year requires only:

```bash
# Add new year file
cp data/tax/us/2025.json data/tax/us/2026.json
# Edit the values in 2026.json
# Update default year in lib/tax.ts
```

No component changes needed. The `loadUSTaxData(year)` and `loadUKTaxData(year)` functions
handle dynamic imports automatically with fallback to the latest year.

---

## 📍 Programmatic SEO Pages

All 51 state salary calculator pages are automatically generated from a single dynamic route:

```
/[state]-salary-calculator  →  app/[state]-salary-calculator/page.tsx
```

This generates pages like:
- `/california-salary-calculator`
- `/texas-paycheck-calculator`
- `/new-york-overtime-calculator`

Each page has unique metadata, state-specific content, and FAQ schema.

To add the paycheck and overtime variants, duplicate the pattern into `[state]-paycheck-calculator` and `[state]-overtime-calculator`.

---

## 🔧 Adding a New Calculator

1. Create the component: `components/calculators/MyCalculator.tsx`
2. Add the page: `app/my-calculator/page.tsx`
3. Add to the grid: `components/home/CalculatorGrid.tsx`
4. Add to the nav: `components/layout/Navbar.tsx`
5. Add to sitemap: `app/sitemap.ts`

---

## 💰 Monetization Setup

### Google AdSense
1. Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX`
2. Create ad units in AdSense dashboard
3. Pass ad slot IDs to `<AdSlot>` components via `adUnitPath` prop

### Analytics
- **GA4**: Set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
- **Clarity**: Set `NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxx`
- **Search Console**: Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxxxx`

---

## 🚢 Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all environment variables in Vercel dashboard under Project → Settings → Environment Variables.

Target Lighthouse scores: **Performance 90+, SEO 100, Accessibility 95+, Best Practices 100**

---

## 📝 Supabase Schema

Tables created by `scripts/schema.sql`:

| Table | Purpose |
|---|---|
| `blog_posts` | CMS for blog articles |
| `seo_pages` | Custom SEO page content |
| `tax_years` | Optional DB-backed tax data storage |
| `newsletter_subscribers` | Email list management |
| `contact_messages` | Contact form submissions |

Row Level Security (RLS) is enabled. Public users can read blog posts and insert newsletter/contact records. Admin operations use the service role key.

---

## 📜 License

MIT License. Tax rate data sourced from IRS and HMRC (public domain).
