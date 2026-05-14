// ─── Tax Data Types ──────────────────────────────────────────────────────────

export type FilingStatus =
  | 'single'
  | 'married_jointly'
  | 'married_separately'
  | 'head_of_household'

export type Country = 'US' | 'UK'

export type USTaxYear = 2024 | 2025
export type UKTaxYear = 2024 | 2025

export interface TaxBracket {
  min: number
  max: number | null
  rate: number
  filing?: FilingStatus
}

export interface StateData {
  name: string
  rate: number
  type: 'flat' | 'graduated' | 'none'
  brackets: TaxBracket[]
}

export interface USTaxData {
  year: number
  country: 'US'
  federal: {
    brackets: TaxBracket[]
    standardDeduction: Record<FilingStatus, number>
  }
  fica: {
    socialSecurity: { rate: number; wageBase: number }
    medicare: {
      rate: number
      additionalRate: number
      additionalThreshold: Record<FilingStatus, number>
    }
  }
  states: Record<string, StateData>
  retirement: {
    '401k': { employeeLimit: number; catchUpAge: number; catchUpLimit: number }
    ira: { limit: number; catchUpLimit: number }
  }
}

export interface PAYEBand {
  name: string
  min: number
  max: number | null
  rate: number
}

export interface UKTaxData {
  year: number
  country: 'UK'
  paye: {
    personalAllowance: number
    personalAllowanceTaperThreshold: number
    bands: PAYEBand[]
    scotland: { bands: PAYEBand[] }
  }
  nationalInsurance: {
    employeeClass1: {
      primaryThreshold: number
      upperEarningsLimit: number
      rate: number
      upperRate: number
    }
    employerClass1: { secondaryThreshold: number; rate: number }
    selfEmployedClass4: {
      lowerProfitsLimit: number
      upperProfitsLimit: number
      rate: number
      upperRate: number
    }
    selfEmployedClass2: { smallProfitsThreshold: number; weeklyRate: number }
  }
  studentLoan: Record<string, { threshold: number; rate: number }>
  pension: {
    autoEnrollmentMinEmployeeRate: number
    autoEnrollmentMinEmployerRate: number
    annualAllowance: number
  }
  regions: Record<string, { name: string; useScottishRates: boolean }>
  taxYear: { start: string; end: string }
}

// ─── Calculator Input/Output Types ───────────────────────────────────────────

export interface USSalaryInput {
  grossSalary: number
  state: string
  filingStatus: FilingStatus
  payFrequency: PayFrequency
  year: USTaxYear
  age?: number
  contribution401k?: number
  contributionIRA?: number
  allowances?: number
  additionalWithholding?: number
}

export interface USSalaryResult {
  grossAnnual: number
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  totalDeductions: number
  netAnnual: number
  effectiveFederalRate: number
  effectiveStateRate: number
  effectiveTotalRate: number
  perPaycheck: PerPaycheckBreakdown
  marginalFederalRate: number
  marginalStateRate: number
  bracketBreakdown: BracketItem[]
}

export interface UKSalaryInput {
  grossSalary: number
  region: 'england' | 'scotland' | 'wales' | 'northern_ireland'
  year: UKTaxYear
  isScottish?: boolean
  pensionContribution?: number
  pensionContributionType?: 'percentage' | 'amount'
  studentLoanPlan?: 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgraduate'
  isSelfEmployed?: boolean
  taxCode?: string
}

export interface UKSalaryResult {
  grossAnnual: number
  incomeTax: number
  nationalInsurance: number
  pensionContribution: number
  studentLoanRepayment: number
  totalDeductions: number
  netAnnual: number
  effectiveIncomeTaxRate: number
  effectiveNIRate: number
  effectiveTotalRate: number
  perPaycheck: PerPaycheckBreakdown
  bandBreakdown: BandItem[]
  marginalRate: number
}

export interface PerPaycheckBreakdown {
  annual: number
  monthly: number
  biWeekly: number
  weekly: number
  daily: number
  hourly: number
}

export interface BracketItem {
  bracket: string
  rate: number
  taxableAmount: number
  taxAmount: number
}

export interface BandItem {
  band: string
  rate: number
  taxableAmount: number
  taxAmount: number
}

export type PayFrequency =
  | 'annual'
  | 'monthly'
  | 'semi_monthly'
  | 'bi_weekly'
  | 'weekly'
  | 'daily'
  | 'hourly'

// ─── Overtime Calculator ─────────────────────────────────────────────────────

export interface OvertimeInput {
  regularHours: number
  overtimeHours: number
  hourlyRate: number
  overtimeMultiplier: number
  state?: string
  filingStatus?: FilingStatus
  year?: USTaxYear
}

export interface OvertimeResult {
  regularPay: number
  overtimePay: number
  grossPay: number
  federalTax: number
  stateTax: number
  ficaTax: number
  netPay: number
  effectiveRate: number
}

// ─── Contractor Calculator ───────────────────────────────────────────────────

export interface ContractorInput {
  annualRevenue: number
  businessExpenses: number
  state: string
  filingStatus: FilingStatus
  year: USTaxYear
  entityType: 'sole_prop' | 'llc_single' | 'llc_multi' | 's_corp' | 'c_corp'
  retirementContribution?: number
  healthInsurance?: number
}

export interface ContractorResult {
  grossRevenue: number
  businessExpenses: number
  netSelfEmploymentIncome: number
  selfEmploymentTax: number
  adjustedGrossIncome: number
  federalIncomeTax: number
  stateIncomeTax: number
  totalTaxBurden: number
  netTakeHome: number
  effectiveRate: number
  quarterlyEstimatedTax: number
}

// ─── Cost of Living ──────────────────────────────────────────────────────────

export interface CostOfLivingCity {
  city: string
  state: string
  costIndex: number
  housingIndex: number
  foodIndex: number
  transportIndex: number
  healthcareIndex: number
  medianRent1BR: number
  medianRent2BR: number
}

// ─── Blog Types ──────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  content: string
  category: BlogCategory
  author: Author
  publishedAt: string
  updatedAt?: string
  readTime: number
  tags: string[]
  featured: boolean
  seoTitle?: string
  seoDescription?: string
  imageUrl?: string
}

export type BlogCategory =
  | 'tax-guides'
  | 'salary-guides'
  | 'overtime-laws'
  | 'cost-of-living'
  | 'financial-planning'
  | 'uk-paye'
  | 'irs-updates'

export interface Author {
  name: string
  bio: string
  avatarUrl: string
}

// ─── SEO Page Types ───────────────────────────────────────────────────────────

export interface SEOPage {
  id: string
  slug: string
  title: string
  description: string
  h1: string
  content: string
  faqItems: FAQItem[]
  internalLinks: InternalLink[]
  calculatorType: CalculatorType
  location?: {
    state?: string
    stateCode?: string
    city?: string
    country: Country
    region?: string
  }
  publishedAt: string
  updatedAt?: string
}

export type CalculatorType =
  | 'salary'
  | 'paycheck'
  | 'hourly'
  | 'overtime'
  | 'contractor'
  | 'mortgage'
  | 'savings'
  | 'cost-of-living'
  | 'comparison'
  | 'take-home'

export interface FAQItem {
  question: string
  answer: string
}

export interface InternalLink {
  text: string
  href: string
}

// ─── Supabase DB Row Types ────────────────────────────────────────────────────

export interface DBBlogPost {
  id: string
  slug: string
  title: string
  description: string
  content: string
  category: BlogCategory
  author_name: string
  author_bio: string
  author_avatar: string
  published_at: string
  updated_at: string | null
  read_time: number
  tags: string[]
  featured: boolean
  seo_title: string | null
  seo_description: string | null
  image_url: string | null
  created_at: string
}

export interface DBSEOPage {
  id: string
  slug: string
  title: string
  description: string
  h1: string
  content: string
  faq_items: FAQItem[]
  internal_links: InternalLink[]
  calculator_type: CalculatorType
  location: SEOPage['location'] | null
  published_at: string
  updated_at: string | null
  created_at: string
}

export interface DBNewsletterSubscriber {
  id: string
  email: string
  subscribed_at: string
  confirmed: boolean
  source: string | null
}

export interface DBContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  replied: boolean
}
// ─── Chart Data Types ────────────────────────────────────────────────────────

export interface TaxBreakdownChartData {
  name: string
  value: number
  color: string
  percentage: number
}

export interface PaycheckTimelineData {
  month: string
  gross: number
  net: number
  taxes: number
}

// ─── Ad Types ────────────────────────────────────────────────────────────────

export type AdSlotType = 'leaderboard' | 'sidebar' | 'in-content' | 'mobile-banner'

export interface AdSlotProps {
  slot: AdSlotType
  className?: string
  adUnitPath?: string
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

// ─── US States Reference ──────────────────────────────────────────────────────

export interface USStateInfo {
  code: string
  name: string
  slug: string
  hasIncomeTax: boolean
}

export interface UKRegionInfo {
  code: string
  name: string
  slug: string
  usesScottishRates: boolean
}
