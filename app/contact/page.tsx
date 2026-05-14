'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (res.ok) {
        setStatus('success')
        setName(''); setEmail(''); setSubject(''); setMessage('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="mb-8">
        <h1 className="font-sora text-3xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-3 text-muted-foreground">
          Have a question about our calculators, found an error, or want to suggest a feature?
          We'd love to hear from you.
        </p>
      </div>

      {status === 'success' ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
          <p className="font-semibold text-emerald-600">Message sent!</p>
          <p className="mt-1 text-sm text-muted-foreground">We'll get back to you within 2 business days.</p>
          <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-primary hover:underline">
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="John Smith" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="john@example.com" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select a topic</option>
              <option>Calculator question</option>
              <option>Tax data error</option>
              <option>Feature request</option>
              <option>Advertising / partnerships</option>
              <option>General enquiry</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={5}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Tell us how we can help…" />
          </div>
          {status === 'error' && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
          <button type="submit" disabled={status === 'loading'}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity">
            {status === 'loading' ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
