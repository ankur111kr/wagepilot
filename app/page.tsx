export default function HomePage() {
  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', color: '#2563eb' }}>
        ✈️ WagePilot
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '16px' }}>
        Free Salary & Tax Calculators for USA & UK
      </p>
      <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/salary-calculator" style={{ background: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Salary Calculator
        </a>
        <a href="/uk-income-tax-calculator" style={{ background: '#059669', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          UK Income Tax
        </a>
        <a href="/overtime-calculator" style={{ background: '#d97706', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Overtime Calculator
        </a>
      </div>
    </div>
  )
}
