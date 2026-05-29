'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SharedNav } from '@/components/layout/SharedNav'
import { SharedFooter } from '@/components/layout/SharedFooter'
const SR:Record<string,number>={TX:0,FL:0,WA:0,NV:0,AK:0,SD:0,WY:0,TN:0,NH:0,CA:0.093,NY:0.0685,IL:0.0495,CO:0.044,GA:0.055,PA:0.0307,AZ:0.025,NC:0.0449,MA:0.05,VA:0.0575,OH:0.0399,MI:0.0425,OR:0.0875,NJ:0.1075,MN:0.0985,MD:0.0575}
const STATES=[['AK','Alaska'],['AZ','Arizona'],['CA','California'],['CO','Colorado'],['FL','Florida'],['GA','Georgia'],['IL','Illinois'],['MA','Massachusetts'],['MD','Maryland'],['MI','Michigan'],['MN','Minnesota'],['NC','North Carolina'],['NH','New Hampshire'],['NJ','New Jersey'],['NV','Nevada'],['NY','New York'],['OH','Ohio'],['OR','Oregon'],['PA','Pennsylvania'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['VA','Virginia'],['WA','Washington'],['WY','Wyoming']]
function calc(gross:number,state:string){
  const taxable=Math.max(0,gross-15000)
  const brk:any=[[11925,.10],[48475,.12],[103350,.22],[197300,.24],[250525,.32],[626350,.35],[Infinity,.37]]
  let fed=0,p=0;for(const[l,r]of brk){if(taxable<=p)break;fed+=(Math.min(taxable,l)-p)*r;p=l}
  const st=gross*(SR[state]||0),ss=Math.min(gross,176100)*0.062,med=gross*0.0145
  const total=fed+st+ss+med,net=gross-total
  return{fed:Math.round(fed),st:Math.round(st),ss:Math.round(ss),med:Math.round(med),total:Math.round(total),net:Math.round(net),monthly:Math.round(net/12),biWeekly:Math.round(net/26),weekly:Math.round(net/52),hourly:Math.round(net/2080),eff:gross>0?(total/gross*100).toFixed(1):'0'}
}
function fmt(n:number){return'$'+Math.abs(n).toLocaleString()}
export default function TakeHomePage(){
  const[salary,setSalary]=useState(60000);const[state,setState]=useState('TX')
  const[r,setR]=useState(calc(60000,'TX'))
  useEffect(()=>{setR(calc(salary,state))},[salary,state])
  const inp={width:'100%',border:'1px solid #e2e8f0',borderRadius:'10px',padding:'10px 12px',fontSize:'14px',color:'#0f172a',outline:'none',background:'white',boxSizing:'border-box' as const}
  return(
    <div style={{background:'#f8fafc',minHeight:'100vh',fontFamily:'system-ui,sans-serif'}}>
      <SharedNav/>
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'32px 20px'}}>
        <nav style={{fontSize:'13px',color:'#94a3b8',marginBottom:'20px'}}><Link href="/" style={{color:'#94a3b8',textDecoration:'none'}}>Home</Link>{' / '}<span style={{color:'#0f172a'}}>Take Home Pay</span></nav>
        <h1 style={{fontSize:'clamp(1.6rem,4vw,2.2rem)',fontWeight:'800',color:'#0f172a',margin:'0 0 8px'}}>✅ Take-Home Pay Calculator</h1>
        <p style={{color:'#64748b',fontSize:'15px',marginBottom:'28px'}}>See exactly what lands in your bank account after all deductions.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'20px'}}>
          <div style={{background:'white',borderRadius:'16px',border:'1px solid #e2e8f0',padding:'24px'}}>
            <h2 style={{fontSize:'1rem',fontWeight:'700',color:'#0f172a',marginBottom:'20px'}}>Enter Your Salary</h2>
            <div style={{marginBottom:'18px'}}>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Annual Gross Salary</label>
              <div style={{position:'relative'}}><span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontWeight:'600'}}>$</span>
              <input type="number" value={salary} onChange={e=>setSalary(Number(e.target.value))} min={0} style={{...inp,paddingLeft:'28px'}}/></div>
              <input type="range" min={20000} max={500000} step={1000} value={salary} onChange={e=>setSalary(Number(e.target.value))} style={{width:'100%',marginTop:'8px',accentColor:'#3b82f6'}}/>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'#94a3b8'}}><span>$20k</span><span>$500k</span></div>
            </div>
            <div style={{marginBottom:'20px'}}>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>State</label>
              <select value={state} onChange={e=>setState(e.target.value)} style={inp}>{STATES.map(([c,n])=><option key={c} value={c}>{n}</option>)}</select>
            </div>
            <div>
              <p style={{fontSize:'11px',fontWeight:'700',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:'8px'}}>Quick Select</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px'}}>
                {[40000,60000,75000,100000,150000,200000].map(s=>(
                  <button key={s} onClick={()=>setSalary(s)} style={{padding:'7px',borderRadius:'8px',border:`1px solid ${salary===s?'#3b82f6':'#e2e8f0'}`,background:salary===s?'#eff6ff':'white',color:salary===s?'#2563eb':'#64748b',fontSize:'11px',fontWeight:'700',cursor:'pointer'}}>
                    ${s>=1000?(s/1000)+'k':s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            <div style={{background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'16px',padding:'24px',color:'white'}}>
              <p style={{margin:'0 0 4px',fontSize:'12px',opacity:.8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Annual Take-Home Pay</p>
              <p style={{margin:'0 0 8px',fontSize:'2.4rem',fontWeight:'900',lineHeight:1}}>{fmt(r.net)}</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'8px'}}>
                {[{l:'Monthly',v:r.monthly},{l:'Bi-Weekly',v:r.biWeekly},{l:'Weekly',v:r.weekly},{l:'Hourly',v:r.hourly}].map(p=>(
                  <div key={p.l} style={{background:'rgba(255,255,255,0.12)',borderRadius:'8px',padding:'10px',textAlign:'center'}}>
                    <div style={{fontSize:'10px',opacity:.8,marginBottom:'2px',textTransform:'uppercase'}}>{p.l}</div>
                    <div style={{fontSize:'1rem',fontWeight:'800'}}>{fmt(p.v)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
              <div style={{padding:'14px 18px',borderBottom:'1px solid #e2e8f0',fontWeight:'700',fontSize:'14px',color:'#0f172a'}}>Deductions Breakdown</div>
              {[{l:'Gross Salary',v:salary},{l:'Federal Income Tax',v:-r.fed},{l:`${STATES.find(s=>s[0]===state)?.[1]||state} State Tax`,v:-r.st},{l:'Social Security (6.2%)',v:-r.ss},{l:'Medicare (1.45%)',v:-r.med},{l:'🎉 Take-Home Pay',v:r.net,h:true}].map((row:any,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'11px 18px',borderBottom:'1px solid #f1f5f9',background:row.h?'#f0fdf4':'white'}}>
                  <span style={{fontSize:'13px',color:row.h?'#166534':'#64748b',fontWeight:row.h?'700':'400'}}>{row.l}</span>
                  <span style={{fontSize:'13px',fontWeight:'700',color:row.h?'#16a34a':row.v<0?'#ef4444':'#0f172a'}}>{row.v<0?`−${fmt(Math.abs(row.v))}`:fmt(row.v)}</span>
                </div>
              ))}
            </div>
            <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'12px',padding:'14px'}}>
              <div style={{fontSize:'13px',fontWeight:'700',color:'#166534',marginBottom:'4px'}}>Effective Tax Rate: {r.eff}%</div>
              <p style={{fontSize:'12px',color:'#15803d',margin:0}}>You keep {(100-Number(r.eff)).toFixed(1)}% of your gross salary.{SR[state]===0?` ${STATES.find(s=>s[0]===state)?.[1]} has no state income tax! 🎉`:''}</p>
            </div>
          </div>
        </div>
        <div style={{marginTop:'20px',background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',padding:'18px'}}>
          <h3 style={{fontSize:'14px',fontWeight:'700',color:'#0f172a',marginBottom:'10px'}}>Related Calculators</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
            {[{name:'💰 Full Salary Calculator',href:'/salary-calculator'},{name:'📊 Compare States',href:'/salary-comparison'},{name:'🇬🇧 UK Tax',href:'/uk-income-tax-calculator'}].map(c=>(
              <Link key={c.href} href={c.href} style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'8px',padding:'7px 14px',textDecoration:'none',fontSize:'13px',fontWeight:'600',color:'#2563eb'}}>{c.name}</Link>
            ))}
          </div>
        </div>
      </div>
      <SharedFooter/>
    </div>
  )
}
