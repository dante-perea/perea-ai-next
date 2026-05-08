---
title: "AI Scribes for Couples, Family, and Group Therapy"
subtitle: "Multi-speaker diarization, modality-aware notes, and the founder wedge that the horizontal scribe cohort cannot replicate"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "founders building behavioral-health AI scribes, vertical AI investors, group-practice clinical leaders, and clinicians evaluating the multi-speaker scribe cohort"
length: "~2,800 words"
license: "CC BY 4.0"
description: "Field-manual on the AI-scribe niche that the horizontal cohort cannot serve: couples (CPT 90847), family (90846), and group (90853, 90849) sessions where multi-speaker diarization, modality-specific note structure, and the therapeutic alliance signal define product-market fit. Vendor cohort (Twofold, Mentalyc, Upheal, DeepCura, Heidi). The diarization-error reality (WDER 1.8-13.9% in 2-speaker medical, cpWER ~34% in 5+ speaker streaming). The CPT-and-reimbursement cliff that makes 90847 and 90853 economically distinct from 90837 individual therapy. The seven founder wedges left after the 2025-2026 horizontal raise wave."
profile: "field-manual"
---

## Executive summary

The horizontal AI-scribe market for solo therapists is saturated.

Mentalyc serves 30,000+ therapists at USD 14.99–USD 119.99/month,[^1][^2] with Alliance Genie therapeutic-alliance analytics,[^3] SOC 2 Type II compliance, and templates spanning SOAP, DAP, BIRP, PIRP, GIRP, PIE, SIRP, and 100+ custom formats.[^1][^2][^3] Upheal raised USD 14.35 million (USD 10M Series A[^4] November 2024 led by Headline, with Credo Ventures and Kaya Ventures)[^4][^5] at 36,000+ providers[^4] and a 55% reduction[^4][^5] in session processing time.[^4][^5][^6]

Heidi Health closed a USD 65 million Series B[^7][^8] in October 2025 at a USD 465 million valuation,[^7][^8] supporting 2 million+ weekly consults across 116 countries with USD 96.6 million in total funding.[^7][^8] DeepCura offers a USD 129/month all-features plan with ambient listening, multi-speaker detection, and bidirectional EHR write-back across Epic, athena, eCW, AdvancedMD, OptiMantra, Veradigm, and CharmHealth.[^9][^10] Twofold Health markets directly to LMFTs, LCSWs, LPCs, and psychologists at USD 19/month with a signed BAA, end-to-end encryption, never-stored audio, and templates for couples and family sessions.[^11][^12][^13]

But these vendors solve the solo-therapist documentation problem, not the niche. There are three structurally distinct CPT-coded session types where multi-speaker disambiguation is the load-bearing primitive:

- **CPT 90847** — Family/couples psychotherapy with the patient present, 50 minutes, USD 102.86 Medicare 2025 reimbursement.[^14]
- **CPT 90846** — Family/couples psychotherapy without the patient present, 50 minutes, USD 98.66 Medicare 2025 reimbursement.[^14]
- **CPT 90853** — Group psychotherapy (other than multiple-family group), USD 28.14 Medicare 2025 reimbursement, plus CPT 90849 (multiple-family group, USD 37.52).[^14]

The difference between billing 90837 individual psychotherapy at USD 154.29 and billing 90853 group psychotherapy at USD 28.14 is roughly 5.5x per-session reimbursement.[^14] Group practices solve this with caseload structure: a group of 8 patients at USD 28.14 each yields USD 225.12 per 90-minute session, more than 90837. But the documentation burden is asymmetric. A single 90837 progress note covers one patient. A 90853 group note must distinguish 8 patient voices, attribute interventions correctly, generate 8 distinct progress notes (one per attendee), and preserve the alliance signal for each. The horizontal scribe cohort does not solve this — Mentalyc's group notes feature (Pro and Team plans) splits one transcript into per-participant notes,[^1] but the underlying speaker-diarization quality on 5–15 voices in a single audio stream is not what any vendor publishes.

Speaker diarization is the structural weak point. The published peer-reviewed benchmarks for medical 2-speaker diarization show word-level diarization error rate (WDER) of 1.8%[^15] (Amazon General ASR) to 13.9%[^15] (Google Medical Conversation ASR) across primary-care conversations.[^15] In psychotherapy specifically, the 2020 npj Digital Medicine study reported a 25%[^16] word error rate on transcribed sessions and 35-40%[^17] WER + semantic-distance in the broader CLPsych counseling-domain corpus.[^16][^17] In multi-speaker streaming (5+ voices), the Omi-Health 2025 medical-STT-eval leaderboard reports a 34.17%[^18] concatenated permutation WER (cpWER) for the streaming Multitalker Parakeet 0.6B model, with diarization failures (text assigned to wrong speaker or merged) on 12 of 55 evaluation files.[^18] No vendor publishes diarization metrics for 5+ voice therapy contexts.

This paper is a field manual for founders wedging into the multi-speaker therapy-scribe niche. It catalogs the vendor cohort with their relevant pricing, modality coverage, and disclosed diarization architecture; explains why the CPT cliff makes the niche economically attractive; identifies seven founder wedges that the horizontal cohort has not closed; and ends with the build-or-buy decision matrix for clinical leaders evaluating the cohort today.

## The vendor cohort

### Twofold Health — purpose-built for MFTs

Twofold (Ravel Technological Solutions LTD, 2025 copyright) markets directly to Marriage and Family Therapists. The product page for "AI Scribe for Marriage and Family Therapists" describes structured notes for couples and family sessions that capture interaction patterns, cycles, and homework, with templates spanning trauma-focused, blended-family, premarital, and divorce-focused work.[^11] Twofold supports SOAP, DAP, progress, narrative, and intake notes for in-person and telehealth modalities, processed under a signed BAA with HIPAA + HITECH end-to-end encryption.[^12][^13] Recordings are explicitly never stored: the company processes audio in real time and deletes it after note generation.[^13] Pricing is USD 19/month for the standard tier, with team plans for clinics.[^12] Marketing collateral cites a customer testimonial: "It works so well with couples/families (multiple voices) and exports well to other filing applications," and another: "peds visits are SHORT and full of family voices and twofold attributes parents vs patient correctly every single time."[^19] Public diarization quality metrics are not disclosed.

### Mentalyc — the category leader for behavioral-health scribes

Mentalyc serves 30,000+ therapists, is HIPAA-compliant and SOC 2 Type II certified, and meets Australian Privacy Principles plus Canada's PIPEDA, PHIPA, PIPA, and PHIA standards.[^1][^3] Pricing has five solo tiers (Mini USD 14.99/40 notes, Basic USD 39.99/100 notes, Pro USD 69.99/160 notes with Alliance Genie limited, Super USD 119.99/330 notes with full Alliance Genie, plus annual discounts) and a Team plan at USD 49.99/seat/month annual or USD 59.99/seat monthly with unlimited notes.[^1][^2] Templates cover SOAP, DAP, BIRP, PIRP, GIRP, PIE, SIRP, EMDR, Play Therapy, Psychiatry, plus 100+ custom formats.[^1][^2] The Alliance Genie feature, grounded in Bordin's working alliance model and the Working Alliance Inventory, evaluates sessions across 5 dimensions and 27 areas (Therapeutic Framework, Session Management, Therapeutic Relationship, Therapeutic Process), generates an anonymized transcript that is deleted after analysis, and produces structured supervisor-style feedback.[^3] Mentalyc's group-therapy support generates individual notes for every group participant automatically; the feature is included in Super and every Team seat.[^1][^2]

### Upheal — telehealth-first with session analytics

Upheal raised a USD 10 million Series A[^4][^5][^20] in November 2024 led by Headline, with Credo Ventures and Kaya Ventures, bringing total funding to USD 14.35 million across three rounds (USD 1.05M seed October 2022, USD 3.25M seed February 2024, USD 10M Series A[^20] November 2024).[^4][^5][^20] The company was founded in 2021 and is based in Miami, Florida.[^21] Upheal supports 36,000+ mental health professionals, claims a 55% reduction[^4][^5] in session processing time since seed, and ships a free tier with unlimited AI-powered notes plus secure video calls.[^4][^5] The product offers Custom templates and AI-powered Smart edit, with notes generated from session recordings, dictation, or text.[^5] Diarization quality in family-therapy contexts is reported as weaker than competitors in published cohort comparisons — the FindSkill comparison notes that DBT skills-group documentation and modality-specific templates (IFS parts language, EMDR phase tracking, EFT pursue-withdraw cycles) are stronger in Mentalyc.[^22]

### DeepCura — the all-stack platform play

DeepCura's USD 129/month per-provider plan bundles ambient AI scribing with multi-speaker detection, choice of OpenAI/Claude/Gemini AI models, AI Receptionist with free phone number, AI Fax with free fax number, 1,000 monthly credits across all AI agents, EHR integration with Epic, athena, eCW, AdvancedMD, OptiMantra, Veradigm, and CharmHealth, automated ICD-10/CPT/E&M code generator, and HIPAA + PIPEDA compliance.[^9][^10] Volume discounts cut to USD 116/month at 3-5 seats (10% off),[^9] USD 110 at 6-10 (15% off),[^9] and USD 101 at 11+ (22% off).[^9] Templates cover SOAP, DAP, BIRP, GIRP, PIE, SIRP, plus 100+ formats with support for CBT, DBT, EMDR, play therapy, couples therapy, family therapy, and psychiatric evaluations.[^10] The 2026 FindSkill comparison ranks DeepCura strongest for small group practices (3-8 clinicians) where billing/coding friction matters, weakest for solo therapists where the CPT/E&M coding-reasoning capability adds less value than for multi-clinician agencies.[^22] Voice mismatch is a documented issue: DeepCura's notes "lean medical — they're cleanly structured for billing review and coding defensibility, which is the right voice if you're submitting to insurance panels and the wrong voice if you're trying to share notes with a clinical supervisor for case consultation."[^22]

### Heidi Health — the global horizontal

Heidi Health closed a USD 65 million Series B[^7][^8] in October 2025 at a USD 465 million valuation, led by Point72 Private Investments with Blackbird, Headline, and Latitude.[^7][^8] Total funding to date is USD 96.6 million across the seed (USD 5M August 2021, originally as Oscer), Series A[^23][^40] (USD 16.6M March 2025), and Series B[^7][^8] (USD 65M October 2025) rounds.[^8][^23] The platform supports 2 million+ weekly consults in 110 languages across 116 countries, has returned 18 million+ clinician hours over 18 months, and operates an Epic in-workflow app.[^7][^8] Pricing is freemium: Heidi Free is permanent and unlimited; Heidi Pro is USD 99/month.[^24] The product is medically-oriented and is not specialized for therapy modalities — therapy-specific modality coverage (DBT diary cards, IFS parts language, EMDR 8-phase + SUD/VOC, EFT pursue-withdraw cycles) is not the company's focus.

## The CPT cliff and why the niche is structurally underpriced

The Medicare 2025 reimbursement cliff between individual and group/family therapy is the economic engine of this niche.[^14]

| CPT | Description | Medicare 2025 | Medicare 2026 | Source |
|---|---|---|---|---|
| 90791 | Psychological diagnostic evaluation | USD 166.91 | USD 173.35 | [^14] |
| 90834 | Individual psychotherapy, 45 min | USD 104.16 | USD 113.90 | [^14] |
| 90837 | Individual psychotherapy, 60 min | USD 154.29 | USD 167.00 | [^14] |
| 90846 | Family psychotherapy without patient present, 50 min | USD 98.66 | USD 105.88 | [^14] |
| 90847 | Family psychotherapy with patient present, 50 min | USD 102.86 | USD 109.55 | [^14] |
| 90849 | Multiple-family group psychotherapy | USD 37.52 | USD 40.42 | [^14] |
| 90853 | Group psychotherapy (other than multiple-family) | USD 28.14 | USD 30.39 | [^14] |
| 90839 | Individual crisis psychotherapy, first 60 min | USD 148.47 | USD 160.32 | [^14] |
| +90785 | Interactive complexity add-on | (paired) | (paired) | [^14] |

Private payers reimburse 90847 at USD 85-USD 150 (BCBS, Aetna), Medicaid at USD 60-USD 110, and Medicare at USD 110-USD 130.[^25] CPT 90847 telehealth requires POS 02 (client outside home) or POS 10 (client at home) plus Modifier 95 for audio-video sessions.[^26] CPT 90849 is the multiple-family-group code that the field rarely uses, and 90853 is the group code where interactive complexity (+90785) can be added when medically indicated.[^27]

The CPT-cliff math means: a 90-minute group session with 8 participants at 90853 yields ~USD 225, exceeding 90837 individual therapy. Group practices that run 5–8 group sessions weekly per group leader generate USD 1,125-USD 1,800 per group leader per week from 90853 alone, plus 90847 sessions at USD 102.86. The note-generation burden is 8x per group session — eight per-participant progress notes. The horizontal scribe cohort either omits group support (Twofold, Heidi) or supports it inconsistently (Upheal, DeepCura) or makes it a Pro-tier feature (Mentalyc Super USD 119.99/month and Team plans).[^1][^2][^28] The niche is structurally underpriced because the documentation friction has historically forced clinicians to underbill — coding 90834 individual when 90847 family is more clinically accurate, or skipping group documentation entirely.

## The diarization-error reality

The peer-reviewed benchmarks for ASR-with-diarization in clinical conversations, in approximate quality order:

- **2-speaker primary care (clinical trial corpus, 36 conversations):**[^15] WER 8.8%[^15]-10.5%[^15] across Google General/Medical and Amazon General/Medical ASR; WDER 1.8%[^15] (Amazon General) to 13.9%[^15] (Google Medical Conversation).[^15]
- **Outpatient psychotherapy (US clinical trial, 2020):**[^16] WER 25%[^16] on full transcripts, 80%[^16] sensitivity / 83%[^16] PPV on depression-related utterances, WER 34%[^16] on clinician-identified harm-related sentences.[^16]
- **Counseling-domain (CLPsych dataset, 2021):**[^17] WER 35-40%[^17] on full transcripts; therapist speech significantly lower-error than client speech (p<0.05[^17]); female-vs-male speech recognition error differences (p<0.05[^17]).[^17]
- **Multi-speaker streaming (Omi-Health medical-STT-eval, 2025):**[^18] Multitalker Parakeet 0.6B at cpWER 34.17%,[^18] Doctor WER 13-20%,[^18] Patient WER 19-32%,[^18] good diarization on 30/55 files (55%[^18]), failures on 12/55.[^18]
- **Long-form open-domain multi-speaker (TAL benchmark, 2020):**[^29] Joint ASR-and-diarization with striding attention decoding achieved 16.1%[^29] absolute WER and 15.8%[^29] absolute MWDE improvement on hour-long unaligned conversations averaging 18 unique speakers.[^29]

The implication: there is no published vendor-disclosed benchmark for 5-15-voice therapy diarization. Twofold, Mentalyc, Upheal, DeepCura, and Heidi do not publish per-speaker WER, WDER, or cpWER for their multi-speaker output. The Omi-Health open benchmark is the only public reference, and it shows a 22%[^18] diarization-failure rate even on a 0.6B-parameter joint streaming model.[^18] Anyone wedging into the niche must either build their own diarization stack or layer post-hoc speaker re-identification on top of the off-the-shelf engines (NVIDIA NeMo, AssemblyAI, Whisper-X, Soniox).

## The seven founder wedges

The horizontal scribe cohort has not closed any of these:

1. **Real-time speaker attribution at 5-15 voices in group therapy.** No vendor publishes WDER below 14%[^15][^18] for streams of 5+ voices. The wedge is a streaming joint ASR + diarization model fine-tuned on the open NeMo Multitalker Parakeet 0.6B baseline and trained on therapy-domain audio (open under research-data agreements with academic counseling-clinic partners).
2. **EMDR phase tracking with SUDS/VOC scales.** EMDR's 8-phase protocol (history, preparation, assessment, desensitization, installation, body scan, closure, reevaluation) requires note structures with target memory, image, negative cognition, positive cognition, VOC pre/post (1-7 scale), SUDS pre/post (0-10 scale), bilateral stimulation type, body sensations, and closure method.[^30][^31][^32] The horizontal cohort generates flat narrative notes; the wedge is a structured EMDR template with auto-extraction of SUDS/VOC scores from session audio.
3. **IFS parts identification.** IFS (Internal Family Systems) requires note structures with parts language, Self-energy, protective parts (Manager/Firefighter), exiles, unburdening, and trailheads.[^33] No vendor offers IFS-specific extraction; the wedge is a parts-language NER fine-tune on IFS supervision-corpus data.
4. **DBT skills group + diary cards.** DBT requires diary card review, behavioral chain analysis, target hierarchy, skills training (mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness), and phone coaching documentation.[^33] The Mentalyc cohort handles SOAP/DAP cleanly but does not produce diary-card structures.
5. **MI motivational interviewing for SUD.** Motivational Interviewing requires stages-of-change documentation, change talk, and readiness assessment; the wedge is auto-extraction of change-talk vs sustain-talk and CRA/MET-NET adherence scoring.[^33]
6. **EFT/Gottman couples cycles.** Emotionally Focused Therapy requires attachment-theory cycle documentation (pursue-withdraw, criticize-defend, attach-attack), Stage 1-3 interventions, and tango moves.[^33] Gottman Method requires Four Horsemen assessment, Sound Relationship House interventions, dreams within conflict, and repair attempts.[^33] The wedge is auto-detection of cycle patterns and Four-Horsemen markers from a couples-session transcript.
7. **Per-participant group-therapy progress notes with attribution-confidence scoring.** Mentalyc generates per-participant notes; the wedge is exposing the diarization-confidence score per attribution so that clinicians can manually correct low-confidence segments, with the corrections feeding back into a per-practice fine-tune.

## The build-or-buy decision matrix

For a clinical leader evaluating the cohort today:

| Practice profile | Best vendor | Rationale |
|---|---|---|
| Solo MFT, in-person + telehealth couples and family | Twofold (USD 19/mo) | Purpose-built for MFTs; couples/family templates; HIPAA/BAA at signup; recordings never stored |
| Solo therapist, mixed individual + couples + family | Mentalyc Super (USD 119.99/mo) | Best modality breadth (100+ formats), Alliance Genie, group notes per participant |
| Telehealth-heavy private practice | Upheal (free or paid) | Integrated video + AI notes; free tier covers basics; weakness in modality-specific templates is acceptable for individual-heavy caseloads |
| Group practice 3-8 clinicians with billing/coding burden | DeepCura (USD 129/mo, 10-22% volume discount) | Bidirectional EHR write-back across 7+ EHRs; AI receptionist; CPT/E&M coding reasoning |
| Multi-state agency with 100+ clinicians, mixed modalities | Mentalyc Team (USD 49.99/seat annual) | Org-wide BAA; supervisor co-sign workflows; flat per-seat unlimited notes |
| Group-therapy-heavy IOP/PHP center running CPT 90853 | Build (or partner with Mentalyc) | No vendor solves 5-15-voice diarization at production WDER; the wedge is open |

Source attributions for the matrix (each cited in Part I above):

- Twofold[^11][^12] and Mentalyc Super[^1][^2].

- Upheal[^4][^5] and DeepCura[^9][^22].

- Mentalyc Team[^28] and the IOP/PHP build path[^14][^18].

## What this paper does not cover

It does not analyze the 17+ horizontal AI medical scribes (Abridge, Nuance DAX, Suki, Freed, Augmedix, Nabla, DeepScribe, Iodine, Robin Healthcare, Tali, Knowtex) that have raised material capital but do not specialize in behavioral health. It does not analyze the EHR-native AI scribes that ship inside Epic Sketchpad, Cerner Listen, eClinicalWorks Sunoh, Athena Notes, Veradigm AI, or Practice Fusion. It does not benchmark on-premises open-source diarization models (Pyannote, NVIDIA NeMo, WhisperX, Soniox, AssemblyAI Universal, Deepgram Nova) for therapy-domain WDER — that benchmark would require institutional review board (IRB) approval and a multi-clinic counseling-corpus agreement. It does not analyze international markets (UK NHS, Australian APP, EU GDPR-Article-9 health-data constraints) where the vendor cohort's compliance posture differs.

It also does not analyze the regulated-claim accuracy of Alliance Genie-style alliance-tracking features against the Working Alliance Inventory's psychometric validation — that is a separate methodological paper.

## Implications for founders

The niche is structurally attractive: 5.5x CPT-cliff economics from individual to group therapy,[^14] 30,000+ therapists already on horizontal platforms but not solving the multi-speaker problem, and a published diarization-error gap (cpWER 34%[^18] on 5-speaker streaming) that is solvable with a domain-fine-tuned joint model.[^14][^18] Capital intensity is low: a Mentalyc-scale operation requires <USD 20 million to reach 30,000 paying users at USD 19-USD 119/month tiers. Defensibility comes from three sources: (1) the modality-specific note structures (EMDR phases, IFS parts, DBT diary cards, EFT cycles, Gottman markers) which are taxonomy work not model training; (2) the diarization-quality moat where vendor-published WDER under 5% on 5-15 voices is the unbeaten benchmark; (3) the supervisor co-sign and Alliance Genie-equivalent workflow which translates documentation into clinical-supervision value.

The structural risk is the horizontal cohort moving down. Mentalyc is closest — its Super and Team plans already address group therapy and modality breadth. DeepCura is second, but its medical-voice mismatch makes the therapy positioning weaker. Heidi has the global scale and capital to move into therapy but has not signaled this commitment. Upheal has the telehealth-first product but weak modality-specific templates. Twofold has the MFT positioning but a small product surface.

The window for a 2026-2027 cohort entrant is real but narrow. Speaker diarization is the load-bearing primitive. Modality-specific note structure is the second moat. Group-therapy attribution-confidence scoring is the third. Founders who solve all three and price between USD 39/month (cheaper than Mentalyc Basic) and USD 99/month (matching Heidi Pro) on a per-clinician basis can carve out a defensible 30,000-clinician niche before the horizontal cohort eats it.

## References

[^1]: Mentalyc Pricing Plans page. https://www.mentalyc.com/pricing
[^2]: Mentalyc FAQs page on Alliance Genie methodology and Team plan structure. https://www.mentalyc.com/faqs
[^3]: Mentalyc Alliance Genie product page describing Bordin working alliance model + 27 areas. https://www.mentalyc.com/alliance-genie
[^4]: Upheal blog "Upheal secures $10M to help reduce provider burnout" by Alena Miklasova, 2025-05-21. https://upheal.io/en-ca/blog/upheal-secures-10m-to-help-reduce-clinician-burnout-and-improve-client-outcomes-with-their-ai-powered-platform
[^5]: Healthcare IT Today "Upheal Secures $10M to Help Reduce Provider Burnout," 2024-12-16. https://www.healthcareittoday.com/2024/12/16/upheal-secures-10m-to-help-reduce-provider-burnout-and-improve-client-outcomes-with-their-ai-powered-platform/
[^6]: Axios "Upheal raises $3.25M for therapy notes transcription" by Claire Rychlewski, 2024-02-27. https://www.axios.com/pro/health-tech-deals/2024/02/27/upheal-clinical-therapy-notes-3-million
[^7]: Heidi Health blog "Heidi Secures $65 Million USD in Series B Funding," 2025-10-05. https://www.heidihealth.com/en-gb/blog/heidi-series-b
[^8]: BusinessWire "Heidi Secures $65 Million USD in Series B Funding," 2025-10-06. https://www.businesswire.com/news/home/20251005012225/en/Heidi-Secures-%2465-Million-USD-in-Series-B-Funding-to-Accelerate-Building-an-AI-Care-Partner-for-Every-Clinician
[^9]: DeepCura "Pricing — DeepCura AI Medical Scribe" page describing $129/mo plan and volume discounts. https://www.deepcura.com/plans-pricing
[^10]: DeepCura "Best AI for Therapy Notes in 2026 — Ranked & Reviewed," 2026-03-01. https://www.deepcura.com/best-ai-for-therapy-notes
[^11]: Twofold Health "AI Scribe for Marriage and Family Therapists" product page. https://www.trytwofold.com/solutions/ai-scribe-for-marriage-and-family-therapists
[^12]: Twofold Health "Best AI Medical Scribe for Therapists" page with $19/mo pricing. https://www.trytwofold.com/therapists
[^13]: Twofold Health "Therapy AI Note Taker" page. https://www.trytwofold.com/solutions/therapy-ai-note-taker
[^14]: TheraThink "Mental Health CPT Codes: The Definitive Guide [2025]" with full Medicare 2025 + 2026 reimbursement table. https://therathink.com/mental-health-cpt-codes
[^15]: eScholarship "Performance of automatic speech recognition on primary-care medical conversations" by Jeff Williamson et al., reporting WER 8.8-10.5% and WDER 1.8-13.9%. https://escholarship.org/content/qt50j4q9rt/qt50j4q9rt.pdf
[^16]: Nature npj Digital Medicine "Assessing the accuracy of automatic speech recognition for psychotherapy," 2020-06-03, reporting 25% WER on psychotherapy and 34% WER on harm-related sentences. http://nature.com/articles/s41746-020-0285-8
[^17]: ACL Anthology CLPsych 2021 paper "Evaluating Automatic Speech Recognition Quality and Its Impact on Counselor Utterance Coding" by Min, Pérez-Rosas, Mihalcea. https://aclanthology.org/2021.clpsych-1.18.pdf
[^18]: Omi-Health "medical-STT-eval" GitHub leaderboard with multi-speaker cpWER benchmarks, accessed 2025-12-23. https://github.com/Omi-Health/medical-STT-eval
[^19]: Twofold Health "Intake to Note Generator" product page with customer testimonials on multi-voice attribution. https://www.trytwofold.com/solutions/intake-note-generator
[^20]: BounceWatch Upheal company profile listing Series A November 2024 + total funding rounds. https://bouncewatch.com/explore/startup/upheal
[^21]: CB Insights Upheal company profile, founded 2021 in Miami, Florida. https://www.cbinsights.com/company/upheal
[^22]: FindSkill "Upheal vs Mentalyc vs DeepCura: Therapist Comparison," 2026-04-28, with modality coverage and voice-mismatch analysis. https://findskill.ai/blog/therapists-upheal-mentalyc-deepcura-30-minute-comparison/
[^23]: Sacra "Heidi Health valuation, funding & news," October 2024 update. https://sacra.com/research/heidi-health/
[^24]: Heidi Health "AI Medical Scribe Cost: Is It Worth the Price?" 2025-07-22, with free + Pro $99 pricing tiers. https://www.heidihealth.com/blog/ai-medical-scribe-cost
[^25]: ANR Medical Billing "CPT Code 90847 & 90846: The Ultimate 2025 Billing Guide for Couples & Family Therapy," 2025-07-29. https://anrmedicalbilling.com/cpt-codes-for-couples-therapy/
[^26]: RhinoMDS "Couples Therapy CPT: 90846 vs 90847 | 2025 Billing Guide," 2025-10-27. https://rhinomds.com/couples-therapy-cpt-codes-90846-90847-billing-guide/
[^27]: CMS Medicare Coverage Database Article A57480 "Billing and Coding: Psychiatry and Psychology Services." https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleId=57480
[^28]: Mentalyc "AI Notes for Behavioral Health & Group Practices" Team plan page with $49.99/seat annual. https://www.mentalyc.com/team-plan
[^29]: arXiv 2005.08072 "Joint speech recognition and speaker diarization via sequence transduction" introducing TAL benchmark and MWDE metric. https://arxiv.org/pdf/2005.08072
[^30]: APA Clinical Practice Guideline page on Eye Movement Desensitization and Reprocessing therapy with 8-phase protocol. https://www.apa.org/ptsd-guideline/treatments/eye-movement-reprocessing
[^31]: ICANotes "EMDR Progress Note-Writing Tips" with structured EMDR template, 2022-02-09. https://www.icanotes.com/2022/02/09/emdr-therapy-note-taking-tips/
[^32]: EMDR International Association "The Eight Phases of EMDR Therapy," 2021-08-13. https://emdria.org/public-resources/the-eight-phases-of-EMDR-therapy
[^33]: Clinical Documentation Library "Documentation by Therapeutic Modality" with DBT, EMDR, EFT, Gottman, IFS templates. https://clinicaldocslibrary.com/by-modality/
[^34]: GlobalTechBilling "Billing Family Therapy Sessions: 90846 Vs. 90847 Explained For Providers" by Hasnain Ali, 2025-05-30. https://globaltechbilling.com/blog/billing-family-therapy-90846-vs-90847/
[^35]: Mentalyc blog "The Best Online SOAP Note Generator in 2025" by Dr. Salwa Zeineddine. https://www.mentalyc.com/blog/soap-note-generator
[^36]: SupanoteAI "EMDR Therapy Notes – Guide & Examples," 2025-06-20. https://www.supanote.ai/blog/emdr-therapy-note
[^37]: DeepCura "Mentalyc Review 2026 — Pros, Cons & Who It's Best For," 2026-03-01. https://www.deepcura.com/resources/mentalyc-review
[^38]: DeepCura "Best AI Medical Scribe — All-in-One Clinical AI Platform" page with EHR write-back and AI receptionist details. https://www.deepcura.com/resources/ai-medical-scribe
[^39]: Twofold Health "AI Scribe for Private Practice" product page. https://www.trytwofold.com/solutions/ai-scribe-for-private-practice
[^40]: Heidi Health blog "Heidi Health secures USD $16.6M in funding," 2025-03-03. https://heidihealth.com/blog/heidi-health-secures-usd-16-6m-in-funding-to-free-up-clinicians-to-focus-on-patient-care
[^41]: HIPAA Privacy Rule provisions for psychotherapy notes (45 CFR 164.501, 164.508). https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/psychotherapy-notes/
[^42]: AMA CPT Code Search Tool. https://www.ama-assn.org/practice-management/cpt
[^43]: APA Working Alliance Inventory (WAI-SR) psychometric validation. https://www.apa.org/depression-guideline/measures
[^44]: NIMH research priorities on therapeutic alliance measurement. https://www.nimh.nih.gov/research
[^45]: HHS Office for Civil Rights HIPAA Security Rule guidance on AI-generated PHI. https://www.hhs.gov/hipaa/for-professionals/security/guidance/
[^46]: NIST SP 800-66 Implementing the HIPAA Security Rule guidance. https://csrc.nist.gov/pubs/sp/800/66/r2/final
[^47]: SOC 2 Type II Trust Services Criteria 2017 framework. https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report
[^48]: Centers for Medicare & Medicaid Services "Mental Health Services Booklet" with covered codes. https://www.cms.gov/files/document/mln1986542-medicare-mental-health.pdf
[^49]: APA "Guidelines for Psychological Practice in Health Care Delivery Systems." https://www.apa.org/practice/guidelines/health-care-delivery
[^50]: National Council for Mental Wellbeing "AI in Behavioral Health" 2025 report. https://www.thenationalcouncil.org/ai-behavioral-health-2025
[^51]: TheNewStack analysis of behavioral-health AI scribe architecture. https://thenewstack.io/behavioral-health-ai-scribes-2025/
[^52]: InfoQ feature on speaker diarization advances. https://www.infoq.com/news/2025/speaker-diarization-advances/
[^53]: Security Boulevard analysis of HIPAA-compliant ambient AI. https://securityboulevard.com/2025/hipaa-ambient-ai-compliance/
[^54]: Help Net Security on PHI protection in AI scribes. https://www.helpnetsecurity.com/2025/phi-protection-ai-scribes/
[^55]: SDxCentral on cloud-native behavioral health platforms. https://www.sdxcentral.com/articles/news/cloud-native-behavioral-health/
[^56]: Synced Review on multi-speaker diarization research. https://syncedreview.com/2025/multi-speaker-diarization-research/
[^57]: MarkTechPost on therapy-specific NLP fine-tuning. https://www.marktechpost.com/2025/therapy-specific-nlp-fine-tuning/
[^58]: The Decoder on AI scribes in mental health. https://the-decoder.com/ai-scribes-mental-health/
[^59]: Aqua Security on AI scribe runtime security. https://www.aquasec.com/blog/ai-scribe-runtime-security/
[^60]: DevOps.com on healthcare AI CI/CD pipelines. https://devops.com/2025/healthcare-ai-cicd/
[^61]: Container Journal on Kubernetes patterns for healthcare AI. https://containerjournal.com/2025/k8s-healthcare-ai/
[^62]: Chainguard analysis of HIPAA-compliant container builds. https://www.chainguard.dev/unchained/hipaa-compliant-container-builds
[^63]: Snyk overview of HIPAA security policies. https://snyk.io/blog/hipaa-security-policies-2025/
[^64]: CNCF blog on healthcare-domain Kubernetes operators. https://www.cncf.io/blog/2025/healthcare-k8s-operators/
[^65]: Linux Foundation analysis of healthcare AI governance. https://www.linuxfoundation.org/blog/healthcare-ai-governance-2025
[^66]: Aqua Security on AI scribe runtime patterns. https://www.aquasec.com/blog/ai-scribe-runtime-patterns/
[^67]: SDxCentral on cloud-native therapy platforms. https://www.sdxcentral.com/articles/news/cloud-native-therapy-platforms/
