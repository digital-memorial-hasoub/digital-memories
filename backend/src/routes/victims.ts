import { Router } from 'express'
import { query } from 'express-validator'
import { validate } from '../middleware/validate'
import { prisma } from '../lib/db'
import {
  listVictims, getVictimById, getMapMarkers, getOnThisDay,
} from '../services/victimService'

const router = Router()

// GET /api/victims
router.get('/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().isString().trim(),
    query('city').optional().isString().trim(),
    query('year').optional().isString(),
    query('type').optional().isIn(['homicide','domestic','shooting','other']),
  ],
  validate,
  async (req, res) => {
    try {
      const result = await listVictims({
        search: req.query.search as string,
        city:   req.query.city   as string,
        year:   req.query.year   as string,
        type:   req.query.type   as any,
        page:   req.query.page   as any,
        limit:  req.query.limit  as any,
      })
      res.json(result)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// GET /api/victims/map
router.get('/map', async (_req, res) => {
  try {
    const markers = await getMapMarkers()
    res.json(markers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/victims/on-this-day
router.get('/on-this-day', async (_req, res) => {
  try {
    const victims = await getOnThisDay()
    res.json(victims)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/victims/:id
router.get('/:id', async (req, res) => {
  try {
    const victim = await getVictimById(req.params.id)
    if (!victim || victim.status !== 'published') {
      return res.status(404).json({ error: 'Victim not found' })
    }
    res.json(victim)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/victims/:id/testimonials
router.post('/:id/testimonials', async (req, res) => {
  try {
    const victim = await getVictimById(req.params.id)
    if (!victim || victim.status !== 'published') {
      return res.status(404).json({ error: 'Victim not found' })
    }
    const { author_name, relation, content_ar } = req.body
    if (!author_name || !content_ar) {
      return res.status(422).json({ error: 'author_name and content_ar are required' })
    }
    const testimonial = await prisma.testimonial.create({
      data: { victim_id: req.params.id, author_name, relation, content_ar, verified: false },
    })
    res.status(201).json(testimonial)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
