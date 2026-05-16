'use client'

import { useState } from 'react'
import Link from 'next/link'

const STATE_DATA = [
  { name: 'Alaska', slug: 'alaska', rate: 0, type: 'none', takeHome75k: 58842 },
  { name: 'Florida', slug: 'florida', rate: 0, type: 'none', takeHome75k: 58842 },
  { name: 'Nevada', slug: 'nevada', rate: 0, type: 'none', takeHome75k: 58842 },
  { name: 'South Dakota', slug: 'south-dakota', rate: 0, type: 'none', takeHome75k: 58842 },
  { name: 'Tennessee', slug: 'tennessee', rate: 0, type: 'none', takeHome75k: 58842 },
  { name: 'Texas', slug: 'texas', rate: 0, type: 'none', takeHome75k: 58842 },
  { name: 'Washington', slug: 'washington', rate: 0, type: 'none', takeHome75k: 58842 },
  { name: 'Wyoming', slug: 'wyoming', rate: 0, type: 'none', takeHome75k: 58842 },
  { name: 'Indiana', slug: 'indiana', rate: 3.0, type: 'flat', takeHome75k: 56590 },
  { name: 'Pennsylvania', slug: 'pennsylvania', rate: 3.07, type: 'flat', takeHome75k: 56537 },
  { name: 'Arizona', slug: 'arizona', rate: 2.5, type: 'flat', takeHome75k: 57217 },
  { name: 'Colorado', slug: 'colorado', rate: 4.4, type: 'flat', takeHome75k: 55542 },
  { name: 'Michigan', slug: 'michigan', rate: 4.25, type: 'flat', takeHome75k: 55654 },
  { name: 'Illinois', slug: 'illinois', rate: 4.95, type: 'flat', takeHome75k: 55130 },
  { name: 'Georgia', slug: 'georgia', rate: 5.5, type: 'flat', takeHome75k: 54718 },
  { name: 'Massachusetts', slug: 'massachusetts', rate: 5.0, type: 'flat', takeHome75k: 55092 },
  { name: 'North Carolina', slug: 'north-carolina', rate: 4.49, type: 'flat', takeHome75k: 55280 },
  { name: 'Virginia', slug: 'virginia', rate: 5.75, type: 'graduated', takeHome75k: 54400 },
  { name: 'New York', slug: 'new-york', rate: 10.9, type: 'graduated', takeHome75k: 50100 },
  { name: 'California', slug: 'california', rate: 13.3, type: 'graduated', takeHome75k: 48200 },
  { name: 'Oregon', slug: 'oregon', rate: 9.9, type: 'graduated', takeHome75k: 50800 },
  { name: 'Minnesota', slug: 'minnesota', rate: 9.85, type: 'graduated', takeHome75k: 50850 },
  { name: 'New Jersey', slug: 'new-jersey', rate: 10.75, type: 'graduated', takeHome75k: 50200 },
  { name: 'Hawaii', slug: 'hawaii', rate: 11.0, type: 'graduated', takeHome75k: 49900 },
]

function fmt(n: number) { return '$' + n.toLocaleString('en-US') }

export default function SalaryComparisonPage() {
  const [salary, setSalary] = useState(75000)
  const [sortBy, setSortBy] = useState<'takeHome' | 'name' | 'rate'>('takeHome')

  const maxTakeHome = 58842
  const ratio = salary / 75000

  const sorted = [...STATE_DATA]
    .map(s => ({ ...s, adjustedTakeHome: Math.round(s.takeHome75k * ratio) }))
    .sort((a, b) => {
      if (sortBy === 'takeHome') return b.adjustedTakeHome - a.adjustedTakeHome
      if (sortBy === 'rate') return a.rate - b.rate
      return a.name.localeCompare(b.name)
    })

  const noTax = sorted.filter(s => s.type === 'none')
  const hasTax = sorted.filter(s => s.type !== 'none')

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontSize: '20px' }}>✈️</span>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#2563eb' }}>WagePilot</span>
        </Link>
        <Link href="/salary-calculator" style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
          Full Calculator
        </Link>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>{' / '}
          <span style={{ color: '#0f172a' }}>Salary Comparison</span>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
            📊 Salary Comparison by State 2025
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
            See how much you keep in every US state after income tax, Social Security, and Medicare.
          </p>
        </div>

        {/* Salary input */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Your Annual Salary</label>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2563eb' }}>{fmt(salary)}</span>
          </div>
          <input type="range" min={20000} max={500000} step={5000} value={salary}
            onChange={e => setSalary(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#2563eb', marginBottom: '8px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
            <span>$20,000</span><span>$500,000</span>
          </div>
        </div>

        {/* No tax states */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '800', color: '#166534', marginTop: 0, marginBottom: '4px' }}>
            🎉 No Income Tax States — Keep the Most!
          </h2>
          <p style={{ fontSize: '13px', color: '#15803d', marginBottom: '16px' }}>
            These 8 states have zero state income tax
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
            {noTax.map(s => (
              <Link key={s.slug} href={`/${s.slug}-salary-calculator`}
                style={{ background: 'white', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{s.name}</div>
                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600', marginTop: '2px' }}>No Tax ✓</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#166534', marginTop: '4px' }}>{fmt(s.adjustedTakeHome)}</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>take-home</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sort controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#64748b', alignSelf: 'center' }}>Sort by:</span>
          {[
            { label: 'Take-Home ↓', value: 'takeHome' },
            { label: 'Tax Rate', value: 'rate' },
            { label: 'A-Z', value: 'name' },
          ].map(opt => (
            <button key={opt.value} onClick={() => setSortBy(opt.value as any)}
              style={{ background: sortBy === opt.value ? '#2563eb' : 'white', color: sortBy === opt.value ? 'white' : '#374151', border: '1px solid', borderColor: sortBy === opt.value ? '#2563eb' : '#e2e8f0', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* All states table */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '8px', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            <span>State</span>
            <span style={{ textAlign: 'center', width: '70px' }}>Tax Rate</span>
            <span style={{ textAlign: 'right', width: '110px' }}>Take-Home</span>
            <span style={{ width: '80px' }}></span>
          </div>
          {hasTax.map(s => {
            const diff = s.adjustedTakeHome - Math.round(noTax[0].adjustedTakeHome * ratio / ratio)
            const barWidth = Math.round((s.adjustedTakeHome / (Math.round(maxTakeHome * ratio))) * 100)
            return (
              <div key={s.slug} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '8px', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{s.name}</div>
                  <div style={{ marginTop: '4px', background: '#f1f5f9', borderRadius: '999px', height: '5px', width: '100%', maxWidth: '200px' }}>
                    <div style={{ width: `${barWidth}%`, height: '100%', background: s.rate === 0 ? '#16a34a' : s.rate < 5 ? '#2563eb' : s.rate < 8 ? '#d97706' : '#dc2626', borderRadius: '999px' }} />
                  </div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: s.rate === 0 ? '#16a34a' : s.rate < 5 ? '#2563eb' : s.rate < 8 ? '#d97706' : '#dc2626', textAlign: 'center', width: '70px' }}>
                  {s.rate === 0 ? 'None' : `${s.rate}%`}
                </span>
                <div style={{ textAlign: 'right', width: '110px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{fmt(s.adjustedTakeHome)}</div>
                  <div style={{ fontSize: '11px', color: diff < 0 ? '#dc2626' : '#16a34a' }}>
                    {diff < 0 ? `${fmt(Math.abs(diff))} less` : 'same'}
                  </div>
                </div>
                <Link href={`/${s.slug}-salary-calculator`}
                  style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '5px 10px', textDecoration: 'none', fontSize: '12px', fontWeight: '600', color: '#1d4ed8', textAlign: 'center', width: '80px' }}>
                  Calculate
                </Link>
              </div>
            )
          })}
        </div>

        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px', textAlign: 'center' }}>
          * Estimates for single filer. Includes federal tax, state tax, Social Security (6.2%), and Medicare (1.45%).
        </p>

        {/* CTA */}
        <div style={{ marginTop: '32px', background: 'linear-gradient(135deg, #2563eb, #0891b2)', borderRadius: '16px', padding: '28px', textAlign: 'center', color: 'white' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0 0 8px' }}>Get Your Exact Take-Home Pay</h3>
          <p style={{ margin: '0 0 20px', opacity: 0.85, fontSize: '14px' }}>Our full calculator includes 401k, filing status, and detailed tax breakdown</p>
          <Link href="/salary-calculator" style={{ background: 'white', color: '#2563eb', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', display: 'inline-block' }}>
            Full Salary Calculator →
          </Link>
        </div>
      </div>
    </div>
  )
}
