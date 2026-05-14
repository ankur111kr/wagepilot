'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { AdSlotProps } from '@/types'

const slotDimensions: Record<string, { width: number; height: number; label: string }> = {
  leaderboard:    { width: 728, height: 90,  label: 'Advertisement' },
  sidebar:        { width: 300, height: 250, label: 'Advertisement' },
  'in-content':   { width: 468, height: 60,  label: 'Advertisement' },
  'mobile-banner':{ width: 320, height: 50,  label: 'Advertisement' },
}

/**
 * AdSlot component — renders a Google AdSense unit.
 * In development, shows a placeholder box.
 * Replace data-ad-client and data-ad-slot with your real AdSense IDs.
 */
export function AdSlot({ slot, className, adUnitPath }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null)
  const dims = slotDimensions[slot] ?? slotDimensions['in-content']
  const isProd = process.env.NODE_ENV === 'production'
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    if (!isProd || !clientId) return
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [isProd, clientId])

  if (!isProd || !clientId) {
    // Development placeholder
    return (
      <div
        className={cn('ad-container', className)}
        style={{ width: '100%', maxWidth: dims.width, height: dims.height, margin: '0 auto' }}
        aria-label="Advertisement placeholder"
      >
        <span className="text-xs text-muted-foreground/50">
          Ad Slot: {slot} ({dims.width}×{dims.height})
        </span>
      </div>
    )
  }

  return (
    <div className={cn('flex justify-center', className)}>
      <ins
        ref={ref as any}
        className="adsbygoogle"
        style={{ display: 'block', width: dims.width, height: dims.height }}
        data-ad-client={clientId}
        data-ad-slot={adUnitPath || 'YOUR_AD_SLOT_ID'}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
