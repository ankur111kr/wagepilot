import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://wagepilot.vercel.app'),
  title: {
    default: 'WagePilot – Salary, Paycheck & Tax Calculator for USA & UK',
    template: '%s | WagePilot',
  },
  description: 'Free professional salary, paycheck, overtime, and tax calculators for USA and UK. Calculate your take-home pay instantly with up-to-date tax data.',
  keywords: ['salary calculator', 'paycheck calculator', 'take home pay', 'tax calculator', 'overtime calculator', 'uk income tax', 'us federal tax'],
  authors: [{ name: 'WagePilot' }],
  openGraph: {
    type: 'website',
    siteName: 'WagePilot',
    title: 'WagePilot – Salary & Tax Calculator',
    description: 'Calculate your take-home pay instantly for USA & UK.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WagePilot – Salary & Tax Calculator',
    description: 'Calculate your take-home pay instantly.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
