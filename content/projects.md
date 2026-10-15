# Projects

<!--
Fields:
- tier: featured = large card on the home page; all = appears in the filterable grid.
- tags: filter tags, only AI, Data, CV, Research.
- chips: optional secondary chips (not filters).
- key number / highlight: optional. Featured cards show whichever exists.
- details: at most 4 bullets, one sentence each.
- pipeline: optional, comma-separated steps shown as a step strip on the card.
- demo / repo / video: optional links. Leave empty until available; empty links do not render.
- image / imageAlt: optional. A web-sized image in public/projects/ (e.g. /projects/invoice-agent.webp) and a plain description of what it shows. No image = no image area.
Do not claim real users on any project unless confirmed.
-->

<!-- Builder note: featured projects (tier: featured) -->

### AI-Powered Invoice Processing and Accounts Payable Agent
tier: featured
tags: AI
chips: Automation, Finance
stack: Python, FastAPI, SQLite, Pydantic, Claude API (vision + text), React (Vite), Server-Sent Events, Render, Vercel
outcome: An end-to-end agent that reads vendor invoices (PDF or image), matches them to purchase orders, applies business rules and produces an **auditable approve / review / request info / reject** decision.
key number: 14 deterministic rules
image: /projects/invoice-agent.webp
imageAlt: Infographic of the invoice agent pipeline: seven stages from upload to act (upload, extract, match, validate, decide, explain and draft, act), with a live processing log and an approve decision for a sample ACME Supplies invoice.
pipeline: ingest, extract, match, validate, decide, act
demo:
repo: https://github.com/brucewayneoptimusprime/Financial_Invoice_Automation_System
video:

Highlights:
- Every extracted field carries its page, source text and confidence, and an independent check confirms the source text really appears in the document.
- Deterministic code makes the approve / review / reject decision, not the LLM, and the system was tested against adversarial invoices.
- Every explanation is citation-checked against system-verified facts.
- Production safeguards: cost ceilings, retries, a human review queue and an immutable audit log.

### Agentic RAG Financial Product
tier: featured
tags: AI
chips: RAG, Agents
stack: LangGraph, local embeddings, local LLMs, Python
outcome: An **agentic RAG product built with LangGraph** to study retrieval quality and efficiency from the inside: embeddings, retrieval and evaluation.
highlight: Runs fully local
image: /projects/agentic-rag.webp
imageAlt: Infographic of CurrencYTalk, a local, private Q&A app over financial PDFs: five stages from PDF ingestion with Docling to Jina embeddings, retrieval and answers from a local Ollama model, plus a chat screen answering a question about an Apple 10-K with page citations.
demo:
repo:
video:
- Goes beyond API calls into the mechanics: embeddings, dimensionality and retrieval evaluation (recall, MRR, precision).
- LangGraph for orchestration, with LangSmith-style tracing concepts for debugging.

### Global Forest Cover and Environmental Impact Dashboard
tier: featured
tags: Data
chips: BI
stack: Python (pandas), Power BI, DAX
outcome: An **11-visual interactive Power BI dashboard** across 215 countries and four snapshot years (1990, 2000, 2010, 2020), combining FAO forest data with CO2 and greenhouse gas data.
key number: 92.6% merge match rate (199 of 215 countries)
image: /projects/forest-dashboard.webp
imageAlt: Infographic of the Global Forest Cover dashboard: Power BI views for 1990 with a world forest cover gauge at 32.68%, forest area by country, a world map of forest cover tiers and CO2 and greenhouse gas breakdowns, beside notes on the data merging, verification, DAX measures and key findings.
demo:
repo:
video:
- Cleaned and merged the datasets with name normalization, left-join validation and automated discrepancy reports.
- Verified the forest area unit with two independent cross-checks.
- Built DAX measures, including percentile tiers and "top 5 vs rest of world" groupings.
- Findings: the top 5 CO2 emitters produced over half of global emissions, and forest cover showed only a weak relationship with per-capita CO2.

### Frequency-Band Analysis of a Music Genre Classifier
tier: featured
tags: AI, Research
chips: Audio, Interpretability
stack: Python, PyTorch, Hugging Face Transformers, librosa, NumPy, pandas, Matplotlib
outcome: Opens up a pretrained music genre classifier with FFT band filtering, testing which frequency bands are **sufficient** or **necessary** for its prediction.
highlight: What does the model actually hear?
image: /projects/music-genre.webp
imageAlt: Infographic of the frequency-band analysis: a waveform and spectrum split into six bands from 0 to 8000 Hz, the pipeline from audio to genre classifier, the sufficiency and necessity tests, and an example chart of band importance.
demo:
repo: https://github.com/brucewayneoptimusprime/The_Horse_Is_Addicted_To_Music_And_Arithmetic_Operations
video:
- Rebuilds each clip with one of six bands kept (sufficiency) or removed (necessity), using FFT filtering.
- Re-classifies every variant and ranks the most sufficient and most necessary bands by prediction change and confidence drop.
- Also classifies full tracks in 30-second chunks and saves every rebuilt clip as .wav for listening comparison.
- A coarse, exploratory analysis on a single track.

### Quantum Interaction-Free Measurement Circuit
tier: featured
tags: Research
chips: Quantum computing, Qiskit, Simulation
stack: Python, Qiskit, Qiskit Aer, NumPy, Matplotlib, Seaborn, Jupyter
outcome: Qiskit simulations of **interaction-free measurement** (the Elitzur–Vaidman bomb-tester idea), with circuits growing from 3 to 8 qubits.
highlight: From about 38% to about 51%, in simulation
image: /projects/quantum-circuit.webp
imageAlt: Poster of the interaction-free measurement simulation: a photon, beam splitter and mirrors around a bomb, a four-qubit Qiskit circuit, and a results chart with the non-destructive outcome at about 37.7%.
demo:
repo: https://github.com/brucewayneoptimusprime/Quantum-Interaction-Free-Measurement-Circuit
video:
- Builds circuits step by step: superposition, entanglement (CNOT, controlled-Z), a custom unitary gate and parameterized rotations (RX, RY, U3).
- Simulates them with shot-based measurement in Qiskit Aer, plus statevector and Bloch sphere views before measurement.
- Estimates the probability of a non-destructive outcome: about 38% with 4 qubits, about 51% with 8.
- Simulation only, with no noise model, and not a formally optimized algorithm.

<!-- Builder note: grid-only projects (tier: all). The filter grid shows all projects, featured ones included. -->

### Financial Document Assistant (RAG on AWS)
tier: all
tags: AI, Data
chips: RAG
period: May 2025 - Aug 2025
repo: https://github.com/brucewayneoptimusprime/Financial_RAG_LLM
- Pipeline joining structured financial metrics with unstructured SEC filings for natural-language queries.
- Vector retrieval returning context-grounded answers with source traceability.
- Prototyped deployment on AWS (Bedrock, S3, EC2).

### Recession Forecasting from Macroeconomic Indicators
tier: all
tags: Data
chips: ML
period: Feb 2025 - May 2025
- Quarterly dataset from FRED indicators (yield spreads, unemployment, CPI, VIX) with train/validation/test splits for time series.
- Compared a logistic regression baseline with **calibrated gradient boosting**.
- Documented assumptions, class imbalance, NBER chronology and key drivers with a model card and permutation importance.

### Financial Data Pipeline from SEC EDGAR and Inline XBRL
tier: all
tags: Data
period: Nov 2024 - Jan 2025
- Ingested 10-K and 10-Q filings, normalizing thousands of facts into structured wide tables.
- Added taxonomy fallbacks, unit normalization and dimensional parsing (including EPS).
- Validated **1,100+ Inline XBRL facts from Apple 10-K filings** against SEC JSON sources.

### Realistic Rug Placement in Room Images
tier: all
tags: CV
period: Jun 2025 - Jul 2025
repo: https://github.com/brucewayneoptimusprime/AI-Powered-Interior-Visualization-Toolkit
- SAM-guided classical computer vision pipeline with occlusion handling and perspective correction.
- Homography, shading and colour transfer for realistic results.

### ISRC Cross-Referencing Pipeline: Spotify vs Unclaimed Music Rights
tier: all
tags: Data
chips: Data engineering, DuckDB, Spotify API
stack: Python, DuckDB, Spotipy, pandas, openpyxl, Matplotlib
outcome: An end-to-end Python pipeline that cross-references Spotify artist catalogs against a **6.7 GB dataset** of unclaimed musical-work rights, matching by ISRC to surface unclaimed and overlapping works.
repo: https://github.com/brucewayneoptimusprime/Crossref-isrc-spotify
- Streams the dataset into DuckDB in 100k-row batches with an indexed ISRC column, so the file never has to fit in memory.
- Retrieves full artist catalogs (albums, singles, EPs) from the Spotify Web API over OAuth 2.0.
- Joins both sources on ISRC for single- or multi-artist runs and exports a multi-sheet Excel report with comparison charts.
