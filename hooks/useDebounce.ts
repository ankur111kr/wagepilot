'use client'

import { useState, useEffect } from 'react'

/**
 * Debounce a rapidly-changing value.
 * Useful for deferring expensive recalculations while slider/input is being dragged.
 */
export function useDebounce<T>(value: T, delay: number = 150): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

/**
 * Debounce a callback function.
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 150
): T {
  const [, forceUpdate] = useState(0)
  let timer: ReturnType<typeof setTimeout>

  const debouncedFn = ((...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback(...args)
      forceUpdate(n => n + 1)
    }, delay)
  }) as T

  return debouncedFn
}
