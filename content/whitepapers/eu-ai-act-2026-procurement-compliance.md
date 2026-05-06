---
title: "The EU AI Act 2026: A Procurement Compliance Field Manual"
subtitle: "Article 26 deployer obligations, the GPAI Code of Practice, and the Article 9 artifact every B2B AI buyer must own by August 2"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T10:00"
audience: "B2B procurement leaders, compliance officers, CIOs, and procurement counsel buying agent-powered SaaS into the EU before 2 August 2026."
length: "~6,000 words"
license: "CC BY 4.0"
description: "On 2 August 2026 the EU AI Act's Article 26 deployer obligations bind every organization that uses high-risk AI inside the EU. This is the procurement compliance field manual: vendor inventory in 30 days, classification by Annex III in 60, Article 9 artifact and 5-question vendor test by 90 — what every buyer must own and what every vendor must produce."
---

# The EU AI Act 2026: A Procurement Compliance Field Manual

## Foreword

This paper is written ten weeks before 2 August 2026 — the day the EU AI Act's Article 26 deployer obligations bind every organization that uses high-risk AI inside the European Union. Every European buyer of agent-powered SaaS — and every non-European vendor selling into the bloc — is now operating against a calendar.

The shift the Act forces is structural: regulation no longer lives only on the vendor's side of the contract. Half the obligations land on the buyer. If you use the AI in the EU under your own authority, you are the **deployer** under Article 3(4), and Article 26's twelve enumerated paragraphs apply to you regardless of who built the model. Vendor compliance does not give you compliance, the way a SOC 2-certified vendor does not give you SOC 2.

That makes procurement the primary control surface. The vendor inventory you already maintain is 80% of the answer; the other 20% is reading every MSA, DPA, and AI addendum in your contract repository to figure out which of your 180 vendors have quietly added AI features in the past 18 months. This is a procurement-side companion to *The Agentic Procurement Field Manual* and *The B2A Imperative*: where those papers asked how AI agents reshape the buyer-vendor relationship, this one asks what the regulator now demands of the buyer in that relationship.

A single thread runs through everything below. The **Article 9 artifact** — the risk-management documentation pack required for every high-risk AI system — is the new RFP attachment. Vendors that produce it by construction win shortlists; vendors that hand-wave win nothing. By August 2, three pieces of furniture must exist in every European procurement program: an AI vendor inventory, a named owner per high-risk vendor, and an audit-trail repository with ten-year retention. The teams that built that early are about to compound. The teams that skipped it are about to learn what €15 million or three percent of global turnover feels like.

## Executive Summary

Seven findings frame the rest of the paper.

**1. Article 26 binds 2 August 2026; you are the deployer.** Twelve paragraphs apply to any natural or legal person using a high-risk AI system in the Union under their own authority — using AI bought from someone else makes you the deployer just as building it from scratch would [1][3]. Your six baseline obligations: appropriate technical and organisational measures, input data control where you exercise it, human oversight by competent natural persons, monitoring with serious-incident reporting, log retention of at least six months, and information to affected workers and natural persons [1][2][4][5]. Vendor compliance does not absorb yours.

**2. The GPAI Code of Practice is the vendor-side filter; 23+ providers signed.** The Code was published 10 July 2025 and endorsed by the Commission and AI Board on 1 August 2025 as the adequate voluntary tool by which providers of general-purpose AI models can demonstrate compliance [11][13][14]. Signatories include Aleph Alpha, Almawave, Amazon, Anthropic, Black Forest Labs, Bria AI, Cohere, Domyn, Dweve, Fastweb, Google, IBM, Lawise, LINAGORA, Microsoft, Mistral AI, Open Hippo, OpenAI, Pleias, ServiceNow, and WRITER; xAI signed only the Safety and Security chapter [11]. Procurement implication: prefer foundation-model vendors that signed; for non-signatories, demand the Section 5.1 alternative-compliance evidence.

**3. The Hansen Fit Score five questions belong in every RFP.** "What post-deployment monitoring tools do you provide to help us meet our regulatory obligations?" is now the opening volley, followed by four sibling questions about human oversight, AI literacy, minimum client qualification thresholds, and the vendor's own assessment of your readiness [16][17]. These questions don't measure capability — they measure deployer-burden offload, and that's the real procurement signal.

**4. The Article 9 artifact is the procurement attachment.** A 200-500 page evidence pack per high-risk AI system, retained for at least ten years, is the deliverable the regulator requires [9]. Vendors that ship the Article 9 artifact by construction (continuous, not point-in-time, and generated as part of normal product use) are not just compliance plays — they are deployer-burden offload. AgentMode AM-041 advertises an 8-10 week 6-stage playbook that produces the artifact as a deliverable; Glocert's five-phase methodology (Inventory → Classification → Gap Analysis → Remediation → Evidence Pack) sets the industry-standard structure [8][16].

**5. The four-tier classification narrows the surface.** High-risk under the AI Act means AI safety components in regulated products listed in Annex I (medical devices, vehicles, civil aviation, machinery) or AI systems in the eight domains of Annex III (biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, justice) [5]. Standard chatbots, recommendation engines, spam filters, and general office automation are **not** high-risk. Most of your SaaS stack lands in limited or minimal risk and needs little more than transparency notices. Focus the program on the small set that touches HR decisions, credit decisions, biometric data, or access to services [18].

**6. Penalties: €35M / 7% (prohibited), €15M / 3% (deployer non-compliance), €7.5M / 1.5% (incorrect information).** Three buckets under Article 99. Deployers face the second [17]. Most European procurement leaders are not insuring against the €35M / 7% bucket — they are insuring against the €15M / 3% bucket, which is what bites when your monitoring evidence is incomplete or your Article 27 FRIA is missing.

**7. The Digital Omnibus may delay Annex III to 2 December 2027 — but only if standards are missing.** The Commission proposed targeted amendments on 19 November 2025 (COM(2025) 836) [21][22]. IMCO and LIBE adopted a joint report on 18 March 2026 by a 101-9-8 vote [21][24]; the Council reached general approach 13 March 2026 [25]. Trilogue began April 2026 with the Cypriot Presidency aiming for agreed text by May 2026 — before the AI Act's general application date [24]. The mechanism: where harmonised standards or Commission guidelines for Chapter III are not ready, Annex III obligations slide, but **2 December 2027 (stand-alone Annex III)** and **2 August 2028 (Annex I embedded)** are hard ceilings [22]. The 2 August 2026 GPAI enforcement date is unchanged. Article 26 deployer obligations are unchanged. Don't bank on the delay.

## Part I: The Deployer Reality

The AI Act creates a bright line between **provider** and **deployer**. A provider builds the AI system and places it on the market; their obligations run through Articles 9-21, 43, and 47-49 — risk management, technical documentation, CE marking, conformity assessment, EU database registration. A deployer uses a high-risk AI system built by someone else, in a professional context, under their own authority. Their obligations are narrower but separate: correct use, human oversight, log retention, worker notification, incident reporting, all under Article 26 [1][4]. Both roles are simultaneously possible inside the same organisation; both carry their own enforcement risk.

The line can shift. Under Article 25(1), a deployer becomes a provider — and inherits the full provider obligation set — if any of three things happen: rebrand the system under your own name, make a substantial modification, or change the intended purpose so that new high-risk uses arise [2][4]. This matters more than it sounds. A SaaS buyer that rewires a generic foundation-model API into a hiring-decision pipeline can cross that line without realising it; the moment the use case becomes "automated screening for employment" the deployer has become a provider of a high-risk Annex III system.

Article 26's twelve paragraphs translate to a six-checkbox baseline:

1. **Technical and organisational measures.** Use the system in accordance with the provider's instructions for use (Article 13). Deploying for purposes not covered in those instructions is a compliance breach and may trigger Article 25(1) provider status [5].
2. **Input data control.** Where the deployer exercises control over input data, ensure it is relevant and sufficiently representative for the intended purpose. This bites for fine-tuning and prompt-injection-style augmentation; if you control the dataset, you carry the obligation [1].
3. **Human oversight by competent natural persons.** Article 26(2). Oversight must be assigned to people with competence, training, authority, and resources — and the role must be live and ongoing the moment the system operates [5].
4. **Monitoring + serious-incident reporting.** Observe operation against the instructions for use; suspend on Article 79(1) risk; immediately notify the provider, then importer/distributor and market surveillance authorities, on serious incidents [1][4]. Financial institutions subject to Union financial-services governance rules satisfy this by complying with those rules.
5. **Log retention at least six months.** Article 26(6). Logs automatically generated by the system, to the extent they are under the deployer's control, retained "for a period appropriate to the intended purpose" but never less than six months unless other Union or national law (notably GDPR) sets a shorter or longer period [1][4].
6. **Inform affected persons and workers.** Article 26(7) requires informing workers' representatives and affected workers before workplace deployment of any high-risk AI system; in Germany, Austria, and the Netherlands works councils have **co-determination rights**, not just notice [5]. Article 26(11) requires informing natural persons subject to Annex III decisions that they are subject to a high-risk AI system. Article 27 adds the FRIA requirement for public authorities and private organisations providing public services.

That sixth obligation often gets skipped. Workplace deployment includes any AI used in hiring, performance monitoring, output evaluation, or shift scheduling — exactly the categories most B2B SaaS quietly added AI to in the past eighteen months [18]. The CLM that extracts clauses with a model, the spend-analytics tool that predicts anomalies, the background-check provider that scores risk, the support platform that drafts replies: each is a deployer obligation waiting to land on a compliance officer's desk, and none of them necessarily show up in the existing vendor risk register [18].

The high-risk surface is narrower than the conversation suggests. High-risk under the Act means either (a) an AI safety component in a regulated product listed in Annex I — medical devices, vehicles, civil aviation, machinery — or (b) an AI system in one of the eight Annex III domains: biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, justice [5]. Standard chatbots, recommendation engines, spam filters, and general office automation are not high-risk. The procurement program's job is to find the small slice of the SaaS stack that lands in those categories and lavish it with attention; the rest needs little beyond transparency notices.

## Part II: Article 9 as the Procurement Artifact

Article 9 is the obligation that converts compliance into an artifact. It mandates a continuous iterative risk-management system, planned and run throughout the entire lifecycle of a high-risk AI system, with regular systematic review and updating [6]. Four steps, looped: identify known and reasonably foreseeable risks to health, safety, and fundamental rights under intended use; estimate and evaluate those risks under intended use **and reasonably foreseeable misuse**; evaluate other risks emerging from post-market monitoring (Article 72); adopt targeted risk-management measures. Residual risk must be "judged to be acceptable" [6].

The documentation pack the regulator expects is roughly six artifacts:

- **Risk management plan** describing methodology, roles, and responsibilities.
- **Risk register** continuously updated as new risks are identified.
- **Risk assessment reports** at major milestones and annually, documenting likelihood and severity.
- **Risk mitigation evidence** — test results, design changes, validation data — per implementation.
- **Residual risk statement** updated with each assessment revision.
- **Change management documentation** tracking modifications and re-assessments [7][9].

Annex IV adds the technical documentation envelope. Eight categories: general system description and intended purpose; system elements and development process; monitoring, functioning, and control mechanisms; performance metrics and their appropriateness; the risk-management system; lifecycle changes; harmonised standards; declaration of conformity [9]. The full pack for a single high-risk system runs **200-500 pages**, and it must be **retained for ten years** after the system is placed on the market [8][9]. Documentation must be technically accurate, up-to-date, and accessible to competent authorities throughout that period.

This is where ISO 42001 becomes the procurement leader's friend. Glocert's mapping shows ISO 42001 Clause 6.1.2 and Clause 8.2 cover Article 9 with minimal modification; organisations with existing ISO 27001 or SOC 2 evidence-management processes can extend rather than rebuild [8]. For a 50-vendor portfolio with five high-risk systems, Glocert estimates an 8-12 week readiness assessment; enterprise organisations with large AI portfolios may need 16+ weeks [8]. Glocert's five-phase methodology — Inventory → Classification → Gap Analysis → Remediation → Evidence Pack — has become the de-facto industry sequencing.

The procurement implication is sharp. The Article 9 artifact is so expensive to produce manually, and so impossible to fake, that it is the single best vendor-discrimination signal in any high-risk RFP. A vendor whose product **emits the artifact as part of normal use** — a continuous risk register populated by telemetry, mitigation evidence captured at deploy time, residual-risk statements regenerated on every model change — eliminates the buyer's documentation burden. A vendor that says "we will generate it on request" is selling a manual process. The procurement question for any high-risk AI system in 2026 is no longer "do you have an Article 9 artifact?" — it's "show me the live one for the version I would deploy on Monday."

Procurement Insights' framing makes the asymmetry stark: vendors have no obligation to verify that their clients are ready to deploy compliantly; they can sell AI-powered autonomous procurement agents to organisations with no post-deployment monitoring, no human oversight protocols, no data governance framework, no AI literacy training, and when that implementation fails or triggers regulatory scrutiny, the deployer bears the liability — not the vendor [16]. The Article 9 artifact is the contractual lever that closes the asymmetry.

## Part III: The 90-Day Procurement Playbook

Ten weeks is enough time to build a compliant procurement program if the work starts on day one. The Cognisys 2026 checklist [10] and the Opstream playbook [18] converge on the same three-phase shape; this paper combines them with the Glocert evidence-pack target.

**Days 1-30 — Inventory and AI disclosure.** Pull every active vendor from your contract repository. For each, answer three questions: does it use AI? what category? what data does it touch? Where the contract is silent, send a one-question email to your account contact and track responses in whatever tool your team already uses [18]. Add an AI disclosure clause to all new vendor contracts. Update the vendor questionnaire to capture AI use, training data, and log access [18]. Allow 6-8 weeks for provider response — start week one because supplier response times are the variable you control least [10]. The vendor inventory is 80% of the answer to the EU AI Act problem; the other 20% is reading every MSA, DPA, and AI addendum in your repository at scale, which is now a tractable problem with contract-extraction tools but used to be a paralegal's full-time job [18].

**Days 31-60 — Classification and named owners.** Classify the inventory by deployer risk using the four-tier framework (prohibited / high-risk / limited / minimal). Most vendors will land in limited or minimal — they need transparency notices and not much else [18]. Focus on the small set that touches HR decisions, credit decisions, biometric data, or access to services. Those carry material Article 26 exposure. Assign a named executive owner for each high-risk vendor's human oversight [18]. Confirm log-retention rights and incident-notification clauses in writing [18]. Initiate FRIAs and DPIAs in parallel for highest-risk systems first; allow 4-6 weeks per system [10]. By the end of week 8, every high-risk system in scope has: a documented risk classification, a named human-oversight owner, log-retention rights confirmed, and an FRIA/DPIA in flight.

**Days 61-90 — Oversight, monitoring, and cadence.** Oversight procedures drafted with input from operations and system owners [10]. Logging and monitoring controls implemented; this is where technical debt in your security posture surfaces — Cognisys explicitly flags this as the milestone where engineering and security capacity become bottlenecks [10]. Stand up a quarterly AI vendor review cadence with executive sponsorship and General Counsel [18]. Build the records-retention process for ten-year storage of the Article 9 artifact and supporting evidence [9]. Single controlled repository, role-based access, version control, audit trail.

Procurement governance moves: weekly working group for the first 12 weeks, dropping to fortnightly once the inventory and classification phase closes [10]. Monthly steering meeting with the executive sponsor throughout. Every artifact, decision log, vendor response, and evidence document in a single controlled repository with role-based access. Version control and audit trail matter here because regulators and auditors will ask **when** decisions were made and **who** approved them [10].

The shadow-AI risk hides in plain sight. Update your procurement checklist so that no new AI tool can be purchased without compliance inputs from Legal, Security, and the relevant business owner [10]. Without that gate, shadow AI adoption will outpace your documentation program — and shadow AI is exactly the surface the regulator will inspect first when it audits.

## Part IV: The 5-Question Vendor Test

The Hansen Fit Score five questions are the procurement-leader's RFP volley [16]:

1. **"What post-deployment monitoring tools do you provide to help us meet our regulatory obligations?"** Vendors that ship telemetry pipelines, audit-trail dashboards, and Article 12 evidence by default offload deployer burden. Vendors that say "you can build that yourself" don't.
2. **"How do you support human oversight requirements in your AI system design?"** Article 14 enforcement is technical when the system cannot start without recorded human approval, procedural when policy says a human should approve. Procedural gates fail audits [19].
3. **"What AI literacy training do you provide or require before deployment?"** Article 4 obligations apply to providers and deployers — and the Digital Omnibus would shift the obligation to encourage initiatives onto Member States [21], so a vendor that provides literacy training is doing the buyer a favour and reducing the risk of substandard deployment.
4. **"Do you have a minimum client qualification threshold before selling AI capabilities?"** This is the question that separates vendors that sell to anyone from vendors that gate their AI capabilities behind organisational readiness. Procurement Insights' Coupa-vs-Zycus comparison shows that **neither** systematically gates [17]; the industry pattern is sell-first-ask-later.
5. **"What is your assessment of our organization's readiness to meet EU AI Act deployer obligations?"** The vendor that can answer this from their own discovery and consulting is years ahead of the vendor that can't.

Knowlee's eight-question by-design-vs-bolt-on procurement framework adds the technical dimension [19]:

1. **Article 12 evidence — live demonstration.** "Show me, live, the audit-trail entry for the most recent AI inference your platform recorded — full payload, model version, operator identity, timestamp." A vendor without a live answer does not have automatic logs in the AI Act sense.
2. **Article 14 enforcement — technical or procedural?** Technical gates pass audits; procedural gates fail.
3. **Article 6 traceability.** "For one of my candidate use cases, walk me through how your platform classifies it. Where does the Annex III reference live? How is it updated when the use case changes?"
4. **Bolt-on or by-design.** "Does the AI inference run through your platform, or are you reading metadata about an inference that runs elsewhere?"
5. **Retention and export.** "What is the retention default for inference logs? Configurable per-data-category? Export format if I need to hand evidence to a national authority?" Retention silence is a red flag.
6. **Multi-tenant blast radius.** "Are the data isolation boundaries technical (separate databases, separate credentials) or RBAC (same database, role-based access)?" RBAC-only is high-risk for high-risk AI [19].
7. **Provider-vs-deployer story.** "I am primarily a deployer of AI from third parties. How does your platform model that role?"
8. **Article 17 / ISO 42001 alignment.** "What is your own QMS posture? Are you ISO 42001 certified, in progress, or not pursuing? When?"

Procurement Insights applied the Hansen Fit Score to ProcureTech vendors and produced numbers with teeth: Coupa scored 6.6 (Moderate Risk) versus Zycus at 5.1 (Elevated Risk), with Capability-Outcome gaps of 4.8 and 3.6 respectively [17]. The Capability-Outcome gap — the difference between vendor capability scores and observed implementation outcome performance — is the predictive metric. A high gap means the vendor demos well but ships badly; a high gap on a high-risk Annex III system is the worst combination a procurement program can absorb.

The deeper point: these questions don't measure capability. They measure **deployer-burden offload**. Two vendors with identical features but different operating models produce wildly different compliance outcomes for the buyer. The five-question test, run honestly, is worth more than any feature comparison sheet.

## Part V: GPAI and the Vendor-Side Filter

Foundation-model providers carry a parallel set of obligations under Articles 53-55 of the Act, applicable from 2 August 2025 with Commission enforcement powers from 2 August 2026 [12]. The **General-Purpose AI Code of Practice**, published 10 July 2025 and endorsed by the Commission and AI Board on 1 August 2025 [11][13][14], is the voluntary tool by which providers can demonstrate compliance with reduced administrative burden and increased legal certainty.

The Code has three chapters: Transparency, Copyright, and Safety and Security. The first two address all GPAI providers; the third applies only to providers of the most advanced models — the systemic-risk tier under Article 51 [14]. Signing is voluntary, but signing is the cleanest path to compliance: signatories benefit from "reduced administrative burden and increased legal certainty than if they proved compliance through other methods" [11].

The signatory list as of mid-2026: Accexible, AI Studio Delta, Aleph Alpha, Almawave, Amazon, Anthropic, Black Forest Labs, Bria AI, Cohere, Domyn, Dweve, Fastweb, Google, IBM, Lawise, LINAGORA, Microsoft, Mistral AI, Open Hippo, OpenAI, Pleias, ServiceNow, and WRITER. xAI signed only the Safety and Security chapter, meaning it must demonstrate compliance with Transparency and Copyright via alternative adequate means [11].

The Signatory Taskforce, chaired by the AI Office, met first on 30 January 2026, then 13 March 2026, and 27 March 2026 [15]. Most signatories joined as members. The Taskforce facilitates exchanges, can provide input on guidance documents, and engages with stakeholders on technological developments — it is the institutional forum through which signatories will land coherent application of the Code as enforcement powers come online.

The Commission Guidelines on GPAI obligations, published in 24 EU official languages [12], clarify scope. Document submissions go through the **EU SEND platform** in five categories: Article 51(2) and 52(2) systemic-risk notifications; Article 52(5) reassessment requests; Article 55(1)(c) serious-incident reports; Safety and Security Framework and Model Report (Measures 1.4 and 7.7); and reports on how non-signatories intend to comply per Section 5.1 of the Guidelines [12].

The procurement implication is straightforward: **prefer foundation-model vendors that signed the Code.** Signing is a signal that the vendor accepts the regulator's framework and has built the documentation pipeline. For non-signatories, demand the alternative-compliance evidence per Section 5.1 — an explicit document describing the vendor's path to AI Act compliance without using the Code. If the vendor cannot produce that document on request, your downstream Article 26 risk is materially higher.

The grandfather clause matters: providers of GPAI models placed on the market before 2 August 2025 have until **2 August 2027** to comply [12]. Vendors leaning on legacy models bought time, but only twelve months of it. Procurement programs evaluating multi-year contracts should price the migration risk explicitly.

## Part VI: Penalties and Enforcement

Article 99 of the Act sets three penalty tiers:

- **€35M or 7% of global turnover** (whichever is higher) for prohibited practices under Article 5.
- **€15M or 3% of global turnover** for other violations of provider, deployer, importer, distributor, notified body, or authorised representative obligations — including most Article 26 deployer breaches [17].
- **€7.5M or 1.5%** for the provision of incorrect, incomplete, or misleading information to authorities or notified bodies.

Enforcement architecture: **the AI Office** at the Commission level has exclusive competence over general-purpose AI; **national competent authorities** plus market surveillance authorities under Regulation 2019/1020 cover everything else; **the EDPS** is competent authority for EU institutions, bodies, offices, and agencies [23]. The European Data Protection Board explicitly has **no role** in AI Act enforcement — its mandate stays inside GDPR consistency [23]. The Digital Omnibus expands AI Office staffing by 53 FTE (15 internal redeployment) to handle the new GPAI enforcement workload [22].

The cooperation regime under Article 26(12) requires deployers to cooperate with competent authorities on any action they take in relation to the high-risk system. The AI Office's general powers under Regulation 2019/1020 Article 14 — request for information, on-site inspection, binding commitments, fines, periodic penalties — apply through the implementing acts the Commission is empowered to adopt [22][25]. Procedural rights apply mutatis mutandis.

The procurement reality: most European procurement leaders are not insuring against the €35M / 7% bucket. The prohibited practices under Article 5 are narrow — social scoring, real-time biometric identification in public spaces for law enforcement, manipulation, exploitation of vulnerabilities — and most B2B procurement programs do not deploy systems that touch them. Where the bite lands is the **€15M / 3% bucket**: deployer non-compliance, incomplete monitoring, missing FRIA, log-retention failure, worker-information shortfalls. That's the one that compounds across a 50-vendor portfolio. A €15M / 3% maximum, applied even partially across multiple vendor relationships in a single audit cycle, is the kind of number that shows up in CFO conversations.

National competent authorities are still being designated; the EDPS's March 2026 IMCO/LIBE statement confirmed that some Member States are behind on appointment [23]. The first wave of enforcement actions in late 2026 and 2027 will likely come from the AI Office (GPAI providers) and the most-prepared national authorities (Sweden, Germany, Ireland, France) before others scale up.

## Part VII: The Digital Omnibus and the Moving Deadline

The Commission proposed the **Digital Omnibus on AI** on 19 November 2025 (COM(2025) 836) [21][22]. The proposal is targeted: simplify implementation, reduce regulatory burden on SMEs and small mid-caps, reinforce AI Office competence, address the delayed availability of harmonised standards for high-risk AI systems.

Substantive amendments worth tracking:

- **Mechanism linking Chapter III entry into application to availability of harmonised standards, common specifications, or Commission guidelines.** Where those measures are not ready, high-risk AI obligations slide. Annex III high-risk systems would apply 6 months after standards are confirmed ready by Commission decision; Annex I-embedded high-risk systems, 12 months. **Hard ceilings: 2 December 2027 (stand-alone Annex III) and 2 August 2028 (Annex I embedded).** The flexibility cannot extend beyond those dates [22][25].
- **AI literacy obligation shifted.** The Commission proposes to remove the requirement that providers and deployers ensure AI literacy of their staff (Article 4), replacing it with a duty on the Commission and Member States to encourage AI literacy initiatives [21]. The procurement implication: if this passes trilogue, the Hansen Fit Score literacy question changes shape — vendors that provide literacy training become differentiated, not table-stakes.
- **Post-market monitoring flexibility** and **simplified documentation for SMEs and mid-caps** [21]. Practical relief for smaller suppliers; procurement programs evaluating mid-cap vendors should not interpret simplified docs as substandard docs.
- **Special-category data processing for bias detection** with safeguards. Allows processing of protected attributes (race, ethnicity, religion) for the explicit purpose of detecting and correcting bias [21]. Procurement programs evaluating fairness claims should look for this provision in the vendor's data-handling architecture.
- **EU database registration removed for non-high-risk systems** that providers conclude are narrow or procedural [21].

Process status: IMCO and LIBE adopted their joint report on 18 March 2026 by **101 votes in favour, 9 against, 8 abstentions** (A10-0073/2026, PE782.530v02-00) [21][24]. The Council reached general approach on 13 March 2026, largely aligning with the Commission's proposal but adding bans on AI generating sexual and intimate content without consent or child sexual abuse material, reinstating simplified registration for non-high-risk systems, and applying a strict-necessity standard to special-category processing for bias correction [21][25]. **Trilogue began April 2026; the Cypriot Presidency aims for agreed text by May 2026 — before the AI Act's general application date of 2 August 2026** [24].

The procurement implication is the discipline of not banking on the delay. Three things are unchanged regardless of how the Digital Omnibus lands:

- **2 August 2026 GPAI Commission enforcement powers** are unchanged.
- **Article 26 deployer obligations** are unchanged for the categories that aren't Annex III high-risk.
- **The Article 9 artifact requirement** for high-risk systems is unchanged in substance; only its binding date shifts.

A procurement program that built the inventory, classification, and Article 9 evidence pipeline to August 2026 deadlines and then learns the Annex III binding date slid to December 2027 has bought eighteen months of margin and a tested operating model. A procurement program that waited and learned the trilogue collapsed has zero margin and zero operating model. The expected value of preparing for the original date dominates either outcome.

## Part VIII: Where This Goes

By Q4 2026 the first AI Office enforcement actions on GPAI providers will be public. Sweden, Germany, and Ireland's national competent authorities will likely announce the first deployer audits — most plausibly in HR-decision and credit-scoring deployments, where the Annex III hook is cleanest and the affected-person count is high.

By 2027 the convergence story matures. ISO 42001, NIST AI RMF, and EUAIA evidence packs become roughly interoperable; the procurement program built once produces evidence that satisfies all three. Compliance-software vendors split into two camps: by-design (the AI inference runs through the platform — Knowlee, Credo AI, Holistic AI, Domino archetypes [19]) and bolt-on (the platform reads metadata about an inference that runs elsewhere — the GRC retrofit pattern). Bolt-on platforms either re-architect into the inference path or get repriced into commodity GRC tooling. The buyer signal that drives the split is exactly question 4 of Knowlee's procurement framework.

By 2028 the Annex I-embedded high-risk obligations bind, and the Article 9 artifact becomes audit-grade and contractually warrantied. The procurement question shifts from "do you produce the artifact?" to "what's your warranty when it's wrong?" That's a different kind of vendor relationship — closer to medical-device or financial-services contractual warranties than to typical SaaS. Vendors that built the by-design Article 9 pipeline early can warrant their artifact; vendors that bolted it on cannot, and the warranty gap is what the procurement leader will pay a premium to close.

The deeper shift is that regulation is the new floor. The teams that built the Article 9 artifact discipline early enter 2027 with their procurement programs running clean and their RFPs pre-loaded with the right questions; teams that skipped it carry residual risk that compounds across every vendor relationship. That compounding asymmetry — the way a once-built compliance program produces evidence that gets reused across vendors and audit cycles — is what makes the next ten weeks structurally important. The work is not glamorous, but the leverage is.

## Closing

Article 26 binds 2 August 2026. You are the deployer. Build the inventory in 30 days, classify by Annex III in 60, demand the Article 9 artifact and run the five-question test by 90.

Three pieces of furniture every European procurement program needs by August: an AI vendor inventory with a named owner per high-risk system, an audit-trail repository with ten-year retention, and a quarterly review cadence with executive sponsorship and General Counsel. None of those three are unique to AI procurement — they are the discipline that turned ISO 27001 and SOC 2 from compliance theatre into actual security posture. The AI Act is the next regulator in line to do the same for AI, and the procurement program that absorbs the discipline early will spend the next decade compounding evidence rather than scrambling to produce it on demand.

The opportunity inside the obligation: vendors that produce the Article 9 artifact by construction are not just compliance plays — they are deployer-burden offload, and that's worth a premium in every RFP. Buyers that recognize the asymmetry first will carry less risk and pay less for it. The August 2 calendar is real, but it's also a buying signal.

## References

1. Article 26 AI Act — https://ai-act-text.com/article-26-ai-act
2. Article 26 AI Act: Obligations of deployers of high-risk AI systems | aiactblog.nl — https://www.aiactblog.nl/en/ai-act/artikel/26
3. Article 26 Obligations of deployers of high-risk AI systems | Regulation (EU) 2024/1689 | Better Regulation — https://service.betterregulation.com/document/742219
4. Article 26 EU AI Act: Deployer obligations for high-risk AI | Legalithm — https://www.legalithm.com/en/ai-act-guide/article-26-deployer-obligations
5. AI Deployer Obligations: Complete EU AI Act Checklist | Regumatrix — https://regumatrix.eu/compliance/ai-deployer-obligations
6. AI Act Service Desk — Article 9: Risk management system — https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-9
7. EU AI Act Article 9 Risk Management Implementation: Technical Documentation Requirements | The Art of Service — https://theartofservice.com/blog/eu-ai-act-article-9-risk-management-implementation-technical
8. EU AI Act Readiness Assessment Guide: Gap Analysis to Evidence Pack | Glocert International — https://www.glocertinternational.com/resources/guides/eu-ai-act-readiness-assessment-guide/
9. EU AI Act Technical Documentation (Article 11) Guide | Glocert International — https://www.glocertinternational.com/resources/guides/eu-ai-act-technical-documentation-article-11/
10. EU AI Act compliance checklist: your step-by-step action plan for 2026 — https://cognisys.co.uk/eu-ai-act-compliance-checklist/
11. The General-Purpose AI Code of Practice | Shaping Europe's digital future — https://digital-strategy.ec.europa.eu/en/policies/gpai-code-practice
12. Guidelines for providers of general-purpose AI models | Shaping Europe's digital future — https://digital-strategy.ec.europa.eu/en/policies/guidelines-gpai-providers
13. Commission Opinion on the assessment of the General-Purpose AI Code of Practice — https://digital-strategy.ec.europa.eu/en/library/commission-opinion-assessment-general-purpose-ai-code-practice
14. General-Purpose AI Code of Practice now available | Shaping Europe's digital future — https://digital-strategy.ec.europa.eu/en/news/general-purpose-ai-code-practice-now-available
15. Signatory Taskforce of the General-Purpose AI Code of Practice — https://digital-strategy.ec.europa.eu/en/pages/signatory-taskforce-gpai-code-practice
16. The EU AI Act Just Made Organizational Readiness the Law | Procurement Insights — http://procureinsights.com/2026/02/06/the-eu-ai-act-just-made-organizational-readiness-the-law/
17. Do You Know If Your ProcureTech Vendor Is Ready for the EU AI Act? | Procurement Insights — http://procureinsights.com/2026/02/06/do-you-know-if-your-procuretech-vendor-is-ready-for-the-eu-ai-act/
18. What Is the EU AI Act? Compliance Beyond the Deadline | Opstream — https://www.opstream.ai/blog/what-is-the-eu-ai-act/
19. AI Act Compliance Software: The 2026 Buyer's Guide for EU Enterprises | Knowlee Blog — https://www.knowlee.ai/blog/ai-act-compliance-software-guide
20. Deployer Obligation Self-Assessment | EU AI Compass — https://euaicompass.com/deployer-obligation-assessment.html
21. Digital Omnibus on AI | European Parliament Legislative Train — https://www.europarl.europa.eu/legislative-train/carriage/digital-omnibus-on-ai/report
22. Digital Omnibus on AI Commission proposal — EUR-Lex CELEX 52025PC0836 — https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?qid=1763974781629&uri=CELEX%3A52025PC0836
23. EDPS IMCO/LIBE working group statement on AI Act enforcement (4 March 2026) — https://www.edps.europa.eu/system/files/2026-03/2026-03-04-imco-libe-ai-act-wg_en.pdf
24. Digital Omnibus | AI Transparency Institute — https://aitransparencyinstitute.com/digital-omnibus/
25. Digital Omnibus on AI — Third Presidency compromise text | Council of the EU (ST 6963/2026) — https://data.consilium.europa.eu/doc/document/ST-6963-2026-INIT/en/pdf
