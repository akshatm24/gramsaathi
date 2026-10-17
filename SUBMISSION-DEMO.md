# GramSaathi submission demonstration

Live site: https://gramsathi234.netlify.app
Repository: https://github.com/akshatm24/gramsaathi

## A three-minute walkthrough
1. Choose **Change my address**. Gemini selects supporting passages from the official UIDAI collection. Expand the evidence and open a source link.
2. Allow preparation and select **Help me prepare it**.
3. Choose **Use sample details**, check them and save.
4. Allow sample-file storage and select **Use a sample document**. DigiLocker is explicitly a planned connection.
5. Enter **246810** in the embedded practice portal yourself. Select **Fill my practice form**. The adapter fills the actual input fields and attaches the sample file.
6. Review the copied details and approve the practice application. Download its copy and source notes.
7. Reload the page to show saved progress. **My progress** provides a recovery file for another device and deletion of the stored demonstration case.

For the refusal demonstration, ask about PAN or an Aadhaar update fee. No unsupported answer should be supplied. A name-update question can return the official portal limitation, but does not start the address preparation flow.

## What is implemented
- Mobile responsive interface, browser-dependent speech input/read-aloud and partial Hindi interface.
- Server-side Gemini 3.5 Flash Lite evidence selection over a versioned official-source corpus.
- Weighted lexical retrieval with freshness and channel filters. This is retrieval-augmented generation, not vector similarity search.
- The model returns only citation IDs; the server checks their membership and returns exact stored text. Model errors, invented IDs and unsupported questions fail closed.
- Consent, sample details and file storage, format/size checks, manual demonstration login, actual DOM form filling in a controlled portal, field reconciliation, review and a practice receipt.
- Device recovery key, persistence in Netlify Blobs, downloadable application copy, source notes and deletion.
- The earlier income/farm workflow remains available at /workflow.html.

## Boundaries to explain to judges
This is a functioning proposed workflow, not a connected government service. DigiLocker partner authorization, live portal adapters, real login/OTP handoff and government acknowledgements require approved integration. The current code is a constrained agent workflow rather than an unrestricted browser agent. No government request is submitted.

The corpus contains 299 FAQ passages and one reviewed online-process section. Archived PDFs are not indexed. Fetch timestamps do not establish legal validity. Guidance older than 30 days is withheld; fees are withheld pending verification. Exact quotations prevent generated wording but do not guarantee correct selection, complete coverage or zero errors. Hindi support is partial and quotes remain in their source language. File authenticity, OCR, eligibility and original-document verification are not implemented.

Use fictional data. This is not production identity infrastructure: recovery files grant access to the corresponding demonstration case, account authentication is not connected, storage is last-write-wins and the app is not designed for concurrent editing. Netlify storage uses the provider's encryption; application-level encryption and production retention controls remain deployment work. Public-model usage has a basic per-IP minute cap; production needs stronger account-level abuse controls and spending budgets.

## Running and checking
`npm test` runs the backend and evidence-validation tests. `npm run build` prepares public assets only. Netlify deploys the API function with its evidence collection bundled server-side. Configure GEMINI_API_KEY and GEMINI_MODEL in Netlify environment settings; never include keys in the browser or commit them.

`python3 scripts/refresh-online-process.py` refreshes only the reviewed online-process section and its raw archive. Updating other passages requires running the existing ingestion pipeline, reviewing changes and re-exporting the approved collection to netlify/lib/knowledge.json. Do not reset freshness timestamps without fetching and reviewing the source again.
