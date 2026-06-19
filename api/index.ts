/**
 * Vercel serverless entry point (root api/ directory required by Vercel).
 * @vercel/node runtime expects a default export that satisfies the
 * Node.js IncomingMessage handler interface — Express apps satisfy this.
 */
import app from '../backend/src/app'

export default app
