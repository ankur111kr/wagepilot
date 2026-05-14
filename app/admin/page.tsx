import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | WagePilot',
  robots: { index: false, follow: false },
}

async function getSession() {
  try {
    const supabase = createServiceClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch {
    return null
  }
}

export default async function AdminPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return <AdminDashboard />
}
