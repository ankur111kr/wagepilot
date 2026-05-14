import { HourlyToSalaryCalculator } from '@/components/calculators/HourlyToSalaryCalculator'
import { generateCalculatorSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema'
import { AdSlot } from '@/components/ads/AdSlot'
import { FAQSection } from '@/components/home/FAQSection'
import type { Metadata } from 'next'
import type { FAQItem } from '@/types'

export const metadata: Metadata = {
  title: 'Hourly to Salary Calculator 2025 – Convert Hourly Rate | WagePilot',
  description:
    'Convert your hourly wage to annual salary instantly. See equivalent weekly, bi-weekly, monthly, and yearly pay. Free calculator updated for 2025.',
  alternates: { canonical: '/hourly-to-salary-calculator' },
}

const faqs: FAQItem[] = [
  {
    question: 'How do I convert hourly to annual salary?',
    answer:
      'Multiply your hourly rate by your hours per week, then multiply by 52 weeks. For example, $25/hour × 40 hours × 52 weeks = $52,000 annual salary.',
  },
  {
    question: 'How many working hours are in a year?',
    answer:
      'A standard full-time schedule is 40 hours/week × 52 weeks = 2,080 hours per year. This assumes no overtime and no unpaid leave. Part-time schedules vary.',
  },
  {
    question: 'What is a good hourly rate in 2025?',
    answer:
      'The US federal minimum wage is $7.25/hour, but many states have higher minimums. The median US hourly wage is approximately $22.50/hour ($46,800/year). What constitutes "good" depends heavily on your location, industry, and experience.',
  },
  {
    question: 'How do I convert salary to hourly rate?',
    answer:
      'Divide your annual salary by 2,080 (full-time hours per year). For example, $60,000 ÷ 2,080 = $28.85/hour. Use our calculator\'s "Flip" button to switch modes.',
  },
  {
    question: 'Does this calculator account for taxes?',
    answer:
      'This calculator shows gross (pre-tax) equivalent amounts. Use our Salary Calculator or Paycheck Calculator to see your net take-home pay after federal and state taxes.',
  },
]

export default function HourlyToSalaryPage() {
  return (
    <>
      {[
        generateCalculatorSchema({ name: 'WagePilot Hourly to Salary Calculator', description: 'Convert hourly wage to annual salary and all pay periods.', url: '/hourly-to-salary-calculator', calculatorType: 'hourly' }),
        generateFAQSchema(faqs),
        generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Calculators', href: '/calculators' }, { name: 'Hourly to Salary', href: '/hourly-to-salary-calculator' }]),
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
            <li className="text-foreground">Hourly to Salary</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            Hourly to Annual Salary Calculator 2025
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Convert any hourly wage to annual, monthly, bi-weekly, or weekly salary instantly.
            Works both ways — flip to convert salary to hourly rate.
          </p>
        </div>

        <HourlyToSalaryCalculator />

        <AdSlot slot="in-content" className="my-10" />

        <div className="mt-12 prose prose-gray dark:prose-invert max-w-none">
          <h2>Hourly Wage to Salary Conversion Table</h2>
          <p>
            Here are common hourly rates and their equivalent annual salaries based on a 40-hour
            work week:
          </p>
          <ul>
            <li>$15/hour = $31,200/year</li>
            <li>$20/hour = $41,600/year</li>
            <li>$25/hour = $52,000/year</li>
            <li>$30/hour = $62,400/year</li>
            <li>$40/hour = $83,200/year</li>
            <li>$50/hour = $104,000/year</li>
            <li>$75/hour = $156,000/year</li>
            <li>$100/hour = $208,000/year</li>
          </ul>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  )
}
