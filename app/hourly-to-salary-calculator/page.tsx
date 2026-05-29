'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SharedNav } from '@/components/layout/SharedNav'
import { SharedFooter } from '@/components/layout/SharedFooter'
function conv(v:number,hrs:number,mode:'h2s'|'s2h'){
  const ann=hrs*52,hourly=mode==='h2s'?v:v/ann,annual=mode==='h2s'?v*ann:v
  return{hourly,annual,monthly:annual/12,semiMonthly:annual/24,biWeekly:annual/26,weekly:annual/52,daily:annual/((hrs/8)*52)}
}
function fmt(n:number,d=0){return'$'+n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})}
export default function HourlyPage(){
  const[mode,setMode]=useState<'h2s'|'s2h'>('h2s');const[value,setValue]=useState(25);const[hrs,setHrs]=useState(40)
  const[r,setR]=useState(conv(25,40,'h2s'))
  useEffect(()=>{setR(conv(value,hrs,mode))},[value,hrs,mode])
  const flip=()=>{const nv=mode==='h2s'?Math.round(r.annual):Math.round(r.hourly*100)/100;setMode(m=>m==='h2s'?'s2h':'h2s');setValue(nv)}
  const inp={width:'100%',border:'1px solid #e2e8f0',borderRadius:'10px',padding:'10px 12px',fontSize:'14px',color:'#0f172a',outline:'none',background:'white',boxSizing:'border-box' as const}
  const periods=[{l:'Hourly',v:r.hourly,p:'per hour',f:(v:number)=>fmt(v,2)},{l:'Daily (8h)',v:r.daily,p:'per day',f:fmt},{l:'Weekly',v:r.weekly,p:'per week',f:fmt},{l:'Bi-Weekly',v:r.biWeekly,p:'every 2 weeks',f:fmt},{l:'Semi-Monthly',v:r.semiMonthly,p:'twice/month',f:fmt},{l:'Monthly',v:r.monthly,p:'per month',f:fmt},{l:'Annual',v:r.annual,p:'per year',h:true,f:fmt}]
  return(
    <div style={{background:'#f8fafc',minHeight:'100vh',fontFamily:'system-ui,sans-serif'}}>
      <SharedNav/>
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'32px 20px'}}>
        <nav style={{fontSize:'13px',color:'#94a3b8',marginBottom:'20px'}}><Link href="/" style={{color:'#94a3b8',textDecoration:'none'}}>Home</Link>{' / '}<span style={{color:'#0f172a'}}>Hourly to Salary</span></nav>
        <h1 style={{fontSize:'clamp(1.6rem,4vw,2.2rem)',fontWeight:'800',color:'#0f172a',margin:'0 0 8px'}}>🕐 Hourly to Salary Calculator</h1>
        <p style={{color:'#64748b',fontSize:'15px',marginBottom:'28px'}}>Convert hourly wage to annual salary or vice versa instantly.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'20px'}}>
          <div style={{background:'white',borderRadius:'16px',border:'1px solid #e2e8f0',padding:'24px'}}>
            <div style={{display:'flex',gap:'8px',marginBottom:'20px',background:'#f1f5f9',borderRadius:'10px',padding:'4px'}}>
              {[['h2s','🕐 Hourly → Salary'],['s2h','💰 Salary → Hourly']].map(([m,l])=>(
                <button key={m} onClick={()=>setMode(m as any)} style={{flex:1,padding:'8px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'700',background:mode===m?'white':'transparent',color:mode===m?'#2563eb':'#64748b',boxShadow:mode===m?'0 1px 4px rgba(0,0,0,0.08)':'none'}}>{l}</button>
              ))}
            </div>
            <div style={{marginBottom:'18px'}}>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>{mode==='h2s'?'Hourly Rate':'Annual Salary'}</label>
              <div style={{position:'relative'}}><span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontWeight:'600'}}>$</span>
              <input type="number" value={value} min={0} step={mode==='h2s'?0.25:1000} onChange={e=>setValue(Number(e.target.value))} style={{...inp,paddingLeft:'28px'}}/></div>
              <input type="range" min={mode==='h2s'?7.25:20000} max={mode==='h2s'?200:500000} step={mode==='h2s'?0.25:1000} value={value} onChange={e=>setValue(Number(e.target.value))} style={{width:'100%',marginTop:'8px',accentColor:'#3b82f6'}}/>
            </div>
            <div style={{marginBottom:'20px'}}>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Hours Per Week: {hrs}h</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'6px',marginBottom:'8px'}}>
                {[20,30,40,50].map(h=>(
                  <button key={h} onClick={()=>setHrs(h)} style={{padding:'8px',borderRadius:'8px',border:`1px solid ${hrs===h?'#3b82f6':'#e2e8f0'}`,background:hrs===h?'#eff6ff':'white',color:hrs===h?'#2563eb':'#64748b',fontSize:'13px',fontWeight:'700',cursor:'pointer'}}>{h}h</button>
                ))}
              </div>
              <input type="range" min={1} max={80} value={hrs} onChange={e=>setHrs(Number(e.target.value))} style={{width:'100%',accentColor:'#3b82f6'}}/>
            </div>
            <button onClick={flip} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #e2e8f0',background:'#f8fafc',cursor:'pointer',fontSize:'13px',fontWeight:'700',color:'#3b82f6'}}>
              🔄 Flip Conversion
            </button>
            <div style={{marginTop:'14px',background:'#f8fafc',borderRadius:'10px',padding:'12px',border:'1px solid #e2e8f0'}}>
              <p style={{fontSize:'11px',fontWeight:'700',color:'#94a3b8',textTransform:'uppercase',marginBottom:'8px',letterSpacing:'0.04em'}}>Quick References</p>
              {[{l:'US Min Wage',h:7.25},{l:'US Median',h:22.50},{l:'$50k/year',h:24.04},{l:'$100k/year',h:48.08}].map(ref=>(
                <button key={ref.l} onClick={()=>{setMode('h2s');setValue(ref.h)}} style={{display:'flex',justifyContent:'space-between',width:'100%',padding:'6px 8px',borderRadius:'6px',border:'none',background:'transparent',cursor:'pointer',fontSize:'12px',color:'#64748b',marginBottom:'2px'}}>
                  <span>{ref.l}</span><span style={{fontWeight:'700',color:'#3b82f6'}}>{fmt(ref.h,2)}/hr</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            <div style={{background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'16px',padding:'24px',color:'white'}}>
              <p style={{margin:'0 0 4px',fontSize:'12px',opacity:.8,textTransform:'uppercase',letterSpacing:'0.05em'}}>{mode==='h2s'?'Annual Salary':'Hourly Rate'}</p>
              <p style={{margin:'0 0 6px',fontSize:'2.4rem',fontWeight:'900',lineHeight:1}}>{mode==='h2s'?fmt(r.annual):fmt(r.hourly,2)+'/hr'}</p>
              <p style={{margin:0,fontSize:'13px',opacity:.8}}>Based on {hrs}h/week × 52 weeks = {(hrs*52).toLocaleString()}h/year</p>
            </div>
            <div style={{background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
              <div style={{padding:'14px 18px',borderBottom:'1px solid #e2e8f0',fontWeight:'700',fontSize:'14px',color:'#0f172a'}}>All Pay Periods (Gross)</div>
              {periods.map((row:any)=>(
                <div key={row.l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 18px',borderBottom:'1px solid #f1f5f9',background:row.h?'#f0fdf4':'white'}}>
                  <div>
                    <span style={{fontSize:'13px',fontWeight:row.h?'700':'500',color:row.h?'#166534':'#0f172a'}}>{row.l}</span>
                    <span style={{fontSize:'11px',color:'#94a3b8',marginLeft:'6px'}}>({row.p})</span>
                  </div>
                  <span style={{fontSize:row.h?'1rem':'14px',fontWeight:'700',color:row.h?'#16a34a':'#0f172a'}}>{row.f(row.v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{marginTop:'20px',background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',padding:'18px'}}>
          <h3 style={{fontSize:'14px',fontWeight:'700',color:'#0f172a',marginBottom:'10px'}}>Related Calculators</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
            {[{name:'💰 Salary Calculator',href:'/salary-calculator'},{name:'⏰ Overtime',href:'/overtime-calculator'},{name:'✅ Take Home Pay',href:'/take-home-pay-calculator'}].map(c=>(
              <Link key={c.href} href={c.href} style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'8px',padding:'7px 14px',textDecoration:'none',fontSize:'13px',fontWeight:'600',color:'#2563eb'}}>{c.name}</Link>
            ))}
          </div>
        </div>
      </div>
      <SharedFooter/>
    </div>
  )
}
