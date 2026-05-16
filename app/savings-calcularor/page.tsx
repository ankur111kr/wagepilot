'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface YearData {
  year: number
  balance: number
  contributions: number
  interest: number
}

function calculateSavings(initial: number, monthly: number, rate: number, years: number) {
  const monthlyRate = rate / 100 / 12
  let balance = initial
  let totalContributions = initial
  const yearlyData: YearData[] = []
  for (let year = 1; year <= years; year++) {
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyRate) + monthly
      totalContributions += monthly
    }
    yearlyData.push({
      year,
      balance: Math.round(balance),
      contributions: Math.round(totalContributions),
      interest: Math.round(balance - totalContributions),
    })
  }
  return {
    finalBalance: Math.round(balance),
    totalContributions: Math.round(totalContributions),
    totalInterest: Math.round(balance - totalContributions),
    yearlyData,
  }
}

function fmt(n: number) { return '$' + n.toLocaleString('en-US') }

export default function SavingsCalculatorPage() {
  const [initial, setInitial] = useState(5000)
  const [monthly, setMonthly] = useState(500)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(20)
  const [result, setResult] = useState(calculateSavings(5000, 500, 7, 20))

  useEffect(() => {
    setResult(calculateSavings(initial, monthly, rate, years))
  }, [initial, monthly, rate, years])

  const pct = (a: number, b: number) => b > 0 ? Math.round((a / b) * 100) : 0

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontSize: '20px' }}>✈️</span>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#2563eb' }}>WagePilot</span>
        </Link>
        <Link href="/salary-calculator" style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
          Salary Calculator
        </Link>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>{' / '}
          <span style={{ color: '#0f172a' }}>Savings Calculator</span>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
            🐷 Savings & Compound Interest Calculator 2025
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
            See how your savings grow with compound interest. Adjust deposit, contributions, and return rate instantly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

          {/* INPUT */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginTop: 0, marginBottom: '20px' }}>Your Savings Details</h2>

            {[
              { label: 'Initial Deposit', value: initial, setValue: setInitial, min: 0, max: 100000, step: 500, fmt: fmt, suffix: '' },
              { label: 'Monthly Contribution', value: monthly, setValue: setMonthly, min: 0, max: 5000, step: 50, fmt: fmt, suffix: '/mo' },
            ].map(field => (
              <div key={field.label} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{field.label}</label>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#2563eb' }}>{field.fmt(field.value)}{field.suffix}</span>
                </div>
                <input type="range" min={field.min} max={field.max} step={field.step} value={field.value}
                  onChange={e => field.setValue(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563eb' }} />
              </div>
            ))}

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Annual Return Rate</label>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#2563eb' }}>{rate}%</span>
              </div>
              <input type="range" min={0.5} max={15} step={0.5} value={rate}
                onChange={e => setRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                <span>0.5% (HYSA)</span><span>15% (Growth)</span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Time Period</label>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#2563eb' }}>{years} years</span>
              </div>
              <input type="range" min={1} max={50} step={1} value={years}
                onChange={e => setYears(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb' }} />
            </div>

            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Quick Presets</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {[
                  { label: 'Emergency', initial: 1000, monthly: 200, rate: 5, years: 3 },
                  { label: '401k', initial: 10000, monthly: 1500, rate: 7, years: 30 },
                  { label: 'House', initial: 5000, monthly: 800, rate: 4, years: 5 },
                ].map(p => (
                  <button key={p.label} onClick={() => { setInitial(p.initial); setMonthly(p.monthly); setRate(p.rate); setYears(p.years) }}
                    style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 4px', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RESULTS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)', borderRadius: '16px', padding: '24px', color: 'white' }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', opacity: 0.8 }}>Balance after {years} years</p>
              <p style={{ margin: '0 0 16px', fontSize: '2.5rem', fontWeight: '800', lineHeight: 1 }}>{fmt(result.finalBalance)}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', opacity: 0.8 }}>Your Contributions</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{fmt(result.totalContributions)}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', opacity: 0.7 }}>{pct(result.totalContributions, result.finalBalance)}% of total</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', opacity: 0.8 }}>Interest Earned 🎉</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{fmt(result.totalInterest)}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', opacity: 0.7 }}>{pct(result.totalInterest, result.finalBalance)}% of total</p>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginTop: 0, marginBottom: '16px' }}>Growth Breakdown</h3>
              {[
                { label: 'Your Money', value: result.totalContributions, color: '#2563eb' },
                { label: 'Interest Earned', value: result.totalInterest, color: '#16a34a' },
              ].map(row => (
                <div key={row.label} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{row.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: row.color }}>{fmt(row.value)}</span>
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '10px' }}>
                    <div style={{ width: `${pct(row.value, result.finalBalance)}%`, height: '100%', background: row.color, borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>
                Year by Year Growth
              </div>
              <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                {result.yearlyData.map(row => (
                  <div key={row.year} style={{ display: 'flex', alignItems: 'center', padding: '8px 20px', borderBottom: '1px solid #f1f5f9', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', width: '52px', flexShrink: 0 }}>Year {row.year}</span>
                    <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct(row.balance, result.finalBalance)}%`, height: '100%', background: '#2563eb', borderRadius: '999px' }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', width: '90px', textAlign: 'right' }}>{fmt(row.balance)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {[
            { title: '💡 Rule of 72', desc: 'Divide 72 by your return rate to estimate years to double. At 7%, your money doubles every ~10 years!' },
            { title: '📈 Start Early', desc: '$200/month from age 25 vs 35 at 7% return gives nearly DOUBLE the balance at retirement.' },
            { title: '🏦 Best Accounts 2025', desc: 'HYSAs: 4-5% APY. 401(k) limit: $23,500. IRA limit: $7,000. Roth IRA grows tax-free!' },
          ].map(tip => (
            <div key={tip.title} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#166534', marginTop: 0, marginBottom: '8px' }}>{tip.title}</h3>
              <p style={{ fontSize: '13px', color: '#15803d', margin: 0, lineHeight: 1.6 }}>{tip.desc}</p>
            </div>
          ))}
        </div>

        {/* Related */}
        <div style={{ marginTop: '24px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginTop: 0, marginBottom: '12px' }}>Related Calculators</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { name: '💰 Salary Calculator', href: '/salary-calculator' },
              { name: '🏠 Mortgage Calculator', href: '/mortgage-affordability-calculator' },
              { name: '💼 Contractor Tax', href: '/contractor-calculator' },
              { name: '🇬🇧 UK Income Tax', href: '/uk-income-tax-calculator' },
            ].map(c => (
              <Link key={c.href} href={c.href} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '8px 14px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', color: '#1d4ed8' }}>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
