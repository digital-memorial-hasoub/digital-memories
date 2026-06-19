import { supabase } from './supabase'

const BASE = import.meta.env.VITE_API_URL ?? '/api'

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

async function req<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: authHeaders(token),
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any).error ?? `Error ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const adminApi = {
  victims: {
    list:   (token: string, params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params) : ''
      return req(`/victims${qs}`, token)
    },
    get:    (token: string, id: string)   => req(`/victims/${id}`, token),
    create: (token: string, body: unknown) => req('/admin/victims', token, { method: 'POST', body: JSON.stringify(body) }),
    update: (token: string, id: string, body: unknown) => req(`/admin/victims/${id}`, token, { method: 'PUT', body: JSON.stringify(body) }),
    archive:(token: string, id: string)   => req(`/admin/victims/${id}`, token, { method: 'DELETE' }),
  },
  testimonials: {
    list:   (token: string, params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params) : ''
      return req(`/admin/testimonials${qs}`, token)
    },
    approve:(token: string, id: string)   => req(`/admin/testimonials/${id}`, token, { method: 'PATCH', body: JSON.stringify({ verified: true }) }),
    reject: (token: string, id: string)   => req(`/admin/testimonials/${id}`, token, { method: 'PATCH', body: JSON.stringify({ verified: false }) }),
  },
  upload: async (_token: string, file: File): Promise<{ url: string }> => {
    const ext      = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const path     = `photos/${filename}`

    const { error } = await supabase.storage
      .from('victims-media')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (error) throw new Error(error.message)

    const { data } = supabase.storage
      .from('victims-media')
      .getPublicUrl(path)

    return { url: data.publicUrl }
  },
}
