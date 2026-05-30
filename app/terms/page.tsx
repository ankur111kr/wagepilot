import Link from 'next/link'
import { SharedNav } from '@/components/layout/SharedNav'
import { SharedFooter } from '@/components/layout/SharedFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | WagePilot',
  description: 'WagePilot terms and conditions of use for our salary and tax calculator tools.',
}

export default function TermsPage() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <SharedNav />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 20px' }}>
        <nav style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>{' / '}
          <span style={{ color: '#0f172a' }}>Terms & Conditions</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', borderRadius: '16px', padding: '32px', color: 'white', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: '800', margin: '0 0 8px' }}>Terms & Conditions</h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '14px' }}>Last updated: May 2025 &nbsp;·&nbsp; Please read carefully</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', lineHeight: 1.8 }}>

          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '28px', padding: '16px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
            <strong style={{ color: '#92400e' }}>⚠️ Important:</strong> By using WagePilot, you agree to these terms. Our calculators provide <strong>estimates only</strong> — not professional tax or financial advice.
          </p>

          {[
            {
              title: '1. Acceptance of Terms',
              content: `By accessing or using WagePilot ("the Service", "we", "us"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.

These terms apply to all visitors, users, and others who access or use the Service.`
            },
            {
              title: '2. Description of Service',
              content: `WagePilot provides free online salary and tax calculators for informational purposes. Our tools include:

• US Salary Calculator (all 50 states + DC)
• UK Income Tax Calculator (PAYE)
• Overtime Pay Calculator
• Contractor Tax Calculator
• Hourly to Salary Converter
• Take-Home Pay Calculator
• Mortgage Affordability Calculator
• Savings & Compound Interest Calculator
• Salary Comparison Tool

All calculators are provided free of charge without registration.`
            },
            {
              title: '3. Accuracy of Information',
              content: `<strong>IMPORTANT DISCLAIMER REGARDING ACCURACY:</strong>

While we strive to provide accurate and up-to-date tax calculations, WagePilot:

• Makes no warranty that calculator results are accurate, complete, or current
• Updates tax rates periodically but cannot guarantee real-time accuracy
• Cannot account for all individual tax situations, deductions, or credits
• Does not consider state-specific local taxes, AMT, or other special circumstances

Calculator results are <strong>estimates only</strong> and should not be used for:
• Filing tax returns
• Making major financial decisions
• Replacing advice from a qualified tax professional or financial advisor

Always consult a qualified professional for your specific tax situation.`
            },
            {
              title: '4. Not Professional Advice',
              content: `WagePilot is an informational tool only. Nothing on this website constitutes:

• Professional tax advice
• Financial planning advice
• Legal advice
• Accounting advice

We strongly recommend consulting a Certified Public Accountant (CPA), tax professional, or financial advisor for personalised guidance on your tax and financial situation.

WagePilot, its owners, and contributors are not responsible for any decisions made based on our calculator results.`
            },
            {
              title: '5. Intellectual Property',
              content: `All content on WagePilot, including but not limited to text, graphics, logos, calculator code, and design, is the property of WagePilot and is protected by copyright and intellectual property laws.

You may:
• Use the calculators for personal, non-commercial purposes
• Share links to our calculators

You may NOT:
• Copy, reproduce, or redistribute our calculator code
• Create derivative works based on our calculators
• Use our content for commercial purposes without written permission
• Scrape or bulk-download our data`
            },
            {
              title: '6. Limitation of Liability',
              content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, WAGEPILOT SHALL NOT BE LIABLE FOR:

• Any inaccuracies in tax calculations
• Financial losses resulting from use of our calculators
• Tax penalties or interest resulting from reliance on our estimates
• Any indirect, incidental, special, or consequential damages
• Loss of data, profits, or business opportunities

IN NO EVENT SHALL WAGEPILOT'S TOTAL LIABILITY EXCEED £100 (ONE HUNDRED POUNDS STERLING) OR THE EQUIVALENT IN YOUR LOCAL CURRENCY.`
            },
            {
              title: '7. User Conduct',
              content: `When using WagePilot, you agree not to:

• Use the service for any unlawful purpose
• Attempt to gain unauthorised access to our systems
• Upload malicious code or attempt to disrupt the service
• Use automated tools to scrape or download data in bulk
• Misrepresent your identity or affiliation
• Violate any applicable laws or regulations`
            },
            {
              title: '8. Third-Party Links',
              content: `WagePilot may contain links to third-party websites for informational purposes. We have no control over the content, privacy policies, or practices of third-party sites and accept no responsibility for them.

We recommend reviewing the terms and privacy policies of any third-party sites you visit.`
            },
            {
              title: '9. Modifications to Service',
              content: `We reserve the right to:

• Modify, suspend, or discontinue any part of the service at any time
• Update these Terms and Conditions
• Change tax data or calculator functionality

We will provide reasonable notice of significant changes where possible. Continued use of the service after changes constitutes acceptance.`
            },
            {
              title: '10. Governing Law',
              content: `These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising from use of WagePilot shall be subject to the exclusive jurisdiction of the courts of England and Wales.

If you are accessing WagePilot from the United States or another jurisdiction, you are responsible for compliance with local laws.`
            },
            {
              title: '11. Contact',
              content: `For questions about these Terms and Conditions:

<strong>WagePilot</strong>
Website: wagepilot.vercel.app
Contact form: <a href="/contact" style="color:#2563eb">wagepilot.vercel.app/contact</a>`
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 12px', paddingBottom: '8px', borderBottom: '2px solid #f1f5f9' }}>{section.title}</h2>
              <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>').replace(/•/g, '&nbsp;&nbsp;•') }}/>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Related Legal Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[{ name: '🔒 Privacy Policy', href: '/privacy' }, { name: '⚠️ Disclaimer', href: '/disclaimer' }, { name: '📞 Contact Us', href: '/contact' }].map(l => (
              <Link key={l.href} href={l.href} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '7px 14px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', color: '#2563eb' }}>{l.name}</Link>
            ))}
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  )
}
