import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
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

    if (error) return NextResponse.json([], { status: 200 })
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([])
  }
}
