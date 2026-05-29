'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SharedNav } from '@/components/layout/SharedNav'
import { SharedFooter } from '@/components/layout/SharedFooter'
function calc(income:number,debt:number,down:number,rate:number,term:number,tax:number,ins:number){
  const mi=income/12,maxP=mi*0.28,maxD=mi*0.36-debt,maxPay=Math.min(maxP,maxD)
  const mr=rate/100/12,n=term*12
  const lf=mr>0?(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):1/n
  const maxLoan=(maxPay-tax/12-ins/12)/lf,maxHome=maxLoan+down
  const pi=maxLoan*lf,total=pi+tax/12+ins/12,ltv=down>0?(maxLoan/maxHome*100):100,pmi=ltv>80?maxLoan*0.01/12:0
  return{maxHome:Math.round(maxHome),maxLoan:Math.round(maxLoan),pi:Math.round(pi),taxM:Math.round(tax/12),insM:Math.round(ins/12),total:Math.round(total),pmi:Math.round(pmi),totalPMI:Math.round(total+pmi),ltv:Math.round(ltv),needsPMI:ltv>80,dti:((( total+debt)/mi)*100).toFixed(1),fe:((total/mi)*100).toFixed(1),totalPaid:Math.round((total+pmi)*n+down),totalInt:Math.round((total+pmi)*n-maxLoan)}
}
function fmt(n:number){return'$'+Math.abs(n).toLocaleString()}
export default function MortgagePage(){
  const[income,setIncome]=useState(100000);const[debt,setDebt]=useState(500);const[down,setDown]=useState(60000);const[rate,setRate]=useState(6.5);const[term,setTerm]=useState(30);const[tax,setTax]=useState(4000);const[ins,setIns]=useState(1200)
  const[r,setR]=useState(calc(100000,500,60000,6.5,30,4000,1200))
  useEffect(()=>{setR(calc(income,debt,down,rate,term,tax,ins))},[income,debt,down,rate,term,tax,ins])
  const inp={width:'100%',border:'1px solid #e2e8f0',borderRadius:'10px',padding:'10px 12px',fontSize:'14px',color:'#0f172a',outline:'none',background:'white',boxSizing:'border-box' as const}
  return(
    <div style={{background:'#f8fafc',minHeight:'100vh',fontFamily:'system-ui,sans-serif'}}>
      <SharedNav/>
      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'32px 20px'}}>
        <nav style={{fontSize:'13px',color:'#94a3b8',marginBottom:'20px'}}><Link href="/" style={{color:'#94a3b8',textDecoration:'none'}}>Home</Link>{' / '}<span style={{color:'#0f172a'}}>Mortgage Calculator</span></nav>
        <h1 style={{fontSize:'clamp(1.6rem,4vw,2.2rem)',fontWeight:'800',color:'#0f172a',margin:'0 0 8px'}}>🏠 Mortgage Affordability Calculator</h1>
        <p style={{color:'#64748b',fontSize:'15px',marginBottom:'28px'}}>Find out how much house you can afford based on your income, debts, and down payment.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'20px'}}>
          <div style={{background:'white',borderRadius:'16px',border:'1px solid #e2e8f0',padding:'24px'}}>
            <h2 style={{fontSize:'1rem',fontWeight:'700',color:'#0f172a',marginBottom:'20px'}}>Financial Details</h2>
            {[{l:'Annual Income',v:income,s:setIncome,max:1000000},{l:'Monthly Debt Payments',v:debt,s:setDebt,max:10000},{l:'Down Payment',v:down,s:setDown,max:500000}].map(f=>(
              <div key={f.l} style={{marginBottom:'16px'}}>
                <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>{f.l}: {fmt(f.v)}</label>
                <div style={{position:'relative'}}><span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontWeight:'600'}}>$</span>
                <input type="number" value={f.v} onChange={e=>f.s(Number(e.target.value))} min={0} style={{...inp,paddingLeft:'28px'}}/></div>
                <input type="range" min={0} max={f.max} step={f.max/100} value={f.v} onChange={e=>f.s(Number(e.target.value))} style={{width:'100%',marginTop:'6px',accentColor:'#3b82f6'}}/>
              </div>
            ))}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
              <div>
                <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Rate: {rate}%</label>
                <input type="number" value={rate} onChange={e=>setRate(Number(e.target.value))} min={1} max={15} step={0.125} style={inp}/>
                <input type="range" min={2} max={12} step={0.125} value={rate} onChange={e=>setRate(Number(e.target.value))} style={{width:'100%',marginTop:'6px',accentColor:'#3b82f6'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Loan Term</label>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px'}}>
                  {[15,20,25,30].map(t=>(
                    <button key={t} onClick={()=>setTerm(t)} style={{padding:'8px',borderRadius:'8px',border:`1px solid ${term===t?'#3b82f6':'#e2e8f0'}`,background:term===t?'#eff6ff':'white',color:term===t?'#2563eb':'#64748b',fontSize:'12px',fontWeight:'700',cursor:'pointer'}}>{t}yr</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
              <div><label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Annual Tax</label>
              <div style={{position:'relative'}}><span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontWeight:'600'}}>$</span><input type="number" value={tax} onChange={e=>setTax(Number(e.target.value))} min={0} style={{...inp,paddingLeft:'28px'}}/></div></div>
              <div><label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Annual Insurance</label>
              <div style={{position:'relative'}}><span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontWeight:'600'}}>$</span><input type="number" value={ins} onChange={e=>setIns(Number(e.target.value))} min={0} style={{...inp,paddingLeft:'28px'}}/></div></div>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div style={{background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'16px',padding:'24px',color:'white'}}>
              <p style={{margin:'0 0 4px',fontSize:'12px',opacity:.8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Max Home Price You Can Afford</p>
              <p style={{margin:'0 0 4px',fontSize:'2.4rem',fontWeight:'900',lineHeight:1}}>{fmt(r.maxHome)}</p>
              <p style={{margin:0,fontSize:'13px',opacity:.8}}>Loan: {fmt(r.maxLoan)} · Down: {fmt(down)}</p>
            </div>
            <div style={{background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
              <div style={{padding:'14px 18px',borderBottom:'1px solid #e2e8f0',fontWeight:'700',fontSize:'14px',color:'#0f172a'}}>Monthly Payment</div>
              {[{l:'Principal & Interest',v:r.pi},{l:'Property Tax',v:r.taxM},{l:'Insurance',v:r.insM},...(r.needsPMI?[{l:'PMI (LTV>80%)',v:r.pmi,w:true}]:[]),{l:'🏠 Total Monthly',v:r.totalPMI,h:true}].map((row:any,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'11px 18px',borderBottom:'1px solid #f1f5f9',background:row.h?'#f0fdf4':row.w?'#fffbeb':'white'}}>
                  <span style={{fontSize:'13px',color:row.h?'#166534':row.w?'#92400e':'#64748b',fontWeight:row.h?'700':'400'}}>{row.l}</span>
                  <span style={{fontSize:'13px',fontWeight:'700',color:row.h?'#16a34a':row.w?'#d97706':'#0f172a'}}>{fmt(row.v)}/mo</span>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              {[{l:'Front-End DTI',v:r.fe+'%',c:Number(r.fe)<=28?'#10b981':'#ef4444'},{l:'Back-End DTI',v:r.dti+'%',c:Number(r.dti)<=36?'#10b981':'#ef4444'},{l:'LTV Ratio',v:r.ltv+'%',c:r.needsPMI?'#f59e0b':'#10b981'},{l:'Total Cost',v:fmt(r.totalPaid),c:'#64748b'}].map(c=>(
                <div key={c.l} style={{background:'white',borderRadius:'10px',border:'1px solid #e2e8f0',padding:'12px'}}>
                  <div style={{fontSize:'10px',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:'4px'}}>{c.l}</div>
                  <div style={{fontSize:'1.2rem',fontWeight:'900',color:c.c}}>{c.v}</div>
                </div>
              ))}
            </div>
            {r.needsPMI&&<div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'10px',padding:'12px'}}>
              <p style={{fontSize:'13px',color:'#92400e',margin:0}}>⚠️ Down payment &lt;20%. PMI of {fmt(r.pmi)}/mo added until you reach 20% equity.</p>
            </div>}
          </div>
        </div>
        <div style={{marginTop:'20px',background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',padding:'18px'}}>
          <h3 style={{fontSize:'14px',fontWeight:'700',color:'#0f172a',marginBottom:'10px'}}>Related Calculators</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
            {[{name:'💰 Salary Calculator',href:'/salary-calculator'},{name:'🐷 Savings Calculator',href:'/savings-calculator'},{name:'📊 Salary Comparison',href:'/salary-comparison'}].map(c=>(
              <Link key={c.href} href={c.href} style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'8px',padding:'7px 14px',textDecoration:'none',fontSize:'13px',fontWeight:'600',color:'#2563eb'}}>{c.name}</Link>
            ))}
          </div>
        </div>
      </div>
      <SharedFooter/>
    </div>
  )
}
