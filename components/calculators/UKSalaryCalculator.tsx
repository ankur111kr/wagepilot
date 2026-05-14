'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Share2, Download } from 'lucide-react'
import { formatCurrency, formatPercent, calculateUKNetPay } from '@/lib/tax'
import type { UKTaxData, UKSalaryResult } from '@/types'

interface Props {
  taxData: UKTaxData
  defaultSalary?: number
}

export function UKSalaryCalculator({ taxData, defaultSalary = 45000 }: Props) {
  const [salary, setSalary] = useState(defaultSalary)
  const [region, setRegion] = useState<'england' | 'scotland' | 'wales' | 'northern_ireland'>('england')
  const [pensionPct, setPensionPct] = useState(5)
  const [studentLoan, setStudentLoan] = useState<string>('none')
  const [result, setResult] = useState<UKSalaryResult | null>(null)
  const [copied, setCopied] = useState(false)

  const calculate = useCallback(() => {
    const r = calculateUKNetPay(
      {
        grossSalary: salary,
        region,
        year: 2025,
        pensionContribution: pensionPct,
        pensionContributionType: 'percentage',
        studentLoanPlan: studentLoan as any,
      },
      taxData
    )
    setResult(r)
  }, [salary, region, pensionPct, studentLoan, taxData])

  useEffect(() => { calculate() }, [calculate])

  const handleCopy = async () => {
    if (!result) return
    const text = `WagePilot UK Results\nGross: £${result.grossAnnual.toLocaleString()}\nIncome Tax: £${result.incomeTax.toLocaleString()}\nNational Insurance: £${result.nationalInsurance.toLocaleString()}\nNet: £${result.netAnnual.toLocaleString()}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Input */}
      <div className="wp-card p-6">
        <h2 className="mb-5 font-sora text-lg font-semibold">Your Information</h2>
        <div className="space-y-5">
          {/* Salary */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Annual Salary (£)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-medium text-muted-foreground">£</span>
              <input
                type="number"
                value={salary}
                onChange={e => setSalary(Number(e.target.value))}
                min={0}
                max={2000000}
                className="w-full rounded-xl border border-border bg-background pl-8 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <input
              type="range"
              min={12571}
              max={200000}
              step={500}
              value={salary}
              onChange={e => setSalary(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
          </div>

          {/* Region */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Region</label>
            <select
              value={region}
              onChange={e => setRegion(e.target.value as any)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="england">England</option>
              <option value="scotland">Scotland</option>
              <option value="wales">Wales</option>
              <option value="northern_ireland">Northern Ireland</option>
            </select>
          </div>

          {/* Pension */}
          <div>
            <label className="mb-1.5 flex justify-between text-sm font-medium">
              <span>Pension Contribution</span>
              <span className="font-normal text-muted-foreground">{pensionPct}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={pensionPct}
              onChange={e => setPensionPct(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground"><span>0%</span><span>30%</span></div>
          </div>

          {/* Student loan */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Student Loan Plan</label>
            <select
              value={studentLoan}
              onChange={e => setStudentLoan(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="none">No student loan</option>
              <option value="plan1">Plan 1 (pre-2012)</option>
              <option value="plan2">Plan 2 (post-2012)</option>
              <option value="plan4">Plan 4 (Scotland)</option>
              <option value="plan5">Plan 5 (from Aug 2023)</option>
              <option value="postgraduate">Postgraduate Loan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <motion.div
            key={result.netAnnual}
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="wp-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Annual Take-Home Pay</p>
                <p className="mt-1 font-sora text-4xl font-bold">
                  £{Math.round(result.netAnnual).toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  £{Math.round(result.perPaycheck.monthly).toLocaleString()}/mo
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Effective Rate</p>
                <p className="font-sora text-2xl font-bold text-destructive">
                  {formatPercent(result.effectiveTotalRate)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent">
                <Download className="h-3.5 w-3.5" /> Print
              </button>
            </div>
          </motion.div>

          {/* Breakdown */}
          <div className="wp-card overflow-hidden p-0">
            <div className="border-b border-border px-5 py-3">
              <h3 className="text-sm font-semibold">PAYE Breakdown</h3>
            </div>
            <div className="divide-y divide-border">
              {[
                { label: 'Gross Salary', value: result.grossAnnual },
                { label: 'Income Tax (PAYE)', value: -result.incomeTax, rate: result.effectiveIncomeTaxRate },
                { label: 'National Insurance', value: -result.nationalInsurance, rate: result.effectiveNIRate },
                result.pensionContribution > 0 && { label: 'Pension Contribution', value: -result.pensionContribution },
                result.studentLoanRepayment > 0 && { label: 'Student Loan', value: -result.studentLoanRepayment },
                { label: 'Take-Home Pay', value: result.netAnnual, highlight: true },
              ].filter(Boolean).map((row: any) => (
                <div key={row.label} className={`flex items-center justify-between px-5 py-3 text-sm ${row.highlight ? 'bg-primary/5 font-semibold' : ''}`}>
                  <span className={row.highlight ? '' : 'text-muted-foreground'}>
                    {row.label}
                    {row.rate !== undefined && (
                      <span className="ml-1.5 text-xs font-normal opacity-60">({formatPercent(row.rate)})</span>
                    )}
                  </span>
                  <span className={row.value < 0 ? 'text-destructive' : row.highlight ? 'text-primary' : ''}>
                    {row.value < 0 ? `−£${Math.round(Math.abs(row.value)).toLocaleString()}` : `£${Math.round(row.value).toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Band breakdown */}
          {result.bandBreakdown.length > 0 && (
            <div className="wp-card p-5">
              <h3 className="mb-3 text-sm font-semibold">Income Tax Band Breakdown</h3>
              <div className="space-y-2">
                {result.bandBreakdown.map(band => (
                  <div key={band.band} className="flex items-center gap-3">
                    <div className="w-28 text-xs text-muted-foreground">{band.band}</div>
                    <div className="flex-1 overflow-hidden rounded-full bg-muted h-2">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(band.taxableAmount / result.grossAnnual) * 100}%` }}
                      />
                    </div>
                    <div className="w-20 text-right text-xs font-medium">
                      £{Math.round(band.taxAmount).toLocaleString()}
                    </div>
                    <div className="w-10 text-right text-xs text-muted-foreground">
                      {(band.rate * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
