import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/schema'
import { AdSlot } from '@/components/ads/AdSlot'
import type { Metadata } from 'next'
import type { DBBlogPost } from '@/types'

interface Props { params: { slug: string } }

async function getPost(slug: string): Promise<DBBlogPost | null> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return {}
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.description,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at ?? post.published_at,
      authors: [post.author_name],
      images: post.image_url ? [post.image_url] : ['/og-image.png'],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.description,
    url: `/blog/${post.slug}`,
    publishedAt: post.published_at,
    updatedAt: post.updated_at ?? undefined,
    authorName: post.author_name,
    imageUrl: post.image_url ?? undefined,
  })
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: post.title, href: `/blog/${post.slug}` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:text-foreground">Home</a></li>
            <li>/</li>
            <li><a href="/blog" className="hover:text-foreground">Blog</a></li>
            <li>/</li>
            <li className="truncate text-foreground max-w-xs">{post.title}</li>
          </ol>
        </nav>

        <article>
          {/* Header */}
          <header className="mb-8">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                {post.category.replace(/-/g, ' ')}
              </span>
              <span>·</span>
              <span>{post.read_time} min read</span>
              <span>·</span>
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
            <h1 className="font-sora text-3xl font-bold tracking-tight leading-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>

            {/* Author */}
            <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-sora text-sm font-bold text-primary">
                {post.author_name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{post.author_name}</p>
                {post.author_bio && <p className="text-xs text-muted-foreground">{post.author_bio}</p>}
              </div>
            </div>
          </header>

          <AdSlot slot="in-content" className="mb-8" />

          {/* Content */}
          <div
            className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-sora prose-headings:tracking-tight prose-a:text-primary prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <AdSlot slot="in-content" className="mt-8" />

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </>
  )
}
