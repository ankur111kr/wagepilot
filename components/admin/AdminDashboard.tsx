'use client'

import { useState } from 'react'
import { FileText, Settings, BarChart2, Users, Tag, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const NAV = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'blog', label: 'Blog Posts', icon: FileText },
  { id: 'seo', label: 'SEO Pages', icon: Tag },
  { id: 'subscribers', label: 'Subscribers', icon: Users },
  { id: 'tax', label: 'Tax Data', icon: Settings },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-border bg-card p-4 flex flex-col">
        <div className="mb-6 px-2">
          <h1 className="font-sora text-base font-bold">WagePilot Admin</h1>
          <p className="text-xs text-muted-foreground">Content Management</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}>
              <item.icon className="h-4 w-4" />{item.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'blog' && <BlogTab />}
        {activeTab === 'tax' && <TaxDataTab />}
        {activeTab === 'seo' && <SEOTab />}
        {activeTab === 'subscribers' && <SubscribersTab />}
      </main>
    </div>
  )
}

function OverviewTab() {
  return (
    <div>
      <h2 className="mb-6 font-sora text-2xl font-bold">Overview</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Blog Posts', value: '—', color: 'text-blue-500' },
          { label: 'SEO Pages', value: '51', color: 'text-emerald-500' },
          { label: 'Subscribers', value: '—', color: 'text-amber-500' },
          { label: 'Messages', value: '—', color: 'text-violet-500' },
        ].map(card => (
          <div key={card.label} className="wp-card p-5">
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className={`mt-1 font-sora text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-2 font-semibold">Quick Actions</h3>
        <div className="flex flex-wrap gap-3 mt-3">
          {['New Blog Post', 'Update Tax Data', 'Add SEO Page', 'View Subscribers'].map(action => (
            <button key={action}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function BlogTab() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-sora text-2xl font-bold">Blog Posts</h2>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          + New Post
        </button>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Title</span><span>Category</span><span>Date</span><span>Actions</span>
        </div>
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">
          Connect your Supabase database to manage blog posts here.
        </p>
      </div>
    </div>
  )
}

function TaxDataTab() {
  return (
    <div>
      <h2 className="mb-6 font-sora text-2xl font-bold">Tax Data Management</h2>
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 mb-6">
        <p className="text-sm text-amber-700 dark:text-amber-400">
          <strong>How to update tax data:</strong> Replace the JSON files in{' '}
          <code className="rounded bg-amber-500/10 px-1">/data/tax/us/</code> or{' '}
          <code className="rounded bg-amber-500/10 px-1">/data/tax/uk/</code> with updated year files.
          No code changes needed — the app reads them dynamically.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: 'US Tax Data 2025', file: '/data/tax/us/2025.json', status: 'Active' },
          { label: 'US Tax Data 2024', file: '/data/tax/us/2024.json', status: 'Archive' },
          { label: 'UK Tax Data 2025/26', file: '/data/tax/uk/2025.json', status: 'Active' },
          { label: 'UK Tax Data 2024/25', file: '/data/tax/uk/2024.json', status: 'Archive' },
        ].map(item => (
          <div key={item.file} className="wp-card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground font-mono">{item.file}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
            }`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SEOTab() {
  return (
    <div>
      <h2 className="mb-6 font-sora text-2xl font-bold">SEO Pages</h2>
      <p className="text-sm text-muted-foreground mb-4">
        State and region-specific pages are generated programmatically from the route
        <code className="mx-1 rounded bg-muted px-1">/[state]-salary-calculator</code>.
        All 51 state pages (50 states + DC) are automatically live.
      </p>
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm font-medium mb-3">Auto-generated pages</p>
        <div className="flex flex-wrap gap-1.5">
          {['CA','TX','NY','FL','IL','WA','NV','CO','AZ','GA','PA','OH','NC','VA','MA','IN','TN','WI','MO','MD'].map(s => (
            <span key={s} className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary">{s}</span>
          ))}
          <span className="text-xs text-muted-foreground">+ 31 more…</span>
        </div>
      </div>
    </div>
  )
}

function SubscribersTab() {
  return (
    <div>
      <h2 className="mb-6 font-sora text-2xl font-bold">Newsletter Subscribers</h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground grid grid-cols-3 gap-4">
          <span>Email</span><span>Date Subscribed</span><span>Status</span>
        </div>
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">
          Connect your Supabase database to view subscribers here.
        </p>
      </div>
    </div>
  )
}
