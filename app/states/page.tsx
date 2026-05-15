import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Salary Calculator by State – All 50 States + DC | WagePilot',
  description: 'Free salary and paycheck calculators for all 50 US states and Washington D.C. See your exact take-home pay with state-specific income tax rates for 2025.',
  alternates: { canonical: '/states' },
}

const STATES = [
  { code: 'AL', name: 'Alabama', slug: 'alabama', rate: '5.0%', type: 'Flat' },
  { code: 'AK', name: 'Alaska', slug: 'alaska', rate: 'None', type: 'None' },
  { code: 'AZ', name: 'Arizona', slug: 'arizona', rate: '2.5%', type: 'Flat' },
  { code: 'AR', name: 'Arkansas', slug: 'arkansas', rate: '4.4%', type: 'Graduated' },
  { code: 'CA', name: 'California', slug: 'california', rate: '13.3%', type: 'Graduated' },
  { code: 'CO', name: 'Colorado', slug: 'colorado', rate: '4.4%', type: 'Flat' },
  { code: 'CT', name: 'Connecticut', slug: 'connecticut', rate: '6.99%', type: 'Graduated' },
  { code: 'DE', name: 'Delaware', slug: 'delaware', rate: '6.6%', type: 'Graduated' },
  { code: 'FL', name: 'Florida', slug: 'florida', rate: 'None', type: 'None' },
  { code: 'GA', name: 'Georgia', slug: 'georgia', rate: '5.5%', type: 'Flat' },
  { code: 'HI', name: 'Hawaii', slug: 'hawaii', rate: '11%', type: 'Graduated' },
  { code: 'ID', name: 'Idaho', slug: 'idaho', rate: '5.8%', type: 'Flat' },
  { code: 'IL', name: 'Illinois', slug: 'illinois', rate: '4.95%', type: 'Flat' },
  { code: 'IN', name: 'Indiana', slug: 'indiana', rate: '3.0%', type: 'Flat' },
  { code: 'IA', name: 'Iowa', slug: 'iowa', rate: '5.7%', type: 'Flat' },
  { code: 'KS', name: 'Kansas', slug: 'kansas', rate: '5.7%', type: 'Graduated' },
  { code: 'KY', name: 'Kentucky', slug: 'kentucky', rate: '4.0%', type: 'Flat' },
  { code: 'LA', name: 'Louisiana', slug: 'louisiana', rate: '4.25%', type: 'Graduated' },
  { code: 'ME', name: 'Maine', slug: 'maine', rate: '7.15%', type: 'Graduated' },
  { code: 'MD', name: 'Maryland', slug: 'maryland', rate: '5.75%', type: 'Graduated' },
  { code: 'MA', name: 'Massachusetts', slug: 'massachusetts', rate: '9%', type: 'Graduated' },
  { code: 'MI', name: 'Michigan', slug: 'michigan', rate: '4.25%', type: 'Flat' },
  { code: 'MN', name: 'Minnesota', slug: 'minnesota', rate: '9.85%', type: 'Graduated' },
  { code: 'MS', name: 'Mississippi', slug: 'mississippi', rate: '4.7%', type: 'Flat' },
  { code: 'MO', name: 'Missouri', slug: 'missouri', rate: '4.8%', type: 'Graduated' },
  { code: 'MT', name: 'Montana', slug: 'montana', rate: '5.9%', type: 'Graduated' },
  { code: 'NE', name: 'Nebraska', slug: 'nebraska', rate: '5.84%', type: 'Graduated' },
  { code: 'NV', name: 'Nevada', slug: 'nevada', rate: 'None', type: 'None' },
  { code: 'NH', name: 'New Hampshire', slug: 'new-hampshire', rate: 'None', type: 'None' },
  { code: 'NJ', name: 'New Jersey', slug: 'new-jersey', rate: '10.75%', type: 'Graduated' },
  { code: 'NM', name: 'New Mexico', slug: 'new-mexico', rate: '5.9%', type: 'Graduated' },
  { code: 'NY', name: 'New York', slug: 'new-york', rate: '10.9%', type: 'Graduated' },
  { code: 'NC', name: 'North Carolina', slug: 'north-carolina', rate: '4.49%', type: 'Flat' },
  { code: 'ND', name: 'North Dakota', slug: 'north-dakota', rate: '2.5%', type: 'Graduated' },
  { code: 'OH', name: 'Ohio', slug: 'ohio', rate: '3.99%', type: 'Graduated' },
  { code: 'OK', name: 'Oklahoma', slug: 'oklahoma', rate: '4.75%', type: 'Graduated' },
  { code: 'OR', name: 'Oregon', slug: 'oregon', rate: '9.9%', type: 'Graduated' },
  { code: 'PA', name: 'Pennsylvania', slug: 'pennsylvania', rate: '3.07%', type: 'Flat' },
  { code: 'RI', name: 'Rhode Island', slug: 'rhode-island', rate: '5.99%', type: 'Graduated' },
  { code: 'SC', name: 'South Carolina', slug: 'south-carolina', rate: '6.4%', type: 'Flat' },
  { code: 'SD', name: 'South Dakota', slug: 'south-dakota', rate: 'None', type: 'None' },
  { code: 'TN', name: 'Tennessee', slug: 'tennessee', rate: 'None', type: 'None' },
  { code: 'TX', name: 'Texas', slug: 'texas', rate: 'None', type: 'None' },
  { code: 'UT', name: 'Utah', slug: 'utah', rate: '4.55%', type: 'Flat' },
  { code: 'VT', name: 'Vermont', slug: 'vermont', rate: '8.75%', type: 'Graduated' },
  { code: 'VA', name: 'Virginia', slug: 'virginia', rate: '5.75%', type: 'Graduated' },
  { code: 'WA', name: 'Washington', slug: 'washington', rate: 'None', type: 'None' },
  { code: 'WV', name: 'West Virginia', slug: 'west-virginia', rate: '6.5%', type: 'Graduated' },
  { code: 'WI', name: 'Wisconsin', slug: 'wisconsin', rate: '7.65%', type: 'Graduated' },
  { code: 'WY', name: 'Wyoming', slug: 'wyoming', rate: 'None', type: 'None' },
  { code: 'DC', name: 'Washington D.C.', slug: 'washington-dc', rate: '10.75%', type: 'Graduated' },
]

const noTaxStates = STATES.filter(s => s.type === 'None')
const flatStates = STATES.filter(s => s.type === 'Flat')
const gradStates = STATES.filter(s => s.type === 'Graduated')

export default function StatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li className="text-foreground">All States</li>
        </ol>
      </nav>

      <div className="mb-10">
        <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
          Salary Calculator by State 2025
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Select your state to calculate your exact take-home pay with state-specific income tax rates.
        </p>
      </div>

      {/* No income tax states highlight */}
      <div className="mb-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
        <h2 className="mb-3 font-sora text-base font-semibold text-emerald-700 dark:text-emerald-400">
          🎉 States with No Income Tax
        </h2>
        <div className="flex flex-wrap gap-2">
          {noTaxStates.map(s => (
            <Link key={s.code} href={`/${s.slug}-salary-calculator`}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400 transition-colors">
              {s.name}
            </Link>
          ))}
        </div>
      </div>

      {/* All states table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-border bg-muted/30 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>State</span>
          <span>Top Rate</span>
          <span>Type</span>
          <span>Calculator</span>
        </div>
        <div className="divide-y divide-border">
          {STATES.map(s => (
            <div key={s.code} className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 px-5 py-3 text-sm hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-muted-foreground w-6">{s.code}</span>
                <span className="font-medium">{s.name}</span>
              </div>
              <span className={s.type === 'None' ? 'text-emerald-600 font-medium' : ''}>{s.rate}</span>
              <span className={`text-xs rounded-full px-2 py-0.5 w-fit ${
                s.type === 'None' ? 'bg-emerald-500/10 text-emerald-600' :
                s.type === 'Flat' ? 'bg-blue-500/10 text-blue-600' :
                'bg-amber-500/10 text-amber-600'
              }`}>{s.type}</span>
              <Link href={`/${s.slug}-salary-calculator`}
                className="text-primary hover:underline text-xs font-medium">
                Calculate →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
