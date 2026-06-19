import { Router } from 'express'
import { getCityStats, getSummaryStats } from '../services/victimService'

const router = Router()

// GET /api/stats/summary — total victims, cities, year range (used by homepage)
router.get('/summary', async (_req, res) => {
  try {
    const stats = await getSummaryStats()
    res.json(stats)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/stats/cities — per-city counts + rates (used by map)
router.get('/cities', async (_req, res) => {
  try {
    const stats = await getCityStats()
    res.json(stats)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
