# GramSaathi — Civic Hackerz

Mobile-friendly assistance for government services, developed by Akshat Mittal and Aaryan Agarwal, IIT Kanpur.

## Project components

- `gramsaathi-prototype/`: English/Hindi workflow demonstration with voice input, saved cases, document consent and a cooperating demonstration portal.
- `gramsaathi-rag/`: Aadhaar guidance retrieval from archived official UIDAI sources, using SQLite FTS5 and Gemini. Replies quote retrieved source passages with citations.

These components currently run separately. The demonstration portal does not submit to a real government service. DigiLocker authorization and approved government-portal integration are required for full deployment.

## Run

Follow the README in each component. Keep the Gemini API key in a local `.env` file, based on `.env.example`. Never commit secrets or personal documents.

## Hosting

The existing prototype build targets the Sites Worker runtime, including R2 storage and platform sign-in. It is not a drop-in static Netlify deployment: the server routes, persistent storage and authentication need a Netlify-compatible implementation first. The Python RAG backend also needs its own supported runtime and server-side secret configuration.

For a local demonstration, use the prototype development server and run the RAG service separately. The existing Sites hosting manifest is omitted from this portable repository; see the component documentation for runtime details.
