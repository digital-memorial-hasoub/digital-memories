import { prisma } from '../lib/db'
import type { ViolenceType, VictimStatus, Prisma } from '@prisma/client'

export interface VictimFilters {
  search?:  string
  city?:    string
  year?:    string
  type?:    ViolenceType
  status?:  VictimStatus
  page?:    number
  limit?:   number
}

export async function listVictims(filters: VictimFilters) {
  const { search, city, year, type, status = 'published', page = 1, limit = 20 } = filters
  const skip = (page - 1) * limit

  const where: Prisma.VictimWhereInput = { status }

  if (search) {
    where.OR = [
      { name_ar: { contains: search, mode: 'insensitive' } },
      { name_he: { contains: search, mode: 'insensitive' } },
      { city:    { contains: search, mode: 'insensitive' } },
    ]
  }
  if (city) where.city          = { equals: city, mode: 'insensitive' }
  if (type) where.violence_type = type
  if (year) {
    const y = parseInt(year)
    where.date_of_death = {
      gte: new Date(`${y}-01-01`),
      lt:  new Date(`${y + 1}-01-01`),
    }
  }

  const [data, total] = await Promise.all([
    prisma.victim.findMany({ where, skip, take: limit, orderBy: { date_of_death: 'desc' }, include: { testimonials: { where: { verified: true } } } }),
    prisma.victim.count({ where }),
  ])

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getVictimById(id: string) {
  return prisma.victim.findUnique({
    where: { id },
    include: { testimonials: { where: { verified: true }, orderBy: { created_at: 'desc' } } },
  })
}

export async function getMapMarkers() {
  return prisma.victim.findMany({
    where:  { status: 'published' },
    select: { id: true, name_ar: true, city: true, lat: true, lng: true, violence_type: true, date_of_death: true },
  })
}

export async function getOnThisDay() {
  const today = new Date()
  const month = today.getMonth() + 1
  const day   = today.getDate()

  // Fetch all published victims and filter by calendar date
  const all = await prisma.victim.findMany({
    where:  { status: 'published' },
    select: { id: true, name_ar: true, age: true, city: true, violence_type: true, date_of_death: true, photo_url: true },
  })

  return all.filter(v => {
    const d = new Date(v.date_of_death)
    return d.getMonth() + 1 === month && d.getDate() === day
  })
}

export async function getCityStats() {
  const CITY_POP: Record<string, number> = {
    'أم الفحم': 55000, 'باقة الغربية': 35000, 'الناصرة': 77000,
    'شفاعمرو': 37000, 'رهط': 70000, 'طمرة': 32000, 'كفر قاسم': 23000,
    'عكا': 48000, 'الطيبة': 44000, 'كفر كنا': 22000, 'تل شيفع': 6000,
    'المغار': 28000, 'جلجولية': 20000,
  }

  const grouped = await prisma.victim.groupBy({
    by:     ['city'],
    where:  { status: 'published' },
    _count: { id: true },
  })

  // Get one lat/lng per city
  const cityCoords = await Promise.all(
    grouped.map(g => prisma.victim.findFirst({
      where:  { city: g.city, status: 'published' },
      select: { city: true, lat: true, lng: true },
    }))
  )
  const coordMap = Object.fromEntries(cityCoords.filter(Boolean).map(c => [c!.city, { lat: c!.lat, lng: c!.lng }]))

  return grouped.map(g => {
    const count = g._count.id
    const pop   = CITY_POP[g.city]
    return {
      city:           g.city,
      lat:            coordMap[g.city]?.lat ?? 32.0,
      lng:            coordMap[g.city]?.lng ?? 35.0,
      count,
      population:     pop,
      rate_per_100k:  pop ? (count / pop) * 100000 : null,
    }
  })
}
