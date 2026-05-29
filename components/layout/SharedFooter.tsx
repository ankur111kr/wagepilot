import Link from 'next/link'

export function SharedFooter() {
  return (
    <footer style={{background:'#020b14',borderTop:'1px solid rgba(255,255,255,0.06)',padding:'40px 20px 24px'}}>
      <div style={{maxWidth:'1000px',margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'24px',marginBottom:'32px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}}>
              <div style={{width:'28px',height:'28px',background:'linear-gradient(135deg,#2563eb,#06b6d4)',borderRadius:'7px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>💰</div>
              <span style={{fontSize:'15px',fontWeight:'800',background:'linear-gradient(90deg,#60a5fa,#22d3ee)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>WagePilot</span>
            </div>
            <p style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',lineHeight:1.7}}>Free salary & tax calculators for US and UK. Updated for latest tax year.</p>
          </div>
          {[
            {title:'Calculators',links:[{n:'Salary Calculator',h:'/salary-calculator'},{n:'Paycheck Calculator',h:'/paycheck-calculator'},{n:'Overtime Calculator',h:'/overtime-calculator'},{n:'Contractor Tax',h:'/contractor-calculator'},{n:'UK Income Tax',h:'/uk-income-tax-calculator'}]},
            {title:'USA Pages',links:[{n:'Texas',h:'/texas-salary-calculator'},{n:'California',h:'/california-salary-calculator'},{n:'New York',h:'/new-york-salary-calculator'},{n:'Florida',h:'/florida-salary-calculator'},{n:'All 50 States',h:'/states'}]},
            {title:'Resources',links:[{n:'Blog',h:'/blog'},{n:'About',h:'/about'},{n:'Contact Us',h:'/contact'},{n:'FAQ',h:'/faq'}]},
            {title:'Legal',links:[{n:'Privacy Policy',h:'/privacy'},{n:'Terms & Conditions',h:'/terms'},{n:'Disclaimer',h:'/disclaimer'}]},
          ].map(col=>(
            <div key={col.title}>
              <h4 style={{fontSize:'11px',fontWeight:'700',color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'10px'}}>{col.title}</h4>
              {col.links.map(l=>(
                <Link key={l.h} href={l.h} style={{display:'block',fontSize:'12px',color:'rgba(255,255,255,0.5)',textDecoration:'none',marginBottom:'5px'}}
                  onMouseEnter={e=>(e.currentTarget.style.color='white')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.5)')}>
                  {l.n}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'16px',display:'flex',flexWrap:'wrap',gap:'10px',justifyContent:'space-between',alignItems:'center'}}>
          <p style={{fontSize:'12px',color:'rgba(255,255,255,0.3)',margin:0}}>© {new Date().getFullYear()} WagePilot. Tax data from IRS & HMRC. Not professional tax advice.</p>
          <div style={{display:'flex',gap:'14px'}}>
            {[{n:'Privacy',h:'/privacy'},{n:'Terms',h:'/terms'},{n:'Disclaimer',h:'/disclaimer'}].map(l=>(
              <Link key={l.h} href={l.h} style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>{l.n}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
