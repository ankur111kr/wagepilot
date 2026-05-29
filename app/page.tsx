'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

type Country = 'USA' | 'UK'
type FilingStatus = 'single' | 'married' | 'head'

// ─── Tax Calculations ─────────────────────────────────────────────────────────
function calcUS(gross: number, state: string, filing: FilingStatus) {
  const std = filing === 'married' ? 30000 : filing === 'head' ? 22500 : 15000
  const taxable = Math.max(0, gross - std)
  const brk = filing === 'married'
    ? [[23850,.10],[96950,.12],[206700,.22],[394600,.24],[501050,.32],[751600,.35],[Infinity,.37]]
    : [[11925,.10],[48475,.12],[103350,.22],[197300,.24],[250525,.32],[626350,.35],[Infinity,.37]]
  let fed = 0, prev = 0
  for (const [l, r] of brk as any) { if (taxable <= prev) break; fed += (Math.min(taxable, l) - prev) * r; prev = l }
  const SR: any = {TX:0,FL:0,WA:0,NV:0,CA:.093,NY:.0685,IL:.0495,CO:.044,GA:.055,PA:.0307,AZ:.025,NC:.0449,MA:.05,VA:.0575,OH:.0399,MI:.0425,OR:.0875,NJ:.1075,MN:.0985,MD:.0575}
  const st = gross * (SR[state] || 0)
  const ss = Math.min(gross, 176100) * .062
  const med = gross * .0145
  const total = fed + st + ss + med
  return { federal: Math.round(fed), state: Math.round(st), fica: Math.round(ss + med), net: Math.round(gross - total), total: Math.round(total), eff: (total / gross * 100).toFixed(1), marginal: taxable > 250525 ? 35 : taxable > 197300 ? 32 : taxable > 103350 ? 24 : taxable > 48475 ? 22 : taxable > 11925 ? 12 : 10 }
}

function calcUK(gross: number, region: string, pension: number, sl: string) {
  const pen = Math.round(gross * pension / 100)
  const pa = gross - pen > 100000 ? Math.max(0, 12570 - Math.floor((gross - pen - 100000) / 2)) : 12570
  const taxable = Math.max(0, gross - pen - pa)
  let it = 0
  if (region === 'scotland') { const b:any=[[2351,.19],[13120,.20],[17622,.21],[31337,.42],[50140,.45],[Infinity,.48]];let r=taxable;for(const[band,rate]of b){if(r<=0)break;it+=Math.min(r,band)*rate;r-=band} }
  else { it = Math.min(taxable,37700)*.20 + Math.max(0,Math.min(taxable-37700,87440))*.40 + Math.max(0,taxable-125140)*.45 }
  let ni = 0; if (gross > 12570) ni = Math.min(gross-12570,37700)*.08 + Math.max(0,gross-50270)*.02
  const slP:any = {plan1:[24990,.09],plan2:[27295,.09],plan4:[31395,.09],plan5:[25000,.09],postgrad:[21000,.06]}
  let slAmt = 0; if (sl !== 'none' && slP[sl]) { const [t,r] = slP[sl]; slAmt = Math.max(0,gross-t)*r }
  const total = Math.round(it)+Math.round(ni)+pen+Math.round(slAmt)
  const mr = taxable > 125140 ? (region==='scotland'?48:45) : taxable > 37700 ? (region==='scotland'?42:40) : 20
  return { incomeTax:Math.round(it), ni:Math.round(ni), pension:pen, studentLoan:Math.round(slAmt), net:gross-total, total, eff:(total/gross*100).toFixed(1), marginal:mr, pa, taxableIncome:Math.round(taxable) }
}

function fmt(n: number, c = 'USD') { return new Intl.NumberFormat('en-US',{style:'currency',currency:c,maximumFractionDigits:0}).format(n) }

const US_STATES = [{c:'TX',n:'Texas'},{c:'CA',n:'California'},{c:'FL',n:'Florida'},{c:'NY',n:'New York'},{c:'WA',n:'Washington'},{c:'IL',n:'Illinois'},{c:'PA',n:'Pennsylvania'},{c:'GA',n:'Georgia'},{c:'CO',n:'Colorado'},{c:'AZ',n:'Arizona'},{c:'NC',n:'North Carolina'},{c:'VA',n:'Virginia'},{c:'MA',n:'Massachusetts'},{c:'NV',n:'Nevada'},{c:'OH',n:'Ohio'},{c:'MI',n:'Michigan'},{c:'NJ',n:'New Jersey'},{c:'MN',n:'Minnesota'},{c:'OR',n:'Oregon'},{c:'MD',n:'Maryland'}]
const CALCS = [
  {e:'💰',t:'Salary Calculator',d:'Annual take-home with full tax breakdown.',h:'/salary-calculator',c:'#3b82f6'},
  {e:'🧾',t:'Paycheck Calculator',d:'See what lands in your bank each pay period.',h:'/paycheck-calculator',c:'#8b5cf6'},
  {e:'⏰',t:'Overtime Calculator',d:'1.5×, 2× overtime pay and tax impact.',h:'/overtime-calculator',c:'#f59e0b'},
  {e:'🕐',t:'Hourly → Salary',d:'Convert any hourly rate to annual salary.',h:'/hourly-to-salary-calculator',c:'#10b981'},
  {e:'✅',t:'Take Home Pay',d:'Quick net pay after all deductions.',h:'/take-home-pay-calculator',c:'#06b6d4'},
  {e:'💼',t:'Contractor Tax',d:'1099 self-employment tax & quarterly estimates.',h:'/contractor-calculator',c:'#ec4899'},
  {e:'🏠',t:'Mortgage Calculator',d:'How much house can you afford?',h:'/mortgage-affordability-calculator',c:'#f97316'},
  {e:'🐷',t:'Savings Calculator',d:'Compound interest growth projections.',h:'/savings-calculator',c:'#84cc16'},
  {e:'📊',t:'Salary Comparison',d:'Compare take-home across all 50 states.',h:'/salary-comparison',c:'#6366f1'},
  {e:'🇬🇧',t:'UK Income Tax',d:'PAYE, NI, Scottish rates & student loan.',h:'/uk-income-tax-calculator',c:'#0ea5e9'},
]
const FEATURES = [
  {e:'🛡️',t:'Accurate Tax Rates',d:'IRS & HMRC verified, updated annually.'},
  {e:'🌍',t:'USA & UK Support',d:'All 50 US states and all UK regions.'},
  {e:'⚡',t:'Real-Time Results',d:'Instant calculations as you type.'},
  {e:'📱',t:'Mobile Optimized',d:'Works perfectly on any device.'},
  {e:'🔒',t:'Secure & Private',d:'No data stored. All calculations in browser.'},
  {e:'⭐',t:'100% Free',d:'No signup, no paywall, forever free.'},
]
const CC = ['#ef4444','#f59e0b','#8b5cf6','#10b981']
const UCC = ['#ef4444','#f59e0b','#3b82f6','#10b981']

export default function HomePage() {
  const [country, setCountry] = useState<Country>('USA')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  // US calc state
  const [salary, setSalary] = useState(75000)
  const [usState, setUsState] = useState('TX')
  const [filing, setFiling] = useState<FilingStatus>('single')
  // UK calc state
  const [ukSalary, setUkSalary] = useState(45000)
  const [ukRegion, setUkRegion] = useState('england')
  const [ukPension, setUkPension] = useState(5)
  const [ukSL, setUkSL] = useState('none')
  // Data
  const [blogs, setBlogs] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subLoading, setSubLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('wp_country') as Country
    if (saved) setCountry(saved)
    fetch('/api/blog-posts').then(r=>r.json()).then(d=>setBlogs(d.filter((p:any)=>p.show_on_homepage).slice(0,4))).catch(()=>{})
    fetch('/api/faqs?page=homepage').then(r=>r.json()).then(d=>setFaqs(d)).catch(()=>{})
    const handler = (e: any) => { setCountry(e.detail); localStorage.setItem('wp_country', e.detail) }
    window.addEventListener('countryChange', handler)
    return () => window.removeEventListener('countryChange', handler)
  }, [])

  const handleCountryChange = (c: Country) => {
    setCountry(c)
    localStorage.setItem('wp_country', c)
    window.dispatchEvent(new CustomEvent('countryChange', { detail: c }))
  }

  const usR = calcUS(salary, usState, filing)
  const ukR = calcUK(ukSalary, ukRegion, ukPension, ukSL)
  const usChart = [{n:'Federal',v:usR.federal},{n:'State',v:usR.state},{n:'FICA',v:usR.fica},{n:'Net',v:usR.net}].filter(d=>d.v>0)
  const ukChart = [{n:'Income Tax',v:ukR.incomeTax},{n:'NI',v:ukR.ni},...(ukR.pension>0?[{n:'Pension',v:ukR.pension}]:[]),...(ukR.studentLoan>0?[{n:'Student Loan',v:ukR.studentLoan}]:[]),{n:'Net',v:ukR.net}].filter(d=>d.v>0)

  const subscribe = async () => {
    if (!email || !email.includes('@')) return
    setSubLoading(true)
    try { const r = await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})}); if(r.ok) setSubscribed(true) } catch {}
    setSubLoading(false)
  }

  const bg = theme==='dark'?'#040e1a':'#ffffff'
  const text = theme==='dark'?'#ffffff':'#0f172a'
  const muted = theme==='dark'?'rgba(255,255,255,0.55)':'#64748b'
  const cardBg = theme==='dark'?'rgba(255,255,255,0.04)':'white'
  const cardBorder = theme==='dark'?'rgba(255,255,255,0.08)':'#e2e8f0'
  const secBg = theme==='dark'?'rgba(255,255,255,0.02)':'#f8fafc'
  const inp = {background:theme==='dark'?'rgba(255,255,255,0.07)':'white',border:`1px solid ${cardBorder}`,borderRadius:'10px',padding:'10px 12px',fontSize:'14px',color:text,outline:'none',width:'100%',boxSizing:'border-box' as const,fontFamily:'system-ui'}

  return (
    <div style={{background:bg,color:text,fontFamily:"'Inter',system-ui,sans-serif",minHeight:'100vh'}}>
      <style>{`
        *{box-sizing:border-box;} #hp-desk{display:flex;} #hp-dr{display:flex;} #hp-mob{display:none;}
        @media(max-width:768px){#hp-desk{display:none!important;} #hp-dr{display:none!important;} #hp-mob{display:flex!important;}}
        .calc-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.12);}
        .blog-card:hover{transform:translateY(-2px);}
      `}</style>

      {/* Announcement */}
      <div style={{background:'linear-gradient(90deg,#1d4ed8,#0891b2)',padding:'7px 16px',textAlign:'center',fontSize:'12px',color:'white',fontWeight:'500'}}>
        ✅ Updated for Latest Tax Rates &nbsp;·&nbsp; 🇺🇸 USA &amp; 🇬🇧 UK Calculators &nbsp;·&nbsp; ⚡ Free &amp; Instant
      </div>

      {/* Navbar */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(4,14,26,0.95)',borderBottom:'1px solid rgba(255,255,255,0.07)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 20px',height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'9px',textDecoration:'none',flexShrink:0}}>
            <div style={{width:'34px',height:'34px',background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>💰</div>
            <span style={{fontSize:'18px',fontWeight:'800',background:'linear-gradient(90deg,#60a5fa,#22d3ee)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>WagePilot</span>
          </Link>
          <div id="hp-desk" style={{alignItems:'center',gap:'2px'}}>
            {[{l:'Calculators ▾',h:'#calcs'},{l:'Blog',h:'/blog'},{l:'About',h:'/about'},{l:'Contact',h:'/contact'}].map(item=>(
              <a key={item.l} href={item.h} style={{padding:'7px 12px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:'500',color:'rgba(255,255,255,0.75)'}}>
                {item.l}
              </a>
            ))}
          </div>
          <div id="hp-dr" style={{alignItems:'center',gap:'8px'}}>
            <select value={country} onChange={e=>handleCountryChange(e.target.value as Country)}
              style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',padding:'6px 10px',fontSize:'13px',color:'white',cursor:'pointer',fontWeight:'600'}}>
              <option value="USA">🇺🇸 USA</option>
              <option value="UK">🇬🇧 UK</option>
            </select>
            <button onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} style={{width:'36px',height:'36px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.07)',color:'white',cursor:'pointer',fontSize:'16px'}}>
              {theme==='dark'?'☀️':'🌙'}
            </button>
            <Link href="/salary-calculator" style={{background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',padding:'8px 18px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:'700',whiteSpace:'nowrap'}}>
              Start Calculating
            </Link>
          </div>
          <div id="hp-mob" style={{alignItems:'center',gap:'8px'}}>
            <select value={country} onChange={e=>handleCountryChange(e.target.value as Country)}
              style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',padding:'5px 8px',fontSize:'12px',color:'white'}}>
              <option value="USA">🇺🇸</option>
              <option value="UK">🇬🇧</option>
            </select>
            <button onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} style={{width:'32px',height:'32px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.07)',color:'white',cursor:'pointer',fontSize:'14px'}}>
              {theme==='dark'?'☀️':'🌙'}
            </button>
            <button onClick={()=>setMobileOpen(v=>!v)} style={{width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.07)',color:'white',cursor:'pointer',fontSize:'18px'}}>
              {mobileOpen?'✕':'☰'}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div style={{background:'rgba(4,14,26,0.98)',borderTop:'1px solid rgba(255,255,255,0.07)',padding:'12px 16px',maxHeight:'80vh',overflowY:'auto'}}>
            {[{l:'🏠 Home',h:'/'},{l:'💰 Salary Calculator',h:'/salary-calculator'},{l:'🧾 Paycheck Calculator',h:'/paycheck-calculator'},{l:'⏰ Overtime Calculator',h:'/overtime-calculator'},{l:'🕐 Hourly → Salary',h:'/hourly-to-salary-calculator'},{l:'✅ Take Home Pay',h:'/take-home-pay-calculator'},{l:'💼 Contractor Tax',h:'/contractor-calculator'},{l:'🏠 Mortgage Calculator',h:'/mortgage-affordability-calculator'},{l:'🐷 Savings Calculator',h:'/savings-calculator'},{l:'📊 Salary Comparison',h:'/salary-comparison'},{l:'🇬🇧 UK Income Tax',h:'/uk-income-tax-calculator'},{l:'📍 All 50 States',h:'/states'},{l:'📝 Blog',h:'/blog'},{l:'📞 Contact Us',h:'/contact'}].map(item=>(
              <Link key={item.h} href={item.h} onClick={()=>setMobileOpen(false)}
                style={{display:'block',padding:'11px 12px',borderRadius:'8px',color:'rgba(255,255,255,0.8)',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}>
                {item.l}
              </Link>
            ))}
            <Link href="/salary-calculator" onClick={()=>setMobileOpen(false)}
              style={{display:'block',marginTop:'10px',background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',padding:'13px',borderRadius:'10px',textDecoration:'none',fontSize:'15px',fontWeight:'700',textAlign:'center'}}>
              🚀 Start Calculating
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section style={{position:'relative',overflow:'hidden',padding:'56px 20px 48px',background:theme==='dark'?'radial-gradient(ellipse 80% 60% at 50% -10%,rgba(59,130,246,0.2),transparent),#040e1a':'radial-gradient(ellipse 80% 60% at 50% -10%,rgba(59,130,246,0.07),transparent),#ffffff'}}>
        <div style={{maxWidth:'760px',margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'999px',padding:'6px 16px',fontSize:'12px',color:'#3b82f6',fontWeight:'600',marginBottom:'20px'}}>
            <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#10b981',display:'inline-block'}}/>
            Updated for Latest Tax Year — IRS &amp; HMRC Verified
          </div>
          <h1 style={{fontSize:'clamp(1.9rem,5vw,3.2rem)',fontWeight:'900',lineHeight:1.12,letterSpacing:'-0.03em',margin:'0 0 16px',color:text}}>
            Calculate Your Salary &amp;{' '}
            <span style={{background:'linear-gradient(90deg,#3b82f6,#06b6d4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              Take-Home Pay
            </span>{' '}
            Instantly
          </h1>
          <p style={{fontSize:'17px',color:muted,marginBottom:'28px',lineHeight:1.7}}>
            Free paycheck, salary, overtime and tax calculators for USA &amp; UK with accurate real-time breakdowns.
          </p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap',marginBottom:'28px'}}>
            <Link href="/salary-calculator" style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',padding:'13px 28px',borderRadius:'12px',textDecoration:'none',fontSize:'15px',fontWeight:'700',boxShadow:'0 8px 24px rgba(59,130,246,0.3)'}}>
              Start Calculating →
            </Link>
            <Link href="/salary-comparison" style={{display:'inline-flex',alignItems:'center',gap:'8px',background:theme==='dark'?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)',border:`1px solid ${cardBorder}`,color:text,padding:'13px 28px',borderRadius:'12px',textDecoration:'none',fontSize:'15px',fontWeight:'700'}}>
              📊 Compare Salaries
            </Link>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'16px',justifyContent:'center'}}>
            {['✅ Latest Tax Rates','🔒 No Signup Required','📱 Mobile Friendly','⚡ Instant Results'].map(b=>(
              <span key={b} style={{fontSize:'13px',color:muted,fontWeight:'500'}}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Live Calculator */}
      <section style={{padding:'0 20px 52px'}}>
        <div style={{maxWidth:'860px',margin:'0 auto'}}>
          <div style={{background:theme==='dark'?'rgba(59,130,246,0.08)':cardBg,border:`1px solid ${theme==='dark'?'rgba(59,130,246,0.2)':cardBorder}`,borderRadius:'20px',padding:'28px 24px',boxShadow:theme==='dark'?'none':'0 4px 24px rgba(0,0,0,0.06)'}}>
            <div style={{textAlign:'center',marginBottom:'20px'}}>
              <h2 style={{fontSize:'1.3rem',fontWeight:'800',color:text,margin:'0 0 4px'}}>⚡ Live Salary Calculator</h2>
              <p style={{fontSize:'13px',color:muted,margin:0}}>Real-time results — switch between USA &amp; UK</p>
            </div>
            {/* Country tabs */}
            <div style={{display:'flex',gap:'8px',marginBottom:'20px',background:theme==='dark'?'rgba(255,255,255,0.06)':'#f1f5f9',borderRadius:'10px',padding:'4px'}}>
              {(['USA','UK'] as Country[]).map(c=>(
                <button key={c} onClick={()=>handleCountryChange(c)}
                  style={{flex:1,padding:'9px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'700',background:country===c?'linear-gradient(135deg,#3b82f6,#06b6d4)':'transparent',color:country===c?'white':muted,transition:'all 0.2s'}}>
                  {c==='USA'?'🇺🇸 USA':'🇬🇧 UK'}
                </button>
              ))}
            </div>

            {country === 'USA' ? (
              <>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px',marginBottom:'16px'}}>
                  <div>
                    <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:muted,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Annual Salary</label>
                    <div style={{position:'relative'}}><span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:muted,fontWeight:'600'}}>$</span>
                    <input type="number" value={salary} onChange={e=>setSalary(Number(e.target.value))} min={0} style={{...inp,paddingLeft:'28px'}}/></div>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:muted,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>State</label>
                    <select value={usState} onChange={e=>setUsState(e.target.value)} style={inp}>{US_STATES.map(s=><option key={s.c} value={s.c}>{s.n}</option>)}</select>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:muted,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Filing Status</label>
                    <select value={filing} onChange={e=>setFiling(e.target.value as FilingStatus)} style={inp}>
                      <option value="single">Single</option>
                      <option value="married">Married Jointly</option>
                      <option value="head">Head of Household</option>
                    </select>
                  </div>
                </div>
                <input type="range" min={10000} max={500000} step={1000} value={salary} onChange={e=>setSalary(Number(e.target.value))} style={{width:'100%',marginBottom:'20px'}}/>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',alignItems:'start'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                    {([{l:'Federal Tax',v:usR.federal,c:'#ef4444'},{l:'State Tax',v:usR.state,c:usR.state===0?'#10b981':'#f59e0b'},{l:'FICA',v:usR.fica,c:'#8b5cf6'},{l:'🎉 Net Pay',v:usR.net,c:'#10b981',big:true}] as any[]).map(item=>(
                      <div key={item.l} style={{background:theme==='dark'?'rgba(255,255,255,0.05)':'#f8fafc',borderRadius:'10px',padding:'12px',border:`1px solid ${cardBorder}`}}>
                        <div style={{fontSize:'10px',color:muted,marginBottom:'3px',fontWeight:'600',textTransform:'uppercase'}}>{item.l}</div>
                        <div style={{fontSize:item.big?'1.2rem':'1rem',fontWeight:'800',color:item.c}}>{fmt(item.v)}</div>
                      </div>
                    ))}
                    <div style={{gridColumn:'span 2',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
                      <div style={{fontSize:'10px',color:'#10b981',fontWeight:'700',marginBottom:'2px',textTransform:'uppercase'}}>Monthly Take-Home</div>
                      <div style={{fontSize:'1.6rem',fontWeight:'900',color:'#10b981'}}>{fmt(Math.round(usR.net/12))}</div>
                      <div style={{fontSize:'10px',color:muted,marginTop:'2px'}}>Eff. {usR.eff}% · Marginal {usR.marginal}%</div>
                    </div>
                  </div>
                  <div style={{height:'180px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart><Pie data={usChart.map(d=>({name:d.n,value:d.v}))} cx="50%" cy="50%" innerRadius={48} outerRadius={75} paddingAngle={2} dataKey="value">
                        {usChart.map((_,i)=><Cell key={i} fill={CC[i]} strokeWidth={0}/>)}
                      </Pie><Tooltip formatter={(v:number)=>[fmt(v),'']} contentStyle={{background:'#0d1b2a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',color:'white',fontSize:'12px'}}/>
                      <Legend iconSize={8} formatter={v=><span style={{fontSize:'10px',color:muted}}>{v}</span>}/></PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'12px',marginBottom:'16px'}}>
                  {[
                    {label:'Annual Salary',pre:'£',val:ukSalary,set:setUkSalary,type:'number'},
                    {label:'Region',val:ukRegion,set:setUkRegion,type:'select',opts:[['england','England'],['scotland','Scotland'],['wales','Wales'],['ni','N. Ireland']]},
                    {label:'Pension %',val:ukPension,set:setUkPension,type:'number',min:0,max:30},
                    {label:'Student Loan',val:ukSL,set:setUkSL,type:'select',opts:[['none','No Loan'],['plan1','Plan 1'],['plan2','Plan 2'],['plan4','Plan 4'],['plan5','Plan 5'],['postgrad','Postgrad']]},
                  ].map((f:any)=>(
                    <div key={f.label}>
                      <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:muted,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{f.label}</label>
                      {f.type==='select' ? (
                        <select value={f.val} onChange={e=>f.set(e.target.value)} style={inp}>{f.opts.map(([v,l]:any)=><option key={v} value={v}>{l}</option>)}</select>
                      ) : (
                        <div style={{position:'relative'}}>{f.pre&&<span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:muted,fontWeight:'600'}}>{f.pre}</span>}
                        <input type="number" value={f.val} onChange={e=>f.set(Number(e.target.value))} min={f.min||0} max={f.max} style={{...inp,...(f.pre?{paddingLeft:'28px'}:{})}}/>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <input type="range" min={12571} max={300000} step={500} value={ukSalary} onChange={e=>setUkSalary(Number(e.target.value))} style={{width:'100%',marginBottom:'20px'}}/>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',alignItems:'start'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                    {([
                      {l:'Income Tax',v:ukR.incomeTax,c:'#ef4444'},
                      {l:'Nat. Insurance',v:ukR.ni,c:'#f59e0b'},
                      ...(ukR.pension>0?[{l:'Pension',v:ukR.pension,c:'#3b82f6'}]:[]),
                      ...(ukR.studentLoan>0?[{l:'Student Loan',v:ukR.studentLoan,c:'#8b5cf6'}]:[]),
                      {l:'🎉 Net Pay',v:ukR.net,c:'#10b981',big:true},
                    ] as any[]).map((item,i)=>(
                      <div key={i} style={{background:theme==='dark'?'rgba(255,255,255,0.05)':'#f8fafc',borderRadius:'10px',padding:'12px',border:`1px solid ${cardBorder}`}}>
                        <div style={{fontSize:'10px',color:muted,marginBottom:'3px',fontWeight:'600',textTransform:'uppercase'}}>{item.l}</div>
                        <div style={{fontSize:item.big?'1.2rem':'1rem',fontWeight:'800',color:item.c}}>£{item.v.toLocaleString()}</div>
                      </div>
                    ))}
                    <div style={{gridColumn:'span 2',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
                      <div style={{fontSize:'10px',color:'#10b981',fontWeight:'700',marginBottom:'2px',textTransform:'uppercase'}}>Monthly Take-Home</div>
                      <div style={{fontSize:'1.6rem',fontWeight:'900',color:'#10b981'}}>£{Math.round(ukR.net/12).toLocaleString()}</div>
                      <div style={{fontSize:'10px',color:muted,marginTop:'2px'}}>Eff. {ukR.eff}% · Marginal {ukR.marginal}% · PA: £{ukR.pa.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{height:'180px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart><Pie data={ukChart.map(d=>({name:d.n,value:d.v}))} cx="50%" cy="50%" innerRadius={48} outerRadius={75} paddingAngle={2} dataKey="value">
                        {ukChart.map((_,i)=><Cell key={i} fill={UCC[i]} strokeWidth={0}/>)}
                      </Pie><Tooltip formatter={(v:number)=>[`£${Number(v).toLocaleString()}`,'']} contentStyle={{background:'#0d1b2a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',color:'white',fontSize:'12px'}}/>
                      <Legend iconSize={8} formatter={v=><span style={{fontSize:'10px',color:muted}}>{v}</span>}/></PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            <div style={{textAlign:'center',marginTop:'20px'}}>
              <Link href={country==='USA'?'/salary-calculator':'/uk-income-tax-calculator'}
                style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',padding:'11px 22px',borderRadius:'10px',textDecoration:'none',fontSize:'14px',fontWeight:'700'}}>
                Full Detailed Calculator →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Slot 1 */}
      <section style={{padding:'0 20px 48px'}}>
        <div style={{maxWidth:'860px',margin:'0 auto',background:theme==='dark'?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)',border:`1px dashed ${cardBorder}`,borderRadius:'10px',height:'80px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:muted}}>Advertisement</div>
      </section>

      {/* All Calculators */}
      <section id="calcs" style={{padding:'0 20px 52px',background:secBg}}>
        <div style={{maxWidth:'1000px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'32px'}}>
            <h2 style={{fontSize:'clamp(1.4rem,3vw,1.9rem)',fontWeight:'800',color:text,margin:'0 0 8px'}}>All Calculators — 100% Free</h2>
            <p style={{color:muted,fontSize:'14px'}}>Professional-grade tools updated with latest tax data</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'14px'}}>
            {CALCS.map(calc=>(
              <Link key={calc.h} href={calc.h} className="calc-card"
                style={{display:'block',textDecoration:'none',background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:'14px',padding:'18px',transition:'transform 0.2s,box-shadow 0.2s'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:'12px'}}>
                  <div style={{width:'40px',height:'40px',borderRadius:'10px',background:calc.c+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0}}>{calc.e}</div>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:'700',color:text,marginBottom:'3px'}}>{calc.t}</div>
                    <div style={{fontSize:'12px',color:muted,lineHeight:1.5}}>{calc.d}</div>
                  </div>
                </div>
                <div style={{marginTop:'12px',fontSize:'12px',fontWeight:'600',color:calc.c,display:'flex',alignItems:'center',gap:'4px'}}>Open →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Slot 2 */}
      <section style={{padding:'0 20px 48px'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto',background:theme==='dark'?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)',border:`1px dashed ${cardBorder}`,borderRadius:'10px',height:'80px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:muted}}>Advertisement</div>
      </section>

      {/* Why WagePilot */}
      <section style={{padding:'0 20px 52px'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'32px'}}>
            <h2 style={{fontSize:'clamp(1.4rem,3vw,1.9rem)',fontWeight:'800',color:text,margin:'0 0 8px'}}>Why Choose WagePilot?</h2>
            <p style={{color:muted,fontSize:'14px'}}>Built for accuracy, speed, and privacy</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'14px'}}>
            {FEATURES.map(f=>(
              <div key={f.t} style={{background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:'12px',padding:'18px',display:'flex',gap:'12px'}}>
                <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'rgba(59,130,246,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0}}>{f.e}</div>
                <div>
                  <div style={{fontSize:'14px',fontWeight:'700',color:text,marginBottom:'3px'}}>{f.t}</div>
                  <div style={{fontSize:'12px',color:muted,lineHeight:1.5}}>{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section style={{padding:'0 20px 52px',background:secBg}}>
        <div style={{maxWidth:'1000px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
            <div>
              <h2 style={{fontSize:'clamp(1.4rem,3vw,1.9rem)',fontWeight:'800',color:text,margin:'0 0 4px'}}>Finance Guides &amp; Tax Tips</h2>
              <p style={{color:muted,fontSize:'14px',margin:0}}>Expert articles on taxes, salary, and financial planning</p>
            </div>
            <Link href="/blog" style={{fontSize:'14px',fontWeight:'600',color:'#3b82f6',textDecoration:'none'}}>All Articles →</Link>
          </div>
          {blogs.length === 0 ? (
            <div style={{background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:'14px',padding:'40px',textAlign:'center'}}>
              <div style={{fontSize:'40px',marginBottom:'12px'}}>📝</div>
              <p style={{color:muted,fontSize:'14px',margin:'0 0 16px'}}>No posts yet. Create posts from the admin panel and mark them to show on homepage.</p>
              <Link href="/admin" style={{background:'#2563eb',color:'white',padding:'8px 20px',borderRadius:'8px',textDecoration:'none',fontSize:'13px',fontWeight:'600'}}>Go to Admin Panel</Link>
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'14px'}}>
              {blogs.map((post:any)=>(
                <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card"
                  style={{display:'block',textDecoration:'none',background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:'12px',overflow:'hidden',transition:'transform 0.2s'}}>
                  <div style={{height:'5px',background:'linear-gradient(90deg,#3b82f6,#06b6d4)'}}/>
                  <div style={{padding:'16px'}}>
                    <div style={{display:'inline-block',fontSize:'10px',fontWeight:'700',color:'#3b82f6',background:'rgba(59,130,246,0.1)',borderRadius:'5px',padding:'2px 8px',marginBottom:'8px',textTransform:'uppercase'}}>{post.category?.replace(/-/g,' ')}</div>
                    <h3 style={{fontSize:'14px',fontWeight:'700',color:text,margin:'0 0 6px',lineHeight:1.4}}>{post.title}</h3>
                    <p style={{fontSize:'12px',color:muted,margin:'0 0 10px',lineHeight:1.5}}>{post.description?.slice(0,90)}...</p>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:muted}}>
                      <span>{post.read_time} min read</span>
                      <span>{new Date(post.published_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ad Slot 3 */}
      <section style={{padding:'0 20px 48px'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto',background:theme==='dark'?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)',border:`1px dashed ${cardBorder}`,borderRadius:'10px',height:'80px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:muted}}>Advertisement</div>
      </section>

      {/* FAQ */}
      <section style={{padding:'0 20px 52px'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <h2 style={{fontSize:'clamp(1.4rem,3vw,1.9rem)',fontWeight:'800',color:text,margin:'0 0 24px',textAlign:'center'}}>Frequently Asked Questions</h2>
          {faqs.length === 0 ? (
            <div style={{background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:'12px',padding:'32px',textAlign:'center'}}>
              <p style={{color:muted,fontSize:'14px',margin:0}}>FAQs will appear here once added from admin panel.</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {faqs.map((faq:any,i:number)=>(
                <div key={faq.id} style={{background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:'10px',overflow:'hidden'}}>
                  <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                    style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'15px 18px',background:'transparent',border:'none',cursor:'pointer',textAlign:'left',gap:'12px'}}>
                    <span style={{fontSize:'14px',fontWeight:'600',color:text}}>{faq.question}</span>
                    <span style={{color:muted,flexShrink:0,fontSize:'18px',transform:openFaq===i?'rotate(180deg)':'none',transition:'transform 0.2s',display:'inline-block'}}>⌄</span>
                  </button>
                  {openFaq===i && (
                    <div style={{padding:'0 18px 15px'}}>
                      <p style={{margin:0,fontSize:'14px',color:muted,lineHeight:1.7}}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{padding:'0 20px 52px'}}>
        <div style={{maxWidth:'560px',margin:'0 auto',background:theme==='dark'?'rgba(59,130,246,0.08)':cardBg,border:`1px solid ${theme==='dark'?'rgba(59,130,246,0.2)':cardBorder}`,borderRadius:'18px',padding:'36px 28px',textAlign:'center',boxShadow:theme==='dark'?'none':'0 4px 24px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:'32px',marginBottom:'12px'}}>📬</div>
          <h2 style={{fontSize:'1.3rem',fontWeight:'800',color:text,margin:'0 0 6px'}}>Get Tax Updates in Your Inbox</h2>
          <p style={{color:muted,margin:'0 0 20px',fontSize:'14px'}}>New tax rates, salary guides, and calculator updates — no spam.</p>
          {subscribed ? (
            <div style={{color:'#10b981',fontWeight:'700',fontSize:'15px'}}>✅ Subscribed! Thank you 🎉</div>
          ) : (
            <div style={{display:'flex',gap:'8px',maxWidth:'380px',margin:'0 auto',flexWrap:'wrap',justifyContent:'center'}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
                style={{flex:1,minWidth:'200px',background:theme==='dark'?'rgba(255,255,255,0.08)':cardBg,border:`1px solid ${cardBorder}`,borderRadius:'9px',padding:'11px 14px',fontSize:'14px',color:text,outline:'none'}}/>
              <button onClick={subscribe} disabled={subLoading}
                style={{background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',border:'none',borderRadius:'9px',padding:'11px 18px',fontSize:'14px',fontWeight:'700',cursor:subLoading?'not-allowed':'pointer'}}>
                {subLoading?'...':'📧 Subscribe'}
              </button>
            </div>
          )}
          <p style={{fontSize:'11px',color:muted,marginTop:'10px'}}>No spam · Unsubscribe anytime · Privacy protected</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{background:'#020b14',borderTop:'1px solid rgba(255,255,255,0.06)',padding:'44px 20px 28px'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'28px',marginBottom:'36px'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
                <div style={{width:'30px',height:'30px',background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px'}}>💰</div>
                <span style={{fontSize:'16px',fontWeight:'800',background:'linear-gradient(90deg,#60a5fa,#22d3ee)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>WagePilot</span>
              </div>
              <p style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',lineHeight:1.7}}>Free salary & tax calculators for US and UK workers. Updated for latest tax year.</p>
            </div>
            {[
              {title:'Calculators',links:[{n:'Salary Calculator',h:'/salary-calculator'},{n:'Paycheck Calculator',h:'/paycheck-calculator'},{n:'Overtime Calculator',h:'/overtime-calculator'},{n:'Contractor Tax',h:'/contractor-calculator'},{n:'UK Income Tax',h:'/uk-income-tax-calculator'}]},
              {title:'USA Pages',links:[{n:'Texas',h:'/texas-salary-calculator'},{n:'California',h:'/california-salary-calculator'},{n:'New York',h:'/new-york-salary-calculator'},{n:'All 50 States',h:'/states'}]},
              {title:'Resources',links:[{n:'Blog',h:'/blog'},{n:'About',h:'/about'},{n:'Contact Us',h:'/contact'},{n:'FAQ',h:'/faq'}]},
              {title:'Legal',links:[{n:'Privacy Policy',h:'/privacy'},{n:'Terms & Conditions',h:'/terms'},{n:'Disclaimer',h:'/disclaimer'}]},
            ].map(col=>(
              <div key={col.title}>
                <h4 style={{fontSize:'11px',fontWeight:'700',color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'10px'}}>{col.title}</h4>
                {col.links.map(l=>(
                  <Link key={l.h} href={l.h} style={{display:'block',fontSize:'13px',color:'rgba(255,255,255,0.5)',textDecoration:'none',marginBottom:'6px'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='white')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.5)')}>
                    {l.n}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'20px',display:'flex',flexWrap:'wrap',gap:'12px',justifyContent:'space-between',alignItems:'center'}}>
            <p style={{fontSize:'12px',color:'rgba(255,255,255,0.3)',margin:0}}>© {new Date().getFullYear()} WagePilot. Tax data from IRS & HMRC. Not professional tax advice.</p>
            <div style={{display:'flex',gap:'16px'}}>
              {[{n:'Privacy',h:'/privacy'},{n:'Terms',h:'/terms'},{n:'Disclaimer',h:'/disclaimer'}].map(l=>(
                <Link key={l.h} href={l.h} style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>{l.n}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
