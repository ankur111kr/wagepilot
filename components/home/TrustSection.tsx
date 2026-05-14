import { Shield, RefreshCw, Calculator, Globe } from 'lucide-react'

const stats = [
  { value: '10+', label: 'Free Calculators', icon: Calculator },
  { value: '51', label: 'States & D.C.', icon: Globe },
  { value: '2025', label: 'Tax Year Data', icon: RefreshCw },
  { value: '100%', label: 'Free & Private', icon: Shield },
]

export function TrustSection() {
  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by thousands of US & UK workers every month
        </p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="font-sora text-2xl font-bold">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
