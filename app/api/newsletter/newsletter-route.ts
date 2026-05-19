import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    let email = ''

    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await req.json()
      email = body.email?.toString().trim().toLowerCase()
    } else {
      const body = await req.formData()
      email = body.get('email')?.toString().trim().toLowerCase() || ''
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email,
          subscribed_at: new Date().toISOString(),
          confirmed: false,
          source: 'homepage',
          created_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )

    if (error) {
      console.error('Newsletter error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If form submission, redirect back
    const referer = req.headers.get('referer') || '/'
    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(new URL('/?subscribed=1', req.url))
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch (err: any) {
    console.error('Newsletter route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
