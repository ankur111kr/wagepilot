import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData()
    const email = body.get('email')?.toString().trim().toLowerCase()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { email, subscribed_at: new Date().toISOString(), confirmed: false, source: 'footer' },
        { onConflict: 'email' }
      )

    if (error) throw error

    return NextResponse.redirect(new URL('/?subscribed=1', req.url))
  } catch (err) {
    console.error('Newsletter error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
