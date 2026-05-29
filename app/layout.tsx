import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://wagepilot.vercel.app'),
  title: {default:'WagePilot – Salary & Tax Calculator for USA & UK',template:'%s | WagePilot'},
  description:'Free professional salary, paycheck, overtime and tax calculators for USA and UK. Calculate take-home pay instantly.',
  robots:{index:true,follow:true},
}
export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body style={{margin:0,padding:0,fontFamily:"'Inter',system-ui,sans-serif"}}>
        {children}
      </body>
    </html>
  )
}
