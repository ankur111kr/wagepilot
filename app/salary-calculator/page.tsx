import { SalaryCalculator } from '@/components/calculators/SalaryCalculator'
import { loadUSTaxData } from '@/lib/tax'
import { generateCalculatorSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema'
import { AdSlot } from '@/components/ads/AdSlot'
import { FAQSection } from '@/components/home/FAQSection'
import type { Metadata } from 'next'
import type { FAQItem } from '@/types'

export const metadata: Metadata = {
  title: 'Salary Calculator 2025 – USA Take-Home Pay | WagePilot',
  description:
    'Calculate your exact take-home pay with our free 2025 salary calculator. Includes federal income tax, state tax, Social Security, and Medicare for all 50 states.',
  alternates: { canonical: '/salary-calculator' },
}

const faqs: FAQItem[] = [
  {
    question: 'How is my take-home pay calculated?',
    answer:
      'Your take-home pay is your gross salary minus federal income tax, state income tax, Social Security (6.2%), and Medicare (1.45%). Pre-tax deductions like 401(k) contributions reduce your taxable income.',
  },
  {
    question: 'What is the difference between effective and marginal tax rate?',
    answer:
      'Your marginal tax rate is the rate you pay on your last dollar of income. Your effective tax rate is the average rate across your entire income. The US uses a progressive bracket system, so not all your income is taxed at the highest rate.',
  },
  {
    question: 'Does my state have income tax?',
    answer:
      'Nine states have no individual income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming. All other states levy income tax ranging from under 3% to over 13%.',
  },
  {
    question: 'How does filing status affect my taxes?',
    answer:
      'Filing status determines your standard deduction and the tax brackets that apply to you. Married Filing Jointly typically results in lower taxes than Single filers at the same combined income. Head of Household status offers a larger standard deduction than Single.',
  },
  {
    question: 'Can I reduce my taxable income?',
    answer:
      'Yes. Pre-tax contributions to a 401(k), traditional IRA, HSA, or FSA reduce your taxable income. You can also choose to itemize deductions if they exceed the standard deduction for your filing status.',
  },
]

export default async function SalaryCalculatorPage() {
  const taxData = await loadUSTaxData(2025)
  const calcSchema = generateCalculatorSchema({
    name: 'WagePilot Salary Calculator',
    description: 'Free US salary calculator with 2025 federal and state tax data.',
    url: '/salary-calculator',
    calculatorType: 'salary',
  })
  const faqSchema = generateFAQSchema(faqs)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Salary Calculator', href: '/salary-calculator' },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calcSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:text-foreground">Home</a></li>
            <li>/</li>
            <li className="text-foreground">Salary Calculator</li>
          </ol>
        </nav>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            US Salary Calculator 2025
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Calculate your exact take-home pay after federal and state taxes. Includes Social
            Security, Medicare, and 401(k) deductions. Updated with 2025 IRS tax brackets.
          </p>
        </div>

        {/* Calculator */}
        <SalaryCalculator taxData={taxData} />

        <AdSlot slot="in-content" className="my-10" />

        {/* SEO content */}
        <div className="mt-12 prose prose-gray dark:prose-invert max-w-none">
          <h2>How to Use the Salary Calculator</h2>
          <p>
            Enter your gross annual salary, select your state, choose your filing status, and
            WagePilot instantly calculates your take-home pay. You can also add pre-tax 401(k)
            contributions to see how retirement savings reduce your tax bill.
          </p>

          <h2>2025 Federal Tax Brackets</h2>
          <p>
            For 2025, the IRS has adjusted tax brackets for inflation. Single filers pay 10% on
            income up to $11,925, 12% from $11,925 to $48,475, 22% from $48,475 to $103,350, and
            higher rates above that. The standard deduction increased to $15,000 for single filers
            and $30,000 for married filing jointly.
          </p>

          <h2>Understanding FICA Taxes</h2>
          <p>
            FICA (Federal Insurance Contributions Act) taxes fund Social Security and Medicare.
            Employees pay 6.2% for Social Security on wages up to $176,100 and 1.45% for Medicare
            on all wages. High earners pay an additional 0.9% Medicare tax above $200,000 (single)
            or $250,000 (married filing jointly).
          </p>
        </div>

        <FAQSection faqs={faqs} />

        <AdSlot slot="leaderboard" className="mt-10" />
      </div>
    </>
  )
}
