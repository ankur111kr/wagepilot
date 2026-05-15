import { OvertimeCalculator } from '@/components/calculators/OvertimeCalculator'
import { loadUSTaxData } from '@/lib/tax'
import { generateCalculatorSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema'
import { AdSlot } from '@/components/ads/AdSlot'
import { FAQSection } from '@/components/home/FAQSection'
import type { Metadata } from 'next'
import type { FAQItem } from '@/types'

export const metadata: Metadata = {
  title: 'Overtime Calculator 2025 – Calculate Overtime Pay & Taxes | WagePilot',
  description:
    'Free overtime pay calculator with tax estimates. Calculate 1.5×, 2×, or custom overtime rates plus federal and state tax impact. Updated for 2025.',
  alternates: { canonical: '/overtime-calculator' },
}

const faqs: FAQItem[] = [
  {
    question: 'How is overtime calculated under the FLSA?',
    answer:
      'Under the Fair Labor Standards Act (FLSA), non-exempt employees must receive overtime pay of at least 1.5× their regular rate for all hours worked over 40 in a workweek. Some states (like California) have daily overtime rules — 1.5× after 8 hours/day and 2× after 12 hours/day.',
  },
  {
    question: 'Is overtime taxed at a higher rate?',
    answer:
      'Overtime pay is not taxed at a separate, higher rate. However, because it increases your total income, it may push more of your earnings into a higher federal or state tax bracket, resulting in a higher effective tax rate for that pay period.',
  },
  {
    question: 'Which states have daily overtime rules?',
    answer:
      'California, Nevada, and a few other states require overtime pay based on daily hours, not just weekly. California requires 1.5× pay after 8 hours/day, 2× after 12 hours/day, and 2× for the 7th consecutive day worked.',
  },
  {
    question: 'Do salaried employees get overtime?',
    answer:
      'Salaried employees earning less than $684/week ($35,568/year) are generally entitled to overtime under the FLSA. Those earning above the threshold may be exempt depending on their job duties (executive, administrative, professional, outside sales, or computer employee exemptions).',
  },
  {
    question: 'How do I calculate my effective overtime rate?',
    answer:
      'Your effective overtime rate is your overtime pay divided by total hours worked. For a 1.5× multiplier on $25/hr, overtime hours pay $37.50/hr before taxes. After estimated taxes, the net rate per overtime hour is typically 25–35% less.',
  },
]

export default async function OvertimeCalculatorPage() {
  const taxData = await loadUSTaxData(2025)

  const schemas = [
    generateCalculatorSchema({
      name: 'WagePilot Overtime Calculator',
      description: 'Calculate overtime pay and its tax impact for 2025.',
      url: '/overtime-calculator',
      calculatorType: 'overtime',
    }),
    generateFAQSchema(faqs),
    generateBreadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Calculators', href: '/calculators' },
      { name: 'Overtime Calculator', href: '/overtime-calculator' },
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
            <li className="text-foreground">Overtime Calculator</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            Overtime Pay Calculator 2025
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Calculate your weekly overtime pay at 1.5×, 2×, or any custom multiplier. Includes
            estimated federal and state tax impact and annual projections.
          </p>
        </div>

        <OvertimeCalculator taxData={taxData} />

        <AdSlot slot="in-content" className="my-10" />

        <div className="mt-12 prose prose-gray dark:prose-invert max-w-none">
          <h2>Federal Overtime Rules (FLSA 2025)</h2>
          <p>
            The Fair Labor Standards Act requires most employers to pay non-exempt employees
            at least 1.5× their regular rate for hours worked over 40 per week. The salary
            threshold for overtime exemption is $684/week ($35,568/year). Employees below
            this threshold are entitled to overtime regardless of job duties.
          </p>

          <h2>State Overtime Laws</h2>
          <p>
            Several states have overtime rules that exceed federal minimums. California requires
            daily overtime (1.5× after 8 hours, 2× after 12 hours). Alaska, Nevada, and Puerto
            Rico also have daily overtime provisions. Always check your state's labor laws.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  )
}
