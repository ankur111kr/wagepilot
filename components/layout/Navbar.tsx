'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Calculator, Moon, Sun, Plane } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

const navItems: NavItem[] = [
  {
    label: 'Calculators',
    href: '/calculators',
    children: [
      { label: 'Salary Calculator', href: '/salary-calculator' },
      { label: 'Paycheck Calculator', href: '/paycheck-calculator' },
      { label: 'Hourly to Salary', href: '/hourly-to-salary-calculator' },
      { label: 'Overtime Calculator', href: '/overtime-calculator' },
      { label: 'Contractor Calculator', href: '/contractor-calculator' },
      { label: 'Take-Home Pay', href: '/take-home-pay-calculator' },
      { label: 'Cost of Living', href: '/cost-of-living-calculator' },
      { label: 'Savings Calculator', href: '/savings-calculator' },
    ],
  },
  {
    label: 'By State',
    href: '/states',
    children: [
      { label: 'California', href: '/california-salary-calculator' },
      { label: 'Texas', href: '/texas-paycheck-calculator' },
      { label: 'New York', href: '/new-york-salary-calculator' },
      { label: 'Florida', href: '/florida-salary-calculator' },
      { label: 'All States →', href: '/states' },
    ],
  },
  { label: 'UK Tax', href: '/uk-income-tax-calculator' },
  { label: 'Blog', href: '/blog' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/80 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-sora font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Plane className="h-4 w-4" />
          </div>
          <span className="gradient-text">WagePilot</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map(item => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
                {item.children && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
              </Link>

              {/* Dropdown */}
              <AnimatePresence>
                {item.children && activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1 min-w-[200px] rounded-xl border border-border bg-popover p-1.5 shadow-lg"
                  >
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Calculator className="h-3.5 w-3.5 opacity-50" />
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          {/* CTA */}
          <Link
            href="/salary-calculator"
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:block"
          >
            Calculate Now
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
              {navItems.map(item => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-2">
                <Link
                  href="/salary-calculator"
                  className="block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
                >
                  Calculate My Salary
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
