import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?:    string
  userEmail?: string
}

interface SupabaseJwtPayload {
  sub:   string
  email: string
  role:  string
  aud:   string
  exp:   number
  iat:   number
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  const token  = authHeader.slice(7)
  const secret = process.env.SUPABASE_JWT_SECRET

  if (!secret) {
    console.error('SUPABASE_JWT_SECRET is not set')
    res.status(500).json({ error: 'Server configuration error' })
    return
  }

  try {
    const payload = jwt.verify(token, secret) as SupabaseJwtPayload

    // Supabase Auth tokens have role: 'authenticated'
    if (payload.role !== 'authenticated') {
      res.status(403).json({ error: 'Insufficient permissions' })
      return
    }

    req.userId    = payload.sub
    req.userEmail = payload.email
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
