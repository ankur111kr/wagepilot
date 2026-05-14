import Link from 'next/link'
import { Plane } from 'lucide-react'

const footerLinks = {
  Calculators: [
    { label: 'Salary Calculator', href: '/salary-calculator' },
    { label: 'Paycheck Calculator', href: '/paycheck-calculator' },
    { label: 'Overtime Calculator', href: '/overtime-calculator' },
    { label: 'Contractor Calculator', href: '/contractor-calculator' },
    { label: 'UK Income Tax', href: '/uk-income-tax-calculator' },
    { label: 'Cost of Living', href: '/cost-of-living-calculator' },
  ],
  'Top States': [
    { label: 'California', href: '/california-salary-calculator' },
    { label: 'Texas', href: '/texas-paycheck-calculator' },
    { label: 'New York', href: '/new-york-salary-calculator' },
    { label: 'Florida', href: '/florida-salary-calculator' },
    { label: 'Illinois', href: '/illinois-salary-calculator' },
    { label: 'All 50 States', href: '/states' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Tax Guides', href: '/blog/tax-guides' },
    { label: 'Salary Guides', href: '/blog/salary-guides' },
    { label: 'Overtime Laws', href: '/blog/overtime-laws' },
    { label: 'UK PAYE Guide', href: '/blog/uk-paye' },
    { label: 'FAQ', href: '/faq' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'Sitemap', href: '/sitemap-page' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top: logo + description */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 font-sora text-lg font-bold">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Plane className="h-3.5 w-3.5" />
              </div>
              <span className="gradient-text">WagePilot</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Free, accurate salary and tax calculators for US and UK workers. Updated for the 2025
              tax year.
            </p>
          </div>

          {/* Newsletter */}
          <div className="max-w-sm">
            <p className="mb-2 text-sm font-semibold">Get tax updates in your inbox</p>
            <form className="flex gap-2" action="/api/newsletter" method="POST">
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-1.5 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} WagePilot. All rights reserved.</p>
          <p>
            Tax data sourced from IRS and HMRC. Always consult a qualified tax professional for
            advice.{' '}
            <Link href="/disclaimer" className="underline hover:text-foreground">
              Disclaimer
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
