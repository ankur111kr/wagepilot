'use client'

import { motion } from 'framer-motion'
import { Zap, RefreshCw, Download, Share2, Moon, BarChart2 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Instant Calculations',
    description: 'Results update in real-time as you type. No submit button needed.',
  },
  {
    icon: RefreshCw,
    title: '2025 Tax Data',
    description: 'Updated IRS brackets, FICA rates, and all 51 state income tax rates.',
  },
  {
    icon: BarChart2,
    title: 'Animated Charts',
    description: 'Visual tax breakdowns with interactive pie charts and bar graphs.',
  },
  {
    icon: Download,
    title: 'Export & Print',
    description: 'Download, print, or copy your results. Share with a unique URL.',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description: 'Full dark/light mode. Looks great on any device.',
  },
  {
    icon: Share2,
    title: 'UK + US Coverage',
    description: 'Full PAYE, NI, and Scottish tax rates alongside all US state taxes.',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-muted/20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            Built for accuracy. Designed for speed.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Professional-grade tax tools without the professional price tag.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-sora text-sm font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
