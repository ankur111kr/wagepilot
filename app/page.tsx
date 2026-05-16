import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: 0, background: '#f8fafc' }}>

      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>✈️</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb' }}>WagePilot</span>
        </div>
        <Link href="/salary-calculator" style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
          Calculate Now
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#dbeafe', color: '#1d4ed8', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', marginBottom: '20px' }}>
          ✅ Updated for 2025 Tax Year
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', margin: '0 0 16px', lineHeight: 1.2 }}>
          Know Your Exact Take-Home Pay
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', margin: '0 auto 32px', maxWidth: '500px' }}>
          Free salary, paycheck and tax calculators for all 50 US states and UK. Instant results.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {[{ value: '10+', label: 'Calculators' }, { value: '51', label: 'US States' }, { value: '2025', label: 'Tax Data' }].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '12px', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2563eb' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <Link href="/salary-calculator" style={{ display: 'inline-block', background: '#2563eb', color: 'white', padding: '16px 36px', borderRadius: '12px', textDecoration: 'none', fontSize: '16px', fontWeight: '700', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>
          Calculate My Salary →
        </Link>
      </section>

      {/* US Calculators */}
      <section style={{ padding: '48px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>🇺🇸 US Calculators</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>All 50 states with 2025 federal and state tax rates</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {[
            { name: 'Salary Calculator', href: '/salary-calculator', emoji: '💰', desc: 'Annual take-home pay', bg: '#eff6ff', border: '#bfdbfe' },
            { name: 'Overtime Calculator', href: '/overtime-calculator', emoji: '⏰', desc: '1.5x, 2x overtime pay', bg: '#fffbeb', border: '#fde68a' },
            { name: 'Contractor Tax', href: '/contractor-calculator', emoji: '💼', desc: '1099 self-employment', bg: '#fdf4ff', border: '#e9d5ff' },
            { name: 'Hourly to Salary', href: '/hourly-to-salary-calculator', emoji: '🕐', desc: 'Convert any rate', bg: '#ecfeff', border: '#a5f3fc' },
            { name: 'Take-Home Pay', href: '/take-home-pay-calculator', emoji: '✅', desc: 'Net pay after taxes', bg: '#f0fdf4', border: '#bbf7d0' },
            { name: 'Savings Calculator', href: '/savings-calculator', emoji: '🐷', desc: 'Compound interest', bg: '#fff1f2', border: '#fecdd3' },
            { name: 'Mortgage Calculator', href: '/mortgage-affordability-calculator', emoji: '🏠', desc: 'Home affordability', bg: '#fff7ed', border: '#fed7aa' },
            { name: 'Salary Comparison', href: '/salary-comparison', emoji: '📊', desc: 'Compare salaries', bg: '#f5f3ff', border: '#ddd6fe' },
          ].map(c => (
            <Link key={c.href} href={c.href} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '16px', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{c.emoji}</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>{c.name}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{c.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* UK Calculators */}
      <section style={{ background: 'white', padding: '48px 24px', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>🇬🇧 UK Tax Calculators</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>PAYE, NI and Scottish rates for 2025/26 tax year</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {[
              { name: 'UK Income Tax', href: '/uk-income-tax-calculator', emoji: '🏛️', desc: 'PAYE + National Insurance', bg: '#f0fdf4', border: '#bbf7d0' },
              { name: 'Scotland Tax', href: '/uk-income-tax-calculator', emoji: '🏴', desc: 'Scottish income tax rates', bg: '#eff6ff', border: '#bfdbfe' },
            ].map(c => (
              <Link key={c.name} href={c.href} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '16px', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{c.emoji}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>{c.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{c.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular States */}
      <section style={{ padding: '48px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>Calculate by State</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>Click your state for exact take-home pay</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { name: 'California', slug: 'california', rate: '13.3%', color: '#fef2f2' },
            { name: 'New York', slug: 'new-york', rate: '10.9%', color: '#fef2f2' },
            { name: 'Texas', slug: 'texas', rate: 'No Tax ✓', color: '#f0fdf4' },
            { name: 'Florida', slug: 'florida', rate: 'No Tax ✓', color: '#f0fdf4' },
            { name: 'Washington', slug: 'washington', rate: 'No Tax ✓', color: '#f0fdf4' },
            { name: 'Nevada', slug: 'nevada', rate: 'No Tax ✓', color: '#f0fdf4' },
            { name: 'Illinois', slug: 'illinois', rate: '4.95%', color: '#fffbeb' },
            { name: 'Colorado', slug: 'colorado', rate: '4.4%', color: '#fffbeb' },
            { name: 'Oregon', slug: 'oregon', rate: '9.9%', color: '#fef2f2' },
          ].map(s => (
            <Link key={s.slug} href={`/${s.slug}-salary-calculator`} style={{ background: s.color, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', textDecoration: 'none', textAlign: 'center', display: 'block' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{s.name}</div>
              <div style={{ fontSize: '11px', color: s.rate.includes('No') ? '#16a34a' : '#dc2626', marginTop: '2px' }}>{s.rate}</div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/states" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>View All 50 States →</Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: '#0f172a', padding: '48px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', marginBottom: '24px', textAlign: 'center' }}>Why WagePilot?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { emoji: '⚡', title: 'Instant Results', desc: 'Real-time calculations as you type' },
              { emoji: '🔒', title: '100% Private', desc: 'No data stored, ever' },
              { emoji: '📊', title: 'Visual Charts', desc: 'Tax breakdown charts included' },
              { emoji: '🆓', title: 'Always Free', desc: 'No signup, no paywall' },
              { emoji: '📱', title: 'Mobile Friendly', desc: 'Works on any device' },
              { emoji: '🌍', title: 'USA + UK', desc: 'Full coverage for both countries' },
            ].map(f => (
              <div key={f.title} style={{ background: '#1e293b', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{f.emoji}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>{f.title}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'white', padding: '48px 24px', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '24px', textAlign: 'center' }}>Common Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { q: 'How accurate are the calculators?', a: 'We use official IRS and HMRC tax data updated for 2025. Results are highly accurate for standard employment.' },
              { q: 'Is my financial data stored?', a: 'No. All calculations happen in your browser. We never store your salary or financial information.' },
              { q: 'Does it support UK taxes?', a: 'Yes! Full UK PAYE, National Insurance, Scottish rates, and all student loan plans for 2025/26.' },
              { q: 'Which US states are covered?', a: 'All 50 states plus Washington D.C. — including no-income-tax states like Texas, Florida, and Nevada.' },
            ].map((faq, i) => (
              <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', fontWeight: '600', fontSize: '14px', color: '#0f172a', background: '#f8fafc' }}>{faq.q}</div>
                <div style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)', padding: '48px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white', margin: '0 0 12px' }}>Ready to calculate your pay?</h2>
        <p style={{ color: '#bfdbfe', margin: '0 0 24px', fontSize: '15px' }}>Free, instant, accurate — no signup needed</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/salary-calculator" style={{ background: 'white', color: '#2563eb', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
            US Salary Calculator
          </Link>
          <Link href="/uk-income-tax-calculator" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', border: '1px solid rgba(255,255,255,0.3)' }}>
            UK Tax Calculator
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', padding: '40px 24px', color: '#94a3b8' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>✈️</span>
            <span style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>WagePilot</span>
          </div>
          <p style={{ fontSize: '13px', marginBottom: '20px', lineHeight: 1.6 }}>
            Free salary, paycheck and tax calculators for US and UK workers. Updated for 2025 tax year.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', fontSize: '13px' }}>
            {[
              { label: 'Salary Calculator', href: '/salary-calculator' },
              { label: 'UK Income Tax', href: '/uk-income-tax-calculator' },
              { label: 'Overtime Calculator', href: '/overtime-calculator' },
              { label: 'All States', href: '/states' },
              { label: 'Blog', href: '/blog' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Disclaimer', href: '/disclaimer' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ color: '#94a3b8', textDecoration: 'none' }}>{link.label}</Link>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', fontSize: '12px' }}>
            © 2025 WagePilot. Tax data sourced from IRS and HMRC. Always consult a qualified tax professional.
          </div>
        </div>
      </footer>

    </main>
  )
}
