'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Moon, Sun, Menu, X, ChevronDown, DollarSign, Clock, Briefcase, TrendingUp, Percent, Calculator, Home, PiggyBank, MapPin, BarChart2, CreditCard, ArrowRight, Check, Shield, Zap, Globe, Smartphone, Lock, Star, Mail, BookOpen } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
type Country = 'USA' | 'UK'
type FilingStatus = 'single' | 'married' | 'head'
type Theme = 'light' | 'dark'

// ─── Tax Calculations ─────────────────────────────────────────────────────────
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
    TX:0,FL:0,WA:0,NV:0,SD:0,TN:0,WY:0,AK:0,NH:0,
    CA:0.093,NY:0.0685,IL:0.0495,CO:0.044,GA:0.055,
    PA:0.0307,AZ:0.025,NC:0.0449,MA:0.05,VA:0.0575,
    OH:0.0399,MI:0.0425,OR:0.0875,NJ:0.0637,MN:0.0785,
    MD:0.0575,WI:0.0765,MO:0.048,IN:0.03,TN2:0,
  }
  const stateTax = gross * (stateRates[state] || 0)
  const ss = Math.min(gross, 176100) * 0.062
  const medicare = gross * 0.0145 + (gross > 200000 ? (gross - 200000) * 0.009 : 0)
  const total = federal + stateTax + ss + medicare
  return {
    federal: Math.round(federal),
    state: Math.round(stateTax),
    ss: Math.round(ss),
    medicare: Math.round(medicare),
    fica: Math.round(ss + medicare),
    net: Math.round(gross - total),
    total: Math.round(total),
    effectiveRate: gross > 0 ? ((total / gross) * 100).toFixed(1) : '0',
    marginalRate: taxable > 626350 ? 37 : taxable > 250525 ? 35 : taxable > 197300 ? 32 : taxable > 103350 ? 24 : taxable > 48475 ? 22 : taxable > 11925 ? 12 : 10,
  }
}

function calcUK(gross: number, region: string, pension: number, studentLoan: string) {
  // Pension deduction
  const pensionAmount = Math.round(gross * pension / 100)
  const grossAfterPension = gross - pensionAmount

  // Personal allowance (tapers above £100k)
  let personalAllowance = 12570
  if (grossAfterPension > 100000) {
    personalAllowance = Math.max(0, 12570 - Math.floor((grossAfterPension - 100000) / 2))
  }

  const taxable = Math.max(0, grossAfterPension - personalAllowance)

  let incomeTax = 0
  if (region === 'scotland') {
    // Scottish rates 2025/26
    const scottishBands = [
      [2351, 0.19],   // Starter: £12,571–£14,921
      [13071, 0.20],  // Basic: £14,921–£26,041 (approx adjusted)
      [17622, 0.21],  // Intermediate: £26,041–£43,663
      [31337, 0.42],  // Higher: £43,663–£75,000
      [50140, 0.45],  // Advanced: £75,000–£125,140
      [Infinity, 0.48], // Top
    ]
    let remaining = taxable, prev2 = 0
    for (const [band, rate] of scottishBands as [number, number][]) {
      if (remaining <= 0) break
      const taxed = Math.min(remaining, band - prev2)
      incomeTax += taxed * rate
      remaining -= taxed
      prev2 += band - prev2
    }
  } else {
    // England/Wales/NI rates
    const basic = Math.min(taxable, 37700)
    const higher = Math.max(0, Math.min(taxable - 37700, 87440))
    const additional = Math.max(0, taxable - 125140)
    incomeTax = basic * 0.20 + higher * 0.40 + additional * 0.45
  }

  // National Insurance (Employee Class 1)
  let ni = 0
  if (gross > 12570) {
    const niBasic = Math.min(gross - 12570, 37700) // 8% band
    const niHigher = Math.max(0, gross - 50270) // 2% above
    ni = niBasic * 0.08 + niHigher * 0.02
  }

  // Student loan
  let studentLoanRepayment = 0
  const slPlans: Record<string, [number, number]> = {
    plan1: [24990, 0.09],
    plan2: [27295, 0.09],
    plan4: [31395, 0.09],
    plan5: [25000, 0.09],
    postgrad: [21000, 0.06],
  }
  if (studentLoan !== 'none' && slPlans[studentLoan]) {
    const [threshold, rate] = slPlans[studentLoan]
    studentLoanRepayment = Math.max(0, gross - threshold) * rate
  }

  const total = Math.round(incomeTax) + Math.round(ni) + pensionAmount + Math.round(studentLoanRepayment)
  const net = gross - total

  return {
    incomeTax: Math.round(incomeTax),
    ni: Math.round(ni),
    pension: pensionAmount,
    studentLoan: Math.round(studentLoanRepayment),
    net: Math.round(net),
    total: Math.round(total),
    effectiveRate: gross > 0 ? ((total / gross) * 100).toFixed(1) : '0',
    marginalRate: taxable > 125140 ? (region === 'scotland' ? 48 : 45) : taxable > 37700 ? (region === 'scotland' ? 42 : 40) : 20,
    personalAllowance,
    taxableIncome: Math.round(taxable),
  }
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
  {code:'MI',name:'Michigan'},{code:'NJ',name:'New Jersey'},{code:'MN',name:'Minnesota'},
  {code:'OR',name:'Oregon'},{code:'MD',name:'Maryland'},
]

const CALCULATORS = [
  {icon:DollarSign,title:'Salary Calculator',desc:'Annual take-home pay with full tax breakdown.',href:'/salary-calculator',color:'#3b82f6',bg:'#eff6ff'},
  {icon:CreditCard,title:'Paycheck Calculator',desc:'See exactly what comes out each pay period.',href:'/paycheck-calculator',color:'#8b5cf6',bg:'#f5f3ff'},
  {icon:Clock,title:'Overtime Calculator',desc:'1.5×, 2× overtime pay and tax impact.',href:'/overtime-calculator',color:'#f59e0b',bg:'#fffbeb'},
  {icon:Percent,title:'Hourly → Salary',desc:'Convert any hourly rate to annual salary.',href:'/hourly-to-salary-calculator',color:'#10b981',bg:'#f0fdf4'},
  {icon:Calculator,title:'Take Home Pay',desc:'Quick net pay after all deductions.',href:'/take-home-pay-calculator',color:'#06b6d4',bg:'#ecfeff'},
  {icon:Briefcase,title:'Contractor Tax',desc:'1099 self-employment tax & quarterly estimates.',href:'/contractor-calculator',color:'#ec4899',bg:'#fdf2f8'},
  {icon:Home,title:'Mortgage Calculator',desc:'How much house can you afford?',href:'/mortgage-affordability-calculator',color:'#f97316',bg:'#fff7ed'},
  {icon:PiggyBank,title:'Savings Calculator',desc:'Compound interest growth projections.',href:'/savings-calculator',color:'#84cc16',bg:'#f7fee7'},
  {icon:BarChart2,title:'Salary Comparison',desc:'Compare take-home across all 50 states.',href:'/salary-comparison',color:'#6366f1',bg:'#eef2ff'},
  {icon:TrendingUp,title:'UK Income Tax',desc:'PAYE, NI & Scottish rates.',href:'/uk-income-tax-calculator',color:'#0ea5e9',bg:'#f0f9ff'},
]

const FEATURES = [
  {icon:Shield,title:'Accurate Tax Rates',desc:'IRS & HMRC verified data updated annually.'},
  {icon:Globe,title:'USA & UK Support',desc:'Full coverage for all 50 US states and UK regions.'},
  {icon:Zap,title:'Real-Time Results',desc:'Instant calculations as you type.'},
  {icon:Smartphone,title:'Mobile Optimized',desc:'Works perfectly on any phone or desktop.'},
  {icon:Lock,title:'Secure & Private',desc:'No data stored. All calculations in your browser.'},
  {icon:Star,title:'100% Free',desc:'No signup, no paywall, forever free.'},
]

const CHART_COLORS = ['#ef4444','#f59e0b','#8b5cf6','#10b981']
const UK_CHART_COLORS = ['#ef4444','#f59e0b','#3b82f6','#10b981']

// ─── Sub-components ───────────────────────────────────────────────────────────
function NavDropdown({label, children}: {label:string; children:React.ReactNode}) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{position:'relative'}} onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}>
      <button style={{display:'flex',alignItems:'center',gap:'4px',padding:'8px 12px',borderRadius:'8px',border:'none',background:'transparent',cursor:'pointer',fontSize:'14px',fontWeight:'500',color:'rgba(255,255,255,0.75)'}}>
        {label} <ChevronDown style={{width:'14px',height:'14px',opacity:0.6}}/>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}} transition={{duration:0.15}}
            style={{position:'absolute',left:0,top:'100%',marginTop:'4px',minWidth:'200px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(10,20,40,0.97)',padding:'6px',boxShadow:'0 16px 48px rgba(0,0,0,0.4)',zIndex:200,backdropFilter:'blur(20px)'}}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DropItem({href,children}: {href:string; children:React.ReactNode}) {
  return (
    <Link href={href} style={{display:'flex',alignItems:'center',gap:'8px',padding:'9px 12px',borderRadius:'8px',textDecoration:'none',fontSize:'13px',color:'rgba(255,255,255,0.75)',transition:'all 0.15s'}}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.08)';(e.currentTarget as HTMLElement).style.color='white'}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.75)'}}>
      {children}
    </Link>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomePage() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [country, setCountry] = useState<Country>('USA')

  // US Calculator state
  const [salary, setSalary] = useState(75000)
  const [usState, setUsState] = useState('TX')
  const [filing, setFiling] = useState<FilingStatus>('single')

  // UK Calculator state
  const [ukSalary, setUkSalary] = useState(45000)
  const [ukRegion, setUkRegion] = useState('england')
  const [ukPension, setUkPension] = useState(5)
  const [ukStudentLoan, setUkStudentLoan] = useState('none')

  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subLoading, setSubLoading] = useState(false)

  // Blog posts from Supabase
  const [blogPosts, setBlogPosts] = useState<any[]>([])

  // FAQs from Supabase
  const [faqs, setFaqs] = useState<any[]>([])

  const mobileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    // Fetch blog posts
    fetchBlogPosts()
    // Fetch FAQs
    fetchFaqs()
    // Close mobile menu on outside click
    const handler = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function fetchBlogPosts() {
    try {
      const res = await fetch('/api/blog-posts')
      if (res.ok) {
        const data = await res.json()
        setBlogPosts(data.slice(0, 4))
      }
    } catch {}
  }

  async function fetchFaqs() {
    try {
      const res = await fetch('/api/faqs')
      if (res.ok) {
        const data = await res.json()
        setFaqs(data)
      }
    } catch {}
  }

  const usResult = calcUS(salary, usState, filing)
  const ukResult = calcUK(ukSalary, ukRegion, ukPension, ukStudentLoan)

  const usChartData = [
    {name:'Federal Tax', value: usResult.federal, color: CHART_COLORS[0]},
    {name:'State Tax', value: usResult.state, color: CHART_COLORS[1]},
    {name:'FICA', value: usResult.fica, color: CHART_COLORS[2]},
    {name:'Net Pay', value: usResult.net, color: CHART_COLORS[3]},
  ].filter(d => d.value > 0)

  const ukChartData = [
    {name:'Income Tax', value: ukResult.incomeTax, color: UK_CHART_COLORS[0]},
    {name:'Nat. Insurance', value: ukResult.ni, color: UK_CHART_COLORS[1]},
    ...(ukResult.pension > 0 ? [{name:'Pension', value: ukResult.pension, color: UK_CHART_COLORS[2]}] : []),
    {name:'Net Pay', value: ukResult.net, color: UK_CHART_COLORS[3]},
  ].filter(d => d.value > 0)

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return
    setSubLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      })
      if (res.ok) setSubscribed(true)
    } catch {}
    setSubLoading(false)
  }

  // Theme colors
  const bg = theme === 'dark' ? '#040e1a' : '#ffffff'
  const text = theme === 'dark' ? '#ffffff' : '#0f172a'
  const cardBg = theme === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc'
  const cardBorder = theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
  const mutedText = theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#64748b'
  const inputBg = theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'white'
  const inputBorder = theme === 'dark' ? 'rgba(255,255,255,0.12)' : '#e2e8f0'
  const sectionBg = theme === 'dark' ? 'rgba(255,255,255,0.02)' : '#f8fafc'

  const inp = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '14px',
    color: text,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'system-ui',
  }

  return (
    <div style={{background: bg, color: text, fontFamily:"'Inter',system-ui,sans-serif", minHeight:'100vh', transition:'background 0.2s, color 0.2s'}}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        #desk-nav { display: flex; }
        #desk-right { display: flex; }
        #mob-right { display: none; }
        @media (max-width: 768px) {
          #desk-nav { display: none !important; }
          #desk-right { display: none !important; }
          #mob-right { display: flex !important; }
        }
        a:hover { opacity: 0.85; }
        input[type=range] { accent-color: #3b82f6; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      {/* ── Announcement Bar ── */}
      <div style={{background:'linear-gradient(90deg,#1d4ed8,#0891b2)',padding:'7px 16px',textAlign:'center',fontSize:'12px',color:'white',fontWeight:'500'}}>
        ✅ Updated for Latest Tax Rates &nbsp;·&nbsp; 🇺🇸 USA &amp; 🇬🇧 UK Calculators &nbsp;·&nbsp; ⚡ Free &amp; Instant Results
      </div>

      {/* ── Navbar ── */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(4,14,26,0.92)',borderBottom:'1px solid rgba(255,255,255,0.07)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 20px',height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px'}}>

          {/* Logo */}
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'9px',textDecoration:'none',flexShrink:0}}>
            <div style={{width:'34px',height:'34px',background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0}}>💰</div>
            <span style={{fontSize:'18px',fontWeight:'800',background:'linear-gradient(90deg,#60a5fa,#22d3ee)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>WagePilot</span>
          </Link>

          {/* Desktop Nav */}
          <div id="desk-nav" style={{alignItems:'center',gap:'2px'}}>
            <NavDropdown label="Calculators">
              <DropItem href="/salary-calculator">💰 Salary Calculator</DropItem>
              <DropItem href="/paycheck-calculator">🧾 Paycheck Calculator</DropItem>
              <DropItem href="/overtime-calculator">⏰ Overtime Calculator</DropItem>
              <DropItem href="/hourly-to-salary-calculator">🕐 Hourly → Salary</DropItem>
              <DropItem href="/take-home-pay-calculator">✅ Take Home Pay</DropItem>
              <DropItem href="/contractor-calculator">💼 Contractor Tax</DropItem>
              <DropItem href="/mortgage-affordability-calculator">🏠 Mortgage Calculator</DropItem>
              <DropItem href="/savings-calculator">🐷 Savings Calculator</DropItem>
              <DropItem href="/salary-comparison">📊 Salary Comparison</DropItem>
              <DropItem href="/uk-income-tax-calculator">🇬🇧 UK Income Tax</DropItem>
            </NavDropdown>
            <NavDropdown label="States">
              <DropItem href="/california-salary-calculator">🌴 California</DropItem>
              <DropItem href="/texas-salary-calculator">🤠 Texas</DropItem>
              <DropItem href="/new-york-salary-calculator">🗽 New York</DropItem>
              <DropItem href="/florida-salary-calculator">☀️ Florida</DropItem>
              <DropItem href="/washington-salary-calculator">🌲 Washington</DropItem>
              <DropItem href="/states">📍 All 50 States →</DropItem>
            </NavDropdown>
            <Link href="/blog" style={{padding:'8px 12px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:'500',color:'rgba(255,255,255,0.75)',display:'block'}}
              onMouseEnter={e=>(e.currentTarget.style.color='white')}
              onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.75)')}>
              Blog
            </Link>
            <NavDropdown label="Legal">
              <DropItem href="/privacy">🔒 Privacy Policy</DropItem>
              <DropItem href="/terms">📋 Terms & Conditions</DropItem>
              <DropItem href="/disclaimer">⚠️ Disclaimer</DropItem>
            </NavDropdown>
          </div>

          {/* Desktop Right */}
          <div id="desk-right" style={{alignItems:'center',gap:'8px'}}>
            <select value={country} onChange={e=>setCountry(e.target.value as Country)}
              style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',padding:'6px 10px',fontSize:'13px',color:'white',cursor:'pointer',fontWeight:'600'}}>
              <option value="USA">🇺🇸 USA</option>
              <option value="UK">🇬🇧 UK</option>
            </select>
            {mounted && (
              <button onClick={()=>setTheme(t=>t==='dark'?'light':'dark')}
                style={{width:'36px',height:'36px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.07)',color:'white',cursor:'pointer'}}>
                {theme==='dark' ? <Sun style={{width:'16px',height:'16px'}}/> : <Moon style={{width:'16px',height:'16px'}}/>}
              </button>
            )}
            <Link href="/salary-calculator"
              style={{background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',padding:'8px 18px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:'700',whiteSpace:'nowrap'}}>
              Start Calculating
            </Link>
          </div>

          {/* Mobile Right */}
          <div id="mob-right" style={{alignItems:'center',gap:'8px'}}>
            <select value={country} onChange={e=>setCountry(e.target.value as Country)}
              style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',padding:'5px 8px',fontSize:'12px',color:'white'}}>
              <option value="USA">🇺🇸</option>
              <option value="UK">🇬🇧</option>
            </select>
            {mounted && (
              <button onClick={()=>setTheme(t=>t==='dark'?'light':'dark')}
                style={{width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.07)',color:'white',cursor:'pointer'}}>
                {theme==='dark' ? <Sun style={{width:'14px',height:'14px'}}/> : <Moon style={{width:'14px',height:'14px'}}/>}
              </button>
            )}
            <button onClick={()=>setMobileOpen(v=>!v)}
              style={{width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.07)',color:'white',cursor:'pointer'}}>
              {mobileOpen ? <X style={{width:'18px',height:'18px'}}/> : <Menu style={{width:'18px',height:'18px'}}/>}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div ref={mobileRef} initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
              style={{overflow:'hidden',borderTop:'1px solid rgba(255,255,255,0.07)',background:'rgba(4,14,26,0.98)',backdropFilter:'blur(20px)'}}>
              <div style={{padding:'12px 16px',display:'flex',flexDirection:'column',gap:'2px'}}>
                {[
                  {label:'💰 Salary Calculator',href:'/salary-calculator'},
                  {label:'🧾 Paycheck Calculator',href:'/paycheck-calculator'},
                  {label:'⏰ Overtime Calculator',href:'/overtime-calculator'},
                  {label:'🕐 Hourly → Salary',href:'/hourly-to-salary-calculator'},
                  {label:'✅ Take Home Pay',href:'/take-home-pay-calculator'},
                  {label:'💼 Contractor Tax',href:'/contractor-calculator'},
                  {label:'🏠 Mortgage Calculator',href:'/mortgage-affordability-calculator'},
                  {label:'🐷 Savings Calculator',href:'/savings-calculator'},
                  {label:'📊 Salary Comparison',href:'/salary-comparison'},
                  {label:'🇬🇧 UK Income Tax',href:'/uk-income-tax-calculator'},
                  {label:'📍 All 50 States',href:'/states'},
                  {label:'📝 Blog',href:'/blog'},
                  {label:'📞 Contact Us',href:'/contact'},
                  {label:'🔒 Privacy Policy',href:'/privacy'},
                ].map(item=>(
                  <Link key={item.href} href={item.href} onClick={()=>setMobileOpen(false)}
                    style={{padding:'11px 12px',borderRadius:'8px',color:'rgba(255,255,255,0.8)',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}>
                    {item.label}
                  </Link>
                ))}
                <Link href="/salary-calculator" onClick={()=>setMobileOpen(false)}
                  style={{marginTop:'10px',background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',padding:'13px',borderRadius:'10px',textDecoration:'none',fontSize:'15px',fontWeight:'700',textAlign:'center',display:'block'}}>
                  🚀 Start Calculating
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ── */}
      <section style={{position:'relative',overflow:'hidden',padding:'56px 20px 48px',background: theme==='dark'
        ? 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.2), transparent), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(6,182,212,0.1), transparent), #040e1a'
        : 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.08), transparent), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(6,182,212,0.05), transparent), #ffffff'}}>
        <div style={{maxWidth:'760px',margin:'0 auto',textAlign:'center',position:'relative'}}>
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'999px',padding:'6px 16px',fontSize:'12px',color:'#3b82f6',fontWeight:'600',marginBottom:'20px'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#10b981',display:'inline-block'}}/>
              Updated for Latest Tax Year — IRS &amp; HMRC Verified
            </div>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.1}}
            style={{fontSize:'clamp(1.9rem,5vw,3.2rem)',fontWeight:'900',lineHeight:1.12,letterSpacing:'-0.03em',margin:'0 0 16px',color:text}}>
            Calculate Your Salary &amp;{' '}
            <span style={{background:'linear-gradient(90deg,#3b82f6,#06b6d4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              Take-Home Pay
            </span>{' '}
            Instantly
          </motion.h1>
          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.2}}
            style={{fontSize:'17px',color:mutedText,marginBottom:'28px',lineHeight:1.7}}>
            Free paycheck, salary, overtime and tax calculators for USA &amp; UK with accurate real-time breakdowns.
          </motion.p>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.3}}
            style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap',marginBottom:'28px'}}>
            <Link href="/salary-calculator"
              style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',padding:'13px 28px',borderRadius:'12px',textDecoration:'none',fontSize:'15px',fontWeight:'700',boxShadow:'0 8px 24px rgba(59,130,246,0.3)'}}>
              Start Calculating <ArrowRight style={{width:'16px',height:'16px'}}/>
            </Link>
            <Link href="/salary-comparison"
              style={{display:'inline-flex',alignItems:'center',gap:'8px',background:theme==='dark'?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)',border:`1px solid ${cardBorder}`,color:text,padding:'13px 28px',borderRadius:'12px',textDecoration:'none',fontSize:'15px',fontWeight:'700'}}>
              <BarChart2 style={{width:'16px',height:'16px'}}/> Compare Salaries
            </Link>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
            style={{display:'flex',flexWrap:'wrap',gap:'16px',justifyContent:'center'}}>
            {['✅ Latest Tax Rates','🔒 No Signup Required','📱 Mobile Friendly','⚡ Accurate Calculations'].map(b=>(
              <span key={b} style={{fontSize:'13px',color:mutedText,fontWeight:'500'}}>{b}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Live Calculator ── */}
      <section style={{padding:'0 20px 52px'}}>
        <div style={{maxWidth:'860px',margin:'0 auto'}}>
          <motion.div initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}}
            style={{background: theme==='dark'?'rgba(59,130,246,0.08)':'white',border:`1px solid ${theme==='dark'?'rgba(59,130,246,0.2)':'#e2e8f0'}`,borderRadius:'20px',padding:'28px 24px',boxShadow: theme==='dark'?'none':'0 4px 24px rgba(0,0,0,0.06)'}}>

            <div style={{textAlign:'center',marginBottom:'24px'}}>
              <h2 style={{fontSize:'1.3rem',fontWeight:'800',color:text,margin:'0 0 4px'}}>⚡ Live Salary Calculator</h2>
              <p style={{fontSize:'13px',color:mutedText}}>Real-time results as you type</p>
            </div>

            {/* Country tabs */}
            <div style={{display:'flex',gap:'8px',marginBottom:'20px',background:theme==='dark'?'rgba(255,255,255,0.06)':'#f1f5f9',borderRadius:'10px',padding:'4px'}}>
              {(['USA','UK'] as Country[]).map(c=>(
                <button key={c} onClick={()=>setCountry(c)}
                  style={{flex:1,padding:'9px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'700',background:country===c?'linear-gradient(135deg,#3b82f6,#06b6d4)':'transparent',color:country===c?'white':mutedText,transition:'all 0.2s'}}>
                  {c==='USA'?'🇺🇸 USA':'🇬🇧 UK'}
                </button>
              ))}
            </div>

            {country === 'USA' ? (
              <>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px',marginBottom:'16px'}}>
                  <div>
                    <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:mutedText,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Annual Salary</label>
                    <div style={{position:'relative'}}>
                      <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:mutedText,fontWeight:'600'}}>$</span>
                      <input type="number" value={salary} onChange={e=>setSalary(Number(e.target.value))} min={0}
                        style={{...inp,paddingLeft:'28px'}}/>
                    </div>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:mutedText,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>State</label>
                    <select value={usState} onChange={e=>setUsState(e.target.value)} style={inp}>
                      {US_STATES.map(s=><option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:mutedText,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Filing Status</label>
                    <select value={filing} onChange={e=>setFiling(e.target.value as FilingStatus)} style={inp}>
                      <option value="single">Single</option>
                      <option value="married">Married Jointly</option>
                      <option value="head">Head of Household</option>
                    </select>
                  </div>
                </div>
                <input type="range" min={10000} max={500000} step={1000} value={salary}
                  onChange={e=>setSalary(Number(e.target.value))} style={{width:'100%',marginBottom:'4px'}}/>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:mutedText,marginBottom:'20px'}}>
                  <span>$10k</span><span>$500k</span>
                </div>

                {/* US Results */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',alignItems:'start'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                    {[
                      {label:'Federal Tax',value:usResult.federal,color:'#ef4444'},
                      {label:'State Tax',value:usResult.state,color:usResult.state===0?'#10b981':'#f59e0b'},
                      {label:'FICA (SS+Medicare)',value:usResult.fica,color:'#8b5cf6'},
                      {label:'Net Pay 🎉',value:usResult.net,color:'#10b981',big:true},
                    ].map((item:any)=>(
                      <div key={item.label} style={{background:theme==='dark'?'rgba(255,255,255,0.05)':'#f8fafc',borderRadius:'10px',padding:'12px',border:`1px solid ${cardBorder}`}}>
                        <div style={{fontSize:'10px',color:mutedText,marginBottom:'3px',fontWeight:'600',textTransform:'uppercase'}}>{item.label}</div>
                        <div style={{fontSize:item.big?'1.2rem':'1rem',fontWeight:'800',color:item.color}}>{fmt(item.value)}</div>
                      </div>
                    ))}
                    <div style={{gridColumn:'span 2',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
                      <div style={{fontSize:'10px',color:'#10b981',fontWeight:'700',marginBottom:'2px',textTransform:'uppercase'}}>Monthly Take-Home</div>
                      <div style={{fontSize:'1.6rem',fontWeight:'900',color:'#10b981'}}>{fmt(Math.round(usResult.net/12))}</div>
                      <div style={{fontSize:'10px',color:mutedText,marginTop:'2px'}}>Effective Rate: {usResult.effectiveRate}% · Marginal: {usResult.marginalRate}%</div>
                    </div>
                  </div>
                  <div style={{height:'180px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={usChartData} cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={2} dataKey="value">
                          {usChartData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i]} strokeWidth={0}/>)}
                        </Pie>
                        <Tooltip formatter={(v:number)=>[fmt(v),'']}
                          contentStyle={{background:theme==='dark'?'#0d1b2a':'white',border:`1px solid ${cardBorder}`,borderRadius:'8px',color:text,fontSize:'12px'}}/>
                        <Legend iconSize={8} formatter={v=><span style={{fontSize:'10px',color:mutedText}}>{v}</span>}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* UK Calculator */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'12px',marginBottom:'16px'}}>
                  <div>
                    <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:mutedText,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Annual Salary</label>
                    <div style={{position:'relative'}}>
                      <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:mutedText,fontWeight:'600'}}>£</span>
                      <input type="number" value={ukSalary} onChange={e=>setUkSalary(Number(e.target.value))} min={0}
                        style={{...inp,paddingLeft:'28px'}}/>
                    </div>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:mutedText,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Region</label>
                    <select value={ukRegion} onChange={e=>setUkRegion(e.target.value)} style={inp}>
                      <option value="england">England</option>
                      <option value="scotland">Scotland</option>
                      <option value="wales">Wales</option>
                      <option value="ni">Northern Ireland</option>
                    </select>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:mutedText,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Pension %</label>
                    <input type="number" value={ukPension} onChange={e=>setUkPension(Number(e.target.value))} min={0} max={50}
                      style={inp}/>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:mutedText,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Student Loan</label>
                    <select value={ukStudentLoan} onChange={e=>setUkStudentLoan(e.target.value)} style={inp}>
                      <option value="none">No Loan</option>
                      <option value="plan1">Plan 1</option>
                      <option value="plan2">Plan 2</option>
                      <option value="plan4">Plan 4 (Scotland)</option>
                      <option value="plan5">Plan 5</option>
                      <option value="postgrad">Postgraduate</option>
                    </select>
                  </div>
                </div>
                <input type="range" min={12571} max={300000} step={500} value={ukSalary}
                  onChange={e=>setUkSalary(Number(e.target.value))} style={{width:'100%',marginBottom:'4px'}}/>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:mutedText,marginBottom:'20px'}}>
                  <span>£12,571</span><span>£300,000</span>
                </div>

                {/* UK Results */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',alignItems:'start'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                    {[
                      {label:'Income Tax',value:ukResult.incomeTax,color:'#ef4444'},
                      {label:'Nat. Insurance',value:ukResult.ni,color:'#f59e0b'},
                      ...(ukResult.pension>0?[{label:'Pension',value:ukResult.pension,color:'#3b82f6'}]:[]),
                      ...(ukResult.studentLoan>0?[{label:'Student Loan',value:ukResult.studentLoan,color:'#8b5cf6'}]:[]),
                      {label:'Net Pay 🎉',value:ukResult.net,color:'#10b981',big:true},
                    ].map((item:any,i)=>(
                      <div key={i} style={{background:theme==='dark'?'rgba(255,255,255,0.05)':'#f8fafc',borderRadius:'10px',padding:'12px',border:`1px solid ${cardBorder}`}}>
                        <div style={{fontSize:'10px',color:mutedText,marginBottom:'3px',fontWeight:'600',textTransform:'uppercase'}}>{item.label}</div>
                        <div style={{fontSize:item.big?'1.2rem':'1rem',fontWeight:'800',color:item.color}}>£{item.value.toLocaleString()}</div>
                      </div>
                    ))}
                    <div style={{gridColumn:'span 2',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
                      <div style={{fontSize:'10px',color:'#10b981',fontWeight:'700',marginBottom:'2px',textTransform:'uppercase'}}>Monthly Take-Home</div>
                      <div style={{fontSize:'1.6rem',fontWeight:'900',color:'#10b981'}}>£{Math.round(ukResult.net/12).toLocaleString()}</div>
                      <div style={{fontSize:'10px',color:mutedText,marginTop:'2px'}}>Effective Rate: {ukResult.effectiveRate}% · Marginal: {ukResult.marginalRate}%</div>
                    </div>
                    <div style={{gridColumn:'span 2',background:theme==='dark'?'rgba(255,255,255,0.03)':'#f8fafc',borderRadius:'10px',padding:'10px',border:`1px solid ${cardBorder}`}}>
                      <div style={{fontSize:'10px',color:mutedText,fontWeight:'600',marginBottom:'6px',textTransform:'uppercase'}}>Tax Breakdown</div>
                      <div style={{fontSize:'11px',color:mutedText,lineHeight:1.8}}>
                        Personal Allowance: £{ukResult.personalAllowance.toLocaleString()}<br/>
                        Taxable Income: £{ukResult.taxableIncome.toLocaleString()}<br/>
                        {ukRegion==='scotland'?'Scottish':'UK'} {ukResult.marginalRate}% marginal rate
                      </div>
                    </div>
                  </div>
                  <div style={{height:'200px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={ukChartData} cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={2} dataKey="value">
                          {ukChartData.map((_,i)=><Cell key={i} fill={UK_CHART_COLORS[i]} strokeWidth={0}/>)}
                        </Pie>
                        <Tooltip formatter={(v:number)=>[`£${Number(v).toLocaleString()}`,'']}
                          contentStyle={{background:theme==='dark'?'#0d1b2a':'white',border:`1px solid ${cardBorder}`,borderRadius:'8px',color:text,fontSize:'12px'}}/>
                        <Legend iconSize={8} formatter={v=><span style={{fontSize:'10px',color:mutedText}}>{v}</span>}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            <div style={{textAlign:'center',marginTop:'20px'}}>
              <Link href={country==='USA'?'/salary-calculator':'/uk-income-tax-calculator'}
                style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',padding:'11px 22px',borderRadius:'10px',textDecoration:'none',fontSize:'14px',fontWeight:'700'}}>
                Full Detailed Calculator <ArrowRight style={{width:'14px',height:'14px'}}/>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Ad Slot 1 ── */}
      <section style={{padding:'0 20px 48px'}}>
        <div style={{maxWidth:'860px',margin:'0 auto',background:theme==='dark'?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)',border:`1px dashed ${cardBorder}`,borderRadius:'10px',height:'80px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:mutedText}}>
          Advertisement
        </div>
      </section>

      {/* ── All Calculators ── */}
      <section style={{padding:'0 20px 52px',background:sectionBg}}>
        <div style={{maxWidth:'1000px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'32px'}}>
            <h2 style={{fontSize:'clamp(1.4rem,3vw,1.9rem)',fontWeight:'800',color:text,margin:'0 0 8px'}}>All Calculators — 100% Free</h2>
            <p style={{color:mutedText,fontSize:'14px'}}>Professional-grade tools updated with latest tax data</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'14px'}}>
            {CALCULATORS.map((calc,i)=>(
              <motion.div key={calc.href} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.04}}>
                <Link href={calc.href}
                  style={{display:'block',textDecoration:'none',background:theme==='dark'?'rgba(255,255,255,0.04)':'white',border:`1px solid ${cardBorder}`,borderRadius:'14px',padding:'18px',transition:'transform 0.2s,box-shadow 0.2s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.boxShadow=''}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:'12px'}}>
                    <div style={{width:'40px',height:'40px',borderRadius:'10px',background:calc.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <calc.icon style={{width:'20px',height:'20px',color:calc.color}}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'14px',fontWeight:'700',color:text,marginBottom:'3px'}}>{calc.title}</div>
                      <div style={{fontSize:'12px',color:mutedText,lineHeight:1.5}}>{calc.desc}</div>
                    </div>
                  </div>
                  <div style={{marginTop:'12px',fontSize:'12px',fontWeight:'600',color:'#3b82f6',display:'flex',alignItems:'center',gap:'4px'}}>
                    Open <ArrowRight style={{width:'12px',height:'12px'}}/>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ad Slot 2 ── */}
      <section style={{padding:'0 20px 48px'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto',background:theme==='dark'?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)',border:`1px dashed ${cardBorder}`,borderRadius:'10px',height:'80px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:mutedText}}>
          Advertisement
        </div>
      </section>

      {/* ── Why WagePilot ── */}
      <section style={{padding:'0 20px 52px'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'32px'}}>
            <h2 style={{fontSize:'clamp(1.4rem,3vw,1.9rem)',fontWeight:'800',color:text,margin:'0 0 8px'}}>Why Choose WagePilot?</h2>
            <p style={{color:mutedText,fontSize:'14px'}}>Built for accuracy, speed, and privacy</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'14px'}}>
            {FEATURES.map((f,i)=>(
              <motion.div key={f.title} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}}
                style={{background:theme==='dark'?'rgba(255,255,255,0.04)':'white',border:`1px solid ${cardBorder}`,borderRadius:'12px',padding:'18px',display:'flex',gap:'12px'}}>
                <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'rgba(59,130,246,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <f.icon style={{width:'18px',height:'18px',color:'#3b82f6'}}/>
                </div>
                <div>
                  <div style={{fontSize:'14px',fontWeight:'700',color:text,marginBottom:'3px'}}>{f.title}</div>
                  <div style={{fontSize:'12px',color:mutedText,lineHeight:1.5}}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog Section ── */}
      <section style={{padding:'0 20px 52px',background:sectionBg}}>
        <div style={{maxWidth:'1000px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
            <div>
              <h2 style={{fontSize:'clamp(1.4rem,3vw,1.9rem)',fontWeight:'800',color:text,margin:'0 0 4px'}}>Finance Guides &amp; Tax Tips</h2>
              <p style={{color:mutedText,fontSize:'14px',margin:0}}>Expert articles on taxes, salary, and financial planning</p>
            </div>
            <Link href="/blog" style={{fontSize:'14px',fontWeight:'600',color:'#3b82f6',textDecoration:'none',display:'flex',alignItems:'center',gap:'4px'}}>
              All Articles <ArrowRight style={{width:'14px',height:'14px'}}/>
            </Link>
          </div>

          {blogPosts.length === 0 ? (
            <div style={{background:theme==='dark'?'rgba(255,255,255,0.04)':'white',border:`1px solid ${cardBorder}`,borderRadius:'14px',padding:'40px',textAlign:'center'}}>
              <div style={{fontSize:'40px',marginBottom:'12px'}}>📝</div>
              <p style={{color:mutedText,fontSize:'14px',margin:'0 0 16px'}}>No blog posts yet. Create your first post from the admin panel.</p>
              <Link href="/admin" style={{background:'#2563eb',color:'white',padding:'8px 20px',borderRadius:'8px',textDecoration:'none',fontSize:'13px',fontWeight:'600'}}>
                Go to Admin Panel
              </Link>
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'14px'}}>
              {blogPosts.map((post:any,i:number)=>(
                <motion.div key={post.id} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06}}>
                  <Link href={`/blog/${post.slug}`}
                    style={{display:'block',textDecoration:'none',background:theme==='dark'?'rgba(255,255,255,0.04)':'white',border:`1px solid ${cardBorder}`,borderRadius:'12px',overflow:'hidden'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform=''}>
                    <div style={{height:'5px',background:'linear-gradient(90deg,#3b82f6,#06b6d4)'}}/>
                    <div style={{padding:'16px'}}>
                      <div style={{display:'inline-block',fontSize:'10px',fontWeight:'700',color:'#3b82f6',background:'rgba(59,130,246,0.1)',borderRadius:'5px',padding:'2px 8px',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.04em'}}>
                        {post.category?.replace(/-/g,' ')}
                      </div>
                      <h3 style={{fontSize:'14px',fontWeight:'700',color:text,margin:'0 0 6px',lineHeight:1.4}}>{post.title}</h3>
                      <p style={{fontSize:'12px',color:mutedText,margin:'0 0 12px',lineHeight:1.5}}>{post.description?.slice(0,90)}...</p>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:mutedText}}>
                        <span>{post.read_time} min read</span>
                        <span>{new Date(post.published_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Ad Slot 3 ── */}
      <section style={{padding:'0 20px 48px'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto',background:theme==='dark'?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)',border:`1px dashed ${cardBorder}`,borderRadius:'10px',height:'80px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:mutedText}}>
          Advertisement
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{padding:'0 20px 52px'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <h2 style={{fontSize:'clamp(1.4rem,3vw,1.9rem)',fontWeight:'800',color:text,margin:'0 0 24px',textAlign:'center'}}>
            Frequently Asked Questions
          </h2>
          {faqs.length === 0 ? (
            <div style={{background:theme==='dark'?'rgba(255,255,255,0.04)':'white',border:`1px solid ${cardBorder}`,borderRadius:'12px',padding:'32px',textAlign:'center'}}>
              <p style={{color:mutedText,fontSize:'14px',margin:0}}>FAQs will appear here once added from the admin panel.</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {faqs.map((faq:any,i:number)=>(
                <div key={faq.id||i} style={{background:theme==='dark'?'rgba(255,255,255,0.04)':'white',border:`1px solid ${cardBorder}`,borderRadius:'10px',overflow:'hidden'}}>
                  <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                    style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'15px 18px',background:'transparent',border:'none',cursor:'pointer',textAlign:'left',gap:'12px'}}>
                    <span style={{fontSize:'14px',fontWeight:'600',color:text}}>{faq.question}</span>
                    <ChevronDown style={{width:'16px',height:'16px',color:mutedText,flexShrink:0,transform:openFaq===i?'rotate(180deg)':'none',transition:'transform 0.2s'}}/>
                  </button>
                  <AnimatePresence>
                    {openFaq===i && (
                      <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} style={{overflow:'hidden'}}>
                        <p style={{margin:0,padding:'0 18px 15px',fontSize:'14px',color:mutedText,lineHeight:1.7}}>{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section style={{padding:'0 20px 52px'}}>
        <div style={{maxWidth:'560px',margin:'0 auto',background:theme==='dark'?'rgba(59,130,246,0.08)':'white',border:`1px solid ${theme==='dark'?'rgba(59,130,246,0.2)':'#e2e8f0'}`,borderRadius:'18px',padding:'36px 28px',textAlign:'center',boxShadow:theme==='dark'?'none':'0 4px 24px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:'32px',marginBottom:'12px'}}>📬</div>
          <h2 style={{fontSize:'1.3rem',fontWeight:'800',color:text,margin:'0 0 6px'}}>Get Tax Updates in Your Inbox</h2>
          <p style={{color:mutedText,margin:'0 0 20px',fontSize:'14px'}}>New tax rates, salary guides, and calculator updates — no spam.</p>
          {subscribed ? (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',color:'#10b981',fontWeight:'700',fontSize:'15px'}}>
              <Check style={{width:'20px',height:'20px'}}/> Subscribed! Thank you 🎉
            </div>
          ) : (
            <div style={{display:'flex',gap:'8px',maxWidth:'380px',margin:'0 auto',flexWrap:'wrap',justifyContent:'center'}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
                style={{flex:1,minWidth:'200px',background:inputBg,border:`1px solid ${inputBorder}`,borderRadius:'9px',padding:'11px 14px',fontSize:'14px',color:text,outline:'none'}}/>
              <button onClick={handleSubscribe} disabled={subLoading}
                style={{background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',border:'none',borderRadius:'9px',padding:'11px 18px',fontSize:'14px',fontWeight:'700',cursor:subLoading?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:'6px'}}>
                <Mail style={{width:'14px',height:'14px'}}/> {subLoading?'...':'Subscribe'}
              </button>
            </div>
          )}
          <p style={{fontSize:'11px',color:mutedText,marginTop:'10px'}}>No spam · Unsubscribe anytime · Privacy protected</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{background:'#020b14',borderTop:'1px solid rgba(255,255,255,0.06)',padding:'44px 20px 28px'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'28px',marginBottom:'36px'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
                <div style={{width:'30px',height:'30px',background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px'}}>💰</div>
                <span style={{fontSize:'16px',fontWeight:'800',background:'linear-gradient(90deg,#60a5fa,#22d3ee)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>WagePilot</span>
              </div>
              <p style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',lineHeight:1.7}}>Free salary &amp; tax calculators for US and UK workers. Updated for latest tax year.</p>
            </div>
            {[
              {title:'Calculators',links:[
                {name:'Salary Calculator',href:'/salary-calculator'},
                {name:'Paycheck Calculator',href:'/paycheck-calculator'},
                {name:'Overtime Calculator',href:'/overtime-calculator'},
                {name:'Contractor Tax',href:'/contractor-calculator'},
                {name:'UK Income Tax',href:'/uk-income-tax-calculator'},
              ]},
              {title:'USA Pages',links:[
                {name:'Texas',href:'/texas-salary-calculator'},
                {name:'California',href:'/california-salary-calculator'},
                {name:'New York',href:'/new-york-salary-calculator'},
                {name:'Florida',href:'/florida-salary-calculator'},
                {name:'All 50 States',href:'/states'},
              ]},
              {title:'Resources',links:[
                {name:'Blog',href:'/blog'},
                {name:'Salary Comparison',href:'/salary-comparison'},
                {name:'About',href:'/about'},
                {name:'Contact Us',href:'/contact'},
                {name:'FAQ',href:'/faq'},
              ]},
              {title:'Legal',links:[
                {name:'Privacy Policy',href:'/privacy'},
                {name:'Terms & Conditions',href:'/terms'},
                {name:'Disclaimer',href:'/disclaimer'},
              ]},
            ].map(col=>(
              <div key={col.title}>
                <h4 style={{fontSize:'11px',fontWeight:'700',color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'10px'}}>{col.title}</h4>
                {col.links.map(link=>(
                  <Link key={link.href} href={link.href}
                    style={{display:'block',fontSize:'13px',color:'rgba(255,255,255,0.5)',textDecoration:'none',marginBottom:'6px'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='white')}
                    onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.5)')}>
                    {link.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'20px',display:'flex',flexWrap:'wrap',gap:'12px',justifyContent:'space-between',alignItems:'center'}}>
            <p style={{fontSize:'12px',color:'rgba(255,255,255,0.3)',margin:0}}>© {new Date().getFullYear()} WagePilot. Tax data sourced from IRS &amp; HMRC. Not professional tax advice.</p>
            <div style={{display:'flex',gap:'16px'}}>
              {[{name:'Privacy',href:'/privacy'},{name:'Terms',href:'/terms'},{name:'Disclaimer',href:'/disclaimer'}].map(l=>(
                <Link key={l.href} href={l.href} style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>{l.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
