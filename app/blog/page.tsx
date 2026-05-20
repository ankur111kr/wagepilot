import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog – Tax Guides, Salary Tips & Finance Advice | WagePilot',
  description: 'Expert guides on US and UK taxes, salary negotiation, overtime laws, and financial planning.',
  alternates: { canonical: '/blog' },
}

// Force dynamic rendering - page will always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

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

async function getPosts() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, description, category, author_name, published_at, read_time, featured')
      .order('published_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Blog fetch error:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Blog page error:', err)
    return []
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
          <Link href="/salary-calculator" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>Calculators</Link>
          <Link href="/salary-calculator" style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
            Calculate Now
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>{' / '}
          <span style={{ color: '#0f172a' }}>Blog</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
            💡 Finance Guides & Tax Tips
          </h1>
          <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: '15px' }}>
            Expert guides on US and UK taxes, salary tips, overtime laws, and financial planning.
          </p>

          {/* Category filters */}
          {categories.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ background: '#2563eb', color: 'white', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', fontWeight: '600' }}>
                All Posts ({posts.length})
              </span>
              {categories.map((cat: any) => (
                <span key={cat} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  {CATEGORY_LABELS[cat] || cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* No posts state */}
        {posts.length === 0 && (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>No posts yet</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              Create your first blog post from the admin panel.
            </p>
            <Link href="/admin" style={{ background: '#2563eb', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              Go to Admin Panel
            </Link>
          </div>
        )}

        {/* Featured posts */}
        {featured.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ⭐ Featured Articles
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {featured.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  style={{ textDecoration: 'none', display: 'block', background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ height: '6px', background: `linear-gradient(90deg, ${CATEGORY_COLORS[post.category] || '#3b82f6'}, #06b6d4)` }} />
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ background: (CATEGORY_COLORS[post.category] || '#3b82f6') + '15', color: CATEGORY_COLORS[post.category] || '#3b82f6', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>
                        {CATEGORY_LABELS[post.category] || post.category}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{post.read_time} min read</span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px', lineHeight: 1.4 }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px', lineHeight: 1.6 }}>
                      {post.description?.slice(0, 120)}...
                    </p>
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
        {regular.length > 0 && (
          <div>
            <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              📚 All Articles
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {regular.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  style={{ textDecoration: 'none', display: 'block', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ background: (CATEGORY_COLORS[post.category] || '#3b82f6') + '15', color: CATEGORY_COLORS[post.category] || '#3b82f6', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>
                      {CATEGORY_LABELS[post.category] || post.category}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px', lineHeight: 1.4 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px', lineHeight: 1.5 }}>
                    {post.description?.slice(0, 100)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                    <span>{post.read_time} min read</span>
                    <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
      
