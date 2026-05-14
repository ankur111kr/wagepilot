'use client'

import { useState, useEffect } from 'react'
import type { USTaxData, UKTaxData } from '@/types'

/**
 * Hook to load US tax data client-side.
 * Returns { data, loading, error }.
 */
export function useUSTaxData(year: number = 2025) {
  const [data, setData] = useState<USTaxData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const mod = await import(`@/data/tax/us/${year}.json`)
        setData(mod.default as USTaxData)
      } catch {
        // Fallback to 2025
        try {
          const mod = await import('@/data/tax/us/2025.json')
          setData(mod.default as USTaxData)
        } catch (err) {
          setError('Failed to load tax data')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [year])

  return { data, loading, error }
}

/**
 * Hook to load UK tax data client-side.
 */
export function useUKTaxData(year: number = 2025) {
  const [data, setData] = useState<UKTaxData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const mod = await import(`@/data/tax/uk/${year}.json`)
        setData(mod.default as UKTaxData)
      } catch {
        try {
          const mod = await import('@/data/tax/uk/2025.json')
          setData(mod.default as UKTaxData)
        } catch {
          setError('Failed to load UK tax data')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [year])

  return { data, loading, error }
}
