/**
 * Tax utility functions for WagePilot.
 * All tax logic reads from JSON data files — never hardcoded.
 * To update for a new tax year, add the new JSON file and bump the default year.
 */

import type {
  USTaxData,
  UKTaxData,
  FilingStatus,
  USSalaryInput,
  USSalaryResult,
  UKSalaryInput,
  UKSalaryResult,
  BracketItem,
  BandItem,
  PerPaycheckBreakdown,
  OvertimeInput,
  OvertimeResult,
  ContractorInput,
  ContractorResult,
} from '@/types'

// ─── Data Loaders ─────────────────────────────────────────────────────────────

/** Load US tax data for a given year from /data/tax/us/{year}.json */
export async function loadUSTaxData(year: number = 2025): Promise<USTaxData> {
  try {
    const data = await import(`@/data/tax/us/${year}.json`)
    return data.default as USTaxData
  } catch {
    // Fallback to latest year if specific year not found
    const fallback = await import('@/data/tax/us/2025.json')
    return fallback.default as USTaxData
  }
}

/** Load UK tax data for a given year from /data/tax/uk/{year}.json */
export async function loadUKTaxData(year: number = 2025): Promise<UKTaxData> {
  try {
    const data = await import(`@/data/tax/uk/${year}.json`)
    return data.default as UKTaxData
  } catch {
    const fallback = await import('@/data/tax/uk/2025.json')
    return fallback.default as UKTaxData
  }
}

// ─── Synchronous helpers (for client-side use with pre-loaded data) ────────────

/** Calculate US federal income tax from pre-loaded data */
export function getFederalTax(
  taxableIncome: number,
  filingStatus: FilingStatus,
  taxData: USTaxData
): { tax: number; breakdown: BracketItem[]; marginalRate: number } {
  const brackets = taxData.federal.brackets.filter(b => b.filing === filingStatus)
  let tax = 0
  const breakdown: BracketItem[] = []

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break
    const upper = bracket.max === null ? taxableIncome : Math.min(taxableIncome, bracket.max)
    const taxable = Math.max(0, upper - bracket.min)
    const amount = taxable * bracket.rate

    if (taxable > 0) {
      breakdown.push({
        bracket: `${formatCurrency(bracket.min)} – ${bracket.max ? formatCurrency(bracket.max) : '∞'}`,
        rate: bracket.rate,
        taxableAmount: taxable,
        taxAmount: amount,
      })
    }
    tax += amount
  }

  const marginalRate =
    brackets
      .filter(b => taxableIncome > b.min)
      .slice(-1)[0]?.rate ?? 0

  return { tax, breakdown, marginalRate }
}

/** Calculate US state income tax from pre-loaded data */
export function getStateTax(
  taxableIncome: number,
  stateCode: string,
  taxData: USTaxData
): { tax: number; effectiveRate: number } {
  const state = taxData.states[stateCode]
  if (!state || state.type === 'none') return { tax: 0, effectiveRate: 0 }

  let tax = 0

  if (state.type === 'flat') {
    tax = taxableIncome * state.rate
  } else if (state.type === 'graduated' && state.brackets.length > 0) {
    for (const bracket of state.brackets) {
      if (taxableIncome <= bracket.min) break
      const upper = bracket.max === null ? taxableIncome : Math.min(taxableIncome, bracket.max)
      const taxable = Math.max(0, upper - bracket.min)
      tax += taxable * bracket.rate
    }
  } else {
    // Graduated but no detailed brackets — use top rate as approximation
    tax = taxableIncome * state.rate
  }

  return {
    tax,
    effectiveRate: taxableIncome > 0 ? tax / taxableIncome : 0,
  }
}

/** Calculate FICA taxes (Social Security + Medicare) */
export function getFICATax(
  grossIncome: number,
  filingStatus: FilingStatus,
  taxData: USTaxData
): { socialSecurity: number; medicare: number; total: number } {
  const { socialSecurity, medicare } = taxData.fica

  // Social Security — capped at wage base
  const ssWages = Math.min(grossIncome, socialSecurity.wageBase)
  const ssTax = ssWages * socialSecurity.rate

  // Medicare — flat + additional above threshold
  const medicareBase = grossIncome * medicare.rate
  const additionalThreshold = medicare.additionalThreshold[filingStatus] ?? 200000
  const additionalMedicare =
    grossIncome > additionalThreshold
      ? (grossIncome - additionalThreshold) * medicare.additionalRate
      : 0

  const total = ssTax + medicareBase + additionalMedicare

  return { socialSecurity: ssTax, medicare: medicareBase + additionalMedicare, total }
}

/** Calculate UK PAYE income tax */
export function getUKIncomeTax(
  grossIncome: number,
  isScottish: boolean,
  taxData: UKTaxData
): { tax: number; breakdown: BandItem[]; marginalRate: number } {
  const bands = isScottish ? taxData.paye.scotland.bands : taxData.paye.bands

  // Taper personal allowance above threshold
  let personalAllowance = taxData.paye.personalAllowance
  if (grossIncome > taxData.paye.personalAllowanceTaperThreshold) {
    const excess = grossIncome - taxData.paye.personalAllowanceTaperThreshold
    personalAllowance = Math.max(0, personalAllowance - Math.floor(excess / 2))
  }

  let tax = 0
  const breakdown: BandItem[] = []

  for (const band of bands) {
    if (band.rate === 0) continue
    const bandMin = band.min === 0 ? personalAllowance : band.min
    if (grossIncome <= bandMin) break
    const upper = band.max === null ? grossIncome : Math.min(grossIncome, band.max)
    const taxable = Math.max(0, upper - bandMin)
    const amount = taxable * band.rate

    if (taxable > 0) {
      breakdown.push({
        band: band.name,
        rate: band.rate,
        taxableAmount: taxable,
        taxAmount: amount,
      })
    }
    tax += amount
  }

  const marginalRate =
    bands
      .filter(b => grossIncome > b.min)
      .slice(-1)[0]?.rate ?? 0

  return { tax, breakdown, marginalRate }
        }
      /** Calculate UK National Insurance (Employee Class 1) */
export function getUKNationalInsurance(
  grossIncome: number,
  taxData: UKTaxData
): { ni: number; effectiveRate: number } {
  const { employeeClass1 } = taxData.nationalInsurance
  let ni = 0

  if (grossIncome > employeeClass1.primaryThreshold) {
    const upperBand = Math.min(grossIncome, employeeClass1.upperEarningsLimit)
    const mainNI = (upperBand - employeeClass1.primaryThreshold) * employeeClass1.rate
    ni += mainNI

    if (grossIncome > employeeClass1.upperEarningsLimit) {
      ni += (grossIncome - employeeClass1.upperEarningsLimit) * employeeClass1.upperRate
    }
  }

  return { ni, effectiveRate: grossIncome > 0 ? ni / grossIncome : 0 }
}

/** Calculate UK student loan repayment */
export function getUKStudentLoanRepayment(
  grossIncome: number,
  plan: string,
  taxData: UKTaxData
): number {
  if (plan === 'none') return 0
  const planData = taxData.studentLoan[plan]
  if (!planData) return 0
  const repayable = Math.max(0, grossIncome - planData.threshold)
  return repayable * planData.rate
}

// ─── Full Net Pay Calculators ──────────────────────────────────────────────────

/** Main US salary calculator — returns full breakdown */
export function calculateUSNetPay(input: USSalaryInput, taxData: USTaxData): USSalaryResult {
  const { grossSalary, filingStatus, state, contribution401k = 0, contributionIRA = 0 } = input

  // Pre-tax deductions reduce federal & state taxable income
  const preTaxDeductions = contribution401k + contributionIRA
  const standardDeduction = taxData.federal.standardDeduction[filingStatus]
  const taxableIncome = Math.max(0, grossSalary - preTaxDeductions - standardDeduction)

  const { tax: federalTax, breakdown: bracketBreakdown, marginalRate: marginalFederalRate } =
    getFederalTax(taxableIncome, filingStatus, taxData)

  // State income tax uses gross minus pre-tax deductions (varies by state but this is standard)
  const stateTaxableIncome = Math.max(0, grossSalary - preTaxDeductions)
  const { tax: stateTax, effectiveRate: effectiveStateRate } =
    getStateTax(stateTaxableIncome, state, taxData)

  const { socialSecurity, medicare } = getFICATax(grossSalary, filingStatus, taxData)

  const totalDeductions = federalTax + stateTax + socialSecurity + medicare + preTaxDeductions
  const netAnnual = grossSalary - totalDeductions

  return {
    grossAnnual: grossSalary,
    federalTax,
    stateTax,
    socialSecurity,
    medicare,
    totalDeductions: federalTax + stateTax + socialSecurity + medicare,
    netAnnual,
    effectiveFederalRate: grossSalary > 0 ? federalTax / grossSalary : 0,
    effectiveStateRate,
    effectiveTotalRate: grossSalary > 0 ? (federalTax + stateTax + socialSecurity + medicare) / grossSalary : 0,
    perPaycheck: buildPerPaycheckBreakdown(netAnnual, grossSalary),
    marginalFederalRate,
    marginalStateRate: taxData.states[state]?.rate ?? 0,
    bracketBreakdown,
  }
}

/** Main UK salary calculator — returns full breakdown */
export function calculateUKNetPay(input: UKSalaryInput, taxData: UKTaxData): UKSalaryResult {
  const {
    grossSalary,
    region = 'england',
    pensionContribution = 0,
    pensionContributionType = 'percentage',
    studentLoanPlan = 'none',
  } = input

  const isScottish = region === 'scotland'

  // Pension contribution
  const pensionAmount =
    pensionContributionType === 'percentage'
      ? (grossSalary * pensionContribution) / 100
      : pensionContribution

  const grossAfterPension = Math.max(0, grossSalary - pensionAmount)

  const { tax: incomeTax, breakdown: bandBreakdown, marginalRate } =
    getUKIncomeTax(grossAfterPension, isScottish, taxData)

  const { ni: nationalInsurance } = getUKNationalInsurance(grossSalary, taxData)

  const studentLoanRepayment = getUKStudentLoanRepayment(grossSalary, studentLoanPlan, taxData)

  const totalDeductions = incomeTax + nationalInsurance + pensionAmount + studentLoanRepayment
  const netAnnual = grossSalary - totalDeductions

  return {
    grossAnnual: grossSalary,
    incomeTax,
    nationalInsurance,
    pensionContribution: pensionAmount,
    studentLoanRepayment,
    totalDeductions,
    netAnnual,
    effectiveIncomeTaxRate: grossSalary > 0 ? incomeTax / grossSalary : 0,
    effectiveNIRate: grossSalary > 0 ? nationalInsurance / grossSalary : 0,
    effectiveTotalRate: grossSalary > 0 ? totalDeductions / grossSalary : 0,
    perPaycheck: buildPerPaycheckBreakdown(netAnnual, grossSalary),
    bandBreakdown,
    marginalRate,
  }
}

/** Calculate overtime pay & taxes */
export function calculateOvertime(input: OvertimeInput, taxData: USTaxData): OvertimeResult {
  const {
    regularHours,
    overtimeHours,
    hourlyRate,
    overtimeMultiplier,
    state = 'TX',
    filingStatus = 'single',
  } = input

  const regularPay = regularHours * hourlyRate
  const overtimePay = overtimeHours * hourlyRate * overtimeMultiplier
  const grossPay = regularPay + overtimePay

  // Annualise for tax bracket calculation (assume 52 weeks)
  const annualEstimate = grossPay * 52
  const standardDeduction = taxData.federal.standardDeduction[filingStatus]
  const taxableAnnual = Math.max(0, annualEstimate - standardDeduction)

  const { tax: annualFederal } = getFederalTax(taxableAnnual, filingStatus, taxData)
  const { tax: annualState } = getStateTax(annualEstimate, state, taxData)
  const { total: annualFICA } = getFICATax(annualEstimate, filingStatus, taxData)

  // Convert back to per-period
  const federalTax = (annualFederal / 52)
  const stateTax = (annualState / 52)
  const ficaTax = (annualFICA / 52)

  const netPay = grossPay - federalTax - stateTax - ficaTax

  return {
    regularPay,
    overtimePay,
    grossPay,
    federalTax,
    stateTax,
    ficaTax,
    netPay,
    effectiveRate: grossPay > 0 ? (federalTax + stateTax + ficaTax) / grossPay : 0,
  }
}

/** Calculate contractor / self-employed taxes */
export function calculateContractor(input: ContractorInput, taxData: USTaxData): ContractorResult {
  const {
    annualRevenue,
    businessExpenses,
    state,
    filingStatus,
    retirementContribution = 0,
    healthInsurance = 0,
  } = input

  const netSelfEmploymentIncome = Math.max(0, annualRevenue - businessExpenses)

  // Self-employment tax: 15.3% on 92.35% of net SE income
  const seBase = netSelfEmploymentIncome * 0.9235
  const selfEmploymentTax = seBase * 0.153

  // Deductible portion of SE tax (50%)
  const seDeduction = selfEmploymentTax * 0.5

  const adjustedGrossIncome = Math.max(
    0,
    netSelfEmploymentIncome - seDeduction - retirementContribution - healthInsurance
  )

  const standardDeduction = taxData.federal.standardDeduction[filingStatus]
  const taxableIncome = Math.max(0, adjustedGrossIncome - standardDeduction)

  const { tax: federalIncomeTax } = getFederalTax(taxableIncome, filingStatus, taxData)
  const { tax: stateIncomeTax } = getStateTax(adjustedGrossIncome, state, taxData)

  const totalTaxBurden = selfEmploymentTax + federalIncomeTax + stateIncomeTax
  const netTakeHome = annualRevenue - businessExpenses - totalTaxBurden

  return {
    grossRevenue: annualRevenue,
    businessExpenses,
    netSelfEmploymentIncome,
    selfEmploymentTax,
    adjustedGrossIncome,
    federalIncomeTax,
    stateIncomeTax,
    totalTaxBurden,
    netTakeHome,
    effectiveRate: annualRevenue > 0 ? totalTaxBurden / annualRevenue : 0,
    quarterlyEstimatedTax: totalTaxBurden / 4,
  }
}
// ─── Utility Helpers ──────────────────────────────────────────────────────────

function buildPerPaycheckBreakdown(netAnnual: number, grossAnnual: number): PerPaycheckBreakdown {
  const workingDaysPerYear = 260
  const hoursPerYear = 2080

  return {
    annual: netAnnual,
    monthly: netAnnual / 12,
    biWeekly: netAnnual / 26,
    weekly: netAnnual / 52,
    daily: netAnnual / workingDaysPerYear,
    hourly: netAnnual / hoursPerYear,
  }
}

export function formatCurrency(value: number, currency = 'USD', compact = false): string {
  const opts: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }
  if (compact && value >= 1000) {
    opts.notation = 'compact'
    opts.compactDisplay = 'short'
  }
  return new Intl.NumberFormat('en-US', opts).format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function hourlyToAnnual(hourlyRate: number, hoursPerWeek = 40): number {
  return hourlyRate * hoursPerWeek * 52
}

export function annualToHourly(annualSalary: number, hoursPerWeek = 40): number {
  return annualSalary / (hoursPerWeek * 52)
}

export function getPayFrequencyDivisor(frequency: string): number {
  const map: Record<string, number> = {
    annual: 1,
    monthly: 12,
    semi_monthly: 24,
    bi_weekly: 26,
    weekly: 52,
    daily: 260,
    hourly: 2080,
  }
  return map[frequency] ?? 12
    }
  
