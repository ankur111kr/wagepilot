'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency, formatPercent, calculateOvertime } from '@/lib/tax'
import type { USTaxData, OvertimeResult } from '@/types'

interface Props {
  taxData: USTaxData
}

const US_STATES = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['CA','California'],['CO','Colorado'],
  ['FL','Florida'],['GA','Georgia'],['IL','Illinois'],['NY','New York'],['TX','Texas'],
  ['WA','Washington'],['NV','Nevada'],['OR','Oregon'],['PA','Pennsylvania'],['OH','Ohio'],
]

export function OvertimeCalculator({ taxData }: Props) {
  const [regularHours, setRegularHours] = useState(40)
  const [overtimeHours, setOvertimeHours] = useState(10)
  const [hourlyRate, setHourlyRate] = useState(25)
  const [multiplier, setMultiplier] = useState(1.5)
  const [state, setState] = useState('TX')
  const [result, setResult] = useState<OvertimeResult | null>(null)

  const calculate = useCallback(() => {
    const r = calculateOvertime(
      { regularHours, overtimeHours, hourlyRate, overtimeMultiplier: multiplier, state, filingStatus: 'single' },
      taxData
    )
    setResult(r)
  }, [regularHours, overtimeHours, hourlyRate, multiplier, state, taxData])

  useEffect(() => { calculate() }, [calculate])

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      {/* Inputs */}
      <div className="wp-card p-6 space-y-5">
        <h2 className="font-sora text-lg font-semibold">Overtime Details</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Regular Hours/Week</label>
            <input type="number" value={regularHours} onChange={e => setRegularHours(Number(e.target.value))}
              min={1} max={168} className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Overtime Hours/Week</label>
            <input type="number" value={overtimeHours} onChange={e => setOvertimeHours(Number(e.target.value))}
              min={0} max={100} className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Hourly Rate</span>
            <span className="font-normal text-muted-foreground">{formatCurrency(hourlyRate)}/hr</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input type="number" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))}
              min={7.25} max={500} step={0.25}
              className="w-full rounded-xl border border-border bg-background pl-7 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <input type="range" min={7.25} max={200} step={0.25} value={hourlyRate}
            onChange={e => setHourlyRate(Number(e.target.value))} className="mt-2 w-full accent-primary" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Overtime Multiplier</label>
          <div className="grid grid-cols-3 gap-2">
            {[1.5, 2.0, 2.5].map(m => (
              <button key={m} onClick={() => setMultiplier(m)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  multiplier === m ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                }`}>
                {m}× {m === 1.5 ? '(Standard)' : m === 2.0 ? '(Double)' : '(2.5×)'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">State</label>
          <select value={state} onChange={e => setState(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary">
            {US_STATES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div key={result.grossPay} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Regular Pay', value: result.regularPay, color: 'text-foreground' },
              { label: 'Overtime Pay', value: result.overtimePay, color: 'text-amber-500' },
              { label: 'Gross Pay', value: result.grossPay, color: 'text-foreground font-bold' },
              { label: 'Net Take-Home', value: result.netPay, color: 'text-emerald-600 font-bold' },
            ].map(card => (
              <div key={card.label} className="wp-card p-4">
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className={`mt-1 font-sora text-2xl font-bold ${card.color}`}>{formatCurrency(card.value)}</p>
                <p className="text-xs text-muted-foreground">this week</p>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="wp-card overflow-hidden p-0">
            <div className="border-b border-border px-5 py-3">
              <h3 className="text-sm font-semibold">Weekly Breakdown</h3>
            </div>
            <div className="divide-y divide-border">
              {[
                { label: `Regular Pay (${regularHours}h × ${formatCurrency(hourlyRate)})`, value: result.regularPay },
                { label: `Overtime Pay (${overtimeHours}h × ${formatCurrency(hourlyRate * multiplier)})`, value: result.overtimePay },
                { label: 'Gross Pay', value: result.grossPay, bold: true },
                { label: 'Federal Tax (est.)', value: -result.federalTax },
                { label: 'State Tax (est.)', value: -result.stateTax },
                { label: 'FICA (SS + Medicare)', value: -result.ficaTax },
                { label: 'Net Take-Home', value: result.netPay, bold: true, green: true },
              ].map(row => (
                <div key={row.label} className={`flex justify-between px-5 py-3 text-sm ${row.bold ? 'font-semibold' : ''}`}>
                  <span className={row.bold ? 'text-foreground' : 'text-muted-foreground'}>{row.label}</span>
                  <span className={row.value < 0 ? 'text-destructive' : row.green ? 'text-emerald-600' : ''}>
                    {row.value < 0 ? `−${formatCurrency(Math.abs(row.value))}` : formatCurrency(row.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Annual projection */}
          <div className="wp-card p-5">
            <h3 className="mb-3 text-sm font-semibold">Annual Projection (52 weeks)</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Gross Annual', value: result.grossPay * 52 },
                { label: 'Total Taxes', value: (result.federalTax + result.stateTax + result.ficaTax) * 52 },
                { label: 'Net Annual', value: result.netPay * 52 },
              ].map(item => (
                <div key={item.label} className="rounded-lg bg-muted/50 p-3 text-center">
                  <div className="font-sora text-lg font-bold">{formatCurrency(item.value, 'USD', true)}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            * Tax estimates are annualized projections. Actual withholding may differ based on W-4 allowances and year-to-date earnings.
          </p>
        </motion.div>
      )}
    </div>
  )
}
