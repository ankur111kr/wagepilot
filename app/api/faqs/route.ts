import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page') || 'homepage'
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    let query = sb.from('faqs').select('id,question,answer,sort_order,show_on_homepage,show_on_faq_page').eq('active',true).order('sort_order',{ascending:true})
    if (page === 'homepage') query = query.eq('show_on_homepage', true)
    if (page === 'faq') query = query.eq('show_on_faq_page', true)
    const { data } = await query
    return NextResponse.json(data||[])
  } catch { return NextResponse.json([]) }
}
