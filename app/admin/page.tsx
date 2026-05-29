'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

type Tab = 'overview'|'blog'|'faqs'|'subscribers'|'contacts'|'tax'|'seo'

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [tab, setTab] = useState<Tab>('overview')
  const [msg, setMsg] = useState('')

  // Blog
  const [posts, setPosts] = useState<any[]>([])
  const [showNewPost, setShowNewPost] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newPost, setNewPost] = useState({title:'',slug:'',description:'',content:'',category:'tax-guides',author_name:'WagePilot Team',read_time:5,featured:false,show_on_homepage:false,tags:''})

  // FAQs
  const [faqs, setFaqs] = useState<any[]>([])
  const [showNewFaq, setShowNewFaq] = useState(false)
  const [newFaq, setNewFaq] = useState({question:'',answer:'',sort_order:0,show_on_homepage:true,show_on_faq_page:true})

  // Subscribers & Contacts
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])

  useEffect(() => { checkSession() }, [])

  async function checkSession() {
    try {
      const { data: { session } } = await sb.auth.getSession()
      if (session?.user) { setLoggedIn(true); setEmail(session.user.email||''); loadAll() }
      else window.location.href = '/admin/login'
    } catch { window.location.href = '/admin/login' }
    finally { setLoading(false) }
  }

  async function loadAll() {
    const [p, f, s, c] = await Promise.all([
      sb.from('blog_posts').select('*').order('published_at',{ascending:false}),
      sb.from('faqs').select('*').order('sort_order',{ascending:true}),
      sb.from('newsletter_subscribers').select('*').order('subscribed_at',{ascending:false}),
      sb.from('contact_messages').select('*').order('created_at',{ascending:false}),
    ])
    if (p.data) setPosts(p.data)
    if (f.data) setFaqs(f.data)
    if (s.data) setSubscribers(s.data)
    if (c.data) setContacts(c.data)
  }

  async function logout() { await sb.auth.signOut(); window.location.href = '/admin/login' }

  function slug(t: string) { return t.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').trim() }

  async function savePost() {
    if (!newPost.title || !newPost.description || !newPost.content) { setMsg('❌ Title, Description & Content required'); return }
    setSaving(true); setMsg('')
    const { error } = await sb.from('blog_posts').insert({
      ...newPost,
      slug: newPost.slug || slug(newPost.title),
      tags: newPost.tags ? newPost.tags.split(',').map(t=>t.trim()) : [],
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })
    if (error) setMsg('❌ ' + error.message)
    else { setMsg('✅ Post published!'); setShowNewPost(false); setNewPost({title:'',slug:'',description:'',content:'',category:'tax-guides',author_name:'WagePilot Team',read_time:5,featured:false,show_on_homepage:false,tags:''}); loadAll() }
    setSaving(false)
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    const { error } = await sb.from('blog_posts').delete().eq('id', id)
    if (error) setMsg('❌ ' + error.message)
    else { setMsg('✅ Deleted!'); loadAll() }
  }

  async function togglePostHomepage(id: string, current: boolean) {
    const { error } = await sb.from('blog_posts').update({show_on_homepage: !current}).eq('id', id)
    if (!error) loadAll()
    else setMsg('❌ ' + error.message)
  }

  async function saveFaq() {
    if (!newFaq.question || !newFaq.answer) { setMsg('❌ Question & Answer required'); return }
    const { error } = await sb.from('faqs').insert({...newFaq, active: true, created_at: new Date().toISOString()})
    if (error) setMsg('❌ ' + error.message)
    else { setMsg('✅ FAQ added!'); setShowNewFaq(false); setNewFaq({question:'',answer:'',sort_order:0,show_on_homepage:true,show_on_faq_page:true}); loadAll() }
  }

  async function deleteFaq(id: string) {
    if (!confirm('Delete this FAQ?')) return
    const { error } = await sb.from('faqs').delete().eq('id', id)
    if (!error) { setMsg('✅ FAQ deleted!'); loadAll() }
  }

  async function toggleFaq(id: string, field: 'show_on_homepage'|'show_on_faq_page', current: boolean) {
    await sb.from('faqs').update({[field]: !current}).eq('id', id)
    loadAll()
  }

  async function deleteSubscriber(id: string) {
    if (!confirm('Remove subscriber?')) return
    await sb.from('newsletter_subscribers').delete().eq('id', id); loadAll()
  }

  async function markReplied(id: string, v: boolean) {
    await sb.from('contact_messages').update({replied: !v}).eq('id', id); loadAll()
  }

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f1f5f9',fontFamily:'system-ui'}}><div style={{textAlign:'center'}}><div style={{fontSize:'48px',marginBottom:'16px'}}>💰</div><p style={{color:'#64748b'}}>Loading...</p></div></div>
  if (!loggedIn) return null

  const inp = {width:'100%',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'10px 12px',fontSize:'14px',color:'#0f172a',outline:'none',background:'white',boxSizing:'border-box' as const,fontFamily:'system-ui'}
  const tabs: {id:Tab,label:string,count?:number}[] = [
    {id:'overview',label:'📊 Overview'},
    {id:'blog',label:'📝 Blog',count:posts.length},
    {id:'faqs',label:'❓ FAQs',count:faqs.length},
    {id:'subscribers',label:'📧 Subscribers',count:subscribers.length},
    {id:'contacts',label:'💬 Messages',count:contacts.filter(c=>!c.replied).length},
    {id:'tax',label:'💰 Tax Data'},
    {id:'seo',label:'🔍 SEO'},
  ]

  return (
    <div style={{minHeight:'100vh',background:'#f1f5f9',fontFamily:'system-ui,sans-serif'}}>
      {/* Topbar */}
      <div style={{background:'white',borderBottom:'1px solid #e2e8f0',padding:'0 20px',height:'56px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50,boxShadow:'0 1px 8px rgba(0,0,0,0.06)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'32px',height:'32px',background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>💰</div>
          <span style={{fontSize:'16px',fontWeight:'800',color:'#0f172a'}}>WagePilot <span style={{color:'#2563eb'}}>Admin</span></span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <span style={{fontSize:'12px',color:'#94a3b8'}}>{email}</span>
          <a href="/" target="_blank" style={{fontSize:'12px',color:'#2563eb',textDecoration:'none',fontWeight:'600'}}>🌐 View Site</a>
          <button onClick={logout} style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'8px',padding:'6px 14px',fontSize:'13px',fontWeight:'600',color:'#dc2626',cursor:'pointer'}}>🚪 Logout</button>
        </div>
      </div>

      <div style={{display:'flex',minHeight:'calc(100vh - 56px)'}}>
        {/* Sidebar */}
        <div style={{width:'210px',background:'white',borderRight:'1px solid #e2e8f0',padding:'16px 12px',flexShrink:0}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setMsg('')}}
              style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',padding:'10px 12px',borderRadius:'8px',border:'none',cursor:'pointer',textAlign:'left',fontSize:'13px',fontWeight:'600',background:tab===t.id?'#eff6ff':'transparent',color:tab===t.id?'#2563eb':'#475569',marginBottom:'2px'}}>
              <span>{t.label}</span>
              {t.count !== undefined && t.count > 0 && <span style={{background:tab===t.id?'#2563eb':'#e2e8f0',color:tab===t.id?'white':'#64748b',borderRadius:'999px',padding:'1px 7px',fontSize:'11px',fontWeight:'700'}}>{t.count}</span>}
            </button>
          ))}
          <div style={{marginTop:'20px',borderTop:'1px solid #e2e8f0',paddingTop:'16px'}}>
            <p style={{fontSize:'10px',fontWeight:'700',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px',paddingLeft:'8px'}}>QUICK LINKS</p>
            {[{l:'🏠 Homepage',h:'/'},{l:'💰 Salary Calc',h:'/salary-calculator'},{l:'🇬🇧 UK Tax',h:'/uk-income-tax-calculator'},{l:'📝 Blog',h:'/blog'}].map(l=>(
              <a key={l.h} href={l.h} target="_blank" style={{display:'block',fontSize:'12px',color:'#64748b',textDecoration:'none',padding:'5px 8px',borderRadius:'6px'}}>{l.l}</a>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{flex:1,padding:'24px 20px',overflowY:'auto'}}>
          {msg && (
            <div style={{background:msg.startsWith('✅')?'#f0fdf4':'#fef2f2',border:`1px solid ${msg.startsWith('✅')?'#bbf7d0':'#fecaca'}`,borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',fontSize:'14px',color:msg.startsWith('✅')?'#166534':'#dc2626',display:'flex',justifyContent:'space-between'}}>
              <span>{msg}</span>
              <button onClick={()=>setMsg('')} style={{background:'none',border:'none',cursor:'pointer',color:'#94a3b8',fontSize:'16px'}}>✕</button>
            </div>
          )}

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div>
              <h2 style={{fontSize:'1.4rem',fontWeight:'800',color:'#0f172a',marginBottom:'20px'}}>📊 Dashboard</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'12px',marginBottom:'20px'}}>
                {[{l:'Blog Posts',v:posts.length,c:'#3b82f6',bg:'#eff6ff',t:'blog'as Tab},{l:'Homepage Posts',v:posts.filter(p=>p.show_on_homepage).length,c:'#10b981',bg:'#f0fdf4',t:'blog'as Tab},{l:'Subscribers',v:subscribers.length,c:'#8b5cf6',bg:'#f5f3ff',t:'subscribers'as Tab},{l:'New Messages',v:contacts.filter(c=>!c.replied).length,c:'#ef4444',bg:'#fef2f2',t:'contacts'as Tab},{l:'Total FAQs',v:faqs.length,c:'#f59e0b',bg:'#fffbeb',t:'faqs'as Tab},{l:'SEO Pages',v:'51+',c:'#06b6d4',bg:'#ecfeff',t:'seo'as Tab}].map((card:any)=>(
                  <button key={card.l} onClick={()=>setTab(card.t)} style={{background:card.bg,border:`1px solid ${card.c}30`,borderRadius:'12px',padding:'16px',textAlign:'left',cursor:'pointer'}}>
                    <div style={{fontSize:'2rem',fontWeight:'900',color:card.c}}>{card.v}</div>
                    <div style={{fontSize:'12px',color:'#64748b',marginTop:'2px'}}>{card.l}</div>
                  </button>
                ))}
              </div>
              <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'12px',padding:'14px'}}>
                <p style={{fontSize:'13px',color:'#166534',margin:0}}>✅ <strong>Website live!</strong> wagepilot.vercel.app · Supabase connected · Latest tax data active</p>
              </div>
            </div>
          )}

          {/* BLOG */}
          {tab === 'blog' && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',flexWrap:'wrap',gap:'10px'}}>
                <h2 style={{fontSize:'1.4rem',fontWeight:'800',color:'#0f172a',margin:0}}>📝 Blog Posts ({posts.length})</h2>
                <button onClick={()=>{setShowNewPost(!showNewPost);setMsg('')}} style={{background:showNewPost?'#64748b':'#2563eb',color:'white',border:'none',borderRadius:'8px',padding:'10px 20px',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>
                  {showNewPost?'✕ Cancel':'+ New Post'}
                </button>
              </div>

              {showNewPost && (
                <div style={{background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',padding:'24px',marginBottom:'20px'}}>
                  <h3 style={{fontSize:'16px',fontWeight:'800',color:'#0f172a',marginTop:0,marginBottom:'20px'}}>✍️ Create New Post</h3>
                  <div style={{display:'grid',gap:'14px'}}>
                    <div>
                      <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Title *</label>
                      <input value={newPost.title} onChange={e=>setNewPost({...newPost,title:e.target.value,slug:slug(e.target.value)})} placeholder="e.g. How Much Tax on $100k Salary?" style={inp}/>
                    </div>
                    <div>
                      <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.04em'}}>URL Slug (auto)</label>
                      <input value={newPost.slug} onChange={e=>setNewPost({...newPost,slug:e.target.value})} style={{...inp,background:'#f8fafc',color:'#64748b'}}/>
                    </div>
                    <div>
                      <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Description * (SEO)</label>
                      <input value={newPost.description} onChange={e=>setNewPost({...newPost,description:e.target.value})} placeholder="Short SEO description..." style={inp}/>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'10px'}}>
                      <div>
                        <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Category</label>
                        <select value={newPost.category} onChange={e=>setNewPost({...newPost,category:e.target.value})} style={inp}>
                          {['tax-guides','salary-guides','overtime-laws','cost-of-living','financial-planning','uk-paye','irs-updates'].map(c=><option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Author</label>
                        <input value={newPost.author_name} onChange={e=>setNewPost({...newPost,author_name:e.target.value})} style={inp}/>
                      </div>
                      <div>
                        <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Read (min)</label>
                        <input type="number" value={newPost.read_time} onChange={e=>setNewPost({...newPost,read_time:Number(e.target.value)})} min={1} max={60} style={inp}/>
                      </div>
                    </div>
                    <div>
                      <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Tags (comma separated)</label>
                      <input value={newPost.tags} onChange={e=>setNewPost({...newPost,tags:e.target.value})} placeholder="taxes, 2026, IRS" style={inp}/>
                    </div>
                    <div>
                      <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Content * (HTML supported)</label>
                      <textarea value={newPost.content} onChange={e=>setNewPost({...newPost,content:e.target.value})} placeholder="<h2>Introduction</h2><p>Your content...</p>" rows={10} style={{...inp,resize:'vertical'}}/>
                    </div>
                    <div style={{display:'flex',gap:'20px',flexWrap:'wrap'}}>
                      {[{key:'featured',label:'⭐ Featured Post'},{key:'show_on_homepage',label:'🏠 Show on Homepage'}].map(opt=>(
                        <label key={opt.key} style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',fontSize:'13px',fontWeight:'600',color:'#374151'}}>
                          <input type="checkbox" checked={(newPost as any)[opt.key]} onChange={e=>setNewPost({...newPost,[opt.key]:e.target.checked})} style={{width:'16px',height:'16px',accentColor:'#2563eb'}}/>
                          {opt.label}
                        </label>
                      ))}
                    </div>
                    <div style={{display:'flex',gap:'10px',paddingTop:'8px'}}>
                      <button onClick={savePost} disabled={saving} style={{background:saving?'#94a3b8':'linear-gradient(135deg,#2563eb,#06b6d4)',color:'white',border:'none',borderRadius:'10px',padding:'13px 0',fontSize:'15px',fontWeight:'700',cursor:saving?'not-allowed':'pointer',flex:1}}>
                        {saving?'⏳ Publishing...':'🚀 Publish Post'}
                      </button>
                      <button onClick={()=>setShowNewPost(false)} style={{background:'#f1f5f9',border:'1px solid #e2e8f0',color:'#64748b',borderRadius:'10px',padding:'13px 20px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 90px 100px 80px 60px',gap:'8px',padding:'10px 16px',background:'#f8fafc',borderBottom:'1px solid #e2e8f0',fontSize:'11px',fontWeight:'700',color:'#64748b',textTransform:'uppercase'}}>
                  <span>Title</span><span style={{textAlign:'center'}}>Category</span><span style={{textAlign:'center'}}>Homepage</span><span style={{textAlign:'center'}}>Date</span><span style={{textAlign:'center'}}>Del</span>
                </div>
                {posts.length === 0 ? (
                  <div style={{padding:'40px',textAlign:'center',color:'#94a3b8'}}>No posts yet. Create your first post! ☝️</div>
                ) : posts.map(post=>(
                  <div key={post.id} style={{display:'grid',gridTemplateColumns:'1fr 90px 100px 80px 60px',gap:'8px',alignItems:'center',padding:'11px 16px',borderBottom:'1px solid #f1f5f9'}}>
                    <div>
                      <div style={{fontSize:'13px',fontWeight:'600',color:'#0f172a'}}>{post.featured&&'⭐ '}{post.title}</div>
                      <div style={{fontSize:'11px',color:'#94a3b8'}}>/{post.slug}</div>
                    </div>
                    <span style={{fontSize:'11px',background:'#eff6ff',color:'#2563eb',borderRadius:'6px',padding:'2px 6px',fontWeight:'600',textAlign:'center'}}>{post.category}</span>
                    <div style={{textAlign:'center'}}>
                      <button onClick={()=>togglePostHomepage(post.id, post.show_on_homepage)}
                        style={{background:post.show_on_homepage?'#f0fdf4':'#f8fafc',border:`1px solid ${post.show_on_homepage?'#bbf7d0':'#e2e8f0'}`,borderRadius:'6px',padding:'4px 10px',fontSize:'12px',fontWeight:'700',color:post.show_on_homepage?'#16a34a':'#94a3b8',cursor:'pointer'}}>
                        {post.show_on_homepage?'✅ Yes':'➕ Show'}
                      </button>
                    </div>
                    <span style={{fontSize:'11px',color:'#94a3b8',textAlign:'center'}}>{new Date(post.published_at).toLocaleDateString('en-IN')}</span>
                    <button onClick={()=>deletePost(post.id)} style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'6px',padding:'4px 8px',fontSize:'14px',color:'#dc2626',cursor:'pointer',textAlign:'center'}}>🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {tab === 'faqs' && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',flexWrap:'wrap',gap:'10px'}}>
                <h2 style={{fontSize:'1.4rem',fontWeight:'800',color:'#0f172a',margin:0}}>❓ FAQs ({faqs.length})</h2>
                <button onClick={()=>{setShowNewFaq(!showNewFaq);setMsg('')}} style={{background:showNewFaq?'#64748b':'#2563eb',color:'white',border:'none',borderRadius:'8px',padding:'10px 20px',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>
                  {showNewFaq?'✕ Cancel':'+ New FAQ'}
                </button>
              </div>

              {showNewFaq && (
                <div style={{background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',padding:'20px',marginBottom:'20px'}}>
                  <h3 style={{fontSize:'15px',fontWeight:'700',color:'#0f172a',marginTop:0,marginBottom:'14px'}}>Add New FAQ</h3>
                  <div style={{display:'grid',gap:'12px'}}>
                    <div>
                      <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Question *</label>
                      <input value={newFaq.question} onChange={e=>setNewFaq({...newFaq,question:e.target.value})} placeholder="e.g. How accurate is the calculator?" style={inp}/>
                    </div>
                    <div>
                      <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Answer *</label>
                      <textarea value={newFaq.answer} onChange={e=>setNewFaq({...newFaq,answer:e.target.value})} placeholder="Clear, helpful answer..." rows={3} style={{...inp,resize:'vertical'}}/>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'10px'}}>
                      <div>
                        <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Sort Order</label>
                        <input type="number" value={newFaq.sort_order} onChange={e=>setNewFaq({...newFaq,sort_order:Number(e.target.value)})} min={0} style={inp}/>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:'8px',justifyContent:'flex-end',paddingBottom:'2px'}}>
                        {[{key:'show_on_homepage',label:'🏠 Homepage'},{key:'show_on_faq_page',label:'📄 FAQ Page'}].map(opt=>(
                          <label key={opt.key} style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',fontSize:'13px',fontWeight:'600',color:'#374151'}}>
                            <input type="checkbox" checked={(newFaq as any)[opt.key]} onChange={e=>setNewFaq({...newFaq,[opt.key]:e.target.checked})} style={{width:'15px',height:'15px',accentColor:'#2563eb'}}/>
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <button onClick={saveFaq} style={{background:'#2563eb',color:'white',border:'none',borderRadius:'8px',padding:'10px',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>+ Add FAQ</button>
                  </div>
                </div>
              )}

              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                {faqs.length === 0 ? (
                  <div style={{background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'40px',textAlign:'center',color:'#94a3b8'}}>No FAQs yet. Add your first FAQ!</div>
                ) : faqs.map(faq=>(
                  <div key={faq.id} style={{background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'16px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px',marginBottom:'8px',flexWrap:'wrap'}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'14px',fontWeight:'700',color:'#0f172a',marginBottom:'4px'}}>Q: {faq.question}</div>
                        <div style={{fontSize:'13px',color:'#64748b',lineHeight:1.6}}>A: {faq.answer}</div>
                      </div>
                      <button onClick={()=>deleteFaq(faq.id)} style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'6px',padding:'4px 8px',fontSize:'14px',color:'#dc2626',cursor:'pointer',flexShrink:0}}>🗑️</button>
                    </div>
                    <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginTop:'10px'}}>
                      {[{field:'show_on_homepage' as const,label:'🏠 Homepage'},{field:'show_on_faq_page' as const,label:'📄 FAQ Page'}].map(opt=>(
                        <button key={opt.field} onClick={()=>toggleFaq(faq.id, opt.field, faq[opt.field])}
                          style={{background:faq[opt.field]?'#f0fdf4':'#f8fafc',border:`1px solid ${faq[opt.field]?'#bbf7d0':'#e2e8f0'}`,borderRadius:'6px',padding:'4px 10px',fontSize:'12px',fontWeight:'700',color:faq[opt.field]?'#16a34a':'#94a3b8',cursor:'pointer'}}>
                          {faq[opt.field]?`✅ ${opt.label}`:`➕ ${opt.label}`}
                        </button>
                      ))}
                      <span style={{fontSize:'11px',color:'#94a3b8',padding:'4px 8px'}}>Order: {faq.sort_order}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBSCRIBERS */}
          {tab === 'subscribers' && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                <h2 style={{fontSize:'1.4rem',fontWeight:'800',color:'#0f172a',margin:0}}>📧 Subscribers ({subscribers.length})</h2>
                <button onClick={loadAll} style={{background:'#f1f5f9',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'8px 14px',fontSize:'13px',fontWeight:'600',color:'#374151',cursor:'pointer'}}>🔄 Refresh</button>
              </div>
              <div style={{background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 130px 70px 50px',gap:'8px',padding:'10px 16px',background:'#f8fafc',borderBottom:'1px solid #e2e8f0',fontSize:'11px',fontWeight:'700',color:'#64748b',textTransform:'uppercase'}}>
                  <span>Email</span><span>Date</span><span>Source</span><span>Del</span>
                </div>
                {subscribers.length === 0 ? (
                  <div style={{padding:'40px',textAlign:'center',color:'#94a3b8'}}>No subscribers yet.</div>
                ) : subscribers.map(s=>(
                  <div key={s.id} style={{display:'grid',gridTemplateColumns:'1fr 130px 70px 50px',gap:'8px',alignItems:'center',padding:'10px 16px',borderBottom:'1px solid #f1f5f9'}}>
                    <span style={{fontSize:'13px',color:'#0f172a',fontWeight:'500'}}>{s.email}</span>
                    <span style={{fontSize:'11px',color:'#64748b'}}>{new Date(s.subscribed_at).toLocaleDateString()}</span>
                    <span style={{fontSize:'11px',background:'#f1f5f9',borderRadius:'5px',padding:'2px 6px',color:'#64748b',textAlign:'center'}}>{s.source||'web'}</span>
                    <button onClick={()=>deleteSubscriber(s.id)} style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'6px',padding:'4px 8px',fontSize:'14px',color:'#dc2626',cursor:'pointer',textAlign:'center'}}>🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACTS */}
          {tab === 'contacts' && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                <h2 style={{fontSize:'1.4rem',fontWeight:'800',color:'#0f172a',margin:0}}>
                  💬 Messages ({contacts.length})
                  {contacts.filter(c=>!c.replied).length > 0 && <span style={{background:'#ef4444',color:'white',borderRadius:'999px',padding:'2px 8px',fontSize:'12px',marginLeft:'8px'}}>{contacts.filter(c=>!c.replied).length} new</span>}
                </h2>
                <button onClick={loadAll} style={{background:'#f1f5f9',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'8px 14px',fontSize:'13px',fontWeight:'600',color:'#374151',cursor:'pointer'}}>🔄 Refresh</button>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {contacts.length === 0 ? (
                  <div style={{background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'40px',textAlign:'center',color:'#94a3b8'}}>No messages yet.</div>
                ) : contacts.map(c=>(
                  <div key={c.id} style={{background:'white',borderRadius:'12px',border:`1px solid ${c.replied?'#e2e8f0':'#bfdbfe'}`,padding:'16px',boxShadow:c.replied?'none':'0 2px 8px rgba(59,130,246,0.08)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px',flexWrap:'wrap',gap:'8px'}}>
                      <div>
                        <span style={{fontSize:'14px',fontWeight:'700',color:'#0f172a'}}>{c.name}</span>
                        <span style={{fontSize:'12px',color:'#64748b',marginLeft:'8px'}}>{c.email}</span>
                      </div>
                      <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                        <span style={{fontSize:'11px',color:'#94a3b8'}}>{new Date(c.created_at).toLocaleDateString()}</span>
                        <button onClick={()=>markReplied(c.id, c.replied)}
                          style={{background:c.replied?'#f0fdf4':'#eff6ff',border:`1px solid ${c.replied?'#bbf7d0':'#bfdbfe'}`,borderRadius:'6px',padding:'4px 10px',fontSize:'12px',fontWeight:'600',color:c.replied?'#16a34a':'#2563eb',cursor:'pointer'}}>
                          {c.replied?'✅ Replied':'📌 Mark Replied'}
                        </button>
                      </div>
                    </div>
                    <div style={{fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'6px'}}>📋 {c.subject}</div>
                    <div style={{fontSize:'13px',color:'#64748b',lineHeight:1.6,background:'#f8fafc',borderRadius:'8px',padding:'10px'}}>{c.message}</div>
                    <div style={{marginTop:'10px'}}>
                      <a href={`mailto:${c.email}?subject=Re: ${c.subject}`} style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'#2563eb',color:'white',borderRadius:'8px',padding:'6px 14px',fontSize:'12px',fontWeight:'600',textDecoration:'none'}}>
                        📧 Reply via Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAX DATA */}
          {tab === 'tax' && (
            <div>
              <h2 style={{fontSize:'1.4rem',fontWeight:'800',color:'#0f172a',marginBottom:'20px'}}>💰 Tax Data Management</h2>
              <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'12px',padding:'16px',marginBottom:'20px'}}>
                <h4 style={{fontSize:'13px',fontWeight:'700',color:'#92400e',marginBottom:'8px'}}>How to Update Tax Data:</h4>
                <ol style={{fontSize:'13px',color:'#78350f',margin:0,paddingLeft:'20px',lineHeight:2}}>
                  <li>Go to GitHub: <code style={{background:'#fef3c7',padding:'1px 6px',borderRadius:'4px'}}>ankur111kr/wagepilot</code></li>
                  <li>Open <code style={{background:'#fef3c7',padding:'1px 6px',borderRadius:'4px'}}>data/tax/us/2025.json</code> or UK file</li>
                  <li>Edit brackets → Commit → Vercel auto-deploys</li>
                </ol>
              </div>
              <div style={{display:'grid',gap:'10px'}}>
                {[{l:'🇺🇸 US Tax 2025',f:'data/tax/us/2025.json',s:'Active ✅',c:'#10b981',bg:'#f0fdf4'},{l:'🇺🇸 US Tax 2024',f:'data/tax/us/2024.json',s:'Archive',c:'#94a3b8',bg:'#f8fafc'},{l:'🇬🇧 UK Tax 2025/26',f:'data/tax/uk/2025.json',s:'Active ✅',c:'#10b981',bg:'#f0fdf4'},{l:'🇬🇧 UK Tax 2024/25',f:'data/tax/uk/2024.json',s:'Archive',c:'#94a3b8',bg:'#f8fafc'}].map(item=>(
                  <div key={item.f} style={{background:item.bg,border:`1px solid ${item.c}30`,borderRadius:'10px',padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontSize:'14px',fontWeight:'700',color:'#0f172a'}}>{item.l}</div>
                      <div style={{fontSize:'11px',color:'#94a3b8',fontFamily:'monospace',marginTop:'2px'}}>{item.f}</div>
                    </div>
                    <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                      <span style={{background:item.c+'20',color:item.c,borderRadius:'6px',padding:'3px 10px',fontSize:'12px',fontWeight:'700'}}>{item.s}</span>
                      <a href={`https://github.com/ankur111kr/wagepilot/edit/main/${item.f}`} target="_blank" style={{background:'#2563eb',color:'white',borderRadius:'6px',padding:'4px 10px',fontSize:'12px',fontWeight:'600',textDecoration:'none'}}>✏️ Edit</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO */}
          {tab === 'seo' && (
            <div>
              <h2 style={{fontSize:'1.4rem',fontWeight:'800',color:'#0f172a',marginBottom:'20px'}}>🔍 SEO Pages</h2>
              <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'12px',padding:'16px',marginBottom:'20px'}}>
                <p style={{fontSize:'13px',color:'#1d4ed8',margin:0,lineHeight:1.7}}>
                  ✅ <strong>51 state pages</strong> auto-generated · ✅ <strong>Sitemap</strong> with 150+ URLs · ✅ <strong>Schema markup</strong> on every page
                </p>
              </div>
              <div style={{background:'white',borderRadius:'12px',border:'1px solid #e2e8f0',padding:'16px'}}>
                <h3 style={{fontSize:'14px',fontWeight:'700',color:'#0f172a',marginBottom:'12px'}}>All State Pages</h3>
                <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                  {['alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware','florida','georgia','hawaii','idaho','illinois','indiana','iowa','kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan','minnesota','mississippi','missouri','montana','nebraska','nevada','new-hampshire','new-jersey','new-mexico','new-york','north-carolina','north-dakota','ohio','oklahoma','oregon','pennsylvania','rhode-island','south-carolina','south-dakota','tennessee','texas','utah','vermont','virginia','washington','west-virginia','wisconsin','wyoming','washington-dc'].map(s=>(
                    <a key={s} href={`/${s}-salary-calculator`} target="_blank"
                      style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'6px',padding:'3px 8px',fontSize:'11px',color:'#16a34a',textDecoration:'none',fontWeight:'600',textTransform:'capitalize'}}>
                      {s.replace(/-/g,' ')}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
