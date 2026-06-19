import { Router } from 'express'
import { validate } from '../middleware/validate'
import { requireAdmin } from '../middleware/auth'
import { prisma } from '../lib/db'

const router = Router()

// All routes below require admin auth
router.use(requireAdmin)

// GET /api/admin/testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const { verified, victim_id, page = '1', limit = '20' } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where: any = {}
    if (verified !== undefined) where.verified = verified === 'true'
    if (victim_id)              where.victim_id = victim_id

    const [data, total] = await Promise.all([
      prisma.testimonial.findMany({
        where, skip, take: parseInt(limit),
        orderBy: { created_at: 'desc' },
        include: { victim: { select: { name_ar: true } } },
      }),
      prisma.testimonial.count({ where }),
    ])
    res.json({ data, total, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/admin/victims (all statuses, for admin panel)
router.get('/victims', async (req, res) => {
  try {
    const { search, city, status, page = '1', limit = '20' } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where: any = {}
    if (status) where.status = status
    if (city)   where.city   = { equals: city, mode: 'insensitive' }
    if (search) where.OR = [
      { name_ar: { contains: search, mode: 'insensitive' } },
      { city:    { contains: search, mode: 'insensitive' } },
    ]

    const [data, total] = await Promise.all([
      prisma.victim.findMany({
        where, skip, take: parseInt(limit),
        orderBy: { created_at: 'desc' },
        select: { id: true, name_ar: true, city: true, age: true, violence_type: true, date_of_death: true, status: true },
      }),
      prisma.victim.count({ where }),
    ])
    res.json({ data, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/admin/victims
router.post('/victims', async (req, res) => {
  try {
    const victim = await prisma.victim.create({ data: req.body })
    res.status(201).json(victim)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/admin/victims/:id
router.put('/victims/:id', async (req, res) => {
  try {
    const victim = await prisma.victim.update({ where: { id: req.params.id }, data: req.body })
    res.json(victim)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/admin/victims/:id
router.delete('/victims/:id', async (req, res) => {
  try {
    await prisma.victim.update({ where: { id: req.params.id }, data: { status: 'archived' } })
    res.json({ message: 'Victim archived' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PATCH /api/admin/testimonials/:id
router.patch('/testimonials/:id', async (req, res) => {
  try {
    const { verified } = req.body
    const t = await prisma.testimonial.update({ where: { id: req.params.id }, data: { verified } })
    res.json(t)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
