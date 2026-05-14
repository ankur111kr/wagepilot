import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, RefreshCw, Calculator, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About WagePilot – Free Salary & Tax Calculators | WagePilot',
  description:
    'WagePilot provides free, accurate salary, paycheck, and tax calculators for US and UK workers. Learn about our mission, data sources, and team.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="mb-14 text-center">
        <h1 className="font-sora text-4xl font-bold tracking-tight sm:text-5xl">
          About <span className="gradient-text">WagePilot</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          We believe everyone deserves to understand their pay. WagePilot gives workers
          free, professional-grade tools to decode their salary, taxes, and take-home pay.
        </p>
      </div>

      {/* Mission */}
      <div className="prose prose-gray dark:prose-invert max-w-none mb-14">
        <h2>Our Mission</h2>
        <p>
          Most people don't truly understand their paycheck. Taxes, deductions, and withholdings
          are confusing by design — and expensive professional advice isn't accessible to everyone.
          WagePilot exists to change that.
        </p>
        <p>
          We build transparent, accurate, free financial calculators that help US and UK workers
          understand exactly where their money goes and how to keep more of it.
        </p>

        <h2>Our Data Sources</h2>
        <p>
          WagePilot's tax calculations are based on primary sources only:
        </p>
        <ul>
          <li><strong>US Federal Tax:</strong> IRS Revenue Procedure announcements and Publication 15 (Circular E)</li>
          <li><strong>US State Tax:</strong> Individual state department of revenue publications</li>
          <li><strong>UK Income Tax & NI:</strong> HMRC official rate tables and Tax Information & Impact Notes</li>
          <li><strong>UK Student Loans:</strong> Student Loans Company and DfE repayment thresholds</li>
        </ul>
        <p>
          Tax data is stored in version-controlled JSON files and updated annually. You can view
          the data format on our <Link href="/blog/tax-data-methodology">methodology page</Link>.
        </p>

        <h2>Accuracy & Limitations</h2>
        <p>
          Our calculators provide highly accurate estimates for the majority of workers with
          straightforward tax situations. However, they do not account for every individual
          circumstance — tax credits, alternative minimum tax, complex investment income, multiple
          jobs, or non-standard deductions. Always verify with a qualified tax professional for
          complex situations.
        </p>
      </div>

      {/* Values */}
      <div className="grid gap-5 sm:grid-cols-2 mb-14">
        {[
          {
            icon: Calculator,
            title: 'Always Free',
            description: 'Every calculator on WagePilot is free, forever. No sign-up required, no paywalls.',
          },
          {
            icon: Shield,
            title: 'Privacy First',
            description: 'Your salary data stays in your browser. We never store financial inputs.',
          },
          {
            icon: RefreshCw,
            title: 'Always Updated',
            description: 'Tax data updated every year for both US (IRS) and UK (HMRC) tax years.',
          },
          {
            icon: Users,
            title: 'For Everyone',
            description: 'Built for employees, contractors, freelancers, and side hustlers alike.',
          },
        ].map(v => (
          <div key={v.title} className="wp-card flex gap-4 p-5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <v.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-sora text-sm font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <h2 className="font-sora text-2xl font-bold">Ready to calculate your pay?</h2>
        <p className="mt-2 text-muted-foreground">Pick a calculator and see your results in seconds.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/salary-calculator"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            Salary Calculator
          </Link>
          <Link href="/uk-income-tax-calculator"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent transition-colors">
            UK Tax Calculator
          </Link>
        </div>
      </div>
    </div>
  )
      }
