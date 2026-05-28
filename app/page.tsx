'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  Moon, Sun, Menu, X, ChevronDown, Calculator, DollarSign,
  Clock, Briefcase, TrendingUp, Percent, ArrowRight, Check,
  Shield, Zap, Globe, Smartphone, Lock, Star, Mail,
  BookOpen, BarChart2, MapPin
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
type Country = 'USA' | 'UK'
type FilingStatus = 'single' | 'married' | 'head'
type Theme = 'dark' | 'light'

// ─── Tax calculation helpers ─────────────────────────────────────────────────
function calcUS(gross: number, state: string, filing: FilingStatus) {
  const stdDeduction = filing === 'married' ? 30000 : filing === 'head' ? 22500 : 15000
  const taxable = Math.max(0, gross - stdDeduction)
  const brackets = filing === 'married'
    ? [[23850,0.10],[96950,0.12],[206700,0.22],[394600,0.24],[501050,0.32],[751600,0.35],[Infinity,0.37]]
    : [[11925,0.10],[48475,0.12],[103350,0.22],[197300,0.24],[250525,0.32],[626350,0.35],[Infinity,0.37]]
  let federal = 0, prev = 0
  for (const [limit, rate] of brackets as [number,number][]) {
    if (taxable <= prev) break
    federal += (Math.min(taxable, limit) - prev) * rate
    prev = limit
  }
  const stateRates: Record<string,number> = {
    TX:0, FL:0, WA:0, NV:0, SD:0, TN:0, WY:0, AK:0,
    CA:0.093, NY:0.0685, IL:0.0495, CO:0.044, GA:0.055,
    PA:0.0307, AZ:0.025, NC:0.0449, MA:0.05, VA:0.0575,
    OH:0.0399, MI:0.0425, OR:0.0875, NJ:0.0637, MN:0.0785,
  }
  const stateTax = gross * (stateRates[state] || 0)
  const ss = Math.min(gross, 176100) * 0.062
  const medicare = gross * 0.0145
  const total = federal + stateTax + ss + medicare
  return { federal: Math.round(federal), state: Math.round(stateTax), ss: Math.round(ss), medicare: Math.round(medicare), net: Math.round(gross - total), total: Math.round(total) }
}

function calcUK(gross: number) {
  const pa = 12570
  const taxable = Math.max(0, gross - pa)
  const basicBand = Math.min(taxable, 37700)
  const higherBand = Math.max(0, Math.min(taxable - 37700, 87430))
  const additionalBand = Math.max(0, taxable - 125140)
  const incomeTax = basicBand * 0.20 + higherBand * 0.40 + additionalBand * 0.45
  let ni = 0
  if (gross > 12570) ni += Math.min(gross - 12570, 37700) * 0.08
  if (gross > 50270) ni += (gross - 50270) * 0.02
  const total = incomeTax + ni
  return { incomeTax: Math.round(incomeTax), ni: Math.round(ni), net: Math.round(gross - total), total: Math.round(total) }
}

function fmt(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
}

// ─── Data ────────────────────────────────────────────────────────────────────
const US_STATES = [
  {code:'TX',name:'Texas'},{code:'CA',name:'California'},{code:'FL',name:'Florida'},
  {code:'NY',name:'New York'},{code:'WA',name:'Washington'},{code:'IL',name:'Illinois'},
  {code:'PA',name:'Pennsylvania'},{code:'GA',name:'Georgia'},{code:'CO',name:'Colorado'},
  {code:'AZ',name:'Arizona'},{code:'NC',name:'North Carolina'},{code:'VA',name:'Virginia'},
  {code:'MA',name:'Massachusetts'},{code:'NV',name:'Nevada'},{code:'OH',name:'Ohio'},
]

const UK_REGIONS = [
  {code:'ENG',name:'England'},{code:'SCT',name:'Scotland'},
  {code:'WLS',name:'Wales'},{code:'NIR',name:'N. Ireland'},
]

const CALCULATORS = [
  { icon: DollarSign, title: 'Paycheck Calculator', desc: 'See exactly what lands in your bank account each pay period.', href: '/paycheck-calculator', color: 'from-blue-500 to-blue-600' },
  { icon: TrendingUp, title: 'Salary Calculator', desc: 'Calculate annual take-home pay with full tax breakdown.', href: '/salary-calculator', color: 'from-violet-500 to-violet-600' },
  { icon: Clock, title: 'Overtime Calculator', desc: 'Compute 1.5×, 2× overtime pay and its tax impact.', href: '/overtime-calculator', color: 'from-amber-500 to-amber-600' },
  { icon: Percent, title: 'Hourly → Salary', desc: 'Instantly convert hourly wages to annual salary.', href: '/hourly-to-salary-calculator', color: 'from-emerald-500 to-emerald-600' },
  { icon: Calculator, title: 'Take Home Pay', desc: 'Quick net pay after all deductions and taxes.', href: '/take-home-pay-calculator', color: 'from-cyan-500 to-cyan-600' },
  { icon: Briefcase, title: 'Contractor Tax', desc: 'Self-employment tax, quarterly estimates, and deductions.', href: '/contractor-calculator', color: 'from-rose-500 to-rose-600' },
]

const FEATURES = [
  { icon: Shield, title: 'Accurate Tax Rates', desc: 'IRS & HMRC verified 2026 tax brackets updated annually.' },
  { icon: Globe, title: 'USA & UK Support', desc: 'Full coverage for all 50 US states and UK regions.' },
  { icon: Zap, title: 'Real-Time Results', desc: 'Instant calculations as you type — no page refresh needed.' },
  { icon: Smartphone, title: 'Mobile Optimized', desc: 'Works perfectly on any phone, tablet, or desktop.' },
  { icon: Lock, title: 'Secure & Private', desc: 'No data stored. All calculations happen in your browser.' },
  { icon: Star, title: '100% Free', desc: 'No signup, no paywall, no hidden costs. Forever free.' },
]

const BLOGS = [
  { title: 'How Much Tax on a $100k Salary?', cat: 'Tax Guide', href: '/blog/100k-salary-tax', color: 'bg-blue-500' },
  { title: 'Best States for Take-Home Pay in 2026', cat: 'Salary Guide', href: '/blog/best-states-take-home', color: 'bg-emerald-500' },
  { title: 'Understanding UK PAYE & National Insurance', cat: 'UK Guide', href: '/blog/uk-paye-guide', color: 'bg-violet-500' },
  { title: 'How Overtime Pay Is Taxed in 2026', cat: 'Overtime', href: '/blog/overtime-tax', color: 'bg-amber-500' },
]

const FAQS = [
  { q: 'What is take-home pay?', a: 'Take-home pay is your gross salary minus all deductions — federal income tax, state income tax, Social Security (6.2%), Medicare (1.45%), and any voluntary deductions like 401(k). WagePilot calculates this instantly.' },
  { q: 'How accurate is the calculator?', a: 'We use official IRS and HMRC published tax rates updated for 2026. Results are highly accurate for standard employment. Complex situations (multiple jobs, significant investments) may vary — always consult a tax professional.' },
  { q: 'How often are tax rates updated?', a: 'We update US tax brackets after IRS Revenue Procedure announcements (typically October/November) and UK rates after each HMRC Budget Statement. Data is clearly labeled with the applicable tax year.' },
  { q: 'Can I compare salaries across states?', a: 'Yes! Use our Salary Comparison tool to see take-home pay side-by-side for any salary across all 50 US states. Texas, Florida, and Nevada have no state income tax — a significant advantage for high earners.' },
]

const SEO_LINKS_USA = [
  { name: 'Texas Paycheck Calculator', href: '/texas-salary-calculator' },
  { name: 'California Salary Calculator', href: '/california-salary-calculator' },
  { name: 'Florida Overtime Calculator', href: '/florida-salary-calculator' },
  { name: 'New York Salary Calculator', href: '/new-york-salary-calculator' },
  { name: 'Washington Take-Home Pay', href: '/washington-salary-calculator' },
  { name: 'Illinois Paycheck Calculator', href: '/illinois-salary-calculator' },
]

const SEO_LINKS_UK = [
  { name: 'UK PAYE Calculator', href: '/uk-income-tax-calculator' },
  { name: 'London Salary Calculator', href: '/uk-income-tax-calculator' },
  { name: 'IR35 Contractor Calculator', href: '/contractor-calculator' },
  { name: 'UK Overtime Calculator', href: '/overtime-calculator' },
]

const CHART_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981']

// ─── Sub-components ──────────────────────────────────────────────────────────
function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <button onClick={toggle} aria-label="Toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 backdrop-blur transition hover:bg-white/10 hover:text-white">
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

function NavDropdown({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:text-white">
        {label} <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1 min-w-[200px] rounded-xl border border-white/10 bg-[#0d1b2a]/95 p-1.5 shadow-2xl backdrop-blur-xl">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DropItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/8 hover:text-white">
      {children}
    </Link>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomePage() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [country, setCountry] = useState<Country>('USA')
  const [salary, setSalary] = useState(75000)
  const [state, setState] = useState('TX')
  const [filing, setFiling] = useState<FilingStatus>('single')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const mobileRef = useRef<HTMLDivElement>(null)

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const result = country === 'USA'
    ? calcUS(salary, state, filing)
    : calcUK(salary)

  const chartData = country === 'USA'
    ? [
        { name: 'Federal Tax', value: (result as any).federal },
        { name: 'State Tax', value: (result as any).state },
        { name: 'FICA', value: ((result as any).ss + (result as any).medicare) },
        { name: 'Net Pay', value: result.net },
      ].filter(d => d.value > 0)
    : [
        { name: 'Income Tax', value: (result as any).incomeTax },
        { name: 'National Insurance', value: (result as any).ni },
        { name: 'Net Pay', value: result.net },
      ].filter(d => d.value > 0)

  const currency = country === 'USA' ? 'USD' : 'GBP'

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const bgMain = theme === 'dark' ? '#040e1a' : '#f0f4f8'
  const textMain = theme === 'dark' ? '#ffffff' : '#0f172a'
  const cardBg = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)'
  const cardBorder = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  return (
    <div style={{ background: bgMain, color: textMain, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh' }}>
      <style>{`
        #desktop-nav { display: flex; }
        #mobile-right { display: none !important; }
        #cta-btn { display: inline-flex; }
        #ham-btn { display: none !important; }
        @media (max-width: 767px) {
          #desktop-nav { display: none !important; }
          #cta-btn { display: none !important; }
          #ham-btn { display: flex !important; }
        }
      `}</style>

      {/* ── Announcement Bar ─────────────────────────── */}
      <div style={{ background: 'linear-gradient(90deg, #1d4ed8, #0891b2)', padding: '8px 16px', textAlign: 'center', fontSize: '12px', color: 'white', overflowX: 'hidden', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <span style={{ opacity: 0.9 }}>✅ Updated 2026 Tax Rates &nbsp;·&nbsp; 🇺🇸 USA &amp; 🇬🇧 UK &nbsp;·&nbsp; ⚡ Free &amp; Instant</span>
      </div>

      {/* ── Navbar ───────────────────────────────────── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(4,14,26,0.85)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✈️</div>
            <span style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(90deg, #60a5fa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WagePilot</span>
          </Link>

          {/* Desktop center nav */}
          <div id="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <NavDropdown label="Calculators">
              <DropItem href="/paycheck-calculator">💳 Paycheck Calculator</DropItem>
              <DropItem href="/salary-calculator">💰 Salary Calculator</DropItem>
              <DropItem href="/overtime-calculator">⏰ Overtime Calculator</DropItem>
              <DropItem href="/hourly-to-salary-calculator">🕐 Hourly → Salary</DropItem>
              <DropItem href="/take-home-pay-calculator">✅ Take Home Pay</DropItem>
              <DropItem href="/contractor-calculator">💼 Contractor Tax</DropItem>
            </NavDropdown>
            <NavDropdown label="States">
              <div style={{ padding: '4px 8px 2px', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>USA</div>
              <DropItem href="/texas-salary-calculator">🤠 Texas</DropItem>
              <DropItem href="/california-salary-calculator">🌴 California</DropItem>
              <DropItem href="/florida-salary-calculator">☀️ Florida</DropItem>
              <DropItem href="/new-york-salary-calculator">🗽 New York</DropItem>
              <div style={{ padding: '4px 8px 2px', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginTop: '4px' }}>UK</div>
              <DropItem href="/uk-income-tax-calculator">🏛️ UK Income Tax</DropItem>
            </NavDropdown>
            <Link href="/blog" style={{ padding: '8px 12px', fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderRadius: '8px', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>
              Blog
            </Link>
            <NavDropdown label="Legal">
              <DropItem href="/privacy">🔒 Privacy Policy</DropItem>
              <DropItem href="/terms">📋 Terms &amp; Conditions</DropItem>
              <DropItem href="/disclaimer">⚠️ Disclaimer</DropItem>
            </NavDropdown>
          </div>

          {/* Desktop right */}
          <div id="desktop-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select value={country} onChange={e => setCountry(e.target.value as Country)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', fontWeight: '600', color: 'white', cursor: 'pointer' }}>
              <option value="USA">🇺🇸 USA</option>
              <option value="UK">🇬🇧 UK</option>
            </select>
            <ThemeToggle theme={theme} toggle={toggleTheme} />
            <Link href="/salary-calculator" id="cta-btn"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: 'white', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap' }}>
              Start Calculating
            </Link>
            <button id="ham-btn" onClick={() => setMobileOpen(v => !v)}
              style={{ display: 'none', width: '36px', height: '36px', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile right */}
          <div id="mobile-right" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
            <select value={country} onChange={e => setCountry(e.target.value as Country)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px 8px', fontSize: '12px', color: 'white' }}>
              <option value="USA">🇺🇸</option>
              <option value="UK">🇬🇧</option>
            </select>
            <ThemeToggle theme={theme} toggle={toggleTheme} />
            <button id="hamburger-btn" onClick={() => setMobileOpen(v => !v)}
              style={{ width: '36px', height: '36px', display: 'none', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div ref={mobileRef}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ background: 'rgba(4,14,26,0.97)', borderTop: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { label: '💳 Paycheck Calculator', href: '/paycheck-calculator' },
                  { label: '💰 Salary Calculator', href: '/salary-calculator' },
                  { label: '⏰ Overtime Calculator', href: '/overtime-calculator' },
                  { label: '🕐 Hourly → Salary', href: '/hourly-to-salary-calculator' },
                  { label: '✅ Take Home Pay', href: '/take-home-pay-calculator' },
                  { label: '💼 Contractor Tax', href: '/contractor-calculator' },
                  { label: '📝 Blog', href: '/blog' },
                  { label: '🔒 Privacy Policy', href: '/privacy' },
                  { label: '📋 Terms', href: '/terms' },
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    style={{ padding: '12px 14px', borderRadius: '10px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px', fontWeight: '500', background: 'rgba(255,255,255,0.03)' }}>
                    {item.label}
                  </Link>
                ))}
                <Link href="/salary-calculator" onClick={() => setMobileOpen(false)}
                  style={{ marginTop: '12px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: 'white', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontWeight: '700', textAlign: 'center' }}>
                  🚀 Start Calculating
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '48px 16px 48px' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        </div>

        <div style={{ maxWidth: '100%', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '999px', padding: '6px 16px', fontSize: '13px', color: '#60a5fa', fontWeight: '600', marginBottom: '24px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Updated for 2026 Tax Year — IRS &amp; HMRC Verified
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: 'clamp(1.8rem, 6vw, 3.5rem)', fontWeight: '900', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 16px', color: theme === 'dark' ? 'white' : '#0f172a' }}>
            Calculate Your Salary &amp;{' '}
            <span style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Take-Home Pay
            </span>{' '}
            Instantly
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: '18px', color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#475569', marginBottom: '32px', lineHeight: 1.7 }}>
            Free paycheck, salary, overtime and tax calculators for USA &amp; UK with accurate real-time breakdowns.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
            <Link href="/salary-calculator"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: 'white', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontWeight: '700', boxShadow: '0 8px 32px rgba(59,130,246,0.35)' }}>
              Start Calculating <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/salary-comparison"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: theme === 'dark' ? 'white' : '#0f172a', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontWeight: '700' }}>
              <BarChart2 className="h-4 w-4" /> Compare Salaries
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {['✅ Updated 2026 Rates', '🔒 No Signup Required', '📱 Mobile Friendly', '⚡ Accurate Calculations'].map(badge => (
              <span key={badge} style={{ fontSize: '13px', color: theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#64748b', fontWeight: '500' }}>{badge}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Live Mini Calculator ──────────────────────── */}
      <section style={{ padding: '0 16px 48px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(6,182,212,0.08))', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '20px', padding: '20px 16px', backdropFilter: 'blur(16px)' }}>

            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 24px', color: theme === 'dark' ? 'white' : '#0f172a', textAlign: 'center' }}>
              ⚡ Live Salary Calculator
            </h2>

            {/* Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Country</label>
                <select value={country} onChange={e => setCountry(e.target.value as Country)}
                  style={{ width: '100%', background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'white', border: `1px solid ${cardBorder}`, borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: '600' }}>
                  <option value="USA">🇺🇸 USA</option>
                  <option value="UK">🇬🇧 UK</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Annual Salary</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#94a3b8', fontWeight: '600' }}>{country === 'UK' ? '£' : '$'}</span>
                  <input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} min={0}
                    style={{ width: '100%', background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'white', border: `1px solid ${cardBorder}`, borderRadius: '10px', padding: '10px 12px 10px 28px', fontSize: '14px', color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: '600', boxSizing: 'border-box' }} />
                </div>
              </div>

              {country === 'USA' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>State</label>
                  <select value={state} onChange={e => setState(e.target.value)}
                    style={{ width: '100%', background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'white', border: `1px solid ${cardBorder}`, borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: '600' }}>
                    {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </div>
              )}

              {country === 'USA' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filing Status</label>
                  <select value={filing} onChange={e => setFiling(e.target.value as FilingStatus)}
                    style={{ width: '100%', background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'white', border: `1px solid ${cardBorder}`, borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: '600' }}>
                    <option value="single">Single</option>
                    <option value="married">Married Jointly</option>
                    <option value="head">Head of Household</option>
                  </select>
                </div>
              )}
            </div>

            {/* Slider */}
            <div style={{ marginBottom: '24px' }}>
              <input type="range" min={10000} max={500000} step={1000} value={salary}
                onChange={e => setSalary(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#3b82f6' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
                <span>{country === 'UK' ? '£' : '$'}10k</span><span>{country === 'UK' ? '£' : '$'}500k</span>
              </div>
            </div>

            {/* Results + Chart */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {(country === 'USA' ? ([
                  { label: 'Federal Tax', value: (result as any).federal, color: '#ef4444' },
                  { label: 'State Tax', value: (result as any).state, color: '#f59e0b' },
                  { label: 'FICA', value: ((result as any).ss + (result as any).medicare), color: '#8b5cf6' },
                  { label: '🎉 Net Pay', value: result.net, color: '#10b981', big: true },
                ] as Array<{label:string;value:number;color:string;big?:boolean}>) : ([
                  { label: 'Income Tax', value: (result as any).incomeTax, color: '#ef4444' },
                  { label: 'Nat. Insurance', value: (result as any).ni, color: '#f59e0b' },
                  { label: '🎉 Net Pay', value: result.net, color: '#10b981', big: true },
                  { label: 'Monthly', value: Math.round(result.net / 12), color: '#3b82f6' },
                ] as Array<{label:string;value:number;color:string;big?:boolean}>)).map((item) => (
                  <div key={item.label} style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', borderRadius: '12px', padding: '14px', border: `1px solid ${cardBorder}` }}>
                    <div style={{ fontSize: '11px', color: theme === 'dark' ? 'rgba(255,255,255,0.45)' : '#64748b', marginBottom: '4px', fontWeight: '600' }}>{item.label}</div>
                    <div style={{ fontSize: item.big ? '1.3rem' : '1.1rem', fontWeight: '800', color: item.color }}>{fmt(item.value, currency)}</div>
                  </div>
                ))}
                <div style={{ gridColumn: 'span 2', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', marginBottom: '2px' }}>Monthly Take-Home</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#10b981' }}>{fmt(Math.round(result.net / 12), currency)}</div>
                </div>
              </div>

              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                      {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} strokeWidth={0} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [fmt(v, currency), '']}
                      contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '12px' }} />
                    <Legend iconSize={8} formatter={v => <span style={{ fontSize: '11px', color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : '#475569' }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link href="/salary-calculator"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>
                Full Detailed Calculator <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Ad Slot 1 ─────────────────────────────────── */}
      <section style={{ padding: '0 16px 40px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)', border: `1px dashed ${cardBorder}`, borderRadius: '12px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: theme === 'dark' ? 'rgba(255,255,255,0.2)' : '#94a3b8' }}>
          Advertisement · 728×90
        </div>
      </section>

      {/* ── Calculators Grid ──────────────────────────── */}
      <section style={{ padding: '0 16px 48px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', margin: '0 0 12px', color: theme === 'dark' ? 'white' : '#0f172a' }}>
              All Calculators — 100% Free
            </h2>
            <p style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#64748b', fontSize: '15px' }}>
              Professional-grade tools updated with 2026 tax data
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {CALCULATORS.map((calc, i) => (
              <motion.div key={calc.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link href={calc.href} style={{ display: 'block', textDecoration: 'none', background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '20px', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `linear-gradient(135deg, ${calc.color.split(' ')[1]}, ${calc.color.split(' ')[3] || calc.color.split(' ')[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <calc.icon className="h-5 w-5 text-white" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: theme === 'dark' ? 'white' : '#0f172a', marginBottom: '4px' }}>{calc.title}</div>
                      <div style={{ fontSize: '13px', color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#64748b', lineHeight: 1.5 }}>{calc.desc}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '14px', fontSize: '13px', fontWeight: '600', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Open Calculator <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO Links ────────────────────────────────── */}
      <section style={{ padding: '0 16px 48px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '20px' }}>🇺🇸</span>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: theme === 'dark' ? 'white' : '#0f172a', margin: 0 }}>USA State Calculators</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SEO_LINKS_USA.map(link => (
                <Link key={link.href} href={link.href}
                  style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none', padding: '6px 10px', borderRadius: '8px', background: theme === 'dark' ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.05)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin className="h-3.5 w-3.5" /> {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '20px' }}>🇬🇧</span>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: theme === 'dark' ? 'white' : '#0f172a', margin: 0 }}>UK Tax Calculators</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SEO_LINKS_UK.map(link => (
                <Link key={link.href} href={link.href}
                  style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none', padding: '6px 10px', borderRadius: '8px', background: theme === 'dark' ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.05)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin className="h-3.5 w-3.5" /> {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ad Slot 2 ─────────────────────────────────── */}
      <section style={{ padding: '0 16px 48px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)', border: `1px dashed ${cardBorder}`, borderRadius: '12px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: theme === 'dark' ? 'rgba(255,255,255,0.2)' : '#94a3b8' }}>
          Advertisement · 728×90
        </div>
      </section>

      {/* ── Why WagePilot ────────────────────────────── */}
      <section style={{ padding: '0 16px 48px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', margin: '0 0 12px', color: theme === 'dark' ? 'white' : '#0f172a' }}>
              Why Choose WagePilot?
            </h2>
            <p style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#64748b', fontSize: '15px' }}>Built for accuracy, speed, and privacy</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '14px', padding: '20px', display: 'flex', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: theme === 'dark' ? 'white' : '#0f172a', marginBottom: '4px' }}>{f.title}</div>
                  <div style={{ fontSize: '13px', color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#64748b', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog ─────────────────────────────────────── */}
      <section style={{ padding: '0 16px 48px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: '800', margin: 0, color: theme === 'dark' ? 'white' : '#0f172a' }}>
              Finance Guides &amp; Tax Tips
            </h2>
            <Link href="/blog" style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              All Articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {BLOGS.map((post, i) => (
              <motion.div key={post.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link href={post.href} style={{ display: 'block', textDecoration: 'none', background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '14px', overflow: 'hidden', transition: 'transform 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}>
                  <div style={{ height: '6px', background: post.color === 'bg-blue-500' ? 'linear-gradient(90deg,#3b82f6,#06b6d4)' : post.color === 'bg-emerald-500' ? 'linear-gradient(90deg,#10b981,#06b6d4)' : post.color === 'bg-violet-500' ? 'linear-gradient(90deg,#8b5cf6,#3b82f6)' : 'linear-gradient(90deg,#f59e0b,#ef4444)' }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: '700', color: '#3b82f6', background: 'rgba(59,130,246,0.1)', borderRadius: '6px', padding: '3px 8px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{post.cat}</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: theme === 'dark' ? 'white' : '#0f172a', lineHeight: 1.4, marginBottom: '12px' }}>{post.title}</div>
                    <div style={{ fontSize: '13px', color: '#3b82f6', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen className="h-3.5 w-3.5" /> Read More
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ad Slot 3 ─────────────────────────────────── */}
      <section style={{ padding: '0 16px 48px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)', border: `1px dashed ${cardBorder}`, borderRadius: '12px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: theme === 'dark' ? 'rgba(255,255,255,0.2)' : '#94a3b8' }}>
          Advertisement · 728×90
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section style={{ padding: '0 16px 48px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', margin: '0 0 32px', textAlign: 'center', color: theme === 'dark' ? 'white' : '#0f172a' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: theme === 'dark' ? 'white' : '#0f172a' }}>{faq.q}</span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#94a3b8', transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                      <p style={{ margin: 0, padding: '0 20px 16px', fontSize: '14px', color: theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#64748b', lineHeight: 1.7 }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────── */}
      <section style={{ padding: '0 16px 48px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(6,182,212,0.08))', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '20px', padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📬</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: theme === 'dark' ? 'white' : '#0f172a', margin: '0 0 8px' }}>Get Tax Updates in Your Inbox</h2>
          <p style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#64748b', margin: '0 0 24px', fontSize: '14px' }}>New tax rates, salary guides, and calculator updates — no spam.</p>
          {subscribed ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', fontWeight: '700' }}>
              <Check className="h-5 w-5" /> Subscribed! Thank you 🎉
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                style={{ flex: 1, minWidth: '200px', background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'white', border: `1px solid ${cardBorder}`, borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: theme === 'dark' ? 'white' : '#0f172a', outline: 'none' }} />
              <button onClick={async () => {
                if (!email || !email.includes('@')) return
                try {
                  const res = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                  })
                  if (res.ok) setSubscribed(true)
                } catch {}
              }}
                style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail className="h-4 w-4" /> Subscribe
              </button>
            </div>
          )}
          <p style={{ fontSize: '12px', color: theme === 'dark' ? 'rgba(255,255,255,0.3)' : '#94a3b8', marginTop: '12px' }}>No spam · Unsubscribe anytime · Privacy protected</p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer style={{ background: '#020b14', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 16px 24px' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '18px' }}>✈️</span>
                <span style={{ fontSize: '16px', fontWeight: '800', background: 'linear-gradient(90deg, #60a5fa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WagePilot</span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
                Free salary &amp; tax calculators for US and UK workers. Updated for 2026.
              </p>
            </div>
            {[
              { title: 'Calculators', links: [
                { name: 'Salary Calculator', href: '/salary-calculator' },
                { name: 'Paycheck Calculator', href: '/paycheck-calculator' },
                { name: 'Overtime Calculator', href: '/overtime-calculator' },
                { name: 'Contractor Tax', href: '/contractor-calculator' },
              ]},
              { title: 'USA Pages', links: [
                { name: 'Texas', href: '/texas-salary-calculator' },
                { name: 'California', href: '/california-salary-calculator' },
                { name: 'New York', href: '/new-york-salary-calculator' },
                { name: 'All States', href: '/states' },
              ]},
              { title: 'UK Pages', links: [
                { name: 'UK Income Tax', href: '/uk-income-tax-calculator' },
                { name: 'IR35 Calculator', href: '/contractor-calculator' },
                { name: 'Blog', href: '/blog' },
                { name: 'About', href: '/about' },
              ]},
              { title: 'Legal', links: [
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms & Conditions', href: '/terms' },
                { name: 'Disclaimer', href: '/disclaimer' },
                { name: 'Contact', href: '/contact' },
              ]},
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>{col.title}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {col.links.map(link => (
                    <Link key={link.href} href={link.href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              © 2026 WagePilot. Tax data sourced from IRS &amp; HMRC. Not professional tax advice.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['Privacy', 'Terms', 'Disclaimer'].map(item => (
                <Link key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>{item}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
