# Trackly — Plan • Track • Achieve

A calm academic productivity workspace for planning classes, finishing coursework, building routines, and seeing progress.

## Features
- A focused daily dashboard with schedule, priority work, habits, and a weekly signal
- Weekly timetable for classes, study sessions, and events
- Searchable task workflow with priority, completion, and a task detail panel
- Habit check-ins with an interactive 28-day consistency heatmap
- Lightweight productivity insights powered by Recharts
- Local-first persistence via Zustand + browser Local Storage
- Responsive shell, semantic controls, keyboard-native buttons, and Netlify SPA configuration

## Stack
React 19, TypeScript, Vite, Wouter, Zustand, Recharts, Lucide React, and CSS design tokens. The project is configured for Supabase environment variables (`.env.example`) and can be extended with Supabase Auth without changing the domain stores.

## Start locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Deployment
Deploy on Netlify using the included `netlify.toml`. Build command is `npm run build`, publish directory is `dist`. The SPA redirect rule ensures direct navigation to application routes works after deployment.

## Data and privacy
The demo stores workspace information in `localStorage` under `trackly-workspace`. Use **Settings → Export backup** to download a JSON snapshot. Browser storage is ideal for this local-first prototype; a production multi-device release should add user-scoped Supabase tables, Row Level Security, and migration/sync services.

## Connect Supabase authentication and real-time sync

1. Create a Supabase project.
2. In **Authentication → Providers**, enable Google, supply Google OAuth credentials, and add your local and Netlify URLs under **Redirect URLs** (for example, `http://localhost:5173/app` and `https://your-site.netlify.app/app`).
3. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor. It creates a user-scoped workspace table, Row Level Security policy, and Realtime publication.
4. Add these locally in `.env.local`, and in Netlify under **Site configuration → Environment variables**:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
5. Restart the development server or trigger a new Netlify deployment.

Once authenticated, Trackly mirrors the local-first workspace to Supabase and subscribes to workspace changes, so updates from another signed-in device appear in real time. Local Storage remains an immediate offline-friendly cache.

## Connect the AI companion

The AI companion sends requests only to `/.netlify/functions/assistant`; your provider key never reaches the browser. Configure these **server-only** Netlify environment variables:

```env
AI_API_URL=https://your-provider.example/v1/chat/completions
AI_API_KEY=your-private-key
AI_MODEL=your-model
```

The current function uses the OpenAI-compatible Chat Completions request/response shape. If your custom provider uses a different API schema, adapt `netlify/functions/assistant.mjs` to that provider’s documentation. Never use a `VITE_` prefix for AI secrets.

## Design updates

Trackly now uses **Gothic A1** for key heading treatments. Theme preference applies immediately and persists, including a dark reading mode. 

## Resend email delivery

Trackly includes an optional Netlify Function at `netlify/functions/welcome.mjs`. It sends a branded welcome email after a successful sign-up when these **server-only** Netlify variables are set:

```env
RESEND_API_KEY=re_...
RESEND_FROM=Trackly <hello@your-verified-domain.com>
```

For the Supabase **email confirmation** message itself to be sent through Resend, configure Resend SMTP in **Supabase Dashboard → Authentication → SMTP Settings**. Use your Resend SMTP credentials and a verified sending domain. This is required because Supabase owns the confirmation-email workflow; browser code must never contain SMTP or Resend secret keys.
