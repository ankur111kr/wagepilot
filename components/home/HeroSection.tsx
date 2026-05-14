'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react'
import { formatCurrency } from '@/lib/tax'

const trust = [
  { icon: Zap, label: 'Instant results' },
  { icon: Shield, label: '2025 tax data' },
  { icon: TrendingUp, label: '10 calculators' },
]

export function HeroSection() {
  const router = useRouter()
  const [salary, setSalary] = useState('')
  const [state, setState] = useState('CA')

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({ salary, state })
    router.push(`/salary-calculator?${params}`)
  }

  return (
    <section className="hero-gradient relative overflow-hidden pb-16 pt-14 sm:pb-24 sm:pt-20">
      {/* Background orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-emerald-500/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Updated for 2025 Tax Year
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl text-center font-sora text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          Know Your Exact{' '}
          <span className="gradient-text">Take-Home Pay</span>
          <br />
          in Seconds
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground"
        >
          Free salary, paycheck, and tax calculators for all 50 US states and the UK.
          Federal, state, Social Security, Medicare — calculated instantly.
        </motion.p>

        {/* Quick calc form */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleCalculate}
          className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              $
            </span>
            <input
              type="number"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              placeholder="Annual salary"
              min={0}
              max={10000000}
              className="w-full rounded-xl border border-border bg-background pl-8 pr-4 py-3.5 text-sm outline-none ring-0 transition focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary sm:w-36"
          >
            <option value="CA">California</option>
            <option value="TX">Texas</option>
            <option value="NY">New York</option>
            <option value="FL">Florida</option>
            <option value="IL">Illinois</option>
            <option value="WA">Washington</option>
            <option value="NV">Nevada</option>
            <option value="CO">Colorado</option>
            <option value="AZ">Arizona</option>
            <option value="GA">Georgia</option>
          </select>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Calculate <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6"
        >
          {trust.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="h-4 w-4 text-primary" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Hero stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-4"
        >
          {[
            { label: 'Avg. US Tax Rate', value: '22%', sub: 'effective federal' },
            { label: 'Take-Home on $75k', value: formatCurrency(56000), sub: 'California, single' },
            { label: 'States Covered', value: '51', sub: 'all states + DC' },
          ].map(card => (
            <div
              key={card.label}
              className="wp-card-glass px-4 py-5 text-center"
            >
              <div className="font-sora text-2xl font-bold text-foreground">{card.value}</div>
              <div className="mt-0.5 text-xs font-medium text-foreground/80">{card.label}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{card.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
