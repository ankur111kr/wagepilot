'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  DollarSign,
  Clock,
  Briefcase,
  TrendingUp,
  Home,
  PiggyBank,
  MapPin,
  BarChart2,
  Percent,
  CreditCard,
} from 'lucide-react'

const calculators = [
  {
    icon: DollarSign,
    title: 'Salary Calculator',
    description: 'Calculate annual take-home pay with federal & state tax breakdown.',
    href: '/salary-calculator',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    badge: 'Most Popular',
  },
  {
    icon: CreditCard,
    title: 'Paycheck Calculator',
    description: 'See exactly what comes out of each paycheck, per pay period.',
    href: '/paycheck-calculator',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Clock,
    title: 'Hourly to Salary',
    description: 'Convert hourly rates to annual salary or vice versa.',
    href: '/hourly-to-salary-calculator',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Overtime Calculator',
    description: 'Calculate overtime pay and its impact on your total taxes.',
    href: '/overtime-calculator',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Briefcase,
    title: 'Contractor Calculator',
    description: 'Self-employed? Calculate self-employment tax and quarterly estimates.',
    href: '/contractor-calculator',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Percent,
    title: 'Take-Home Pay',
    description: 'Quick take-home calculation with all deductions considered.',
    href: '/take-home-pay-calculator',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Home,
    title: 'Mortgage Affordability',
    description: 'Find out how much house you can afford based on your income.',
    href: '/mortgage-affordability-calculator',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    icon: PiggyBank,
    title: 'Savings Calculator',
    description: 'Project your savings growth with compound interest.',
    href: '/savings-calculator',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
  {
    icon: MapPin,
    title: 'Cost of Living',
    description: 'Compare cost of living between cities and adjust your salary.',
    href: '/cost-of-living-calculator',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: BarChart2,
    title: 'Salary Comparison',
    description: 'Compare salaries across states, cities, or job titles.',
    href: '/salary-comparison',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function CalculatorGrid() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            All the calculators you need
          </h2>
          <p className="mt-3 text-muted-foreground">
            Professional-grade tools, free forever. Updated with 2025 tax data.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {calculators.map(calc => (
            <motion.div key={calc.href} variants={item}>
              <Link
                href={calc.href}
                className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30"
              >
                {calc.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {calc.badge}
                  </span>
                )}
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${calc.bg}`}>
                  <calc.icon className={`h-5 w-5 ${calc.color}`} />
                </div>
                <div>
                  <h3 className="font-sora text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {calc.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {calc.description}
                  </p>
                </div>
                <span className="mt-auto text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open calculator →
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
