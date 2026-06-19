/**
 * Express app factory — no app.listen() here so the same module can be
 * imported by both the local dev server (src/index.ts) and the Vercel
 * serverless handler (api/index.ts).
 */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import victimsRouter from './routes/victims'
import adminRouter   from './routes/admin'
import statsRouter   from './routes/stats'

const app = express()

// ── Security ────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin:      process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))

// ── Body parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/victims', victimsRouter)
app.use('/api/admin',   adminRouter)
app.use('/api/stats',   statsRouter)

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

export default app
