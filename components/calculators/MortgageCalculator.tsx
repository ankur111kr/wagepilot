'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/tax'
import { AlertTriangle } from 'lucide-react'

interface MortgageResult {
  maxHomePriceConservative: number
  maxHomePriceDTI: number
  monthlyPayment: number
  principalInterest: number
  estimatedTax: number
  estimatedInsurance: number
  estimatedPMI: number
  totalMonthlyHousing: number
  dtiRatio: number
  loanAmount: number
  downPaymentAmount: number
}

function calculateMortgage(
  annualIncome: number,
  monthlyDebts: number,
  downPayment: number,
  downPaymentType: 'percent' | 'amount',
  interestRate: number,
  loanTermYears: number,
  homePrice: number
): MortgageResult {
  const monthlyIncome = annualIncome / 12
  const downPaymentAmount = downPaymentType === 'percent'
    ? homePrice * (downPayment / 100)
    : downPayment
  const downPaymentPct = downPaymentAmount / homePrice

  const loanAmount = homePrice - downPaymentAmount
  const monthlyRate = interestRate / 100 / 12
  const numPayments = loanTermYears * 12

  // P&I payment
  const principalInterest = monthlyRate === 0
    ? loanAmount / numPayments
    : loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)

  const estimatedTax = (homePrice * 0.012) / 12    // ~1.2% annual property tax
  const estimatedInsurance = (homePrice * 0.005) / 12 // ~0.5% annual insurance
  const estimatedPMI = downPaymentPct < 0.2 ? (loanAmount * 0.01) / 12 : 0 // 1% annual PMI if <20% down

  const totalMonthlyHousing = principalInterest + estimatedTax + estimatedInsurance + estimatedPMI
  const dtiRatio = (totalMonthlyHousing + monthlyDebts) / monthlyIncome

  // Max home price: front-end DTI 28%, back-end DTI 36%
  const maxPIFrontEnd = monthlyIncome * 0.28 - estimatedTax - estimatedInsurance
  const maxPIBackEnd = (monthlyIncome * 0.36 - monthlyDebts) - estimatedTax - estimatedInsurance

  const maxPIConservative = Math.min(maxPIFrontEnd, maxPIBackEnd)
  const maxLoanConservative = maxPIConservative > 0
    ? maxPIConservative * (Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments))
    : 0
  const maxHomePriceConservative = maxLoanConservative + downPaymentAmount

  const maxPIDTI = (monthlyIncome * 0.43 - monthlyDebts) - estimatedTax - estimatedInsurance
  const maxLoanDTI = maxPIDTI > 0
    ? maxPIDTI * (Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments))
    : 0
  const maxHomePriceDTI = maxLoanDTI + downPaymentAmount

  return {
    maxHomePriceConservative,
    maxHomePriceDTI,
    monthlyPayment: principalInterest,
    principalInterest,
    estimatedTax,
    estimatedInsurance,
    estimatedPMI,
    totalMonthlyHousing,
    dtiRatio,
    loanAmount,
    downPaymentAmount,
  }
}

export function MortgageCalculator() {
  const [annualIncome, setAnnualIncome] = useState(85000)
  const [monthlyDebts, setMonthlyDebts] = useState(500)
  const [downPayment, setDownPayment] = useState(20)
  const [downPaymentType] = useState<'percent' | 'amount'>('percent')
  const [interestRate, setInterestRate] = useState(6.8)
  const [loanTerm, setLoanTerm] = useState(30)
  const [homePrice, setHomePrice] = useState(400000)
  const [result, setResult] = useState<MortgageResult | null>(null)

  const calculate = useCallback(() => {
    setResult(calculateMortgage(annualIncome, monthlyDebts, downPayment, downPaymentType, interestRate, loanTerm, homePrice))
  }, [annualIncome, monthlyDebts, downPayment, downPaymentType, interestRate, loanTerm, homePrice])

  useEffect(() => { calculate() }, [calculate])

  const chartData = result ? [
    { name: 'Principal & Interest', value: Math.round(result.principalInterest), color: '#3b82f6' },
    { name: 'Property Tax', value: Math.round(result.estimatedTax), color: '#f59e0b' },
    { name: 'Insurance', value: Math.round(result.estimatedInsurance), color: '#10b981' },
    ...(result.estimatedPMI > 0 ? [{ name: 'PMI', value: Math.round(result.estimatedPMI), color: '#ef4444' }] : []),
  ] : []

  const dtiStatus = result
    ? result.dtiRatio <= 0.28 ? 'excellent' : result.dtiRatio <= 0.36 ? 'good' : result.dtiRatio <= 0.43 ? 'caution' : 'high'
    : 'good'

  const dtiColors = { excellent: 'text-emerald-600', good: 'text-blue-600', caution: 'text-amber-600', high: 'text-destructive' }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Inputs */}
      <div className="wp-card p-6 space-y-5">
        <h2 className="font-sora text-lg font-semibold">Your Financial Profile</h2>

        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Annual Household Income</span>
            <span className="font-normal text-muted-foreground">{formatCurrency(annualIncome)}</span>
          </label>
          <input type="range" min={30000} max={500000} step={5000} value={annualIncome}
            onChange={e => setAnnualIncome(Number(e.target.value))} className="w-full accent-primary" />
        </div>

        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Monthly Debt Payments</span>
            <span className="font-normal text-muted-foreground">{formatCurrency(monthlyDebts)}/mo</span>
          </label>
          <p className="mb-1 text-xs text-muted-foreground">Car loans, student loans, credit cards</p>
          <input type="range" min={0} max={5000} step={50} value={monthlyDebts}
            onChange={e => setMonthlyDebts(Number(e.target.value))} className="w-full accent-primary" />
        </div>

        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Home Price</span>
            <span className="font-normal text-muted-foreground">{formatCurrency(homePrice)}</span>
          </label>
          <input type="range" min={100000} max={2000000} step={10000} value={homePrice}
            onChange={e => setHomePrice(Number(e.target.value))} className="w-full accent-primary" />
        </div>

        <div>
          <label className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Down Payment</span>
            <span className="font-normal text-muted-foreground">{downPayment}% ({formatCurrency(homePrice * downPayment / 100)})</span>
          </label>
          <input type="range" min={3} max={50} step={1} value={downPayment}
            onChange={e => setDownPayment(Number(e.target.value))} className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>3% (FHA min)</span><span>50%</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 flex justify-between text-sm font-medium">
              <span>Interest Rate</span>
              <span className="font-normal text-muted-foreground">{interestRate}%</span>
            </label>
            <input type="range" min={3} max={12} step={0.1} value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Loan Term</label>
            <div className="grid grid-cols-2 gap-2">
              {[15, 30].map(y => (
                <button key={y} onClick={() => setLoanTerm(y)}
                  className={`rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${
                    loanTerm === y ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                  }`}>{y} yr</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div key={result.totalMonthlyHousing} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Affordability range */}
          <div className="wp-card p-6">
            <p className="text-sm text-muted-foreground">You Can Afford</p>
            <p className="mt-1 font-sora text-4xl font-bold">{formatCurrency(result.maxHomePriceConservative)}</p>
            <p className="text-sm text-muted-foreground mt-1">conservative estimate (28/36 DTI rule)</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Up to {formatCurrency(result.maxHomePriceDTI)}</span>
              <span className="text-xs">(max 43% DTI)</span>
            </div>
          </div>

          {/* Monthly payment breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="wp-card p-4">
              <p className="text-xs text-muted-foreground">Total Monthly Payment</p>
              <p className="font-sora text-2xl font-bold mt-1">{formatCurrency(result.totalMonthlyHousing)}</p>
            </div>
            <div className="wp-card p-4">
              <p className="text-xs text-muted-foreground">Debt-to-Income Ratio</p>
              <p className={`font-sora text-2xl font-bold mt-1 ${dtiColors[dtiStatus]}`}>
                {(result.dtiRatio * 100).toFixed(1)}%
              </p>
              <p className={`text-xs capitalize ${dtiColors[dtiStatus]}`}>{dtiStatus}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="wp-card p-5">
            <h3 className="mb-2 text-sm font-semibold">Monthly Payment Breakdown</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.color} strokeWidth={0} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [formatCurrency(v), '']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))', fontSize: '12px' }} />
                <Legend iconSize={8} iconType="circle" formatter={(v) => <span style={{ fontSize: '10px' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* PMI warning */}
          {result.estimatedPMI > 0 && (
            <div className="wp-card border-amber-500/30 bg-amber-500/5 p-4">
              <div className="flex gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  With less than 20% down, PMI is required — adding {formatCurrency(result.estimatedPMI)}/month.
                  PMI can be removed once you reach 20% equity (~{formatCurrency(homePrice * 0.2)} in equity).
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
