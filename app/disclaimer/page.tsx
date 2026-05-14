import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer | WagePilot',
  description: 'Financial disclaimer for WagePilot salary and tax calculators.',
}

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 font-sora text-3xl font-bold">Disclaimer</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: January 1, 2025</p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 not-prose mb-8">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
            WagePilot calculators provide estimates for informational purposes only. They do not
            constitute tax, financial, or legal advice. Always consult a qualified tax professional
            or accountant for advice specific to your situation.
          </p>
        </div>

        <h2>No Professional Advice</h2>
        <p>
          The information and calculators provided on WagePilot are for general educational and
          informational purposes only. Nothing on this website constitutes tax advice, financial
          advice, legal advice, or any other professional advice. Use of this website does not
          create a client relationship of any kind.
        </p>

        <h2>Accuracy of Calculations</h2>
        <p>
          While we strive to keep our tax data up to date with IRS and HMRC published rates,
          WagePilot makes no warranty, express or implied, about the accuracy, completeness,
          or fitness for purpose of our calculator results. Tax laws change frequently and may
          not be immediately reflected in our tools.
        </p>
        <p>Our calculations do not account for:</p>
        <ul>
          <li>Tax credits (EITC, Child Tax Credit, etc.) unless explicitly noted</li>
          <li>Itemized deductions beyond the standard deduction</li>
          <li>Alternative Minimum Tax (AMT)</li>
          <li>Multiple income sources or complex financial situations</li>
          <li>Local/city income taxes</li>
          <li>Year-to-date FICA withholding caps already met</li>
        </ul>

        <h2>Use at Your Own Risk</h2>
        <p>
          You use WagePilot at your own risk. In no event shall WagePilot, its operators, or
          contributors be liable for any damages arising from your use of this website or reliance
          on any information provided.
        </p>

        <h2>External Links</h2>
        <p>
          WagePilot may link to third-party websites for reference. We are not responsible for
          the content or accuracy of linked sites.
        </p>

        <h2>Affiliate Disclosure</h2>
        <p>
          WagePilot may display advertising (Google AdSense) and may use affiliate links where
          indicated. We only recommend services we believe provide genuine value. Sponsored
          content is always clearly labeled.
        </p>
      </div>
    </div>
  )
}
