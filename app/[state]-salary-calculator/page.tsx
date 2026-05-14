import { loadUSTaxData } from '@/lib/tax'
import { SalaryCalculator } from '@/components/calculators/SalaryCalculator'
import { FAQSection } from '@/components/home/FAQSection'
import { AdSlot } from '@/components/ads/AdSlot'
import { generateCalculatorSchema, generateFAQSchema, generateBreadcrumbSchema, generateStateCalculatorMeta } from '@/lib/schema'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { FAQItem } from '@/types'

// All state slugs → state code mapping
const STATE_SLUGS: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
  'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
  'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
  'new-hampshire': 'NH', 'new-jersey': 'NJ', 'new-mexico': 'NM', 'new-york': 'NY',
  'north-carolina': 'NC', 'north-dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
  'oregon': 'OR', 'pennsylvania': 'PA', 'rhode-island': 'RI', 'south-carolina': 'SC',
  'south-dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
  'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west-virginia': 'WV',
  'wisconsin': 'WI', 'wyoming': 'WY', 'washington-dc': 'DC',
}

// Route pattern: /[state]-salary-calculator e.g. /california-salary-calculator
interface Props {
  params: { state: string }
}

function parseStateSlug(rawParam: string): { slug: string; stateCode: string; stateName: string } | null {
  // slug comes in as "california" from route [state]-salary-calculator
  const slug = rawParam
  const stateCode = STATE_SLUGS[slug]
  if (!stateCode) return null

  const stateName = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace('Dc', 'D.C.')

  return { slug, stateCode, stateName }
}

export async function generateStaticParams() {
  return Object.keys(STATE_SLUGS).map(slug => ({ state: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseStateSlug(params.state)
  if (!parsed) return {}

  const { stateName, stateCode } = parsed
  const meta = generateStateCalculatorMeta({ stateName, stateCode, calculatorType: 'salary', year: 2025 })

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
  }
}

export default async function StateCalculatorPage({ params }: Props) {
  const parsed = parseStateSlug(params.state)
  if (!parsed) notFound()

  const { stateName, stateCode } = parsed
  const taxData = await loadUSTaxData(2025)
  const stateData = taxData.states[stateCode]

  const stateRateText =
    stateData.type === 'none'
      ? 'no state income tax'
      : stateData.type === 'flat'
      ? `a flat ${(stateData.rate * 100).toFixed(2)}% state income tax`
      : `graduated state income tax rates up to ${(stateData.rate * 100).toFixed(2)}%`

  const faqs: FAQItem[] = [
    {
      question: `Does ${stateName} have state income tax?`,
      answer:
        stateData.type === 'none'
          ? `No, ${stateName} has no state income tax. Residents only pay federal income tax and FICA (Social Security and Medicare) taxes.`
          : `Yes, ${stateName} has ${stateRateText}. This is in addition to federal income tax and FICA taxes.`,
    },
    {
      question: `What is the take-home pay on a $75,000 salary in ${stateName}?`,
      answer: `On a $75,000 salary in ${stateName} (single filer, 2025), you would take home approximately $${Math.round(taxData.states[stateCode].type === 'none' ? 75000 * 0.79 : 75000 * 0.76).toLocaleString()} annually after federal tax, state tax, Social Security, and Medicare. Use our calculator above for an exact figure.`,
    },
    {
      question: `What are the ${stateName} state income tax rates for 2025?`,
      answer:
        stateData.type === 'none'
          ? `${stateName} does not levy a personal income tax for 2025.`
          : stateData.type === 'flat'
          ? `${stateName} has a flat state income tax rate of ${(stateData.rate * 100).toFixed(2)}% for 2025 — the same rate applies to all income levels.`
          : `${stateName} has graduated state income tax brackets in 2025, with a top rate of ${(stateData.rate * 100).toFixed(2)}%.`,
    },
    {
      question: 'How do I calculate my bi-weekly paycheck?',
      answer:
        'To calculate your bi-weekly net paycheck, divide your annual gross salary by 26, then subtract your bi-weekly federal tax, state tax, Social Security (6.2%), and Medicare (1.45%). Our calculator does this automatically.',
    },
  ]

  const calcSchema = generateCalculatorSchema({
    name: `${stateName} Salary Calculator 2025`,
    description: `Calculate your ${stateName} take-home pay for 2025.`,
    url: `/${params.state}-salary-calculator`,
    calculatorType: 'salary',
  })
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Calculators', href: '/calculators' },
    { name: `${stateName} Salary Calculator`, href: `/${params.state}-salary-calculator` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calcSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:text-foreground">Home</a></li>
            <li>/</li>
            <li><a href="/calculators" className="hover:text-foreground">Calculators</a></li>
            <li>/</li>
            <li className="text-foreground">{stateName}</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            {stateName} Salary Calculator 2025
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Calculate your exact {stateName} take-home pay after federal tax, {stateRateText}, Social Security,
            and Medicare. Updated with 2025 tax rates.
          </p>
        </div>

        <SalaryCalculator taxData={taxData} defaultState={stateCode} />

        <AdSlot slot="in-content" className="my-10" />

        {/* State-specific SEO content */}
        <div className="mt-12 prose prose-gray dark:prose-invert max-w-none">
          <h2>{stateName} Income Tax Overview 2025</h2>
          {stateData.type === 'none' ? (
            <p>
              {stateName} is one of nine states with no personal income tax. This makes it highly
              attractive for high earners. Residents still pay federal income tax (10%–37%) and
              FICA taxes (7.65%), but pay $0 in state income tax — a significant advantage.
            </p>
          ) : (
            <p>
              {stateName} has {stateRateText}. Combined with federal income tax and FICA, residents
              can face total effective tax rates ranging from around 20% for lower incomes to
              well over 40% for high earners.
            </p>
          )}

          <h2>Related Calculators</h2>
          <ul>
            <li><a href={`/${params.state}-paycheck-calculator`}>{stateName} Paycheck Calculator</a></li>
            <li><a href={`/${params.state}-overtime-calculator`}>{stateName} Overtime Calculator</a></li>
            <li><a href="/salary-calculator">National Salary Calculator</a></li>
            <li><a href="/contractor-calculator">Contractor Tax Calculator</a></li>
          </ul>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  )
    }
