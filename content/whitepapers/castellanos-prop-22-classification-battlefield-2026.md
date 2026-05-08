---
title: "Castellanos v. State of California Aftermath: The Worker Classification Battlefield 2024-2026"
subtitle: "How the unanimous 7/25/2024 California Supreme Court Prop 22 ruling, AB 1340 sectoral bargaining (10/3/2025), Massachusetts Question 3 (11/2024), and Illinois HB4743 (1/20/2026) built a three-state coextensive-power doctrine — and the open § 7465 + NLRA-preemption + Sherman Act § 1 questions still untested in court"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Founders building gig-platform compliance products, gig-worker advocates, labor-law attorneys, policy analysts, and 1099-finance vendors deciding which markets to bid into"
length: "~12,000 words"
license: "CC BY 4.0"
description: "An authority survey of the 2024-2026 worker-classification battlefield — Castellanos v. State of California (7/25/2024 unanimous Cal Supreme Court), AB 1340 sectoral bargaining (10/3/2025), the Newsom-SEIU-Uber-Lyft tripartite agreement (8/29/2025), Massachusetts Question 3 (11/2024) + AG Campbell's $175M settlement, Illinois HB4743 (filed 1/20/2026), and the open NLRA-preemption + Sherman Act § 1 + § 7465 supermajority questions that could unwind the three-state IC sectoral-bargaining stack."
profile: "field-manual"
---

## Foreword

The ground beneath US gig-worker classification law moved more in the 24 months between July 2024[^64] and July 2026[^64] than in any prior comparable window since *Dynamex Operations West v. Superior Court* (2018) and California's AB 5 (2019).[^1][^16][^28][^32] On July 25, 2024, a unanimous California Supreme Court upheld Proposition 22 in *Castellanos v. State of California* and reset the constitutional baseline for app-based driver classification.[^1] On November 5, 2024, Massachusetts voters approved Question 3 — making theirs the first state in the union to grant ride-hail drivers the right to unionize while preserving independent-contractor status.[^40][^59] On October 3, 2025, Governor Gavin Newsom signed AB 1340, opening a path to sectoral collective bargaining for more than 800,000 California rideshare workers.[^39][^43] On January 20, 2026, Illinois state legislators introduced HB 4743, the third state-level version of the same architecture in fifteen months.[^42][^64]

What emerged is something genuinely new in American labor law: a *coextensive-power* doctrine, hammered out across three states, that treats independent contractors as eligible for state-administered collective bargaining without reclassifying them as employees. The architecture is fragile. Two open legal questions — whether § 7465[^49]'s seven-eighths supermajority constitutional under article XIV § 4[^49] plenary power, and whether NLRA preemption + Sherman Act § 1[^49] antitrust doctrine void state-administered IC sectoral bargaining — could unwind the entire stack within 36 months.[^46][^48][^50] The federal labor architecture is itself unstable: as of 2026, the National Labor Relations Board lacks a quorum, has filed suit against New York's parallel state-jurisdiction law, and is widely expected to sue California and Massachusetts next.[^48][^49]

This paper exists to map that architecture in primary sources — bill text, Supreme Court opinions, PERB rulemaking, attorney-general settlements, and the legal commentary that frames the open questions. It is the third paper in a worker-classification trilogy on perea.ai. Where *The Federal Portable Benefits Stack 2026[^49]* mapped the 18-state legislative replication map and *State of Vertical Agents 2027[^49]: Marketplace Seller Operations* mapped the operational reality of platform-mediated work, this paper maps the litigation and institutional wiring that determines who pays, who organizes, and who decides.

It is intended for founders building gig-platform compliance products, gig-worker advocates, labor-law attorneys, policy analysts, and 1099-finance vendors deciding which markets to bid into.

## Executive Summary

This paper makes six findings.

**1. The California Supreme Court chose framing over rule.** Justice Goodwin Liu's unanimous July 25, 2024[^21] opinion in *Castellanos v. State of California* (S279622) preserved Proposition 22 by reading article XIV § 4[^21] of the California Constitution as conferring *coextensive* (not exclusive) lawmaking power between the Legislature and the electorate.[^1][^2][^3] The court explicitly reserved the open question of whether § 7465's seven-eighths supermajority requirement and § 7465[^3](c)(2)'s "any statute that amends Section 7451[^3] does not further the purposes of this chapter" clause unconstitutionally constrain the Legislature's plenary workers'-compensation authority.[^1][^21] The reservation telegraphed a roadmap for the next case.

**2. The federal-state classification stack is now a three-test problem.** The *Borello* multifactor "economic realities" test (1989[^35]), the *Dynamex* ABC test (2018[^35], codified as AB 5 in 2019[^35]), and Proposition 22's § 7451[^35] "Notwithstanding any other provision of law" carve-out for app-based drivers (2020) sit in legally uneasy tension.[^28][^32][^16] AB 5 + AB 2257 codify *Dynamex* but Proposition 22 explicitly exempts the rideshare and delivery driver workforce that triggered AB 5 in the first place.[^35]

**3. AB 1340 institutionalizes IC sectoral bargaining.** California's October 3, 2025[^45] Newsom-signed law allows more than 800,000 IC drivers to organize via PERB-administered 10%[^45] / 30%[^45] / 50%[^45] certification thresholds, with a statewide bargaining unit, while preserving independent-contractor status.[^39][^41][^43] Q4 2025 PERB data shows Uber and Lyft together comprise 99.32% of the rideshare market — making them the only "covered TNCs" under the act.[^45]

**4. The companies traded UM/UIM relief for sectoral peace.** SB 371 (Cabaldon) reduced rideshare uninsured/underinsured-motorist coverage from $1 million[^44] to $60,000 per person and $300,000 per incident, contingent on AB 1340 enactment.[^51][^54][^55] The August 29, 2025 Newsom-McGuire-Rivas-SEIU-Uber-Lyft tripartite agreement is now the model for company-labor-state deals nationally — Uber's head of California public policy called the bills "a compromise that lowers costs for riders while creating stronger voices for drivers."[^44]

**5. Three states now permit IC unionization, with a fourth distinct model in Washington.** California (AB 1340, effective 1/1/2026[^67]), Massachusetts (Question 3 / M.G.L. c.150F, codified 11/2024[^67]), and Illinois (HB 4743, filed 1/20/2026, on calendar 4/10/2026) form the IC-sectoral-bargaining cohort.[^39][^59][^64] Massachusetts was first; California is largest by driver count; Illinois is the test case for non-coastal replication. Washington Chapter 229 of the Laws of 2025[^64] (HB 1332-S) takes a different "driver resource center" approach with state-action antitrust immunity for deactivation-appeals agreements.[^65] New York's pending bills (A10078, S3487) propose the opposite approach: ABC-presumption *employee* reclassification.[^66][^67]

**6. Two open legal questions could unwind the entire stack.** First, the *Castellanos* II question: does § 7465[^50]'s 7/8 supermajority requirement and § 7465[^50](c)(2) amendment-restriction violate article XIV § 4[^50]'s "plenary power, unlimited by any provision of this Constitution" clause when applied to a future legislative attempt to extend workers' compensation to app-based drivers?[^1] Second, the federal-preemption question: does NLRA preemption plus Sherman Act § 1[^1] antitrust doctrine void state-administered IC sectoral bargaining? Antitrust scholar Aaron Gott (Mondaq, 10/2025[^1]) argues AB 1340 fails *Parker v. Brown* active-supervision requirements; the NLRB's September 12, 2025[^1] lawsuit against New York's parallel state-jurisdiction law may presage suits against California and Massachusetts.[^48][^49][^50] If either succeeds, AB 1340 + Question 3 + Illinois HB 4743 all fall together.

## Part I: The Stage — Four Years From Roesch to Liu

The Castellanos litigation was a four-year arc compressed by California's expedited-review rules and dilated by the structural problem the case raised. To understand the unanimous July 25, 2024[^50] holding, one must first trace the procedural sequence.

**November 3, 2020[^26].** Proposition 22 — the Protect App-Based Drivers and Services Act — passed with 58.6% voter approval against 41.4% opposition.[^2][^17] The Yes-on-22 campaign, funded primarily by Uber, Lyft, DoorDash, Instacart, and Postmates, spent between $200 million[^17] and $225 million[^17] depending on tally cutoff date — making it the most expensive ballot measure in California history.[^12][^14][^15][^16][^27] The opposition (primarily SEIU and labor coalitions) raised approximately $20 million.[^14] The measure added Business and Professions Code §§ 7448–7467, classifying app-based rideshare and delivery drivers as independent contractors when four conditions are met, and providing a structured benefits package: a 120%[^14] minimum-wage earnings floor, a quarterly health-care subsidy tied to ACA contribution levels, occupational accident insurance, and protection against discrimination.[^16][^18][^23][^24][^25][^26]

**January 12, 2021[^13].** Service Employees International Union, SEIU California State Council, and four named drivers (Hector Castellanos, Joseph Delgado, Saori Okawa, Michael Robinson) filed an emergency petition for writ of mandate directly in the California Supreme Court, invoking original mandamus jurisdiction under article VI § 10.[^13] The petition argued Prop 22 conflicted with article XIV § 4 (plenary workers'-compensation power), violated separation of powers via § 7465(c)(3)-(4), and breached the single-subject rule.[^13]

**February 3, 2021[^14].** The Supreme Court denied the emergency petition without prejudice to refiling in the appropriate court (S266551). Justices Liu and Cuéllar were of the opinion an order to show cause should issue.[^14] At least two of seven justices, in other words, were already disposed to hear the merits.

**February 11, 2021.** Plaintiffs refiled in Alameda County Superior Court.[^15] The case was assigned No. RG21088725 and to Judge Frank Roesch.

**August 20, 2021.** After hearing, Judge Roesch granted the petition for writ of mandate.[^11][^12] He held three things: (1) § 7451 was an unconstitutional continuing limitation on the Legislature's plenary workers'-compensation power because article XIV § 4[^12] vests the Legislature with "plenary" and "unlimited" authority that cannot be cabined by initiative statute; (2) § 7465[^12](c)(4) violated the single-subject rule because its restriction on collective-bargaining authorization was not germane to Prop 22's stated purposes; and (3) because § 7451[^12] was not severable per § 7467, "the entirety of Proposition 22 is unenforceable."[^11] Roesch's analysis was textually rigorous — the article XIV § 4 "unlimited by any provision of this Constitution" clause was added in 1918[^11], seven years *after* the 1911 voter-initiative amendment, and Roesch read the chronology as deliberate.[^7]

**March 13, 2023[^5].** A divided three-judge panel of the California Court of Appeal, First Appellate District, Division Four, partially reversed.[^6][^7][^8] Acting Presiding Justice Tracie Brown's majority opinion (joined by Justice Pollak) held that Prop 22 did *not* intrude on the Legislature's workers'-compensation authority — relying on *Independent Energy Producers Assn. v. McPherson* (38 Cal.4th 1020, 2006[^8]) for the proposition that the Legislature and the electorate share *coextensive* lawmaking power.[^7][^21] The panel did affirm Roesch's invalidation of § 7465(c)(3) and (c)(4) on separation-of-powers grounds — those subsections were facially invalid because they intruded on the judiciary's authority to define what constitutes an amendment.[^8][^10] Justice Streeter concurred and dissented in part. The Court of Appeal severed the unconstitutional subsections and let the rest of Prop 22 stand.[^4][^5]

**June 28, 2023[^5] → July 12, 2023[^5].** The California Supreme Court granted review in S279622 and limited the issues to one question: "Does Business and Professions Code section 7451, which was enacted by Proposition 22 (the 'Protect App-Based Drivers and Services Act'), conflict with article XIV, section 4 of the California Constitution and therefore require that Proposition 22, by its own terms, be deemed invalid in its entirety?"[^5]

**May 21–22, 2024[^6].** Oral argument before the Supreme Court. Scott Kronland of Altshuler Berzon LLP argued for SEIU and the named driver-plaintiffs that California's Constitution gave the Legislature "unlimited" power to regulate workers' compensation for more than a century.[^6] Justice Liu, who would author the eventual opinion, pressed Kronland on whether § 7451[^6] actually *prevents* drivers from receiving workers' compensation — or merely classifies them in a way that interacts with eligibility rules the Legislature could change.[^6] The questioning telegraphed the holding.

**July 25, 2024.** The Supreme Court issued its unanimous opinion.[^1][^2][^3] Justice Liu wrote for himself, Chief Justice Patricia Guerrero, and Justices Carol Corrigan, Leondra Kruger, Martin Jenkins, Joshua Groban, and Kelli Evans — a 7-0 vote.[^1][^5] The court affirmed the Court of Appeal "insofar as it held that Business and Professions Code section 7451 does not conflict with article XIV, section 4 of the California Constitution."[^1] But the holding came with a critical reservation. "Whether the operation of section 7465 and article II, section 10(c) improperly constrains the Legislature's article XIV authority to enact future legislation," Justice Liu wrote, "is not presented here, and we express no view on that question."[^1]

That single sentence is the load-bearing structural element of every prediction in this paper. The *Castellanos* court chose to dispose of one question and reserve another. The reserved question is the next case.

## Part II: The Castellanos Holding — Coextensive Power and the Reserved Question

Justice Liu's analytical move was to read article XIV § 4 as a *grant* of authority rather than a *limitation* on initiative power.[^1][^21] The textual hook is the constitutional clause itself: "The Legislature is hereby expressly vested with plenary power, unlimited by any provision of this Constitution, to create, and enforce a complete system of workers' compensation, by appropriate legislation."[^19] Plaintiffs argued the "unlimited" clause was meant to insulate the Legislature's workers'-compensation authority from any other constitutional provision — including, by extension, the article II initiative power.[^15][^21] The Court of Appeal rejected that reading, and the Supreme Court agreed.

The doctrinal anchor is *Independent Energy Producers Assn. v. McPherson* (38 Cal.4th 1020, 2006[^21]), which Justice Liu cited as having "concluded that under article XIV, section 4, the voters and the Legislature 'jointly and severally have authority to create a workers' compensation' system."[^1][^7] Under *McPherson*, the article XIV § 4 phrase "The Legislature is hereby expressly vested with plenary power" must be read as if it said "The Legislature *or the electorate acting through the initiative power* are hereby expressly vested with plenary power."[^7] The Berkeley California Constitution Center's amicus brief framed this as the "coextensive lawmaking power" doctrine: where the Legislature can legislate, the electorate can too — even when the constitutional text grants the power explicitly to "the Legislature."[^21]

This was not a textual stretch. Justice Liu walked through the historical context: the article XIV § 4[^21] "unlimited by any provision of this Constitution" clause was added in 1918, seven years *after* the 1911 voter-initiative amendment.[^7] The 1918 clause was a response to constitutional challenges to the existing workers'-compensation system — courts had been striking down WC statutes on substantive due-process grounds, and the amendment was designed to eliminate doubt about WC validity. It was *not*, the court concluded, designed to limit the initiative power, which had been ratified seven years earlier and which the 1918 voters knew about.[^7][^21]

A second analytical move was the *first-mover advantage* concern. If article XIV § 4[^7] vested the Legislature with exclusive workers'-compensation authority, then any future initiative measure modifying the workers'-compensation system would be invalid — and the electorate would never be able to undo a legislative WC decision via initiative. That asymmetry, Justice Liu observed, would give "the Legislature what would essentially be a first-mover advantage, precluding the electorate from undoing any action the Legislature takes."[^1] The court read this as an unacceptable inversion of the initiative-power doctrine, which the California Supreme Court had described in *Briggs v. Brown* (3 Cal.5th 808, 2017[^1]) as "our solemn duty to jealously guard the precious initiative power, and to resolve any reasonable doubts in favor of its exercise."[^7]

Having dismissed the article XIV § 4[^1] challenge to § 7451[^1], the court turned to the more subtle § 7465[^1] question. Plaintiffs and the Attorney General both argued that even if § 7451[^1] itself didn't conflict with article XIV § 4[^1], the *combination* of § 7465[^1](a)'s seven-eighths supermajority requirement and § 7465[^1](c)(2)'s "any statute that amends Section 7451[^1] does not further the purposes of this chapter" clause would unconstitutionally constrain the Legislature's ability to enact future workers'-compensation laws covering app-based drivers.[^1] The Attorney General acknowledged the seven-eighths requirement "may be constitutionally problematic" — invoking *County of Los Angeles v. State* (43 Cal.3d 46, 1987[^1]), which addressed an analogous tension between article XIV § 4[^1] plenary power and article XIII B § 6 supermajority requirements for state-mandated programs.[^1]

The court declined to reach the question. "We have no need in this case to decide the applicability of our reasoning in *County of Los Angeles* to Proposition 22 or to determine the extent to which article XIV, section 4 may limit the initiative power," Justice Liu wrote. "We reserve these issues until we are presented with an actual challenge to an act of the Legislature providing workers' compensation to app-based drivers."[^1] The reservation is constitutional avoidance at its most precise: the court resolved the case on the narrowest available ground and explicitly preserved the more difficult question for a future ripe controversy.

The SCOCAblog analysis captured the strategic posture exactly: "the opinion telegraphed a roadmap for a legislative response, noting that 'section 7451 itself says nothing about workers' compensation, and the Legislature has made a number of exceptions to the general eligibility rule in order to extend workers' compensation to nonemployees.'"[^2] In other words: the Legislature *can* try to extend workers' compensation to app-based drivers via a statute that doesn't directly amend § 7451[^2] but instead modifies the general workers'-compensation eligibility rule. Whether such a statute would constitute an "amendment" subject to § 7465[^2]'s seven-eighths requirement — that is the *Castellanos* II question. Whether the seven-eighths requirement itself is constitutional — that is the deeper question. Both are reserved.

## Part III: Court of Appeal A163655M — The Severance Doctrine

The Court of Appeal opinion in A163655M, modified June 30, 2023[^10], did three things the Supreme Court did not have occasion to undo, and it is therefore the operative law on those points.[^6][^7] The first was to reverse Judge Roesch on the article XIV § 4 plenary-power question, applying *McPherson*. The second was to reverse Roesch on the single-subject rule challenge to § 7465[^7](c)(4) — the panel held that § 7465[^7](c)(4)'s collective-bargaining amendment-restriction was germane to Prop 22's "common theme, purpose, or subject" because it relates to drivers' working conditions.[^7] The third — and the one the Cal Supreme Court did not review — was to invalidate § 7465(c)(3) and (c)(4) on separation-of-powers grounds.[^7][^8][^10]

The (c)(3) holding turned on judicial supremacy. Section 7465[^10](c)(3) declares that "any statute that prohibits app-based drivers from performing a particular rideshare service or delivery service while allowing other individuals or entities to perform the same rideshare service or delivery service, or otherwise imposes unequal regulatory burdens upon app-based drivers based on their classification status, constitutes an amendment of this chapter."[^22] The Court of Appeal found this facially invalid because it intruded on the judiciary's exclusive authority to determine what constitutes a legislative "amendment" under article II § 10[^22](c). Defining what is and isn't an amendment, the panel held, is a question of law for the courts — Prop 22 cannot bind that judicial determination.[^7][^10]

The (c)(4) holding went further. Section 7465[^10](c)(4) declares that "any statute that authorizes any entity or organization to represent the interests of app-based drivers in connection with drivers' contractual relationships with network companies, or drivers' compensation, benefits, or working conditions, constitutes an amendment of this chapter."[^22] The panel agreed with plaintiffs that this provision did two unconstitutional things at once: it intruded on the judiciary's amendment-definition authority *and* it intruded on the Legislature's authority to address "a related but distinct area" or a matter that Proposition 22 "does not specifically authorize or prohibit." Quoting *People v. Kelly* (47 Cal.4th 1008, 1025–1026, 2010[^22]), the court explained that an initiative cannot extend its constitutional shadow over subjects it does not actually address.[^7] Collective-bargaining authorization for app-based drivers, the court found, was not within Prop 22's stated subject matter — and so § 7465[^7](c)(4) was invalid both as an amendment-definition usurpation and as a constraint on the Legislature's authority to legislate on related-but-distinct matters.[^4][^7][^10]

The Election Law Blog (Hasen, 3/14/2023[^4]) credits the unanimity of the (c)(4) holding to the California Election Law Professors amicus brief filed by Joey Fishkin (UCLA), Franita Tolson (USC), and Rick Hasen, with co-counsel from Public Counsel.[^4] The brief made the structural argument that the panel ultimately adopted: extending Prop 22's article II § 10[^4](c) shadow to bar legislation on subjects which Prop 22 did not directly address would intrude on the Legislature's authority to legislate on "related but distinct areas."[^4] That argument is now the operative law.

The severance analysis followed mechanically from the unconstitutionality finding. Section 7467[^7](b) of Prop 22 declares that if any provision is held unconstitutional, the remaining provisions "shall remain in effect to the maximum extent possible." The panel applied that severance clause and concluded that § 7465[^7](c)(3) and (c)(4) could be excised without rendering the rest of Prop 22 unworkable. The result is that § 7465[^7](a) (the seven-eighths supermajority requirement itself), § 7465[^7](c)(2) (the "any statute that amends Section 7451[^7] does not further the purposes" clause), and the entire benefits structure of §§ 7453[^7]–7455 all remain in effect; only the (c)(3) unequal-burdens-as-amendment definition and the (c)(4) collective-bargaining-as-amendment definition are excised.[^4][^5][^7]

This severance is the legal foundation that made AB 1340 possible. With § 7465[^7](c)(4) struck down, the California Legislature could pass a statute authorizing collective-bargaining representation for app-based drivers without that statute being deemed an "amendment" to Prop 22 requiring a seven-eighths majority. The Court of Appeal had explicitly cleared the path for the legislative move that came two and a half years later.

## Part IV: The Federal-State Classification Stack — Borello, Dynamex, AB 5, Prop 22

To understand why Prop 22 was politically inevitable in 2020[^7], one must understand what AB 5 had done a year earlier — and what *Dynamex* had done a year before that. The American worker-classification doctrine is now a three-layer stack, and each layer was built in response to perceived gaps in the prior layer.

**Layer 1: *Borello* (1989[^28]).** The California Supreme Court's decision in *S.G. Borello & Sons, Inc. v. Department of Industrial Relations* (48 Cal.3d 341) adopted the "economic realities" test for distinguishing employees from independent contractors.[^28][^29] The principal factor is whether "the person to whom services is rendered has the right to control the manner and means of accomplishing the result desired" — supplemented by nine secondary factors including the right to discharge at will, whether the worker is engaged in a distinct occupation, the locality's customary work arrangement, the skill required, who supplies the tools, the duration of the engagement, payment method, whether the work is part of the principal's regular business, and the parties' subjective belief about the relationship.[^28] *Borello* explicitly noted that "the individual factors cannot be applied mechanically as separate tests; they are intertwined and their weight depends often on particular combinations."[^28] The test was multifactor by design — and that flexibility became its perceived weakness.

**Layer 2: *Dynamex* (2018[^29]).** Thirty years later, in *Dynamex Operations West, Inc. v. Superior Court of Los Angeles County* (S222732, 4/30/2018[^29]), Chief Justice Cantil-Sakauye's unanimous opinion adopted a new test specifically for "suffer or permit to work" wage-order classification: the ABC test.[^28][^29][^30][^31] Under the ABC test, a worker is an independent contractor *only if* the hiring entity establishes all three of: (A) the worker is free from the control and direction of the hirer in connection with the performance of the work, both under the contract and in fact; (B) the worker performs work that is outside the usual course of the hiring entity's business; and (C) the worker is customarily engaged in an independently established trade, occupation, or business of the same nature as the work performed.[^28][^29] *Dynamex* explicitly criticized *Borello*'s multifactor approach as one that "makes it difficult for both hiring businesses and workers to determine in advance how a particular category of workers will be classified, frequently leaving the ultimate employee or independent contractor determination to a subsequent and often considerably delayed judicial decision."[^29] The ABC test was designed for predictability.

The critical structural feature of *Dynamex* — and the feature plaintiffs in *Castellanos* would later try to leverage — was its scope. The ABC test applied *only* to "suffer or permit to work" classification under Industrial Welfare Commission wage orders.[^18][^29] It did not apply to common-law employee determinations under the Labor Code generally; it did not apply to workers'-compensation eligibility (governed by Labor Code § 3600[^29] and the *Borello* test); it did not apply to unemployment-insurance status. *Dynamex* reshaped wage-order analysis but left the rest of the worker-classification doctrine intact.

**Layer 3: AB 5 + AB 2257 (2019[^38]–2020[^38]).** Assemblymember Lorena Gonzalez of San Diego introduced Assembly Bill 5 in 2019[^38] with the explicit "intent of the Legislature to codify the decision in the *Dynamex* case and clarify its application."[^32][^33][^34] AB 5, signed by Governor Newsom and chaptered as Chapter 296 of the Statutes of 2019[^34] with a January 1, 2020[^34] effective date, did two consequential things. First, it expanded the ABC test's scope from wage orders alone to the Labor Code generally and the Unemployment Insurance Code, dramatically expanding the universe of classification disputes governed by ABC.[^32][^33][^37] Second, it included professional-services exemptions for occupations whose business model depended on independent-contractor status — licensed insurance agents, certain licensed health-care professionals, registered securities broker-dealers and investment advisers, real estate licensees, commercial fishermen, licensed barbers and cosmetologists, and others.[^32][^33] Workers in exempt categories continued to be governed by the *Borello* multifactor test.[^32][^38]

The implementation immediately revealed political gaps. Industries whose business models required IC classification but had not been included in the original AB 5 exemption list — freelance writers, photographers, musicians, real estate appraisers, home inspectors, fine artists — lobbied for relief. Gonzalez introduced AB 2257 in 2020[^37], signed September 4, 2020[^37], which added wide-ranging new exemptions: musicians and members of musical groups for single-event performances, freelance writers and translators with written contracts, photographers and photojournalists with no submission caps, content aggregators, real estate appraisers, home inspectors, manufactured housing salespeople, animal services, competition judges, professional consulting services, and a substantially expanded business-to-business sole-proprietor exemption.[^20][^35][^36][^37]

What AB 2257 conspicuously did *not* exempt was the gig-platform workforce. Holland & Knight's contemporaneous analysis put it directly: "AB 2257 notably does not make any accommodations for certain transportation and technology companies that serve as an interchange to connect drivers to passengers."[^20] Gordon Rees Scully Mansukhani's analysis was more pointed: "No new exemptions for the trucking industry, gig economy companies (industries with temporary positions for short-term commitments), or the motion picture and television industries; Proposition 22 remains on the ballot for this November; if passed, it would create special employment rules for drivers working for app-based ride-share and meal delivery services."[^22]

**Layer 4 (the override): Proposition 22 § 7451[^18] (2020[^18]).** Two months after AB 2257 became law, California voters passed Proposition 22. Section 7451[^18] begins with the override clause: "Notwithstanding any other provision of law, including, but not limited to, the Labor Code, the Unemployment Insurance Code, and any orders, regulations, or opinions of the Department of Industrial Relations or any board, division, or commission within the Department of Industrial Relations, an app-based driver is an independent contractor and not an employee or agent."[^16][^17][^18] The "Notwithstanding" clause was carefully drafted to override AB 5's expanded ABC test, AB 2257's clarifications, and any administrative interpretation by the DIR. App-based drivers, the voters declared, were independent contractors as a matter of statutory law — not as a matter of fact-bound multifactor analysis.

The result is a four-layer worker-classification stack in California, where each layer governs a different question and each layer was built to address perceived inadequacies in the layer above. *Borello* governs general common-law classification. *Dynamex* / AB 5 / AB 2257 govern the wage-order and Labor Code questions for non-exempt workers. Proposition 22 § 7451[^18] governs the rideshare and delivery-driver classification question specifically. And the *Castellanos* unanimity preserves all four layers in their current configuration — at least until the reserved § 7465[^18] question reaches the court.

## Part V: AB 1340 + SB 371 — The Tripartite Agreement Architecture

If *Castellanos* (7/25/2024[^18]) was the constitutional ceiling for Proposition 22, AB 1340 (10/3/2025[^18]) was the operational floor for what the California Legislature could do *under* that ceiling. The intervening fourteen months produced one of the most unusual legislative deals in California labor history: a tripartite agreement between the Governor, the legislative leadership, the lead labor union (SEIU California), and the two largest gig platforms (Uber and Lyft), exchanging sectoral-bargaining rights for insurance-cost relief.

**The pre-deal context.** Assemblymembers Buffy Wicks (D-Oakland) and Marc Berman (D-Menlo Park) introduced AB 1340 on February 21, 2025.[^40] The bill went through five amendment cycles between February 2025 and September 2025[^40] — Assembly amendments on April 8 and May 27, Senate amendments on June 19 and September 2.[^40] Through summer 2025, Uber and Lyft formally opposed the bill. In parallel, Senator Christopher Cabaldon (D-West Sacramento) introduced SB 371 — a separate bill that would reduce the rideshare uninsured/underinsured-motorist coverage requirement from $1 million[^40] to $50,000 [^40]per person and $100,000 [^40]per incident, with the explicit intent of reducing rideshare insurance costs that Uber and Lyft argued comprised up to 45% of fare in Los Angeles.[^52][^53][^55] SB 371 was sponsored by Uber and Lyft. AB 1340 was sponsored by SEIU California. The bills were moving on separate tracks.[^54]

**August 29, 2025[^44]: the tripartite agreement.** On the morning of the legislature's suspense file hearings — when hundreds of bills are released for floor votes or killed in a secretive process — Governor Gavin Newsom, Senate President Pro Tem Mike McGuire, and Assembly Speaker Robert Rivas announced joint support for AB 1340 *and* SB 371 as a paired package.[^44][^27][^28] Uber and Lyft simultaneously dropped their opposition to AB 1340.[^29][^31] Tia Orr, Executive Director of SEIU California, and Ramona Prieto, Uber's Head of Public Policy for California, both spoke at the joint announcement.[^44] Nick Johnson, Lyft's Director of Public Policy, called it "a major victory for both riders and drivers in California."[^44] The deal threaded a needle: drivers got a path to collective bargaining, the companies got insurance-cost relief, and California got a model that other states could replicate.

The bills moved together. AB 1340 passed the Senate 29-10 on September 8, 2025 and the Assembly concurred 60-15 on September 9.[^40] SB 371 passed the Senate 39-0 in earlier votes.[^52] Newsom signed AB 1340 on October 3, 2025 at a Berkeley signing ceremony with organized labor, chaptering it as Chapter 335 of the Statutes of 2025.[^39][^43][^40] The bill took effect January 1, 2026. SB 371's effective date was contingent: "This act shall become operative only if Assembly Bill 1340 of the 2025[^40]–26 Regular Session is enacted and becomes effective on or before January 1, 2026."[^51] Both bills cleared the contingency together.

**AB 1340 mechanics — the certification ladder.** The act, codified at Bus. & Prof. Code § 7470[^42] et seq., establishes the right of TNC drivers to "form, join, and participate in the activities of TNC driver organizations, to bargain through representatives of their own choosing, to engage in concerted activities for the purpose of bargaining or other mutual aid or protection, and to refrain from such activities."[^39] PERB administers the statute under § 7470.8's three-tier certification ladder.[^42]

The first rung is a *10%[^25] authorization showing*. Beginning May 1, 2026[^25], a TNC driver organization may present PERB with proof that at least 10%[^25] of "active TNC drivers" have authorized it as their bargaining representative. PERB has 30 days to verify the showing.[^42] If verified, the organization gets a six-month exclusive window during which no competing organization can be certified without an election. Active drivers, defined statutorily, are those at-or-above the median ride count over the preceding six months among drivers who completed at least 20 rides — roughly the top half of the workforce by ride volume, with sub-20-ride drivers excluded entirely.[^25]

The second rung is a *30%[^42]-but-less-than-majority showing*. If a driver organization presents evidence of at least 30%[^42] (but less than majority) authorization, PERB waits 30 days. During that window, two things can happen: another organization can present its own 30%[^42] showing (triggering an election within 60 days among all listed organizations), or 30%[^42] of active drivers can present a "no-union" petition (also triggering an election). If neither happens, the original organization is certified without election.[^42] Election notices must be translated into all languages spoken by 5% or more of the active driver workforce — a procedural recognition that California's TNC workforce is heavily multilingual.[^42]

The third rung is *automatic certification at majority*. If a driver organization presents evidence of authorization from a majority of active drivers, PERB certifies it as the bargaining representative without holding an election.[^46] This is the most generous threshold in any U.S. state-level IC unionization framework — Massachusetts requires 25%[^46] authorization for certification (with election possible at 5%[^46]), Illinois requires 30%[^46], the National Labor Relations Act traditionally requires either a 30%[^46]-petition election or majority-card-check union recognition.

**The covered-TNC threshold.** A "covered TNC" under AB 1340 is a transportation network company comprising at least 0.5%[^39] of total quarterly rideshare volume; PERB compiles the list quarterly from TNC-submitted ride data.[^39][^45] Q4 2025 PERB data showed only Uber (60.5553%) and Lyft (38.7612%) above the 0.5%[^45] threshold — together comprising 99.32%[^45] of the market. Eleven other TNCs (Via, Silver Ride, HopSkipDrive, Provado Mobile Health, Uzurv Holdings, Onward, Kango, Opoli, Wingz, Alto, Prime Time Rideshare) all fell below — many of them serving niche markets such as senior transportation, non-emergency medical transportation, disability-accessible service, or youth transit.[^45] A "sectoral agreement" between a certified driver organization and the covered TNCs must include the two largest covered TNCs and represent at least 80% of the industry by rideshare volume.[^39]

**SB 371 mechanics — the insurance-cost trade.** SB 371 amends Public Utilities Code § 5433[^51] to reduce TNC uninsured/underinsured-motorist coverage from $1 million[^51] to $60,000 [^51]per person and $300,000 [^51]per incident from the moment a passenger enters the vehicle until the passenger exits.[^51][^52] The Senate originally passed a $50,000/$100,000 version (39-0); the Assembly Insurance Committee recommended raising the limits to $100,000/$300,000; the final bill landed at $60,000/$300,000.[^53] The $1 million liability coverage for death, personal injury, and property damage during pickup-and-drop-off remains unchanged.[^51]

The trade-off is real money. Uber's California public-statement positioning estimates that government-mandated insurance accounts for approximately one-third of every fare statewide and up to 45%[^52] in Los Angeles County; Lyft's estimate is $6 of every California ride going to insurance — double the national average.[^55] The $1 million UM/UIM requirement, originally enacted in 2014 when the TNC industry was new, was specifically targeted because no other vehicle class in California (taxis, buses, personal cars) is required to carry UM/UIM coverage at all.[^54][^55] SB 371 includes a CPUC-CDI joint-study requirement due December 31, 2030, a sunset on February 1, 2030[^55], and a repeal effective January 1, 2031 — meaning the insurance reduction must be revisited within five years.[^51][^52]

**The internal-labor dissent.** Not all California gig-driver organizers backed AB 1340. Rideshare Drivers United, an organization with more than 20,000 California members, criticized AB 1340's requirement that certifiable TNC driver organizations have "experience negotiating a labor contract or be affiliated with such a union" — arguing the requirement unduly favored the bill's primary backer, SEIU. Jason Munderloh, an 11-year San Francisco Uber and Lyft driver, told KQED that the law "does not guarantee" certain protections he wanted to see.[^23] David Green, president of SEIU Local 721, characterized the package as "the largest expansion of private sector collective bargaining in California history."[^29]

## Part VI: PERB Administration and the Q4 2025 Covered-TNC Data

The Public Employment Relations Board — California's quasi-judicial agency for state and local public employer-employee relations — was given primary administrative authority over AB 1340.[^41][^45] PERB had no prior experience administering an independent-contractor sectoral-bargaining framework. The 2025[^45]-2026[^45] rulemaking work-up is therefore the first regulatory build-out of any U.S. state-level IC unionization regime — the institutional details matter both for California operations and for Massachusetts and Illinois replication.

**The rulemaking timeline.** On October 8, 2025[^49], five days after Newsom's signature, PERB issued a news item formally noticing that the agency would administer the new law and issuing a draft rulemaking package for public comment.[^50] The Board held a special meeting on November 12, 2025 at which it authorized the rulemaking subcommittee to consider revisions; public comments were submitted by Uber Technologies, Lyft Inc., SEIU California, and the Mastagni-Holstedt law firm (which represents Sacramento-area drivers).[^46] The subcommittee revised the proposed text. At a public meeting on February 12, 2026[^46], the Board authorized submission of the revised rulemaking package to the California Office of Administrative Law to initiate formal rulemaking.[^48][^49] PERB staff is preparing the formal package for OAL submission as of the date of this paper. Once filed, the OAL has 30 working days to review for compliance with administrative-procedure requirements; the regulations will then take effect after the standard public-comment period.

**The first quarterly application window.** Independent of rulemaking, the statute itself created PERB obligations effective January 1, 2026[^47]. On December 30, 2025[^47], PERB issued a news release announcing the *inaugural 10-day TNC driver organization application period* — opening January 20, 2026 and closing January 29, 2026.[^47] During each quarterly window, entities may apply for or renew designation as a "TNC driver organization" — the threshold credential for participation in the certification process. Applications require demonstration of either prior labor-contract negotiating experience or affiliation with such a union.[^47]

The May 1, 2026[^24] milestone is the more consequential. Beginning that date, qualified TNC driver organizations may begin presenting PERB with 10%[^24] authorization showings; the first 10%[^24] certification window closes June 1 (30 days after the May 1 first eligibility). The SF Examiner reporting on February 23, 2026[^24] documented Rideshare Drivers United organizer Tonatiuh Moore's plan to seek April 2026 PERB qualification and to meet the May 2026 10% authorization threshold.[^26] Bloomberg Law's procedural summary captured the rate-limiting structural feature: "the practical hurdle of securing signatures of support from drivers scattered in vehicles across California."[^24] California's geographic dispersion is itself a barrier to certification.

**The Q4 2025[^45] covered-TNC data.** PERB's TNC Act page documents the first quarterly covered/noncovered determination, based on rideshare volume reported by TNCs themselves under the § 7470.6 quarterly-data-submission requirement.[^45] The numbers reveal how concentrated the California rideshare market actually is.

| TNC | Q4 2025 Rides | Market Share | Covered/Noncovered |
|---|---|---|---|
| Uber | 41,642,475 | 60.5553% | **Covered** |
| Lyft | 26,655,213 | 38.7612%[^45] | **Covered** |
| Via | 173,703 | 0.2526% | Noncovered |
| Silver Ride | 125,555 | 0.1826%[^45] | Noncovered |
| HopSkipDrive | 90,241 | 0.1312% | Noncovered |
| Provado Mobile Health | 25,898 | 0.0377%[^45] | Noncovered |
| Uzurv Holdings | 24,042 | 0.0350% | Noncovered |
| Onward | 15,739 | 0.0229%[^45] | Noncovered |
| Kango | 9,893 | 0.0144% | Noncovered |
| Opoli | 2,710 | 0.0039%[^45] | Noncovered |
| Wingz | 2,218 | 0.0032% | Noncovered |
| Alto | 0 | 0.0000%[^45] | Noncovered |
| Prime Time Rideshare | 0 | 0.0000% | Noncovered |
| **TOTAL** | **68,767,687** | **100.00%[^45]** | — |

The implication is that AB 1340 effectively governs only the Uber-and-Lyft duopoly. Eleven other TNCs operating in California fall below the coverage threshold and sit outside the bargaining framework. Many serve specialized markets: HopSkipDrive serves children needing transportation to school and medical appointments; Silver Ride and Onward focus on seniors and disability-accessible transportation; Provado Mobile Health serves non-emergency medical transportation; Kango focuses on youth transit. These markets have different operational economics — typically scheduled rides rather than on-demand — and their drivers may not view AB 1340-style sectoral bargaining as relevant. The framework's coverage threshold is itself a policy choice: it lowers regulatory complexity for niche operators but excludes their drivers from the union-rights framework.

## Part VII: Massachusetts — Question 3, the AG Settlement, and the Portable Health Fund

Massachusetts arrived at IC sectoral bargaining via a different path than California — and earlier. While California's framework was built through legislative compromise after a Cal Supreme Court decision, Massachusetts's was built through parallel legal-and-political tracks: a multi-year Attorney General lawsuit and a simultaneous ballot-question signature drive, both producing simultaneous outcomes in summer–fall 2024[^45].

**The AG lawsuit (2020[^57]–2024[^57]).** In July 2020[^57], then-Attorney General Maura Healey (now Governor) filed suit against Uber and Lyft, alleging the companies had inflated their profits for years by treating drivers as independent contractors and denying them the wages and benefits owed to employees under Massachusetts wage-and-hour law.[^36][^37][^39] The case proceeded slowly through pre-trial discovery and motions practice. By 2024[^39], Andrea Joy Campbell had succeeded Healey as Attorney General. A three-week trial began in May 2024 in Massachusetts Superior Court before Judge Peter Krupp.[^57] Closing arguments were scheduled for June 28.

**The June 27, 2024[^58] settlement.** On the eve of closing arguments, Campbell's office announced a $175 million[^58] settlement with Uber and Lyft — Uber paying $148 million, Lyft paying $27 million.[^56][^57][^36] The settlement preserved IC classification (the legal question Healey had originally sued to test) but extracted substantial wage and benefit concessions. The minimum-engaged-time pay was set at $32.50 [^36]per hour starting August 15, 2024[^36] — adjusted annually for inflation, reaching $33.48 by January 15, 2025 with the 3% annual escalator.[^57] Drivers were guaranteed paid sick leave (one hour per 30 worked, max 40 hours per year), a stipend for buying into the state's Paid Family and Medical Leave program, an occupational accident insurance policy with up to $1 million[^57] in coverage, and most consequentially, a *pooled health insurance stipend* allowing drivers to combine hours across Uber and Lyft to qualify for an Affordable Care Act premium subsidy.[^56][^58]

The pooled-hours mechanism is the operational innovation. Under prior gig-economy benefits structures (such as Stride's Pennsylvania pilot and Utah pilot), each platform paid benefits separately based on hours worked on that platform alone. Drivers working 10 hours per week on Uber and 10 on Lyft would qualify for nothing on either platform. The Massachusetts settlement required Uber and Lyft to combine hours through a third-party administrator (Stride Health), so a 20-hour-total-week driver — even if split across platforms — qualifies for the partial 50% stipend, and a 25+-hour-week driver qualifies for the full 100% stipend.[^60][^61][^62]

**The strategic settlement timing.** Campbell explained her reasoning in a follow-up Boston Public Radio interview on July 10, 2024 and in a Commonwealth Beacon interview on the same date.[^38][^39] The AG team was confident they could win at trial — the misclassification claim under Massachusetts law was strong. But they were also aware that a separate ballot question, sponsored by the gig platforms and pre-cleared for the November 2024[^39] ballot by the Massachusetts Supreme Judicial Court hours before the settlement, would have allowed voters to enact a competing law defining drivers as independent contractors and stripping the trial victory of forward-looking effect. "A win in court might have given drivers restitution for pay they were owed in the past, but a successful ballot initiative would have wiped out its impact going forward," Campbell told reporters. "Our deal with Uber and Lyft made sure that drivers can have both."[^38] The settlement included an explicit commitment by Uber and Lyft *not* to fund or support the 2024 industry ballot effort — and that effort was effectively dead within days.[^38]

**Question 3 (November 2024[^41]).** A separate ballot question, sponsored by SEIU 32BJ, the Service Employees International Union, and the International Association of Machinists, did not concern classification but unionization. The United for Justice ballot committee submitted 12,429 second-phase signatures on July 2, 2024[^41] — exceeded the threshold by several thousand — after submitting more than the required 74,574 first-phase signatures earlier.[^34] On June 27, 2024, the same day Campbell announced the settlement, the Massachusetts Supreme Judicial Court cleared Question 3 for the November 5, 2024 ballot.[^41]

Question 3 passed 54% to 46%, the closest of five referendums on the ballot.[^40] The codified law, M.G.L. c. 150F, took effect December 5, 2024.[^59] The certification thresholds under c. 150F differ from California's: a 5% authorization showing earns access to the active-driver list, a 25%[^59] authorization showing entitles a driver organization to be certified as the exclusive bargaining representative, and any collective bargaining agreement must be approved by a majority of drivers who completed at least 100 trips in the previous quarter — plus the Massachusetts Secretary of Labor.[^33][^35][^41] The Department of Labor Relations (DLR) — not PERB — administers the framework.[^59]

**The Tufts cSPA analysis** captured the structural innovation. Massachusetts's sector-based bargaining model required four interlocking pieces: (1) the state asserts regulatory authority over the bargaining process, (2) the industry receives a state-action antitrust exemption allowing IC drivers to coordinate without triggering Sherman Act concerns, (3) clear bargaining rules are established by the state, and (4) the Secretary of Labor reviews and approves agreements — cementing state authority over the framework and (the cSPA report argued) shielding it from federal preemption challenges.[^35] The cSPA analysis warned that "sector-based bargaining is largely untested in the United States and likely to face serious legal challenges" — a prediction that AB 1340 commentators would echo a year later.

**The App Drivers Union petition.** As of December 2025[^59], the Massachusetts DLR had not yet certified any rideshare union as the exclusive representative.[^59] The App Drivers Union (ADU) had filed a representation petition seeking to represent Massachusetts rideshare drivers; DLR had begun the process of evaluating the petition under c. 150F's procedural rules at 456 CMR 24.00.[^59] The ADU petition is the first test of the Massachusetts certification machinery.

**The Portable Health Fund operational details.** The first qualifying quarter for the Massachusetts Driver Portable Health Fund was Q2 2025[^62] (April 1 to June 30, 2025); the first stipend payments went out in August 2025.[^60][^62] Stride Health serves as the third-party administrator. Drivers averaging 15-24.99 hours per week of pooled engaged time across Uber and Lyft receive a *partial stipend* of $537 [^62]per quarter (50%[^62] of the lowest-tier Bronze plan on the Massachusetts Health Connector ACA exchange); drivers averaging 25 hours per week or more receive a *full stipend* of $1,074 per quarter (100% of the Bronze contribution).[^60][^61][^62] By Stride's own platform numbers, the program was the first cross-platform hour pooling implementation in the United States — establishing the operational template that AB 1340 sectoral bargaining can build on, and that any future Illinois HB 4743 implementation will likely follow.

## Part VIII: The Three-State Cohort and Washington's Driver-Resource-Center Variant

Massachusetts, California, and Illinois now form a three-state IC sectoral-bargaining cohort. The chronology is tight: Massachusetts first (Question 3 passing November 5, 2024[^64], c. 150F effective December 2024[^64]), California second (AB 1340 signed October 3, 2025[^64], effective January 1, 2026[^64]), Illinois third (HB 4743 introduced February 2, 2026, on calendar second reading April 10, 2026).[^41][^39][^64] The thresholds are different in each state — Massachusetts uses 5%/25%, California uses 10%[^64]/30%[^64]/50%[^64], Illinois uses 10%[^64]/30%[^64] — but the structural architecture is identical: state-administered union certification while preserving independent-contractor classification.

**Illinois HB 4743.** Sponsored by State Senator Ram Villivalam (D-Chicago) and Representative Yolonda Morris (D-Chicago), the bill was developed by the Illinois Drivers Alliance, a coalition backed by SEIU Local 1 and the International Association of Machinists Local 701.[^42][^43][^44][^45] An estimated 100,000 ride-hailing drivers in Illinois could be brought into the framework — smaller than California's 800,000 but larger than Massachusetts's 200,000.[^42][^36] The bill follows the California pattern: 10% initial showing → 30% certification, statewide bargaining unit, voluntary dues, IC status preserved.[^42] Active drivers under the Illinois bill are defined as those at-or-above the median rides among drivers who completed at least 5 rides in the past 6 months — a lower floor than California's 20-ride minimum.[^42]

The Illinois deal-making mirrored California's. In June 2025[^64], the Illinois Drivers Alliance announced that Uber had agreed not to oppose statewide bargaining legislation — clearing the political path for HB 4743's January 2026 introduction.[^43][^44] Uber spokesman Josh Gold told Block Club Chicago in early 2026 that the company "expects to be able to work with the legislature and other stakeholders on legislation that would create a pathway for independent contractors to organize" — a stance markedly different from the company's 2020 California posture.[^43] As of April 10, 2026, the bill was held on calendar at second reading short debate stage.[^64]

**Washington Chapter 229 (HB 1332-S, 2025[^65]).** Washington took a different architectural choice. Rather than a full sectoral-bargaining framework, the 2025[^65] Washington statute (Chapter 229 of the Laws of 2025[^65], passed by the House April 17, 2025[^65], effective September 1, 2025[^65] with section 3 effective July 1, 2026) creates a "driver resource center" structure.[^65] A driver resource center is a registered nonprofit organization providing services to gig-economy workers, and Washington TNCs may, *at their own volition*, enter into agreements with such a center regarding driver-account-deactivation appeals processes.[^65] The state grants explicit antitrust immunity for those agreements: "any agreement under this section is immune from all federal and state antitrust laws."[^65] TNCs operating in Washington must make good-faith efforts to reach an agreement within 120 days of a driver-resource-center designation.[^65]

The Washington model is partial. It does not create sectoral bargaining; it does not authorize unionization; it does not provide a mechanism for drivers to elect a representative. What it does provide is *infrastructure for driver-side institutional advocacy* — the registered-nonprofit driver resource center — and a deactivation-appeals carve-out from the standard at-will deactivation regime. The model is a precursor; if Washington follows up with a sectoral-bargaining bill in 2027[^65] or 2028[^65], the driver-resource-center infrastructure will already be in place.

**New York's two parallel tracks.** New York has not yet enacted IC sectoral bargaining, but its legislature has multiple pending bills that take a markedly different approach: rather than preserving IC status and adding state-administered bargaining, the New York bills propose *employee classification*. Senate Bill 3487 (2025[^66]-2026[^66] session) amends Labor Law § 511[^66] and Workers' Compensation Law § 201[^66] to codify a statewide ABC test, presumptively treating workers (including TNC drivers) as employees unless the hiring entity meets all three Dynamex prongs.[^67] Assembly Bill A10078, introduced January 30, 2026 and referred to the Labor Committee, applies the same ABC presumption specifically to TNC drivers.[^66] If either bill becomes law, New York's TNC drivers would gain National Labor Relations Act unionization rights automatically — bypassing the IC-classification preemption-shield argument entirely.

The New York approach is more legally straightforward but politically harder. It directly confronts the question that California, Massachusetts, and Illinois have all chosen to avoid: should TNC drivers be employees? California's voters answered no in 2020[^36]. Massachusetts's voters answered the question implicitly in 2024[^36] when they approved Question 3 (which preserved IC status) rather than competing employment-classification ballot measures that the platforms had pushed into court for pre-clearance.[^36] New York is the first major state where the legislative path goes the opposite direction.

**The federalism architecture.** Five different state-level approaches to the IC unionization question are now visible:

| State | Model | Active | Authority Threshold | Status |
|---|---|---|---|---|
| Massachusetts | IC + sectoral bargaining (Q3 / c. 150F) | Yes | 5% access / 25%[^36] cert | First state |
| California | IC + sectoral bargaining (AB 1340) | Yes | 10% / 30% / 50%[^36] | Largest workforce |
| Illinois | IC + sectoral bargaining (HB 4743) | Pending | 10% / 30%[^36] | First non-coastal |
| Washington | Driver resource center (Ch. 229) | Yes | n/a (voluntary TNC opt-in) | Precursor model |
| New York | ABC employee classification (A10078, S3487) | Pending | n/a (employees → NLRA path) | Alternative path |

Each model resolves the IC-versus-employee question differently. Each carries different antitrust and federal-preemption exposure. And each is now being watched by founders, vendors, and policy analysts as a template for the next round of state legislation in Colorado, New Jersey, Minnesota, and Connecticut.

## Part IX: NLRA Preemption and Antitrust State-Action Immunity — The Two Open Legal Questions

The IC-sectoral-bargaining architecture is fragile in ways the *Castellanos* majority did not have occasion to address. Two distinct legal challenges threaten the model: federal preemption under the National Labor Relations Act, and federal preemption under the Sherman Act § 1[^36]'s antitrust prohibitions on horizontal cartel coordination. Both challenges are now in active litigation. Either, if successful, could unwind the three-state cohort.

**The NLRA preemption question.** The NLRA generally preempts state laws that regulate conduct the federal labor statute either protects or prohibits. The Supreme Court in *San Diego Building Trades Council v. Garmon* (359 U.S. 236, 1959[^49]) and *Lodge 76 v. Wisconsin Employment Relations Commission* (427 U.S. 132, 1976[^49]) established that the National Labor Relations Board has primary and largely exclusive jurisdiction over private-sector labor relations.[^49] State laws that conflict with this exclusive jurisdiction are preempted.

The IC-sectoral-bargaining architecture was specifically designed to sidestep NLRA preemption by limiting coverage to *independent contractors* — workers explicitly excluded from the NLRA's definition of "employee" at 29 U.S.C. § 152[^46](3). Mark Spring of CDF Labor Law captured the design rationale: "AB 1340 was designed to sidestep NLRA preemption by targeting only independent contractors in the app-platform-based ridesharing sector."[^46] Because ICs are outside the NLRA's "employee" definition, the argument runs, the NLRA's exclusive jurisdiction does not extend to them, and states retain plenary regulatory authority.

That argument is plausible but not yet tested. On September 12, 2025[^49], the NLRB filed suit in the U.S. District Court for the Northern District of New York against New York's separate state-jurisdiction law (S.8034A/A8590A, signed by Governor Kathy Hochul on September 5, 2025).[^48] The New York law authorizes the New York State Public Employment Relations Board to assert jurisdiction over private-sector labor disputes when the NLRB cannot act effectively — a different posture than AB 1340's IC-only approach but raising the same general question of state authority in a federally preempted field. NLRB Acting General Counsel William Cowen alleged the New York law "unlawfully usurps the NLRB's authority by attempting to regulate areas explicitly reserved for federal oversight, creating a parallel regulatory framework that conflicts with the NLRA."[^48] The HR Daily Advisor analysis predicts the NLRB will pursue similar suits against California and Massachusetts in 2026.[^49]

The NLRB's litigating posture is structurally weakened by the Board's own institutional crisis. As of late 2025[^47], the NLRB lacks a quorum: President Trump's removal of Member Gwynne Wilcox plus the August 27, 2025[^47] expiration of Member Marvin Kaplan's term left the Board with a single member (David Prouty); two Trump nominees (Scott Mayer and James Murphy) had not been confirmed by the Senate as of paper publication.[^48] The lack of quorum prevents the Board from issuing binding decisions. The very institutional weakness that motivated New York's law — and that California's parallel AB 288 (signed October 2025[^48], allowing California PERB to assert jurisdiction when the NLRB cedes) responds to — may also weaken the NLRB's ability to enforce preemption in court.[^47]

**The antitrust state-action immunity question.** A second and arguably more dangerous challenge comes from antitrust law. AB 1340 explicitly invokes Parker state-action immunity, declaring that "the state action antitrust exemption shall apply" to TNC sectoral bargaining.[^50] Without immunity, IC sectoral bargaining is plainly horizontal cartel coordination — independent contractors, who are competitors with each other in the rideshare market, would be coordinating on price (the "minimum guarantees" they bargain over) and output (the deactivation appeals process they negotiate). Such coordination, absent immunity, is per se illegal under Section 1[^50] of the Sherman Act and exposes participants to treble damages and potential criminal liability.[^50]

Antitrust scholar Aaron Gott (Mondaq, October 10, 2025[^50]) argues AB 1340 fails the *Parker v. Brown* (317 U.S. 341, 1943[^50]) two-prong test for state-action immunity, articulated more clearly in *California Retail Liquor Dealers Assn. v. Midcal Aluminum* (445 U.S. 97, 1980).[^50] *Midcal* requires both that the challenged restraint be "clearly articulated and affirmatively expressed as state policy" and that the policy be "actively supervised by the State itself." Gott concedes the first prong: AB 1340 clearly articulates the state policy of authorizing sectoral bargaining. But he argues the second prong fails: PERB's role under AB 1340 is "procedural, not substantive" — PERB certifies representatives, sets ground rules, mediates, and approves agreements, but does not analyze whether agreements advance state policy or assess their competitive effects.[^50] Without active substantive supervision, the *Parker* immunity does not apply, and AB 1340 cannot exempt the resulting cartel from federal antitrust law.

Gott's analysis quotes *Parker* directly: "A state does not give immunity to those who violate the Sherman Act by authorizing them to violate it, or by declaring that their action is lawful." The application of this principle to AB 1340 is straightforward: California's legislative declaration that the state-action antitrust exemption applies cannot, on its own, create the immunity it claims. Whether AB 1340 in fact secures immunity will be a federal-court question, and Gott predicts a facial constitutional challenge before the law's first sectoral agreement is even negotiated.[^50]

**The compound legal risk.** The two challenges interact. If a court holds, under the NLRA preemption analysis, that AB 1340-covered drivers must be reclassified as employees (e.g., by applying the *Dynamex* ABC test retroactively notwithstanding § 7451[^50]'s "Notwithstanding any other provision of law" clause), then the NLRA's exclusive jurisdiction snaps in, AB 1340 is preempted, and the state's antitrust shield is irrelevant. Conversely, if a court accepts the IC classification and reaches the antitrust question, *Parker* state-action immunity becomes the only defense — and Gott's analysis suggests it is a thin one. Either path leads to the same outcome: AB 1340, Question 3, and Illinois HB 4743 fall together.

The CDF Labor Law analysis concludes with a cautious-optimism framing: "Future court cases will undoubtedly be filed to test whether AB 1340 can survive NLRA preemption. If upheld however, AB 1340 could set a national precedent, where its success could open the door for other pro-union states, and perhaps even municipalities, to pass similar laws. These laws could fundamentally reshape the gig economy if adopted broadly."[^46] The "if upheld" qualifier is doing significant work.

## Part X: Predictions for 2026–2028

This paper has so far been descriptive — mapping the doctrine, the statutes, the institutional wiring, and the legal-challenge architecture. The final section turns predictive. Six forward-looking calls follow, each grounded in the primary-source record above.

**1. The California Supreme Court will accept *Castellanos* II within 24 months.** The unanimous July 25, 2024[^2] *Castellanos* opinion explicitly reserved the question of whether § 7465[^2]'s seven-eighths supermajority requirement and § 7465[^2](c)(2)'s amendment-restriction unconstitutionally constrain the Legislature's article XIV § 4 plenary power.[^1] AB 1340's January 1, 2026 effective date and PERB's May 1, 2026 first-eligibility-for-10%[^1]-showing milestone make a triggering controversy nearly inevitable — once a sectoral agreement is bargained that includes provisions adjacent to § 7451[^1] (such as workers'-compensation-equivalent occupational accident coverage), the question of whether such an agreement constitutes a § 7465[^1] amendment will reach the courts. The SCOCAblog analysis already telegraphed the legal pathway: a Legislature-enacted statute that "changes the consequences of section 7451" without directly amending it.[^2]

**2. The NLRB will sue California and Massachusetts within 12 months of the New York ruling.** The September 12, 2025[^49] NLRB v. New York lawsuit is structurally a test case. If the Northern District of New York grants the NLRB's preemption claim, the precedent will travel to AB 1340 and Question 3. If the court rejects the claim, the NLRB will face renewed pressure from organized employer interests to file similar suits. Either outcome leads to additional litigation. By 2027[^49] or 2028[^49], an NLRA-preemption case targeting AB 1340 or c. 150F will be on the docket of the 9th or 1st Circuit Court of Appeals; by 2029, it could reach the Supreme Court.[^48][^49]

**3. PERB will certify the first AB 1340 union by Q3 2026[^26].** The May 1, 2026[^26] first-eligibility date for 10%[^26] authorization showings, combined with the rate-limiting effect of California's geographic dispersion (Bloomberg Law's "vehicles scattered across California" observation), means that mass-authorization signature collection will likely play out over 2-4 months.[^24] An SEIU-affiliated organization meeting the experienced-organization-or-affiliated requirement will have a structural advantage; Rideshare Drivers United's parallel insurgent push, while genuine, faces a higher threshold.[^23][^26] Certification of a single SEIU-affiliated union by August or September 2026 is the most likely outcome.

**4. Illinois HB 4743 will pass the 2026[^64] session and be signed by Governor Pritzker.** Uber's June 2025[^64] non-opposition agreement plus SEIU Local 1's and IAM Local 701's organizational backing make passage likely.[^43][^44] The bill's April 10, 2026 hold on calendar at second reading suggests procedural staging rather than substantive opposition.[^64] Illinois will become the third state with active IC sectoral-bargaining authority by the end of the 2026[^64] legislative session.

**5. At least four more states will enact IC sectoral bargaining by 2028[^67].** The most likely candidates, given existing labor-political alignments and SEIU regional presence, are Colorado, New Jersey, Minnesota, and Connecticut. New Jersey already has an active gig-worker ballot framework left over from the 2022[^67] Uber back-tax settlement; Minnesota enacted minimum-pay and protections legislation in May 2024[^67] that could be paired with sectoral bargaining; Colorado and Connecticut both have legislative champions and SEIU-state-council backing. New York is the partial exception: rather than join the IC-sectoral-bargaining cohort, New York will likely pivot toward the employee-classification path embodied in A10078 and S3487.[^66][^67]

**6. Two collisions will define 2027[^67].** The first is the *Castellanos* II collision — the first AB 1340 sectoral agreement that arguably modifies workers'-compensation eligibility for app-based drivers will trigger litigation over whether it constitutes a § 7465[^67] amendment requiring seven-eighths supermajority; the California Supreme Court's reservation in 2024[^67] will become the live question. The second is the federal-preemption collision — either an NLRA-preemption ruling at the 9th or 1st Circuit or a Sherman Act § 1[^67] antitrust ruling at the same level. Either ruling could be definitive. Either could unwind the three-state cohort. The window between the May 2026[^67] first AB 1340 certifications and the spring 2028[^67] likely-circuit-court-rulings is when the doctrine will either harden into durable precedent or collapse into preempted patchwork.

The *Castellanos* unanimity gave one answer to one question. Six more answers to six more questions are coming.

## Glossary

**AB 5** — Assembly Bill 5 (Gonzalez), Chapter 296 Statutes of 2019[^67], codified the *Dynamex* ABC test into California Labor Code §§ 2775[^67]-2787; effective January 1, 2020[^67].

**AB 288** — Assembly Bill 288, signed October 2025[^67], authorizes California PERB to assert jurisdiction over private-sector labor disputes when the NLRB strips or cedes jurisdiction.

**AB 1340** — Assembly Bill 1340 (Wicks/Berman), Chapter 335 Statutes of 2025[^67], codifies the Transportation Network Company Drivers Labor Relations Act at Bus. & Prof. Code § 7470[^67] et seq.; effective January 1, 2026[^67].

**AB 2257** — Assembly Bill 2257 (Gonzalez), signed September 4, 2020[^67]; expanded AB 5 professional-services exemptions but did not exempt gig platforms.

**ABC Test** — Three-prong test for distinguishing employees from independent contractors: (A) freedom from control, (B) work outside usual course of business, (C) customarily engaged in independently established trade. Originating in *Dynamex* (2018[^67]), codified in AB 5 (2019[^67]).

**Active Driver** — Under AB 1340, a driver at-or-above the median ride count over the preceding six months among drivers with 20+ rides. Under c. 150F, a driver above the median with 5+ rides in the past 6 months. Under HB 4743, a driver above the median among those with 5+ rides in the past 6 months.

***Borello*** — *S.G. Borello & Sons v. Department of Industrial Relations* (48 Cal.3d 341, 1989[^67]); established multifactor "economic realities" test for IC classification.

***Castellanos*** — *Castellanos v. State of California* (S279622, 7/25/2024[^67]); unanimous California Supreme Court opinion upholding Proposition 22 § 7451[^67] against article XIV § 4[^67] plenary-power challenge while reserving the § 7465[^67] question.

***Castellanos* II** (predicted) — Future California Supreme Court case testing whether § 7465[^67]'s seven-eighths supermajority requirement constitutionally constrains the Legislature's article XIV § 4[^67] plenary power.

**Coextensive Power Doctrine** — Constitutional doctrine articulated in *McPherson* (2006[^67]) and applied in *Castellanos* (2024[^67]): the California Legislature and the electorate share lawmaking authority where the constitution grants plenary power.

**Covered TNC** — Under AB 1340, a transportation network company comprising at least 0.5%[^67] of total quarterly rideshare volume; only Uber (60.55%[^67]) and Lyft (38.76%[^67]) qualified in Q4 2025[^67].

**Department of Labor Relations (DLR)** — Massachusetts agency administering c. 150F rideshare-driver unionization.

**Driver Resource Center** — Washington Chapter 229 (2025[^67]) registered nonprofit serving as driver-side institutional advocate; eligible to enter deactivation-appeals agreements with TNCs under state-action antitrust immunity.

***Dynamex*** — *Dynamex Operations West v. Superior Court* (S222732, 4/30/2018[^67]); adopted ABC test for "suffer or permit to work" wage-order classification.

**HB 1332-S / Chapter 229** — Washington's 2025[^67] transportation-network-company law establishing driver resource center structure.

**HB 4743** — Illinois Transportation Network Driver Labor Relations Act, introduced February 2, 2026[^67] by Sen. Villivalam + Rep. Morris.

**M.G.L. c. 150F** — Massachusetts General Laws Chapter 150F, codifying Question 3's IC sectoral-bargaining framework.

**NLRA Preemption** — Doctrine under *Garmon* and *Lodge 76* that the National Labor Relations Act preempts state laws conflicting with NLRB jurisdiction over private-sector labor relations.

***Parker*** — *Parker v. Brown* (317 U.S. 341, 1943[^67]); established state-action antitrust immunity doctrine, refined by *Midcal* (1980[^67]) two-prong test (clear articulation + active supervision).

**PERB** — California Public Employment Relations Board; statutorily mandated to administer AB 1340 sectoral bargaining.

**Plenary Power** — Article XIV § 4[^67] grant to the California Legislature of unlimited authority to create a complete workers'-compensation system. *Castellanos* held this power is shared coextensively with the electorate's initiative power.

**Portable Health Fund** — Massachusetts Driver Portable Health Fund (Stride/Lyft/Uber, operational since Q2 2025[^67]); first cross-platform-hour-pooling implementation in U.S.

**Proposition 22** — November 2020[^67] California ballot initiative classifying app-based drivers as ICs; codified at Bus. & Prof. Code §§ 7448[^67]-7467; passed 58.6%[^67]-41.4%[^67] with $200M[^67]+ Yes campaign.

**Question 3** — November 2024[^67] Massachusetts ballot initiative authorizing IC sectoral bargaining; passed 54%[^67]-46%[^67]; codified as M.G.L. c. 150F.

**SB 371** — Senate Bill 371 (Cabaldon), reduces TNC uninsured/underinsured-motorist coverage from $1M[^67] to $60K[^67]/$300K[^67]; contingent on AB 1340 enactment.

**Sectoral Agreement** — Industry-wide collective bargaining agreement between certified driver bargaining organization and covered TNCs; under AB 1340 must include 80%[^67]+ of industry by ride volume and the two largest covered TNCs.

**Sectoral Bargaining** — Collective bargaining at the industry level rather than the firm level; common in European labor-relations systems but novel in the U.S.

**Section 7451[^67]** — Bus. & Prof. Code § 7451[^67] enacted by Prop 22; classifies app-based drivers as ICs notwithstanding any other provision of law.

**Section 7465[^67]** — Bus. & Prof. Code § 7465[^67] enacted by Prop 22; requires seven-eighths legislative supermajority to amend Prop 22; subdivisions (c)(3)-(c)(4) struck down by Court of Appeal A163655M.

**Section 7470[^67] et seq.** — Bus. & Prof. Code § 7470[^67] et seq. enacted by AB 1340; codifies the TNC Drivers Labor Relations Act.

**State-Action Immunity** — Antitrust doctrine immunizing private parties acting under clearly articulated and actively supervised state policy from Sherman Act liability.

**TNC** — Transportation Network Company; on-demand app-based rideshare provider (Uber, Lyft, Via, etc.).

**Tripartite Agreement** — The August 29, 2025[^67] Newsom-McGuire-Rivas-SEIU-Uber-Lyft deal exchanging AB 1340 sectoral bargaining for SB 371 UM/UIM relief.

**UM/UIM** — Uninsured Motorist / Underinsured Motorist insurance coverage.

## Related Research

This paper is the third installment in a worker-classification trilogy at perea.ai/research:

- **The B2A Imperative** (Paper #1) frames the gig economy as the prototypical agent-payment-stack market — the precursor to the human-mediated work the AB 1340 cohort is now reorganizing.

- **The Federal Portable Benefits Stack 2026[^67]** (Paper #11) maps the parallel federal legislative architecture (S.2210 Cassidy/Scott/Paul, S.2335 Sanders, MWSA House) plus the 18-state portable-benefits replication map. The state-level legal architecture mapped in this paper is the institutional foundation on which any federal portable-benefits framework would have to operate.

- **State of Vertical Agents 2027[^67]: Marketplace Seller Operations** (Paper #10) maps the operational reality of platform-mediated work — the daily mechanics of how independent contractors actually function in a platform economy. The legal architecture mapped here determines who pays for those operations and who organizes them.

The next paper in the sequence (already on the roadmap, derived 2026[^67]-05-07) is *Sectoral Bargaining the Three-State Cohort 2026[^67]* — a deeper operational comparison of how California, Massachusetts, and Illinois implement sectoral bargaining in practice, with PERB rulemaking detail, c. 150F operational data, and HB 4743 procedural posture as primary sources.

---

*Castellanos v. State of California Aftermath: The Worker Classification Battlefield 2024[^67]-2026[^67]* — version 1.0, May 2026[^67] — perea.ai Research

## References

[^1]: California Supreme Court, *Castellanos v. State of California*, S279622, opinion filed July 25, 2024 (Liu, J., unanimous). https://supreme.courts.ca.gov/sites/default/files/supremecourt/default/documents/m07252024(th).pdf

[^2]: SCOCAblog (David Carrillo + Stephen Duvernay), "Castellanos is about framing." https://scocablog.com/castellanos-is-about-framing/?print=pdf

[^3]: *Castellanos v. State of California*, S279622 — Justia Law mirror, 2024. https://law.justia.com/cases/california/supreme-court/2024/s279622.html

[^4]: Rick Hasen, "California Appeals Court Upholds Most of Prop 22 (Gig Worker Measure) But Agrees with Our Amicus Brief" — Election Law Blog, March 14, 2023. https://electionlawblog.org/?p=135118

[^5]: California Supreme Court Appellate Court Case Information — *Castellanos v. State of California*, S279622 docket. https://appellatecases.courtinfo.ca.gov/search/case/dockets.cfm?dist=0&doc_id=2563577&doc_no=S279622

[^6]: Carolyn Said + Los Angeles Times, "California Supreme Court upholds Prop. 22, ending legal saga over status of gig drivers" — Press Democrat, July 25, 2024. https://www.pressdemocrat.com/2024/07/25/california-supreme-court-upholds-prop-22-ending-legal-saga-over-status-of-gig-drivers/

[^7]: California First District Court of Appeal, *Castellanos v. State of California*, A163655M, opinion filed March 13, 2023, modified June 30, 2023. https://www4.courts.ca.gov/opinions/revpub/A163655M.PDF

[^8]: *Castellanos v. State of California*, A163655 — Justia Law mirror, 2023. https://law.justia.com/cases/california/court-of-appeal/2023/a163655.html

[^10]: California Workers' Compensation Institute (CWCI), summary of *Castellanos v. State of California*, A163655M, 2023. https://cwci.org/document.php?file=5528.pdf

[^11]: Alameda County Superior Court, *Castellanos v. State of California*, RG21088725, Order Granting Petition for Writ of Mandate, Judge Frank Roesch, August 20, 2021. https://www.courthousenews.com/wp-content/uploads/2021/08/castellanos-order.pdf

[^12]: Carolyn Said, "Proposition 22, California gig-work ballot measure backed by Uber and Lyft, passes" — SFGate, November 4, 2020. https://preview-prod.w.sfgate.com/politics/article/Proposition-22-California-gig-work-ballot-15699651.php

[^13]: Hector Castellanos et al. v. State of California, *Emergency Petition for Writ of Mandate*, S266551, filed January 12, 2021. https://www.courthousenews.com/wp-content/uploads/2021/01/Prop22-CalifSCWrit.pdf

[^14]: ABC7 Los Angeles, "Prop. 22 California election results: Rideshare measure passes," November 4, 2020. https://abc7.com/prop-22-california-2020-results-did-pass-election-rideshare-drivers-measure/7585431

[^15]: Kimberly Valladares, "Uber, Lyft Win on Prop 22: The Most Expensive Ballot Measure in California's History" — Berkeley Law The Network, November 16, 2020. https://sites.law.berkeley.edu/thenetwork/2020/11/16/uber-lyft-win-on-prop-22-the-most-expensive-ballot-measure-in-californias-history/

[^16]: California Code, Bus. & Prof. Code § 7451 — Protecting Independence (added Nov. 3, 2020 by Prop 22). https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=7451

[^17]: California Code, Bus. & Prof. Code Chapter 10.5 Article 2 §§ 7451-7452.5 — App-Based Driver Independence. https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?article=2.&chapter=10.5.&division=3.&lawCode=BPC

[^18]: California Secretary of State, *Proposition 22 — Text of Proposed Laws*, 2020 General Election Voter Information Guide. https://vig.cdn.sos.ca.gov/2020/general/pdf/topl-prop22.pdf

[^19]: California Constitution, Article XIV, Section 4 — Workers' Compensation. https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?article=XIV&lawCode=CONS&sectionNum=SEC.+4.

[^20]: Samuel J. Stone, "New California Law Excludes Some Industries from 'ABC' Test for Independent Contractors" — Holland & Knight, September 9, 2020. https://hklaw.com/en/insights/publications/2020/09/new-california-law-excludes-some-industries-from-abc-test

[^21]: California Constitution Center, UC Berkeley (David A. Carrillo + Stephen M. Duvernay), Amicus Curiae Brief, *Castellanos v. State of California*, April 2, 2024. https://www.law.berkeley.edu/wp-content/uploads/2024/06/2024-04-02-Castellanos-Cal-Const-Scholars-ACB-FILED.pdf

[^22]: California Code, Bus. & Prof. Code Article 9 § 7465 — Amendment (added Nov. 3, 2020 by Prop 22). https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?article=9.&chapter=10.5.&division=3.&lawCode=BPC

[^23]: Farida Jhabvala Romero, "California Gives Uber, Lyft Drivers Collective Bargaining Rights" — KQED, October 3, 2025. https://ww2.kqed.org/news/2025/10/03/california-gives-uber-lyft-drivers-collective-bargaining-rights/

[^24]: "Uber's California Union Deal Will Let Drivers Bargain: Explained" — Bloomberg Law / Daily Labor Report, September 3, 2025. https://news.bloomberglaw.com/daily-labor-report/ubers-california-union-deal-will-let-drivers-bargain-explained

[^25]: Laura Pierson-Scheinberg (Jackson Lewis), "Assembly Bill 1340: California Gives Gig Drivers The Right To Organize" — Mondaq, October 7, 2025. https://www.mondaq.com/unitedstates/employee-rights-labour-relations/1688156/assembly-bill-1340-california-gives-gig-drivers-the-right-to-organize

[^26]: Troy Wolverton, "Uber, Lyft face new unionization effort under California law" — SF Examiner, February 23, 2026. https://www.sfexaminer.com/news/technology/california-uber-lyft-drivers-union-next-steps-2026/article_b286cf0d-9180-4535-9fe4-57e5dbf8bcb1.html

[^27]: California Secretary of State, "Proposition 22 — Campaign Contribution Totals (2020 Ballot Measures)." https://www.sos.ca.gov/campaign-lobbying/helpful-resources/measure-contributions/2020-ballot-measure-contribution-totals/proposition-22-changes-employment-classification-rules-app-based-transportation-and-delivery-drivers-initiative-statute

[^28]: *Dynamex Operations West, Inc. v. Superior Court of Los Angeles County*, S222732, California Supreme Court opinion filed April 30, 2018 (Cantil-Sakauye, C.J.). https://www.courts.ca.gov/opinions/archive/S222732.PDF

[^29]: *Dynamex Operations West v. Superior Court* — Stanford SCOCA opinion archive. https://scocal.stanford.edu/opinion/dynamex-operations-west-inc-v-superior-court-34584

[^30]: *Dynamex Operations West v. Superior Court* — Casetext mirror. https://casetext.com/case/dynamex-operations-w-inc-v-superior-court-of-l-a-cnty-1

[^31]: *Dynamex Operations West v. Superior Court* — FindLaw mirror, 2018. https://caselaw.findlaw.com/court/ca-supreme-court/1894839.html

[^32]: California Legislative Information, Assembly Bill 5 (Gonzalez), 2019-2020 Regular Session. https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201920200AB5

[^33]: California Franchise Tax Board, Bill Analysis — AB 5, September 13, 2019. https://www.ftb.ca.gov/tax-pros/law/legislation/2019-2020/AB5.pdf

[^34]: SEIU, "Massachusetts Uber, Lyft drivers launch historic ballot initiative to win union rights" — press release, July 3, 2024. https://seiu.org/2024/07/massachusetts-uber-lyft-drivers-launch-historic-ballot-initiative-to-win-union-rights

[^35]: California Legislative Information, Assembly Bill 2257 — Worker classification: employees and independent contractors: occupations: professional services. https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201920200AB2257&firstNav=tracking

[^36]: Boston Globe, "State reaches deal with Uber, Lyft on gig drivers," June 27, 2024. https://www.bostonglobe.com/2024/06/27/business/uber-lyft-driver-employee-independent-contractor/

[^37]: California Employment Development Department, "Employee or Independent Contractor" — AB 5 page. https://edd.ca.gov/en/Payroll_Taxes/ab-5

[^38]: Jennifer Smith, "Campbell explains why she settled Uber, Lyft case on eve of likely court victory" — Commonwealth Beacon, July 10, 2024. https://commonwealthbeacon.org/ballot-questions/campbell-explains-why-she-settled-uber-lyft-case-on-eve-of-likely-court-victory

[^39]: California Legislative Information, Assembly Bill 1340 — Transportation network company drivers: labor relations (2025-2026), Approved by Governor October 3, 2025, Chapter 335 Statutes of 2025. https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260AB1340

[^40]: California Legislative Information, Bill History — AB 1340. https://leginfo.legislature.ca.gov/faces/billHistoryClient.xhtml?bill_id=202520260AB1340

[^41]: Office of Senate Floor Analyses, AB 1340 Senate Floor Analysis (Third Reading), September 5, 2025. https://billtexts.s3.amazonaws.com/ca/ca-analysishttps-leginfo-legislature-ca-gov-faces-billAnalysisClient-xhtml-bill-id-202520260AB1340-ca-analysis-392727.pdf

[^42]: California Code, Bus. & Prof. Code § 7470.8 — Representation Election Procedures (added by AB 1340). https://california.public.law/codes/business_and_professions_code_section_7470.8

[^43]: Office of Governor Gavin Newsom, "Governor Newsom signs landmark worker legislation, in stark contrast to Trump's assault on workers and government shutdown," October 3, 2025. https://www.gov.ca.gov/2025/10/03/governor-newsom-signs-landmark-worker-legislation-in-stark-contrast-to-trumps-assault-on-workers-and-government-shutdown/

[^44]: Office of Governor Gavin Newsom, "Governor Newsom, Pro Tem McGuire, Speaker Rivas announce support for legislation empowering gig workers, improving rideshare affordability," August 29, 2025. https://www.gov.ca.gov/2025/08/29/governor-newsom-pro-tem-mcguire-speaker-rivas-announce-support-for-legislation-empowering-gig-workers-improving-rideshare-affordability/

[^45]: California Public Employment Relations Board, "Transportation Network Company Drivers Labor Relations Act (TNC Act)" — Q4 2025 covered/noncovered TNC data. https://perb.ca.gov/transportation-network-company-drivers-labor-relations-act-tnc-act/

[^46]: Mark Spring, "New California Law Allows for Unionization of Certain Gig Independent Contractors" — CDF Labor Law LLP. https://callaborlaw.com/blog/new-california-law-allows-for-unionization-of-certain-gig-independent-contractors

[^47]: California Public Employment Relations Board, "Inaugural 10-day period to apply for designation as TNC Driver Organization opens January 20, 2026" — news release, December 30, 2025. https://perb.ca.gov/news/inaugural-10-day-period-to-apply-for-designation-as-tnc-driver-organization-opens-january-20-2026/

[^48]: Ogletree Deakins, "NLRB Alleges New York State Labor Law Preempted by NLRA," September 17, 2025. https://ogletree.com/insights-resources/blog-posts/nlrb-alleges-new-york-state-labor-law-preempted-by-nlra

[^49]: HR Daily Advisor, "States, NLRB Battle Over Authority Over Unionization," October 10, 2025. https://hrdailyadvisor.hci.org/2025/10/10/states-nlrb-battle-over-authority-over-unionization/

[^50]: Aaron Gott, "Can States Grant Federal Antitrust Immunity? Part 1: Why California's New Gig-Driver Law Won't Survive Parker" — Mondaq, October 10, 2025. https://www.mondaq.com/unitedstates/antitrust-eu-competition/1689848/can-states-grant-federal-antitrust-immunity-part-1-why-californias-new-gig-driver-law-wont-survive-parker

[^51]: California Legislative Information, Senate Bill 371 — Transportation network companies: insurance coverage (Today's Law As Amended). https://leginfo.legislature.ca.gov/faces/billCompareClient.xhtml?bill_id=202520260SB371&showamends=false

[^52]: Assembly Committee on Communications and Conveyance (Tasha Boerner, Chair), SB 371 (Cabaldon) bill analysis, July 16, 2025. https://acom.assembly.ca.gov/system/files/2025-07/sb-371-cabaldon-analysis.pdf

[^53]: Assembly Committee on Insurance (Lisa Calderon, Chair), SB 371 (Cabaldon) bill analysis, July 16, 2025. https://ains.assembly.ca.gov/media/335

[^54]: Senator Christopher Cabaldon, "Legislature passes Cabaldon bill to cut fares on Uber, Lyft" — press release. https://sd03.senate.ca.gov/news/legislature-passes-cabaldon-bill-cut-fares-uber-lyft

[^55]: Uber Newsroom, "Reforming Insurance in California, and the Future of Rideshare in the State." https://www.uber.com/us/en/newsroom/california-insurance-reform/

[^56]: Office of Massachusetts Attorney General Andrea Joy Campbell, "AG Campbell Reaches Nation-Leading Settlement with Uber and Lyft, Secures Landmark Wages, Benefits and Protections for Drivers," June 27, 2024. https://www.mass.gov/news/ag-campbell-reaches-nation-leading-settlement-with-uber-and-lyft-secures-landmark-wages-benefits-and-protections-for-drivers

[^57]: Office of Massachusetts Attorney General, "AGO Presentation: Uber/Lyft Settlement and What It Means for Drivers." https://www.mass.gov/doc/ago-presentation-uberlyft-settlement-and-what-it-means-for-drivers-0/download

[^58]: Office of Massachusetts Attorney General, "Uber/Lyft Settlement Presentation Update," January 23, 2025. https://www.mass.gov/doc/ago-presentation-uberlyft-settlement-and-what-it-means-for-drivers/download

[^59]: Massachusetts Department of Labor Relations, "Rideshare Driver Unionization" — administration page (M.G.L. c. 150F + 456 CMR 24.00). https://www.mass.gov/info-details/rideshare-driver-unionization

[^60]: Stride Health, "All about the Massachusetts Stipend Program for Uber and Lyft Drivers" — support article, June 24, 2025. https://support.stridehealth.com/hc/en-us/articles/32045421074967-All-about-the-Massachusetts-Stipend-Program-for-Uber-and-Lyft-Drivers

[^61]: Lyft Help, "Massachusetts Driver Information" — Portable Health Fund. https://help.lyft.com/hc/en-us/all/articles/115013078468

[^62]: Uber, "Massachusetts Driver Benefits" — Uber Blog, January 13, 2026. https://www.uber.com/blog/massachusetts/massachusetts-driver-benefits/

[^64]: Illinois HB 4743 — Transportation Network Driver Labor Relations Act, introduced February 2, 2026 (BillTrack50). https://www.billtrack50.com/billdetail/1959004

[^65]: Washington State Legislature, Chapter 229, Laws of 2025 (HB 1332-S) — Transportation Network Companies, effective September 1, 2025. https://lawfilesext.leg.wa.gov/biennium/2025-26/Pdf/Bills/Session%20Laws/House/1332-S.SL.pdf

[^66]: New York Assembly Bill A10078 — Transportation network company driver classification (introduced January 30, 2026). https://www.billtrack50.com/billdetail/1958346

[^67]: New York Assembly Bill S3487 — ABC test codification (Labor Law § 511 + Workers' Compensation Law § 201). https://assembly.state.ny.us/leg/?default_fld=&leg_video=&bn=S3487&term=2025&Text=Y


[^68]: Cary G. Palmer (Jackson Lewis), "California Supreme Court Broadens Definition of Employee in Independent Contractor Analysis" — Dynamex commentary. https://jacksonlewis.com/insights/california-supreme-court-broadens-definition-employee-independent-contractor-analysis

[^69]: A.M. Drake, "California lawmakers advance TNC insurance overhaul to cut ride costs, curb legal abuse" — Business Daily Network, July 17, 2025. https://businessdailynetwork.com/stories/674043122-california-lawmakers-advance-tnc-insurance-overhaul-to-cut-ride-costs-curb-legal-abuse
