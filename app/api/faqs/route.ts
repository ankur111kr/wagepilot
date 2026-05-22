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
      .from('faqs')
      .select('id, question, answer, sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true })

    if (error) return NextResponse.json([], { status: 200 })
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([])
  }
}
