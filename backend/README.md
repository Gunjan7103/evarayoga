# Evara Yoga Backend

Node.js/Express API with Supabase PostgreSQL and Auth.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and add Supabase credentials.
3. Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor.
4. `npm run dev`

Never commit `.env` or the Supabase service-role key.
