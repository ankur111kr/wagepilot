import Link from 'next/link'
import { CalculatorGrid } from '@/components/home/CalculatorGrid'
import { AdSlot } from '@/components/ads/AdSlot'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Calculators – Salary, Tax, Overtime & More | WagePilot',
  description: 'Browse all WagePilot free financial calculators: salary, paycheck, overtime, contractor, UK income tax, cost of living, savings, and more.',
  alternates: { canonical: '/calculators' },
}

export default function CalculatorsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li className="text-foreground">Calculators</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
          Free Financial Calculators
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Ten professional-grade salary and tax calculators for US and UK workers. All free,
          all updated for 2025.
        </p>
      </div>

      <CalculatorGrid />

      <AdSlot slot="leaderboard" className="mt-8" />

      <div className="mt-12 prose prose-gray dark:prose-invert max-w-none">
        <h2>About Our Calculators</h2>
        <p>
          WagePilot's calculators use official IRS and HMRC tax data updated annually. Unlike
          many online tools, we show a full breakdown of every deduction — not just a single number.
          All calculations happen instantly in your browser, and we never store your financial data.
        </p>
      </div>
    </div>
  )
}
