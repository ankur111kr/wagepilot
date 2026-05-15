import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | WagePilot',
  description: 'Terms of service for WagePilot salary and tax calculator platform.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 font-sora text-3xl font-bold">Terms of Service</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: January 1, 2025</p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using WagePilot ("the Service"), you agree to be bound by these Terms
          of Service. If you do not agree, please do not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          WagePilot provides free salary, paycheck, tax, and financial calculators for
          informational and educational purposes. The Service is provided "as is" and we make
          no guarantees of accuracy, completeness, or fitness for any particular purpose.
        </p>

        <h2>3. No Professional Advice</h2>
        <p>
          WagePilot does not provide tax, legal, financial, or investment advice. All calculator
          results are estimates for informational purposes only. See our full{' '}
          <a href="/disclaimer">Disclaimer</a>.
        </p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose</li>
          <li>Attempt to scrape, copy, or reproduce our calculators or content at scale</li>
          <li>Interfere with or disrupt the Service's operation</li>
          <li>Attempt to gain unauthorized access to any part of the Service</li>
          <li>Use automated tools to make excessive requests to our servers</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <p>
          All content, design, code, and trademarks on WagePilot are owned by WagePilot or its
          licensors. You may not reproduce, distribute, or create derivative works without
          written permission. Tax rates and brackets are public domain information.
        </p>

        <h2>6. Advertising</h2>
        <p>
          WagePilot displays advertising through Google AdSense. Advertisers do not influence
          our calculator results or editorial content. We are not responsible for third-party
          advertiser content.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, WagePilot shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages arising from your
          use of the Service or reliance on any information provided.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the Service
          after changes constitutes acceptance of the new terms.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These terms are governed by the laws of the jurisdiction in which WagePilot operates,
          without regard to conflict of law principles.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about these terms? Email us at{' '}
          <a href="mailto:legal@wagepilot.com">legal@wagepilot.com</a>.
        </p>
      </div>
    </div>
  )
}
