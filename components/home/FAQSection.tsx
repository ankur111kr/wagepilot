'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { FAQItem } from '@/types'

interface Props {
  faqs: FAQItem[]
  title?: string
}

export function FAQSection({ faqs, title = 'Frequently Asked Questions' }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 font-sora text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-accent/50 transition-colors"
                aria-expanded={open === i}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ml-3 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
