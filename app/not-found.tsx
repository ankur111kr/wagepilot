import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | WagePilot',
  description: 'The page you are looking for does not exist. Return to WagePilot and calculate your take-home pay.',
}

export default function NotFound() {
  return (
    <div style={{ background: '#040e1a', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <nav style={{ background: 'rgba(4,14,26,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#2563eb,#06b6d4)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💰</div>
          <span style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(90deg,#60a5fa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WagePilot</span>
        </Link>
        <Link href="/salary-calculator" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>
          Calculate Now
        </Link>
      </nav>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>

          {/* 404 graphic */}
          <div style={{ position: 'relative', marginBottom: '32px' }}>
            <div style={{ fontSize: 'clamp(80px, 20vw, 140px)', fontWeight: '900', lineHeight: 1, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.05em' }}>
              404
            </div>
            <div style={{ fontSize: '48px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15, fontSize: '160px', pointerEvents: 'none' }}>
              💰
            </div>
          </div>

          {/* Message */}
          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: '800', color: 'white', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Oops! Page Not Found
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', margin: '0 0 36px', lineHeight: 1.7 }}>
            The page you are looking for doesn't exist or may have been moved.
            Let's get you back on track!
          </p>

          {/* Primary CTA */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: 'white', padding: '13px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontWeight: '700', boxShadow: '0 8px 24px rgba(59,130,246,0.3)' }}>
              🏠 Go to Homepage
            </Link>
            <Link href="/salary-calculator" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '13px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontWeight: '700' }}>
              💰 Salary Calculator
            </Link>
          </div>

          {/* Popular pages */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Popular Calculators
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
              {[
                { emoji: '💰', label: 'Salary Calculator', href: '/salary-calculator' },
                { emoji: '🧾', label: 'Paycheck Calculator', href: '/paycheck-calculator' },
                { emoji: '⏰', label: 'Overtime Calculator', href: '/overtime-calculator' },
                { emoji: '🇬🇧', label: 'UK Income Tax', href: '/uk-income-tax-calculator' },
                { emoji: '💼', label: 'Contractor Tax', href: '/contractor-calculator' },
                { emoji: '📊', label: 'Salary Comparison', href: '/salary-comparison' },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: '500', transition: 'background 0.15s' }}>
                  <span style={{ fontSize: '16px' }}>{item.emoji}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Help text */}
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '24px' }}>
            Still lost?{' '}
            <Link href="/contact" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: '600' }}>Contact us</Link>
            {' '}and we will help you find what you need.
          </p>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', margin: 0 }}>
          © {new Date().getFullYear()} WagePilot. Free salary & tax calculators for USA & UK.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[{ n: 'Home', h: '/' }, { n: 'Privacy', h: '/privacy' }, { n: 'Terms', h: '/terms' }, { n: 'Contact', h: '/contact' }].map(l => (
            <Link key={l.h} href={l.h} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>{l.n}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
                 }
