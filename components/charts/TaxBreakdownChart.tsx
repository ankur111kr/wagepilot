'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/tax'
import type { USSalaryResult } from '@/types'

interface Props {
  result: USSalaryResult
}

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6']

export function TaxBreakdownChart({ result }: Props) {
  const data = [
    { name: 'Take-Home',    value: result.netAnnual,     color: COLORS[3] },
    { name: 'Federal Tax',  value: result.federalTax,    color: COLORS[0] },
    { name: 'State Tax',    value: result.stateTax,      color: COLORS[4] },
    { name: 'Soc. Security',value: result.socialSecurity,color: COLORS[1] },
    { name: 'Medicare',     value: result.medicare,      color: COLORS[2] },
  ].filter(d => d.value > 0)

  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={65}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), '']}
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--popover))',
            color: 'hsl(var(--foreground))',
            fontSize: '12px',
          }}
        />
        <Legend
          iconSize={8}
          iconType="circle"
          formatter={(value) => <span style={{ fontSize: '10px' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
