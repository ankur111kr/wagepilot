import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://wagepilot.vercel.app'),
  title: {
    default: 'WagePilot – Salary, Paycheck & Tax Calculator for USA & UK',
    template: '%s | WagePilot',
  },
  description:
    'Free professional salary, paycheck, overtime, and tax calculators for USA and UK. Calculate your take-home pay instantly with up-to-date 2025 tax data.',
  keywords: ['salary calculator', 'paycheck calculator', 'take home pay', 'tax calculator', 'overtime calculator', 'uk income tax', 'us federal tax'],
  authors: [{ name: 'WagePilot' }],
  creator: 'WagePilot',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wagepilot.vercel.app',
    siteName: 'WagePilot',
    title: 'WagePilot – Salary, Paycheck & Tax Calculator',
    description: 'Calculate your take-home pay instantly with 2025 tax data for USA & UK.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'WagePilot' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WagePilot – Salary & Tax Calculator',
    description: 'Calculate your take-home pay instantly.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${inter.variable} font-inter antialiased`}>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
