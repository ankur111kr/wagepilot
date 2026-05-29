'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export function SharedNav() {
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState('USA')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const saved = localStorage.getItem('wp_country') || 'USA'
    setCountry(saved)
  }, [])

  const handleCountryChange = (c: string) => {
    setCountry(c)
    localStorage.setItem('wp_country', c)
    // Redirect to correct calculator
    if (pathname.includes('uk-income-tax') && c === 'USA') {
      router.push('/salary-calculator')
    } else if ((pathname.includes('salary-calculator') || pathname.includes('paycheck') || pathname.includes('take-home')) && c === 'UK') {
      router.push('/uk-income-tax-calculator')
    }
    window.dispatchEvent(new CustomEvent('countryChange', { detail: c }))
  }

  return (
    <>
      <style>{`
        #sn-desk{display:flex;} #sn-dr{display:flex;} #sn-mob{display:none;}
        @media(max-width:768px){#sn-desk{display:none!important;} #sn-dr{display:none!important;} #sn-mob{display:flex!important;}}
      `}</style>
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(4,14,26,0.95)',borderBottom:'1px solid rgba(255,255,255,0.08)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 20px',height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px'}}>

          <Link href="/" style={{display:'flex',alignItems:'center',gap:'9px',textDecoration:'none',flexShrink:0}}>
            <div style={{width:'34px',height:'34px',background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>💰</div>
            <span style={{fontSize:'18px',fontWeight:'800',background:'linear-gradient(90deg,#60a5fa,#22d3ee)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>WagePilot</span>
          </Link>

          <div id="sn-desk" style={{alignItems:'center',gap:'2px'}}>
            {[{l:'💰 Salary',h:'/salary-calculator'},{l:'⏰ Overtime',h:'/overtime-calculator'},{l:'🕐 Hourly→Salary',h:'/hourly-to-salary-calculator'},{l:'💼 Contractor',h:'/contractor-calculator'},{l:'🇬🇧 UK Tax',h:'/uk-income-tax-calculator'},{l:'📊 Compare',h:'/salary-comparison'},{l:'📝 Blog',h:'/blog'}].map(item=>(
              <Link key={item.h} href={item.h} style={{padding:'7px 10px',borderRadius:'8px',textDecoration:'none',fontSize:'13px',fontWeight:'500',color:'rgba(255,255,255,0.7)',whiteSpace:'nowrap'}}
                onMouseEnter={e=>(e.currentTarget.style.color='white')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.7)')}>
                {item.l}
              </Link>
            ))}
          </div>

          <div id="sn-dr" style={{alignItems:'center',gap:'8px',flexShrink:0}}>
            <select value={country} onChange={e=>handleCountryChange(e.target.value)}
              style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',padding:'6px 10px',fontSize:'13px',color:'white',cursor:'pointer',fontWeight:'600'}}>
              <option value="USA">🇺🇸 USA</option>
              <option value="UK">🇬🇧 UK</option>
            </select>
            <Link href="/salary-calculator" style={{background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',padding:'8px 16px',borderRadius:'8px',textDecoration:'none',fontSize:'13px',fontWeight:'700'}}>
              Calculate Now
            </Link>
          </div>

          <div id="sn-mob" style={{alignItems:'center',gap:'8px'}}>
            <select value={country} onChange={e=>handleCountryChange(e.target.value)}
              style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',padding:'5px 8px',fontSize:'12px',color:'white'}}>
              <option value="USA">🇺🇸</option>
              <option value="UK">🇬🇧</option>
            </select>
            <button onClick={()=>setOpen(v=>!v)} style={{width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.07)',color:'white',cursor:'pointer',fontSize:'18px'}}>
              {open?'✕':'☰'}
            </button>
          </div>
        </div>

        {open && (
          <div style={{background:'rgba(4,14,26,0.98)',borderTop:'1px solid rgba(255,255,255,0.07)',padding:'12px 16px',maxHeight:'80vh',overflowY:'auto'}}>
            {[{l:'🏠 Home',h:'/'},{l:'💰 Salary Calculator',h:'/salary-calculator'},{l:'🧾 Paycheck Calculator',h:'/paycheck-calculator'},{l:'⏰ Overtime Calculator',h:'/overtime-calculator'},{l:'🕐 Hourly → Salary',h:'/hourly-to-salary-calculator'},{l:'✅ Take Home Pay',h:'/take-home-pay-calculator'},{l:'💼 Contractor Tax',h:'/contractor-calculator'},{l:'🏠 Mortgage Calculator',h:'/mortgage-affordability-calculator'},{l:'🐷 Savings Calculator',h:'/savings-calculator'},{l:'📊 Salary Comparison',h:'/salary-comparison'},{l:'🇬🇧 UK Income Tax',h:'/uk-income-tax-calculator'},{l:'📍 All 50 States',h:'/states'},{l:'📝 Blog',h:'/blog'},{l:'📞 Contact Us',h:'/contact'}].map(item=>(
              <Link key={item.h} href={item.h} onClick={()=>setOpen(false)}
                style={{display:'block',padding:'11px 12px',borderRadius:'8px',color:'rgba(255,255,255,0.8)',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}>
                {item.l}
              </Link>
            ))}
            <Link href="/salary-calculator" onClick={()=>setOpen(false)}
              style={{display:'block',marginTop:'10px',background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',padding:'13px',borderRadius:'10px',textDecoration:'none',fontSize:'15px',fontWeight:'700',textAlign:'center'}}>
              🚀 Start Calculating
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}
