import request from 'supertest'
import app from '../src/index'

describe('GET /api/victims', () => {
  it('returns 200 with paginated data', async () => {
    const res = await request(app).get('/api/victims')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body).toHaveProperty('total')
    expect(res.body).toHaveProperty('page')
  })
})

describe('GET /api/victims/map', () => {
  it('returns 200 with array', async () => {
    const res = await request(app).get('/api/victims/map')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('GET /api/victims/on-this-day', () => {
  it('returns 200 with array', async () => {
    const res = await request(app).get('/api/victims/on-this-day')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('GET /api/stats/cities', () => {
  it('returns 200 with array', async () => {
    const res = await request(app).get('/api/stats/cities')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})
