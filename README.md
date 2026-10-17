# GramSaathi — Civic Hackerz

Mobile-friendly assistance for government services, developed by Akshat Mittal and Aaryan Agarwal, IIT Kanpur.

## Project components

- `gramsaathi-prototype/`: English/Hindi workflow demonstration with voice input, saved cases, document consent and a cooperating demonstration portal.
- `gramsaathi-rag/`: Aadhaar guidance retrieval from archived official UIDAI sources, using SQLite FTS5 and Gemini. Replies quote retrieved source passages with citations.

These components currently run separately. The demonstration portal does not submit to a real government service. DigiLocker authorization and approved government-portal integration are required for full deployment.

## Run

Follow the README in each component. Keep the Gemini API key in a local `.env` file, based on `.env.example`. Never commit secrets or personal documents.

## Netlify deployment

The repository root contains `netlify.toml`. Import this repository and use:

- Base directory: blank (repository root)
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Node.js: 22

Netlify installs root dependencies automatically. The build copies only the five public frontend assets. Functions handle `/api/*` and persist demonstration cases and documents in Netlify Blobs with strong reads. `/portal` serves the cooperating demonstration portal. Do not publish the repository root, corpus, or Python backend as static assets.

The Netlify version supports device drafts and private access backups; ChatGPT account login is available only on the original Sites host. Account authentication on Netlify needs a separate identity-provider integration. The adapter strips incoming Sites identity headers so visitors cannot impersonate accounts.

The Python RAG service remains separate and is not deployed or connected by this configuration. No Gemini key is needed for the workflow demo. It will need a supported server runtime and server-side secret configuration before integration.

Run `npm install`, `npm run build`, and `npm test` from the repository root. The original Sites build remains available in `gramsaathi-prototype/`.

Only use fictional information in this public demonstration. Blob updates are last-write-wins, so concurrent edits are not transactional. Production needs real authentication, transaction control, rate limits, retention controls and approved service integrations.
