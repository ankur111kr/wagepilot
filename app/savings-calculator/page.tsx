'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SharedNav } from '@/components/layout/SharedNav'
import { SharedFooter } from '@/components/layout/SharedFooter'

interface YearData { year: number; balance: number; contributions: number; interest: number }

function calcSavings(initial: number, monthly: number, rate: number, years: number) {
  const monthlyRate = rate / 100 / 12
  let balance = initial
  let totalContributions = initial
  const yearlyData: YearData[] = []
  for (let year = 1; year <= years; year++) {
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyRate) + monthly
      totalContributions += monthly
    }
    yearlyData.push({ year, balance: Math.round(balance), contributions: Math.round(totalContributions), interest: Math.round(balance - totalContributions) })
  }
  return { finalBalance: Math.round(balance), totalContributions: Math.round(totalContributions), totalInterest: Math.round(balance - totalContributions), yearlyData }
}

function fmt(n: number) { return '$' + n.toLocaleString('en-US') }
function pct(a: number, b: number) { return b > 0 ? Math.round((a / b) * 100) : 0 }

export default function SavingsCalculatorPage() {
  const [initial, setInitial] = useState(5000)
  const [monthly, setMonthly] = useState(500)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(20)
  const [result, setResult] = useState(calcSavings(5000, 500, 7, 20))

  useEffect(() => { setResult(calcSavings(initial, monthly, rate, years)) }, [initial, monthly, rate, years])

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <SharedNav />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>
        <nav style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>{' / '}
          <span style={{ color: '#0f172a' }}>Savings Calculator</span>
        </nav>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>🐷 Compound Interest & Savings Calculator</h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>See how your savings grow with compound interest over time.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Savings Details</h2>
            {[
              { label: 'Initial Deposit', value: initial, setter: setInitial, min: 0, max: 100000, step: 500 },
              { label: 'Monthly Contribution', value: monthly, setter: setMonthly, min: 0, max: 5000, step: 50 },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>{fmt(f.value)}</span>
                </div>
                <input type="range" min={f.min} max={f.max} step={f.step} value={f.value}
                  onChange={e => f.setter(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
              </div>
            ))}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Annual Return Rate</label>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>{rate}%</span>
              </div>
              <input type="range" min={0.5} max={15} step={0.5} value={rate}
                onChange={e => setRate(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                <span>0.5% HYSA</span><span>15% Growth</span>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Time Period</label>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>{years} years</span>
              </div>
              <input type="range" min={1} max={50} step={1} value={years}
                onChange={e => setYears(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>Quick Presets</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {[
                  { label: '🚨 Emergency', initial: 1000, monthly: 200, rate: 5, years: 3 },
                  { label: '🏦 401k', initial: 10000, monthly: 1500, rate: 7, years: 30 },
                  { label: '🏠 House', initial: 5000, monthly: 800, rate: 4, years: 5 },
                ].map(p => (
                  <button key={p.label} onClick={() => { setInitial(p.initial); setMonthly(p.monthly); setRate(p.rate); setYears(p.years) }}
                    style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 4px', fontSize: '11px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', borderRadius: '16px', padding: '24px', color: 'white' }}>
              <p style={{ margin: '0 0 4px', fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Balance after {years} years</p>
              <p style={{ margin: '0 0 16px', fontSize: '2.4rem', fontWeight: '900', lineHeight: 1 }}>{fmt(result.finalBalance)}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Your Contributions', value: result.totalContributions },
                  { label: 'Interest Earned 🎉', value: result.totalInterest },
                ].map(c => (
                  <div key={c.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '10px', opacity: 0.8, textTransform: 'uppercase' }}>{c.label}</p>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>{fmt(c.value)}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '10px', opacity: 0.7 }}>{pct(c.value, result.finalBalance)}% of total</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '18px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>Growth Breakdown</h3>
              {[
                { label: 'Your Contributions', value: result.totalContributions, color: '#3b82f6' },
                { label: 'Interest Earned', value: result.totalInterest, color: '#10b981' },
              ].map(row => (
                <div key={row.label} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{row.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: row.color }}>{fmt(row.value)}</span>
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '8px' }}>
                    <div style={{ width: `${pct(row.value, result.finalBalance)}%`, height: '100%', background: row.color, borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>Year by Year Growth</div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {result.yearlyData.map(row => (
                  <div key={row.year} style={{ display: 'flex', alignItems: 'center', padding: '8px 18px', borderBottom: '1px solid #f1f5f9', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', width: '52px', flexShrink: 0 }}>Year {row.year}</span>
                    <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct(row.balance, result.finalBalance)}%`, height: '100%', background: '#3b82f6', borderRadius: '999px' }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', width: '90px', textAlign: 'right' }}>{fmt(row.balance)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '16px', background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '18px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>Related Calculators</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[{ name: '💰 Salary Calculator', href: '/salary-calculator' }, { name: '🏠 Mortgage Calculator', href: '/mortgage-affordability-calculator' }, { name: '📊 Salary Comparison', href: '/salary-comparison' }].map(c => (
              <Link key={c.href} href={c.href} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '7px 14px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', color: '#2563eb' }}>{c.name}</Link>
            ))}
          </div>
        </div>
      </div>
      <SharedFooter />
    </div>
  )
}
