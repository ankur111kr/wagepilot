import Link from 'next/link'
import { SharedNav } from '@/components/layout/SharedNav'
import { SharedFooter } from '@/components/layout/SharedFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | WagePilot',
  description: 'WagePilot privacy policy — how we handle your data and protect your privacy.',
}

export default function PrivacyPage() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <SharedNav />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
          {' / '}
          <span style={{ color: '#0f172a' }}>Privacy Policy</span>
        </nav>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', borderRadius: '16px', padding: '32px', color: 'white', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: '800', margin: '0 0 8px' }}>Privacy Policy</h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '14px' }}>Last updated: May 2025 &nbsp;·&nbsp; Effective immediately</p>
        </div>

        {/* Content */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', lineHeight: 1.8 }}>

          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '28px', padding: '16px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
            <strong style={{ color: '#166534' }}>🎉 Short version:</strong> WagePilot does <strong>not</strong> collect, store, or share your personal financial data. All salary calculations happen entirely in your browser.
          </p>

          {[
            {
              title: '1. Information We Collect',
              content: `We collect minimal information to operate our service:
              
<strong>a) Automatically Collected Data</strong>
When you visit WagePilot, we may automatically collect:
• Browser type and version
• Pages visited and time spent
• Referring website
• General geographic region (country/region level only)
• Device type (desktop/mobile)

This data is collected via standard web analytics tools and is used only in aggregated, anonymous form to improve our calculators and user experience.

<strong>b) Newsletter Subscribers</strong>
If you choose to subscribe to our newsletter, we collect your email address. This is voluntary and you may unsubscribe at any time.

<strong>c) Contact Form</strong>
If you contact us, we collect your name, email address, and message content to respond to your enquiry.

<strong>d) What We Do NOT Collect</strong>
• Your salary or income information
• Your tax details or financial data
• Credit card or payment information
• Social Security numbers or national insurance numbers
• Any personally identifiable financial data`
            },
            {
              title: '2. How We Use Your Information',
              content: `We use the limited information we collect to:
• Improve and maintain our calculators and website
• Respond to your enquiries and support requests
• Send newsletter updates (only if you subscribed)
• Analyse traffic patterns to enhance user experience
• Comply with legal obligations

We do <strong>not</strong> sell, rent, or share your information with third parties for marketing purposes.`
            },
            {
              title: '3. Calculator Data — Your Privacy',
              content: `<strong>All calculations are performed entirely in your browser (client-side).</strong>

This means:
• Your salary figures are never transmitted to our servers
• We cannot see what numbers you enter
• No financial data is stored in any database
• Clearing your browser cache removes all locally stored data

We designed WagePilot this way intentionally to protect your financial privacy.`
            },
            {
              title: '4. Cookies',
              content: `We use minimal cookies:

<strong>Essential Cookies</strong> — Required for the website to function (e.g., remembering your country preference).

<strong>Analytics Cookies</strong> — Anonymous usage data to improve our service. You can opt out via your browser settings.

We do not use advertising cookies or third-party tracking pixels.`
            },
            {
              title: '5. Third-Party Services',
              content: `We may use the following third-party services:

• <strong>Vercel</strong> — Website hosting. See Vercel's privacy policy at vercel.com/legal/privacy-policy
• <strong>Supabase</strong> — Database for newsletter and contact form data. See supabase.com/privacy
• <strong>Google Analytics</strong> — Anonymous usage statistics (if enabled)

Each third-party service has its own privacy policy. We encourage you to review them.`
            },
            {
              title: '6. Data Retention',
              content: `• Newsletter email addresses: Retained until you unsubscribe
• Contact form messages: Retained for up to 2 years for support purposes
• Analytics data: Anonymised and aggregated — retained indefinitely
• Calculator inputs: Never stored — only processed locally in your browser`
            },
            {
              title: '7. Your Rights',
              content: `Depending on your location, you may have the right to:

• <strong>Access</strong> — Request a copy of data we hold about you
• <strong>Deletion</strong> — Request deletion of your personal data
• <strong>Correction</strong> — Request correction of inaccurate data
• <strong>Unsubscribe</strong> — Opt out of newsletter communications at any time
• <strong>Objection</strong> — Object to processing of your data

To exercise any of these rights, contact us at the address below.`
            },
            {
              title: '8. Children\'s Privacy',
              content: `WagePilot is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.`
            },
            {
              title: '9. Changes to This Policy',
              content: `We may update this Privacy Policy from time to time. We will notify newsletter subscribers of significant changes. The "Last Updated" date at the top of this page reflects the most recent revision.

Continued use of WagePilot after changes constitutes acceptance of the updated policy.`
            },
            {
              title: '10. Contact Us',
              content: `If you have questions about this Privacy Policy or your data, please contact us:

<strong>WagePilot</strong>
Website: wagepilot.vercel.app
Contact: <a href="/contact" style="color:#2563eb">wagepilot.vercel.app/contact</a>

We aim to respond to all privacy enquiries within 5 business days.`
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 12px', paddingBottom: '8px', borderBottom: '2px solid #f1f5f9' }}>{section.title}</h2>
              <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>').replace(/•/g, '&nbsp;&nbsp;•') }}/>
            </div>
          ))}
        </div>

        {/* Related links */}
        <div style={{ marginTop: '24px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Related Legal Pages</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[{ name: '📋 Terms & Conditions', href: '/terms' }, { name: '⚠️ Disclaimer', href: '/disclaimer' }, { name: '📞 Contact Us', href: '/contact' }].map(l => (
              <Link key={l.href} href={l.href} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '7px 14px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', color: '#2563eb' }}>{l.name}</Link>
            ))}
          </div>
        </div>
      </div>

      <SharedFooter />
    </div>
  )
}
