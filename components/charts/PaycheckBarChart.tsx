'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/lib/tax'
import type { USSalaryResult } from '@/types'

interface Props {
  result: USSalaryResult
}

export function PaycheckBarChart({ result }: Props) {
  const data = [
    { name: 'Annual',    value: result.netAnnual,                gross: result.grossAnnual },
    { name: 'Monthly',   value: result.perPaycheck.monthly,      gross: result.grossAnnual / 12 },
    { name: 'Bi-weekly', value: result.perPaycheck.biWeekly,     gross: result.grossAnnual / 26 },
    { name: 'Weekly',    value: result.perPaycheck.weekly,       gross: result.grossAnnual / 52 },
  ]

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} barSize={16} barGap={4}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatCurrency(value),
            name === 'gross' ? 'Gross' : 'Net Take-Home',
          ]}
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--popover))',
            color: 'hsl(var(--foreground))',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="gross" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="gross" />
        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="net" />
      </BarChart>
    </ResponsiveContainer>
  )
}
