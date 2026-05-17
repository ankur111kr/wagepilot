'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setLoggedIn(true)
        setUserEmail(session.user.email || '')
      } else {
        window.location.href = '/admin/login'
      }
    } catch {
      window.location.href = '/admin/login'
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontFamily: 'system-ui' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!loggedIn) return null

  const tabs = [
    { id: 'overview', label: '📊 Overview', emoji: '📊' },
    { id: 'blog', label: '📝 Blog Posts', emoji: '📝' },
    { id: 'tax', label: '💰 Tax Data', emoji: '💰' },
    { id: 'seo', label: '🔍 SEO Pages', emoji: '🔍' },
    { id: 'subscribers', label: '📧 Subscribers', emoji: '📧' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>

      {/* Top bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 20px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>✈️</span>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#2563eb' }}>WagePilot Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>{userEmail}</span>
          <button onClick={handleLogout}
            style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', color: '#dc2626', cursor: 'pointer' }}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>

        {/* Sidebar */}
        <div style={{ width: '200px', background: 'white', borderRight: '1px solid #e2e8f0', padding: '16px 12px', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  width: '100%', padding: '10px 12px', borderRadius: '8px',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontSize: '13px', fontWeight: '600',
                  background: activeTab === tab.id ? '#eff6ff' : 'transparent',
                  color: activeTab === tab.id ? '#2563eb' : '#475569',
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick links */}
          <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Quick Links</p>
            {[
              { label: '🏠 Homepage', href: '/' },
              { label: '💰 Salary Calc', href: '/salary-calculator' },
              { label: '🇬🇧 UK Tax', href: '/uk-income-tax-calculator' },
            ].map(link => (
              <a key={link.href} href={link.href} target="_blank"
                style={{ display: 'block', fontSize: '12px', color: '#64748b', textDecoration: 'none', padding: '5px 0' }}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto' }}>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                Dashboard Overview
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {[
                  { label: 'Calculators', value: '10', color: '#3b82f6', bg: '#eff6ff' },
                  { label: 'SEO Pages', value: '51+', color: '#10b981', bg: '#f0fdf4' },
                  { label: 'US States', value: '51', color: '#8b5cf6', bg: '#f5f3ff' },
                  { label: 'Tax Years', value: '2', color: '#f59e0b', bg: '#fffbeb' },
                ].map(card => (
                  <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.color}30`, borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: card.color }}>{card.value}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{card.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { label: '📝 New Blog Post', tab: 'blog' },
                    { label: '💰 Update Tax Data', tab: 'tax' },
                    { label: '🔍 Add SEO Page', tab: 'seo' },
                    { label: '📧 View Subscribers', tab: 'subscribers' },
                  ].map(action => (
                    <button key={action.label} onClick={() => setActiveTab(action.tab)}
                      style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
                <p style={{ fontSize: '13px', color: '#166534', margin: 0, lineHeight: 1.6 }}>
                  ✅ <strong>Website is live!</strong> wagepilot.vercel.app is running with 2025/2026 tax data.
                  All calculators are active and AdSense slots are ready.
                </p>
              </div>
            </div>
          )}

          {/* Blog */}
          {activeTab === 'blog' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Blog Posts</h2>
                <button style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  + New Post
                </button>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', display: 'grid', gridTemplateColumns: '1fr auto auto' }}>
                  <span>Title</span><span>Category</span><span>Date</span>
                </div>
                <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                  📝 Connect Supabase to manage blog posts here.
                </div>
              </div>
            </div>
          )}

          {/* Tax Data */}
          {activeTab === 'tax' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>Tax Data Management</h2>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', color: '#92400e', margin: 0, lineHeight: 1.6 }}>
                  ⚠️ <strong>How to update:</strong> Replace JSON files in <code style={{ background: '#fef3c7', padding: '1px 6px', borderRadius: '4px' }}>/data/tax/us/</code> or <code style={{ background: '#fef3c7', padding: '1px 6px', borderRadius: '4px' }}>/data/tax/uk/</code> via GitHub. No code changes needed.
                </p>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {[
                  { label: 'US Tax Data 2025', file: '/data/tax/us/2025.json', status: 'Active', color: '#10b981' },
                  { label: 'US Tax Data 2024', file: '/data/tax/us/2024.json', status: 'Archive', color: '#94a3b8' },
                  { label: 'UK Tax Data 2025/26', file: '/data/tax/uk/2025.json', status: 'Active', color: '#10b981' },
                  { label: 'UK Tax Data 2024/25', file: '/data/tax/uk/2024.json', status: 'Archive', color: '#94a3b8' },
                ].map(item => (
                  <div key={item.file} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{item.label}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>{item.file}</div>
                    </div>
                    <span style={{ background: item.color + '20', color: item.color, borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: '700' }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>SEO Pages</h2>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', color: '#1d4ed8', margin: 0, lineHeight: 1.6 }}>
                  🔍 <strong>51 state pages</strong> are auto-generated from the dynamic route <code style={{ background: '#dbeafe', padding: '1px 6px', borderRadius: '4px' }}>/[state]-salary-calculator</code>. All live automatically!
                </p>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>Auto-Generated State Pages</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['CA','TX','NY','FL','IL','WA','NV','CO','AZ','GA','PA','OH','NC','VA','MA','IN','TN','WI','MO','MD','MN','OR','NJ','MI','WY','SD','TN','AK','HI','MT'].map(s => (
                    <span key={s} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '3px 8px', fontSize: '12px', color: '#2563eb', fontFamily: 'monospace', fontWeight: '700' }}>{s}</span>
                  ))}
                  <span style={{ fontSize: '12px', color: '#94a3b8', padding: '3px 8px' }}>+ 21 more...</span>
                </div>
              </div>
            </div>
          )}

          {/* Subscribers */}
          {activeTab === 'subscribers' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>Newsletter Subscribers</h2>
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', display: 'grid', gridTemplateColumns: '1fr auto auto' }}>
                  <span>Email</span><span>Date</span><span>Status</span>
                </div>
                <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                  📧 Subscribers will appear here once people sign up via the newsletter form.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
