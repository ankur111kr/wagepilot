'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Share2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency, formatPercent, calculateUSNetPay } from '@/lib/tax'
import { TaxBreakdownChart } from '@/components/charts/TaxBreakdownChart'
import { PaycheckBarChart } from '@/components/charts/PaycheckBarChart'
import type { USTaxData, USSalaryResult, FilingStatus } from '@/types'

interface SalaryCalculatorProps {
  taxData: USTaxData
  defaultSalary?: number
  defaultState?: string
}

const US_STATES = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],
  ['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],
  ['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
  ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],
  ['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],
  ['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],
  ['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],
  ['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
  ['DC','Washington D.C.'],
]

const FILING_STATUSES: { value: FilingStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'married_jointly', label: 'Married Filing Jointly' },
  { value: 'married_separately', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
]

export function SalaryCalculator({ taxData, defaultSalary = 75000, defaultState = 'CA' }: SalaryCalculatorProps) {
  const [salary, setSalary] = useState(defaultSalary)
  const [state, setState] = useState(defaultState)
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')
  const [contribution401k, setContribution401k] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<USSalaryResult | null>(null)
  const [copied, setCopied] = useState(false)

  const calculate = useCallback(() => {
    const r = calculateUSNetPay(
      { grossSalary: salary, state, filingStatus, payFrequency: 'annual', year: 2025, contribution401k },
      taxData
    )
    setResult(r)
  }, [salary, state, filingStatus, contribution401k, taxData])

  useEffect(() => { calculate() }, [calculate])

  const handleCopy = async () => {
    if (!result) return
    const text = `WagePilot Results\nGross: ${formatCurrency(result.grossAnnual)}\nFederal Tax: ${formatCurrency(result.federalTax)}\nState Tax: ${formatCurrency(result.stateTax)}\nSocial Security: ${formatCurrency(result.socialSecurity)}\nMedicare: ${formatCurrency(result.medicare)}\nNet Take-Home: ${formatCurrency(result.netAnnual)}\nEffective Rate: ${formatPercent(result.effectiveTotalRate)}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const url = new URL(window.location.href)
    url.searchParams.set('salary', salary.toString())
    url.searchParams.set('state', state)
    url.searchParams.set('filing', filingStatus)
    if (navigator.share) {
      await navigator.share({ title: 'My WagePilot Calculation', url: url.toString() })
    } else {
      await navigator.clipboard.writeText(url.toString())
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* ── Input Panel ─────────────────────────────────────── */}
      <div className="wp-card p-6">
        <h2 className="mb-5 font-sora text-lg font-semibold">Your Information</h2>

        <div className="space-y-5">
          {/* Salary */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Annual Salary</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
              <input
                type="number"
                value={salary}
                onChange={e => setSalary(Number(e.target.value))}
                min={0}
                max={10000000}
                className="w-full rounded-xl border border-border bg-background pl-8 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <input
              type="range"
              min={20000}
              max={500000}
              step={1000}
              value={salary}
              onChange={e => setSalary(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$20k</span><span>$500k</span>
            </div>
          </div>

          {/* State */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">State</label>
            <select
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {US_STATES.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          {/* Filing Status */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Filing Status</label>
            <div className="grid grid-cols-2 gap-2">
              {FILING_STATUSES.map(fs => (
                <button
                  key={fs.value}
                  onClick={() => setFilingStatus(fs.value)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                    filingStatus === fs.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  {fs.label}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced toggle */}
          <button
            onClick={() => setShowAdvanced(v => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent"
          >
            <span>Advanced Options</span>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-4"
              >
                {/* 401k */}
                <div>
                  <label className="mb-1.5 flex items-center justify-between text-sm font-medium">
                    <span>401(k) Contribution</span>
                    <span className="font-normal text-muted-foreground">{formatCurrency(contribution401k)}/yr</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={taxData.retirement['401k'].employeeLimit}
                    step={500}
                    value={contribution401k}
                    onChange={e => setContribution401k(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$0</span>
                    <span>Max: {formatCurrency(taxData.retirement['401k'].employeeLimit)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Results Panel ────────────────────────────────────── */}
      <div className="space-y-4">
        {result && (
          <>
            {/* Net pay highlight */}
            <motion.div
              key={result.netAnnual}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="wp-card p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Annual Take-Home Pay</p>
                  <p className="mt-1 font-sora text-4xl font-bold tracking-tight text-foreground">
                    {formatCurrency(result.netAnnual)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatCurrency(result.perPaycheck.monthly)}/mo · {formatCurrency(result.perPaycheck.biWeekly)}/biweekly
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Effective Rate</p>
                  <p className="font-sora text-2xl font-bold text-destructive">
                    {formatPercent(result.effectiveTotalRate)}
                  </p>
                  <p className="text-xs text-muted-foreground">of gross income</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
                >
                  <Download className="h-3.5 w-3.5" /> Print
                </button>
              </div>
            </motion.div>

            {/* Breakdown table */}
            <div className="wp-card overflow-hidden p-0">
              <div className="border-b border-border px-5 py-3">
                <h3 className="text-sm font-semibold">Tax Breakdown</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { label: 'Gross Income', value: result.grossAnnual, highlight: false },
                  { label: 'Federal Income Tax', value: -result.federalTax, rate: result.effectiveFederalRate, highlight: false },
                  { label: `${US_STATES.find(s=>s[0]===state)?.[1]} State Tax`, value: -result.stateTax, rate: result.effectiveStateRate, highlight: false },
                  { label: 'Social Security (6.2%)', value: -result.socialSecurity, highlight: false },
                  { label: 'Medicare (1.45%)', value: -result.medicare, highlight: false },
                  { label: 'Take-Home Pay', value: result.netAnnual, highlight: true },
                ].map(row => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between px-5 py-3 text-sm ${row.highlight ? 'bg-primary/5 font-semibold' : ''}`}
                  >
                    <span className={row.highlight ? 'text-foreground' : 'text-muted-foreground'}>
                      {row.label}
                      {row.rate !== undefined && (
                        <span className="ml-1.5 text-xs font-normal opacity-60">
                          ({formatPercent(row.rate)})
                        </span>
                      )}
                    </span>
                    <span className={row.value < 0 ? 'text-destructive' : row.highlight ? 'text-primary' : 'text-foreground'}>
                      {row.value < 0 ? `−${formatCurrency(Math.abs(row.value))}` : formatCurrency(row.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="wp-card p-4">
                <h3 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tax Distribution</h3>
                <TaxBreakdownChart result={result} />
              </div>
              <div className="wp-card p-4">
                <h3 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Per Paycheck</h3>
                <PaycheckBarChart result={result} />
              </div>
            </div>

            {/* Marginal rates info */}
            <div className="wp-card p-5">
              <h3 className="mb-3 text-sm font-semibold">Your Tax Rates</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Marginal Federal', value: formatPercent(result.marginalFederalRate) },
                  { label: 'Effective Federal', value: formatPercent(result.effectiveFederalRate) },
                  { label: 'State Rate', value: formatPercent(result.effectiveStateRate) },
                  { label: 'Total Effective', value: formatPercent(result.effectiveTotalRate) },
                ].map(item => (
                  <div key={item.label} className="rounded-lg bg-muted/50 p-3 text-center">
                    <div className="font-sora text-xl font-bold">{item.value}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
