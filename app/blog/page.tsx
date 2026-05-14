import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { AdSlot } from '@/components/ads/AdSlot'
import type { Metadata } from 'next'
import type { DBBlogPost, BlogCategory } from '@/types'

export const metadata: Metadata = {
  title: 'Blog – Tax Guides, Salary Tips & Finance Advice | WagePilot',
  description:
    'Expert guides on US and UK taxes, salary negotiation, overtime laws, cost of living, and financial planning. Updated regularly by our finance team.',
  alternates: { canonical: '/blog' },
}

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  'tax-guides': 'Tax Guides',
  'salary-guides': 'Salary Guides',
  'overtime-laws': 'Overtime Laws',
  'cost-of-living': 'Cost of Living',
  'financial-planning': 'Financial Planning',
  'uk-paye': 'UK PAYE',
  'irs-updates': 'IRS Updates',
}

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  'tax-guides': 'bg-blue-500/10 text-blue-600',
  'salary-guides': 'bg-emerald-500/10 text-emerald-600',
  'overtime-laws': 'bg-amber-500/10 text-amber-600',
  'cost-of-living': 'bg-pink-500/10 text-pink-600',
  'financial-planning': 'bg-violet-500/10 text-violet-600',
  'uk-paye': 'bg-indigo-500/10 text-indigo-600',
  'irs-updates': 'bg-red-500/10 text-red-600',
}

async function getPosts() {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(50)
  return (data ?? []) as DBBlogPost[]
}

// Static fallback posts for when Supabase isn't configured
const SAMPLE_POSTS: Partial<DBBlogPost>[] = [
  { id: '1', slug: '2025-tax-brackets-explained', title: '2025 Federal Tax Brackets Explained', description: 'A complete guide to the 2025 IRS income tax brackets, standard deductions, and how to calculate your effective tax rate.', category: 'tax-guides', author_name: 'WagePilot Team', published_at: '2025-01-15', read_time: 8, tags: ['taxes', '2025', 'IRS'], featured: true },
  { id: '2', slug: 'how-to-negotiate-salary', title: 'How to Negotiate Your Salary in 2025', description: 'Data-driven tips for negotiating a higher salary, backed by real market research and compensation benchmarks.', category: 'salary-guides', author_name: 'WagePilot Team', published_at: '2025-02-01', read_time: 6, tags: ['salary', 'negotiation'], featured: false },
  { id: '3', slug: 'uk-paye-guide-2025', title: 'Complete Guide to UK PAYE in 2025/26', description: 'Everything you need to know about UK PAYE: income tax bands, National Insurance, tax codes, and how to check your payslip.', category: 'uk-paye', author_name: 'WagePilot Team', published_at: '2025-04-06', read_time: 10, tags: ['UK', 'PAYE', 'NI'], featured: true },
  { id: '4', slug: 'overtime-laws-by-state', title: 'Overtime Laws by State: A 2025 Guide', description: 'Federal FLSA overtime rules and state-specific overtime laws. Know your rights as an hourly worker.', category: 'overtime-laws', author_name: 'WagePilot Team', published_at: '2025-01-28', read_time: 12, tags: ['overtime', 'FLSA', 'state laws'], featured: false },
  { id: '5', slug: 'cost-of-living-nyc-vs-austin', title: 'NYC vs Austin: Cost of Living Breakdown 2025', description: 'A detailed comparison of living costs between New York City and Austin, Texas — including salary adjustments needed.', category: 'cost-of-living', author_name: 'WagePilot Team', published_at: '2025-03-10', read_time: 7, tags: ['NYC', 'Austin', 'cost of living'], featured: false },
  { id: '6', slug: 'contractor-vs-employee-taxes', title: 'Contractor vs Employee: Tax Differences Explained', description: 'Self-employment tax, quarterly payments, and business deductions — everything a 1099 contractor needs to know.', category: 'tax-guides', author_name: 'WagePilot Team', published_at: '2025-02-20', read_time: 9, tags: ['contractor', '1099', 'self-employment'], featured: false },
]

export default async function BlogPage() {
  let posts: Partial<DBBlogPost>[] = []
  try {
    posts = await getPosts()
  } catch {
    posts = SAMPLE_POSTS
  }
  if (posts.length === 0) posts = SAMPLE_POSTS

  const featured = posts.filter(p => p.featured)
  const regular = posts.filter(p => !p.featured)
  const categories = [...new Set(posts.map(p => p.category))] as BlogCategory[]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
          Finance Guides & Tax Updates
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Expert guides on US and UK taxes, salary tips, overtime laws, and financial planning.
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/blog" className="rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          All Posts
        </Link>
        {categories.map(cat => (
          <Link key={cat} href={`/blog/${cat}`}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
            {CATEGORY_LABELS[cat] || cat}
          </Link>
        ))}
      </div>

      <AdSlot slot="leaderboard" className="mb-10" />

      {/* Featured posts */}
      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-5 font-sora text-xl font-semibold">Featured</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group wp-card p-6 hover:-translate-y-0.5 transition-all duration-200">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[post.category as BlogCategory] || 'bg-muted text-muted-foreground'}`}>
                    {CATEGORY_LABELS[post.category as BlogCategory] || post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.read_time} min read</span>
                </div>
                <h3 className="font-sora text-lg font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author_name}</span>
                  <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All posts grid */}
      <section>
        <h2 className="mb-5 font-sora text-xl font-semibold">All Articles</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regular.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`}
              className="group wp-card p-5 hover:-translate-y-0.5 transition-all duration-200">
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[post.category as BlogCategory] || 'bg-muted text-muted-foreground'}`}>
                  {CATEGORY_LABELS[post.category as BlogCategory] || post.category}
                </span>
              </div>
              <h3 className="font-sora text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {post.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{post.read_time} min read</span>
                <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
