# beacon — Extreme Weather Senior Guard
> **Live Application:** [Launch live app](https://beacon-rho-ruby.vercel.app/)
Weather-triggered wellbeing checks for home-care agencies.

When a severe weather event is declared (heat wave, air quality, flood), **beacon** flags at-risk clients, sends one-tap SMS check-ins, dispatches in-person visits with hazard-aware rerouting, and protects lone caregivers with a 15-minute SOS safety timer.

## Three roles, one loop

- **Caregiver** — full app: dashboard, client profiles with symptom flags, dispatch + outcome logging, team map, rerouting, SOS timer, resources, community reports
- **Senior** — no account needed; secure SMS link opens two screens: "I'm okay / I need help" + three yes/no symptom questions
- **Family** — read-mostly timeline of their relative's status, with "I'll check on her myself" to coordinate with the agency

## Design & Operational Intent

*   **Zero-Friction Senior UX:** Seniors often struggle with passwords, app store downloads, or poor cell reception during storms. We intentionally engineered the Senior view to require **zero login credentials**, using an encrypted, text-messaged unique URL that renders flawlessly even on weak 3G signals.
*   **Preventing Duplicated Effort:** During weather crises, phone lines get jammed and multiple people try to check on the same person. The Family **"I'll check on her myself"** button shifts coordination away from chaotic group texts and directly updates the professional agency's routing queue in real-time.
*   **The 15-Minute Safe-Tether:** Caregivers are lone workers out in dangerous blizzards or floods. The app treats caregiver safety as equally important as client safety; the proactive deadman timer ensures that if a caregiver slips on ice or gets stranded, they aren't forgotten.

## Live data

The alert banner fetches **real active National Weather Service alerts** for Illinois from `api.weather.gov` (free, no API key). If no relevant alert is active, it falls back to a demo heat advisory. Look for the "LIVE NWS" tag.

## Technical Stack

- Frontend: Vite + React 18
- Data Integration: NWS API for live alerts
- All client/resource/report data mocked in `src/data.js` — swap for a real backend (e.g. Supabase) post-hackathon

## Directory Structure

```text
src/
├── screens/
│   └── index.jsx     # Full multi-role layout mapping
├── App.jsx           # Application shell: core screen routing, global toast alerts, live NWS data pipeline
├── data.js           # Mock client database, resource registries, and crowdsourced hazard feeds
└── styles.css        # Clean, centralized semantic CSS design system
```
## The Team

Built with 🤍 at the **Ground Up — Chicago All Women Hackathon**.

* Otioh Konan
* Jiya Rathi
