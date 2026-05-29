'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SharedNav } from '@/components/layout/SharedNav'
import { SharedFooter } from '@/components/layout/SharedFooter'

const STATES = [
  {code:'AK',name:'Alaska',rate:0},{code:'FL',name:'Florida',rate:0},{code:'NV',name:'Nevada',rate:0},
  {code:'SD',name:'South Dakota',rate:0},{code:'TN',name:'Tennessee',rate:0},{code:'TX',name:'Texas',rate:0},
  {code:'WA',name:'Washington',rate:0},{code:'WY',name:'Wyoming',rate:0},{code:'NH',name:'New Hampshire',rate:0},
  {code:'AZ',name:'Arizona',rate:2.5},{code:'IN',name:'Indiana',rate:3.0},{code:'PA',name:'Pennsylvania',rate:3.07},
  {code:'CO',name:'Colorado',rate:4.4},{code:'MI',name:'Michigan',rate:4.25},{code:'UT',name:'Utah',rate:4.55},
  {code:'IL',name:'Illinois',rate:4.95},{code:'KY',name:'Kentucky',rate:4.0},{code:'MA',name:'Massachusetts',rate:5.0},
  {code:'NC',name:'North Carolina',rate:4.49},{code:'GA',name:'Georgia',rate:5.5},
  {code:'VA',name:'Virginia',rate:5.75},{code:'MO',name:'Missouri',rate:4.8},{code:'OH',name:'Ohio',rate:3.99},
  {code:'WI',name:'Wisconsin',rate:7.65},{code:'MD',name:'Maryland',rate:5.75},{code:'CT',name:'Connecticut',rate:6.99},
  {code:'SC',name:'South Carolina',rate:6.4},{code:'ID',name:'Idaho',rate:5.8},{code:'LA',name:'Louisiana',rate:4.25},
  {code:'MN',name:'Minnesota',rate:9.85},{code:'OR',name:'Oregon',rate:9.9},{code:'NJ',name:'New Jersey',rate:10.75},
  {code:'NY',name:'New York',rate:6.85},{code:'VT',name:'Vermont',rate:8.75},{code:'HI',name:'Hawaii',rate:11.0},
  {code:'CA',name:'California',rate:9.3},
]

function calcNet(gross: number, stateRate: number) {
  const stdDed = 15000
  const taxable = Math.max(0, gross - stdDed)
  const brackets: [number,number][] = [[11925,0.10],[48475,0.12],[103350,0.22],[197300,0.24],[250525,0.32],[626350,0.35],[Infinity,0.37]]
  let fed = 0, prev = 0
  for (const [limit, rate] of brackets) {
    if (taxable <= prev) break
    fed += (Math.min(taxable, limit) - prev) * rate
    prev = limit
  }
  const state = gross * stateRate / 100
  const fica = Math.min(gross, 176100) * 0.062 + gross * 0.0145
  return Math.round(gross - fed - state - fica)
}

function fmt(n: number) { return '$' + n.toLocaleString('en-US') }

export default function SalaryComparisonPage() {
  const [salary, setSalary] = useState(75000)
  const [sortBy, setSortBy] = useState<'net'|'rate'|'name'>('net')

  const data = STATES.map(s => ({ ...s, net: calcNet(salary, s.rate), monthly: Math.round(calcNet(salary, s.rate) / 12) }))
  const sorted = [...data].sort((a, b) => sortBy === 'net' ? b.net - a.net : sortBy === 'rate' ? a.rate - b.rate : a.name.localeCompare(b.name))
  const maxNet = Math.max(...data.map(s => s.net))
  const noTax = sorted.filter(s => s.rate === 0)
  const hasTax = sorted.filter(s => s.rate > 0)

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <SharedNav />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }}>
        <nav style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>{' / '}
          <span style={{ color: '#0f172a' }}>Salary Comparison</span>
        </nav>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>📊 Salary Comparison by State</h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Compare take-home pay across all US states after federal and state income tax.</p>
        </div>

        {/* Salary slider */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Annual Salary</label>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2563eb' }}>{fmt(salary)}</span>
          </div>
          <input type="range" min={20000} max={500000} step={5000} value={salary}
            onChange={e => setSalary(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6', marginBottom: '6px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
            <span>$20,000</span><span>$500,000</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            {[50000, 75000, 100000, 150000, 200000].map(s => (
              <button key={s} onClick={() => setSalary(s)}
                style={{ background: salary === s ? '#2563eb' : '#f1f5f9', color: salary === s ? 'white' : '#64748b', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                {fmt(s)}
              </button>
            ))}
          </div>
        </div>

        {/* No tax states */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#166534', margin: '0 0 14px' }}>🎉 No Income Tax States — Keep the Most!</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
            {noTax.map(s => (
              <Link key={s.code} href={`/${s.name.toLowerCase().replace(/\s+/g, '-')}-salary-calculator`}
                style={{ background: 'white', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{s.name}</div>
                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600', marginTop: '2px' }}>No Tax ✓</div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: '#166534', marginTop: '4px' }}>{fmt(s.net)}</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>{fmt(s.monthly)}/mo</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sort controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Sort by:</span>
          {[{ label: 'Take-Home ↓', value: 'net' }, { label: 'Tax Rate', value: 'rate' }, { label: 'A–Z', value: 'name' }].map(opt => (
            <button key={opt.value} onClick={() => setSortBy(opt.value as any)}
              style={{ background: sortBy === opt.value ? '#2563eb' : 'white', color: sortBy === opt.value ? 'white' : '#374151', border: `1px solid ${sortBy === opt.value ? '#2563eb' : '#e2e8f0'}`, borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* All states table */}
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 110px 80px', gap: '8px', padding: '10px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            <span>State</span><span style={{ textAlign: 'center' }}>Tax Rate</span><span style={{ textAlign: 'right' }}>Take-Home</span><span style={{ textAlign: 'center' }}>Action</span>
          </div>
          {hasTax.map(s => {
            const diff = s.net - noTax[0]?.net
            const barW = Math.round((s.net / maxNet) * 100)
            const rateColor = s.rate === 0 ? '#10b981' : s.rate < 5 ? '#3b82f6' : s.rate < 8 ? '#f59e0b' : '#ef4444'
            return (
              <div key={s.code} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 110px 80px', gap: '8px', alignItems: 'center', padding: '10px 18px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{s.name}</div>
                  <div style={{ marginTop: '4px', background: '#f1f5f9', borderRadius: '999px', height: '4px', maxWidth: '160px' }}>
                    <div style={{ width: `${barW}%`, height: '100%', background: rateColor, borderRadius: '999px' }} />
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: rateColor, textAlign: 'center' }}>{s.rate}%</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{fmt(s.net)}</div>
                  <div style={{ fontSize: '10px', color: diff < 0 ? '#ef4444' : '#10b981', fontWeight: '600' }}>
                    {diff < 0 ? `−${fmt(Math.abs(diff))} less` : 'same'}
                  </div>
                </div>
                <Link href={`/${s.name.toLowerCase().replace(/\s+/g, '-')}-salary-calculator`}
                  style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '5px 8px', textDecoration: 'none', fontSize: '11px', fontWeight: '600', color: '#2563eb', textAlign: 'center' }}>
                  Calc
                </Link>
              </div>
            )
          })}
        </div>
        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px', textAlign: 'center' }}>
          * Estimates for single filer with standard deduction. Includes federal, state, Social Security & Medicare.
        </p>
      </div>
      <SharedFooter />
    </div>
  )
}
