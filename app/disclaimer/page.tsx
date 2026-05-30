import Link from 'next/link'
import { SharedNav } from '@/components/layout/SharedNav'
import { SharedFooter } from '@/components/layout/SharedFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer | WagePilot',
  description: 'WagePilot disclaimer — our salary and tax calculators provide estimates only, not professional advice.',
}

export default function DisclaimerPage() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <SharedNav />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 20px' }}>
        <nav style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>{' / '}
          <span style={{ color: '#0f172a' }}>Disclaimer</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', borderRadius: '16px', padding: '32px', color: 'white', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: '800', margin: '0 0 8px' }}>Disclaimer</h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Last updated: May 2025 &nbsp;·&nbsp; Please read before using our calculators</p>
        </div>

        {/* Key warning box */}
        <div style={{ background: '#fef2f2', border: '2px solid #fecaca', borderRadius: '14px', padding: '24px', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '800', color: '#dc2626', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚠️ Important Notice
          </h2>
          <p style={{ fontSize: '14px', color: '#7f1d1d', margin: '0 0 10px', lineHeight: 1.7 }}>
            WagePilot calculators provide <strong>estimates only</strong> for general informational purposes. Results should <strong>NOT</strong> be used as a substitute for professional tax advice, financial planning, or official tax filings.
          </p>
          <p style={{ fontSize: '14px', color: '#7f1d1d', margin: 0, lineHeight: 1.7 }}>
            Always consult a qualified tax professional, CPA, or financial advisor for your specific situation.
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', lineHeight: 1.8 }}>
          {[
            {
              title: '1. Estimates Only — Not Exact Figures',
              icon: '📊',
              content: `All calculations provided by WagePilot are <strong>approximations and estimates</strong>. Actual tax liabilities and take-home pay may differ due to:

• Individual deductions, credits, and allowances not captured by our calculators
• Local city or county taxes (e.g., New York City tax)
• Multiple income sources or irregular earnings
• Changes in tax law occurring after our last update
• Pension contributions, employee benefits, or salary sacrifice arrangements
• Alternative Minimum Tax (AMT) in the US
• Scottish income tax variations
• National Insurance category differences in the UK

Our calculators use the most commonly applicable tax rules for standard employment situations.`
            },
            {
              title: '2. Not Professional Tax or Financial Advice',
              icon: '🏛️',
              content: `<strong>WagePilot is not a tax advisory service.</strong>

Nothing on this website should be construed as:
• Professional tax advice
• Financial planning recommendations
• Legal advice
• Accountancy services

WagePilot's content and tools are provided for <strong>general educational and informational purposes only</strong>. For personalised tax advice, please consult:

• A Certified Public Accountant (CPA) — for US tax matters
• A Chartered Accountant (CA) or tax adviser — for UK tax matters
• An IRS Enrolled Agent — for US federal tax issues
• HMRC resources — for official UK tax guidance (gov.uk/tax)`
            },
            {
              title: '3. Tax Data Currency',
              icon: '📅',
              content: `We make reasonable efforts to keep our tax data current, however:

• Tax laws change frequently — sometimes mid-year
• There may be a delay between law changes and our updates
• Some jurisdictions have complex rules that our simplified calculators cannot fully replicate

<strong>US Tax Data:</strong> Based on IRS published tax brackets and rates. Updated annually following IRS Revenue Procedure announcements.

<strong>UK Tax Data:</strong> Based on HMRC published rates and thresholds. Updated following the annual Budget Statement.

Always verify current rates with the IRS (irs.gov) or HMRC (gov.uk/government/organisations/hm-revenue-customs) before making financial decisions.`
            },
            {
              title: '4. No Warranty',
              icon: '🛡️',
              content: `WagePilot is provided on an <strong>"as is" and "as available" basis</strong> without any warranties, express or implied, including but not limited to:

• Warranties of merchantability
• Fitness for a particular purpose
• Accuracy or reliability of results
• Uninterrupted or error-free operation

We do not warrant that the calculators will meet your specific requirements or that errors will be corrected.`
            },
            {
              title: '5. Limitation of Liability',
              icon: '⚖️',
              content: `WagePilot, its operators, and contributors shall not be liable for any:

• Errors or inaccuracies in tax calculations
• Tax penalties, interest, or fines incurred
• Financial losses resulting from reliance on our estimates
• Decisions made based on calculator results
• Indirect or consequential losses of any kind

By using WagePilot, you accept full responsibility for any decisions made based on our calculator outputs.`
            },
            {
              title: '6. Third-Party Information',
              icon: '🔗',
              content: `WagePilot may reference or link to third-party sources including:
• IRS publications and official guidance
• HMRC tax tables and thresholds
• State tax authority information

We are not responsible for the accuracy, completeness, or currency of third-party information. External links are provided for convenience only.`
            },
            {
              title: '7. Seek Professional Advice',
              icon: '👨‍💼',
              content: `We strongly encourage all users to seek professional advice before making financial decisions, especially for:

• <strong>Complex tax situations</strong> — multiple jobs, self-employment, investments
• <strong>Life changes</strong> — marriage, divorce, new baby, inheritance
• <strong>High income earners</strong> — additional rate taxpayers, AMT considerations
• <strong>Business owners</strong> — S-Corp, LLC, sole trader decisions
• <strong>Retirement planning</strong> — 401(k), IRA, pension decisions
• <strong>International situations</strong> — working across borders, foreign income

Free resources:
• <strong>US:</strong> IRS Free File (irs.gov/freefile), VITA tax assistance
• <strong>UK:</strong> HMRC online tools (tax.service.gov.uk), Citizens Advice`
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 12px', paddingBottom: '8px', borderBottom: '2px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{section.icon}</span> {section.title}
              </h2>
              <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>').replace(/•/g, '&nbsp;&nbsp;•') }}/>
            </div>
          ))}

          {/* Final notice */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px', marginTop: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#166534', margin: '0 0 8px' }}>✅ Our Commitment to You</h3>
            <p style={{ fontSize: '13px', color: '#15803d', margin: 0, lineHeight: 1.7 }}>
              While WagePilot calculators are estimates, we are committed to providing the most accurate and up-to-date tax data possible. We update our calculators regularly to reflect the latest IRS and HMRC rates. If you notice an error or outdated information, please <Link href="/contact" style={{ color: '#15803d', fontWeight: '700' }}>contact us</Link> — we appreciate the feedback!
            </p>
          </div>
        </div>

        <div style={{ marginTop: '24px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Related Legal Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[{ name: '🔒 Privacy Policy', href: '/privacy' }, { name: '📋 Terms & Conditions', href: '/terms' }, { name: '📞 Contact Us', href: '/contact' }].map(l => (
              <Link key={l.href} href={l.href} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '7px 14px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', color: '#2563eb' }}>{l.name}</Link>
            ))}
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  )
}
