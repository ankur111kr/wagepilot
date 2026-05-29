'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SharedNav } from '@/components/layout/SharedNav'
import { SharedFooter } from '@/components/layout/SharedFooter'
type FilingStatus = 'single'|'married_jointly'|'married_separately'|'head_of_household'
const US_STATES=[['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],['DC','Washington D.C.']]
const STATE_RATES:Record<string,number>={AL:0.05,AK:0,AZ:0.025,AR:0.044,CA:0.093,CO:0.044,CT:0.0699,DE:0.066,FL:0,GA:0.055,HI:0.11,ID:0.058,IL:0.0495,IN:0.03,IA:0.057,KS:0.057,KY:0.04,LA:0.0425,ME:0.0715,MD:0.0575,MA:0.05,MI:0.0425,MN:0.0985,MS:0.047,MO:0.048,MT:0.059,NE:0.0584,NV:0,NH:0,NJ:0.1075,NM:0.059,NY:0.0685,NC:0.0449,ND:0.025,OH:0.0399,OK:0.0475,OR:0.099,PA:0.0307,RI:0.0599,SC:0.064,SD:0,TN:0,TX:0,UT:0.0455,VT:0.0875,VA:0.0575,WA:0,WV:0.065,WI:0.0765,WY:0,DC:0.1075}
function calcTax(gross:number,state:string,filing:FilingStatus,k401:number){
  const std={single:15000,married_jointly:30000,married_separately:15000,head_of_household:22500}[filing]
  const taxable=Math.max(0,gross-k401-std)
  const brk:Record<FilingStatus,[number,number][]>={single:[[11925,.10],[48475,.12],[103350,.22],[197300,.24],[250525,.32],[626350,.35],[Infinity,.37]],married_jointly:[[23850,.10],[96950,.12],[206700,.22],[394600,.24],[501050,.32],[751600,.35],[Infinity,.37]],married_separately:[[11925,.10],[48475,.12],[103350,.22],[197300,.24],[250525,.32],[375800,.35],[Infinity,.37]],head_of_household:[[17000,.10],[64850,.12],[103350,.22],[197300,.24],[250500,.32],[626350,.35],[Infinity,.37]]}
  let fed=0,prev=0
  for(const[limit,rate]of brk[filing]){if(taxable<=prev)break;fed+=(Math.min(taxable,limit)-prev)*rate;prev=limit}
  const stateTax=(gross-k401)*(STATE_RATES[state]||0)
  const ss=Math.min(gross,176100)*0.062
  const med=gross*0.0145+(gross>200000?(gross-200000)*0.009:0)
  const total=fed+stateTax+ss+med
  const net=gross-total-k401
  const mr=taxable>626350?37:taxable>250525?35:taxable>197300?32:taxable>103350?24:taxable>48475?22:taxable>11925?12:10
  return{federal:Math.round(fed),stateTax:Math.round(stateTax),ss:Math.round(ss),medicare:Math.round(med),total:Math.round(total),net:Math.round(net),effectiveFed:gross>0?(fed/gross*100).toFixed(1):'0',effectiveState:gross>0?(stateTax/gross*100).toFixed(1):'0',effectiveTotal:gross>0?(total/gross*100).toFixed(1):'0',marginalRate:mr,monthly:Math.round(net/12),biWeekly:Math.round(net/26),weekly:Math.round(net/52)}
}
function fmt(n:number){return'$'+Math.abs(n).toLocaleString('en-US')}
export default function SalaryCalculatorPage(){
  const[salary,setSalary]=useState(75000)
  const[state,setState]=useState('CA')
  const[filing,setFiling]=useState<FilingStatus>('single')
  const[k401,setK401]=useState(0)
  const[showAdv,setShowAdv]=useState(false)
  const[copied,setCopied]=useState(false)
  const[result,setResult]=useState(calcTax(75000,'CA','single',0))
  useEffect(()=>{setResult(calcTax(salary,state,filing,k401))},[salary,state,filing,k401])
  const handleCopy=async()=>{await navigator.clipboard.writeText(`WagePilot\nGross: ${fmt(salary)}\nFederal: ${fmt(result.federal)}\nState: ${fmt(result.stateTax)}\nFICA: ${fmt(result.ss+result.medicare)}\nNet: ${fmt(result.net)}\nRate: ${result.effectiveTotal}%`);setCopied(true);setTimeout(()=>setCopied(false),2000)}
  const inp={width:'100%',border:'1px solid #e2e8f0',borderRadius:'10px',padding:'10px 12px',fontSize:'14px',color:'#0f172a',outline:'none',background:'white',boxSizing:'border-box' as const}
  return(
    <div style={{background:'#f8fafc',minHeight:'100vh',fontFamily:'system-ui,sans-serif'}}>
      <SharedNav/>
      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'32px 20px'}}>
        <nav style={{fontSize:'13px',color:'#94a3b8',marginBottom:'20px'}}>
          <Link href="/" style={{color:'#94a3b8',textDecoration:'none'}}>Home</Link>{' / '}
          <span style={{color:'#0f172a'}}>Salary Calculator</span>
        </nav>
        <div style={{marginBottom:'28px'}}>
          <h1 style={{fontSize:'clamp(1.6rem,4vw,2.2rem)',fontWeight:'800',color:'#0f172a',margin:'0 0 8px'}}>💰 US Salary Calculator — Latest Tax Rates</h1>
          <p style={{color:'#64748b',fontSize:'15px',margin:0}}>Calculate your exact take-home pay after federal tax, state tax, Social Security, and Medicare.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'20px'}}>
          <div style={{background:'white',borderRadius:'16px',border:'1px solid #e2e8f0',padding:'24px'}}>
            <h2 style={{fontSize:'1rem',fontWeight:'700',color:'#0f172a',marginBottom:'20px'}}>Your Information</h2>
            <div style={{marginBottom:'18px'}}>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Annual Salary</label>
              <div style={{position:'relative'}}><span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontWeight:'600'}}>$</span>
              <input type="number" value={salary} onChange={e=>setSalary(Number(e.target.value))} min={0} style={{...inp,paddingLeft:'28px'}}/></div>
              <input type="range" min={20000} max={500000} step={1000} value={salary} onChange={e=>setSalary(Number(e.target.value))} style={{width:'100%',marginTop:'8px',accentColor:'#3b82f6'}}/>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'#94a3b8',marginTop:'2px'}}><span>$20k</span><span>$500k</span></div>
            </div>
            <div style={{marginBottom:'18px'}}>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>State</label>
              <select value={state} onChange={e=>setState(e.target.value)} style={inp}>{US_STATES.map(([c,n])=><option key={c} value={c}>{n}</option>)}</select>
            </div>
            <div style={{marginBottom:'18px'}}>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Filing Status</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
                {[{v:'single',l:'Single'},{v:'married_jointly',l:'Married Jointly'},{v:'married_separately',l:'Married Separately'},{v:'head_of_household',l:'Head of Household'}].map(fs=>(
                  <button key={fs.v} onClick={()=>setFiling(fs.v as FilingStatus)}
                    style={{padding:'8px 6px',borderRadius:'8px',border:`1px solid ${filing===fs.v?'#3b82f6':'#e2e8f0'}`,background:filing===fs.v?'#eff6ff':'white',color:filing===fs.v?'#2563eb':'#64748b',fontSize:'12px',fontWeight:'600',cursor:'pointer',textAlign:'center'}}>
                    {fs.l}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={()=>setShowAdv(v=>!v)} style={{width:'100%',padding:'10px',borderRadius:'8px',border:'1px solid #e2e8f0',background:'white',cursor:'pointer',fontSize:'13px',fontWeight:'600',color:'#64748b',display:'flex',justifyContent:'space-between'}}>
              <span>Advanced Options (401k)</span><span>{showAdv?'▲':'▼'}</span>
            </button>
            {showAdv&&<div style={{marginTop:'14px'}}>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>401(k): {fmt(k401)}/yr</label>
              <input type="range" min={0} max={23500} step={500} value={k401} onChange={e=>setK401(Number(e.target.value))} style={{width:'100%',accentColor:'#3b82f6'}}/>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'#94a3b8',marginTop:'2px'}}><span>$0</span><span>Max $23,500</span></div>
            </div>}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div style={{background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'16px',padding:'24px',color:'white'}}>
              <p style={{margin:'0 0 4px',fontSize:'12px',opacity:0.8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Annual Take-Home Pay</p>
              <p style={{margin:'0 0 4px',fontSize:'2.4rem',fontWeight:'900',lineHeight:1}}>{fmt(result.net)}</p>
              <p style={{margin:'0 0 16px',fontSize:'13px',opacity:0.8}}>{fmt(result.monthly)}/mo · {fmt(result.biWeekly)}/biweekly</p>
              <button onClick={handleCopy} style={{background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.25)',borderRadius:'7px',padding:'6px 14px',color:'white',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>
                {copied?'✅ Copied!':'📋 Copy Results'}
              </button>
            </div>
            <div style={{background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
              <div style={{padding:'14px 18px',borderBottom:'1px solid #e2e8f0',fontWeight:'700',fontSize:'14px',color:'#0f172a'}}>Tax Breakdown</div>
              {[
                {label:'Gross Income',value:salary},
                {label:`Federal Tax (${result.effectiveFed}%)`,value:-result.federal},
                {label:`State Tax (${result.effectiveState}%)`,value:-result.stateTax},
                {label:'Social Security (6.2%)',value:-result.ss},
                {label:'Medicare (1.45%)',value:-result.medicare},
                ...(k401>0?[{label:'401(k) Contribution',value:-k401}]:[]),
                {label:'🎉 Take-Home Pay',value:result.net,highlight:true},
              ].map((row:any,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'11px 18px',borderBottom:'1px solid #f1f5f9',background:row.highlight?'#f0fdf4':'white'}}>
                  <span style={{fontSize:'13px',color:row.highlight?'#166534':'#64748b',fontWeight:row.highlight?'700':'400'}}>{row.label}</span>
                  <span style={{fontSize:'13px',fontWeight:'700',color:row.highlight?'#16a34a':row.value<0?'#ef4444':'#0f172a'}}>
                    {row.value<0?`−${fmt(Math.abs(row.value))}`:fmt(row.value)}
                  </span>
                </div>
              ))}
            </div>
            <div style={{background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',padding:'18px'}}>
              <h3 style={{fontSize:'14px',fontWeight:'700',color:'#0f172a',marginBottom:'12px'}}>Your Tax Rates</h3>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'8px'}}>
                {[{l:'Marginal Federal',v:`${result.marginalRate}%`,c:'#ef4444'},{l:'Effective Federal',v:`${result.effectiveFed}%`,c:'#f59e0b'},{l:'State Rate',v:`${result.effectiveState}%`,c:'#8b5cf6'},{l:'Total Effective',v:`${result.effectiveTotal}%`,c:'#3b82f6'}].map(item=>(
                  <div key={item.l} style={{background:'#f8fafc',borderRadius:'10px',padding:'12px',textAlign:'center',border:'1px solid #e2e8f0'}}>
                    <div style={{fontSize:'1.4rem',fontWeight:'900',color:item.c}}>{item.v}</div>
                    <div style={{fontSize:'11px',color:'#64748b',marginTop:'2px'}}>{item.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{marginTop:'20px',background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',padding:'18px'}}>
          <h3 style={{fontSize:'14px',fontWeight:'700',color:'#0f172a',marginBottom:'10px'}}>Related Calculators</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
            {[{name:'⏰ Overtime',href:'/overtime-calculator'},{name:'💼 Contractor',href:'/contractor-calculator'},{name:'🕐 Hourly→Salary',href:'/hourly-to-salary-calculator'},{name:'🇬🇧 UK Tax',href:'/uk-income-tax-calculator'},{name:'📊 Compare States',href:'/salary-comparison'}].map(c=>(
              <Link key={c.href} href={c.href} style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'8px',padding:'7px 14px',textDecoration:'none',fontSize:'13px',fontWeight:'600',color:'#2563eb'}}>{c.name}</Link>
            ))}
          </div>
        </div>
      </div>
      <SharedFooter/>
    </div>
  )
}
