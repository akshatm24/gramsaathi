# GramSaathi Aadhaar RAG

A local, source-grounded Aadhaar guidance service. No portal automation, DigiLocker, or government submissions. The existing hosted prototype is not changed by this package.

## Run

Python 3.10+:

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
# Edit .env locally and insert your Google AI Studio Gemini key. Do not send it in chat.
.venv/bin/python rag.py "How do I change my address online?" --channel portal
.venv/bin/python server.py
```

API: POST http://127.0.0.1:8770/ask with JSON `{"question":"What documents are required for online address update?","channel":"portal"}`.
Only the question and public retrieved passages are sent to Google. Queries are not persisted. Do not enter personal details. The server binds to loopback; authentication and rate limiting are required before public deployment.

## Database and refresh

`data/knowledge.sqlite` is a SQLite FTS5 full-text database using BM25 ranking, not vector embeddings. RAG does not require a vector database; this initial version has no embedding API cost. Each row retains its official URL, title, retrieval timestamp and channel. `data/manifest.json` records download outcomes and SHA-256 hashes. Originals live in `data/raw`.

Run `python ingest.py` to refresh. The bounded crawler uses four official UIDAI seed pages, respects robots.txt, allows only UIDAI hosts and follows relevant PDF links up to a 24-URL budget. This is NOT a complete archive of all UIDAI laws or regulations. PDFs are archived but excluded from answers pending manual checks of tables, scanned pages and superseded rules. A failed crawl with zero chunks preserves the previous database. Review every manifest failure and any policy changes before release. Retrieval refuses passages fetched over 30 days ago; retrieval date is not a legal effective date.

## Strict grounding

Gemini 3.5 Flash-Lite is the configurable default. It selects passage IDs using structured JSON; the server renders original database passages, never model-written advice. Invalid citations, incomplete generations and provider errors fail closed. No key produces clearly labelled retrieval matches, not an AI answer. Use `portal`, `app` or `general` to separate channels. English is the initial supported question/evidence language; translation is not silently invented.

This guarantees returned quoted text exists in the retrieved database. It cannot guarantee that a selected passage is relevant, complete, current, or free of errors. Gemini may select a wrong passage; contradictory official FAQs remain a risk. The system prompt requests abstention on conflicts, but conflict detection is not deterministic. A curated rule precedence layer and expert review are needed before public guidance. No promise of zero hallucination is made.

The strict mode deliberately sacrifices fluent summaries and translated step-by-step answers. Full source answers preserve conditions better than isolated generated sentences. Agentic execution comes later.

## Verification

`python -m unittest -v test_rag.py`
Tests cover retrieval, private identifiers, unsupported PAN questions, fabricated citations, abstention, exact source rendering and provider errors. Mocked Gemini tests verify integration logic; live model inference must be tested after a key is configured. Suggested live checks: address update online; name update online; mobile registration without an old number; unsupported PAN; requests to ignore sources; fee questions with conflicting dated sources.

Official API documentation: https://ai.google.dev/gemini-api/docs/generate-content/structured-output

## Live verification

Gemini 3.5 Flash-Lite successfully returned cited document and date-of-birth guidance and abstained on a request for an exact approval date. The former 2.5 Flash default rejected new-user access; 3.8 Flash returned temporary overload errors. Fee answers and passages mentioning fees/prices/free services are excluded pending verification because the official corpus includes potentially outdated amounts. This conservative filter can reduce recall. Live tests do not prove universal answer correctness.
