'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Use service role for admin - must be set in env
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Tab = 'overview' | 'blog' | 'tax' | 'seo' | 'subscribers' | 'contacts' | 'faqs'

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  published_at: string
  featured: boolean
  author_name: string
  read_time: number
}

interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  confirmed: boolean
  source: string
}

interface ContactMsg {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  replied: boolean
}

interface NewPost {
  title: string
  slug: string
  description: string
  content: string
  category: string
  author_name: string
  read_time: number
  featured: boolean
  tags: string
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  // Blog
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [showNewPost, setShowNewPost] = useState(false)
  const [editPost, setEditPost] = useState<BlogPost | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [newPost, setNewPost] = useState<NewPost>({
    title: '', slug: '', description: '', content: '',
    category: 'tax-guides', author_name: 'WagePilot Team',
    read_time: 5, featured: false, tags: ''
  })

  // Subscribers
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])

  // Contacts
  const [contacts, setContacts] = useState<ContactMsg[]>([])

  // FAQs
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([
    { q: 'How accurate are the calculators?', a: 'We use official IRS and HMRC tax data updated annually.' },
    { q: 'Is my data stored?', a: 'No. All calculations happen in your browser.' },
  ])
  const [newFaq, setNewFaq] = useState({ q: '', a: '' })

  useEffect(() => { checkSession() }, [])

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setLoggedIn(true)
        setUserEmail(session.user.email || '')
        await Promise.all([fetchPosts(), fetchSubscribers(), fetchContacts()])
      } else {
        window.location.href = '/admin/login'
      }
    } catch {
      window.location.href = '/admin/login'
    } finally {
      setLoading(false)
    }
  }

  async function fetchPosts() {
    const { data, error } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false })
    if (data) setPosts(data)
    if (error) console.error('Posts error:', error)
  }

  async function fetchSubscribers() {
    const { data } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false })
    if (data) setSubscribers(data)
  }

  async function fetchContacts() {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    if (data) setContacts(data)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }

  async function handleSavePost() {
    if (!newPost.title || !newPost.description || !newPost.content) {
      setMsg('❌ Title, Description aur Content required hain!')
      return
    }
    setSaving(true)
    setMsg('')
    const slug = newPost.slug || generateSlug(newPost.title)
    const tagsArr = newPost.tags ? newPost.tags.split(',').map(t => t.trim()).filter(Boolean) : []

    const { error } = await supabase.from('blog_posts').insert({
      title: newPost.title,
      slug,
      description: newPost.description,
      content: newPost.content,
      category: newPost.category,
      author_name: newPost.author_name,
      read_time: newPost.read_time,
      featured: newPost.featured,
      tags: tagsArr,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })

    if (error) {
      setMsg('❌ Error: ' + error.message + ' | Code: ' + error.code)
    } else {
      setMsg('✅ Post published!')
      setNewPost({ title: '', slug: '', description: '', content: '', category: 'tax-guides', author_name: 'WagePilot Team', read_time: 5, featured: false, tags: '' })
      setShowNewPost(false)
      fetchPosts()
    }
    setSaving(false)
  }

  async function handleDeletePost(id: string) {
    if (!confirm('Is post ko delete karna chahte ho?')) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) setMsg('❌ Delete error: ' + error.message)
    else { setMsg('✅ Post deleted!'); fetchPosts() }
  }

  async function handleMarkReplied(id: string, replied: boolean) {
    await supabase.from('contact_messages').update({ replied: !replied }).eq('id', id)
    fetchContacts()
  }

  async function handleDeleteSubscriber(id: string) {
    if (!confirm('Remove this subscriber?')) return
    await supabase.from('newsletter_subscribers').delete().eq('id', id)
    fetchSubscribers()
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
        <p style={{ color: '#64748b' }}>Loading admin panel...</p>
      </div>
    </div>
  )

  if (!loggedIn) return null

  const inp = {
    width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px',
    padding: '10px 12px', fontSize: '14px', color: '#0f172a',
    outline: 'none', background: 'white', boxSizing: 'border-box' as const, fontFamily: 'system-ui'
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'blog', label: '📝 Blog', count: posts.length },
    { id: 'tax', label: '💰 Tax Data' },
    { id: 'seo', label: '🔍 SEO Pages' },
    { id: 'subscribers', label: '📧 Subscribers', count: subscribers.length },
    { id: 'contacts', label: '💬 Messages', count: contacts.filter(c => !c.replied).length },
    { id: 'faqs', label: '❓ FAQs', count: faqs.length },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>

      {/* Top bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 20px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💰</div>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>WagePilot <span style={{ color: '#2563eb' }}>Admin</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{userEmail}</span>
          <a href="/" target="_blank" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>🌐 View Site</a>
          <button onClick={handleLogout} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', color: '#dc2626', cursor: 'pointer' }}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>

        {/* Sidebar */}
        <div style={{ width: '210px', background: 'white', borderRight: '1px solid #e2e8f0', padding: '16px 12px', flexShrink: 0, position: 'sticky', top: '56px', height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', marginTop: '4px', paddingLeft: '8px' }}>MENU</p>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowNewPost(false); setMsg('') }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: '600', background: activeTab === tab.id ? '#eff6ff' : 'transparent', color: activeTab === tab.id ? '#2563eb' : '#475569', marginBottom: '2px' }}>
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span style={{ background: activeTab === tab.id ? '#2563eb' : '#e2e8f0', color: activeTab === tab.id ? 'white' : '#64748b', borderRadius: '999px', padding: '1px 7px', fontSize: '11px', fontWeight: '700' }}>{tab.count}</span>
              )}
            </button>
          ))}

          <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', paddingLeft: '8px' }}>QUICK LINKS</p>
            {[
              { label: '🏠 Homepage', href: '/' },
              { label: '💰 Salary Calc', href: '/salary-calculator' },
              { label: '🇬🇧 UK Tax', href: '/uk-income-tax-calculator' },
              { label: '📊 Compare', href: '/salary-comparison' },
              { label: '📝 Blog', href: '/blog' },
            ].map(link => (
              <a key={link.href} href={link.href} target="_blank" style={{ display: 'block', fontSize: '12px', color: '#64748b', textDecoration: 'none', padding: '5px 8px', borderRadius: '6px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto' }}>

          {/* Global message */}
          {msg && (
            <div style={{ background: msg.includes('✅') ? '#f0fdf4' : '#fef2f2', border: `1px solid ${msg.includes('✅') ? '#bbf7d0' : '#fecaca'}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', color: msg.includes('✅') ? '#166534' : '#dc2626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{msg}</span>
              <button onClick={() => setMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#94a3b8' }}>✕</button>
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>📊 Dashboard Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Blog Posts', value: posts.length, color: '#3b82f6', bg: '#eff6ff', tab: 'blog' as Tab },
                  { label: 'Subscribers', value: subscribers.length, color: '#10b981', bg: '#f0fdf4', tab: 'subscribers' as Tab },
                  { label: 'Messages', value: contacts.length, color: '#8b5cf6', bg: '#f5f3ff', tab: 'contacts' as Tab },
                  { label: 'Unread Msgs', value: contacts.filter(c => !c.replied).length, color: '#ef4444', bg: '#fef2f2', tab: 'contacts' as Tab },
                  { label: 'Calculators', value: 10, color: '#f59e0b', bg: '#fffbeb', tab: 'seo' as Tab },
                  { label: 'SEO Pages', value: '51+', color: '#06b6d4', bg: '#ecfeff', tab: 'seo' as Tab },
                ].map(card => (
                  <button key={card.label} onClick={() => setActiveTab(card.tab)}
                    style={{ background: card.bg, border: `1px solid ${card.color}30`, borderRadius: '12px', padding: '16px', textAlign: 'left', cursor: 'pointer' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: card.color }}>{card.value}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{card.label}</div>
                  </button>
                ))}
              </div>

              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>⚡ Quick Actions</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { label: '📝 New Blog Post', action: () => { setActiveTab('blog'); setShowNewPost(true) } },
                    { label: '📧 View Subscribers', action: () => setActiveTab('subscribers') },
                    { label: '💬 View Messages', action: () => setActiveTab('contacts') },
                    { label: '❓ Edit FAQs', action: () => setActiveTab('faqs') },
                    { label: '💰 Tax Data', action: () => setActiveTab('tax') },
                  ].map(action => (
                    <button key={action.label} onClick={action.action}
                      style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#166534', marginBottom: '8px' }}>✅ Website Status</h4>
                  <p style={{ fontSize: '12px', color: '#15803d', margin: 0, lineHeight: 1.7 }}>
                    🟢 wagepilot.vercel.app — Live<br />
                    🟢 Supabase — Connected<br />
                    🟢 2025/26 Tax Data — Active<br />
                    🟢 All Calculators — Running
                  </p>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#92400e', marginBottom: '8px' }}>📌 Recent Activity</h4>
                  {posts.slice(0, 3).map(p => (
                    <p key={p.id} style={{ fontSize: '12px', color: '#78350f', margin: '0 0 4px' }}>📝 {p.title.slice(0, 35)}...</p>
                  ))}
                  {posts.length === 0 && <p style={{ fontSize: '12px', color: '#78350f', margin: 0 }}>No blog posts yet</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── BLOG ── */}
          {activeTab === 'blog' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>📝 Blog Posts ({posts.length})</h2>
                <button onClick={() => { setShowNewPost(!showNewPost); setEditPost(null); setMsg('') }}
                  style={{ background: showNewPost ? '#64748b' : '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                  {showNewPost ? '✕ Cancel' : '+ New Post'}
                </button>
              </div>

              {/* New Post Form */}
              {showNewPost && (
                <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginTop: 0, marginBottom: '20px' }}>📝 Create New Post</h3>
                  <div style={{ display: 'grid', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Title *</label>
                      <input value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value, slug: generateSlug(e.target.value) })}
                        placeholder="e.g. How Much Tax on $100k Salary?" style={inp} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>URL Slug (auto)</label>
                      <input value={newPost.slug} onChange={e => setNewPost({ ...newPost, slug: e.target.value })}
                        placeholder="auto-generated-from-title" style={{ ...inp, background: '#f8fafc', color: '#64748b' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description * (SEO)</label>
                      <input value={newPost.description} onChange={e => setNewPost({ ...newPost, description: e.target.value })}
                        placeholder="Short description for search engines..." style={inp} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</label>
                        <select value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })} style={inp}>
                          <option value="tax-guides">Tax Guides</option>
                          <option value="salary-guides">Salary Guides</option>
                          <option value="overtime-laws">Overtime Laws</option>
                          <option value="cost-of-living">Cost of Living</option>
                          <option value="financial-planning">Financial Planning</option>
                          <option value="uk-paye">UK PAYE</option>
                          <option value="irs-updates">IRS Updates</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Author</label>
                        <input value={newPost.author_name} onChange={e => setNewPost({ ...newPost, author_name: e.target.value })}
                          placeholder="WagePilot Team" style={inp} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Read (min)</label>
                        <input type="number" value={newPost.read_time} min={1} max={60}
                          onChange={e => setNewPost({ ...newPost, read_time: Number(e.target.value) })} style={inp} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tags (comma separated)</label>
                      <input value={newPost.tags} onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
                        placeholder="taxes, 2026, IRS, salary" style={inp} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Content * (HTML supported)</label>
                      <textarea value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                        placeholder={'<h2>Introduction</h2>\n<p>Your article content here...</p>\n<h2>Section 2</h2>\n<p>More content...</p>'}
                        rows={12} style={{ ...inp, resize: 'vertical' }} />
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0' }}>
                        HTML tags: &lt;h2&gt; &lt;h3&gt; &lt;p&gt; &lt;ul&gt; &lt;li&gt; &lt;strong&gt; &lt;em&gt; &lt;a href=""&gt;
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" id="featured" checked={newPost.featured}
                        onChange={e => setNewPost({ ...newPost, featured: e.target.checked })}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2563eb' }} />
                      <label htmlFor="featured" style={{ fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>⭐ Mark as Featured Post</label>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                      <button onClick={handleSavePost} disabled={saving}
                        style={{ background: saving ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #06b6d4)', color: 'white', border: 'none', borderRadius: '10px', padding: '13px 0', fontSize: '15px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', flex: 1 }}>
                        {saving ? '⏳ Publishing...' : '🚀 Publish Post'}
                      </button>
                      <button onClick={() => { setShowNewPost(false); setMsg('') }}
                        style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '10px', padding: '13px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Posts list */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 80px 60px', gap: '8px', padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  <span>Title</span><span>Category</span><span>Author</span><span>Date</span><span>Action</span>
                </div>
                {posts.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>📝</div>
                    <p>No posts yet. Create your first blog post!</p>
                  </div>
                ) : posts.map(post => (
                  <div key={post.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 80px 60px', gap: '8px', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{post.featured && '⭐ '}{post.title}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>/{post.slug}</div>
                    </div>
                    <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', borderRadius: '6px', padding: '2px 8px', fontWeight: '600' }}>{post.category}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{post.author_name}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(post.published_at).toLocaleDateString('en-IN')}</span>
                    <button onClick={() => handleDeletePost(post.id)}
                      style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '4px 8px', fontSize: '14px', color: '#dc2626', cursor: 'pointer' }}>
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAX DATA ── */}
          {activeTab === 'tax' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>💰 Tax Data Management</h2>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#92400e', marginBottom: '6px' }}>📋 Tax Data Update Karne Ka Tarika:</h4>
                <ol style={{ fontSize: '13px', color: '#78350f', margin: 0, paddingLeft: '20px', lineHeight: 2 }}>
                  <li>GitHub pe jao — <code style={{ background: '#fef3c7', padding: '1px 6px', borderRadius: '4px' }}>ankur111kr/wagepilot</code></li>
                  <li><code style={{ background: '#fef3c7', padding: '1px 6px', borderRadius: '4px' }}>data/tax/us/2025.json</code> ya UK file open karo</li>
                  <li>Tax brackets edit karo (pencil icon)</li>
                  <li>Commit karo → Vercel auto-deploy</li>
                </ol>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {[
                  { label: '🇺🇸 US Tax Data 2025', file: 'data/tax/us/2025.json', status: 'Active ✅', color: '#10b981', bg: '#f0fdf4' },
                  { label: '🇺🇸 US Tax Data 2024', file: 'data/tax/us/2024.json', status: 'Archive', color: '#94a3b8', bg: '#f8fafc' },
                  { label: '🇬🇧 UK Tax 2025/26', file: 'data/tax/uk/2025.json', status: 'Active ✅', color: '#10b981', bg: '#f0fdf4' },
                  { label: '🇬🇧 UK Tax 2024/25', file: 'data/tax/uk/2024.json', status: 'Archive', color: '#94a3b8', bg: '#f8fafc' },
                ].map(item => (
                  <div key={item.file} style={{ background: item.bg, border: `1px solid ${item.color}30`, borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{item.label}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>{item.file}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ background: item.color + '20', color: item.color, borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: '700' }}>{item.status}</span>
                      <a href={`https://github.com/ankur111kr/wagepilot/edit/main/${item.file}`} target="_blank"
                        style={{ background: '#2563eb', color: 'white', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>
                        ✏️ Edit
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SEO PAGES ── */}
          {activeTab === 'seo' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>🔍 SEO Pages</h2>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', color: '#1d4ed8', margin: 0, lineHeight: 1.7 }}>
                  ✅ <strong>51 state pages</strong> auto-generated from dynamic route.<br />
                  ✅ <strong>Sitemap</strong> with 150+ URLs auto-generated.<br />
                  ✅ <strong>Schema markup</strong> — FAQ, Calculator, Breadcrumb on every page.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {[
                  { title: '🇺🇸 US Calculator Pages', count: 51, links: ['/salary-calculator', '/overtime-calculator', '/contractor-calculator'] },
                  { title: '🇬🇧 UK Calculator Pages', count: 4, links: ['/uk-income-tax-calculator'] },
                  { title: '📊 Tool Pages', count: 10, links: ['/salary-comparison', '/savings-calculator', '/mortgage-affordability-calculator'] },
                  { title: '📝 Blog Pages', count: posts.length, links: ['/blog'] },
                ].map(section => (
                  <div key={section.title} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{section.title}</h4>
                      <span style={{ background: '#eff6ff', color: '#2563eb', borderRadius: '999px', padding: '1px 8px', fontSize: '12px', fontWeight: '700' }}>{section.count}</span>
                    </div>
                    {section.links.map(link => (
                      <a key={link} href={link} target="_blank" style={{ display: 'block', fontSize: '12px', color: '#3b82f6', textDecoration: 'none', padding: '3px 0' }}>{link}</a>
                    ))}
                  </div>
                ))}
              </div>

              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', marginTop: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>All State Pages</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware','florida','georgia','hawaii','idaho','illinois','indiana','iowa','kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan','minnesota','mississippi','missouri','montana','nebraska','nevada','new-hampshire','new-jersey','new-mexico','new-york','north-carolina','north-dakota','ohio','oklahoma','oregon','pennsylvania','rhode-island','south-carolina','south-dakota','tennessee','texas','utah','vermont','virginia','washington','west-virginia','wisconsin','wyoming','washington-dc'].map(s => (
                    <a key={s} href={`/${s}-salary-calculator`} target="_blank"
                      style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', color: '#16a34a', textDecoration: 'none', fontWeight: '600', textTransform: 'capitalize' }}>
                      {s.replace(/-/g, ' ')}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SUBSCRIBERS ── */}
          {activeTab === 'subscribers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>📧 Subscribers ({subscribers.length})</h2>
                <button onClick={fetchSubscribers} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>
                  🔄 Refresh
                </button>
              </div>
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 80px 50px', gap: '8px', padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  <span>Email</span><span>Subscribed</span><span>Source</span><span>Del</span>
                </div>
                {subscribers.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>📧</div>
                    <p>No subscribers yet. Share your website!</p>
                  </div>
                ) : subscribers.map(sub => (
                  <div key={sub.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 80px 50px', gap: '8px', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{sub.email}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{new Date(sub.subscribed_at).toLocaleDateString('en-IN')}</span>
                    <span style={{ fontSize: '11px', background: '#f1f5f9', borderRadius: '6px', padding: '2px 8px', color: '#64748b', fontWeight: '600', textAlign: 'center' }}>{sub.source || 'web'}</span>
                    <button onClick={() => handleDeleteSubscriber(sub.id)}
                      style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '4px 8px', fontSize: '14px', color: '#dc2626', cursor: 'pointer' }}>
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CONTACTS ── */}
          {activeTab === 'contacts' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  💬 Messages ({contacts.length})
                  {contacts.filter(c => !c.replied).length > 0 && (
                    <span style={{ background: '#ef4444', color: 'white', borderRadius: '999px', padding: '2px 8px', fontSize: '12px', fontWeight: '700', marginLeft: '8px' }}>
                      {contacts.filter(c => !c.replied).length} new
                    </span>
                  )}
                </h2>
                <button onClick={fetchContacts} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>
                  🔄 Refresh
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {contacts.length === 0 ? (
                  <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>💬</div>
                    <p>No messages yet.</p>
                  </div>
                ) : contacts.map(contact => (
                  <div key={contact.id} style={{ background: 'white', borderRadius: '12px', border: `1px solid ${contact.replied ? '#e2e8f0' : '#bfdbfe'}`, padding: '16px', boxShadow: contact.replied ? 'none' : '0 2px 8px rgba(59,130,246,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{contact.name}</span>
                        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>{contact.email}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(contact.created_at).toLocaleDateString('en-IN')}</span>
                        <button onClick={() => handleMarkReplied(contact.id, contact.replied)}
                          style={{ background: contact.replied ? '#f0fdf4' : '#eff6ff', border: `1px solid ${contact.replied ? '#bbf7d0' : '#bfdbfe'}`, borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: '600', color: contact.replied ? '#16a34a' : '#2563eb', cursor: 'pointer' }}>
                          {contact.replied ? '✅ Replied' : '📌 Mark Replied'}
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>📋 {contact.subject}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, background: '#f8fafc', borderRadius: '8px', padding: '10px' }}>{contact.message}</div>
                    <div style={{ marginTop: '10px' }}>
                      <a href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#2563eb', color: 'white', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>
                        📧 Reply via Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FAQs ── */}
          {activeTab === 'faqs' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>❓ FAQ Management</h2>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
                <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                  ℹ️ FAQ changes yahan preview hote hain. Production mein apply karne ke liye <code style={{ background: '#fef3c7', padding: '1px 4px', borderRadius: '4px' }}>app/faq/page.tsx</code> ko GitHub pe update karo.
                </p>
              </div>

              {/* Add new FAQ */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>+ Add New FAQ</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '5px' }}>Question</label>
                    <input value={newFaq.q} onChange={e => setNewFaq({ ...newFaq, q: e.target.value })}
                      placeholder="e.g. How accurate is the calculator?" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '5px' }}>Answer</label>
                    <textarea value={newFaq.a} onChange={e => setNewFaq({ ...newFaq, a: e.target.value })}
                      placeholder="Write a clear, helpful answer..." rows={3} style={{ ...inp, resize: 'vertical' }} />
                  </div>
                  <button onClick={() => {
                    if (newFaq.q && newFaq.a) {
                      setFaqs([...faqs, newFaq])
                      setNewFaq({ q: '', a: '' })
                      setMsg('✅ FAQ added! Update faq/page.tsx on GitHub to make it live.')
                    }
                  }} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                    + Add FAQ
                  </button>
                </div>
              </div>

              {/* FAQ List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Q: {faq.q}</div>
                        <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>A: {faq.a}</div>
                      </div>
                      <button onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}
                        style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '4px 8px', fontSize: '14px', color: '#dc2626', cursor: 'pointer', flexShrink: 0 }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
// FAQ management is already included in the admin panel above
