# Sahaay — Societal Innovation Collaboration Portal

A Next.js 14 MVP for routing public challenges to government, universities and CSR partners.

## Run it

1. Copy `.env.example` to `.env.local` and add a Gemini key. Supabase is optional for the interactive demo, but required for persistence.
2. Run `npm install` then `npm run dev`.
3. Run `supabase/schema.sql` in the Supabase SQL editor before wiring authenticated data operations.

## Included workflow

Citizen report → Gemini structured classification → government approval/routing → university acceptance/project creation → CSR mock sponsorship and analytics.

The UI intentionally includes local demo data so every role can be presented without credentials. The schema has RLS policies for production persistence. For uploads, create a private `problem-media` storage bucket and upload media before inserting the returned URL into `problems.media_url`.
