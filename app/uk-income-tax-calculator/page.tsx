import { UKSalaryCalculator } from '@/components/calculators/UKSalaryCalculator'
import { loadUKTaxData } from '@/lib/tax'
import { generateCalculatorSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema'
import { AdSlot } from '@/components/ads/AdSlot'
import { FAQSection } from '@/components/home/FAQSection'
import type { Metadata } from 'next'
import type { FAQItem } from '@/types'

export const metadata: Metadata = {
  title: 'UK Income Tax Calculator 2025/26 – PAYE Take-Home Pay | WagePilot',
  description:
    'Free UK salary calculator for 2025/26 tax year. Calculate take-home pay after income tax, National Insurance, pension, and student loan repayments. Scotland rates included.',
  alternates: { canonical: '/uk-income-tax-calculator' },
}

const faqs: FAQItem[] = [
  {
    question: 'What is the personal allowance for 2025/26?',
    answer:
      'The personal allowance for the 2025/26 tax year is £12,570. This is the amount you can earn before paying any income tax. It begins to taper for incomes above £100,000 and is fully withdrawn at £125,140.',
  },
  {
    question: 'How much National Insurance do I pay in 2025?',
    answer:
      'Employees pay 8% National Insurance on earnings between £12,570 and £50,270 per year, and 2% on earnings above that. Employers pay an additional 13.8% on earnings above £9,100.',
  },
  {
    question: 'Are Scottish tax rates different?',
    answer:
      'Yes. Scotland uses its own income tax rates. Scottish taxpayers have more bands including a Starter Rate (19%), Scottish Basic Rate (20%), Intermediate Rate (21%), Higher Rate (42%), Advanced Rate (45%), and Top Rate (48%) for the highest earners.',
  },
  {
    question: 'What student loan plan should I select?',
    answer:
      'Plan 1 applies to loans taken before September 2012. Plan 2 applies to loans from 2012 to July 2023. Plan 4 is for Scottish students. Plan 5 applies from August 2023. Postgraduate Loan is separate and can be combined with other plans.',
  },
  {
    question: 'How does pension contribution affect my take-home pay?',
    answer:
      'Pension contributions to a workplace pension (under relief at source or salary sacrifice) reduce your taxable income, effectively giving you tax relief at your marginal rate. A higher-rate taxpayer contributing 5% gets effective relief of 40% on that contribution.',
  },
]

export default async function UKCalculatorPage() {
  const taxData = await loadUKTaxData(2025)

  const calcSchema = generateCalculatorSchema({
    name: 'WagePilot UK Income Tax Calculator',
    description: 'Free UK PAYE take-home pay calculator for 2025/26 tax year.',
    url: '/uk-income-tax-calculator',
    calculatorType: 'take-home',
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calcSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', href: '/' },
        { name: 'UK Income Tax Calculator', href: '/uk-income-tax-calculator' },
      ])) }} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:text-foreground">Home</a></li>
            <li>/</li>
            <li className="text-foreground">UK Income Tax Calculator</li>
          </ol>
        </nav>

        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
            🇬🇧 2025/26 Tax Year
          </div>
          <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            UK Income Tax Calculator 2025/26
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Calculate your take-home pay after PAYE income tax, National Insurance, pension, and
            student loan. Covers England, Scotland, Wales, and Northern Ireland.
          </p>
        </div>

        <UKSalaryCalculator taxData={taxData} />

        <AdSlot slot="in-content" className="my-10" />

        <div className="mt-12 prose prose-gray dark:prose-invert max-w-none">
          <h2>UK Income Tax Bands 2025/26</h2>
          <p>
            For the 2025/26 tax year, UK residents (outside Scotland) pay 20% on income between
            £12,570 and £50,270, 40% on income from £50,270 to £125,140, and 45% on income above
            £125,140. The personal allowance of £12,570 is tax-free.
          </p>

          <h2>Understanding Your Tax Code</h2>
          <p>
            Your PAYE tax code tells your employer how much tax to deduct. The most common code
            is 1257L, representing the £12,570 personal allowance. Letters indicate your situation:
            L (standard allowance), M (marriage allowance received), N (marriage allowance given),
            T (other adjustments), 0T (no personal allowance), BR (all income at basic rate).
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  )
}
