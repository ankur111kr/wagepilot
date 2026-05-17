'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }

      if (data?.session) {
        // Store session info
        localStorage.setItem('wp_admin_logged_in', 'true')
        // Force redirect
        window.location.href = '/admin'
      } else {
        setError('Login failed. Please try again.')
        setLoading(false)
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5f9',
      padding: '16px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: 'white',
        borderRadius: '20px',
        padding: '36px 28px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', margin: '0 auto 12px'
          }}>✈️</div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
            WagePilot Admin
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Sign in to manage content
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@wagepilot.com"
              style={{
                width: '100%',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '11px 14px',
                fontSize: '14px',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
                background: '#f8fafc'
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '11px 44px 11px 14px',
                  fontSize: '14px',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: '#f8fafc'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: '#94a3b8', fontSize: '16px'
                }}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '13px',
              color: '#dc2626',
              marginBottom: '16px'
            }}>
              ❌ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #06b6d4)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '13px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginTop: '20px' }}>
          Admin access only. Create user in Supabase Auth.
        </p>
      </div>
    </div>
  )
}
