import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export async function POST(req: NextRequest) {
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {auth:{persistSession:false}})
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({error:'Invalid email'},{status:400})
    const { error } = await sb.from('newsletter_subscribers').upsert({email:email.trim().toLowerCase(),subscribed_at:new Date().toISOString(),confirmed:false,source:'homepage',created_at:new Date().toISOString()},{onConflict:'email'})
    if (error) return NextResponse.json({error:error.message},{status:500})
    return NextResponse.json({success:true})
  } catch(e:any) { return NextResponse.json({error:'Server error'},{status:500}) }
}
