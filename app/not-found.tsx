import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 font-sora text-8xl font-bold text-primary/20">404</div>
      <h1 className="font-sora text-2xl font-bold">Page not found</h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
        <Link
          href="/calculators"
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent transition-colors"
        >
          Browse Calculators
        </Link>
      </div>

      {/* Helpful links */}
      <div className="mt-10">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Popular calculators:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: 'Salary Calculator', href: '/salary-calculator' },
            { label: 'UK Income Tax', href: '/uk-income-tax-calculator' },
            { label: 'Overtime Calculator', href: '/overtime-calculator' },
            { label: 'Contractor Tax', href: '/contractor-calculator' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
