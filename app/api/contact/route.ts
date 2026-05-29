import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export async function POST(req: NextRequest) {
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {auth:{persistSession:false}})
    const { name, email, subject, message } = await req.json()
    if (!name || !email || !message) return NextResponse.json({error:'Required fields missing'},{status:400})
    const { error } = await sb.from('contact_messages').insert({name:name.trim(),email:email.trim().toLowerCase(),subject:subject||'General Enquiry',message:message.trim(),created_at:new Date().toISOString(),replied:false})
    if (error) return NextResponse.json({error:error.message},{status:500})
    return NextResponse.json({success:true})
  } catch(e:any) { return NextResponse.json({error:'Server error'},{status:500}) }
}
