import { SavingsCalculator } from '@/components/calculators/SavingsCalculator'
import { generateCalculatorSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema'
import { AdSlot } from '@/components/ads/AdSlot'
import { FAQSection } from '@/components/home/FAQSection'
import type { Metadata } from 'next'
import type { FAQItem } from '@/types'

export const metadata: Metadata = {
  title: 'Savings Calculator 2025 – Compound Interest Growth | WagePilot',
  description:
    'Free compound interest savings calculator. See how your savings grow over time with monthly contributions. Supports HYSA, 401(k), and investment projections.',
  alternates: { canonical: '/savings-calculator' },
}

const faqs: FAQItem[] = [
  {
    question: 'What is compound interest?',
    answer:
      'Compound interest means you earn interest on both your principal and your previously earned interest. For example, $10,000 at 7% annual return grows to $10,700 after year 1, then earns 7% on $10,700 in year 2 — not just $10,000. Over decades, this snowball effect is dramatic.',
  },
  {
    question: 'What return rate should I use?',
    answer:
      'For a high-yield savings account (HYSA), use 4–5% (2025 rates). For a diversified stock index fund (like S&P 500), the historical average is approximately 10% nominal / 7% inflation-adjusted. For a conservative balanced portfolio, 5–6% is a reasonable estimate.',
  },
  {
    question: 'How much should I save each month?',
    answer:
      'A common guideline is to save at least 20% of your gross income (the 50/30/20 rule). For retirement specifically, many advisors recommend 15% of gross income including any employer match. Start with whatever you can — consistency matters more than the initial amount.',
  },
  {
    question: 'What is the Rule of 72?',
    answer:
      'The Rule of 72 is a quick mental math shortcut: divide 72 by your annual return rate to estimate how many years it takes for your money to double. At 7% return, your money doubles roughly every 72 ÷ 7 = 10.3 years.',
  },
  {
    question: 'Should I pay off debt or save first?',
    answer:
      'If your debt interest rate is higher than your expected investment return, paying off debt first usually wins mathematically. However, always contribute enough to get your full employer 401(k) match first — that\'s an immediate 50–100% return. Then pay off high-interest debt, then invest.',
  },
]

export default function SavingsCalculatorPage() {
  const schemas = [
    generateCalculatorSchema({
      name: 'WagePilot Savings Calculator',
      description: 'Compound interest savings calculator with monthly contributions.',
      url: '/savings-calculator',
      calculatorType: 'savings',
    }),
    generateFAQSchema(faqs),
    generateBreadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Calculators', href: '/calculators' },
      { name: 'Savings Calculator', href: '/savings-calculator' },
    ]),
  ]

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:text-foreground">Home</a></li>
            <li>/</li>
            <li><a href="/calculators" className="hover:text-foreground">Calculators</a></li>
            <li>/</li>
            <li className="text-foreground">Savings Calculator</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            Savings & Compound Interest Calculator 2025
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Project your savings growth with compound interest. Adjust initial deposit, monthly
            contributions, return rate, and time horizon to see how your money grows.
          </p>
        </div>

        <SavingsCalculator />

        <AdSlot slot="in-content" className="my-10" />

        <div className="mt-12 prose prose-gray dark:prose-invert max-w-none">
          <h2>The Power of Compound Interest</h2>
          <p>
            Albert Einstein reportedly called compound interest the "eighth wonder of the world."
            Whether or not he said it, the math is undeniable. A $500/month investment at 7%
            annual return grows to over $1.2 million in 40 years — but only $240,000 of that
            comes from your contributions. The remaining $960,000+ is pure compound growth.
          </p>

          <h2>Best Accounts for Compound Growth in 2025</h2>
          <p>
            For short-term savings (1–5 years), High-Yield Savings Accounts (HYSAs) are currently
            paying 4–5% APY. For long-term investing, tax-advantaged accounts like 401(k), Roth
            IRA, and Traditional IRA let your money compound tax-free or tax-deferred, dramatically
            boosting long-run returns.
          </p>

          <h2>2025 Retirement Contribution Limits</h2>
          <p>
            For 2025, you can contribute up to $23,500 to a 401(k) ($31,000 if age 50+) and
            $7,000 to an IRA ($8,000 if age 50+). Maxing these accounts before investing in
            taxable accounts typically maximizes long-term wealth.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  )
}
