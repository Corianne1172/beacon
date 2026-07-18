# Beacon — climate wellbeing checks

Weather-triggered wellbeing checks for home-care agencies. Built at [hackathon name], Chicago.

When a severe weather event is declared (heat wave, air quality, flood), Beacon flags at-risk clients, sends one-tap SMS check-ins, dispatches in-person visits with hazard-aware rerouting, and protects lone caregivers with a 15-minute SOS safety timer.

## Three roles, one loop

- **Caregiver** — full app: dashboard, client profiles with symptom flags, dispatch + outcome logging, team map, rerouting, SOS timer, resources, community reports
- **Senior** — no account needed; secure SMS link opens two screens: "I'm okay / I need help" + three yes/no symptom questions
- **Family** — read-mostly timeline of their relative's status, with "I'll check on her myself" to coordinate with the agency

## Live data

The alert banner fetches **real active National Weather Service alerts** for Illinois from `api.weather.gov` (free, no API key). If no relevant alert is active, it falls back to a demo heat advisory. Look for the "LIVE NWS" tag.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

Option A — CLI:
```bash
npm i -g vercel
vercel
```
Accept the defaults; Vercel auto-detects Vite. Done.

Option B — GitHub:
1. Push this folder to a GitHub repo
2. Go to vercel.com → Add New Project → import the repo
3. Framework preset: Vite (auto-detected) → Deploy

No environment variables needed.

## Stack

- Vite + React 18, plain CSS (no UI framework)
- NWS API for live alerts
- All client/resource/report data mocked in `src/data.js` — swap for a real backend (e.g. Supabase) post-hackathon

## Structure

```
src/
  App.jsx            app shell: screen routing, toast, live NWS fetch
  data.js            mock clients, resources, community reports
  styles.css         full design system
  screens/index.jsx  all 15 screens
```
