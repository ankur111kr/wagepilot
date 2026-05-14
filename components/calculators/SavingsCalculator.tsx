'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatCurrency } from '@/lib/tax'

interface SavingsResult {
  finalBalance: number
  totalContributions: number
  totalInterest: number
  yearlyData: { year: number; balance: number; contributions: number; interest: number }[]
}

function calculateSavings(
  initialDeposit: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
): SavingsResult {
  const monthlyRate = annualRate / 100 / 12
  let balance = initialDeposit
  let totalContributions = initialDeposit
  const yearlyData = []

  for (let year = 1; year <= years; year++) {
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution
      totalContributions += monthlyContribution
    }
    yearlyData.push({
      year,
      balance: Math.round(balance),
      contributions: Math.round(totalContributions),
      interest: Math.round(balance - totalContributions),
    })
  }

  return {
    finalBalance: balance,
    totalContributions,
    totalInterest: balance - totalContributions,
    yearlyData,
  }
}

export function SavingsCalculator() {
  const [initial, setInitial] = useState(5000)
  const [monthly, setMonthly] = useState(500)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(20)
  const [result, setResult] = useState<SavingsResult | null>(null)

  const calculate = useCallback(() => {
    setResult(calculateSavings(initial, monthly, rate, years))
  }, [initial, monthly, rate, years])

  useEffect(() => { calculate() }, [calculate])

  const chartData = result?.yearlyData.map(d => ({
    year: `Y${d.year}`,
    'Total Balance': d.balance,
    'Contributions': d.contributions,
    'Interest Earned': d.interest,
  })) ?? []

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      {/* Inputs */}
      <div className="wp-card p-6 space-y-5">
        <h2 className="font-sora text-lg font-semibold">Savings Parameters</h2>

        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Initial Deposit</span>
            <span className="font-normal text-muted-foreground">{formatCurrency(initial)}</span>
          </label>
          <input type="range" min={0} max={100000} step={500} value={initial}
            onChange={e => setInitial(Number(e.target.value))} className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>$0</span><span>$100k</span></div>
        </div>

        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Monthly Contribution</span>
            <span className="font-normal text-muted-foreground">{formatCurrency(monthly)}/mo</span>
          </label>
          <input type="range" min={0} max={5000} step={50} value={monthly}
            onChange={e => setMonthly(Number(e.target.value))} className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>$0</span><span>$5,000</span></div>
        </div>

        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Annual Return Rate</span>
            <span className="font-normal text-muted-foreground">{rate}%</span>
          </label>
          <input type="range" min={0.5} max={15} step={0.1} value={rate}
            onChange={e => setRate(Number(e.target.value))} className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.5% (HYSA)</span><span>10%+ (Market)</span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Time Period</span>
            <span className="font-normal text-muted-foreground">{years} years</span>
          </label>
          <input type="range" min={1} max={50} step={1} value={years}
            onChange={e => setYears(Number(e.target.value))} className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1 yr</span><span>50 yrs</span></div>
        </div>

        {/* Quick presets */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Quick Presets</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Emergency Fund', initial: 1000, monthly: 200, rate: 5, years: 3 },
              { label: '401k Growth', initial: 10000, monthly: 1500, rate: 7, years: 30 },
              { label: 'House Down', initial: 5000, monthly: 800, rate: 4, years: 5 },
            ].map(preset => (
              <button key={preset.label} onClick={() => {
                setInitial(preset.initial); setMonthly(preset.monthly)
                setRate(preset.rate); setYears(preset.years)
              }} className="rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div key={result.finalBalance} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="wp-card p-6">
            <p className="text-sm text-muted-foreground">Balance after {years} years</p>
            <p className="mt-1 font-sora text-4xl font-bold tracking-tight">{formatCurrency(result.finalBalance)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Your Contributions</p>
                <p className="font-sora text-xl font-semibold text-foreground">{formatCurrency(result.totalContributions)}</p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary"
                    style={{ width: `${(result.totalContributions / result.finalBalance) * 100}%` }} />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Interest Earned</p>
                <p className="font-sora text-xl font-semibold text-emerald-600">{formatCurrency(result.totalInterest)}</p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${(result.totalInterest / result.finalBalance) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Area chart */}
          <div className="wp-card p-5">
            <h3 className="mb-4 text-sm font-semibold">Growth Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                  interval={Math.floor(years / 5)} />
                <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }}
                  tickLine={false} axisLine={false} width={48} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), '']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--popover))', color: 'hsl(var(--foreground))', fontSize: '12px' }} />
                <Area type="monotone" dataKey="Contributions" stackId="1" stroke="#3b82f6"
                  fill="#3b82f6" fillOpacity={0.3} strokeWidth={1.5} />
                <Area type="monotone" dataKey="Interest Earned" stackId="1" stroke="#10b981"
                  fill="#10b981" fillOpacity={0.4} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Milestone table */}
          <div className="wp-card overflow-hidden p-0">
            <div className="border-b border-border px-5 py-3">
              <h3 className="text-sm font-semibold">Milestones</h3>
            </div>
            <div className="divide-y divide-border">
              {result.yearlyData
                .filter((_, i) => [4, 9, 14, 19, 24, 29, 39, 49].includes(i) && i < years)
                .map(row => (
                  <div key={row.year} className="flex justify-between px-5 py-2.5 text-sm">
                    <span className="text-muted-foreground">Year {row.year}</span>
                    <span className="font-medium">{formatCurrency(row.balance)}</span>
                    <span className="text-emerald-600 text-xs">+{formatCurrency(row.interest)} interest</span>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
