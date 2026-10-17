# GramSaathi — Civic Hackerz

Mobile-friendly assistance for government services, developed by Akshat Mittal and Aaryan Agarwal, IIT Kanpur.

**Live demonstration:** https://gramsathi234.netlify.app

## One connected journey

Ask an Aadhaar question → retrieve official evidence → allow preparation → supply sample details and documents → manually log in to the practice portal → let the adapter fill its fields and attach the file → review and approve → download a practice application copy.

The Netlify website now connects official-source RAG and the preparation workflow. Gemini selects evidence IDs; the server validates those IDs and displays exact database passages. It refuses unsupported answers. The model is Gemini 3.5 Flash Lite, called server-side. No API key is exposed in frontend assets.

The practice portal is operated by this project. **Nothing is submitted to UIDAI.** Approved government adapters and DigiLocker authorization are proposed for deployment after selection. Document authenticity, production account authentication and OCR are not implemented. Use fictional details only.

See [SUBMISSION-DEMO.md](SUBMISSION-DEMO.md) for the presentation walkthrough, implemented scope and limitations.

## Project structure

- `web/`: connected mobile interface and controlled Aadhaar preparation portal.
- `netlify/lib/guide.mjs`: evidence selection, validation and consented application state machine.
- `netlify/lib/knowledge.json`: 300 official-source passages bundled into the server function, not published as static assets.
- `gramsaathi-rag/`: original Python ingestion, SQLite retrieval, source archives and local RAG service.
- `gramsaathi-prototype/`: earlier income/farm demonstration, retained at `/workflow.html`.
- `tests/`: evidence and workflow tests.

## Run and deploy

Use Node.js 22 or later. From the repository root:

```sh
npm install
npm test
npm run build
npx netlify dev
```

Set `GEMINI_API_KEY` and `GEMINI_MODEL=gemini-3.5-flash-lite` as server environment variables. Never commit keys, recovery files or personal documents.

Netlify configuration is in `netlify.toml`: root base directory, `npm run build`, publish `dist`, functions `netlify/functions`. Netlify Blobs stores demonstration cases with strong reads. Browser-generated recovery keys protect individual cases; account login is not connected. The old Sites identity headers are stripped.

Deploy a preview with `npx netlify deploy --build`; after verification, publish with `npx netlify deploy --build --prod`. Do not upload the repository root as static assets.

## Evidence and reliability

The corpus is a limited collection of UIDAI FAQs plus a reviewed online-process section. Retrieval is weighted lexical search, not a vector database. The model may only select existing citations; invented IDs or incomplete generation fail closed. Quotes preserve source wording, but this is not a guarantee of perfect relevance, completeness or current applicability. Stale passages and fee guidance are withheld pending review. Archived PDFs are not indexed.

Netlify storage is last-write-wins; concurrent editing is not transactional. A production release needs approved service integrations, real authentication, stronger abuse controls, application-level data protection and retention policy. See the demo notes for the full boundary between implemented and proposed functionality.
