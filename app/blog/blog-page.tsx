import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog – Tax Guides, Salary Tips & Finance Advice | WagePilot',
  description: 'Expert guides on US and UK taxes, salary negotiation, overtime laws, cost of living, and financial planning.',
  alternates: { canonical: '/blog' },
}

const CATEGORY_LABELS: Record<string, string> = {
  'tax-guides': 'Tax Guides',
  'salary-guides': 'Salary Guides',
  'overtime-laws': 'Overtime Laws',
  'cost-of-living': 'Cost of Living',
  'financial-planning': 'Financial Planning',
  'uk-paye': 'UK PAYE',
  'irs-updates': 'IRS Updates',
}

const CATEGORY_COLORS: Record<string, string> = {
  'tax-guides': '#3b82f6',
  'salary-guides': '#10b981',
  'overtime-laws': '#f59e0b',
  'cost-of-living': '#ec4899',
  'financial-planning': '#8b5cf6',
  'uk-paye': '#06b6d4',
  'irs-updates': '#ef4444',
}

const SAMPLE_POSTS = [
  { id: '1', slug: '2025-tax-brackets-explained', title: '2025 Federal Tax Brackets Explained', description: 'Complete guide to 2025 IRS income tax brackets, standard deductions, and how to calculate your effective tax rate.', category: 'tax-guides', author_name: 'WagePilot Team', published_at: '2025-01-15', read_time: 8, featured: true },
  { id: '2', slug: 'how-to-negotiate-salary', title: 'How to Negotiate Your Salary in 2025', description: 'Data-driven tips for negotiating a higher salary backed by real market research and compensation benchmarks.', category: 'salary-guides', author_name: 'WagePilot Team', published_at: '2025-02-01', read_time: 6, featured: false },
  { id: '3', slug: 'uk-paye-guide-2025', title: 'Complete Guide to UK PAYE in 2025/26', description: 'Everything about UK PAYE: income tax bands, National Insurance, tax codes, and how to check your payslip.', category: 'uk-paye', author_name: 'WagePilot Team', published_at: '2025-04-06', read_time: 10, featured: true },
  { id: '4', slug: 'overtime-laws-by-state', title: 'Overtime Laws by State: 2025 Guide', description: 'Federal FLSA overtime rules and state-specific overtime laws. Know your rights as an hourly worker.', category: 'overtime-laws', author_name: 'WagePilot Team', published_at: '2025-01-28', read_time: 12, featured: false },
  { id: '5', slug: 'best-states-no-income-tax', title: 'Best States for Take-Home Pay in 2025', description: '9 states have no income tax. See how much more you keep in Texas vs California on the same salary.', category: 'salary-guides', author_name: 'WagePilot Team', published_at: '2025-03-10', read_time: 7, featured: false },
  { id: '6', slug: 'contractor-vs-employee-taxes', title: 'Contractor vs Employee: Tax Differences', description: 'Self-employment tax, quarterly payments, and business deductions — everything a 1099 contractor needs.', category: 'tax-guides', author_name: 'WagePilot Team', published_at: '2025-02-20', read_time: 9, featured: false },
]

async function getPosts() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, description, category, author_name, published_at, read_time, featured')
      .order('published_at', { ascending: false })
      .limit(50)

    if (error || !data || data.length === 0) return SAMPLE_POSTS
    return data
  } catch {
    return SAMPLE_POSTS
  }
}

export default async function BlogPage() {
  const posts = await getPosts()
  const featured = posts.filter((p: any) => p.featured)
  const regular = posts.filter((p: any) => !p.featured)
  const categories = [...new Set(posts.map((p: any) => p.category))]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💰</div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#2563eb' }}>WagePilot</span>
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/salary-calculator" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none', fontWeight: '500' }}>Calculators</Link>
          <Link href="/salary-calculator" style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Calculate Now</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
            💡 Finance Guides & Tax Tips
          </h1>
          <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: '15px' }}>
            Expert guides on US and UK taxes, salary tips, overtime laws, and financial planning.
          </p>

          {/* Category filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ background: '#2563eb', color: 'white', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', fontWeight: '600' }}>All Posts</span>
            {categories.map((cat: any) => (
              <span key={cat} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                {CATEGORY_LABELS[cat] || cat}
              </span>
            ))}
          </div>
        </div>

        {/* Featured posts */}
        {featured.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>⭐ Featured</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {featured.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s' }}>
                  <div style={{ height: '6px', background: `linear-gradient(90deg, ${CATEGORY_COLORS[post.category] || '#3b82f6'}, #06b6d4)` }} />
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ background: (CATEGORY_COLORS[post.category] || '#3b82f6') + '15', color: CATEGORY_COLORS[post.category] || '#3b82f6', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>
                        {CATEGORY_LABELS[post.category] || post.category}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{post.read_time} min read</span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px', lineHeight: 1.4 }}>{post.title}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px', lineHeight: 1.6 }}>{post.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                      <span>{post.author_name}</span>
                      <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All posts */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>📚 All Articles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {regular.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px', transition: 'transform 0.15s' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ background: (CATEGORY_COLORS[post.category] || '#3b82f6') + '15', color: CATEGORY_COLORS[post.category] || '#3b82f6', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>
                    {CATEGORY_LABELS[post.category] || post.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px', lineHeight: 1.4 }}>{post.title}</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px', lineHeight: 1.5 }}>{post.description?.slice(0, 100)}...</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                  <span>{post.read_time} min read</span>
                  <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: '40px', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', borderRadius: '16px', padding: '32px', textAlign: 'center', color: 'white' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0 0 8px' }}>Calculate Your Take-Home Pay</h3>
          <p style={{ margin: '0 0 20px', opacity: 0.85, fontSize: '14px' }}>Free salary and tax calculators for USA and UK — updated for 2025</p>
          <Link href="/salary-calculator" style={{ background: 'white', color: '#2563eb', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', display: 'inline-block' }}>
            Open Salary Calculator →
          </Link>
        </div>
      </div>
    </div>
  )
}
