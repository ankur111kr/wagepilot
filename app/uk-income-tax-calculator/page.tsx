'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SharedNav } from '@/components/layout/SharedNav'
import { SharedFooter } from '@/components/layout/SharedFooter'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
function calcUK(gross:number,region:string,pension:number,studentLoan:string){
  const pa=Math.max(0,gross>100000?12570-Math.floor((gross-pension*gross/100-100000)/2):12570)
  const grossAfter=gross-Math.round(gross*pension/100)
  const taxable=Math.max(0,grossAfter-pa)
  let it=0
  if(region==='scotland'){const b:any=[[2351,.19],[13120,.20],[17622,.21],[31337,.42],[50140,.45],[Infinity,.48]];let r=taxable;for(const[band,rate]of b){if(r<=0)break;it+=Math.min(r,band)*rate;r-=band}}
  else{it=Math.min(taxable,37700)*.20+Math.max(0,Math.min(taxable-37700,87440))*.40+Math.max(0,taxable-125140)*.45}
  let ni=0;if(gross>12570){ni=Math.min(gross-12570,37700)*.08+Math.max(0,gross-50270)*.02}
  const slP:any={plan1:[24990,.09],plan2:[27295,.09],plan4:[31395,.09],plan5:[25000,.09],postgrad:[21000,.06]}
  let sl=0;if(studentLoan!=='none'&&slP[studentLoan]){const[t,r]=slP[studentLoan];sl=Math.max(0,gross-t)*r}
  const pen=Math.round(gross*pension/100)
  const total=Math.round(it)+Math.round(ni)+pen+Math.round(sl)
  const mr=taxable>125140?(region==='scotland'?48:45):taxable>37700?(region==='scotland'?42:40):20
  return{incomeTax:Math.round(it),ni:Math.round(ni),pension:pen,studentLoan:Math.round(sl),net:gross-total,total,effectiveRate:gross>0?(total/gross*100).toFixed(1):'0',marginalRate:mr,personalAllowance:pa,taxableIncome:Math.round(taxable),monthly:Math.round((gross-total)/12),weekly:Math.round((gross-total)/52)}
}
const CC=['#ef4444','#f59e0b','#3b82f6','#8b5cf6','#10b981']
export default function UKPage(){
  const[salary,setSalary]=useState(45000)
  const[region,setRegion]=useState('england')
  const[pension,setPension]=useState(5)
  const[sl,setSl]=useState('none')
  const[r,setR]=useState(calcUK(45000,'england',5,'none'))
  useEffect(()=>{setR(calcUK(salary,region,pension,sl))},[salary,region,pension,sl])
  const chart=[{name:'Income Tax',value:r.incomeTax},{name:'Nat. Insurance',value:r.ni},...(r.pension>0?[{name:'Pension',value:r.pension}]:[]),...(r.studentLoan>0?[{name:'Student Loan',value:r.studentLoan}]:[]),{name:'Net Pay',value:r.net}].filter(d=>d.value>0)
  const inp={width:'100%',border:'1px solid #e2e8f0',borderRadius:'10px',padding:'10px 12px',fontSize:'14px',color:'#0f172a',outline:'none',background:'white',boxSizing:'border-box' as const}
  return(
    <div style={{background:'#f8fafc',minHeight:'100vh',fontFamily:'system-ui,sans-serif'}}>
      <SharedNav/>
      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'32px 20px'}}>
        <nav style={{fontSize:'13px',color:'#94a3b8',marginBottom:'20px'}}>
          <Link href="/" style={{color:'#94a3b8',textDecoration:'none'}}>Home</Link>{' / '}<span style={{color:'#0f172a'}}>UK Income Tax Calculator</span>
        </nav>
        <div style={{marginBottom:'28px'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'#dbeafe',color:'#1d4ed8',padding:'4px 12px',borderRadius:'999px',fontSize:'12px',fontWeight:'700',marginBottom:'10px'}}>🇬🇧 Latest Tax Year</div>
          <h1 style={{fontSize:'clamp(1.6rem,4vw,2.2rem)',fontWeight:'800',color:'#0f172a',margin:'0 0 8px'}}>UK Income Tax Calculator — PAYE</h1>
          <p style={{color:'#64748b',fontSize:'15px',margin:0}}>Calculate take-home pay after PAYE income tax, NI, pension and student loan. Covers England, Scotland, Wales & N. Ireland.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'20px'}}>
          <div style={{background:'white',borderRadius:'16px',border:'1px solid #e2e8f0',padding:'24px'}}>
            <h2 style={{fontSize:'1rem',fontWeight:'700',color:'#0f172a',marginBottom:'20px'}}>Your Details</h2>
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Annual Salary</label>
              <div style={{position:'relative'}}><span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontWeight:'600'}}>£</span>
              <input type="number" value={salary} onChange={e=>setSalary(Number(e.target.value))} min={0} style={{...inp,paddingLeft:'28px'}}/></div>
              <input type="range" min={12571} max={300000} step={500} value={salary} onChange={e=>setSalary(Number(e.target.value))} style={{width:'100%',marginTop:'8px',accentColor:'#3b82f6'}}/>
            </div>
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Region</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'6px'}}>
                {[['england','England'],['scotland','Scotland'],['wales','Wales'],['ni','N. Ireland']].map(([v,l])=>(
                  <button key={v} onClick={()=>setRegion(v)} style={{padding:'8px',borderRadius:'8px',border:`1px solid ${region===v?'#3b82f6':'#e2e8f0'}`,background:region===v?'#eff6ff':'white',color:region===v?'#2563eb':'#64748b',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Pension: {pension}%</label>
              <input type="range" min={0} max={30} step={0.5} value={pension} onChange={e=>setPension(Number(e.target.value))} style={{width:'100%',accentColor:'#3b82f6'}}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:'12px',fontWeight:'700',color:'#64748b',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.04em'}}>Student Loan Plan</label>
              <select value={sl} onChange={e=>setSl(e.target.value)} style={inp}>
                <option value="none">No Student Loan</option>
                <option value="plan1">Plan 1 (threshold £24,990)</option>
                <option value="plan2">Plan 2 (threshold £27,295)</option>
                <option value="plan4">Plan 4 Scotland (£31,395)</option>
                <option value="plan5">Plan 5 (threshold £25,000)</option>
                <option value="postgrad">Postgraduate (£21,000)</option>
              </select>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div style={{background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'16px',padding:'24px',color:'white'}}>
              <p style={{margin:'0 0 4px',fontSize:'12px',opacity:.8,textTransform:'uppercase',letterSpacing:'0.05em'}}>Annual Take-Home Pay</p>
              <p style={{margin:'0 0 4px',fontSize:'2.4rem',fontWeight:'900',lineHeight:1}}>£{r.net.toLocaleString()}</p>
              <p style={{margin:'0 0 8px',fontSize:'13px',opacity:.8}}>£{r.monthly.toLocaleString()}/mo · £{r.weekly.toLocaleString()}/wk</p>
              <p style={{margin:0,fontSize:'12px',opacity:.75}}>Effective: {r.effectiveRate}% · Marginal: {r.marginalRate}% · PA: £{r.personalAllowance.toLocaleString()}</p>
            </div>
            <div style={{background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
              <div style={{padding:'14px 18px',borderBottom:'1px solid #e2e8f0',fontWeight:'700',fontSize:'14px',color:'#0f172a'}}>PAYE Breakdown</div>
              {[{l:'Gross Salary',v:salary},{l:'Income Tax',v:-r.incomeTax},{l:'National Insurance',v:-r.ni},...(r.pension>0?[{l:`Pension (${pension}%)`,v:-r.pension}]:[]),...(r.studentLoan>0?[{l:'Student Loan',v:-r.studentLoan}]:[]),{l:'🎉 Take-Home Pay',v:r.net,h:true}].map((row:any,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'11px 18px',borderBottom:'1px solid #f1f5f9',background:row.h?'#f0fdf4':'white'}}>
                  <span style={{fontSize:'13px',color:row.h?'#166534':'#64748b',fontWeight:row.h?'700':'400'}}>{row.l}</span>
                  <span style={{fontSize:'13px',fontWeight:'700',color:row.h?'#16a34a':row.v<0?'#ef4444':'#0f172a'}}>{row.v<0?`−£${Math.abs(row.v).toLocaleString()}`:`£${row.v.toLocaleString()}`}</span>
                </div>
              ))}
            </div>
            <div style={{height:'180px',background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',padding:'12px'}}>
              <p style={{fontSize:'13px',fontWeight:'700',color:'#0f172a',margin:'0 0 8px'}}>Pay Distribution</p>
              <div style={{height:'140px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={chart} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                    {chart.map((_,i)=><Cell key={i} fill={CC[i]} strokeWidth={0}/>)}
                  </Pie><Tooltip formatter={(v:number)=>[`£${Number(v).toLocaleString()}`,'']} contentStyle={{borderRadius:'8px',border:'1px solid #e2e8f0',fontSize:'12px'}}/>
                  <Legend iconSize={8} formatter={v=><span style={{fontSize:'10px',color:'#64748b'}}>{v}</span>}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div style={{marginTop:'20px',background:'white',borderRadius:'14px',border:'1px solid #e2e8f0',padding:'18px'}}>
          <h3 style={{fontSize:'14px',fontWeight:'700',color:'#0f172a',marginBottom:'10px'}}>Related Calculators</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
            {[{name:'💰 US Salary',href:'/salary-calculator'},{name:'💼 Contractor',href:'/contractor-calculator'},{name:'📊 Compare States',href:'/salary-comparison'}].map(c=>(
              <Link key={c.href} href={c.href} style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'8px',padding:'7px 14px',textDecoration:'none',fontSize:'13px',fontWeight:'600',color:'#2563eb'}}>{c.name}</Link>
            ))}
          </div>
        </div>
      </div>
      <SharedFooter/>
    </div>
  )
}
