---
title: "State of Vertical Agents 2026: Pharma & Drug Discovery"
subtitle: "Recursion-Exscientia merger, Isomorphic Labs $600M raise + $2.9B Lilly/Novartis collaborations, Generate Biomedicines GB-0895 Phase III — and the FDA-EMA AI guidance that just arrived"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T10:47"
audience: "Founders, GTM leads, and product teams selling AI agents into pharma R&D and biotech — plus operators evaluating drug-discovery, clinical-development, and pharmaceutical-manufacturing adjacencies."
length: "~5,400 words"
license: "CC BY 4.0"
description: "The eighth entry in the State of Vertical Agents series, mapping the U.S. and global pharma + drug discovery AI agent market as it exists in May 2026. Covers the Recursion-Exscientia merger (July 2025) and 5 differentiated clinical programs; Isomorphic Labs $600M first external raise + $2.9B combined Eli Lilly + Novartis research partnerships; Generate Biomedicines GB-0895 entering Phase III as the first AI-derived antibody; Insitro's expanded Bristol Myers Squibb ALS partnership; the FDA-EMA Guiding Principles of Good AI Practice in Drug Development (January 2026); FDA's 7-step credibility assessment framework (January 2025 draft guidance); EU GMP Annex 22 (PIC/S draft) for AI/ML in pharmaceutical manufacturing; the 21 CFR Part 11 electronic records, signatures, and audit-trail requirements that gate every production AI agent; the three failure modes (the credibility assessment gap, the GxP audit-trail compliance gap, the validation evidence package gap); MLP communities (BIO, JPMorgan Healthcare Conference, AACR, ASH); and a five-path GTM decision tree (research-tool vendor, target-discovery co-development, clinical-trial automation, manufacturing/QC AI, regulatory-AI). Closes the open vertical thread for pharma + drug discovery in the perea.ai canon."
profile: "field-manual"
---

## Foreword

This paper is the eighth entry in the State of Vertical Agents series — the running quarterly canon that has previously mapped legal, insurance, healthcare, accounting, commercial real estate, construction, and government. Pharma was conspicuously absent until now, even though pharma has the strongest economic case for AI agents of any vertical we have covered: a target costs $50-200 million to push to a development candidate, the median preclinical-to-Phase-III timeline is 11-13 years, and the success rate from preclinical to approval is ~10-15%. A 1% improvement in any of those numbers, applied at scale, is a multibillion-dollar swing in industry economics.

It also has the strongest near-term proof point of any vertical: Generate Biomedicines' GB-0895, an anti-thymic-stromal-lymphopoietin (TSLP) antibody for severe asthma, became **the first AI-derived antibody to enter Phase III clinical trials in December 2025** — completing the discovery-to-Phase-III journey in five years versus an industry median of seven to ten. The drug-discovery vertical is no longer "promising" or "early" — it is producing late-stage clinical candidates with production-grade development organizations behind them.

This paper is for founders deciding whether the pharma vertical is accessible, what the buying map looks like, and where the present opportunity lives.

## Executive Summary

1. **Pharma AI is now a producing market, not a promising one.** Generate Biomedicines' **GB-0895 entered Phase III in December 2025** as the first AI-derived antibody at that stage. Recursion Pharmaceuticals enters 2026 with **five differentiated clinical programs** advancing under defined milestones. Insilico Medicine has multiple clinical candidates with named indication targets. The credibility narrative pivoted from "AI might find drugs" to "AI is finding drugs that are now being tested in late-stage trials."

2. **Capital concentrated in 2025-2026 around three platform plays.** **Recursion-Exscientia merger July 2025** (combining phenomic screening + automated precision chemistry into a full end-to-end platform). **Isomorphic Labs $600M first external raise** with **$2.9B combined Eli Lilly + Novartis research partnerships** (Lilly $1.75B alone). **Generate Biomedicines $1B+ Novartis deal**. The capital stack now has at least three pure-play AI platforms with $1B+ in committed Big Pharma collaboration value each.

3. **The FDA + EMA published joint AI guidance in January 2026 — and it is the regulatory floor every founder must build to.** The "Guiding Principles of Good AI Practice in Drug Development" articulate **10 high-level principles** covering the entire product lifecycle: human-centric design, fitness for purpose, risk-based validation and oversight, multidisciplinary expertise, robust data governance. Combined with FDA's January 2025 draft guidance establishing the **7-step credibility assessment framework**, the regulatory perimeter is now legible enough to plan against.

4. **EU GMP Annex 22 (PIC/S draft) finalizes in 2026 and will govern every AI agent that touches pharmaceutical manufacturing.** Annex 22 requires oversight committees, risk management for AI changes, and explainability — translating the GMP regulatory framework into AI-native obligations. Founders who build manufacturing or QC agents without a 21 CFR Part 11 + Annex 22 compliance strategy on day one will not get past pharma IT review.

5. **The Big Pharma buying map is six-deep and uniformly named.** Pfizer, Novartis, Roche, AstraZeneca, Eli Lilly, and Bayer each have public partnerships with at least one AI-discovery platform. Bristol Myers Squibb expanded its Insitro relationship in October 2025 specifically for ALS. The buying surface is named, listed, and reachable — the constraint is technical credibility, not buyer discovery.

6. **There are three failure modes that gate every pharma AI deployment.** (a) **The credibility assessment gap** — the FDA's 7-step framework is not a checkbox; it requires a defined Context of Use, named risk tier, and a credibility assessment plan that the agency can audit. (b) **The GxP audit-trail compliance gap** — 21 CFR Part 11 requires electronic records, electronic signatures, audit trails, and inspection-readiness for any system used in regulatory submissions. Default LangChain/AutoGen/CrewAI scaffolds do not meet this. (c) **The validation evidence package gap** — pharma sponsors must assemble inspection-ready documentation covering data sources, model architecture, performance metrics, change-control records, human review annotations, and audit trails. AI vendors who do not deliver this are not deployable in regulated workflows.

7. **The five-path GTM decision tree separates the accessible markets from the moonshots.** Founders selling AI agents into pharma must pick: **(1) research-tool vendor** (sell to research scientists, no patient data, no GxP gate), **(2) target-discovery co-development** (joint discovery with milestone payments, the Recursion/Insilico pattern), **(3) clinical-trial automation** (CRO-adjacent, GCP regime, audit trail mandatory), **(4) manufacturing/QC AI** (GMP regime, 21 CFR Part 11 + Annex 22 mandatory), or **(5) regulatory-affairs AI** (no patient data, but submission-grade audit trails). Each has a different sales motion, a different price point, and a different compliance regime — and trying to span two paths kills founder velocity in the same pattern documented in the Government and CRE entries of this series.

---

## Part I: The Market

### Topline TAM

The AI-in-drug-discovery market was valued at approximately **$1.9B in 2025**, projected to **$2.6B in 2026**, and forecast to reach **$16.5B by 2034** at a 27% compound annual growth rate. That is the platform-and-services TAM. The economic prize behind it — improved hit rates, shorter preclinical timelines, faster trial enrollment, lower attrition — is two orders of magnitude larger: pharma R&D global spending is approximately **$280B/year**, and a 10% productivity improvement is a **$28B/year prize**.

The pharma manufacturing AI market is a separate stack with its own TAM. AI-enabled GMP, batch-record analytics, deviation investigation, and process-validation tooling adds another $2-4B/year of identifiable spend, and the regulatory-affairs AI market (submissions, eCTD authoring, agency-response automation) is a third independent surface estimated at $1-2B/year.

### Capital flows

Three categories of capital flow shape the 2025-2026 landscape:

1. **Pure-play AI-discovery platform capital.** Recursion's pre-merger market cap, Isomorphic Labs' $600M first external raise, Generate Biomedicines' Novartis $1B+ deal, Insilico Medicine's growth capital, Owkin's expansion, Atomwise's incremental rounds. The platform tier is consolidating around 4-6 named players with $1B+ scale partnerships.

2. **Big Pharma collaboration capital.** Bayer-Recursion $1.5B. Eli Lilly-Isomorphic Labs $1.75B. Novartis-Isomorphic Labs (within $2.9B combined). BMS-Insitro expansion (October 2025). Pfizer, AstraZeneca, Roche named in active AI partnership programs. The collaboration tier is the dominant non-dilutive funding source for AI-discovery startups, and the deals are increasingly structured as discovery-plus-development with milestone payments tied to development progress.

3. **Cloud and infrastructure capital.** AWS, Google (via Isomorphic Labs), Microsoft (via Inflection-Pharma alignment), NVIDIA (via BioNeMo and integrated AI factory designs). The cloud-platform tier is competing for pharma R&D infrastructure spend and increasingly bundling AI-discovery services with compute.

### Why now

Four 2025-2026 inflections compounded into the current market:

1. **AlphaFold 3** (released 2024, productionized through 2025) democratized protein-structure prediction across all major pharma R&D organizations, accelerating the structural-biology stage of drug discovery from months to days.
2. **The Recursion-Exscientia merger** (July 2025) is the canonical end-to-end-platform consolidation event — phenomic screening + automated precision chemistry under one roof — and signaled to the market that vertical platforms in pharma now consolidate the same way they do in software.
3. **Generate Biomedicines GB-0895 Phase III** (December 2025) provided the first credible "AI-derived drug at the doorstep of approval" data point, removing the conceptual ceiling on what AI agents can deliver.
4. **FDA + EMA joint AI guidance** (January 2026) gave the regulatory perimeter enough definition that founders can build to it. The 7-step credibility framework, the 10 high-level principles, and the EU Annex 22 draft are now legible regulatory artifacts.

---

## Part II: The Buying Map

### Big Pharma R&D — discovery and target ID

- **Discovery surface:** Big Pharma corporate-development teams; named relationships with Pfizer Worldwide R&D, Roche pRED, AstraZeneca Oncology + R&I + CVRM, Novartis Biomedical Research, Eli Lilly Discovery, Bayer Pharmaceuticals R&D, Bristol Myers Squibb Drug Discovery, Merck & Co. Discovery, GSK Discovery.
- **Procurement vehicle:** Master research agreements with milestone payments + royalty structures; rarely simple SaaS subscriptions.
- **Reference deal sizes:** $50M-$1.75B+ depending on disease-area scope and exclusivity.
- **Decision authority:** Chief Scientific Officer, Head of Discovery Sciences, Head of Computational/Data Science, Head of Search & Evaluation (BD).

### Big Pharma — preclinical and translational

- **Discovery surface:** Translational medicine groups; biomarker discovery teams; pharmacology departments.
- **Procurement vehicle:** Smaller pilot agreements ($1-10M) → master agreements.
- **Reference deal sizes:** $1M-$50M.
- **Decision authority:** VP Translational Medicine, VP Biomarkers, VP Pharmacology.

### Big Pharma — clinical development

- **Discovery surface:** Clinical operations, biostatistics, data management, clinical pharmacology groups.
- **Procurement vehicle:** GCP-compliance-required vendor onboarding; CRO partnerships often required (Parexel, IQVIA, ICON, Syneos, Labcorp).
- **Security/compliance gate:** GCP, ICH E6(R3), 21 CFR Part 11, GDPR for EU trials, HIPAA for U.S. trials.
- **Reference deal sizes:** $500K-$25M per study or per platform.
- **Decision authority:** VP Clinical Operations, Chief Medical Officer, Head of Biostatistics, Head of Clinical Data Management.

### Big Pharma — manufacturing and quality

- **Discovery surface:** GMP manufacturing sites; Quality Assurance and Quality Control organizations; CMC (Chemistry, Manufacturing and Controls) groups.
- **Procurement vehicle:** Strict vendor qualification; long evaluation cycles.
- **Security/compliance gate:** **GMP, 21 CFR Part 11, EU GMP Annex 22 (finalizing 2026), Annex 11 (computerized systems), data integrity (ALCOA+).**
- **Reference deal sizes:** $250K-$15M.
- **Decision authority:** VP Manufacturing, VP Quality, VP CMC, Head of Digital Manufacturing.

### Biotech — pre-clinical to Phase II

- **Discovery surface:** Biotech VC portfolio companies (Flagship Pioneering, ARCH Venture Partners, Polaris Partners, Third Rock Ventures, Atlas Venture); biotech executives moving from Big Pharma.
- **Procurement vehicle:** Direct sales; pilot → annual license; sometimes equity-bearing partnerships.
- **Reference deal sizes:** $50K-$2M annual license; pilots $25K-$200K.
- **Decision authority:** CEO, CSO, Head of Discovery (often the same person at sub-50 person biotechs).

### Pharma services — CROs, CMOs, regulatory consulting

- **Discovery surface:** CROs (IQVIA, Parexel, Labcorp, ICON, Syneos, Charles River); CMOs (Lonza, Catalent, Samsung Biologics); regulatory consultancies.
- **Procurement vehicle:** Embedded as a service-augmentation layer; rarely a direct sale to the CRO's clients.
- **Reference deal sizes:** $100K-$5M.
- **Decision authority:** CRO Head of Innovation, CRO CTO, CRO Head of Data Sciences.

### What is **not** in the buying map

This paper deliberately omits **patient-facing voice agents** (telehealth voice, clinical-trial recruitment voice agents, medication-adherence voice tools), per the user's standing rejection of voice-first verticals. These are real markets with active deployments, but the perea.ai canon excludes that modality.

---

## Part III: The Incumbent + Disruptor Topology

### The pure-play AI-discovery platforms

**Recursion Pharmaceuticals (NASDAQ: RXRX).** Post-Exscientia merger (July 2025), the largest pure-play public AI drug-discovery company. Five differentiated clinical programs entering 2026; >$500M earned in upfront and milestone payments to date; cash runway into early 2028. Strategic partnerships with Bayer ($1.5B), Roche/Genentech, and others. The Recursion phenomic-screening + Exscientia precision-chemistry stack is the canonical "AI-platform-of-record" reference for Big Pharma collaborations.

**Isomorphic Labs.** Google DeepMind spinout focused on AlphaFold-derived drug discovery. **$600M first external raise** plus **$2.9B combined Eli Lilly + Novartis research partnerships** ($1.75B Lilly alone). Internal pipeline targeting cancer and autoimmune disease. The structural-biology incumbent for AI drug discovery, with an unusual capital structure (still substantially Alphabet-backed) that lets it invest at a longer time horizon than VC-backed peers.

**Insilico Medicine.** End-to-end generative-AI drug discovery + chemistry + clinical pipeline. Multiple clinical-stage candidates including INS018_055 (idiopathic pulmonary fibrosis). Strong Asian footprint; selected as a 2025 biotech IPO candidate at multiple points.

**Insitro.** Daphne Koller-founded; machine-learning-first drug discovery. **Bristol Myers Squibb expanded partnership October 2025** specifically for ALS. Strong reputation among quantitative-biology talent.

**Generate Biomedicines.** Generative-protein design platform. **GB-0895 entered Phase III December 2025** as the first AI-derived antibody at that stage; **Novartis $1B+ collaboration**. Key proof point for the entire category.

**Atomwise.** AtomNet — structure-based small-molecule binding prediction at scale. Internal candidates progressing alongside platform partnerships.

**BenevolentAI.** Knowledge-graph + literature-mining + ML platform; AstraZeneca partnership for target identification + drug repurposing. Public-listed in the UK with a more service-oriented business model than the U.S. peers.

**Owkin.** French/U.S. federated-learning platform with strong oncology partnerships and a hospital-network data-access strategy.

**Other named players:** XtalPi (China; cryptography + AI), Standigm (Korea), PeptiDream (Japan; peptides), Schrödinger (computational chemistry; the longest-tenured incumbent in the broader category).

### The Big Pharma incumbents

All ten of the world's largest pharmaceutical companies now have internal AI/ML teams ranging from 50 to 500+ people. The named programs include:

- **Pfizer** — internal AI/ML teams; multiple platform partnerships.
- **Novartis** — Biome platform; Isomorphic + Generate partnerships; Lab of the Future initiative.
- **Roche** — pRED computational platform; Genentech partnerships.
- **AstraZeneca** — BenevolentAI partnership; AI-augmented R&I and oncology programs.
- **Eli Lilly** — Isomorphic Labs $1.75B partnership.
- **Bayer** — Recursion $1.5B partnership; internal AI/ML expansion.
- **Bristol Myers Squibb** — Insitro expanded partnership (October 2025, ALS).
- **Merck & Co.** — internal AI/ML teams; multiple academic partnerships.
- **GSK** — AI Hub London; multiple internal initiatives.
- **Sanofi** — Aily Labs partnership; manufacturing AI initiatives.

The pattern is consistent: every Big Pharma now has an in-house AI/ML organization and at least one external platform partnership. This is the same dual-incumbent dynamic documented in the perea.ai canon's Dual Incumbent Dynamic Playbook (#30) — and pharma's expression of it is more capital-intensive than any other vertical.

### The cloud + infrastructure incumbents

**NVIDIA BioNeMo** — pharma-specific generative-AI platform; integrated into AWS, GCP, Azure pharma-cloud offerings. **AWS HealthOmics** — pharmacovigilance, clinical-trial, and genomics platforms. **Google Cloud Healthcare/Life Sciences** — Isomorphic Labs anchor + multiple Big Pharma migrations. **Microsoft Cloud for Healthcare** — clinical-trial design tools + pharma manufacturing analytics.

### The disruptor map

Three categories of disruptor are worth tracking:

1. **AI-research-tool startups** for individual scientists (Genmab assistants, BioStrand, Causaly, BioRender AI, Iktos). Lower per-deal value but accessible self-serve PLG motion; equivalent of the legal-vertical mid-market disruptor pattern.
2. **Vertical-clinical-AI startups** for trial design, biomarker discovery, real-world-evidence generation, and patient-stratification (Owkin, Tempus, ConcertAI, Aetion, Flatiron Health). Tempus crossed the public-company threshold in 2024; the category is now a real adjacent market.
3. **Manufacturing + QC AI startups** for batch-record analytics, deviation investigation, process validation, and quality control (Atomic AI in process; Aizon; Datacor; emerging MES-AI integrators). The most under-built sub-vertical in the pharma stack.

---

## Part IV: Production Deployments

### Late-stage clinical AI-derived candidates

- **GB-0895 (Generate Biomedicines)** — anti-TSLP antibody; severe asthma; entered Phase III December 2025. **First AI-derived antibody at Phase III.**
- **INS018_055 (Insilico Medicine)** — idiopathic pulmonary fibrosis; AI-discovered novel target plus AI-designed molecule; Phase II/III.
- **Recursion clinical programs** — five differentiated programs entering 2026 with defined milestones.
- **Isomorphic Labs** — internal pipeline targeting cancer and autoimmune disease (specific candidates undisclosed at the time of writing).

### Production R&D deployments

- **AlphaFold 3** is in production use across approximately every Big Pharma's structural-biology teams, with the most active programs at Roche, AstraZeneca, GSK, Pfizer, Novartis, Eli Lilly, Bayer, BMS, Merck, and Sanofi.
- **NVIDIA BioNeMo** is deployed across multiple Big Pharma R&D organizations as the generative-AI infrastructure layer, with Pfizer, AstraZeneca, and Amgen named as users.
- **Recursion's RecursionOS** is in production use by Bayer and Roche/Genentech under named collaboration agreements.
- **Insilico Medicine Pharma.AI** is in production use by multiple Big Pharma partners under disclosed and undisclosed agreements.

### Production clinical-development AI

- **Tempus** for AI-augmented oncology trial design and patient stratification.
- **Owkin federated-learning platform** for hospital-network real-world-evidence generation.
- **Saama Technologies** for AI-augmented clinical data management (acquired by Hg Capital).
- **Medidata AI** for Acorn AI patient-data platform.
- **ConcertAI** for oncology RWD and trial-design support.

### Production manufacturing + QC AI

- **NVIDIA BioNeMo manufacturing** integrations at Sanofi and others.
- **Aizon AI-powered MES** at Lonza and other CMOs.
- **Aily Labs** at Sanofi for manufacturing analytics.
- **GE Healthcare Edison platform** for digital manufacturing analytics.

### What "production" means in pharma

The 30% autonomous-task ceiling documented in the perea.ai canon's cross-vertical operations papers also applies in pharma — but the regulatory regime makes the productive ratio look different:

- **In R&D / discovery (no GxP regime):** ~50-70% of the agentic suggestions (target hypotheses, hit prioritizations, structure designs) are accepted by scientists. Higher than other verticals because the human reviewer is highly trained and the cost of testing a wrong hypothesis is bounded by lab cost.
- **In clinical (GCP regime):** ~30% autonomous (consistent with the ceiling) for protocol drafting, statistical analysis plans, regulatory-document drafting; ~60-70% supervised; the rest triaged or rejected.
- **In manufacturing (GMP regime):** ~10-20% autonomous; the regulatory regime forces a much heavier human-review burden, and any agent that recommends a deviation classification or batch-disposition decision is gated behind a qualified-person sign-off.

---

## Part V: The Three Failure Modes

### Failure mode 1: the credibility assessment gap

The FDA's January 2025 draft guidance "Considerations for the Use of Artificial Intelligence to Support Regulatory Decision-Making for Drug and Biological Products" establishes a **7-step credibility assessment framework**:

1. Define the question of interest the AI model addresses.
2. Define its Context of Use.
3. Assess model risk based on model influence and decision consequence.
4. Develop a credibility assessment plan.
5. Execute the plan.
6. Document the assessment.
7. Assess model adequacy with remediation options if credibility is insufficient.

Founders shipping AI agents into pharma submission workflows must be able to deliver, on request, all seven artifacts. The most common failure pattern is shipping a tool with strong empirical performance but no defined Context of Use and no documented risk-tier assessment — the FDA position is that without these, the empirical performance is non-evaluable.

The January 2026 FDA + EMA joint "Guiding Principles of Good AI Practice in Drug Development" extends the framework to the full product lifecycle: human-centric design, fitness for purpose, risk-based validation, multidisciplinary expertise, robust data governance. These are now the regulatory floor for any AI tool used in regulated pharmaceutical workflows.

### Failure mode 2: the GxP audit-trail compliance gap

**21 CFR Part 11** governs electronic records, electronic signatures, and audit trails for any system used in submissions to FDA. The requirements include:

- **Validation** of the system to ensure consistent intended performance.
- **Audit trails** for all record creation, modification, and deletion — recorded automatically, time-stamped, attributable to a specific person.
- **Electronic signatures** that are unique, verifiable, and non-repudiable.
- **Access controls** by role.
- **Inspection readiness** — the records must be producible, in human-readable form, on FDA request.

Default LangChain, AutoGen, CrewAI, LlamaIndex, and other agentic scaffolds **do not** generate 21 CFR Part 11-compliant audit trails by default. Any founder selling AI agents into clinical, manufacturing, or regulatory workflows must build:

1. A **PHI/data gateway** logging every input and output with timestamp, user identity, and business-justification metadata.
2. **Write-once audit logs** separate from application logs (object-locked S3, append-only PostgreSQL, or equivalent).
3. **Audit-completeness CI/CD gates** that block deployment of any agent path that does not log to the audit layer.
4. **Validation evidence packages** (described below).
5. **Inspection-ready documentation** producible on agency request.

This is the same architectural pattern documented in the healthcare-agent-incidents-and-compliance paper (#35), translated from HIPAA §164.312(b) to 21 CFR Part 11. The five-control compliance layer is identical; only the regulator and the regulated artifact differ.

### Failure mode 3: the validation evidence package gap

Pharmaceutical sponsors using AI must assemble validation evidence packages for any submission-relevant AI tool. The packages must cover:

- Complete documentation of data sources and pre-processing.
- Model design, training, and architecture details.
- Performance metrics and validation test results.
- Change-control records.
- Human review annotations.
- Audit trails.
- Versioning and reproducibility records.

Vendors who do not deliver these as a standard part of their offering are not deployable in regulated workflows. The validation evidence package is, at this point, the single most under-supplied artifact in the pharma AI vendor ecosystem — and the founders who deliver it as a packaged-and-priced offering will have a structural advantage over those who do not.

The **EU GMP Annex 22 (PIC/S draft, expected finalization 2026)** explicitly governs AI/ML in GMP and adds: oversight committees with AI-specific expertise, risk management for AI changes (model retraining, prompt updates, data drift), explainability requirements, and continued performance monitoring. Any vendor selling into European pharma manufacturing operations must build to Annex 22 — and U.S. founders should expect FDA to converge toward similar manufacturing-specific guidance over 2026-2027.

---

## Part VI: The MLP Communities

The minimum-lovable-product community for pharma AI agents is concentrated in eight high-density venues:

1. **JPMorgan Healthcare Conference (San Francisco, January)** — the single most concentrated annual gathering of pharma + biotech executives in the world; AI partnership announcements and platform deals concentrate here.
2. **BIO International Convention (June)** — global biotech industry's flagship; partnering meetings and strategic-relationship building.
3. **AACR (American Association for Cancer Research)** — oncology research; the dominant scientific conference for cancer AI partnerships.
4. **ASH (American Society of Hematology)** — blood cancers; complement to AACR.
5. **DIA (Drug Information Association)** — clinical development, regulatory, and pharmacovigilance; the canonical venue for clinical-AI vendors.
6. **ASCPT (American Society for Clinical Pharmacology and Therapeutics)** — clinical pharmacology AI; smaller but high-density audience.
7. **PharmaSUG / PHUSE** — pharmaceutical statistical computing and biostatistics communities; the venue for clinical-AI with biostats focus.
8. **ISPE / PDA** — manufacturing and quality communities; ISPE conferences are the venue for manufacturing-AI vendors.

The discovery rule is: a founder selling into pharma should be **attending at least one of JPM, BIO, and AACR/ASH per year**, depending on therapeutic-area focus, and producing public artifacts (white papers, scientific posters, peer-reviewed publications) at the cadence of one substantive scientific contribution per year minimum. Pharma is unusually science-intensive in its buying decisions — the scientific publication record substitutes for the case-study production discipline that drives sales motion in legal, healthcare, and other verticals.

Adjacent media surfaces include **Endpoints News, STAT News, BioCentury, FierceBiotech, Pharmaphorum, Drug Discovery Today, GEN, Pink Sheet, and PharmaLetter**. Coverage in these moves pharma corporate-development attention.

---

## Part VII: GTM Decision Tree

A founder selling AI agents into pharma must pick exactly one of five paths on day one. The five paths:

```
                    Pharma AI Agents
                          │
       ┌──────────┬───────┼─────────┬───────────┐
       │          │       │         │           │
   Research    Target  Clinical  Manufacturing/ Regulatory
   tools     discovery  trials      QC AI       affairs AI
   vendor   co-develop  automation
       │          │       │         │           │
   No GxP    Milestone   GCP      GMP, 21CFR11  Submission-
   gate     payments,   regime,   Annex 22      grade audit
   $50K-     equity,    21CFR11,  data integ,   trail, no
   $2M       revenue    audit     ALCOA+        patient data
   ARR       share      trail
   PLG       BD-led    Regulated  Regulated    Pilot + ARR
   motion    capital   sale       sale         expand
   possible  intensive
```

The branching logic:

1. **Research-tool vendor** — sell to research scientists for discovery, target ID, hit-to-lead, etc. **No patient data, no GxP gate.** Reference deal size: $50K-$2M annual license. PLG motion possible (per-seat or per-project licensing). Examples: BenchSci, Causaly, Genmab assistants. Most accessible path for a sub-50-engineer founder; lowest deal size; fastest sales cycle.
2. **Target-discovery co-development** — joint discovery partnerships with milestone payments and revenue share. **The Recursion / Insilico / Isomorphic / Generate / Insitro pattern.** Reference deal size: $50M-$1.75B+ in committed value. Capital-intensive; requires a scientific platform that can credibly anchor a Big Pharma partnership; sales cycle is 12-24 months. Most rewarding path; least accessible without prior pharma credibility.
3. **Clinical-trial automation** — protocol drafting, biostatistics, data management, patient stratification, real-world-evidence generation. **GCP regime; 21 CFR Part 11 mandatory; CRO partnership often required.** Reference deal size: $500K-$25M per study or platform deployment. Sales cycle 6-12 months; cleared-CRO-engineering bench helps accelerate.
4. **Manufacturing/QC AI** — batch-record analytics, deviation investigation, process validation, quality-control data review. **GMP regime; 21 CFR Part 11 + Annex 22 mandatory; data integrity (ALCOA+) requirements.** Reference deal size: $250K-$15M. Most regulated; longest sales cycle (12-24 months); best technical moat once deployed; under-supplied category.
5. **Regulatory-affairs AI** — submission authoring, eCTD assembly, agency-response generation, regulatory intelligence. **No patient data, but submission-grade audit trail required.** Reference deal size: $250K-$5M annual license. Pilot-then-expand motion; growing category as agency interactions migrate to more complex AI-augmented workflows.

The two paths that maximize accessibility-to-velocity for a sub-100-engineer founder are **research-tool vendor** (PLG-friendly, lower regulatory burden) and **regulatory-affairs AI** (no patient data, submission-grade discipline). These two paths together account for the majority of accessible vertical-AI revenue in pharma for new entrants without prior pharma credibility.

The two paths that founders most often misjudge are **target-discovery co-development** (founders underestimate the scientific-platform credibility and capital required) and **clinical-trial automation** (founders underestimate the GCP-regulatory perimeter and CRO partnership requirement). Both are real markets but neither is appropriate as a first vertical for a non-pharma-native founder.

---

## Closing thread

This paper closes the open vertical thread for pharma + drug discovery in the perea.ai canon. With this entry, the State of Vertical Agents series now spans eight verticals (legal, insurance, healthcare, accounting, CRE, construction, government, pharma) — covering the majority of high-TAM addressable vertical-AI markets in 2026.

It also surfaces three threads for future papers in the canon:

1. **The pharma manufacturing AI playbook** — a focused entry on the GMP regime, Annex 22, ALCOA+, and the manufacturing-AI vendor stack would deserve its own paper. Manufacturing AI is the most under-built sub-vertical in pharma, and the regulatory perimeter is the main differentiator for vendors who can navigate it.
2. **The clinical-trial-automation playbook** — similarly, a focused entry on GCP, ICH E6(R3), and CRO-vendor co-deployment patterns would deserve its own paper.
3. **The federated-learning playbook for regulated verticals** — the Owkin pattern of federating learning across hospital networks (or pharma-network proprietary datasets) without centralizing patient data is a cross-vertical pattern that applies to healthcare, pharma, and financial services. A standalone playbook on this technique is a candidate for the next derivation pass.

The implementation gap chasm pattern from the cross-vertical operations canon (60-70 percentage-point gap between pilot adoption and production achievement) operates in pharma too — but the gap there is dominated by **validation evidence packages and credibility assessment plans**, not technology. A founder who can compress a pharma sponsor's path-to-deployment from 9 months to 3 months by pre-packaging credibility assessment + 21 CFR Part 11 audit infrastructure + validation evidence into a single offering will outrun every competitor who is still selling raw model access. That compression is the present opportunity in 2026.

---

## References

1. **Recursion-Exscientia merger** — completed July 2025; integrated phenomic screening + automated precision chemistry into a single end-to-end platform.
2. **Recursion 2025 Q4 financial results** — five differentiated clinical programs, >$500M earned in upfront and milestones, cash runway into early 2028.
3. **Bayer-Recursion partnership** — $1.5B committed value across multiple disease areas.
4. **Isomorphic Labs $600M first external raise** — based on AlphaFold-derived drug discovery.
5. **Eli Lilly + Isomorphic Labs partnership** — $1.75B for novel small-molecule discovery.
6. **Novartis + Isomorphic Labs partnership** — combined Lilly + Novartis $2.9B in research collaboration value.
7. **Generate Biomedicines GB-0895** — anti-TSLP antibody for severe asthma; entered Phase III December 2025; first AI-derived antibody at Phase III.
8. **Generate Biomedicines + Novartis partnership** — $1B+ for protein-based therapeutics design.
9. **Bristol Myers Squibb + Insitro expanded partnership** — October 2025; ALS focus.
10. **FDA "Considerations for the Use of Artificial Intelligence to Support Regulatory Decision-Making for Drug and Biological Products"** — January 2025 draft guidance establishing the 7-step credibility assessment framework.
11. **FDA + EMA "Guiding Principles of Good AI Practice in Drug Development"** — January 2026; 10 high-level principles for AI in drug development.
12. **EU GMP Annex 22 (PIC/S draft)** — finalization expected 2026; AI/ML in GMP manufacturing.
13. **21 CFR Part 11** — electronic records, electronic signatures, audit-trail requirements for FDA submissions.
14. **ALCOA+** — data-integrity framework: Attributable, Legible, Contemporaneous, Original, Accurate + Complete, Consistent, Enduring, Available.
15. **AI in drug discovery market sizing** — $1.9B 2025; $2.6B 2026 projected; $16.5B 2034 forecast at 27% CAGR.
16. **Insilico Medicine INS018_055** — idiopathic pulmonary fibrosis; AI-discovered target + AI-designed molecule; Phase II/III.
17. **AstraZeneca + BenevolentAI partnership** — target identification and drug repurposing.
18. **NVIDIA BioNeMo** — pharma-specific generative-AI platform; integrated into AWS, GCP, Azure pharma-cloud offerings.
19. **JPMorgan Healthcare Conference, BIO International, AACR, ASH, DIA** — primary MLP-community conferences.
20. **Endpoints News, STAT News, BioCentury, FierceBiotech** — primary trade-press surfaces for pharma AI vendor coverage.
