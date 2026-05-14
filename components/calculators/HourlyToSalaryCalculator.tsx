'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight } from 'lucide-react'
import { formatCurrency } from '@/lib/tax'

type Mode = 'hourly-to-salary' | 'salary-to-hourly'

interface ConversionResult {
  hourlyRate: number
  annual: number
  monthly: number
  semiMonthly: number
  biWeekly: number
  weekly: number
  daily: number
}

function convert(value: number, hoursPerWeek: number, mode: Mode): ConversionResult {
  const annualHours = hoursPerWeek * 52
  const workingDays = (hoursPerWeek / 8) * 52

  let hourlyRate: number
  let annual: number

  if (mode === 'hourly-to-salary') {
    hourlyRate = value
    annual = value * annualHours
  } else {
    annual = value
    hourlyRate = value / annualHours
  }

  return {
    hourlyRate,
    annual,
    monthly: annual / 12,
    semiMonthly: annual / 24,
    biWeekly: annual / 26,
    weekly: annual / 52,
    daily: annual / workingDays,
  }
}

export function HourlyToSalaryCalculator() {
  const [mode, setMode] = useState<Mode>('hourly-to-salary')
  const [value, setValue] = useState(25)
  const [hoursPerWeek, setHoursPerWeek] = useState(40)
  const [result, setResult] = useState<ConversionResult | null>(null)

  const calculate = useCallback(() => {
    setResult(convert(value, hoursPerWeek, mode))
  }, [value, hoursPerWeek, mode])

  useEffect(() => { calculate() }, [calculate])

  const toggleMode = () => {
    if (result) {
      // Flip value to the converted amount
      const newValue = mode === 'hourly-to-salary' ? result.annual : result.hourlyRate
      setMode(m => m === 'hourly-to-salary' ? 'salary-to-hourly' : 'hourly-to-salary')
      setValue(Math.round(newValue * 100) / 100)
    }
  }

  const inputLabel = mode === 'hourly-to-salary' ? 'Hourly Rate' : 'Annual Salary'
  const inputPrefix = mode === 'hourly-to-salary' ? '$' : '$'
  const inputSuffix = mode === 'hourly-to-salary' ? '/hr' : '/yr'

  const periods = result ? [
    { label: 'Hourly', value: result.hourlyRate, period: 'per hour' },
    { label: 'Daily', value: result.daily, period: 'per day' },
    { label: 'Weekly', value: result.weekly, period: 'per week' },
    { label: 'Bi-Weekly', value: result.biWeekly, period: 'every 2 weeks' },
    { label: 'Semi-Monthly', value: result.semiMonthly, period: 'twice per month' },
    { label: 'Monthly', value: result.monthly, period: 'per month' },
    { label: 'Annual', value: result.annual, period: 'per year', highlight: true },
  ] : []

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Input Panel */}
      <div className="wp-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-sora text-lg font-semibold">
            {mode === 'hourly-to-salary' ? 'Hourly → Salary' : 'Salary → Hourly'}
          </h2>
          <button
            onClick={toggleMode}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" /> Flip
          </button>
        </div>

        {/* Main value input */}
        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>{inputLabel}</span>
            <span className="font-normal text-muted-foreground">
              {mode === 'hourly-to-salary'
                ? `${formatCurrency(value)}/hr`
                : formatCurrency(value)}
            </span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-medium text-muted-foreground">
              {inputPrefix}
            </span>
            <input
              type="number"
              value={value}
              onChange={e => setValue(Number(e.target.value))}
              min={0}
              step={mode === 'hourly-to-salary' ? 0.25 : 1000}
              className="w-full rounded-xl border border-border bg-background pl-7 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <input
            type="range"
            min={mode === 'hourly-to-salary' ? 7.25 : 20000}
            max={mode === 'hourly-to-salary' ? 200 : 500000}
            step={mode === 'hourly-to-salary' ? 0.25 : 1000}
            value={value}
            onChange={e => setValue(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </div>

        {/* Hours per week */}
        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Hours Per Week</span>
            <span className="font-normal text-muted-foreground">{hoursPerWeek} hrs</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[20, 30, 40, 50].map(h => (
              <button
                key={h}
                onClick={() => setHoursPerWeek(h)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  hoursPerWeek === h
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
          <input
            type="range"
            min={1}
            max={80}
            value={hoursPerWeek}
            onChange={e => setHoursPerWeek(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </div>

        {/* Quick reference */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Common Benchmarks
          </p>
          <div className="space-y-1">
            {[
              { label: 'US Minimum Wage', hourly: 7.25 },
              { label: 'US Median Wage', hourly: 22.50 },
              { label: 'US $100k salary', hourly: 48.08 },
            ].map(b => (
              <button
                key={b.label}
                onClick={() => {
                  setMode('hourly-to-salary')
                  setValue(b.hourly)
                }}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <span>{b.label}</span>
                <span className="font-mono">{formatCurrency(b.hourly)}/hr</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          key={`${result.annual}-${mode}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Hero result */}
          <div className="wp-card p-6">
            <p className="text-sm text-muted-foreground">
              {mode === 'hourly-to-salary' ? 'Equivalent Annual Salary' : 'Equivalent Hourly Rate'}
            </p>
            <p className="mt-1 font-sora text-4xl font-bold tracking-tight">
              {mode === 'hourly-to-salary'
                ? formatCurrency(result.annual)
                : `${formatCurrency(result.hourlyRate)}/hr`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on {hoursPerWeek} hours/week × 52 weeks
            </p>
          </div>

          {/* All periods table */}
          <div className="wp-card overflow-hidden p-0">
            <div className="border-b border-border px-5 py-3">
              <h3 className="text-sm font-semibold">All Pay Periods</h3>
            </div>
            <div className="divide-y divide-border">
              {periods.map(row => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    row.highlight ? 'bg-primary/5 font-semibold' : ''
                  }`}
                >
                  <div>
                    <span className={`text-sm ${row.highlight ? '' : 'text-muted-foreground'}`}>
                      {row.label}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">({row.period})</span>
                  </div>
                  <span className={`font-sora text-sm font-semibold ${row.highlight ? 'text-primary text-base' : ''}`}>
                    {formatCurrency(row.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Annual equivalents at different hours */}
          <div className="wp-card p-5">
            <h3 className="mb-3 text-sm font-semibold">Annual Salary at Different Hours</h3>
            <div className="space-y-2">
              {[20, 25, 30, 35, 40, 45, 50].map(hrs => {
                const annual = result.hourlyRate * hrs * 52
                const isSelected = hrs === hoursPerWeek
                return (
                  <div
                    key={hrs}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                      isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'
                    }`}
                  >
                    <span className={`w-16 text-xs ${isSelected ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                      {hrs} hrs/wk
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60 transition-all"
                        style={{ width: `${Math.min(100, (annual / (result.hourlyRate * 50 * 52)) * 100)}%` }}
                      />
                    </div>
                    <span className={`w-24 text-right text-xs font-medium ${isSelected ? 'text-primary' : ''}`}>
                      {formatCurrency(annual)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
