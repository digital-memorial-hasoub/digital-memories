const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

export const api = {
  victims: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : ''
      return request(`/victims${qs}`)
    },
    get:  (id: string)  => request(`/victims/${id}`),
    map:  ()            => request('/victims/map'),
    onThisDay: ()       => request('/victims/on-this-day'),
  },
  stats: {
    cities: () => request('/stats/cities'),
  },
  testimonials: {
    submit: (victimId: string, body: unknown) =>
      request(`/victims/${victimId}/testimonials`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
}
