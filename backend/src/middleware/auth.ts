import type { Request, Response, NextFunction } from 'express'
import { createClient } from '@supabase/supabase-js'

export interface AuthRequest extends Request {
  userId?:    string
  userEmail?: string
}

// Use the existing VITE_ vars (available in Vercel serverless functions regardless of prefix)
// Falls back to non-prefixed versions for local dev
const SUPABASE_URL  = process.env.VITE_SUPABASE_URL  ?? process.env.SUPABASE_URL  ?? ''
const SUPABASE_KEY  = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? ''

export async function requireAdmin(
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  const token = authHeader.slice(7)

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Supabase URL or anon key not set')
    res.status(500).json({ error: 'Server configuration error' })
    return
  }

  try {
    // Verify token via Supabase — avoids needing SUPABASE_JWT_SECRET to be correct
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired token' })
      return
    }

    req.userId    = user.id
    req.userEmail = user.email ?? ''
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
