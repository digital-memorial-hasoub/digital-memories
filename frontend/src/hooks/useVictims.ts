import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { Victim, PaginatedResponse } from '../types'

export function useVictims(params?: Record<string, string>) {
  const [data, setData]       = useState<PaginatedResponse<Victim> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    api.victims.list(params)
      .then((res) => { setData(res as PaginatedResponse<Victim>); setError(null) })
      .catch((err: Error) => setError(err))
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])

  return { data, loading, error }
}

export function useVictim(id: string) {
  const [data, setData]       = useState<Victim | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<Error | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.victims.get(id)
      .then((res) => { setData(res as Victim); setError(null) })
      .catch((err: Error) => setError(err))
      .finally(() => setLoading(false))
  }, [id])

  return { data, loading, error }
}
