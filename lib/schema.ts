import type { FAQItem, CalculatorType } from '@/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wagepilot.com'
const SITE_NAME = 'WagePilot'

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/logo.png`,
    description:
      'WagePilot provides free, accurate salary, paycheck, tax, and financial calculators for USA and UK workers.',
    sameAs: [
      'https://twitter.com/wagepilot',
      'https://linkedin.com/company/wagepilot',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${SITE_URL}/contact`,
    },
  }
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateCalculatorSchema(params: {
  name: string
  description: string
  url: string
  calculatorType: CalculatorType
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: params.name,
    description: params.description,
    url: `${SITE_URL}${params.url}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

export function generateBreadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  }
}

export function generateArticleSchema(params: {
  title: string
  description: string
  url: string
  publishedAt: string
  updatedAt?: string
  authorName: string
  imageUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    url: `${SITE_URL}${params.url}`,
    datePublished: params.publishedAt,
    dateModified: params.updatedAt || params.publishedAt,
    author: {
      '@type': 'Person',
      name: params.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icons/logo.png`,
      },
    },
    image: params.imageUrl ? `${SITE_URL}${params.imageUrl}` : `${SITE_URL}/og-image.png`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${params.url}`,
    },
  }
}

export function generateWebPageSchema(params: {
  title: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: params.title,
    description: params.description,
    url: `${SITE_URL}${params.url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

/** Generate metadata for state-specific calculator pages */
export function generateStateCalculatorMeta(params: {
  stateName: string
  stateCode: string
  calculatorType: CalculatorType
  year?: number
}) {
  const { stateName, calculatorType, year = 2025 } = params
  const typeLabel = calculatorTypeLabel(calculatorType)

  return {
    title: `${stateName} ${typeLabel} ${year} – Free Calculator | WagePilot`,
    description: `Calculate your ${stateName.toLowerCase()} take-home pay with our free ${typeLabel.toLowerCase()} for ${year}. Includes ${stateName} state income tax, federal tax, Social Security and Medicare.`,
    canonical: `/${params.stateCode.toLowerCase()}-${calculatorType}-calculator`,
  }
}

export function generateUKRegionCalculatorMeta(params: {
  regionName: string
  calculatorType: CalculatorType
  year?: number
}) {
  const { regionName, calculatorType, year = 2025 } = params
  const typeLabel = calculatorTypeLabel(calculatorType)

  return {
    title: `${regionName} ${typeLabel} ${year} – Free UK Calculator | WagePilot`,
    description: `Calculate your ${regionName} take-home pay after income tax and National Insurance for ${year}/${year + 1} tax year.`,
  }
}

function calculatorTypeLabel(type: CalculatorType): string {
  const labels: Record<CalculatorType, string> = {
    salary: 'Salary Calculator',
    paycheck: 'Paycheck Calculator',
    hourly: 'Hourly to Salary Calculator',
    overtime: 'Overtime Calculator',
    contractor: 'Contractor Tax Calculator',
    mortgage: 'Mortgage Affordability Calculator',
    savings: 'Savings Calculator',
    'cost-of-living': 'Cost of Living Calculator',
    comparison: 'Salary Comparison Tool',
    'take-home': 'Take-Home Pay Calculator',
  }
  return labels[type] || 'Calculator'
    }
