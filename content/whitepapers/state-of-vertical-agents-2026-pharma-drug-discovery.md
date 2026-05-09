---
title: "State of Vertical Agents 2026: Pharma & Drug Discovery"
subtitle: "Recursion-Exscientia, Isomorphic Labs $600M, Generate Biomedicines GB-0895 Phase 3, Insilico Rentosertib in Nature Medicine, Insitro-BMS $2B ALS extension — and the FDA-EMA joint AI guidance plus EU GMP Annex 22 that landed in 2025-2026"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "2.0"
status: "Public draft"
date: "2026-05"
audience: "Founders, GTM leads, and product teams selling AI agents into pharma R&D and biotech — plus operators evaluating drug-discovery, clinical-development, and pharmaceutical-manufacturing adjacencies."
length: "~5,800 words"
license: "CC BY 4.0"
description: "A fully-cited 2026 field manual on AI agents in pharma + drug discovery. Maps the Recursion-Exscientia integration (closed November 20, 2024) and post-merger pipeline rationalization, Isomorphic Labs' $600M first external raise (March 31, 2025) plus Eli Lilly + Novartis collaborations totaling up to $2.9B in milestones, Generate Biomedicines' GB-0895 SOLAIRIA Phase 3 program initiation (December 1, 2025) as the first AI-engineered biologic at Phase 3, Insilico Medicine's Rentosertib Phase IIa publication in Nature Medicine (June 3, 2025), the Insitro-Bristol Myers Squibb ALS collaboration extension (October 14, 2025) at up to $2B in milestone potential, the FDA-EMA Joint Guiding Principles of Good AI Practice in Drug Development (January 14, 2026), the FDA's seven-step risk-based credibility assessment draft guidance (January 7, 2025), the EU GMP Annex 22 consultation draft (July 7, 2025), 21 CFR Part 11 electronic-records requirements, and the three failure modes that gate every pharma AI deployment."
profile: "field-manual"
dateModified: "2026-05-09"
version_history:
  - { version: "1.0", date: "2026-05-07", note: "initial publication" }
  - { version: "2.0", date: "2026-05-09", note: "complete rewrite with primary-source URL citations on every claim; corrects Recursion-Exscientia merger close date (Nov 20 2024 not July 2025), Isomorphic Labs raise date (Mar 31 2025), Generate GB-0895 status (Phase 3 program initiation announced not Phase 3 fully entered), Insilico Rentosertib status (Phase IIa published Jun 3 2025 not Phase III)" }
topical_entities:
  - "Recursion Pharmaceuticals"
  - "Exscientia"
  - "Isomorphic Labs"
  - "Generate Biomedicines"
  - "Insilico Medicine"
  - "Insitro"
  - "Bristol Myers Squibb"
  - "FDA AI guidance"
  - "EMA AI guidance"
  - "EU GMP Annex 22"
  - "21 CFR Part 11"
  - "AI drug discovery"
keywords:
  - "AI drug discovery 2026"
  - "Recursion Exscientia merger"
  - "Isomorphic Labs Eli Lilly Novartis"
  - "Generate Biomedicines GB-0895 Phase 3"
  - "Insilico Rentosertib Nature Medicine"
  - "FDA EMA AI guiding principles"
  - "FDA AI credibility assessment seven-step"
  - "EU GMP Annex 22 PIC/S"
  - "21 CFR Part 11 AI compliance"
  - "Insitro Bristol Myers Squibb ALS"
---

## Foreword

This is the eighth entry in the State of Vertical Agents series and the version 2.0 rewrite of the Pharma & Drug Discovery paper — every claim now carries an inline citation to a primary or named secondary source. Pharma has been conspicuously absent from the perea.ai canon until this rewrite, even though it has the strongest economic case for AI agents of any vertical: a target costs hundreds of millions of dollars to push to a development candidate, the median preclinical-to-Phase-III timeline is over a decade, and most candidates fail. A modest improvement in any one of those numbers, applied at scale, is a multibillion-dollar swing in industry economics.

The vertical also has the strongest near-term proof points of any market we have covered. Insilico Medicine published peer-reviewed Phase IIa results for the first AI-discovered, AI-designed small-molecule (Rentosertib, ISM001-055) in *Nature Medicine* on June 3, 2025[^38][^39][^40]. Generate Biomedicines announced the global Phase 3 SOLAIRIA-1 and SOLAIRIA-2 programs for GB-0895 on December 1, 2025 — the first AI-engineered biologic to enter Phase 3 development[^13][^14][^15]. The narrative pivoted from "AI might find drugs" to "AI is finding drugs that are now in late-stage trials with named indication targets and disclosed primary-endpoint data."

This paper is for founders deciding whether the pharma vertical is accessible, what the buying map looks like, and where the present opportunity lives.

## Executive Summary

1. **Pharma AI is a producing market in 2026, not a promising one.** Insilico's Rentosertib delivered a Phase IIa primary-endpoint outcome and a +98.4 mL forced vital capacity gain at 60 mg QD versus a -20.3 mL placebo decline in idiopathic pulmonary fibrosis, published in *Nature Medicine*[^38][^39]. Generate Biomedicines began the global Phase 3 SOLAIRIA program for GB-0895 in approximately 1,600 severe-asthma patients across 40+ countries[^13][^14]. Recursion entered 2026 with six active development programs after merging with Exscientia and rationalizing the combined pipeline[^4]. The credibility narrative has changed.

2. **Capital concentrated through 2024-2025 around three platform plays.** The Recursion-Exscientia all-stock merger closed November 20, 2024[^1][^6], creating a combined company with approximately $850 million in cash at announcement[^2] and ten clinical/preclinical programs at close[^1]. Isomorphic Labs raised $600 million in its first external funding round on March 31, 2025, led by Thrive Capital with GV and Alphabet participation[^7][^8][^12]. Isomorphic's January 2024 partnerships — Eli Lilly ($45M upfront, up to $1.7B milestones) and Novartis ($37.5M upfront, up to $1.2B milestones) — total up to $2.9 billion in committed Big Pharma collaboration value, and the Novartis collaboration was expanded with three additional research programs in February 2025[^7][^9][^11].

3. **The FDA + EMA published joint AI guidance in January 2026, and it is the regulatory floor every founder must build to.** The "Guiding Principles of Good AI Practice in Drug Development," published January 14, 2026[^18][^19][^20], articulate ten principles spanning the full drug-product life cycle: human-centric by design, risk-based approach, adherence to standards, clear context of use, multidisciplinary expertise, data governance and documentation, model design and development practices, risk-based performance assessment, life cycle management, and clear essential information[^18]. Combined with FDA's January 7, 2025 draft guidance establishing the seven-step risk-based credibility assessment framework[^25][^26][^27], the regulatory perimeter for AI in drug submissions is now legible.

4. **EU GMP Annex 22 (PIC/S consultation draft, July 7, 2025) governs every AI agent that touches GMP-regulated pharmaceutical manufacturing.** Annex 22 was published as a consultation draft on July 7, 2025; comments closed October 7, 2025[^33][^34]. The annex applies to AI/ML models in critical GMP applications, restricts AI to static deterministic models for critical use, prohibits generative AI and large language models in critical GMP applications, and requires explicit intended-use definition, test-data independence, explainability, and human-in-the-loop oversight[^31][^32][^36][^37]. Final guidelines are anticipated mid-2026, in parallel with EU AI Act high-risk-system obligations applying from August 2026[^35].

5. **The Big Pharma buying map is named and reachable.** Eli Lilly[^7][^9], Novartis[^7][^11], and Bristol Myers Squibb[^44][^45][^48] each have public AI-discovery partnerships at multibillion-dollar milestone scale. The Insitro-BMS collaboration extension announced October 14, 2025 carries up to $20 million in new funding and aggregate milestone potential exceeding $2 billion in discovery, development, regulatory, and commercial milestones for ALS[^44][^45][^46]. The buying surface is named and listed; the constraint is technical credibility, not buyer discovery.

6. **Three failure modes gate every pharma AI deployment.** First, the credibility-assessment gap: FDA's seven-step framework requires a defined Context of Use, model risk tier, credibility assessment plan, executed plan, documented results, and adequacy determination — not a checkbox[^25][^28][^29][^30]. Second, the GxP audit-trail compliance gap: 21 CFR Part 11 mandates electronic records, electronic signatures, secure computer-generated time-stamped audit trails, and validation of any system used to create, modify, maintain, or transmit electronic records under FDA predicate rules[^52][^53]. Third, the validation evidence package gap: Annex 22 compliance requires demonstrating intended use, test-data independence, validation against representative datasets, sufficient explainability, and lifecycle monitoring[^31][^36][^37].

7. **The five-path GTM decision tree separates accessible markets from moonshots.** Founders selling AI agents into pharma must pick: (1) research-tool vendor (research scientists, no patient data, no GxP gate); (2) target-discovery co-development (joint discovery with milestone payments, the Recursion / Insilico / Insitro pattern); (3) clinical-trial automation (CRO-adjacent, GCP regime, audit trail mandatory); (4) manufacturing/QC AI (GMP regime, 21 CFR Part 11 plus Annex 22 mandatory); or (5) regulatory-affairs AI (no patient data but submission-grade audit trails). Each has a distinct sales motion, price point, and compliance regime.

---

## Part I: The Market

The pharma AI market is structurally bifurcated in 2026. On one side, a handful of vertically-integrated platform plays — Recursion, Isomorphic Labs, Generate Biomedicines, Insilico Medicine, and Insitro — concentrate the capital, the regulatory standing, and the proof-of-concept clinical readouts. On the other side, hundreds of point-tool vendors compete on price, modality, and turnaround. The gap between them widened through 2024-2025 as platform capital concentrated and Phase II-III readouts arrived. The credibility threshold separating producing platforms from research-tool vendors is now legible to founders, investors, and Big Pharma procurement.

### Topline TAM

Analyst estimates of the AI-in-drug-discovery market disperse widely, which is itself a finding worth documenting. Grand View Research estimated the market at $2.35 billion in 2025 with a forecast of $13.77 billion by 2033 at a 24.8% CAGR[^51]. Precedence Research's broader-scope estimate reaches $19.89 billion in 2025 with a forecast of $160.49 billion by 2035 at a 23.22% CAGR[^50]. The dispersion reflects definitional differences — "AI in drug discovery" includes everything from a single AlphaFold inference call to a full-stack platform-and-services deal, and analysts disagree on what counts.

The economic prize behind these platform-and-services TAMs is two orders of magnitude larger. Pharma R&D global spending runs in the hundreds of billions of dollars per year; even a single-digit-percent productivity improvement across hit rates, preclinical timelines, trial enrollment, or attrition produces a multibillion-dollar swing in industry economics — and explains why Big Pharma has signed multibillion-dollar milestone deals with Isomorphic Labs[^7], Generate Biomedicines, Insitro[^45], Insilico Medicine, and the merged Recursion-Exscientia entity[^1][^2].

### Capital flows

Three platform plays dominate the 2024-2025 capital picture. **The Recursion-Exscientia merger** announced August 8, 2024[^2] and closed November 20, 2024[^1][^6] is the largest pure-AI life-sciences M&A transaction to date. The all-stock structure exchanged 0.7729 Recursion shares per Exscientia ordinary share[^2], leaving Recursion shareholders with approximately 74% of the combined company and Exscientia shareholders with approximately 26%[^2]. The merger combined approximately $850 million in cash and projected approximately $100 million in annual synergies extending the cash runway into 2027[^2]. The transaction was valued at approximately $688 million by *Pharmaphorum*[^5] and $700 million by MedPath[^6]. Recursion entered 2026 with six active development programs after deprioritizing three clinical-stage programs (REC-2282, REC-994, REC-3964) and pausing REC-4539 in May 2025 — a disciplined post-merger rationalization rather than a continuation of the announced ten-readout pipeline[^4].

**Isomorphic Labs raised $600 million** in its first external funding round on March 31, 2025, led by Thrive Capital with participation from GV and follow-on capital from existing investor Alphabet[^7][^8][^12]. The proceeds are intended to fund development of the next-generation AI drug-design engine and advance therapeutic programs into clinical development[^7]. Isomorphic's commercial validation rests on two January 2024 partnerships: **Eli Lilly** ($45M upfront, up to $1.7B in milestones)[^9][^11] and **Novartis** ($37.5M upfront, up to $1.2B in milestones)[^9][^11]. The Novartis collaboration was expanded with three additional research programs in February 2025, maintaining the original financial terms[^11]. Combined potential collaboration value across Lilly and Novartis: up to $2.9 billion in milestones[^7][^9][^11].

**Generate Biomedicines** announced the SOLAIRIA-1 and SOLAIRIA-2 global Phase 3 program for GB-0895 on December 1, 2025[^13][^14][^16]. The trials will enroll approximately 1,600 patients with severe asthma across more than 40 countries in North America, Europe, Latin America, and Asia Pacific, evaluating GB-0895 (300 mg subcutaneous every six months) versus placebo over 52 weeks, with a primary endpoint of reduction in annualized clinically-significant asthma exacerbation rate[^13][^14]. Phase 1 data presented at the European Respiratory Society International Congress 2025 in Amsterdam showed an approximately 89-day half-life and sustained TSLP biomarker suppression supporting twice-yearly dosing[^15][^17]. GB-0895 is the first AI-engineered biologic candidate to advance to global Phase 3 development[^15]. Patent No. 12,110,324 has been issued by the U.S. Patent and Trademark Office[^13].

### Why now

The credibility tipping point arrived between June 2025 and December 2025. **June 3, 2025**: Insilico Medicine's Rentosertib Phase IIa results were published in *Nature Medicine* (impact factor 58.7) and presented at the American Thoracic Society 2025 conference[^38][^39][^40]. The GENESIS-IPF trial enrolled 71 patients with idiopathic pulmonary fibrosis across 22 sites in China, randomized to placebo or 30 mg QD, 30 mg BID, or 60 mg QD over 12 weeks[^38][^39]. The 60 mg QD arm showed a +98.4 mL mean increase in forced vital capacity (95% CI 10.9 to 185.9) versus a -20.3 mL mean decline in the placebo arm (95% CI -116.1 to 75.6)[^38][^39][^41]. Treatment-emergent adverse-event rates were comparable across treatment groups (72.2%, 83.3%, 83.3%, 70.6%)[^39]. ClinicalTrials.gov registration: NCT05938920[^39]. Insilico is recruiting a follow-on Phase II trial across nine US sites with a target of 60 participants[^42].

**October 14, 2025**: Insitro extended its Bristol Myers Squibb research collaboration for ALS, with up to $20 million in new funding for the one-year extension and aggregate milestone potential exceeding $2 billion in discovery, development, regulatory, and commercial milestones plus royalties[^44][^45][^48]. The original 2020 collaboration identified novel ALS targets via Insitro's machine-learning-based platform; BMS exercised an option in December 2024 to advance one target, triggering a $25 million milestone payment[^47]. The October 2025 extension activates the ChemML drug-design platform on a novel target identified during the first biological-evaluation phase[^45][^48].

**December 1, 2025**: Generate Biomedicines announced the SOLAIRIA Phase 3 initiation for GB-0895[^13][^14] — the first AI-engineered biologic to advance to global Phase 3 development.

**January 14, 2026**: FDA and EMA jointly published the Guiding Principles of Good AI Practice in Drug Development[^18][^19][^20] — the international regulatory floor for AI in pharma R&D.

That cluster of events compressed into seven months is what changed the credibility narrative.

---

## Part II: The Buying Map

The pharma buying surface is small, named, and reachable. Big Pharma sponsors with active multibillion-dollar AI-discovery commitments include Eli Lilly, Novartis, Bristol Myers Squibb, Roche, Sanofi, and Merck KGaA. Beyond Big Pharma, biotech sponsors at clinical stage, contract research organizations, and contract manufacturing organizations form the secondary tier. The constraint for AI-vendor founders is not buyer discovery — every sponsor is publicly named and accessible — it is meeting the technical credibility threshold each tier imposes during procurement diligence on validation evidence, audit-trail capture, and regulatory-package readiness.

### Big Pharma R&D — discovery and target identification

The named buyers with active AI-discovery partnerships at multibillion-dollar milestone scale: **Eli Lilly** (Isomorphic Labs collaboration, $45M upfront + up to $1.7B milestones, January 2024)[^7][^9][^11]; **Novartis** (Isomorphic Labs, $37.5M upfront + up to $1.2B milestones, January 2024; expanded February 2025)[^7][^11]; **Bristol Myers Squibb** (Insitro, original 2020 collaboration extended October 2025, aggregate milestone potential exceeding $2B for ALS)[^44][^45][^48]; **Sanofi** and **Merck KGaA** (legacy Exscientia partnerships now part of Recursion)[^3]; **Roche** (Recursion partnership)[^3].

### Big Pharma — preclinical and translational

This is the segment where Recursion and Insilico operate. Recursion's combined-company partnership stack at merger close held more than ten partnered programs across oncology and immunology with approximately $450 million in upfront and milestone payments received and potential for more than $20 billion in additional milestone payments before royalties[^1]. The May 2025 pipeline rationalization narrowed Recursion's wholly-owned active development to six programs in cancer and rare disease[^4].

### Big Pharma — clinical development

Generate Biomedicines' GB-0895 SOLAIRIA program is the canonical reference for what "AI-engineered biologic at Phase 3" looks like in 2026: a 1,600-patient, 40+-country, twice-yearly dosing protocol against an 89-day half-life biological substrate[^13][^14][^17]. Insilico's GENESIS-IPF program is the canonical reference for "AI-discovered small molecule with peer-reviewed Phase IIa results"[^38][^39].

### Big Pharma — manufacturing and quality

The buying map for AI in pharmaceutical manufacturing is governed by EU GMP Annex 22 (PIC/S consultation draft July 7, 2025; comments closed October 7, 2025; final expected mid-2026)[^33][^34][^35] and 21 CFR Part 11 (1997 regulation, ongoing FDA enforcement)[^52][^53]. Annex 22 limits AI in critical GMP applications to static deterministic models, prohibits generative AI and large language models in critical applications, and requires intended-use definition, test-data independence, explainability, and human-in-the-loop oversight[^31][^36][^37]. The combined effect: AI agents that touch batch disposition, quality control decisions, deviation classification, or release testing must be deployed under static-model architectures with full validation packages, not under default LangChain or AutoGen scaffolds.

### Biotech — pre-clinical to Phase II

Insilico Medicine's Phase IIa publication establishes that an AI-discovered, AI-designed small-molecule can produce peer-reviewed clinical proof-of-concept[^38][^39]. The buying motion at this stage is co-development partnerships rather than tools sold to research scientists.

### Pharma services — CROs, CMOs, regulatory consulting

This segment is downstream of the Big Pharma buying decisions and is governed by Good Clinical Practice (GCP), Good Laboratory Practice (GLP), and Good Manufacturing Practice (GMP) — all of which inherit 21 CFR Part 11 electronic-records and electronic-signature requirements when records are maintained electronically[^52][^53].

### What is *not* in the buying map

Direct-to-patient pharma AI is not a 2026 vertical for AI agent founders. The buying surface is the pharma sponsor (covered above), the CRO (covered above), or the regulator (an entirely different deal motion that is not founder-velocity-friendly).

---

## Part III: The Incumbent + Disruptor Topology

The pharma AI vendor topology is clearer in 2026 than at any prior moment. Five pure-play AI-discovery platforms hold the platform tier; six named Big Pharma incumbents hold the buyer tier; a small number of cloud and infrastructure providers occupy the substrate tier. The disruptor opportunity for new founders is not to build a sixth horizontal AI-discovery platform competing with the incumbents head-on. It is to occupy a vertical-specific therapeutic-area seam, a compliance-specific GxP-substrate seam, or a path the platform tier has not yet entered such as manufacturing AI under EU GMP Annex 22.

### The pure-play AI-discovery platforms

**Recursion** (RXRX, post-merger including Exscientia capabilities and pipeline)[^1][^2]. **Isomorphic Labs** (private, Alphabet-backed, $600M external raise March 2025)[^7][^12].

**Generate Biomedicines** (private, Flagship Pioneering portfolio, GB-0895 in Phase 3 SOLAIRIA program)[^13][^14]. **Insilico Medicine** (private, Pharma.AI platform, Rentosertib Phase IIa published in *Nature Medicine*)[^38][^39].

**Insitro** (private, ChemML platform, BMS collaboration extended October 2025)[^44][^45].

### The Big Pharma incumbents

Eli Lilly, Novartis, Bristol Myers Squibb, Roche, Sanofi, Merck KGaA — each with named multimillion-to-multibillion-dollar AI partnership commitments[^3][^7][^9][^11][^45][^48]. Big Pharma's strategic posture in 2026 is not to build internal AI platforms from scratch but to license capability through structured collaboration deals with the pure-play platforms.

### The cloud + infrastructure incumbents

**NVIDIA** provides computational support to the merged Recursion entity per MedPath analysis[^6]. Cloud platforms (AWS, Azure, GCP) host the regulated pipelines; their compliance posture is governed by HIPAA where patient data is touched and by 21 CFR Part 11 where electronic records under predicate rules are maintained[^52][^53]. The compliance burden is on the deploying entity, not the cloud — a vendor BAA permits the data flow but does not satisfy validation, audit-trail, electronic-signature, or change-control requirements[^53].

### The disruptor map

The disruptor pattern in 2026 is not "build a fifth pure-play AI-discovery platform competing with Recursion / Isomorphic / Generate / Insilico / Insitro." It is one of: (a) build deep in a single therapeutic area (e.g., neurology-specific iPSC platforms, oncology-specific protein engineering); (b) build the GxP-compliant audit-trail substrate that the AI-discovery platforms still lack and white-label it to them; (c) build for a path the pure-plays have not entered (manufacturing AI under Annex 22, clinical-trial automation under GCP, regulatory-affairs AI for submission-package authoring).

---

## Part IV: Production Deployments

### Late-stage clinical AI-engineered candidates

GB-0895 (Generate Biomedicines): SOLAIRIA-1 and SOLAIRIA-2, approximately 1,600 patients across 40+ countries, 300 mg subcutaneous every six months versus placebo over 52 weeks, primary endpoint annualized asthma exacerbation rate reduction[^13][^14][^16]. First AI-engineered biologic at global Phase 3[^15][^16].

### Production R&D deployments

Rentosertib (Insilico Medicine): Phase IIa GENESIS-IPF, 71 patients across 22 sites in China, primary endpoint met (TEAE rates comparable across arms), secondary endpoint signal in 60 mg QD arm with +98.4 mL FVC versus -20.3 mL placebo[^38][^39][^41]. AlphaFold 3 (Isomorphic Labs / Google DeepMind, May 2024): the foundational model used in Isomorphic's drug-design engine[^7]. AI-engineered antibody (Generate Biomedicines): U.S. Patent 12,110,324 issued for GB-0895[^13].

### Production clinical-development AI

The production floor for AI in clinical development is FDA's seven-step credibility assessment framework applied per Context of Use[^25][^28]: (1) define the question of interest; (2) define the Context of Use; (3) assess AI model risk; (4) develop a credibility-assessment plan; (5) execute the plan; (6) document results and discuss deviations; (7) determine the AI model's adequacy for the Context of Use[^29][^30]. The framework applies across nonclinical, clinical, post-marketing, and manufacturing phases of the drug-product lifecycle[^29].

### Production manufacturing + QC AI

The production floor here is EU GMP Annex 22 plus 21 CFR Part 11. Annex 22 (consultation draft July 7, 2025) limits critical-application AI to static deterministic models, prohibits generative AI and LLMs in critical GMP, and requires explicit intended-use definition, test-data independence, explainability, and HITL oversight[^31][^36][^37]. 21 CFR Part 11 (1997 regulation, eCFR Title 21) requires secure computer-generated time-stamped audit trails recording every operator action that creates, modifies, or deletes electronic records, with audit trails retained at least as long as the underlying record[^52]. Electronic signatures must be unique to one individual, linked to the underlying record so they cannot be excised or transferred, and certified to the agency before use[^52]. FDA's guidance on Part 11 scope and application notes that "predicate rules" — the underlying CGMP, GLP, GCP requirements — remain enforceable even where Part 11 enforcement discretion is exercised on specific provisions[^53].

### What "production" means in pharma

Production-grade in pharma is not "the model has shipped." Production-grade is "the model has shipped *and* the FDA / EMA / national regulator can audit the validation evidence package, the audit trails, the electronic signatures, the change-control records, and the lifecycle monitoring history." Default LangChain, AutoGen, CrewAI, and LlamaIndex scaffolds do not produce that evidence by default — production deployments require explicit instrumentation against the requirements in 21 CFR Part 11[^52][^53] and EU GMP Annex 22[^31][^36][^37].

---

## Part V: The Three Failure Modes

Three failure modes gate every pharma AI deployment regardless of GTM path. The first is the credibility-assessment gap, where vendors lack the documented FDA seven-step framework artifacts when sponsor regulatory affairs reviews the deployment for inclusion in a drug submission. The second is the GxP audit-trail compliance gap, where AI agents cannot produce inspection-ready audit trails capturing every model inference. The third is the validation evidence package gap, where Annex 22 documentation is incomplete. Each one is fatal at procurement; together they explain most pharma AI vendor non-renewals.

### Failure mode 1: the credibility assessment gap

FDA's January 7, 2025 draft guidance, "Considerations for the Use of Artificial Intelligence To Support Regulatory Decision-Making for Drug and Biological Products," establishes a seven-step risk-based framework for evaluating AI-model credibility[^25][^26][^27]. The framework defines model risk as the combination of model influence (the contribution of AI-generated evidence relative to other evidence) and decision consequence (the impact of an adverse outcome from an incorrect AI output)[^29][^30]. Founders building AI agents for pharma R&D who do not produce a documented credibility-assessment plan tied to a specific Context of Use will fail this gate when their pharma-sponsor customer's regulatory-affairs team reviews the deployment for inclusion in a drug submission. The FDA encourages early engagement to set expectations about credibility-assessment activities[^25][^28].

### Failure mode 2: the GxP audit-trail compliance gap

21 CFR Part 11 requires that any system creating, modifying, maintaining, archiving, retrieving, or transmitting electronic records under FDA predicate rules implement secure, computer-generated, time-stamped audit trails recording the date, time, and identity of operators making record changes[^52]. The audit trail must not obscure previously recorded information, must be retained at least as long as the underlying record, and must be available for FDA inspection[^52]. ALCOA+ data-integrity principles (attributable, legible, contemporaneous, original, accurate, plus complete, consistent, enduring, available) are the operational framework against which inspections are conducted[^53]. AI agents that do not capture model version, prompt content, output, confidence score, and operator identity at every inference point cannot satisfy this. The architectural answer is to build audit-trail capture as a first-class requirement, not a post-hoc instrumentation.

### Failure mode 3: the validation evidence package gap

Annex 22 expects pharma sponsors to demonstrate, for every AI/ML model used in critical GMP applications: (a) explicit intended-use definition with subject-matter-expert approval[^36][^37]; (b) test-data independence from training data, with technical controls preventing leakage[^37]; (c) representative-sample coverage including edge cases[^37]; (d) explainability with confidence scoring[^31][^36]; (e) performance metrics as stringent as the manual processes the AI replaces[^37]; (f) ongoing performance monitoring with retraining-trigger documentation[^31][^35][^37]. AI vendors that ship into pharma without delivering a validation evidence package satisfying all six are not deployable in regulated workflows.

---

## Part VI: The MLP Communities

The major pharma MLP (most-likely-purchaser) community surfaces remain stable in 2026: the **JPMorgan Healthcare Conference** (annual, January, San Francisco) for capital and partnership-deal flow; **BIO International Convention** (annual, June) for partnering and licensing; **AACR Annual Meeting** (American Association for Cancer Research) and **AACR Special Conferences** for oncology evidence presentation — Recursion presented REC-617 Phase 1 monotherapy safety and PK/PD data at the AACR Special Conference on December 9, 2024[^1]; the **American Thoracic Society International Conference** (Insilico's Rentosertib Phase IIa data was presented at ATS 2025[^38][^42]); the **European Respiratory Society International Congress** (Generate's Phase 1 data for GB-0895 presented at ERS 2025 in Amsterdam[^15][^17]); **ASH** (American Society of Hematology) for hematology programs; and **ASCO** (American Society of Clinical Oncology) for oncology. Founders building for the pharma vertical without a clinical-conference presentation cadence on their roadmap will not be taken seriously by the named buyers.

---

## Part VII: GTM Decision Tree

The five-path GTM decision tree separates the accessible markets from the moonshots:

**Path 1 — Research-tool vendor.** Sell to research scientists. No patient data. No GxP gate. Lower price points. Faster sales cycle. Examples: target-prediction tools, molecule-property-prediction APIs, RAG over scientific literature.

**Path 2 — Target-discovery co-development.** Joint discovery with milestone payments. The Recursion / Insilico / Insitro / Isomorphic pattern. Multi-year sales cycle. Multi-million-dollar upfronts. Multi-hundred-million to multi-billion-dollar milestone potential[^1][^7][^11][^44][^45].

**Path 3 — Clinical-trial automation.** CRO-adjacent. GCP regime applies. Audit trail mandatory. Electronic-signature requirements under 21 CFR Part 11 apply where records are maintained electronically[^52]. FDA's seven-step credibility-assessment framework applies for any AI used to support regulatory submissions[^25][^28].

**Path 4 — Manufacturing/QC AI.** GMP regime applies. EU GMP Annex 22 (PIC/S consultation draft July 7, 2025) governs[^33][^34]. 21 CFR Part 11 governs the electronic-records side[^52]. Static deterministic models only for critical applications[^31][^36]. The most regulated, most evidence-heavy of the five paths.

**Path 5 — Regulatory-affairs AI.** No patient data. Submission-grade audit trails. AI used for eCTD authoring, agency-response automation, draft document generation. Part 11 applies to the records[^52]. FDA's seven-step framework applies if AI output supports regulatory decision-making[^25].

Each path has a different sales motion, a different price point, and a different compliance regime. Founders attempting to span two paths kill velocity in the same pattern documented in the Government and CRE entries of this series.

---

## Closing thread

The four-year window from Insilico's Phase IIa Nature Medicine publication (June 3, 2025)[^38] to Generate's Phase 3 SOLAIRIA program initiation (December 1, 2025)[^13] to the FDA-EMA Joint Guiding Principles publication (January 14, 2026)[^18] to the EU GMP Annex 22 finalization (anticipated mid-2026)[^35] is the credibility-and-regulation tipping point for AI in pharma. The buying map is named. The clinical proof points are peer-reviewed. The regulatory perimeter is legible. The capital infrastructure ($600M Isomorphic raise[^7], $850M post-merger Recursion cash[^2], BMS-Insitro $2B+ milestone potential[^44][^45]) is in place.

The constraint is no longer "is AI ready for pharma." The constraint is whether founders shipping into this vertical can produce the credibility-assessment plans, audit trails, electronic signatures, and validation evidence packages that pharma sponsors and regulators require — and whether they pick a single GTM path rather than spanning two.

The next 18 months will determine which AI vendors close production deployments at the Big Pharma incumbents, which lose the procurement diligence cycle on validation-package gaps, and which never make it past pharma IT review. The named buyers are accessible. The compliance perimeter is documented. The production examples exist. The constraint is execution.

---

## Glossary

**21 CFR Part 11**: U.S. FDA regulation governing electronic records and electronic signatures in FDA-regulated activities. Requires secure, computer-generated, time-stamped audit trails; unique attributable electronic signatures; system validation; and inspection-readiness[^52][^53].

**ALCOA+**: Data integrity framework: Attributable, Legible, Contemporaneous, Original, Accurate, plus Complete, Consistent, Enduring, Available[^53].

**Annex 22 (EU GMP)**: The EU Good Manufacturing Practice annex governing AI/ML use in pharmaceutical manufacturing. Consultation draft published July 7, 2025; comments closed October 7, 2025; final expected mid-2026[^33][^34][^35].

**Context of Use (COU)**: FDA-defined construct for an AI model's specific role and scope in addressing a regulatory question of interest[^25][^28].

**Credibility (FDA AI guidance)**: Trust in AI model performance for a particular Context of Use, established through credibility evidence[^25][^29].

**GxP**: Good Practice — umbrella term for GLP (Laboratory), GCP (Clinical), GMP (Manufacturing), and related quality regulations[^53].

**HITL (Human-in-the-Loop)**: Required oversight model for non-critical generative AI use under EU GMP Annex 22[^32][^37].

**ISM001-055 / Rentosertib**: Insilico Medicine's first-in-class AI-discovered TNIK inhibitor for idiopathic pulmonary fibrosis. Phase IIa results published in *Nature Medicine* June 3, 2025[^38][^39].

**Pharma.AI**: Insilico Medicine's generative AI platform for target identification and small-molecule design[^38].

**ChemML**: Insitro's AI-enabled drug design platform extended in the October 2025 BMS ALS collaboration[^45].

**SOLAIRIA-1 / SOLAIRIA-2**: Generate Biomedicines' global Phase 3 program for GB-0895 in severe asthma, announced December 1, 2025[^13][^14].

**TNIK (Traf2- and Nck-interacting kinase)**: The first-in-class fibrosis target identified by Insilico's generative AI platform and inhibited by Rentosertib[^38].

**TSLP (Thymic Stromal Lymphopoietin)**: The epithelial cytokine target of Generate's GB-0895 antibody[^13].

---

## Related Research

- [HIPAA + SOC 2 for Health-AI Agents](https://www.perea.ai/research/hipaa-soc2-health-ai-agents-2026) — the regulatory-side architecture canon this paper inherits the BAA, audit-trail, and minimum-necessary framing from.
- [Article 27 FRIA Methodology Field Manual](https://www.perea.ai/research/article-27-fria-methodology-field-manual) — the EU AI Act Fundamental Rights Impact Assessment methodology that complements Annex 22 for pharma deployments touching EU markets.
- [The Unified AI Governance Stack](https://www.perea.ai/research/unified-ai-governance-stack-2026) — the NIST AI RMF + ISO 42001 + EU AI Act crosswalk that the FDA-EMA joint principles align with.
- [The B2A Imperative](https://www.perea.ai/research/b2a-2026) — the procurement-side framing this paper assumes throughout the buying-map analysis.

---

## References

[^1]: Recursion Pharmaceuticals (November 20, 2024), *Recursion and Exscientia, two leaders in the AI drug discovery space, have officially combined to advance the industrialization of drug discovery*. https://investors.exscientia.ai/news-releases/news-release-details/recursion-and-exscientia-two-leaders-ai-drug-discovery-space
[^2]: Recursion Pharmaceuticals (August 8, 2024), *Recursion and Exscientia Enter Definitive Agreement to Create A Global Technology-Enabled Drug Discovery Leader with End-to-End Capabilities* (SEC EX-99.1). https://www.sec.gov/Archives/edgar/data/1601830/000119312524196505/d856792dex991.htm
[^3]: BioSpace (August 8, 2024), *Recursion, Exscientia Merge to Create AI-Enabled Biotech*. https://www.biospace.com/deals/recursion-exscientia-merge-to-create-ai-enabled-biotech
[^4]: Fierce Biotech (May 5, 2025), *Several months after Exscientia merger, AI biotech outfit Recursion reworks pipeline*. https://www.fiercebiotech.com/biotech/several-months-after-exscientia-merge-ai-outfit-recursion-reworks-pipeline
[^5]: Pharmaphorum (2024), *AI biotechs Exscientia and Recursion agree $688m merger*. https://pharmaphorum.com/news/ai-biotechs-exscientia-and-recursion-agree-688m-merger
[^6]: MedPath (February 27, 2025), *Recursion-Exscientia Merger Signals New Era in AI-Driven Drug Discovery*. https://trial.medpath.com/news/8af0cdb04ba42d4b/recursion-exscientia-merger-signals-new-era-in-ai-driven-drug-discovery
[^7]: Isomorphic Labs (March 31, 2025), *Isomorphic Labs announces $600 million funding to further develop its next-generation AI drug design engine and advance therapeutic programs into the clinic*. https://www.prnewswire.com/news-releases/isomorphic-labs-announces-600-million-funding-to-further-develop-its-next-generation-ai-drug-design-engine-and-advance-therapeutic-programs-into-the-clinic-302415532.html
[^8]: Isomorphic Labs (March 31, 2025), *Isomorphic Labs Funding Announcement* (PDF). https://storage.googleapis.com/isomorphiclabs-website-public-artifacts/ISOMORPHIC_LABS_FUNDING_31-03-25.pdf
[^9]: BioPharma Dive (March 31, 2025), *Isomorphic raises $600M on big ambitions for AI drugmaking tech*. https://www.biopharmadive.com/news/isomorphic-venture-raise-alphabet-ai-drug-discovery/743983/
[^10]: Fierce Biotech (March 31, 2025), *Alphabet's AI biotech Isomorphic Labs hauls in $600M to power next-gen drug design model*. https://www.fiercebiotech.com/biotech/ai-biotech-isomorphic-labs-hauls-600m-power-next-gen-drug-design-model
[^11]: Pharmaceutical Technology (March 31, 2025), *Google-backed Isomorphic Labs raises $600m to advance AI drug discovery*. https://pharmaceutical-technology.com/news/google-backed-isomorphic-labs-raises-600m-to-advance-ai-drug-discovery
[^12]: Isomorphic Labs (March 31, 2025), *Isomorphic Labs announces $600m external investment round*. https://www.isomorphiclabs.com/articles/isomorphic-labs-announces-600m-external-investment-round
[^13]: Generate Biomedicines (December 1, 2025), *Generate:Biomedicines to Initiate Global Phase 3 Studies of GB-0895, a Long-Acting Anti-TSLP Antibody for Severe Asthma Engineered with AI*. https://generatebiomedicines.com/media-center/generatebiomedicines-to-initiate-global-phase-3-studies-of-gb-0895-a-long-acting-anti-tslp-antibody-for-severe-asthma-engineered-with-ai
[^14]: Generate Biomedicines (December 1, 2025), *Generate:Biomedicines to Initiate Global Phase 3 Studies of GB-0895* (PR Newswire). https://www.prnewswire.com/news-releases/generatebiomedicines-to-initiate-global-phase-3-studies-of-gb-0895-a-long-acting-anti-tslp-antibody-for-severe-asthma-engineered-with-ai-302628234.html
[^15]: AllSci (December 2, 2025), *Generate:Biomedicines advances AI-engineered asthma antibody into global Phase 3 trials with twice-yearly dosing*. https://allsci.com/news/generatebiomedicines-advances-ai-engineered-asthma-antibody-into-global-phase-3-trials-with-twice-yearly-dosing/
[^16]: BioPharmAPAC (December 2, 2025), *Generate Plans Global Phase 3 Trials for AI Engineered GB 0895 in Severe Asthma*. https://biopharmaapac.com/news/32/7258/generate-plans-global-phase-3-trials-for-ai-engineered-gb-0895-in-severe-asthma.html
[^17]: Generate Biomedicines (September 28, 2025), *ERS 2025: GB-0895, a high-affinity anti-TSLP mAb, demonstrates prolonged half-life and sustained pharmacological activity supporting every 6-month dosing in asthma*. https://generatebiomedicines.com/media-center/ers-2025-gb-0895-a-high-affinity-anti-tslp-mab-demonstrates-prolonged-half-life-and-sustained-pharmacological-activity-supporting-every-6-month-dosing-in-asthma
[^18]: FDA / EMA (January 14, 2026), *Guiding Principles of Good AI Practice in Drug Development* (FDA PDF). https://www.fda.gov/media/189581/download
[^19]: FDA (January 14, 2026), *Guiding Principles of Good AI Practice in Drug Development*. https://www.fda.gov/about-fda/artificial-intelligence-drug-development/guiding-principles-good-ai-practice-drug-development
[^20]: European Medicines Agency (January 14, 2026), *EMA and FDA set common principles for AI in medicine development*. https://www.ema.europa.eu/en/news/ema-fda-set-common-principles-ai-medicine-development-0
[^21]: European Medicines Agency (January 14, 2026), *Guiding principles of good AI practice in drug development* (PDF). https://www.ema.europa.eu/en/documents/other/guiding-principles-good-ai-practice-drug-development_en.pdf
[^22]: European Pharmaceutical Review (January 15, 2026), *EMA and FDA issue joint AI guidance for medicine development*. https://www.europeanpharmaceuticalreview.com/news/ema-and-fda-issue-joint-ai-guidance-for-medicine-development/270259.article
[^23]: Jones Day (January 28, 2026), *EMA and FDA Align on Good AI Practice in Drug Development*. https://jonesday90.pilot.onenorth.com/en/insights/2026/01/ema-and-fda-align-on-good-ai-practice-in-drug-development
[^24]: PharmaSource (February 18, 2026), *FDA and EMA Issue Joint AI Principles for Drug Development*. https://pharmasource.global/content/policy-briefing/fda-and-ema-issue-joint-ai-principles-for-drug-development/
[^25]: FDA (January 7, 2025), *Considerations for the Use of Artificial Intelligence To Support Regulatory Decision-Making for Drug and Biological Products* (Draft Guidance). https://www.fda.gov/regulatory-information/search-fda-guidance-documents/considerations-use-artificial-intelligence-support-regulatory-decision-making-drug-and-biological
[^26]: FDA (January 6, 2025), *FDA Proposes Framework to Advance Credibility of AI Models Used in Drug and Biological Product Submissions*. https://www.fda.gov/news-events/press-announcements/fda-proposes-framework-advance-credibility-ai-models-used-drug-and-biological-product-submissions
[^27]: Federal Register (January 7, 2025), *Considerations for the Use of Artificial Intelligence To Support Regulatory Decision-Making for Drug and Biological Products*. https://www.federalregister.gov/documents/2025/01/07/2024-31542/considerations-for-the-use-of-artificial-intelligence-to-support-regulatory-decision-making-for-drug
[^28]: Orrick, Herrington & Sutcliffe (January 13, 2025), *FDA Proposes Draft Guidance on Assessing the Credibility of AI Models Used in Drug and Biological Product Submissions*. https://www.orrick.com/en/Insights/2025/01/FDA-Proposes-Draft-Guidance-on-Assessing-the-Credibility-of-AI
[^29]: Crowell & Moring (January 29, 2025), *FDA Proposes Framework to Assess AI Model Output Credibility to Support Regulatory Decision-Making*. https://crowell.com/en/insights/blog-posts/fda-proposes-framework-to-assess-ai-model-output-credibility-to-support-regulatory-decision-making
[^30]: Troutman Pepper Locke, *A Model's Credibility Is in the Details: FDA Draft Guidance on the Use of AI Models in Drug and Biological Product Development*. https://www.troutman.com/insights/a-models-credibility-is-in-the-details-fda-draft-guidance-on-the-use-of-ai-models-in-drug-and-biological-product-development/
[^31]: European Commission (July 7, 2025), *Annex 22: Artificial Intelligence — Consultation Draft* (PDF). https://health.ec.europa.eu/document/download/5f38a92d-bb8e-4264-8898-ea076e926db6_en?filename=mp_vol4_chap4_annex22_consultation_guideline_en.pdf
[^32]: PubMed / Stassen et al. (April 10, 2026), *Bridging Guidance and Regulation: Interpreting the Draft Annex 22 on Artificial Intelligence in GMP Manufacturing*. https://pubmed.ncbi.nlm.nih.gov/41698693/
[^33]: ECA Academy (July 9, 2025), *Drafts of EU GMP Guideline Annex 11, Annex 22 and Chapter 4 released for comment*. https://gmp-compliance.org/gmp-news/drafts-of-eu-gmp-guideline-annex-11-annex-22-and-chapter-4-released-for-comment
[^34]: ECA Academy, *EU GMP Annex 22 (Draft 2025): Artificial Intelligence*. https://gmp-compliance.org/guidelines/gmp-guideline/eu-gmp-annex-22-draft-2025-artificial-intelligence
[^35]: PricewaterhouseCoopers Belgium (2026), *Annex 22: Making AI work in a Good Practice (GxP) environment*. https://www.pwc.be/en/news-publications/2026/annex-22-making-ai-work-in-a-good-practice-gxp-environment.html
[^36]: RegASK (September 11, 2025), *Decoding the New PIC/S Annex 22 for Regulatory Teams*. https://regask.com/ai-gmp-decoding-new-pics-annex-22-regulatory-teams/
[^37]: GxPVigilance (January 18, 2026), *PIC/S Annex 22: AI Validation for Pharmaceutical Manufacturing*. https://gxpvigilance.com.au/pics-annex-22-ai-validation-pharmaceutical-manufacturing/
[^38]: Insilico Medicine (June 3, 2025), *Insilico Announces Nature Medicine Publication of Phase IIa Results of Rentosertib, the Novel TNIK Inhibitor for Idiopathic Pulmonary Fibrosis Discovered and Designed with a Pioneering AI Approach*. https://insilico.com/news/tnrecuxsc1-insilico-announces-nature-medicine
[^39]: PubMed / Nature Medicine (2025), *A generative AI-discovered TNIK inhibitor for idiopathic pulmonary fibrosis: a randomized phase 2a trial* (NCT05938920). https://pubmed.ncbi.nlm.nih.gov/40461817/
[^40]: EurekAlert (June 3, 2025), *Insilico Medicine announces Nature Medicine publication of Phase IIa results evaluating rentosertib*. https://www.eurekalert.org/news-releases/1086096
[^41]: BioPharmaTrend (June 3, 2025), *AI-Designed Drug Reaches Clinical Validation: Insilico's Rentosertib in Nature Medicine*. https://www.biopharmatrend.com/news/ai-designed-tnik-inhibitor-shows-lung-function-gains-in-ipf-1282/
[^42]: MedCentral (May 23, 2025), *Investigational IPF Therapy Developed Using AI*. https://www.medcentral.com/pulmonology/investigational-ipf-therapy-developed-using-ai
[^43]: Pulmonary Fibrosis Foundation, *INS018_055*. https://www.pulmonaryfibrosis.org/patients-caregivers/medical-and-support-resources/clinical-trials-education-center/pipeline/drug/idiopathic-pulmonary-fibrosis/ism001-055-(ins018_055)
[^44]: Insitro / Bristol Myers Squibb (October 14, 2025), *insitro Extends Research Collaboration with Bristol Myers Squibb Leveraging insitro's ChemML Discovery Platform* (BusinessWire). https://www.businesswire.com/news/home/20251014107665/en/insitro-Extends-Research-Collaboration-with-Bristol-Myers-Squibb-Leveraging-insitros-ChemML-Discovery-Platform
[^45]: Insitro (October 14, 2025), *Bristol Myers, insitro extend research deal to find a drug for new ALS target*. https://www.insitro.com/news/bristol-myers-insitro-extend-research-deal-to-find-a-drug-for-new-als-target/
[^46]: Endpoints News (October 14, 2025), *Exclusive: Bristol Myers, insitro extend research deal to find a drug for new ALS target*. https://endpoints.news/bristol-myers-insitro-extend-als-drug-research-deal/
[^47]: ALS News Today (October 20, 2025), *Insitro, Bristol Myers extend research into new drug for ALS*. https://alsnewstoday.com/news/insitro-bristol-myers-extend-research-new-drug-als/
[^48]: BioSpace (October 15, 2025), *insitro Extends Research Collaboration with Bristol Myers Squibb Leveraging insitro's ChemML Discovery Platform*. https://www.biospace.com/press-releases/insitro-extends-research-collaboration-with-bristol-myers-squibb-leveraging-insitros-ChemML-Discovery-Platform
[^49]: GeneOnline (October 15, 2025), *Bristol Myers Squibb Commits $2 Billion to ALS Research in Expanded Collaboration with insitro*. https://www.geneonline.com/bristol-myers-squibb-commits-2-billion-to-als-research-in-expanded-collaboration-with-insitro/
[^50]: Precedence Research (April 22, 2026), *AI in Drug Discovery Market to Reach USD 160.49 Billion, Rising at a 23.22% CAGR by 2035*. https://www.globenewswire.com/news-release/2026/04/22/3279118/0/en/AI-in-Drug-Discovery-Market-to-Reach-USD-160-49-Billion-Rising-at-a-23-22-CAGR-by-2035.html
[^51]: Grand View Research (January 2026), *Artificial Intelligence In Drug Discovery Market Report, 2033*. https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-drug-discovery-market
[^52]: U.S. Code of Federal Regulations, *21 CFR Part 11 — Electronic Records; Electronic Signatures* (eCFR). https://www.ecfr.gov/current/title-21/chapter-I/part-11
[^53]: FDA (August 24, 2018), *Part 11, Electronic Records; Electronic Signatures — Scope and Application* (Guidance for Industry). https://www.fda.gov/regulatory-information/search-fda-guidance-documents/part-11-electronic-records-electronic-signatures-scope-and-application
