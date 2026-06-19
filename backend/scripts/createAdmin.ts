/**
 * Admin users are now managed via Supabase Auth.
 *
 * To create an admin user:
 * 1. Go to your Supabase project dashboard
 * 2. Click "Authentication" in the left sidebar
 * 3. Click "Users" tab
 * 4. Click "Add user" → "Create new user"
 * 5. Enter the admin's email and a strong password
 * 6. Click "Create user"
 *
 * The user can then log in at /admin/login on the site.
 *
 * To get your SUPABASE_JWT_SECRET:
 * 1. Go to Supabase Dashboard → Settings → API
 * 2. Find "JWT Secret" (click the eye icon to reveal)
 * 3. Copy it into your backend/.env as SUPABASE_JWT_SECRET=...
 */

console.log(`
Admin users are now managed via Supabase Auth.

To create an admin:
  1. Open https://supabase.com/dashboard
  2. Select your project
  3. Go to Authentication → Users → Add user
  4. Enter email + password → Create user

To get SUPABASE_JWT_SECRET:
  1. Go to Settings → API
  2. Copy the "JWT Secret" value
  3. Add to backend/.env: SUPABASE_JWT_SECRET=<value>

To create the Supabase Storage bucket:
  1. Go to Storage in your Supabase dashboard
  2. Click "New bucket"
  3. Name it: victims-media
  4. Check "Public bucket" (photos need to be publicly accessible)
  5. Click "Create bucket"
`)
