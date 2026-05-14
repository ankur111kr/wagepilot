import { ContractorCalculator } from '@/components/calculators/ContractorCalculator'
import { loadUSTaxData } from '@/lib/tax'
import { generateCalculatorSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema'
import { AdSlot } from '@/components/ads/AdSlot'
import { FAQSection } from '@/components/home/FAQSection'
import type { Metadata } from 'next'
import type { FAQItem } from '@/types'

export const metadata: Metadata = {
  title: 'Contractor Tax Calculator 2025 – Self-Employment Tax & Quarterly Estimates | WagePilot',
  description:
    'Free 1099 contractor tax calculator. Estimate self-employment tax, federal & state income tax, quarterly estimated payments, and net take-home pay for 2025.',
  alternates: { canonical: '/contractor-calculator' },
}

const faqs: FAQItem[] = [
  {
    question: 'What is self-employment tax?',
    answer:
      'Self-employment tax covers Social Security (12.4%) and Medicare (2.9%) — totaling 15.3%. As a contractor, you pay both the employee and employer portions. However, you can deduct half of your SE tax (7.65%) from your gross income when calculating federal income tax.',
  },
  {
    question: 'How do quarterly estimated tax payments work?',
    answer:
      'Self-employed individuals must pay estimated taxes four times per year: April 15 (Q1), June 15 (Q2), September 15 (Q3), and January 15 (Q4 of prior year). Failure to pay may result in an underpayment penalty. Generally, you must pay at least 90% of your current year tax or 100% of your prior year tax.',
  },
  {
    question: 'What business expenses can I deduct?',
    answer:
      'Common deductible business expenses include: home office, equipment, software, internet, phone, travel, professional development, health insurance premiums, and retirement contributions (SEP-IRA up to 25% of net self-employment income, Solo 401k up to $69,000 for 2025). Keep all receipts.',
  },
  {
    question: 'Should I form an LLC or S-Corp?',
    answer:
      'For most contractors, a sole proprietorship or single-member LLC (taxed the same way) is simplest. An S-Corp can save on self-employment tax when income exceeds ~$80,000–100,000/year, but requires additional administrative burden. Consult a CPA to evaluate your specific situation.',
  },
  {
    question: 'What is the QBI deduction for contractors?',
    answer:
      'The Qualified Business Income (QBI) deduction (Section 199A) allows eligible self-employed individuals to deduct up to 20% of their qualified business income from federal taxable income. This deduction phases out for certain service businesses above income thresholds. Our calculator does not currently include QBI — consult a tax professional.',
  },
]

export default async function ContractorCalculatorPage() {
  const taxData = await loadUSTaxData(2025)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        generateCalculatorSchema({ name: 'WagePilot Contractor Calculator', description: 'Self-employment tax calculator for 1099 contractors.', url: '/contractor-calculator', calculatorType: 'contractor' })
      )}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', href: '/' }, { name: 'Calculators', href: '/calculators' }, { name: 'Contractor Calculator', href: '/contractor-calculator' }
      ])) }} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:text-foreground">Home</a></li>
            <li>/</li>
            <li><a href="/calculators" className="hover:text-foreground">Calculators</a></li>
            <li>/</li>
            <li className="text-foreground">Contractor Calculator</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            1099 Contractor Tax Calculator 2025
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Calculate self-employment tax, income tax, and quarterly estimated payments as a
            freelancer or independent contractor. Includes business expense deductions and
            retirement contribution savings.
          </p>
        </div>

        <ContractorCalculator taxData={taxData} />

        <AdSlot slot="in-content" className="my-10" />

        <div className="mt-12 prose prose-gray dark:prose-invert max-w-none">
          <h2>How Contractor Taxes Work in 2025</h2>
          <p>
            As a 1099 contractor, you are responsible for paying your own taxes — no employer
            withholds on your behalf. This means budgeting for self-employment tax (15.3% on
            net earnings up to the Social Security wage base), federal income tax, and state
            income tax.
          </p>
          <p>
            The good news: you can deduct legitimate business expenses, half your SE tax, health
            insurance premiums, and retirement contributions — significantly reducing your taxable income.
          </p>

          <h2>2025 Self-Employment Tax Details</h2>
          <p>
            Self-employment tax applies to 92.35% of your net self-employment income. The 2025
            Social Security wage base is $176,100 — income above this is subject only to the
            2.9% Medicare portion (plus 0.9% additional Medicare for high earners).
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  )
}
