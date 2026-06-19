import { Router } from 'express'
import { getCityStats } from '../services/victimService'

const router = Router()

// GET /api/stats/cities
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
