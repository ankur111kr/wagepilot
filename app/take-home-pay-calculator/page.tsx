import { SalaryCalculator } from '@/components/calculators/SalaryCalculator'
import { loadUSTaxData } from '@/lib/tax'
import { generateCalculatorSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema'
import { AdSlot } from '@/components/ads/AdSlot'
import { FAQSection } from '@/components/home/FAQSection'
import type { Metadata } from 'next'
import type { FAQItem } from '@/types'

export const metadata: Metadata = {
  title: 'Take-Home Pay Calculator 2025 – Net Pay After Taxes | WagePilot',
  description:
    'Calculate your exact take-home pay after all deductions. Enter your gross salary and see net pay broken down by federal tax, state tax, Social Security, and Medicare.',
  alternates: { canonical: '/take-home-pay-calculator' },
}

const faqs: FAQItem[] = [
  {
    question: 'What is take-home pay?',
    answer:
      'Take-home pay (also called net pay) is what you actually receive in your paycheck after all deductions — federal income tax, state income tax, Social Security (6.2%), Medicare (1.45%), and any voluntary deductions like 401(k) contributions or health insurance premiums.',
  },
  {
    question: 'Why is my take-home pay less than my salary?',
    answer:
      'Several mandatory deductions reduce your gross salary: federal income tax (10–37%), state income tax (0–13.3%), Social Security (6.2% up to the wage base), and Medicare (1.45%). Combined, these typically reduce take-home pay by 20–35% for most workers.',
  },
  {
    question: 'How can I increase my take-home pay?',
    answer:
      'You can legally increase take-home pay by: contributing to pre-tax accounts (401k, HSA, FSA) which reduce taxable income; claiming all eligible tax credits and deductions; adjusting your W-4 withholding allowances; or considering tax-efficient investment strategies.',
  },
  {
    question: 'How much federal tax will be withheld from my paycheck?',
    answer:
      'Federal withholding depends on your gross pay, filing status, and W-4 allowances. For 2025, the tax rate starts at 10% and increases up to 37% for the highest incomes. The effective rate for most workers is 12–22%.',
  },
]

export default async function TakeHomePayPage() {
  const taxData = await loadUSTaxData(2025)

  return (
    <>
      {[
        generateCalculatorSchema({ name: 'WagePilot Take-Home Pay Calculator', description: 'Calculate net take-home pay after all taxes and deductions.', url: '/take-home-pay-calculator', calculatorType: 'take-home' }),
        generateFAQSchema(faqs),
        generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Calculators', href: '/calculators' }, { name: 'Take-Home Pay', href: '/take-home-pay-calculator' }]),
      ].map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:text-foreground">Home</a></li>
            <li>/</li>
            <li><a href="/calculators" className="hover:text-foreground">Calculators</a></li>
            <li>/</li>
            <li className="text-foreground">Take-Home Pay</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            Take-Home Pay Calculator 2025
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            See exactly what lands in your bank account after federal tax, state tax, Social Security,
            and Medicare are deducted. Updated with 2025 IRS data.
          </p>
        </div>

        <SalaryCalculator taxData={taxData} />

        <AdSlot slot="in-content" className="my-10" />

        <FAQSection faqs={faqs} />
      </div>
    </>
  )
}
