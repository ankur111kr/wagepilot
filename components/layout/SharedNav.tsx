'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

function NavDropdown({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      <button style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.75)' }}>
        {label}
        <span style={{ fontSize: '10px', opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▼</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', left: 0, top: '100%', marginTop: '4px', minWidth: '220px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(8,18,36,0.98)', padding: '6px', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', zIndex: 200, backdropFilter: 'blur(20px)' }}>
          {children}
        </div>
      )}
    </div>
  )
}

function DropItem({ href, emoji, label, desc }: { href: string; emoji: string; label: string; desc?: string }) {
  return (
    <Link href={href}
      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      <span style={{ fontSize: '18px', flexShrink: 0 }}>{emoji}</span>
      <div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>{label}</div>
        {desc && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>{desc}</div>}
      </div>
    </Link>
  )
}

export function SharedNav() {
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState('USA')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('wp_country') || 'USA') : 'USA'
    setCountry(saved)
    const handler = (e: any) => setCountry(e.detail)
    window.addEventListener('countryChange', handler)
    return () => window.removeEventListener('countryChange', handler)
  }, [])

  const handleCountryChange = (c: string) => {
    setCountry(c)
    localStorage.setItem('wp_country', c)
    window.dispatchEvent(new CustomEvent('countryChange', { detail: c }))
    if (pathname.includes('uk-income-tax') && c === 'USA') router.push('/salary-calculator')
    else if ((pathname.includes('salary-calculator') || pathname.includes('take-home') || pathname.includes('paycheck')) && c === 'UK') router.push('/uk-income-tax-calculator')
  }

  return (
    <>
      <style>{`
        #sn-desk{display:flex;} #sn-dr{display:flex;} #sn-mob{display:none;}
        @media(max-width:900px){
          #sn-desk{display:none!important;}
          #sn-dr{display:none!important;}
          #sn-mob{display:flex!important;}
        }
        .sn-link{padding:8px 12px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;color:rgba(255,255,255,0.75);white-space:nowrap;transition:color 0.15s;}
        .sn-link:hover{color:white;}
        .sn-mob-item{display:block;padding:11px 12px;border-radius:8px;color:rgba(255,255,255,0.8);text-decoration:none;font-size:14px;font-weight:500;}
        .sn-mob-item:hover{background:rgba(255,255,255,0.06);}
      `}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(4,14,26,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#2563eb,#06b6d4)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>💰</div>
            <span style={{ fontSize: '19px', fontWeight: '800', background: 'linear-gradient(90deg,#60a5fa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>WagePilot</span>
          </Link>

          {/* Desktop Nav */}
          <div id="sn-desk" style={{ alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
            <NavDropdown label="Calculators">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                <DropItem href="/salary-calculator" emoji="💰" label="Salary Calculator" desc="US take-home pay" />
                <DropItem href="/paycheck-calculator" emoji="🧾" label="Paycheck Calc" desc="Per pay period" />
                <DropItem href="/overtime-calculator" emoji="⏰" label="Overtime Calc" desc="1.5× & 2× rates" />
                <DropItem href="/hourly-to-salary-calculator" emoji="🕐" label="Hourly → Salary" desc="Quick converter" />
                <DropItem href="/take-home-pay-calculator" emoji="✅" label="Take Home Pay" desc="Quick estimate" />
                <DropItem href="/contractor-calculator" emoji="💼" label="Contractor Tax" desc="1099 & freelance" />
                <DropItem href="/mortgage-affordability-calculator" emoji="🏠" label="Mortgage Calc" desc="Affordability" />
                <DropItem href="/savings-calculator" emoji="🐷" label="Savings Calc" desc="Compound interest" />
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '6px', paddingTop: '6px' }}>
                <DropItem href="/uk-income-tax-calculator" emoji="🇬🇧" label="UK Income Tax" desc="PAYE & NI calculator" />
              </div>
            </NavDropdown>

            <NavDropdown label="States">
              <div style={{ padding: '4px 8px 2px', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>No Income Tax</div>
              <DropItem href="/texas-salary-calculator" emoji="🤠" label="Texas" />
              <DropItem href="/florida-salary-calculator" emoji="☀️" label="Florida" />
              <DropItem href="/nevada-salary-calculator" emoji="🎰" label="Nevada" />
              <div style={{ padding: '4px 8px 2px', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>Popular States</div>
              <DropItem href="/california-salary-calculator" emoji="🌴" label="California" />
              <DropItem href="/new-york-salary-calculator" emoji="🗽" label="New York" />
              <DropItem href="/washington-salary-calculator" emoji="🌲" label="Washington" />
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '6px', paddingTop: '6px' }}>
                <DropItem href="/states" emoji="📍" label="All 50 States" />
              </div>
            </NavDropdown>

            <Link href="/salary-comparison" className="sn-link">📊 Compare</Link>
            <Link href="/blog" className="sn-link">📝 Blog</Link>

            <NavDropdown label="Legal">
              <DropItem href="/privacy" emoji="🔒" label="Privacy Policy" />
              <DropItem href="/terms" emoji="📋" label="Terms & Conditions" />
              <DropItem href="/disclaimer" emoji="⚠️" label="Disclaimer" />
              <DropItem href="/contact" emoji="📞" label="Contact Us" />
            </NavDropdown>
          </div>

          {/* Desktop Right */}
          <div id="sn-dr" style={{ alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <select value={country} onChange={e => handleCountryChange(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
              <option value="USA">🇺🇸 USA</option>
              <option value="UK">🇬🇧 UK</option>
            </select>
            <Link href="/salary-calculator"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: 'white', padding: '9px 18px', borderRadius: '9px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(59,130,246,0.35)' }}>
              Calculate Now
            </Link>
          </div>

          {/* Mobile Right */}
          <div id="sn-mob" style={{ alignItems: 'center', gap: '8px' }}>
            <select value={country} onChange={e => handleCountryChange(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '5px 8px', fontSize: '12px', color: 'white' }}>
              <option value="USA">🇺🇸</option>
              <option value="UK">🇬🇧</option>
            </select>
            <button onClick={() => setOpen(v => !v)}
              style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.07)', color: 'white', cursor: 'pointer', fontSize: '18px' }}>
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div style={{ background: 'rgba(4,14,26,0.98)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ marginBottom: '8px' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 12px', margin: 0 }}>Calculators</p>
              {[
                { l: '💰 Salary Calculator', h: '/salary-calculator' },
                { l: '🧾 Paycheck Calculator', h: '/paycheck-calculator' },
                { l: '⏰ Overtime Calculator', h: '/overtime-calculator' },
                { l: '🕐 Hourly → Salary', h: '/hourly-to-salary-calculator' },
                { l: '✅ Take Home Pay', h: '/take-home-pay-calculator' },
                { l: '💼 Contractor Tax', h: '/contractor-calculator' },
                { l: '🏠 Mortgage Calculator', h: '/mortgage-affordability-calculator' },
                { l: '🐷 Savings Calculator', h: '/savings-calculator' },
                { l: '📊 Salary Comparison', h: '/salary-comparison' },
                { l: '🇬🇧 UK Income Tax', h: '/uk-income-tax-calculator' },
              ].map(item => (
                <Link key={item.h} href={item.h} className="sn-mob-item" onClick={() => setOpen(false)}>{item.l}</Link>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '8px', marginBottom: '8px' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 12px', margin: 0 }}>More</p>
              {[
                { l: '🏠 Home', h: '/' },
                { l: '📍 All 50 States', h: '/states' },
                { l: '📝 Blog', h: '/blog' },
                { l: '📞 Contact Us', h: '/contact' },
                { l: '🔒 Privacy Policy', h: '/privacy' },
                { l: '📋 Terms & Conditions', h: '/terms' },
              ].map(item => (
                <Link key={item.h} href={item.h} className="sn-mob-item" onClick={() => setOpen(false)}>{item.l}</Link>
              ))}
            </div>
            <Link href="/salary-calculator" onClick={() => setOpen(false)}
              style={{ display: 'block', margin: '8px 0 4px', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: 'white', padding: '14px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '700', textAlign: 'center' }}>
              🚀 Start Calculating
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}
