'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject: subject || 'General Enquiry', message }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setName(''); setEmail(''); setSubject(''); setMessage('')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  const inp = {
    width: '100%', border: '1px solid #e2e8f0', borderRadius: '10px',
    padding: '12px 14px', fontSize: '14px', color: '#0f172a',
    outline: 'none', background: '#f8fafc', boxSizing: 'border-box' as const,
    fontFamily: 'system-ui'
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💰</div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#2563eb' }}>WagePilot</span>
        </Link>
        <Link href="/salary-calculator" style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
          Calculate Now
        </Link>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>{' / '}
          <span style={{ color: '#0f172a' }}>Contact</span>
        </nav>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>Contact Us</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
            Have a question about our calculators, found an error, or want to suggest a feature? We'd love to hear from you.
          </p>
        </div>

        {status === 'success' ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#166534', margin: '0 0 8px' }}>Message Sent!</h2>
            <p style={{ color: '#15803d', margin: '0 0 20px', fontSize: '14px' }}>We'll get back to you within 2 business days.</p>
            <button onClick={() => setStatus('idle')}
              style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Send Another Message
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    placeholder="John Smith" style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="john@example.com" style={inp} />
                </div>
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
                <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={5}
                  placeholder="Tell us how we can help…"
                  style={{ ...inp, resize: 'vertical' }} />
              </div>

              {status === 'error' && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#dc2626' }}>
                  ❌ {errorMsg}
                </div>
              )}

              <button type="submit" disabled={status === 'loading'}
                style={{ width: '100%', background: status === 'loading' ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #06b6d4)', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
                {status === 'loading' ? '⏳ Sending...' : '📨 Send Message'}
              </button>
            </form>
          </div>
        )}

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '24px' }}>
          {[
            { emoji: '⚡', title: 'Quick Response', desc: 'We reply within 2 business days' },
            { emoji: '🔒', title: 'Private', desc: 'Your data is never shared' },
            { emoji: '🆓', title: 'Free Support', desc: 'No charge for any enquiry' },
          ].map(card => (
            <div key={card.title} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{card.emoji}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{card.title}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
