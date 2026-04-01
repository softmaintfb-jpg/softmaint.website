'use client'

import { useEffect } from 'react'

export function ErrorHandler() {
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (
        e.error instanceof DOMException &&
        e.error.name === 'DataCloneError' &&
        e.message &&
        e.message.includes('PerformanceServerTiming')
      ) {
        e.stopImmediatePropagation()
        e.preventDefault()
      }
    }

    window.addEventListener('error', handleError, true)
    return () => window.removeEventListener('error', handleError, true)
  }, [])

  return null
}
