'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SharedNav } from '@/components/layout/SharedNav'
import { SharedFooter } from '@/components/layout/SharedFooter'
const SR:Record<string,number>={TX:0,FL:0,WA:0,NV:0,CA:0.093,NY:0.0685,IL:0.0495,CO:0.044,GA:0.055,PA:0.0307,AZ:0.025,NC:0.0449,MA:0.05,VA:0.0575,OH:0.0399,MI:0.0425,OR:0.0875,NJ:0.0637}
function calc(rev:number,exp:number,state:string,ret:number,health:number){
  const net=Math.max(0,rev-exp),se=net*0.9235*0.153,seded=se*0.5
  const agi=Math.max(0,net-seded-ret-health),taxable=Math.max(0,agi-15000)
  const brk:any=[[11925,.10],[48475,.12],[103350,.22],[197300,.24],[250525,.32],[626350,.35],[Infinity,.37]]
  let fed=0,p=0;for(const[l,r]of brk){if(taxable<=p)break;fed+=(Math.min(taxable,l)-p)*r;p=l}
  const st=agi*(SR[state]||0),total=Math.round(se)+Math.round(fed)+Math.round(st)
  return{net:Math.round(net),se:Math.round(se),fed:Math.round(fed),st:Math.round(st),total,takeHome:Math.round(rev-exp-total),quarterly:Math.round(total/4),eff:rev>0?(total/rev*100).toFixed(1):'0',monthly:Math.round((rev-exp-total)/12)}
}
function fmt(n:number){return'$'+Math.abs(n).toLocaleString()}
export default function ContractorPage(){
  const[rev,setRev]=useState(120000);const[exp,setExp]=useState(20000);const[state,setState]=useState('CA');const[ret,setRet]=useState(0);const[health,setHealth]=useState(0)
  const[r,setR]=useState(calc(120000,20000,'CA',0,0))
  useEffect(()=>{setR(calc(rev,exp,state,ret,health))},[rev,exp,state,ret,health])
  const inp={width:'100%',border:'1px solid #e2e8f0',borderRadius:'10px',padding:'10px 12px',fontSize:'14px',color:'#0f172a',outline:'none',background:'white',boxSizing:'border-box' as const}
  return(
    <div style={{background:'#f8fafc',minHeight:'100vh',fontFamily:'system-ui,sans-serif'}}>
      <SharedNav/>
      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'32px 20px'}}>
        <nav style={{fontSize:'13px',color:'#94a3b8',marginBottom:'20px'}}><Link href="/" style={{color:'#94a3b8',textDecoration:'none'}}>Home</Link>{' / '}<span style={{color:'#0f172a'}}>Contractor Tax Calculator</span></nav>
        <h1 style={{fontSize:'clamp(1.6rem,4vw,2.2rem)',fontWeight:'800',color:'#0f172a',margin:'0 0 8px'}}>💼 1099 Contractor Tax Calculator</h1>
        <p style={{color:'#64748b',fontSize:'15px',marginBottom:'28px'}}>Calculate self-employment tax, income tax, and quarterly estimates.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'20px'}}>
          <div style={{background:'white',borderRadius:'16px',border:'1px solid #e2e8f0',padding:'24px'}}>
            <h2 style={{fontSize:'1rem',fontWeight:'700',color:'#0f172a',marginBottom:'20px'}}>Your Income & Expenses</h2>
            {[{l:'Annual Revenue',v:rev,s:setRev,max:1000000},{l:'Business Expenses',v:exp,s:setExp,max:500000}].map(f=>(
              <div key={f.l} style={{marginBottom:'16px'}}>
                <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>{f.l}: {fmt(f.v)}</label>
                <div style={{position:'relative'}}><span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontWeight:'600'}}>$</span>
                <input type="number" value={f.v} onChange={e=>f.s(Number(e.target.value))} min={0} style={{...inp,paddingLeft:'28px'}}/></div>
                <input type="range" min={0} max={f.max} step={5000} value={f.v} onChange={e=>f.s(Number(e.target.value))} style={{width:'100%',marginTop:'6px',accentColor:'#3b82f6'}}/>
              </div>
            ))}
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>State</label>
              <select value={state} onChange={e=>setState(e.target.value)} style={inp}>
                {Object.entries({CA:'California',TX:'Texas',NY:'New York',FL:'Florida',WA:'Washington',NV:'Nevada',IL:'Illinois',CO:'Colorado',GA:'Georgia',PA:'Pennsylvania',AZ:'Arizona',NC:'North Carolina',MA:'Massachusetts',VA:'Virginia',OH:'Ohio',OR:'Oregon',NJ:'New Jersey'}).map(([c,n])=><option key={c} value={c}>{n}</option>)}
              </select>
            </div>
            <div style={{background:'#f8fafc',borderRadius:'10px',padding:'14px',border:'1px solid #e2e8f0'}}>
              <p style={{fontSize:'12px',fontWeight:'700',color:'#64748b',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:'12px'}}>Deductions (Optional)</p>
              <div style={{marginBottom:'10px'}}>
                <label style={{display:'block',fontSize:'12px',fontWeight:'600',color:'#64748b',marginBottom:'5px'}}>SEP-IRA / Solo 401(k): {fmt(ret)}</label>
                <input type="range" min={0} max={69000} step={1000} value={ret} onChange={e=>setRet(Number(e.target.value))} style={{width:'100%',accentColor:'#3b82f6'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'12px',fontWeight:'600',color:'#64748b',marginBottom:'5px'}}>Health Insurance: {fmt(health)}</label>
                <input type="range" min={0} max={30000} step={500} value={health} onChange={e=>setHealth(Number(e.target.value))} style={{width:'100%',accentColor:'#3b82f6'}}/>
              </div>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div style={{background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'16px',padding:'24px',color:'white'}}>
              <p style={{margin:'0 0 4px',fontSize:'12px',opacity:.8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Annual Net Take-Home</p>
              <p style={{margin:'0 0 4px',fontSize:'2.4rem',fontWeight:'900',lineHeight:1}}>{fmt(r.takeHome)}</p>
              <p style={{margin:0,fontSize:'13px',opacity:.8}}>{fmt(r.monthly)}/mo · Effective Rate: {r.eff}%</p>
            </div>
            <div style={{background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
              <div style={{padding:'14px 18px',borderBottom:'1px solid #e2e8f0',fontWeight:'700',fontSize:'14px',color:'#0f172a'}}>Tax Breakdown</div>
              {[{l:'Gross Revenue',v:rev},{l:'Business Expenses',v:-exp},{l:'Net SE Income',v:r.net,b:true},{l:'SE Tax (15.3%)',v:-r.se},{l:'Federal Income Tax',v:-r.fed},{l:'State Income Tax',v:-r.st},{l:'🎉 Net Take-Home',v:r.takeHome,h:true}].map((row:any,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 18px',borderBottom:'1px solid #f1f5f9',background:row.h?'#f0fdf4':row.b?'#f8fafc':'white'}}>
                  <span style={{fontSize:'13px',color:row.h?'#166534':'#64748b',fontWeight:row.h||row.b?'700':'400'}}>{row.l}</span>
                  <span style={{fontSize:'13px',fontWeight:'700',color:row.h?'#16a34a':row.v<0?'#ef4444':'#0f172a'}}>{row.v<0?`−${fmt(Math.abs(row.v))}`:fmt(row.v)}</span>
                </div>
              ))}
            </div>
            <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'12px',padding:'16px'}}>
              <h3 style={{fontSize:'14px',fontWeight:'700',color:'#92400e',marginBottom:'6px'}}>⚠️ Quarterly Estimated Tax</h3>
              <div style={{fontSize:'2rem',fontWeight:'900',color:'#d97706',marginBottom:'6px'}}>{fmt(r.quarterly)}</div>
              <p style={{fontSize:'12px',color:'#78350f',margin:0,lineHeight:1.6}}>Due: Apr 15 · Jun 15 · Sep 15 · Jan 15<br/>Pay to avoid IRS underpayment penalty.</p>
            </div>
          </div>
        </div>
        <div style={{marginTop:'20px',background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',padding:'18px'}}>
          <h3 style={{fontSize:'14px',fontWeight:'700',color:'#0f172a',marginBottom:'10px'}}>Related Calculators</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
            {[{name:'💰 Salary Calculator',href:'/salary-calculator'},{name:'⏰ Overtime',href:'/overtime-calculator'},{name:'🇬🇧 UK Tax',href:'/uk-income-tax-calculator'}].map(c=>(
              <Link key={c.href} href={c.href} style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'8px',padding:'7px 14px',textDecoration:'none',fontSize:'13px',fontWeight:'600',color:'#2563eb'}}>{c.name}</Link>
            ))}
          </div>
        </div>
      </div>
      <SharedFooter/>
    </div>
  )
}
