'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SharedNav } from '@/components/layout/SharedNav'
import { SharedFooter } from '@/components/layout/SharedFooter'
export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus('loading'); setErrMsg('')
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, subject: subject||'General Enquiry', message }) })
      const d = await r.json()
      if (r.ok) { setStatus('success'); setName(''); setEmail(''); setSubject(''); setMessage('') }
      else { setStatus('error'); setErrMsg(d.error||'Something went wrong') }
    } catch { setStatus('error'); setErrMsg('Network error. Please try again.') }
  }
  const inp = { width: '100%', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', fontSize: '14px', color: '#0f172a', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' as const, fontFamily: 'system-ui' }
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <SharedNav />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
        <nav style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>{' / '}<span style={{ color: '#0f172a' }}>Contact</span>
        </nav>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>Contact Us</h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Questions, errors, or feature suggestions? We'd love to hear from you.</p>
        </div>
        {status === 'success' ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#166534', margin: '0 0 8px' }}>Message Sent!</h2>
            <p style={{ color: '#15803d', margin: '0 0 20px', fontSize: '14px' }}>We'll get back to you within 2 business days.</p>
            <button onClick={() => setStatus('idle')} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Send Another</button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px', marginBottom: '14px' }}>
                <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Name *</label><input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Smith" style={inp} /></div>
                <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email *</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" style={inp} /></div>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Subject</label>
                <select value={subject} onChange={e => setSubject(e.target.value)} style={inp}>
                  <option value="">Select a topic</option>
                  <option value="Calculator question">Calculator question</option>
                  <option value="Tax data error">Tax data error</option>
                  <option value="Feature request">Feature request</option>
                  <option value="Advertising / partnerships">Advertising / partnerships</option>
                  <option value="General enquiry">General enquiry</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Message *</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={5} placeholder="How can we help?" style={{ ...inp, resize: 'vertical' }} />
              </div>
              {status === 'error' && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#dc2626' }}>❌ {errMsg}</div>}
              <button type="submit" disabled={status === 'loading'} style={{ width: '100%', background: status === 'loading' ? '#94a3b8' : 'linear-gradient(135deg,#2563eb,#06b6d4)', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
                {status === 'loading' ? '⏳ Sending...' : '📨 Send Message'}
              </button>
            </form>
          </div>
        )}
      </div>
      <SharedFooter />
    </div>
  )
}
