export type ViolenceType = 'homicide' | 'domestic' | 'shooting' | 'other'
export type VictimStatus = 'draft' | 'published' | 'archived'

export interface Victim {
  id: string
  name_ar: string
  name_he?: string
  name_en?: string
  age: number
  profession?: string
  city: string
  lat: number
  lng: number
  date_of_birth?: string
  date_of_death: string
  violence_type: ViolenceType
  bio_ar?: string
  bio_he?: string
  bio_en?: string
  photo_url?: string
  video_url?: string
  status: VictimStatus
  testimonials?: Testimonial[]
  created_at: string
}

export interface Testimonial {
  id: string
  victim_id: string
  author_name: string
  relation?: string
  content_ar: string
  content_he?: string
  verified: boolean
  created_at: string
}

export interface MapMarker {
  id: string
  name_ar: string
  city: string
  lat: number
  lng: number
  violence_type: ViolenceType
  date_of_death: string
}

export interface CityStats {
  city: string
  lat: number
  lng: number
  count: number
  population?: number
  rate_per_100k?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
