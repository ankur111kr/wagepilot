import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

async function getPost(slug: string) {
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data } = await sb.from('blog_posts').select('*').eq('slug', slug).single()
    return data
  } catch { return null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Post Not Found | WagePilot' }
  return { title: `${post.title} | WagePilot`, description: post.description, alternates: { canonical: `/blog/${params.slug}` } }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ background: 'rgba(4,14,26,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#2563eb,#06b6d4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💰</div>
          <span style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(90deg,#60a5fa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WagePilot</span>
        </Link>
        <Link href="/salary-calculator" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Calculate Now</Link>
      </nav>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 20px' }}>
        <nav style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>{' / '}
          <Link href="/blog" style={{ color: '#94a3b8', textDecoration: 'none' }}>Blog</Link>{' / '}
          <span style={{ color: '#0f172a' }}>{post.title.slice(0, 40)}...</span>
        </nav>
        <article>
          <header style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ background: '#eff6ff', color: '#2563eb', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: '700' }}>{post.category}</span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{post.read_time} min read</span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: '900', color: '#0f172a', margin: '0 0 12px', lineHeight: 1.25 }}>{post.title}</h1>
            <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 20px', lineHeight: 1.7 }}>{post.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#2563eb,#06b6d4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px' }}>{post.author_name?.charAt(0)||'W'}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{post.author_name}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>WagePilot Finance Team</div>
              </div>
            </div>
          </header>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: post.content }}/>
          {post.tags?.length > 0 && (
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {post.tags.map((tag: string) => <span key={tag} style={{ background: '#f1f5f9', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#64748b' }}>#{tag}</span>)}
            </div>
          )}
        </article>
        <div style={{ marginTop: '32px', background: 'linear-gradient(135deg,#2563eb,#06b6d4)', borderRadius: '16px', padding: '28px', textAlign: 'center', color: 'white' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 8px' }}>Calculate Your Take-Home Pay</h3>
          <p style={{ margin: '0 0 20px', opacity: .85, fontSize: '14px' }}>Free salary and tax calculators for USA and UK</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/salary-calculator" style={{ background: 'white', color: '#2563eb', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Salary Calculator</Link>
            <Link href="/uk-income-tax-calculator" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: '1px solid rgba(255,255,255,0.3)' }}>UK Tax Calculator</Link>
          </div>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link href="/blog" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>← Back to all articles</Link>
        </div>
      </div>
      <style>{`article h2{font-size:1.3rem;font-weight:800;color:#0f172a;margin:24px 0 12px;}article h3{font-size:1.1rem;font-weight:700;color:#0f172a;margin:20px 0 8px;}article p{color:#374151;margin:0 0 14px;}article ul,article ol{color:#374151;padding-left:24px;margin:0 0 14px;}article li{margin-bottom:6px;}article strong{color:#0f172a;}article a{color:#2563eb;}article code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:.9em;}`}</style>
    </div>
  )
}
