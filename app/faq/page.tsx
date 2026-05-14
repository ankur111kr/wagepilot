import { FAQSection } from '@/components/home/FAQSection'
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema'
import type { Metadata } from 'next'
import type { FAQItem } from '@/types'

export const metadata: Metadata = {
  title: 'FAQ – Salary, Tax & Paycheck Questions Answered | WagePilot',
  description:
    'Answers to common questions about US and UK salary calculations, tax brackets, FICA, PAYE, overtime rules, and how WagePilot calculators work.',
  alternates: { canonical: '/faq' },
}

const generalFAQs: FAQItem[] = [
  {
    question: 'How accurate are WagePilot\'s calculators?',
    answer: 'WagePilot uses official IRS and HMRC published tax rates updated annually. For standard employment situations, accuracy is very high. Results may differ from actual withholding due to W-4 elections, year-to-date earnings, employer-specific deductions, tax credits, or complex situations like multiple jobs or investment income.',
  },
  {
    question: 'Is my financial data stored anywhere?',
    answer: 'No. All calculator inputs are processed locally in your browser using JavaScript. No salary, income, or financial data is ever transmitted to our servers. The only data we collect is anonymized analytics (page views) via Google Analytics.',
  },
  {
    question: 'How often is tax data updated?',
    answer: 'We update US tax data when the IRS publishes new brackets and limits (typically October/November for the following year). UK data is updated after the annual Budget and Spring Statement. Both are stored in JSON files that can be swapped without code changes.',
  },
  {
    question: 'Can I use WagePilot for tax filing?',
    answer: 'No. WagePilot provides estimates for planning and informational purposes only — not for tax filing. For filing taxes, use official IRS forms, HMRC Self Assessment, or qualified tax software. Always consult a CPA or tax advisor for complex situations.',
  },
]

const usFAQs: FAQItem[] = [
  {
    question: 'What are the 2025 federal income tax brackets?',
    answer: 'For single filers in 2025: 10% on income up to $11,925; 12% from $11,925–$48,475; 22% from $48,475–$103,350; 24% from $103,350–$197,300; 32% from $197,300–$250,525; 35% from $250,525–$626,350; 37% above $626,350. The standard deduction is $15,000 for single filers.',
  },
  {
    question: 'What is FICA tax?',
    answer: 'FICA (Federal Insurance Contributions Act) covers Social Security (6.2% on wages up to $176,100) and Medicare (1.45% on all wages). Employees and employers each pay half. High earners pay an additional 0.9% Medicare tax on income above $200,000 (single) or $250,000 (married jointly).',
  },
  {
    question: 'Which states have no income tax in 2025?',
    answer: 'Nine states have no individual income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming. New Hampshire eliminated its tax on interest and dividends in 2025.',
  },
  {
    question: 'What is the difference between gross and net pay?',
    answer: 'Gross pay is your total pay before any deductions. Net pay (take-home pay) is what you receive after all deductions — federal tax, state tax, Social Security, Medicare, and any voluntary deductions like health insurance or 401(k) contributions.',
  },
  {
    question: 'What is the 2025 Social Security wage base?',
    answer: 'For 2025, Social Security tax (6.2%) applies to wages up to $176,100. Earnings above this are not subject to the 6.2% SS tax, though Medicare (1.45%) applies to all wages with no cap.',
  },
]

const ukFAQs: FAQItem[] = [
  {
    question: 'What is the UK personal allowance for 2025/26?',
    answer: 'The personal allowance for 2025/26 is £12,570. This is the amount of income you can earn tax-free. It tapers for earnings above £100,000 and disappears entirely at £125,140.',
  },
  {
    question: 'What are the UK income tax rates for 2025/26?',
    answer: 'For England, Wales, and Northern Ireland: 20% (Basic Rate) on income between £12,570–£50,270; 40% (Higher Rate) on £50,270–£125,140; 45% (Additional Rate) above £125,140. Scotland has different rates with more bands.',
  },
  {
    question: 'How is National Insurance calculated in 2025?',
    answer: 'Employee Class 1 NI: 8% on earnings between £12,570 and £50,270 per year; 2% above £50,270. The employer contributes an additional 13.8% above the secondary threshold (£9,100).',
  },
  {
    question: 'What does my PAYE tax code mean?',
    answer: 'Your tax code tells your employer how much income tax to deduct. The most common code is 1257L, representing the £12,570 personal allowance (digits = allowance ÷ 10). Letter suffixes indicate special circumstances: L=standard, M=marriage allowance received, BR=all at basic rate, 0T=no allowance.',
  },
]

export default function FAQPage() {
  const allFAQs = [...generalFAQs, ...usFAQs, ...ukFAQs]

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(allFAQs)) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'FAQ', href: '/faq' },
        ])) }} />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-muted-foreground">
            Common questions about salary calculations, US and UK taxes, and WagePilot's tools.
          </p>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="mb-4 font-sora text-xl font-semibold border-b border-border pb-3">
              General
            </h2>
            <FAQSection faqs={generalFAQs} title="" />
          </div>

          <div>
            <h2 className="mb-4 font-sora text-xl font-semibold border-b border-border pb-3">
              🇺🇸 US Taxes
            </h2>
            <FAQSection faqs={usFAQs} title="" />
          </div>

          <div>
            <h2 className="mb-4 font-sora text-xl font-semibold border-b border-border pb-3">
              🇬🇧 UK Taxes
            </h2>
            <FAQSection faqs={ukFAQs} title="" />
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Can't find what you're looking for?{' '}
            <a href="/contact" className="font-medium text-primary hover:underline">
              Contact us
            </a>{' '}
            and we'll get back to you within 2 business days.
          </p>
        </div>
      </div>
    </>
  )
}
