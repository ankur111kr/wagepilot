import { MortgageCalculator } from '@/components/calculators/MortgageCalculator'
import { generateCalculatorSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema'
import { AdSlot } from '@/components/ads/AdSlot'
import { FAQSection } from '@/components/home/FAQSection'
import type { Metadata } from 'next'
import type { FAQItem } from '@/types'

export const metadata: Metadata = {
  title: 'Mortgage Affordability Calculator 2025 – How Much House Can I Afford? | WagePilot',
  description:
    'Calculate how much house you can afford based on your income and debts. Uses the 28/36 DTI rule. Includes PMI, property tax, and insurance estimates.',
  alternates: { canonical: '/mortgage-affordability-calculator' },
}

const faqs: FAQItem[] = [
  {
    question: 'How much house can I afford on my salary?',
    answer:
      'A common guideline is that your home should cost no more than 2.5–3× your annual gross income. More precisely, your total monthly housing costs (PITI: principal, interest, taxes, insurance) should be under 28% of your gross monthly income.',
  },
  {
    question: 'What is the 28/36 rule for mortgages?',
    answer:
      'The 28/36 rule states that you should spend no more than 28% of gross monthly income on housing costs (front-end DTI) and no more than 36% on total debt payments including housing (back-end DTI). Lenders often allow up to 43% back-end DTI for conventional loans.',
  },
  {
    question: 'What is PMI and when do I need it?',
    answer:
      'Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home price. It typically costs 0.5–1.5% of the loan amount annually. PMI protects the lender, not you. It can be removed once you reach 20% equity.',
  },
  {
    question: 'What mortgage rate should I expect in 2025?',
    answer:
      'Mortgage rates fluctuate with economic conditions. As of early 2025, 30-year fixed rates are in the 6.5–7.5% range. Your actual rate depends on your credit score, down payment, loan type, and lender. Use our calculator to see how different rates affect your payment.',
  },
  {
    question: 'Should I choose a 15-year or 30-year mortgage?',
    answer:
      'A 15-year mortgage has higher monthly payments but saves significantly on interest — often hundreds of thousands of dollars over the loan life. A 30-year mortgage offers lower monthly payments and more flexibility. If you can comfortably afford the 15-year payment, it often makes mathematical sense.',
  },
]

export default function MortgageCalculatorPage() {
  return (
    <>
      {[
        generateCalculatorSchema({ name: 'WagePilot Mortgage Affordability Calculator', description: 'Calculate how much house you can afford based on income and debts.', url: '/mortgage-affordability-calculator', calculatorType: 'mortgage' }),
        generateFAQSchema(faqs),
        generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Calculators', href: '/calculators' }, { name: 'Mortgage Calculator', href: '/mortgage-affordability-calculator' }]),
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
            <li className="text-foreground">Mortgage Affordability</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            Mortgage Affordability Calculator 2025
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Find out how much house you can afford based on your income, debts, and down payment.
            Includes estimates for property tax, insurance, and PMI.
          </p>
        </div>

        <MortgageCalculator />

        <AdSlot slot="in-content" className="my-10" />

        <div className="mt-12 prose prose-gray dark:prose-invert max-w-none">
          <h2>How Mortgage Affordability Is Calculated</h2>
          <p>
            Lenders evaluate affordability primarily through your Debt-to-Income (DTI) ratio.
            Your housing costs (principal, interest, property taxes, homeowners insurance, and PMI
            if applicable) should ideally be under 28% of your gross monthly income. Your total
            debt including housing should be under 36–43%.
          </p>

          <h2>True Cost of Homeownership</h2>
          <p>
            Beyond your mortgage payment, budget for: property taxes (0.5–2.5% of home value annually,
            varies by state), homeowners insurance (~0.5–1% annually), HOA fees (if applicable),
            maintenance (~1% of home value per year), and closing costs (2–5% of purchase price).
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  )
}
