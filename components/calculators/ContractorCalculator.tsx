'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { formatCurrency, formatPercent, calculateContractor } from '@/lib/tax'
import type { USTaxData, ContractorResult, FilingStatus } from '@/types'

const US_STATES = [
  ['CA','California'],['TX','Texas'],['NY','New York'],['FL','Florida'],['IL','Illinois'],
  ['WA','Washington'],['NV','Nevada'],['CO','Colorado'],['AZ','Arizona'],['GA','Georgia'],
  ['MA','Massachusetts'],['PA','Pennsylvania'],['OH','Ohio'],['NC','North Carolina'],['VA','Virginia'],
]

interface Props { taxData: USTaxData }

export function ContractorCalculator({ taxData }: Props) {
  const [revenue, setRevenue] = useState(120000)
  const [expenses, setExpenses] = useState(20000)
  const [state, setState] = useState('CA')
  const [filing, setFiling] = useState<FilingStatus>('single')
  const [retirement, setRetirement] = useState(0)
  const [healthInsurance, setHealthInsurance] = useState(0)
  const [result, setResult] = useState<ContractorResult | null>(null)

  const calculate = useCallback(() => {
    const r = calculateContractor(
      { annualRevenue: revenue, businessExpenses: expenses, state, filingStatus: filing,
        year: 2025, entityType: 'sole_prop', retirementContribution: retirement, healthInsurance },
      taxData
    )
    setResult(r)
  }, [revenue, expenses, state, filing, retirement, healthInsurance, taxData])

  useEffect(() => { calculate() }, [calculate])

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      {/* Inputs */}
      <div className="wp-card p-6 space-y-5">
        <h2 className="font-sora text-lg font-semibold">Your Contracting Income</h2>

        {/* Revenue */}
        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Annual Revenue</span>
            <span className="font-normal text-muted-foreground">{formatCurrency(revenue)}</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input type="number" value={revenue} onChange={e => setRevenue(Number(e.target.value))}
              min={0} className="w-full rounded-xl border border-border bg-background pl-7 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <input type="range" min={10000} max={1000000} step={5000} value={revenue}
            onChange={e => setRevenue(Number(e.target.value))} className="mt-2 w-full accent-primary" />
        </div>

        {/* Expenses */}
        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Business Expenses</span>
            <span className="font-normal text-muted-foreground">{formatCurrency(expenses)}</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input type="number" value={expenses} onChange={e => setExpenses(Number(e.target.value))}
              min={0} className="w-full rounded-xl border border-border bg-background pl-7 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">State</label>
            <select value={state} onChange={e => setState(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary">
              {US_STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Filing Status</label>
            <select value={filing} onChange={e => setFiling(e.target.value as FilingStatus)}
              className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary">
              <option value="single">Single</option>
              <option value="married_jointly">Married Jointly</option>
              <option value="head_of_household">Head of Household</option>
            </select>
          </div>
        </div>

        {/* Deductions */}
        <div className="rounded-xl border border-border p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Deductions (optional)</p>
          <div>
            <label className="mb-1.5 flex justify-between text-sm font-medium">
              <span>SEP-IRA / Solo 401(k)</span>
              <span className="font-normal text-muted-foreground">{formatCurrency(retirement)}</span>
            </label>
            <input type="range" min={0} max={69000} step={1000} value={retirement}
              onChange={e => setRetirement(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div>
            <label className="mb-1.5 flex justify-between text-sm font-medium">
              <span>Health Insurance Premiums</span>
              <span className="font-normal text-muted-foreground">{formatCurrency(healthInsurance)}</span>
            </label>
            <input type="range" min={0} max={25000} step={500} value={healthInsurance}
              onChange={e => setHealthInsurance(Number(e.target.value))} className="w-full accent-primary" />
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div key={result.netTakeHome} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Key metrics */}
          <div className="wp-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Take-Home (After All Taxes)</p>
                <p className="mt-1 font-sora text-4xl font-bold">{formatCurrency(result.netTakeHome)}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatCurrency(result.netTakeHome / 12)}/mo · {formatCurrency(result.netTakeHome / 52)}/wk
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Effective Tax Rate</p>
                <p className="font-sora text-2xl font-bold text-destructive">{formatPercent(result.effectiveRate)}</p>
              </div>
            </div>
          </div>

          {/* Tax breakdown */}
          <div className="wp-card overflow-hidden p-0">
            <div className="border-b border-border px-5 py-3">
              <h3 className="text-sm font-semibold">Tax Breakdown</h3>
            </div>
            <div className="divide-y divide-border">
              {[
                { label: 'Gross Revenue', value: result.grossRevenue },
                { label: 'Business Expenses', value: -result.businessExpenses },
                { label: 'Net Self-Employment Income', value: result.netSelfEmploymentIncome, bold: true },
                { label: 'Self-Employment Tax (15.3%)', value: -result.selfEmploymentTax, note: '½ deductible' },
                { label: 'Federal Income Tax', value: -result.federalIncomeTax },
                { label: 'State Income Tax', value: -result.stateIncomeTax },
                { label: 'Total Tax Burden', value: -result.totalTaxBurden, bold: true },
                { label: 'Net Take-Home', value: result.netTakeHome, bold: true, green: true },
              ].map(row => (
                <div key={row.label} className={`flex items-center justify-between px-5 py-3 text-sm ${row.bold ? 'bg-muted/30 font-semibold' : ''}`}>
                  <div>
                    <span className={row.bold ? '' : 'text-muted-foreground'}>{row.label}</span>
                    {row.note && <span className="ml-2 text-xs text-primary">({row.note})</span>}
                  </div>
                  <span className={row.value < 0 ? 'text-destructive' : row.green ? 'text-emerald-600' : ''}>
                    {row.value < 0 ? `−${formatCurrency(Math.abs(row.value))}` : formatCurrency(row.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quarterly estimate */}
          <div className="wp-card p-5 border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold">Quarterly Estimated Tax Payment</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  You should pay approximately{' '}
                  <span className="font-bold text-amber-600">{formatCurrency(result.quarterlyEstimatedTax)}</span>{' '}
                  per quarter (Q1: Apr 15, Q2: Jun 15, Q3: Sep 15, Q4: Jan 15) to avoid IRS underpayment penalties.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
