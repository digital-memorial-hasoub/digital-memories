/**
 * Vercel serverless entry point.
 * Vercel's @vercel/node runtime expects a default export of a Node.js
 * IncomingMessage handler — Express apps satisfy this interface.
 */
import app from '../src/app'

export default app
