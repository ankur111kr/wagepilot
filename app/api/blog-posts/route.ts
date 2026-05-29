import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data } = await sb.from('blog_posts').select('id,slug,title,description,category,author_name,published_at,read_time,featured,show_on_homepage').order('published_at',{ascending:false}).limit(50)
    return NextResponse.json(data||[])
  } catch { return NextResponse.json([]) }
}
