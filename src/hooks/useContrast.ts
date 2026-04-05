import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'highContrast'
const DATA_ATTR = 'data-high-contrast'

export function useContrast() {
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  })

  useEffect(() => {
    document.documentElement.setAttribute(DATA_ATTR, String(isHighContrast))
    localStorage.setItem(STORAGE_KEY, String(isHighContrast))
  }, [isHighContrast])

  const toggle = useCallback(() => {
    setIsHighContrast(prev => !prev)
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key === 'c') toggle()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  return { isHighContrast, toggle }
}
