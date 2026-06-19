import { useState, useEffect } from 'react'

interface Elapsed {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function useCountdown(dateString: string): Elapsed {
  const calc = (): Elapsed => {
    const diff  = Date.now() - new Date(dateString).getTime()
    const days    = Math.floor(diff / 86_400_000)
    const hours   = Math.floor((diff % 86_400_000) / 3_600_000)
    const minutes = Math.floor((diff % 3_600_000) / 60_000)
    const seconds = Math.floor((diff % 60_000) / 1_000)
    return { days, hours, minutes, seconds }
  }

  const [elapsed, setElapsed] = useState<Elapsed>(calc)

  useEffect(() => {
    const id = setInterval(() => setElapsed(calc()), 1_000)
    return () => clearInterval(id)
  }, [dateString])

  return elapsed
}
