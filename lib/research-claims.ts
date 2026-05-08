/**
 * research-claims.ts
 *
 * Shared logic for claim verification + reference classification used by:
 *   - scripts/verify-research.ts (the verify gate, runs at ship time)
 *   - scripts/audit-published-claims.ts (the retrofit audit, runs once over canon)
 *
 * Layer 1: parse references (numbered list OR `[^N]: ...` footnote defs),
 *          classify each by domain → primary | secondary | tertiary | unknown.
 * Layer 2: extract numeric/dated/dollar/funding/count claims from body,
 *          check inline `[^N]` / `[N]` citation coverage.
 */

export type Tier = "primary" | "secondary" | "tertiary" | "unknown";

const PRIMARY_PATTERNS: RegExp[] = [
  // Government + regulatory
  /(^|\.)sec\.gov(\/|$)/i,
  /(^|\.)edgar\.sec\.gov(\/|$)/i,
  /(^|\.)gov(\/|$)/i,
  /(^|\.)gov\.uk(\/|$)/i,
  /(^|\.)gov\.eu(\/|$)/i,
  /(^|\.)europa\.eu(\/|$)/i,
  /(^|\.)gc\.ca(\/|$)/i,
  /(^|\.)nist\.gov(\/|$)/i,
  /(^|\.)fda\.gov(\/|$)/i,
  /(^|\.)cms\.gov(\/|$)/i,
  /(^|\.)cdc\.gov(\/|$)/i,
  /(^|\.)uspto\.gov(\/|$)/i,
  /(^|\.)usda\.gov(\/|$)/i,
  /(^|\.)federalreserve\.gov(\/|$)/i,
  /(^|\.)nih\.gov(\/|$)/i,
  /(^|\.)dol\.gov(\/|$)/i,
  /(^|\.)ftc\.gov(\/|$)/i,
  /(^|\.)irs\.gov(\/|$)/i,
  // Academic + peer-reviewed
  /(^|\.)edu(\/|$)/i,
  /(^|\.)arxiv\.org(\/|$)/i,
  /(^|\.)ssrn\.com(\/|$)/i,
  /(^|\.)pubmed\.ncbi\.nlm\.nih\.gov(\/|$)/i,
  /(^|\.)nature\.com(\/|$)/i,
  /(^|\.)science\.org(\/|$)/i,
  /(^|\.)acm\.org(\/|$)/i,
  /(^|\.)ieee\.org(\/|$)/i,
  /(^|\.)cell\.com(\/|$)/i,
  /(^|\.)nejm\.org(\/|$)/i,
  /(^|\.)thelancet\.com(\/|$)/i,
  // Press release wires
  /(^|\.)prnewswire\.com(\/|$)/i,
  /(^|\.)businesswire\.com(\/|$)/i,
  /(^|\.)globenewswire\.com(\/|$)/i,
  /(^|\.)accesswire\.com(\/|$)/i,
  // Standards bodies
  /(^|\.)ietf\.org(\/|$)/i,
  /(^|\.)iso\.org(\/|$)/i,
  /(^|\.)w3\.org(\/|$)/i,
  /(^|\.)oasis-open\.org(\/|$)/i,
  /(^|\.)wikipedia\.org(\/|$)/i, // Wikipedia citations point to refs; treat as primary entry
  // AI lab research divisions (the labs themselves are primary on their own work)
  /(^|\.)openai\.com(\/|$)/i,
  /(^|\.)anthropic\.com(\/|$)/i,
  /(^|\.)deepmind\.google(\/|$)/i,
  /(^|\.)deepmind\.com(\/|$)/i,
  /(^|\.)research\.google(\/|$)/i,
  /(^|\.)ai\.meta\.com(\/|$)/i,
  /(^|\.)microsoft\.com\/en-us\/research(\/|$)/i,
  /(^|\.)cohere\.com(\/|$)/i,
  /(^|\.)mistral\.ai(\/|$)/i,
  // Cybersecurity corporate publishers (primary on their own announcements + blog)
  /(^|\.)crowdstrike\.com(\/|$)/i,
  /(^|\.)paloaltonetworks\.com(\/|$)/i,
  /(^|\.)wiz\.io(\/|$)/i,
  /(^|\.)lumu\.io(\/|$)/i,
  /(^|\.)securonix\.com(\/|$)/i,
  /(^|\.)torq\.io(\/|$)/i,
  /(^|\.)cisco\.com(\/|$)/i,
  /(^|\.)sentinelone\.com(\/|$)/i,
  /(^|\.)drata\.com(\/|$)/i,
  /(^|\.)chainguard\.dev(\/|$)/i,
  // MITRE / threat intel standards orgs
  /(^|\.)atlas\.mitre\.org(\/|$)/i,
  /(^|\.)mitre\.org(\/|$)/i,
  /(^|\.)mitre-engenuity\.org(\/|$)/i,
  /(^|\.)mitre-atlas(\/|$)/i,
  /(^|\.)owasp\.org(\/|$)/i,
  /(^|\.)cisa\.gov(\/|$)/i,
  // Google + Microsoft + corporate blog/security surfaces (specific paths gated below by PRIMARY_PATH_FRAGMENTS)
  /(^|\.)blog\.google(\/|$)/i,
  /(^|\.)cloud\.google\.com(\/|$)/i,
  /(^|\.)googlecloudpresscorner\.com(\/|$)/i,
  /(^|\.)blogs\.microsoft\.com(\/|$)/i,
  /(^|\.)microsoft\.com(\/|$)/i,
  // Salesforce / HubSpot / Microsoft Dynamics ecosystem corporate publishers
  /(^|\.)salesforce\.com(\/|$)/i,
  /(^|\.)investor\.salesforce\.com(\/|$)/i,
  /(^|\.)hubspot\.com(\/|$)/i,
  /(^|\.)sforce\.co(\/|$)/i,
  // Sales / RevOps / CS corporate publishers (primary on their own announcements + product pages)
  /(^|\.)clari\.com(\/|$)/i,
  /(^|\.)salesloft\.com(\/|$)/i,
  /(^|\.)outreach\.io(\/|$)/i,
  /(^|\.)outreach\.ai(\/|$)/i,
  /(^|\.)gong\.io(\/|$)/i,
  /(^|\.)apollo\.io(\/|$)/i,
  /(^|\.)clay\.com(\/|$)/i,
  /(^|\.)6sense\.com(\/|$)/i,
  /(^|\.)regie\.ai(\/|$)/i,
  /(^|\.)attention\.com(\/|$)/i,
  /(^|\.)sierra\.ai(\/|$)/i,
  /(^|\.)11x\.ai(\/|$)/i,
  /(^|\.)artisan\.co(\/|$)/i,
  /(^|\.)bardeen\.ai(\/|$)/i,
  /(^|\.)gainsight\.com(\/|$)/i,
  /(^|\.)vitally\.io(\/|$)/i,
  /(^|\.)totango\.com(\/|$)/i,
  /(^|\.)demandbase\.com(\/|$)/i,
  /(^|\.)zoominfo\.com(\/|$)/i,
  /(^|\.)ir\.zoominfo\.com(\/|$)/i,
  /(^|\.)nooks\.com(\/|$)/i,
  // Sales / RevOps community + analyst infrastructure
  /(^|\.)joinpavilion\.com(\/|$)/i,
  /(^|\.)revgenius\.com(\/|$)/i,
  /(^|\.)nucleusresearch\.com(\/|$)/i,
  // Field service / specialty trade corporate publishers
  /(^|\.)servicetitan\.com(\/|$)/i,
  /(^|\.)investors\.servicetitan\.com(\/|$)/i,
  /(^|\.)housecallpro\.com(\/|$)/i,
  /(^|\.)getjobber\.com(\/|$)/i,
  /(^|\.)workiz\.com(\/|$)/i,
  /(^|\.)workhero\.ai(\/|$)/i,
  /(^|\.)sitecapture\.com(\/|$)/i,
  /(^|\.)buildops\.com(\/|$)/i,
  /(^|\.)servicetrade\.com(\/|$)/i,
  /(^|\.)fieldedge\.com(\/|$)/i,
  /(^|\.)fieldroutes\.com(\/|$)/i,
  /(^|\.)clearent\.com(\/|$)/i,
  /(^|\.)xplor\.com(\/|$)/i,
  /(^|\.)xplortechnologies\.com(\/|$)/i,
  /(^|\.)authoritybrands\.com(\/|$)/i,
  /(^|\.)chemed\.com(\/|$)/i,
  /(^|\.)withrebar\.ai(\/|$)/i,
  // Press wire variant
  /(^|\.)prweb\.com(\/|$)/i,
  // PE / VC firms (primary on portfolio company announcements they sponsored)
  /(^|\.)vistaequitypartners\.com(\/|$)/i,
  /(^|\.)newviewcapital\.com(\/|$)/i,
  /(^|\.)summitpartners\.com(\/|$)/i,
  /(^|\.)mainsailpartners\.com(\/|$)/i,
  /(^|\.)riversidecompany\.com(\/|$)/i,
  /(^|\.)frontiergrowth\.com(\/|$)/i,
  /(^|\.)apax\.com(\/|$)/i,
  /(^|\.)leadedge\.com(\/|$)/i,
  /(^|\.)leadedgecapital\.com(\/|$)/i,
  /(^|\.)kkr\.com(\/|$)/i,
  /(^|\.)carlyle\.com(\/|$)/i,
];

const PRIMARY_PATH_FRAGMENTS = [
  "/press/",
  "/press-release",
  "/press-releases",
  "/news/",
  "/news-release",
  "/news-releases",
  "/newsroom",
  "/investor-relations",
  "/investors/",
  "/research-insights/",
  "/research/",
  "/corporate/",
  "/about/news",
  // Microsoft Security blog (Microsoft's official corporate publication on security)
  "/en-us/security/blog/",
  "/security/blog/",
  // Microsoft Learn product documentation (official platform docs)
  "/copilot/security/",
  // M365 Message Center (official admin notifications)
  "/message/mc",
  // Resources / case-study pages on corporate domains
  "/resources/",
  // Conference / spec / protocol artifacts hosted on official corporate domains
  "/spec/",
  "/specs/",
  "/specifications/",
  "/standard/",
  "/standards/",
  "/protocol/",
  "/governance/",
  "/blog/research/",
  "/blog/announcement",
  "/blog/announcements",
  // GitHub spec repos (when the repo IS the spec — protocol authors publish here)
  "/blob/main/SPECIFICATION",
  "/blob/main/spec",
  "/blob/master/SPECIFICATION",
  "/blob/master/spec",
];

// Mental-health-vertical primary surfaces (corporate IR + vendor sites + PE/VC firms + government bodies)
const MENTAL_HEALTH_PRIMARY_PATTERNS: RegExp[] = [
  // Practice-management EHR + AI scribe vendors (corporate)
  /(^|\.)simplepractice\.com(\/|$)/i,
  /(^|\.)therapynotes\.com(\/|$)/i,
  /(^|\.)heidihealth\.com(\/|$)/i,
  /(^|\.)eleos\.health(\/|$)/i,
  /(^|\.)upheal\.io(\/|$)/i,
  /(^|\.)mentalyc\.com(\/|$)/i,
  /(^|\.)autonotes\.ai(\/|$)/i,
  // Insurance-billing marketplaces (corporate)
  /(^|\.)headway\.co(\/|$)/i,
  /(^|\.)helloalma\.com(\/|$)/i,
  /(^|\.)growtherapy\.com(\/|$)/i,
  // Enterprise EAP cohort (corporate)
  /(^|\.)springhealth\.com(\/|$)/i,
  /(^|\.)lyrahealth\.com(\/|$)/i,
  /(^|\.)modernhealth\.com(\/|$)/i,
  /(^|\.)joinmodernhealth\.com(\/|$)/i,
  // Telehealth platforms (corporate IR)
  /(^|\.)talkspace\.com(\/|$)/i,
  /(^|\.)investors\.talkspace\.com(\/|$)/i,
  /(^|\.)betterhelp\.com(\/|$)/i,
  /(^|\.)cerebral\.com(\/|$)/i,
  // U.S. government health authorities
  /(^|\.)hrsa\.gov(\/|$)/i,
  /(^|\.)bhw\.hrsa\.gov(\/|$)/i,
  /(^|\.)bls\.gov(\/|$)/i,
  /(^|\.)data\.bls\.gov(\/|$)/i,
  /(^|\.)samhsa\.gov(\/|$)/i,
  /(^|\.)cms\.gov(\/|$)/i,
  /(^|\.)healthit\.gov(\/|$)/i,
  // Mental-health PE/VC firms acting as primary owner-side disclosure
  /(^|\.)greenfieldpartners\.com(\/|$)/i,
  /(^|\.)spark\.capital(\/|$)/i,
  /(^|\.)sparkcapital\.com(\/|$)/i,
  /(^|\.)thrivecapital\.com(\/|$)/i,
  /(^|\.)foundersfund\.com(\/|$)/i,
  /(^|\.)kleinerperkins\.com(\/|$)/i,
  /(^|\.)battery\.com(\/|$)/i,
  /(^|\.)generationim\.com(\/|$)/i,
  /(^|\.)spark\.com(\/|$)/i,
];

// Property-management-vertical primary surfaces (corporate IR + vendor sites + PE/VC firms + REIT/industry bodies)
const PROPERTY_MGMT_PRIMARY_PATTERNS: RegExp[] = [
  /(^|\.)appfolio\.com(\/|$)/i,
  /(^|\.)appfolioinc\.com(\/|$)/i,
  /(^|\.)ir\.appfolioinc\.com(\/|$)/i,
  /(^|\.)realpage\.com(\/|$)/i,
  /(^|\.)yardi\.com(\/|$)/i,
  /(^|\.)buildium\.com(\/|$)/i,
  /(^|\.)entrata\.com(\/|$)/i,
  /(^|\.)mrisoftware\.com(\/|$)/i,
  /(^|\.)funnelleasing\.com(\/|$)/i,
  /(^|\.)eliseai\.com(\/|$)/i,
  /(^|\.)assetliving\.com(\/|$)/i,
  /(^|\.)smartrent\.com(\/|$)/i,
  /(^|\.)investors\.smartrent\.com(\/|$)/i,
  /(^|\.)roofstock\.com(\/|$)/i,
  /(^|\.)mynd\.co(\/|$)/i,
  /(^|\.)triconresidential\.com(\/|$)/i,
  /(^|\.)nmhc\.org(\/|$)/i,
  /(^|\.)naahq\.org(\/|$)/i,
  /(^|\.)reit\.com(\/|$)/i,
  /(^|\.)hud\.gov(\/|$)/i,
  /(^|\.)epic\.org(\/|$)/i,
  // PE / VC firms acting as primary owner-side disclosure
  /(^|\.)thomabravo\.com(\/|$)/i,
  /(^|\.)silverlake\.com(\/|$)/i,
  /(^|\.)blackstone\.com(\/|$)/i,
  /(^|\.)harvestpartners\.com(\/|$)/i,
  /(^|\.)gipartners\.com(\/|$)/i,
  /(^|\.)ta\.com(\/|$)/i,
  /(^|\.)dragoneer\.com(\/|$)/i,
  /(^|\.)hggc\.com(\/|$)/i,
  /(^|\.)alphapartners\.com(\/|$)/i,
  /(^|\.)sapphireventures\.com(\/|$)/i,
  /(^|\.)ret\.vc(\/|$)/i,
  /(^|\.)k1capital\.com(\/|$)/i,
  /(^|\.)sumeru\.com(\/|$)/i,
  /(^|\.)point72\.com(\/|$)/i,
  /(^|\.)divcowest\.com(\/|$)/i,
  /(^|\.)kochind\.com(\/|$)/i,
  /(^|\.)stblaw\.com(\/|$)/i,
];

// 1099 Freelance Finance vertical primary surfaces (vendor corporate sites + government + press release distributors + investor relations)
const FREELANCE_FINANCE_PRIMARY_PATTERNS: RegExp[] = [
  // Government primary (federal + state)
  /(^|\.)irs\.gov(\/|$)/i,
  /(^|\.)eitc\.irs\.gov(\/|$)/i,
  /(^|\.)ftb\.ca\.gov(\/|$)/i,
  /(^|\.)labor\.ca\.gov(\/|$)/i,
  /(^|\.)courts\.ca\.gov(\/|$)/i,
  /(^|\.)sec\.gov(\/|$)/i,
  /(^|\.)mass\.gov(\/|$)/i,
  /(^|\.)senate\.gov(\/|$)/i,
  /(^|\.)cassidy\.senate\.gov(\/|$)/i,
  /(^|\.)ballotpedia\.org(\/|$)/i,
  // Press release distribution networks (primary because they republish corporate filings verbatim)
  /(^|\.)prnewswire\.com(\/|$)/i,
  /(^|\.)businesswire\.com(\/|$)/i,
  /(^|\.)globenewswire\.com(\/|$)/i,
  /(^|\.)prweb\.com(\/|$)/i,
  /(^|\.)einpresswire\.com(\/|$)/i,
  // Vendor corporate sites — Solo Operating System cohort
  /(^|\.)lettuce\.co(\/|$)/i,
  /(^|\.)collective\.com(\/|$)/i,
  /(^|\.)found\.com(\/|$)/i,
  /(^|\.)hurdlr\.com(\/|$)/i,
  /(^|\.)tight\.co(\/|$)/i,
  /(^|\.)bonsai\.is(\/|$)/i,
  /(^|\.)honeybook\.com(\/|$)/i,
  /(^|\.)lili\.co(\/|$)/i,
  // Vendor corporate sites — Tax-reserve cohort
  /(^|\.)keepertax\.com(\/|$)/i,
  /(^|\.)flyfin\.tax(\/|$)/i,
  /(^|\.)bluej\.com(\/|$)/i,
  /(^|\.)carry\.com(\/|$)/i,
  // Vendor corporate sites — Bookkeeping cohort
  /(^|\.)pilot\.com(\/|$)/i,
  /(^|\.)bench\.co(\/|$)/i,
  /(^|\.)truewind\.ai(\/|$)/i,
  /(^|\.)zeni\.ai(\/|$)/i,
  /(^|\.)digits\.com(\/|$)/i,
  /(^|\.)burklandassociates\.com(\/|$)/i,
  /(^|\.)burkland\.business(\/|$)/i,
  /(^|\.)kruzeconsulting\.com(\/|$)/i,
  // Vendor corporate sites — Marketplace 1099 issuers
  /(^|\.)upwork\.com(\/|$)/i,
  /(^|\.)investors\.upwork\.com(\/|$)/i,
  /(^|\.)fiverr\.com(\/|$)/i,
  /(^|\.)investors\.fiverr\.com(\/|$)/i,
  /(^|\.)toptal\.com(\/|$)/i,
  /(^|\.)usebraintrust\.com(\/|$)/i,
  // Vendor corporate sites — Portable benefits cohort
  /(^|\.)stridehealth\.com(\/|$)/i,
  /(^|\.)mastercard\.stridehealth\.com(\/|$)/i,
  /(^|\.)stridebenefits\.com(\/|$)/i,
  /(^|\.)catch\.co(\/|$)/i,
  /(^|\.)opolis\.co(\/|$)/i,
  /(^|\.)anglehealth\.org(\/|$)/i,
  /(^|\.)1099workers\.com(\/|$)/i,
  /(^|\.)beanstalk\.stridehealth\.com(\/|$)/i,
  /(^|\.)jobble\.stridehealth\.com(\/|$)/i,
  // Vendor corporate sites — Retirement
  /(^|\.)gusto\.com(\/|$)/i,
  /(^|\.)guideline\.com(\/|$)/i,
  /(^|\.)forusall\.com(\/|$)/i,
  // Workforce-research primary sources (large-N annual surveys treated as primary)
  /(^|\.)mbopartners\.com(\/|$)/i,
  // Marketplace acquirer primary sources
  /(^|\.)zoom\.us(\/|$)/i,
  /(^|\.)blog\.zoom\.us(\/|$)/i,
  /(^|\.)quickbooks\.intuit\.com(\/|$)/i,
  /(^|\.)intuit\.com(\/|$)/i,
  /(^|\.)employer\.com(\/|$)/i,
];

const FREELANCE_FINANCE_SECONDARY_PATTERNS: RegExp[] = [
  // Workforce + payroll research houses (publish primary-tier datasets but secondary commentary)
  /(^|\.)adpresearch\.com(\/|$)/i,
  /(^|\.)adp\.com(\/|$)/i,
  // Funding databases + startup directories
  /(^|\.)cbinsights\.com(\/|$)/i,
  /(^|\.)tracxn\.com(\/|$)/i,
  /(^|\.)startupintros\.com(\/|$)/i,
  /(^|\.)pulse2\.com(\/|$)/i,
  /(^|\.)pulse2\.0\.com(\/|$)/i,
  /(^|\.)techcompanynews\.com(\/|$)/i,
  /(^|\.)finsmes\.com(\/|$)/i,
  /(^|\.)exa\.ai(\/|$)/i,
  // Fintech trade press
  /(^|\.)fintech\.global(\/|$)/i,
  /(^|\.)fintech\.am(\/|$)/i,
  /(^|\.)bankingdive\.com(\/|$)/i,
  /(^|\.)americanbanker\.com(\/|$)/i,
  /(^|\.)pymnts\.com(\/|$)/i,
  /(^|\.)thefintechtimes\.com(\/|$)/i,
  /(^|\.)fastcompany\.com(\/|$)/i,
  // Vendor + product comparison sites
  /(^|\.)bestaitoolsforfinance\.com(\/|$)/i,
  /(^|\.)banklist\.co(\/|$)/i,
  /(^|\.)nerdwallet\.com(\/|$)/i,
  /(^|\.)forbes\.com(\/|$)/i,
  /(^|\.)forbesadvisor\.com(\/|$)/i,
  /(^|\.)investopedia\.com(\/|$)/i,
  // Personal finance + tax practitioner blogs
  /(^|\.)wealthyinternet\.com(\/|$)/i,
  /(^|\.)unclekam\.com(\/|$)/i,
  /(^|\.)beancount\.io(\/|$)/i,
  /(^|\.)thecollegeinvestor\.com(\/|$)/i,
  /(^|\.)kitces\.com(\/|$)/i,
  /(^|\.)whitecoatinvestor\.com(\/|$)/i,
  // Solopreneur + creator economy press
  /(^|\.)creatoreconomy\.so(\/|$)/i,
  /(^|\.)passionfroot\.me(\/|$)/i,
  /(^|\.)signalfire\.com(\/|$)/i,
];

const PORTABLE_BENEFITS_LEGISLATION_PRIMARY_PATTERNS: RegExp[] = [
  // Federal legislative + regulatory
  /(^|\.)congress\.gov(\/|$)/i,
  /(^|\.)govinfo\.gov(\/|$)/i,
  /(^|\.)federalregister\.gov(\/|$)/i,
  /(^|\.)docs\.house\.gov(\/|$)/i,
  /(^|\.)edworkforce\.house\.gov(\/|$)/i,
  /(^|\.)help\.senate\.gov(\/|$)/i,
  /(^|\.)senate\.gov(\/|$)/i,
  /(^|\.)house\.gov(\/|$)/i,
  /(^|\.)scott\.senate\.gov(\/|$)/i,
  /(^|\.)cassidy\.senate\.gov(\/|$)/i,
  /(^|\.)paul\.senate\.gov(\/|$)/i,
  /(^|\.)sanders\.senate\.gov(\/|$)/i,
  /(^|\.)kiley\.house\.gov(\/|$)/i,
  /(^|\.)cloudfront\.net(\/|$)/i,
  // State legislatures
  /(^|\.)le\.utah\.gov(\/|$)/i,
  /(^|\.)senate\.utah\.gov(\/|$)/i,
  /(^|\.)capitol\.tn\.gov(\/|$)/i,
  /(^|\.)wapp\.capitol\.tn\.gov(\/|$)/i,
  /(^|\.)tnsenategop\.com(\/|$)/i,
  /(^|\.)ilga\.gov(\/|$)/i,
  /(^|\.)nj\.gov(\/|$)/i,
  // State AGs / mass.gov
  /(^|\.)mass\.gov(\/|$)/i,
  // Vendor corporate sites (rideshare/delivery platforms operating portable-benefits programs)
  /(^|\.)lyft\.com(\/|$)/i,
  /(^|\.)help\.lyft\.com(\/|$)/i,
  /(^|\.)doordash\.com(\/|$)/i,
  /(^|\.)about\.doordash\.com(\/|$)/i,
  /(^|\.)help\.doordash\.com(\/|$)/i,
  /(^|\.)shipt\.com(\/|$)/i,
  /(^|\.)corporate\.shipt\.com(\/|$)/i,
  /(^|\.)stridehealth\.com(\/|$)/i,
  /(^|\.)blog\.stridehealth\.com(\/|$)/i,
  /(^|\.)support\.stridehealth\.com(\/|$)/i,
  /(^|\.)mahealthfund\.stridehealth\.com(\/|$)/i,
  // Advocacy coalitions (treat as primary for self-published positions)
  /(^|\.)illinoisdriversalliance\.org(\/|$)/i,
  /(^|\.)yesformassdrivers\.org(\/|$)/i,
];

const PORTABLE_BENEFITS_LEGISLATION_SECONDARY_PATTERNS: RegExp[] = [
  // Research firms / think tanks
  /(^|\.)mercatus\.org(\/|$)/i,
  /(^|\.)epi\.org(\/|$)/i,
  /(^|\.)nelp\.org(\/|$)/i,
  /(^|\.)libertas\.institute(\/|$)/i,
  /(^|\.)ndpanalytics\.com(\/|$)/i,
  // Legal / professional services commentary
  /(^|\.)fisherphillips\.com(\/|$)/i,
  /(^|\.)pietragallo\.com(\/|$)/i,
  /(^|\.)khlawfirm\.com(\/|$)/i,
  /(^|\.)jdsupra\.com(\/|$)/i,
  /(^|\.)littler\.com(\/|$)/i,
  /(^|\.)independentcontractorcompliance\.com(\/|$)/i,
  /(^|\.)whoismyemployee\.com(\/|$)/i,
  /(^|\.)vensure\.com(\/|$)/i,
  // Specialty benefits + retirement industry publications
  /(^|\.)plansponsor\.com(\/|$)/i,
  /(^|\.)psca\.org(\/|$)/i,
  /(^|\.)benefitslink\.com(\/|$)/i,
  /(^|\.)benefitspro\.com(\/|$)/i,
  /(^|\.)hrdive\.com(\/|$)/i,
  /(^|\.)ascensus\.com(\/|$)/i,
  /(^|\.)asppa-net\.org(\/|$)/i,
  /(^|\.)pensionpolicyinternational\.com(\/|$)/i,
  // Bill tracking + legislative aggregators
  /(^|\.)govtrack\.us(\/|$)/i,
  /(^|\.)trackbill\.com(\/|$)/i,
  /(^|\.)billtrack50\.com(\/|$)/i,
  /(^|\.)quiverquant\.com(\/|$)/i,
  // Tax / accounting trade
  /(^|\.)tax\.thomsonreuters\.com(\/|$)/i,
  /(^|\.)thomsonreuters\.com(\/|$)/i,
  // Regional / progressive trade press
  /(^|\.)truthout\.org(\/|$)/i,
  /(^|\.)commondreams\.org(\/|$)/i,
  /(^|\.)vermontbiz\.com(\/|$)/i,
  /(^|\.)ny1\.com(\/|$)/i,
  /(^|\.)redstate\.com(\/|$)/i,
  /(^|\.)tennessean\.com(\/|$)/i,
  /(^|\.)aldailynews\.com(\/|$)/i,
  /(^|\.)slenterprise\.com(\/|$)/i,
  /(^|\.)kslnewsradio\.com(\/|$)/i,
  // Chicago / Illinois regional (for IL TNC LRA coverage)
  /(^|\.)chicago\.suntimes\.com(\/|$)/i,
  /(^|\.)blockclubchicago\.org(\/|$)/i,
  /(^|\.)thechicagojournal\.com(\/|$)/i,
  /(^|\.)journalstandard\.com(\/|$)/i,
  // NJ / MA regional
  /(^|\.)wrnjradio\.com(\/|$)/i,
  /(^|\.)nj1015\.com(\/|$)/i,
  /(^|\.)wbur\.org(\/|$)/i,
  // Insurance industry
  /(^|\.)insurancejournal\.com(\/|$)/i,
  /(^|\.)certifi\.com(\/|$)/i,
  // Tier-1 business that already in marketplace patterns but ensuring coverage
  /(^|\.)fastcompany\.com(\/|$)/i,
  // Aggregators
  /(^|\.)ecomwatch\.com(\/|$)/i,
];

const CASTELLANOS_CLASSIFICATION_PRIMARY_PATTERNS: RegExp[] = [
  // California court system (opinions + dockets + case info)
  /(^|\.)supreme\.courts\.ca\.gov(\/|$)/i,
  /(^|\.)courts\.ca\.gov(\/|$)/i,
  /(^|\.)www4\.courts\.ca\.gov(\/|$)/i,
  /(^|\.)appellatecases\.courtinfo\.ca\.gov(\/|$)/i,
  /(^|\.)statecourtreport\.org(\/|$)/i,
  // California legislature + code
  /(^|\.)leginfo\.legislature\.ca\.gov(\/|$)/i,
  /(^|\.)california\.public\.law(\/|$)/i,
  // California state government / executive
  /(^|\.)gov\.ca\.gov(\/|$)/i,
  /(^|\.)www\.gov\.ca\.gov(\/|$)/i,
  /(^|\.)perb\.ca\.gov(\/|$)/i,
  /(^|\.)www\.perb\.ca\.gov(\/|$)/i,
  /(^|\.)sos\.ca\.gov(\/|$)/i,
  /(^|\.)www\.sos\.ca\.gov(\/|$)/i,
  /(^|\.)vig\.cdn\.sos\.ca\.gov(\/|$)/i,
  /(^|\.)lao\.ca\.gov(\/|$)/i,
  /(^|\.)ftb\.ca\.gov(\/|$)/i,
  /(^|\.)www\.ftb\.ca\.gov(\/|$)/i,
  /(^|\.)edd\.ca\.gov(\/|$)/i,
  /(^|\.)labor\.ca\.gov(\/|$)/i,
  /(^|\.)www\.labor\.ca\.gov(\/|$)/i,
  // California legislative committee + senator pages
  /(^|\.)sd03\.senate\.ca\.gov(\/|$)/i,
  /(^|\.)ains\.assembly\.ca\.gov(\/|$)/i,
  /(^|\.)acom\.assembly\.ca\.gov(\/|$)/i,
  // Other state legislatures
  /(^|\.)assembly\.state\.ny\.us(\/|$)/i,
  /(^|\.)nysenate\.gov(\/|$)/i,
  /(^|\.)www\.nysenate\.gov(\/|$)/i,
  /(^|\.)lawfilesext\.leg\.wa\.gov(\/|$)/i,
  // Court opinion mirrors / databases (publish primary court opinion text)
  /(^|\.)law\.justia\.com(\/|$)/i,
  /(^|\.)casetext\.com(\/|$)/i,
  /(^|\.)caselaw\.findlaw\.com(\/|$)/i,
  /(^|\.)scocal\.stanford\.edu(\/|$)/i,
  /(^|\.)courthousenews\.com(\/|$)/i,
  /(^|\.)www\.courthousenews\.com(\/|$)/i,
  /(^|\.)a\.qoid\.us(\/|$)/i,
  // Vendor corporate (rideshare/portable-health platforms)
  /(^|\.)uber\.com(\/|$)/i,
  /(^|\.)www\.uber\.com(\/|$)/i,
  // Academic primary (amicus briefs, faculty-published court documents)
  /(^|\.)berkeley\.edu(\/|$)/i,
  /(^|\.)law\.berkeley\.edu(\/|$)/i,
  /(^|\.)www\.law\.berkeley\.edu(\/|$)/i,
  // S3-hosted official legislative analyses
  /(^|\.)billtexts\.s3\.amazonaws\.com(\/|$)/i,
  /(^|\.)s3\.amazonaws\.com(\/|$)/i,
];

const CASTELLANOS_CLASSIFICATION_SECONDARY_PATTERNS: RegExp[] = [
  // California regional press
  /(^|\.)pressdemocrat\.com(\/|$)/i,
  /(^|\.)www\.pressdemocrat\.com(\/|$)/i,
  /(^|\.)sfgate\.com(\/|$)/i,
  /(^|\.)preview-prod\.w\.sfgate\.com(\/|$)/i,
  /(^|\.)abc7\.com(\/|$)/i,
  /(^|\.)www\.abc7\.com(\/|$)/i,
  /(^|\.)kqed\.org(\/|$)/i,
  /(^|\.)ww2\.kqed\.org(\/|$)/i,
  /(^|\.)sacbee\.com(\/|$)/i,
  /(^|\.)www\.sacbee\.com(\/|$)/i,
  /(^|\.)kcra\.com(\/|$)/i,
  /(^|\.)www\.kcra\.com(\/|$)/i,
  /(^|\.)latimes\.com(\/|$)/i,
  /(^|\.)www\.latimes\.com(\/|$)/i,
  /(^|\.)sfexaminer\.com(\/|$)/i,
  /(^|\.)www\.sfexaminer\.com(\/|$)/i,
  /(^|\.)sf\.eater\.com(\/|$)/i,
  /(^|\.)eater\.com(\/|$)/i,
  /(^|\.)eu\.desertsun\.com(\/|$)/i,
  /(^|\.)desertsun\.com(\/|$)/i,
  /(^|\.)calmatters\.org(\/|$)/i,
  /(^|\.)www\.calmatters\.org(\/|$)/i,
  // Massachusetts regional press
  /(^|\.)bostonglobe\.com(\/|$)/i,
  /(^|\.)www\.bostonglobe\.com(\/|$)/i,
  /(^|\.)commonwealthbeacon\.org(\/|$)/i,
  /(^|\.)wgbh\.org(\/|$)/i,
  /(^|\.)www\.wgbh\.org(\/|$)/i,
  /(^|\.)gbh\.org(\/|$)/i,
  // Illinois regional press (additional beyond portable-benefits set)
  /(^|\.)newsletters\.suntimes\.com(\/|$)/i,
  /(^|\.)capitolnewsillinois\.com(\/|$)/i,
  // National + general business
  /(^|\.)techcrunch\.com(\/|$)/i,
  /(^|\.)www\.techcrunch\.com(\/|$)/i,
  /(^|\.)news\.bloomberglaw\.com(\/|$)/i,
  /(^|\.)bloomberglaw\.com(\/|$)/i,
  /(^|\.)usnews\.com(\/|$)/i,
  /(^|\.)www\.usnews\.com(\/|$)/i,
  /(^|\.)cnbc\.com(\/|$)/i,
  /(^|\.)www\.cnbc\.com(\/|$)/i,
  /(^|\.)cnn\.com(\/|$)/i,
  /(^|\.)www\.cnn\.com(\/|$)/i,
  /(^|\.)npr\.org(\/|$)/i,
  /(^|\.)www\.npr\.org(\/|$)/i,
  /(^|\.)cbsnews\.com(\/|$)/i,
  /(^|\.)www\.cbsnews\.com(\/|$)/i,
  // Legal commentary + law firms
  /(^|\.)hklaw\.com(\/|$)/i,
  /(^|\.)jacksonlewis\.com(\/|$)/i,
  /(^|\.)fenwick\.com(\/|$)/i,
  /(^|\.)callaborlaw\.com(\/|$)/i,
  /(^|\.)cdf-labor-law\.com(\/|$)/i,
  /(^|\.)ogletree\.com(\/|$)/i,
  /(^|\.)mondaq\.com(\/|$)/i,
  /(^|\.)www\.mondaq\.com(\/|$)/i,
  /(^|\.)hrdailyadvisor\.hci\.org(\/|$)/i,
  /(^|\.)scocablog\.com(\/|$)/i,
  /(^|\.)electionlawblog\.org(\/|$)/i,
  /(^|\.)law\.com(\/|$)/i,
  /(^|\.)www\.law\.com(\/|$)/i,
  // Academic + research / advocacy / industry
  /(^|\.)cspa\.tufts\.edu(\/|$)/i,
  /(^|\.)cwci\.org(\/|$)/i,
  /(^|\.)seiu\.org(\/|$)/i,
  /(^|\.)uschamber\.com(\/|$)/i,
  /(^|\.)www\.uschamber\.com(\/|$)/i,
  /(^|\.)grsm\.com(\/|$)/i,
  /(^|\.)ballotpedia\.org(\/|$)/i,
  /(^|\.)www\.ballotpedia\.org(\/|$)/i,
  /(^|\.)sites\.law\.berkeley\.edu(\/|$)/i,
  /(^|\.)businessdailynetwork\.com(\/|$)/i,
  /(^|\.)sandiegouniontribune\.com(\/|$)/i,
  /(^|\.)www\.sandiegouniontribune\.com(\/|$)/i,
];

const DENTAL_OPS_PRIMARY_PATTERNS: RegExp[] = [
  // Federal government - health, courts, Congress, CBO
  /(^|\.)congress\.gov(\/|$)/i,
  /(^|\.)cbo\.gov(\/|$)/i,
  /(^|\.)accessdata\.fda\.gov(\/|$)/i,
  /(^|\.)510k\.innolitics\.com(\/|$)/i,
  // ADA + dental trade associations + state associations (primary trade)
  /(^|\.)ada\.org(\/|$)/i,
  /(^|\.)adanews\.ada\.org(\/|$)/i,
  /(^|\.)nadp\.org(\/|$)/i,
  /(^|\.)nysdental\.org(\/|$)/i,
  // State legislatures
  /(^|\.)leg\.colorado\.gov(\/|$)/i,
  // Dental vendor corporate sites - PMS / EHR
  /(^|\.)pearl\.com(\/|$)/i,
  /(^|\.)hellopearl\.com(\/|$)/i,
  /(^|\.)overjet\.com(\/|$)/i,
  /(^|\.)videahealth\.com(\/|$)/i,
  /(^|\.)videa\.ai(\/|$)/i,
  /(^|\.)nexhealth\.com(\/|$)/i,
  /(^|\.)blog\.nexhealth\.com(\/|$)/i,
  /(^|\.)planetdds\.com(\/|$)/i,
  /(^|\.)pacificdentalservices\.com(\/|$)/i,
  /(^|\.)pdshealth\.com(\/|$)/i,
  /(^|\.)heartland\.com(\/|$)/i,
  /(^|\.)blog\.heartland\.com(\/|$)/i,
  /(^|\.)aspendental\.mediaroom\.com(\/|$)/i,
  /(^|\.)smiledoctorspartners\.com(\/|$)/i,
  /(^|\.)investor\.henryschein\.com(\/|$)/i,
  /(^|\.)investors\.dentalcorp\.ca(\/|$)/i,
  /(^|\.)dentalpracticetransitions\.henryschein\.com(\/|$)/i,
  /(^|\.)patterson\.eaglesoft\.net(\/|$)/i,
  /(^|\.)carestreamdental\.com(\/|$)/i,
  /(^|\.)vynedental\.com(\/|$)/i,
  /(^|\.)sunbit\.com(\/|$)/i,
  /(^|\.)carecredit\.com(\/|$)/i,
  /(^|\.)deltadentalks\.com(\/|$)/i,
  /(^|\.)withcherry\.com(\/|$)/i,
  // Court records and legal primary
  /(^|\.)healthcarelawmatters\.foxrothschild\.com(\/|$)/i,
  // Press release wires (primary corporate communications)
  /(^|\.)businesswire\.com(\/|$)/i,
  /(^|\.)prnewswire\.com(\/|$)/i,
  // Think tanks / advocacy primary
  /(^|\.)economicliberties\.us(\/|$)/i,
];

const DENTAL_OPS_SECONDARY_PATTERNS: RegExp[] = [
  // Dental trade press
  /(^|\.)beckersdental\.com(\/|$)/i,
  /(^|\.)dentistrytoday\.com(\/|$)/i,
  /(^|\.)themolarreport\.com(\/|$)/i,
  /(^|\.)practicesignal\.com(\/|$)/i,
  /(^|\.)dentistdecoded\.com(\/|$)/i,
  /(^|\.)dentalstack\.io(\/|$)/i,
  /(^|\.)daydream\.dental(\/|$)/i,
  /(^|\.)firststopdental\.com(\/|$)/i,
  /(^|\.)checklistguro\.com(\/|$)/i,
  /(^|\.)drbicuspid\.com(\/|$)/i,
  /(^|\.)portosalute\.com(\/|$)/i,
  /(^|\.)homecaremag\.com(\/|$)/i,
  // Healthcare M&A and PE trade
  /(^|\.)healthcare\.levinassociates\.com(\/|$)/i,
  /(^|\.)mergr\.com(\/|$)/i,
  /(^|\.)pestakeholder\.org(\/|$)/i,
  /(^|\.)pitchbook\.com(\/|$)/i,
  /(^|\.)cbinsights\.com(\/|$)/i,
  /(^|\.)parsers\.vc(\/|$)/i,
  /(^|\.)getlatka\.com(\/|$)/i,
  /(^|\.)mergerlinks\.com(\/|$)/i,
  /(^|\.)app\.mergerlinks\.com(\/|$)/i,
  /(^|\.)bizbuysell\.com(\/|$)/i,
  /(^|\.)sovdoc\.com(\/|$)/i,
  /(^|\.)focusbankers\.com(\/|$)/i,
  // Tech/healthcare press
  /(^|\.)techcrunch\.com(\/|$)/i,
  /(^|\.)siliconangle\.com(\/|$)/i,
  /(^|\.)fiercebiotech\.com(\/|$)/i,
  /(^|\.)fierce-biotech\.com(\/|$)/i,
  /(^|\.)hitconsultant\.net(\/|$)/i,
  /(^|\.)medcitynews\.com(\/|$)/i,
  /(^|\.)finsmes\.com(\/|$)/i,
  /(^|\.)digitalhealthwire\.com(\/|$)/i,
  // Dental analyst firms
  /(^|\.)mordorintelligence\.com(\/|$)/i,
  /(^|\.)grandviewresearch\.com(\/|$)/i,
  /(^|\.)giiresearch\.com(\/|$)/i,
  /(^|\.)towardshealthcare\.com(\/|$)/i,
  /(^|\.)cervicornconsulting\.com(\/|$)/i,
  /(^|\.)marketsandmarkets\.com(\/|$)/i,
  /(^|\.)precedenceresearch\.com(\/|$)/i,
  // Health policy and law trade
  /(^|\.)kffhealthnews\.org(\/|$)/i,
  /(^|\.)kff\.org(\/|$)/i,
  /(^|\.)natlawreview\.com(\/|$)/i,
  /(^|\.)leechtishman\.com(\/|$)/i,
  /(^|\.)lilesparker\.com(\/|$)/i,
  /(^|\.)hklaw\.com(\/|$)/i,
  /(^|\.)goodwinlaw\.com(\/|$)/i,
  /(^|\.)sidley\.com(\/|$)/i,
  /(^|\.)ama-assn\.org(\/|$)/i,
  /(^|\.)jdsupra\.com(\/|$)/i,
  /(^|\.)ffis\.org(\/|$)/i,
  /(^|\.)stateline\.org(\/|$)/i,
  // Funding tracking, professional intelligence
  /(^|\.)moneygeek\.com(\/|$)/i,
  /(^|\.)comparemedicareadvantageplans\.org(\/|$)/i,
  /(^|\.)mercercapital\.com(\/|$)/i,
  /(^|\.)beneschlaw\.com(\/|$)/i,
  /(^|\.)healthaffairs\.org(\/|$)/i,
  /(^|\.)carequest\.org(\/|$)/i,
  /(^|\.)nmdha\.org(\/|$)/i,
  /(^|\.)adha\.org(\/|$)/i,
  /(^|\.)nevada\.public\.law(\/|$)/i,
  /(^|\.)law\.justia\.com(\/|$)/i,
  /(^|\.)revisor\.mn\.gov(\/|$)/i,
  // Corporate-tracking publishers + SaaS comparisons
  /(^|\.)trends\.builtwith\.com(\/|$)/i,
  /(^|\.)data\.landbase\.com(\/|$)/i,
  /(^|\.)sourceforge\.net(\/|$)/i,
  /(^|\.)leadiq\.com(\/|$)/i,
  /(^|\.)technologyevaluation\.com(\/|$)/i,
  /(^|\.)extruct\.ai(\/|$)/i,
  /(^|\.)no\.linkedin\.com(\/|$)/i,
];

const SENIOR_CARE_PRIMARY_PATTERNS: RegExp[] = [
  // Federal government — health, aging, labor, courts, statutes
  /(^|\.)acl\.gov(\/|$)/i,
  /(^|\.)cms\.gov(\/|$)/i,
  /(^|\.)hhs\.gov(\/|$)/i,
  /(^|\.)nih\.gov(\/|$)/i,
  /(^|\.)nia\.nih\.gov(\/|$)/i,
  /(^|\.)cdc\.gov(\/|$)/i,
  /(^|\.)medicaid\.gov(\/|$)/i,
  /(^|\.)medicare\.gov(\/|$)/i,
  /(^|\.)bls\.gov(\/|$)/i,
  /(^|\.)cbo\.gov(\/|$)/i,
  /(^|\.)gao\.gov(\/|$)/i,
  /(^|\.)federalregister\.gov(\/|$)/i,
  /(^|\.)congress\.gov(\/|$)/i,
  /(^|\.)accessdata\.fda\.gov(\/|$)/i,
  /(^|\.)fda\.gov(\/|$)/i,
  /(^|\.)ssa\.gov(\/|$)/i,
  // State government health/aging
  /(^|\.)aging\.ohio\.gov(\/|$)/i,
  /(^|\.)health\.ny\.gov(\/|$)/i,
  /(^|\.)mass\.gov(\/|$)/i,
  /(^|\.)dhcs\.ca\.gov(\/|$)/i,
  /(^|\.)dhs\.state(\/|$)/i,
  // Court records and legal primary
  /(^|\.)storage\.courtlistener\.com(\/|$)/i,
  /(^|\.)courtlistener\.com(\/|$)/i,
  /(^|\.)pacer\.gov(\/|$)/i,
  // Peer-reviewed journals
  /(^|\.)nature\.com(\/|$)/i,
  /(^|\.)nejm\.org(\/|$)/i,
  /(^|\.)jamanetwork\.com(\/|$)/i,
  /(^|\.)thelancet\.com(\/|$)/i,
  /(^|\.)pubmed\.ncbi\.nlm\.nih\.gov(\/|$)/i,
  /(^|\.)ncbi\.nlm\.nih\.gov(\/|$)/i,
  // Industry primary trade associations and authoritative bodies
  /(^|\.)alz\.org(\/|$)/i,
  /(^|\.)ahcancal\.org(\/|$)/i,
  /(^|\.)npaonline\.org(\/|$)/i,
  /(^|\.)leadingage\.org(\/|$)/i,
  /(^|\.)argentum\.org(\/|$)/i,
  /(^|\.)nahc\.org(\/|$)/i,
  /(^|\.)nic\.org(\/|$)/i,
  /(^|\.)blog\.nic\.org(\/|$)/i,
  // Senior-care vendor corporate sites (primary corporate disclosures)
  /(^|\.)pointclickcare\.com(\/|$)/i,
  /(^|\.)matrixcare\.com(\/|$)/i,
  /(^|\.)alayacare\.com(\/|$)/i,
  /(^|\.)wellsky\.com(\/|$)/i,
  /(^|\.)sensi\.ai(\/|$)/i,
  /(^|\.)inspiren\.com(\/|$)/i,
  /(^|\.)suki\.ai(\/|$)/i,
  /(^|\.)ceracare\.co\.uk(\/|$)/i,
  /(^|\.)cera\.com(\/|$)/i,
  /(^|\.)trualta\.com(\/|$)/i,
  /(^|\.)caribou\.care(\/|$)/i,
  /(^|\.)vestahealthcare\.com(\/|$)/i,
  /(^|\.)devoted\.com(\/|$)/i,
  /(^|\.)joinhonor\.com(\/|$)/i,
  /(^|\.)welltower\.com(\/|$)/i,
  /(^|\.)ventasreit\.com(\/|$)/i,
  /(^|\.)ir\.ventasreit\.com(\/|$)/i,
  /(^|\.)investor\.resmed\.com(\/|$)/i,
  /(^|\.)resmed\.com(\/|$)/i,
  /(^|\.)brightree\.com(\/|$)/i,
  /(^|\.)theora\.com(\/|$)/i,
  /(^|\.)apple\.com(\/|$)/i,
  /(^|\.)support\.apple\.com(\/|$)/i,
  /(^|\.)vayyar\.com(\/|$)/i,
  /(^|\.)walabot\.com(\/|$)/i,
  /(^|\.)tellus\.com(\/|$)/i,
  /(^|\.)safebeing\.com(\/|$)/i,
  /(^|\.)safelyyou\.com(\/|$)/i,
  /(^|\.)olacare\.com(\/|$)/i,
  /(^|\.)carepredict\.com(\/|$)/i,
  /(^|\.)carecentrix\.com(\/|$)/i,
  /(^|\.)homeinstead\.com(\/|$)/i,
  /(^|\.)maplewoodseniorliving\.com(\/|$)/i,
  /(^|\.)brookdale\.com(\/|$)/i,
  /(^|\.)atriaseniorliving\.com(\/|$)/i,
  /(^|\.)anhwerd\.org(\/|$)/i,
];

const SENIOR_CARE_SECONDARY_PATTERNS: RegExp[] = [
  // Senior-care and healthcare trade press
  /(^|\.)mcknights\.com(\/|$)/i,
  /(^|\.)mcknightsseniorliving\.com(\/|$)/i,
  /(^|\.)mcknightshomecare\.com(\/|$)/i,
  /(^|\.)homehealthcarenews\.com(\/|$)/i,
  /(^|\.)skillednursingnews\.com(\/|$)/i,
  /(^|\.)seniorhousingnews\.com(\/|$)/i,
  /(^|\.)hospicenews\.com(\/|$)/i,
  /(^|\.)homecaremag\.com(\/|$)/i,
  /(^|\.)agingmedia\.com(\/|$)/i,
  /(^|\.)beckershospitalreview\.com(\/|$)/i,
  /(^|\.)healthcareitnews\.com(\/|$)/i,
  /(^|\.)healthcaredive\.com(\/|$)/i,
  /(^|\.)fiercehealthcare\.com(\/|$)/i,
  /(^|\.)modernhealthcare\.com(\/|$)/i,
  /(^|\.)medcitynews\.com(\/|$)/i,
  /(^|\.)healthleadersmedia\.com(\/|$)/i,
  // Industry analyst and market-research firms
  /(^|\.)novaoneadvisor\.com(\/|$)/i,
  /(^|\.)grandviewresearch\.com(\/|$)/i,
  /(^|\.)polarismarketresearch\.com(\/|$)/i,
  /(^|\.)alliedmarketresearch\.com(\/|$)/i,
  /(^|\.)marketsandmarkets\.com(\/|$)/i,
  /(^|\.)precedenceresearch\.com(\/|$)/i,
  /(^|\.)imarcgroup\.com(\/|$)/i,
  /(^|\.)mordorintelligence\.com(\/|$)/i,
  // Consumer and senior-care data publishers
  /(^|\.)aplaceformom\.com(\/|$)/i,
  /(^|\.)caring\.com(\/|$)/i,
  /(^|\.)senioradvisor\.com(\/|$)/i,
  /(^|\.)agingcare\.com(\/|$)/i,
  // Health-policy think tanks and analyst orgs
  /(^|\.)kff\.org(\/|$)/i,
  /(^|\.)commonwealthfund\.org(\/|$)/i,
  /(^|\.)healthaffairs\.org(\/|$)/i,
  /(^|\.)brookings\.edu(\/|$)/i,
  /(^|\.)urban\.org(\/|$)/i,
  /(^|\.)rand\.org(\/|$)/i,
  // EHR and product analyst publishers
  /(^|\.)emrguides\.com(\/|$)/i,
  /(^|\.)klasresearch\.com(\/|$)/i,
  /(^|\.)softwareadvice\.com(\/|$)/i,
  /(^|\.)getapp\.com(\/|$)/i,
  // Funding and corporate-tracking publishers
  /(^|\.)crunchbase\.com(\/|$)/i,
  /(^|\.)pitchbook\.com(\/|$)/i,
  /(^|\.)techcrunch\.com(\/|$)/i,
  /(^|\.)venturebeat\.com(\/|$)/i,
  /(^|\.)forbes\.com(\/|$)/i,
  /(^|\.)bloomberg\.com(\/|$)/i,
  /(^|\.)reuters\.com(\/|$)/i,
  // Generalist tech and policy press
  /(^|\.)wsj\.com(\/|$)/i,
  /(^|\.)nytimes\.com(\/|$)/i,
  /(^|\.)washingtonpost\.com(\/|$)/i,
  /(^|\.)courthousenews\.com(\/|$)/i,
  /(^|\.)law360\.com(\/|$)/i,
  /(^|\.)pe\.com(\/|$)/i,
  /(^|\.)pehub\.com(\/|$)/i,
];

const BOOTCAMP_CREDENTIALING_PRIMARY_PATTERNS: RegExp[] = [
  // Federal regulators and gov
  /(^|\.)consumerfinance\.gov(\/|$)/i,
  /(^|\.)files\.consumerfinance\.gov(\/|$)/i,
  /(^|\.)fsapartners\.ed\.gov(\/|$)/i,
  /(^|\.)studentaid\.gov(\/|$)/i,
  /(^|\.)ftc\.gov(\/|$)/i,
  /(^|\.)dol\.gov(\/|$)/i,
  /(^|\.)dfpi\.ca\.gov(\/|$)/i,
  /(^|\.)bppe\.ca\.gov(\/|$)/i,
  /(^|\.)goldwaterscholarship\.gov(\/|$)/i,
  // SEC and SEC-content hosts
  /(^|\.)content\.edgar-online\.com(\/|$)/i,
  /(^|\.)last10k\.com(\/|$)/i,
  /(^|\.)q4cdn\.com(\/|$)/i,
  /(^|\.)s27\.q4cdn\.com(\/|$)/i,
  // Court / bankruptcy filing hosts
  /(^|\.)courtlistener\.com(\/|$)/i,
  /(^|\.)storage\.courtlistener\.com(\/|$)/i,
  /(^|\.)epiq11\.com(\/|$)/i,
  /(^|\.)document\.epiq11\.com(\/|$)/i,
  // Coursera (NYSE: COUR) corporate
  /(^|\.)coursera\.com(\/|$)/i,
  /(^|\.)coursera\.org(\/|$)/i,
  /(^|\.)investor\.coursera\.com(\/|$)/i,
  // Pluralsight corporate
  /(^|\.)pluralsight\.com(\/|$)/i,
  // Skillsoft (NYSE: SKIL) corporate
  /(^|\.)skillsoft\.com(\/|$)/i,
  /(^|\.)investor\.skillsoft\.com(\/|$)/i,
  // UWorld corporate
  /(^|\.)uworld\.com(\/|$)/i,
  /(^|\.)newsroom\.uworld\.com(\/|$)/i,
  /(^|\.)medical\.uworld\.com(\/|$)/i,
  /(^|\.)gradschool\.uworld\.com(\/|$)/i,
  /(^|\.)accounting\.uworld\.com(\/|$)/i,
  // Khan Academy / Microsoft / OpenAI corporate
  /(^|\.)khanacademy\.org(\/|$)/i,
  /(^|\.)blog\.khanacademy\.org(\/|$)/i,
  /(^|\.)microsoft\.com(\/|$)/i,
  /(^|\.)aka\.ms(\/|$)/i,
  /(^|\.)openai\.com(\/|$)/i,
  // Pearson / Credly / Accredible / Sertifier corporate
  /(^|\.)pearson\.com(\/|$)/i,
  /(^|\.)credly\.com(\/|$)/i,
  /(^|\.)info\.credly\.com(\/|$)/i,
  /(^|\.)accredible\.com(\/|$)/i,
  /(^|\.)sertifier\.org(\/|$)/i,
  /(^|\.)sertifier\.com(\/|$)/i,
  /(^|\.)stateofcredentialing\.com(\/|$)/i,
  // Workforce-development nonprofits + education orgs
  /(^|\.)perscholas\.org(\/|$)/i,
  /(^|\.)yearup\.org(\/|$)/i,
  // Bootcamp incumbents and PE acquirers
  /(^|\.)adeccogroup\.com(\/|$)/i,
  /(^|\.)carrickcapitalpartners\.com(\/|$)/i,
  /(^|\.)stridelearning\.com(\/|$)/i,
  /(^|\.)investors\.stridelearning\.com(\/|$)/i,
  /(^|\.)k12\.com(\/|$)/i,
  /(^|\.)bloomtech\.com(\/|$)/i,
  /(^|\.)flatironschool\.com(\/|$)/i,
  /(^|\.)generalassemb\.ly(\/|$)/i,
  /(^|\.)springboard\.com(\/|$)/i,
  /(^|\.)hackreactor\.com(\/|$)/i,
  /(^|\.)galvanize\.com(\/|$)/i,
  /(^|\.)thinkful\.com(\/|$)/i,
  /(^|\.)codecademy\.com(\/|$)/i,
  // Press-release distribution (when used by listed companies for primary disclosures)
  /(^|\.)prnewswire\.com(\/|$)/i,
  /(^|\.)businesswire\.com(\/|$)/i,
  /(^|\.)globenewswire\.com(\/|$)/i,
  // Test-prep and credentialing primary issuers
  /(^|\.)collegeboard\.org(\/|$)/i,
  /(^|\.)ets\.org(\/|$)/i,
  /(^|\.)lsac\.org(\/|$)/i,
  /(^|\.)aamc\.org(\/|$)/i,
  /(^|\.)nbme\.org(\/|$)/i,
  /(^|\.)usmle\.org(\/|$)/i,
  /(^|\.)aicpa\.org(\/|$)/i,
  /(^|\.)nasba\.org(\/|$)/i,
  /(^|\.)cfainstitute\.org(\/|$)/i,
  /(^|\.)ncsbn\.org(\/|$)/i,
  /(^|\.)1edtech\.org(\/|$)/i,
  // DEAC and accreditors
  /(^|\.)deac\.org(\/|$)/i,
  /(^|\.)wscuc\.org(\/|$)/i,
];

const BOOTCAMP_CREDENTIALING_SECONDARY_PATTERNS: RegExp[] = [
  // Bootcamp / EdTech trade press
  /(^|\.)coursereport\.com(\/|$)/i,
  /(^|\.)talentinc\.com(\/|$)/i,
  /(^|\.)edsurge\.com(\/|$)/i,
  /(^|\.)edscoop\.com(\/|$)/i,
  /(^|\.)highereddive\.com(\/|$)/i,
  /(^|\.)educationdive\.com(\/|$)/i,
  /(^|\.)chalkbeat\.org(\/|$)/i,
  /(^|\.)the74million\.org(\/|$)/i,
  /(^|\.)insidehighered\.com(\/|$)/i,
  /(^|\.)chronicle\.com(\/|$)/i,
  /(^|\.)edweek\.org(\/|$)/i,
  /(^|\.)k12dive\.com(\/|$)/i,
  // Tier-1 and Tier-2 generalist business / tech press
  /(^|\.)techcrunch\.com(\/|$)/i,
  /(^|\.)bloomberg\.com(\/|$)/i,
  /(^|\.)news\.bloomberglaw\.com(\/|$)/i,
  /(^|\.)bloomberglaw\.com(\/|$)/i,
  /(^|\.)theverge\.com(\/|$)/i,
  /(^|\.)reuters\.com(\/|$)/i,
  /(^|\.)forbes\.com(\/|$)/i,
  /(^|\.)wsj\.com(\/|$)/i,
  /(^|\.)nytimes\.com(\/|$)/i,
  /(^|\.)washingtonpost\.com(\/|$)/i,
  /(^|\.)cbsnews\.com(\/|$)/i,
  /(^|\.)axios\.com(\/|$)/i,
  /(^|\.)sfgate\.com(\/|$)/i,
  /(^|\.)aol\.com(\/|$)/i,
  /(^|\.)cnbc\.com(\/|$)/i,
  /(^|\.)marketwatch\.com(\/|$)/i,
  // Legal trade press for ISA / TILA / CFPB analysis
  /(^|\.)natlawreview\.com(\/|$)/i,
  /(^|\.)jdsupra\.com(\/|$)/i,
  /(^|\.)consumerfinancemonitor\.com(\/|$)/i,
  /(^|\.)bankersonline\.com(\/|$)/i,
  /(^|\.)law360\.com(\/|$)/i,
  /(^|\.)americanbanker\.com(\/|$)/i,
  // Test-prep / coding-bootcamp / EdTech analyst houses
  /(^|\.)360iresearch\.com(\/|$)/i,
  /(^|\.)mordorintelligence\.com(\/|$)/i,
  /(^|\.)researchandmarkets\.com(\/|$)/i,
  /(^|\.)verifiedmarketresearch\.com(\/|$)/i,
  /(^|\.)futuremarketreport\.com(\/|$)/i,
  /(^|\.)htfmarketinsights\.com(\/|$)/i,
  /(^|\.)technavio\.com(\/|$)/i,
  /(^|\.)credenceresearch\.com(\/|$)/i,
  /(^|\.)6wresearch\.com(\/|$)/i,
  /(^|\.)industryresearch\.biz(\/|$)/i,
  /(^|\.)marketresearch\.com(\/|$)/i,
  /(^|\.)zipdo\.co(\/|$)/i,
  /(^|\.)reqodata\.com(\/|$)/i,
  /(^|\.)grandviewresearch\.com(\/|$)/i,
  /(^|\.)precedenceresearch\.com(\/|$)/i,
  /(^|\.)alliedmarketresearch\.com(\/|$)/i,
  /(^|\.)marketsandmarkets\.com(\/|$)/i,
  /(^|\.)cbinsights\.com(\/|$)/i,
  /(^|\.)pitchbook\.com(\/|$)/i,
  /(^|\.)crunchbase\.com(\/|$)/i,
  /(^|\.)similarweb\.com(\/|$)/i,
  /(^|\.)statista\.com(\/|$)/i,
  /(^|\.)ibisworld\.com(\/|$)/i,
  // Investing / financial-news (used as secondary citations)
  /(^|\.)investing\.com(\/|$)/i,
  /(^|\.)benzinga\.com(\/|$)/i,
  /(^|\.)financierworldwide\.com(\/|$)/i,
  // Education / philanthropy trade
  /(^|\.)gatesfoundation\.org(\/|$)/i,
  /(^|\.)koch\.foundation(\/|$)/i,
  /(^|\.)apollooppfdn\.org(\/|$)/i,
  /(^|\.)leonlevinefoundation\.org(\/|$)/i,
  /(^|\.)blackrockfoundation\.org(\/|$)/i,
  /(^|\.)common-sense\.org(\/|$)/i,
  /(^|\.)commonsense\.org(\/|$)/i,
  /(^|\.)commonsensemedia\.org(\/|$)/i,
];

const MARKETPLACE_SELLER_OPS_PRIMARY_PATTERNS: RegExp[] = [
  // Amazon corporate
  /(^|\.)amazon\.com(\/|$)/i,
  /(^|\.)aboutamazon\.com(\/|$)/i,
  /(^|\.)sellingpartners\.aboutamazon\.com(\/|$)/i,
  // Shopify corporate
  /(^|\.)shopify\.com(\/|$)/i,
  /(^|\.)engineering\.shopify\.com(\/|$)/i,
  // Etsy corporate
  /(^|\.)etsy\.com(\/|$)/i,
  /(^|\.)investors\.etsy\.com(\/|$)/i,
  // Walmart corporate
  /(^|\.)walmart\.com(\/|$)/i,
  /(^|\.)corporate\.walmart\.com(\/|$)/i,
  /(^|\.)stock\.walmart\.com(\/|$)/i,
  /(^|\.)marketplace\.walmart\.com(\/|$)/i,
  // Pattern Group corporate
  /(^|\.)pattern\.com(\/|$)/i,
  /(^|\.)investors\.pattern\.com(\/|$)/i,
  // Aterian corporate
  /(^|\.)aterian\.io(\/|$)/i,
  /(^|\.)ir\.aterian\.io(\/|$)/i,
  // Seller-tools cohort corporate
  /(^|\.)pacvue\.com(\/|$)/i,
  /(^|\.)helium10\.com(\/|$)/i,
  /(^|\.)carbon6\.io(\/|$)/i,
  /(^|\.)threecolts\.co(\/|$)/i,
  /(^|\.)channelengine\.com(\/|$)/i,
  /(^|\.)channable\.com(\/|$)/i,
  /(^|\.)datahawk\.co(\/|$)/i,
  // PPC-automation cohort corporate
  /(^|\.)perpetua\.io(\/|$)/i,
  /(^|\.)teikametrics\.com(\/|$)/i,
  // OpenAI / Stripe / Microsoft corporate (already partially in primary, ensuring marketplace coverage)
  /(^|\.)openai\.com(\/|$)/i,
  /(^|\.)stripe\.com(\/|$)/i,
];

const MARKETPLACE_SELLER_OPS_SECONDARY_PATTERNS: RegExp[] = [
  // Marketplace-specialty trade press
  /(^|\.)marketplacepulse\.com(\/|$)/i,
  /(^|\.)modernretail\.co(\/|$)/i,
  /(^|\.)digitalcommerce360\.com(\/|$)/i,
  /(^|\.)retailtouchpoints\.com(\/|$)/i,
  /(^|\.)retaildive\.com(\/|$)/i,
  /(^|\.)ecommercebytes\.com(\/|$)/i,
  /(^|\.)ecommerce-times\.com(\/|$)/i,
  /(^|\.)emarketer\.com(\/|$)/i,
  /(^|\.)marketingdive\.com(\/|$)/i,
  /(^|\.)supermarketnews\.com(\/|$)/i,
  /(^|\.)marketwatch\.com(\/|$)/i,
  /(^|\.)thelettertwo\.com(\/|$)/i,
  /(^|\.)ecomwatch\.com(\/|$)/i,
  // Specialty Amazon agency / legal commentary
  /(^|\.)epinium\.com(\/|$)/i,
  /(^|\.)canopymanagement\.com(\/|$)/i,
  /(^|\.)paz\.ai(\/|$)/i,
  /(^|\.)novadata\.io(\/|$)/i,
  /(^|\.)amazonsellerslawyer\.com(\/|$)/i,
  /(^|\.)amazonsellers\.attorney(\/|$)/i,
  /(^|\.)sellersumbrella\.com(\/|$)/i,
  // SEC-filing aggregators (mirror primary SEC filings — treat as secondary)
  /(^|\.)last10k\.com(\/|$)/i,
  /(^|\.)stockadora\.com(\/|$)/i,
  /(^|\.)capedge\.com(\/|$)/i,
  /(^|\.)companiesmarketcap\.com(\/|$)/i,
  // Tax-specialty for marketplace 1099-K context
  /(^|\.)cpapracticeadvisor\.com(\/|$)/i,
  /(^|\.)anchin\.com(\/|$)/i,
  /(^|\.)formpros\.com(\/|$)/i,
  /(^|\.)collectiblestax\.com(\/|$)/i,
  // Industry / payments trade
  /(^|\.)paymentweek\.com(\/|$)/i,
];

const CONSTRUCTION_COMPLIANCE_PRIMARY_PATTERNS: RegExp[] = [
  // AIA contract documents
  /(^|\.)aiacontracts\.com(\/|$)/i,
  /(^|\.)help\.aiacontracts\.com(\/|$)/i,
  /(^|\.)learn\.aiacontracts\.com(\/|$)/i,
  /(^|\.)aia\.org(\/|$)/i,
  // Construction software corporate
  /(^|\.)procore\.com(\/|$)/i,
  /(^|\.)investors\.procore\.com(\/|$)/i,
  /(^|\.)autodesk\.com(\/|$)/i,
  /(^|\.)construction\.autodesk\.com(\/|$)/i,
  /(^|\.)investors\.autodesk\.com(\/|$)/i,
  /(^|\.)apps\.autodesk\.com(\/|$)/i,
  /(^|\.)buildertrend\.com(\/|$)/i,
  /(^|\.)higharc\.com(\/|$)/i,
  /(^|\.)cmicglobal\.com(\/|$)/i,
  /(^|\.)trimble\.com(\/|$)/i,
  /(^|\.)tekla\.com(\/|$)/i,
  /(^|\.)bluebeam\.com(\/|$)/i,
  /(^|\.)foundationsoft\.com(\/|$)/i,
  /(^|\.)foundationsoftware\.com(\/|$)/i,
  /(^|\.)sage\.com(\/|$)/i,
  /(^|\.)acumatica\.com(\/|$)/i,
  /(^|\.)viewpoint\.com(\/|$)/i,
  // AI-native construction startups corporate
  /(^|\.)trunktools\.com(\/|$)/i,
  /(^|\.)buildots\.com(\/|$)/i,
  /(^|\.)documentcrunch\.com(\/|$)/i,
  /(^|\.)openspace\.ai(\/|$)/i,
  /(^|\.)disperse\.io(\/|$)/i,
  /(^|\.)doxel\.ai(\/|$)/i,
  /(^|\.)togal\.ai(\/|$)/i,
  /(^|\.)alicetechnologies\.com(\/|$)/i,
  /(^|\.)smartvid\.io(\/|$)/i,
  /(^|\.)newmetrix\.com(\/|$)/i,
  /(^|\.)avvir\.io(\/|$)/i,
  /(^|\.)versatile\.com(\/|$)/i,
  /(^|\.)beamup\.ai(\/|$)/i,
  // Prequalification platforms corporate
  /(^|\.)isnetworld\.com(\/|$)/i,
  /(^|\.)avetta\.com(\/|$)/i,
  /(^|\.)veriforce\.com(\/|$)/i,
  // VC + sponsor primary publications
  /(^|\.)baincapitaltechopportunities\.com(\/|$)/i,
  /(^|\.)hggc\.com(\/|$)/i,
  /(^|\.)spark\.capital(\/|$)/i,
  /(^|\.)pillar\.vc(\/|$)/i,
  /(^|\.)insightpartners\.com(\/|$)/i,
  /(^|\.)redpoint\.com(\/|$)/i,
  /(^|\.)innovationendeavors\.com(\/|$)/i,
  /(^|\.)stepstonegroup\.com(\/|$)/i,
  /(^|\.)libertymutual\.com(\/|$)/i,
  /(^|\.)qumracapital\.com(\/|$)/i,
  /(^|\.)tlvpartners\.com(\/|$)/i,
  /(^|\.)lightspeed\.com(\/|$)/i,
  /(^|\.)greenfieldpartners\.com(\/|$)/i,
  /(^|\.)nemetschek\.com(\/|$)/i,
  /(^|\.)titaniumventures\.com(\/|$)/i,
  /(^|\.)navitascapital\.com(\/|$)/i,
  /(^|\.)zacuaventures\.com(\/|$)/i,
  /(^|\.)ironspring\.com(\/|$)/i,
  /(^|\.)fifthwall\.com(\/|$)/i,
  /(^|\.)luxcapital\.com(\/|$)/i,
  /(^|\.)menlovc\.com(\/|$)/i,
  // Federal regulator + agency (additional construction-specific)
  /(^|\.)census\.gov(\/|$)/i,
  /(^|\.)energy\.gov(\/|$)/i,
  /(^|\.)dol\.gov(\/|$)/i,
  /(^|\.)osha\.gov(\/|$)/i,
  /(^|\.)cms\.gov(\/|$)/i,
  /(^|\.)ecfr\.gov(\/|$)/i,
  /(^|\.)sam\.gov(\/|$)/i,
  /(^|\.)alpha\.sam\.gov(\/|$)/i,
  // SEC filing aggregator (acts as primary mirror for IR filings)
  /(^|\.)last10k\.com(\/|$)/i,
  /(^|\.)s21\.q4cdn\.com(\/|$)/i,
];

const CONSTRUCTION_COMPLIANCE_SECONDARY_PATTERNS: RegExp[] = [
  // Construction trade press
  /(^|\.)enr\.com(\/|$)/i,
  /(^|\.)constructiondive\.com(\/|$)/i,
  /(^|\.)constructionexec\.com(\/|$)/i,
  /(^|\.)forconstructionpros\.com(\/|$)/i,
  /(^|\.)constructionbusinessowner\.com(\/|$)/i,
  /(^|\.)builderonline\.com(\/|$)/i,
  /(^|\.)constructionequipmentguide\.com(\/|$)/i,
  /(^|\.)constructionjunkie\.com(\/|$)/i,
  /(^|\.)hbsdealer\.com(\/|$)/i,
  /(^|\.)constructionbids\.ai(\/|$)/i,
  /(^|\.)constructiondaily\.com(\/|$)/i,
  /(^|\.)constructionconnect\.com(\/|$)/i,
  /(^|\.)dodgeconstruction\.com(\/|$)/i,
  /(^|\.)houzz\.com(\/|$)/i,
  // Housing trade press
  /(^|\.)housingwire\.com(\/|$)/i,
  /(^|\.)forbuilders\.com(\/|$)/i,
  /(^|\.)builderonline\.com(\/|$)/i,
  /(^|\.)professionalbuilder\.com(\/|$)/i,
  // Compliance + safety trade press
  /(^|\.)industrialcompliancesafety\.com(\/|$)/i,
  /(^|\.)expiryedge\.com(\/|$)/i,
  /(^|\.)deltawye\.com(\/|$)/i,
  /(^|\.)cstoneindustries\.com(\/|$)/i,
  /(^|\.)safety-and-health-magazine\.com(\/|$)/i,
  /(^|\.)ehsdailyadvisor\.com(\/|$)/i,
  /(^|\.)blr\.com(\/|$)/i,
  // Lien-rights compliance vendor blogs
  /(^|\.)siteline\.com(\/|$)/i,
  /(^|\.)lienshield\.app(\/|$)/i,
  /(^|\.)projul\.com(\/|$)/i,
  /(^|\.)trysubshield\.com(\/|$)/i,
  /(^|\.)levelset\.com(\/|$)/i,
  /(^|\.)procore-help\.com(\/|$)/i,
  // Law firms / regulatory commentary
  /(^|\.)seyfarth\.com(\/|$)/i,
  /(^|\.)foley\.com(\/|$)/i,
  /(^|\.)kilpatricktownsend\.com(\/|$)/i,
  /(^|\.)natlawreview\.com(\/|$)/i,
  /(^|\.)constructionrisk\.com(\/|$)/i,
  /(^|\.)constructionlawyer\.com(\/|$)/i,
  // Sales/M&A intelligence
  /(^|\.)salestools\.io(\/|$)/i,
  // Industry blog
  /(^|\.)dancumberlandlabs\.com(\/|$)/i,
  /(^|\.)hypepotamus\.com(\/|$)/i,
  // EHR/EHR-equivalent comparison sites
  /(^|\.)adaptdigitalsolutions\.com(\/|$)/i,
];

const VIBECODING_PRACTITIONER_PRIMARY_PATTERNS: RegExp[] = [
  // Vibe-coding platform vendors (corporate + docs)
  /(^|\.)lovable\.dev(\/|$)/i,
  /(^|\.)docs\.lovable\.dev(\/|$)/i,
  /(^|\.)replit\.com(\/|$)/i,
  /(^|\.)docs\.replit\.com(\/|$)/i,
  /(^|\.)cursor\.com(\/|$)/i,
  /(^|\.)v0\.dev(\/|$)/i,
  /(^|\.)v0\.app(\/|$)/i,
  /(^|\.)bolt\.new(\/|$)/i,
  /(^|\.)stackblitz\.com(\/|$)/i,
  /(^|\.)windsurf\.com(\/|$)/i,
  /(^|\.)windsurf\.ai(\/|$)/i,
  /(^|\.)codeium\.com(\/|$)/i,
  /(^|\.)cognition\.ai(\/|$)/i,
  /(^|\.)emergent\.sh(\/|$)/i,
  /(^|\.)heyboss\.ai(\/|$)/i,
  /(^|\.)base44\.com(\/|$)/i,
  // Backend / infra primary
  /(^|\.)supabase\.com(\/|$)/i,
  /(^|\.)docs\.supabase\.com(\/|$)/i,
  /(^|\.)stripe\.com(\/|$)/i,
  /(^|\.)docs\.stripe\.com(\/|$)/i,
  /(^|\.)dashboard\.stripe\.com(\/|$)/i,
  /(^|\.)vercel\.com(\/|$)/i,
  /(^|\.)mcp\.vercel\.com(\/|$)/i,
  /(^|\.)mcp\.stripe\.com(\/|$)/i,
  /(^|\.)anthropic\.com(\/|$)/i,
  /(^|\.)docs\.anthropic\.com(\/|$)/i,
  /(^|\.)claude\.com(\/|$)/i,
  /(^|\.)code\.claude\.com(\/|$)/i,
  /(^|\.)openai\.com(\/|$)/i,
  /(^|\.)platform\.openai\.com(\/|$)/i,
  /(^|\.)github\.com(\/|$)/i,
  /(^|\.)docs\.github\.com(\/|$)/i,
  /(^|\.)bubble\.io(\/|$)/i,
  /(^|\.)flutterflow\.io(\/|$)/i,
  /(^|\.)fuzen\.ai(\/|$)/i,
  // Practitioner-built vendor sites (corporate primary)
  /(^|\.)confidantnotes\.com(\/|$)/i,
  /(^|\.)teja\.app(\/|$)/i,
  /(^|\.)nora-health\.co\.uk(\/|$)/i,
  /(^|\.)nora-health\.com(\/|$)/i,
  /(^|\.)dentalbase\.com(\/|$)/i,
  /(^|\.)dentivoice\.com(\/|$)/i,
  /(^|\.)omnira\.com(\/|$)/i,
  /(^|\.)nidrosoft\.com(\/|$)/i,
  // Indie hacker + practitioner-vendor primaries
  /(^|\.)bannerbear\.com(\/|$)/i,
  /(^|\.)senja\.io(\/|$)/i,
  /(^|\.)delightchat\.io(\/|$)/i,
  /(^|\.)zapier\.com(\/|$)/i,
  /(^|\.)indiehackers\.com(\/|$)/i,
  /(^|\.)producthunt\.com(\/|$)/i,
  /(^|\.)ycombinator\.com(\/|$)/i,
  // Carta + funding-disclosure primary
  /(^|\.)carta\.com(\/|$)/i,
];

const VIBECODING_PRACTITIONER_SECONDARY_PATTERNS: RegExp[] = [
  // Founder / practitioner essays + indie-hacker blogs
  /(^|\.)medium\.com(\/|$)/i,
  /(^|\.)substack\.com(\/|$)/i,
  /(^|\.)flowjam\.com(\/|$)/i,
  /(^|\.)indieradar\.app(\/|$)/i,
  /(^|\.)foundra\.ai(\/|$)/i,
  /(^|\.)foundevo\.com(\/|$)/i,
  /(^|\.)pixelnthings\.com(\/|$)/i,
  /(^|\.)awesomeagents\.ai(\/|$)/i,
  /(^|\.)infiniteany\.com(\/|$)/i,
  /(^|\.)academiapilot\.com(\/|$)/i,
  /(^|\.)makerstack\.co(\/|$)/i,
  /(^|\.)indieradar\.com(\/|$)/i,
  /(^|\.)solofounderhq\.com(\/|$)/i,
  /(^|\.)microconf\.com(\/|$)/i,
  // Vibe-coding analyst + comparison blogs
  /(^|\.)agentmarketcap\.ai(\/|$)/i,
  /(^|\.)humai\.blog(\/|$)/i,
  /(^|\.)aifundingtracker\.com(\/|$)/i,
  /(^|\.)socialanimal\.dev(\/|$)/i,
  /(^|\.)aitoolvs\.com(\/|$)/i,
  /(^|\.)builder\.io(\/|$)/i,
  /(^|\.)theinformation\.com(\/|$)/i,
  /(^|\.)stackdiary\.com(\/|$)/i,
  // Tech business press
  /(^|\.)businessinsider\.com(\/|$)/i,
  /(^|\.)bloomberg\.com(\/|$)/i,
  /(^|\.)reuters\.com(\/|$)/i,
  /(^|\.)wsj\.com(\/|$)/i,
  /(^|\.)theverge\.com(\/|$)/i,
  /(^|\.)wired\.com(\/|$)/i,
  /(^|\.)engadget\.com(\/|$)/i,
  /(^|\.)tomsguide\.com(\/|$)/i,
  /(^|\.)arstechnica\.com(\/|$)/i,
  /(^|\.)bensbites\.com(\/|$)/i,
];

const MCP_OAUTH_PRIMARY_PATTERNS: RegExp[] = [
  // OAuth + IETF + RFC primary
  /(^|\.)datatracker\.ietf\.org(\/|$)/i,
  /(^|\.)ftp\.ripe\.net(\/|$)/i,
  /(^|\.)ietf\.org(\/|$)/i,
  // IDP vendor primary
  /(^|\.)auth0\.com(\/|$)/i,
  /(^|\.)okta\.com(\/|$)/i,
  /(^|\.)keycloak\.org(\/|$)/i,
  /(^|\.)goauthentik\.io(\/|$)/i,
  /(^|\.)ory\.sh(\/|$)/i,
  /(^|\.)workos\.com(\/|$)/i,
  /(^|\.)descope\.com(\/|$)/i,
  /(^|\.)stytch\.com(\/|$)/i,
  // Microsoft auth
  /(^|\.)login\.microsoftonline\.com(\/|$)/i,
  /(^|\.)entra\.microsoft\.com(\/|$)/i,
  /(^|\.)learn\.microsoft\.com(\/|$)/i,
  // MCP gateway / proxy primary
  /(^|\.)agentgateway\.dev(\/|$)/i,
  /(^|\.)solo\.io(\/|$)/i,
  /(^|\.)docs\.solo\.io(\/|$)/i,
  /(^|\.)docs\.aigateway\.cequence\.ai(\/|$)/i,
  /(^|\.)cequence\.ai(\/|$)/i,
  /(^|\.)microsoft\.github\.io(\/|$)/i,
  /(^|\.)stacklok\.com(\/|$)/i,
  /(^|\.)toolhive\.dev(\/|$)/i,
  /(^|\.)permit\.io(\/|$)/i,
];

const MCP_OAUTH_SECONDARY_PATTERNS: RegExp[] = [
  // Practitioner blogs + analyst sites
  /(^|\.)dasroot\.net(\/|$)/i,
  /(^|\.)getlarge\.eu(\/|$)/i,
  /(^|\.)huuhka\.net(\/|$)/i,
  /(^|\.)curity\.io(\/|$)/i,
  /(^|\.)connect2id\.com(\/|$)/i,
  /(^|\.)scottbrady\.io(\/|$)/i,
  /(^|\.)leastprivilege\.com(\/|$)/i,
  /(^|\.)oauth\.net(\/|$)/i,
  /(^|\.)aaronpk\.com(\/|$)/i,
  /(^|\.)stackoverflow\.com(\/|$)/i,
];

const IDEMPOTENCY_ORCHESTRATION_PRIMARY_PATTERNS: RegExp[] = [
  // Durable workflow runtime vendors
  /(^|\.)temporal\.io(\/|$)/i,
  /(^|\.)docs\.temporal\.io(\/|$)/i,
  /(^|\.)blog\.temporal\.io(\/|$)/i,
  /(^|\.)restate\.dev(\/|$)/i,
  /(^|\.)docs\.restate\.dev(\/|$)/i,
  /(^|\.)blog\.restate\.dev(\/|$)/i,
  // Anthropic-adjacent canonical commentary primary for Claude Agent SDK
  /(^|\.)claudelab\.net(\/|$)/i,
];

const IDEMPOTENCY_ORCHESTRATION_SECONDARY_PATTERNS: RegExp[] = [
  // Practitioner blogs on idempotency / agent retries / Stripe-pattern decompositions
  /(^|\.)exesolution\.com(\/|$)/i,
  /(^|\.)getaxonflow\.com(\/|$)/i,
  /(^|\.)agentixlabs\.com(\/|$)/i,
  /(^|\.)finlyinsights\.com(\/|$)/i,
  /(^|\.)codelit\.io(\/|$)/i,
  /(^|\.)mdsanwarhossain\.me(\/|$)/i,
  /(^|\.)hookbase\.app(\/|$)/i,
  /(^|\.)apiscout\.dev(\/|$)/i,
  /(^|\.)claudeguide\.io(\/|$)/i,
  /(^|\.)sujeet\.pro(\/|$)/i,
  /(^|\.)semaphoreci\.com(\/|$)/i,
  /(^|\.)martinfowler\.com(\/|$)/i,
];

const FRIA_METHODOLOGY_PRIMARY_PATTERNS: RegExp[] = [
  // EU AI Act regulation mirrors
  /(^|\.)artificialintelligenceact\.eu(\/|$)/i,
  /(^|\.)artificialintelligenceact\.com(\/|$)/i,
  /(^|\.)en\.ai-act\.io(\/|$)/i,
  /(^|\.)ai-act\.io(\/|$)/i,
  /(^|\.)ai-eu-act\.eu(\/|$)/i,
  /(^|\.)artificial-intelligence-act\.com(\/|$)/i,
  /(^|\.)eurlexa\.com(\/|$)/i,
  // EU public buyers / AI Office canonical sources
  /(^|\.)public-buyers-community\.ec\.europa\.eu(\/|$)/i,
  /(^|\.)digital-strategy\.ec\.europa\.eu(\/|$)/i,
  /(^|\.)link\.europa\.eu(\/|$)/i,
  /(^|\.)code-of-practice\.ai(\/|$)/i,
  // EU institutional + national-DPA + Council of Europe
  /(^|\.)edps\.europa\.eu(\/|$)/i,
  /(^|\.)fra\.europa\.eu(\/|$)/i,
  /(^|\.)futurium\.ec\.europa\.eu(\/|$)/i,
  /(^|\.)rm\.coe\.int(\/|$)/i,
  /(^|\.)coe\.int(\/|$)/i,
  /(^|\.)apdcat\.cat(\/|$)/i,
  /(^|\.)government\.nl(\/|$)/i,
  // Civil-society canonical FRIA publishers
  /(^|\.)humanrights\.dk(\/|$)/i,
  /(^|\.)ecnl\.org(\/|$)/i,
  /(^|\.)learningcenter\.ecnl\.org(\/|$)/i,
  // Academic + research portals
  /(^|\.)pollicinoaidvisory\.eu(\/|$)/i,
  /(^|\.)research-portal\.uu\.nl(\/|$)/i,
  /(^|\.)iris\.cnr\.it(\/|$)/i,
  /(^|\.)iris\.polito\.it(\/|$)/i,
  /(^|\.)sciencedirect\.com(\/|$)/i,
  /(^|\.)papers\.ssrn\.com(\/|$)/i,
  /(^|\.)ssrn\.com(\/|$)/i,
];

const FRIA_METHODOLOGY_SECONDARY_PATTERNS: RegExp[] = [
  // EU AI Act practitioner blogs / vendor analyst sites
  /(^|\.)aiactblog\.nl(\/|$)/i,
  /(^|\.)euai\.app(\/|$)/i,
  /(^|\.)aiactstack\.com(\/|$)/i,
  /(^|\.)reg-intel\.com(\/|$)/i,
  /(^|\.)legalithm\.com(\/|$)/i,
  /(^|\.)archerirm\.com(\/|$)/i,
  /(^|\.)aicompliancevendors\.com(\/|$)/i,
  /(^|\.)euaiactchecklist\.com(\/|$)/i,
  /(^|\.)euaicompass\.com(\/|$)/i,
  /(^|\.)haffa\.ai(\/|$)/i,
  /(^|\.)aigl\.blog(\/|$)/i,
  /(^|\.)freshfields\.com(\/|$)/i,
  /(^|\.)eucrim\.eu(\/|$)/i,
  /(^|\.)gamingtechlaw\.com(\/|$)/i,
  /(^|\.)eudigitallaw\.com(\/|$)/i,
  /(^|\.)socialimpactassessment\.com(\/|$)/i,
  /(^|\.)cadeproject\.org(\/|$)/i,
];

const VENDOR_CONTRACT_PRIMARY_PATTERNS: RegExp[] = [
  // Major law firms (canonical practitioner authority for EU vendor contracts)
  /(^|\.)stephensonharwood\.com(\/|$)/i,
  /(^|\.)freshfields\.com(\/|$)/i,
  /(^|\.)taylorwessing\.com(\/|$)/i,
  /(^|\.)mishcon\.com(\/|$)/i,
  /(^|\.)cms-digitallaws\.com(\/|$)/i,
  /(^|\.)trowers\.com(\/|$)/i,
  /(^|\.)burges-salmon\.com(\/|$)/i,
  /(^|\.)slaughterandmay\.com(\/|$)/i,
  /(^|\.)thelens\.slaughterandmay\.com(\/|$)/i,
  /(^|\.)insideprivacy\.com(\/|$)/i,
  /(^|\.)cooley\.com(\/|$)/i,
  /(^|\.)ictlc\.com(\/|$)/i,
  /(^|\.)nicfab\.eu(\/|$)/i,
  // Vendor canonical legal pages (DPAs, supplier addenda)
  /(^|\.)openai\.com(\/|$)/i,
  /(^|\.)anthropic\.com(\/|$)/i,
  /(^|\.)legal\.mistral\.ai(\/|$)/i,
  /(^|\.)mistral\.ai(\/|$)/i,
];

const VENDOR_CONTRACT_SECONDARY_PATTERNS: RegExp[] = [
  // Practitioner clause libraries + procurement guides
  /(^|\.)pertamapartners\.com(\/|$)/i,
  /(^|\.)lawsnap\.com(\/|$)/i,
  /(^|\.)natlawreview\.com(\/|$)/i,
  /(^|\.)vendorbenchmark\.com(\/|$)/i,
  /(^|\.)njbusiness-attorney\.com(\/|$)/i,
  /(^|\.)atonementlicensing\.com(\/|$)/i,
  /(^|\.)gc\.ai(\/|$)/i,
  /(^|\.)mondaq\.com(\/|$)/i,
  /(^|\.)redresscompliance\.com(\/|$)/i,
  /(^|\.)support\.secureprivacy\.ai(\/|$)/i,
  /(^|\.)forensicmark\.com(\/|$)/i,
  /(^|\.)isms\.online(\/|$)/i,
  /(^|\.)eh\.at(\/|$)/i,
  /(^|\.)jdsupra\.com(\/|$)/i,
  /(^|\.)tzafon\.ai(\/|$)/i,
  /(^|\.)beamon\.ai(\/|$)/i,
  /(^|\.)docs\.molin\.ai(\/|$)/i,
  /(^|\.)elnora\.ai(\/|$)/i,
  /(^|\.)bbos\.ai(\/|$)/i,
  /(^|\.)quantamixsolutions\.com(\/|$)/i,
  /(^|\.)gdprregister\.eu(\/|$)/i,
  /(^|\.)digitalpolicyalert\.org(\/|$)/i,
  /(^|\.)digitalcompliance\.snellman\.com(\/|$)/i,
  /(^|\.)snellman\.com(\/|$)/i,
];

const UNIFIED_GOVERNANCE_PRIMARY_PATTERNS: RegExp[] = [
  // Singapore IMDA + AI Verify Foundation (regulator + standards-body equivalent)
  /(^|\.)aiverifyfoundation\.sg(\/|$)/i,
  /(^|\.)staging\.aiverifyfoundation\.sg(\/|$)/i,
  /(^|\.)imda\.gov\.sg(\/|$)/i,
  /(^|\.)singaporestandardseshop\.sg(\/|$)/i,
  // COMPEL framework canonical surfaces (the unified-controls reference)
  /(^|\.)compelframework\.org(\/|$)/i,
  /(^|\.)compel\.one(\/|$)/i,
  // EU AI Act service desk / EUR-Lex / NIST AIRC sub-domains
  /(^|\.)ai-act-service-desk\.ec\.europa\.eu(\/|$)/i,
  /(^|\.)airc\.nist\.gov(\/|$)/i,
  /(^|\.)nvlpubs\.nist\.gov(\/|$)/i,
  /(^|\.)downloads\.regulations\.gov(\/|$)/i,
];

const SPECIALIZED_JUDGE_PRIMARY_PATTERNS: RegExp[] = [
  // Academic/standards body canonical surfaces
  /(^|\.)aclanthology\.org(\/|$)/i,
  /(^|\.)openreview\.net(\/|$)/i,
  /(^|\.)huggingface\.co(\/|$)/i,
  /(^|\.)hf\.co(\/|$)/i,
  /(^|\.)huggingface\.tw(\/|$)/i,
  /(^|\.)api-inference\.hf-mirror\.com(\/|$)/i,
  /(^|\.)sgl-project\.github\.io(\/|$)/i,
  // Salesforce AI Research blog (corporate primary on own work)
  /(^|\.)blog\.salesforceairesearch\.com(\/|$)/i,
];

const EDGE_AI_PRIMARY_PATTERNS: RegExp[] = [
  // Apple corporate primary surfaces
  /(^|\.)machinelearning\.apple\.com(\/|$)/i,
  /(^|\.)opensource\.apple\.com(\/|$)/i,
  /(^|\.)apple\.github\.io(\/|$)/i,
  // Microsoft sub-domains for Azure + Foundry + Olive docs
  /(^|\.)azure\.microsoft\.com(\/|$)/i,
  /(^|\.)ai\.azure\.com(\/|$)/i,
  /(^|\.)microsoft\.github\.io(\/|$)/i,
  // NVIDIA + Qualcomm corporate primary
  /(^|\.)build\.nvidia\.com(\/|$)/i,
  /(^|\.)docs\.qualcomm\.com(\/|$)/i,
  /(^|\.)workbench\.aihub\.qualcomm\.com(\/|$)/i,
  // Nexa AI canonical docs (vendor primary on own SDK)
  /(^|\.)docs\.nexa\.ai(\/|$)/i,
  /(^|\.)nexa\.ai(\/|$)/i,
];

const EDGE_AI_SECONDARY_PATTERNS: RegExp[] = [
  /(^|\.)strathweb\.com(\/|$)/i,
  /(^|\.)macmlx\.app(\/|$)/i,
  /(^|\.)axiomlogica\.com(\/|$)/i,
];

const KNOWLEDGE_DISTILLATION_PRIMARY_PATTERNS: RegExp[] = [
  // Microsoft tech-community + sub-domains
  /(^|\.)techcommunity\.microsoft\.com(\/|$)/i,
  // NVIDIA + IBM corporate primary on own infrastructure
  /(^|\.)docs\.api\.nvidia\.com(\/|$)/i,
  /(^|\.)ibm\.com(\/|$)/i,
  // arXiv mirrors
  /(^|\.)arxiv\.gg(\/|$)/i,
  // Distil Labs is the canonical productised distillation vendor
  /(^|\.)distillabs\.ai(\/|$)/i,
];

const KNOWLEDGE_DISTILLATION_SECONDARY_PATTERNS: RegExp[] = [
  /(^|\.)tianpan\.co(\/|$)/i,
  /(^|\.)deepseekai\.guide(\/|$)/i,
  /(^|\.)emergentmind\.com(\/|$)/i,
  /(^|\.)dataopsschool\.com(\/|$)/i,
  /(^|\.)docs\.inferless\.com(\/|$)/i,
  /(^|\.)inferless\.com(\/|$)/i,
  /(^|\.)decodethefuture\.org(\/|$)/i,
];

const SPECIALIZED_JUDGE_SECONDARY_PATTERNS: RegExp[] = [
  // Practitioner blogs + analyst sites
  /(^|\.)zylos\.ai(\/|$)/i,
  /(^|\.)booleanbeyond\.com(\/|$)/i,
  /(^|\.)statsig\.com(\/|$)/i,
  /(^|\.)particula\.tech(\/|$)/i,
  /(^|\.)leaper\.dev(\/|$)/i,
  /(^|\.)deploybase\.ai(\/|$)/i,
  /(^|\.)awesomeagents\.ai(\/|$)/i,
  /(^|\.)distilabel\.argilla\.io(\/|$)/i,
  /(^|\.)deepwiki\.com(\/|$)/i,
  /(^|\.)cameronrwolfe\.substack\.com(\/|$)/i,
  /(^|\.)eugeneyan\.com(\/|$)/i,
];

const UNIFIED_GOVERNANCE_SECONDARY_PATTERNS: RegExp[] = [
  // Governance platforms + AI risk management vendor surfaces
  /(^|\.)modulos\.ai(\/|$)/i,
  /(^|\.)docs\.modulos\.ai(\/|$)/i,
  /(^|\.)trussed\.ai(\/|$)/i,
  /(^|\.)feeds\.trussed\.ai(\/|$)/i,
  /(^|\.)fairnow\.ai(\/|$)/i,
  /(^|\.)gaicc\.org(\/|$)/i,
  /(^|\.)glacis\.io(\/|$)/i,
  /(^|\.)runcycles\.io(\/|$)/i,
  /(^|\.)safeguardsai\.com(\/|$)/i,
  /(^|\.)dsalta\.com(\/|$)/i,
  /(^|\.)examcert\.app(\/|$)/i,
  /(^|\.)elevateconsult\.com(\/|$)/i,
  /(^|\.)yonahwelker\.org(\/|$)/i,
  /(^|\.)fernandoarrieta\.org(\/|$)/i,
  /(^|\.)ampliflow\.com(\/|$)/i,
  /(^|\.)lenavix\.com(\/|$)/i,
  /(^|\.)ai\.lenavix\.com(\/|$)/i,
  /(^|\.)strac\.io(\/|$)/i,
  /(^|\.)legalithm\.com(\/|$)/i,
  /(^|\.)theartofservice\.com(\/|$)/i,
  /(^|\.)risktemplate\.com(\/|$)/i,
  // ISO/IEC 42001 conformity-assessment certification bodies (industry secondary)
  /(^|\.)qmscert\.com(\/|$)/i,
  /(^|\.)kiwa\.com(\/|$)/i,
  /(^|\.)dnv\.ae(\/|$)/i,
  /(^|\.)dnv\.com(\/|$)/i,
  /(^|\.)sgs\.com(\/|$)/i,
  /(^|\.)orioncan\.com(\/|$)/i,
  /(^|\.)bsigroup\.com(\/|$)/i,
  /(^|\.)v1\.bsigroup\.com(\/|$)/i,
  /(^|\.)pacificcert\.com(\/|$)/i,
  /(^|\.)blog\.pacificcert\.com(\/|$)/i,
  /(^|\.)rsisecurity\.com(\/|$)/i,
  /(^|\.)blog\.rsisecurity\.com(\/|$)/i,
  // Practitioner industry consortia + community blogs
  /(^|\.)compliact\.medium\.com(\/|$)/i,
  /(^|\.)cloudsecurityalliance\.org(\/|$)/i,
  /(^|\.)euaicompass\.com(\/|$)/i,
];

const GDPR_CCPA_PRIMARY_PATTERNS: RegExp[] = [
  // Regulators + standards bodies
  /(^|\.)govt\.westlaw\.com(\/|$)/i,
  /(^|\.)cppa\.ca\.gov(\/|$)/i,
  /(^|\.)leginfo\.legislature\.ca\.gov(\/|$)/i,
  /(^|\.)edpb\.europa\.eu(\/|$)/i,
  /(^|\.)cnil\.fr(\/|$)/i,
  /(^|\.)ico\.org\.uk(\/|$)/i,
  /(^|\.)gpdp\.it(\/|$)/i,
  /(^|\.)aiact-info\.eu(\/|$)/i,
  /(^|\.)practical-ai-act\.eu(\/|$)/i,
  // Vector DB vendor primary
  /(^|\.)pinecone\.io(\/|$)/i,
  /(^|\.)qdrant\.tech(\/|$)/i,
  /(^|\.)weaviate\.io(\/|$)/i,
  /(^|\.)databricks\.com(\/|$)/i,
  /(^|\.)trychroma\.com(\/|$)/i,
  /(^|\.)mem0\.ai(\/|$)/i,
  /(^|\.)mem0docs\.xyz(\/|$)/i,
  /(^|\.)kronvex\.io(\/|$)/i,
];

const GDPR_CCPA_SECONDARY_PATTERNS: RegExp[] = [
  // Legal analysis + privacy practitioner blogs
  /(^|\.)astraea\.law(\/|$)/i,
  /(^|\.)skadden\.com(\/|$)/i,
  /(^|\.)littler\.com(\/|$)/i,
  /(^|\.)goodwinlaw\.com(\/|$)/i,
  /(^|\.)cooley\.com(\/|$)/i,
  /(^|\.)gibsondunn\.com(\/|$)/i,
  // Independent privacy + AI compliance commentators
  /(^|\.)tianpan\.co(\/|$)/i,
  /(^|\.)notraced\.com(\/|$)/i,
  /(^|\.)callsphere\.ai(\/|$)/i,
  /(^|\.)everstoneai\.com(\/|$)/i,
  /(^|\.)twig\.so(\/|$)/i,
  /(^|\.)help\.twig\.so(\/|$)/i,
  /(^|\.)agledger\.ai(\/|$)/i,
  /(^|\.)systima\.ai(\/|$)/i,
  /(^|\.)certifieddata\.io(\/|$)/i,
  /(^|\.)ovidiusuciu\.com(\/|$)/i,
  /(^|\.)rgpd\.com(\/|$)/i,
  /(^|\.)theneuralbase\.com(\/|$)/i,
];

const AIBOM_SUPPLY_CHAIN_PRIMARY_PATTERNS: RegExp[] = [
  // CycloneDX standard
  /(^|\.)cyclonedx\.org(\/|$)/i,
  /(^|\.)ecma-tc54\.github\.io(\/|$)/i,
  // Snyk corporate primary
  /(^|\.)snyk\.io(\/|$)/i,
  /(^|\.)docs\.snyk\.io(\/|$)/i,
  /(^|\.)labs\.snyk\.io(\/|$)/i,
  /(^|\.)updates\.snyk\.io(\/|$)/i,
  /(^|\.)evo\.ai\.snyk\.io(\/|$)/i,
  // EU AI Act + regulators + standards bodies
  /(^|\.)ai-act-service-desk\.ec\.europa\.eu(\/|$)/i,
  /(^|\.)ec\.europa\.eu(\/|$)/i,
  /(^|\.)eur-lex\.europa\.eu(\/|$)/i,
  /(^|\.)nist\.gov(\/|$)/i,
  /(^|\.)iso\.org(\/|$)/i,
  /(^|\.)cisa\.gov(\/|$)/i,
  /(^|\.)spdx\.org(\/|$)/i,
  /(^|\.)cen-cenelec\.eu(\/|$)/i,
  // Invariant Labs (foundational tool-poisoning research)
  /(^|\.)invariantlabs\.ai(\/|$)/i,
];

const AIBOM_SUPPLY_CHAIN_SECONDARY_PATTERNS: RegExp[] = [
  // EU AI Act analyst guides
  /(^|\.)aiacto\.eu(\/|$)/i,
  /(^|\.)euaiactguide\.com(\/|$)/i,
  /(^|\.)aiactgap\.com(\/|$)/i,
  /(^|\.)annexa\.eu(\/|$)/i,
  /(^|\.)ai-resources\.eu(\/|$)/i,
  /(^|\.)aiactregistration\.com(\/|$)/i,
  // MCP supply-chain research blogs
  /(^|\.)marmelab\.com(\/|$)/i,
  /(^|\.)lorikeetsecurity\.com(\/|$)/i,
  /(^|\.)aguardic\.com(\/|$)/i,
  /(^|\.)policylayer\.com(\/|$)/i,
  // SBOM / SCA practitioner sites
  /(^|\.)dependabot\.com(\/|$)/i,
  /(^|\.)endorlabs\.com(\/|$)/i,
  /(^|\.)anchore\.com(\/|$)/i,
  /(^|\.)chainguard\.dev(\/|$)/i,
  /(^|\.)socket\.dev(\/|$)/i,
];

const BROWSER_AGENT_SECURITY_PRIMARY_PATTERNS: RegExp[] = [
  // Vendor primary disclosure surfaces
  /(^|\.)brave\.com(\/|$)/i,
  /(^|\.)openai\.com(\/|$)/i,
  /(^|\.)perplexity\.ai(\/|$)/i,
  /(^|\.)support\.claude\.com(\/|$)/i,
  /(^|\.)claude\.ai(\/|$)/i,
  /(^|\.)msrc\.microsoft\.com(\/|$)/i,
  /(^|\.)aim\.security(\/|$)/i,
  // Standards bodies + NIST + CVE
  /(^|\.)nvd\.nist\.gov(\/|$)/i,
  /(^|\.)cve\.mitre\.org(\/|$)/i,
  /(^|\.)cve\.org(\/|$)/i,
  // Academic publishers
  /(^|\.)ojs\.aaai\.org(\/|$)/i,
  /(^|\.)aaai\.org(\/|$)/i,
  /(^|\.)usenix\.org(\/|$)/i,
  /(^|\.)ieeexplore\.ieee\.org(\/|$)/i,
  /(^|\.)acm\.org(\/|$)/i,
];

const BROWSER_AGENT_SECURITY_SECONDARY_PATTERNS: RegExp[] = [
  // Vulnerability research labs + AI security analyst blogs
  /(^|\.)koi\.security(\/|$)/i,
  /(^|\.)labs\.zenity\.io(\/|$)/i,
  /(^|\.)zenity\.io(\/|$)/i,
  /(^|\.)raxe\.ai(\/|$)/i,
  /(^|\.)forcepoint\.com(\/|$)/i,
  /(^|\.)labs\.cloudsecurityalliance\.org(\/|$)/i,
  /(^|\.)cloudsecurityalliance\.org(\/|$)/i,
  /(^|\.)forge\.ai(\/|$)/i,
  /(^|\.)alice\.io(\/|$)/i,
  /(^|\.)breakmyagent\.ai(\/|$)/i,
  /(^|\.)hivesecurity\.gitlab\.io(\/|$)/i,
  /(^|\.)wiki\.charleschen\.ai(\/|$)/i,
  /(^|\.)deepyard\.dev(\/|$)/i,
  // Independent AI security commentators
  /(^|\.)simonwillison\.net(\/|$)/i,
  /(^|\.)blog\.simonwillison\.net(\/|$)/i,
  // Tech press
  /(^|\.)theregister\.com(\/|$)/i,
  /(^|\.)arstechnica\.com(\/|$)/i,
  /(^|\.)zdnet\.com(\/|$)/i,
  /(^|\.)insight\.tmcnet\.com(\/|$)/i,
  /(^|\.)tmcnet\.com(\/|$)/i,
  /(^|\.)newsdefused\.com(\/|$)/i,
  /(^|\.)ainewstoday\.org(\/|$)/i,
  /(^|\.)gadgets360\.com(\/|$)/i,
  /(^|\.)ciol\.com(\/|$)/i,
  /(^|\.)indianexpress\.com(\/|$)/i,
  /(^|\.)tenable\.com(\/|$)/i,
];

const CAPABILITY_AGENT_SECURITY_PRIMARY_PATTERNS: RegExp[] = [
  // Academic publishers + canonical OCap source authors
  /(^|\.)cacm\.acm\.org(\/|$)/i,
  /(^|\.)queue\.acm\.org(\/|$)/i,
  /(^|\.)dl\.acm\.org(\/|$)/i,
  /(^|\.)arxiv\.org(\/|$)/i,
  /(^|\.)erights\.org(\/|$)/i,
  /(^|\.)files\.spritely\.institute(\/|$)/i,
  /(^|\.)spritely\.institute(\/|$)/i,
  // Capability-runtime + AI-agent-security vendor primary
  /(^|\.)zylos\.ai(\/|$)/i,
  /(^|\.)ailang\.sunholo\.com(\/|$)/i,
  /(^|\.)sunholo\.com(\/|$)/i,
  /(^|\.)anthropic\.com(\/|$)/i,
  /(^|\.)openai\.com(\/|$)/i,
  /(^|\.)deepmind\.google(\/|$)/i,
  /(^|\.)research\.google(\/|$)/i,
  /(^|\.)research\.microsoft\.com(\/|$)/i,
  // Standards bodies + protocol primary
  /(^|\.)modelcontextprotocol\.io(\/|$)/i,
  /(^|\.)owasp\.org(\/|$)/i,
  /(^|\.)w3c\.github\.io(\/|$)/i,
  // Formal-verification + secure-OS academic
  /(^|\.)trustworthy\.systems(\/|$)/i,
  /(^|\.)pdos\.csail\.mit\.edu(\/|$)/i,
  /(^|\.)cseweb\.ucsd\.edu(\/|$)/i,
  /(^|\.)cl\.cam\.ac\.uk(\/|$)/i,
  /(^|\.)wiki\.freebsd\.org(\/|$)/i,
  // Cloud + AWS prescriptive guidance + Deno docs
  /(^|\.)docs\.aws\.amazon\.com(\/|$)/i,
  /(^|\.)docs\.deno\.com(\/|$)/i,
  /(^|\.)deno\.land(\/|$)/i,
  /(^|\.)deno\.com(\/|$)/i,
  /(^|\.)wasi\.dev(\/|$)/i,
  /(^|\.)bytecodealliance\.org(\/|$)/i,
];

const CAPABILITY_AGENT_SECURITY_SECONDARY_PATTERNS: RegExp[] = [
  // Bibliographic indexes + author bibliography pages (demoted from primary)
  /(^|\.)researchr\.org(\/|$)/i,
  /(^|\.)ui\.adsabs\.harvard\.edu(\/|$)/i,
  /(^|\.)papers\.agoric\.com(\/|$)/i,
  /(^|\.)agoric\.com(\/|$)/i,
  // Package registries + project history pages (verified releases / version history)
  /(^|\.)crates\.io(\/|$)/i,
  /(^|\.)docs\.rs(\/|$)/i,
  /(^|\.)pypi\.org(\/|$)/i,
  /(^|\.)npmjs\.com(\/|$)/i,
  /(^|\.)sel4\.systems(\/|$)/i,
  /(^|\.)sigops\.org(\/|$)/i,
  /(^|\.)usenix\.org(\/|$)/i,
  /(^|\.)modelcontextprotocol\.info(\/|$)/i,
  /(^|\.)microsoft\.com(\/|$)/i,
  /(^|\.)developer\.microsoft\.com(\/|$)/i,
  // AI-security analyst + practitioner blogs
  /(^|\.)replyant\.com(\/|$)/i,
  /(^|\.)winbuzzer\.com(\/|$)/i,
  /(^|\.)wraith\.sh(\/|$)/i,
  /(^|\.)securityelites\.com(\/|$)/i,
  /(^|\.)blog\.alexewerlof\.com(\/|$)/i,
  /(^|\.)alexewerlof\.com(\/|$)/i,
  /(^|\.)appropri8\.com(\/|$)/i,
  /(^|\.)safeguard\.sh(\/|$)/i,
  /(^|\.)permit\.io(\/|$)/i,
  /(^|\.)agent\.security(\/|$)/i,
  /(^|\.)reflect\.run(\/|$)/i,
  /(^|\.)chikuwa\.it(\/|$)/i,
  // Capability + security history blogs
  /(^|\.)spritely\.community(\/|$)/i,
  /(^|\.)foresight\.org(\/|$)/i,
  /(^|\.)norhardy\.com(\/|$)/i,
  // Secure-OS + research lab analyst commentary
  /(^|\.)cprover\.org(\/|$)/i,
  /(^|\.)dafny\.org(\/|$)/i,
  /(^|\.)leanprover\.github\.io(\/|$)/i,
  /(^|\.)verus-lang\.org(\/|$)/i,
  /(^|\.)hax-rs\.github\.io(\/|$)/i,
  /(^|\.)kani-verifier\.org(\/|$)/i,
  // Cybersecurity trade press
  /(^|\.)darkreading\.com(\/|$)/i,
  /(^|\.)threatpost\.com(\/|$)/i,
  /(^|\.)scmagazine\.com(\/|$)/i,
  /(^|\.)bleepingcomputer\.com(\/|$)/i,
  /(^|\.)krebsonsecurity\.com(\/|$)/i,
  /(^|\.)thehackernews\.com(\/|$)/i,
  /(^|\.)scopely\.com(\/|$)/i,
  /(^|\.)troyhunt\.com(\/|$)/i,
  /(^|\.)portswigger\.net(\/|$)/i,
  /(^|\.)tldrsec\.com(\/|$)/i,
];

const MARKETPLACE_AMAZON_SELLER_PRIMARY_PATTERNS: RegExp[] = [
  // Amazon corporate / Seller Central / Brand Services / Selling Partners
  /(^|\.)amazon\.com(\/|$)/i,
  /(^|\.)sellercentral\.amazon\.com(\/|$)/i,
  /(^|\.)sell\.amazon\.com(\/|$)/i,
  /(^|\.)brandservices\.amazon\.com(\/|$)/i,
  /(^|\.)sellingpartners\.aboutamazon\.com(\/|$)/i,
  /(^|\.)cdn-sellingpartners\.aboutamazon\.com(\/|$)/i,
  /(^|\.)aboutamazon\.com(\/|$)/i,
  /(^|\.)go\.amazonsellerservices\.com(\/|$)/i,
  /(^|\.)amazonsellerservices\.com(\/|$)/i,
  // Amazon-aggregator + research-tool corporate sites (vendor primary disclosures)
  /(^|\.)helium10\.com(\/|$)/i,
  /(^|\.)junglescout\.com(\/|$)/i,
  /(^|\.)smartscout\.com(\/|$)/i,
  /(^|\.)pacvue\.com(\/|$)/i,
  /(^|\.)assembly\.com(\/|$)/i,
  /(^|\.)carbon6\.io(\/|$)/i,
  /(^|\.)threecolts\.com(\/|$)/i,
  /(^|\.)spscommerce\.com(\/|$)/i,
  /(^|\.)marketplacepulse\.com(\/|$)/i,
  /(^|\.)sellerlabs\.com(\/|$)/i,
  /(^|\.)sellerboard\.com(\/|$)/i,
  /(^|\.)keepa\.com(\/|$)/i,
  // 3PL + prep service vendor primaries
  /(^|\.)amzprep\.com(\/|$)/i,
  /(^|\.)goatconsulting\.com(\/|$)/i,
  /(^|\.)deliverr\.com(\/|$)/i,
  /(^|\.)shipbob\.com(\/|$)/i,
  /(^|\.)shipmonk\.com(\/|$)/i,
  /(^|\.)shipnetwork\.com(\/|$)/i,
];

const MARKETPLACE_AMAZON_SELLER_SECONDARY_PATTERNS: RegExp[] = [
  // Amazon-seller legal firms + compliance practitioner blogs
  /(^|\.)amazonsellerslawyer\.com(\/|$)/i,
  /(^|\.)amazonsellers\.attorney(\/|$)/i,
  /(^|\.)traverselegal\.com(\/|$)/i,
  /(^|\.)damlawfirm\.com(\/|$)/i,
  /(^|\.)dickinson-wright\.com(\/|$)/i,
  /(^|\.)intellectualproperty\.dickinson-wright\.com(\/|$)/i,
  /(^|\.)brandenforcementlaw\.com(\/|$)/i,
  // AI-native compliance vendor blogs
  /(^|\.)appealcraft\.ai(\/|$)/i,
  /(^|\.)ave7lift\.ai(\/|$)/i,
  /(^|\.)blogs\.ave7lift\.ai(\/|$)/i,
  /(^|\.)sellersumbrella\.com(\/|$)/i,
  /(^|\.)sequencecommerce\.com(\/|$)/i,
  /(^|\.)riverbendconsulting\.com(\/|$)/i,
  /(^|\.)mythosagency\.com(\/|$)/i,
  // Amazon trade press + analyst blogs
  /(^|\.)jordiob\.com(\/|$)/i,
  /(^|\.)linkmybooks\.com(\/|$)/i,
  /(^|\.)tamebay\.com(\/|$)/i,
  /(^|\.)channelx\.world(\/|$)/i,
  /(^|\.)ecommercebytes\.com(\/|$)/i,
  /(^|\.)retailwire\.com(\/|$)/i,
  /(^|\.)retaildive\.com(\/|$)/i,
  /(^|\.)moderretail\.com(\/|$)/i,
  /(^|\.)digitalcommerce360\.com(\/|$)/i,
  // Funding databases (already partly covered)
  /(^|\.)owler\.com(\/|$)/i,
  /(^|\.)crunchbase\.com(\/|$)/i,
];

const MULTIFAMILY_PROPMGMT_PRIMARY_PATTERNS: RegExp[] = [
  // Multifamily/SFR REITs + operators (corporate + SEC + IR)
  /(^|\.)invitationhomes\.com(\/|$)/i,
  /(^|\.)amh\.com(\/|$)/i,
  /(^|\.)triconresidential\.com(\/|$)/i,
  /(^|\.)avalonbay\.com(\/|$)/i,
  /(^|\.)equityapartments\.com(\/|$)/i,
  /(^|\.)maac\.com(\/|$)/i,
  /(^|\.)greystar\.com(\/|$)/i,
  /(^|\.)morganproperties\.com(\/|$)/i,
  /(^|\.)cortland\.com(\/|$)/i,
  /(^|\.)related\.com(\/|$)/i,
  /(^|\.)quarterra\.com(\/|$)/i,
  /(^|\.)monarchinvestment\.com(\/|$)/i,
  /(^|\.)bozzuto\.com(\/|$)/i,
  /(^|\.)venterraliving\.com(\/|$)/i,
  // Third-party PM operators
  /(^|\.)cushwakeliving\.com(\/|$)/i,
  /(^|\.)cushmanwakefield\.com(\/|$)/i,
  /(^|\.)fsresidential\.com(\/|$)/i,
  /(^|\.)firstservicecorp\.com(\/|$)/i,
  /(^|\.)willowbridgepc\.com(\/|$)/i,
  // Multifamily AI vendors corporate (front-of-house + fraud + collections)
  /(^|\.)snappt\.com(\/|$)/i,
  /(^|\.)knockcrm\.com(\/|$)/i,
  /(^|\.)leasehawk\.com(\/|$)/i,
  /(^|\.)colleen\.ai(\/|$)/i,
  /(^|\.)funnel\.com(\/|$)/i,
  /(^|\.)funnelleasing\.com(\/|$)/i,
  /(^|\.)showmojo\.com(\/|$)/i,
  /(^|\.)anyone\.com(\/|$)/i,
  /(^|\.)flexliving\.com(\/|$)/i,
  /(^|\.)getflex\.com(\/|$)/i,
  // Smart-home + property hardware vendors
  /(^|\.)butterflymx\.com(\/|$)/i,
  /(^|\.)latch\.com(\/|$)/i,
  /(^|\.)door\.com(\/|$)/i,
  /(^|\.)brivo\.com(\/|$)/i,
  /(^|\.)alarm\.com(\/|$)/i,
  /(^|\.)assaabloy\.com(\/|$)/i,
  /(^|\.)resideo\.com(\/|$)/i,
  /(^|\.)sightplan\.com(\/|$)/i,
  /(^|\.)residentiq\.com(\/|$)/i,
  // SMB PMS vendors (corporate + pricing pages are primary issuer disclosures)
  /(^|\.)doorloop\.com(\/|$)/i,
  /(^|\.)tenantcloud\.com(\/|$)/i,
  /(^|\.)avail\.co(\/|$)/i,
  /(^|\.)turbotenant\.com(\/|$)/i,
  /(^|\.)innago\.com(\/|$)/i,
  /(^|\.)stessa\.com(\/|$)/i,
  /(^|\.)hemlane\.com(\/|$)/i,
  /(^|\.)rentredi\.com(\/|$)/i,
  /(^|\.)leaserunner\.com(\/|$)/i,
  /(^|\.)rentec\.com(\/|$)/i,
  /(^|\.)rentecdirect\.com(\/|$)/i,
  /(^|\.)propertyware\.com(\/|$)/i,
  /(^|\.)resman\.com(\/|$)/i,
  /(^|\.)rentmanager\.com(\/|$)/i,
  /(^|\.)rentmaximizer\.com(\/|$)/i,
  // Compliance / regulatory primary
  /(^|\.)caanet\.org(\/|$)/i,
  /(^|\.)nationaltenantauthority\.com(\/|$)/i,
  /(^|\.)fhfca\.org(\/|$)/i,
  /(^|\.)leginfo\.legislature\.ca\.gov(\/|$)/i,
  /(^|\.)housing\.lacity\.gov(\/|$)/i,
  /(^|\.)dhcd\.dc\.gov(\/|$)/i,
  /(^|\.)oregon\.gov(\/|$)/i,
  /(^|\.)hcr\.ny\.gov(\/|$)/i,
  /(^|\.)hudexchange\.info(\/|$)/i,
  // Investor data primary (PR distributors + SEC EDGAR)
  /(^|\.)businesswire\.com(\/|$)/i,
  /(^|\.)prnewswire\.com(\/|$)/i,
  /(^|\.)globenewswire\.com(\/|$)/i,
  /(^|\.)q4cdn\.com(\/|$)/i,
  // VC/PE primary (Sapphire + Insight + Hercules + Fifth Wall + Madrona + Wilshire Lane + Navitas + Koch + JLL Spark)
  /(^|\.)sapphireventures\.com(\/|$)/i,
  /(^|\.)insightpartners\.com(\/|$)/i,
  /(^|\.)htgc\.com(\/|$)/i,
  /(^|\.)herculescapital\.com(\/|$)/i,
  /(^|\.)fifthwall\.com(\/|$)/i,
  /(^|\.)madrona\.com(\/|$)/i,
  /(^|\.)navitascap\.com(\/|$)/i,
  /(^|\.)kochrealestate\.com(\/|$)/i,
  /(^|\.)spark\.jll\.com(\/|$)/i,
  /(^|\.)wilshirelanecap\.com(\/|$)/i,
  /(^|\.)wilshirelanecapital\.com(\/|$)/i,
];

const MULTIFAMILY_PROPMGMT_SECONDARY_PATTERNS: RegExp[] = [
  // Multifamily / housing trade press
  /(^|\.)multifamilyexecutive\.com(\/|$)/i,
  /(^|\.)multifamilydive\.com(\/|$)/i,
  /(^|\.)multihousingnews\.com(\/|$)/i,
  /(^|\.)multifamilybiz\.com(\/|$)/i,
  /(^|\.)globest\.com(\/|$)/i,
  /(^|\.)commercialobserver\.com(\/|$)/i,
  /(^|\.)bisnow\.com(\/|$)/i,
  /(^|\.)inman\.com(\/|$)/i,
  /(^|\.)crenews\.com(\/|$)/i,
  /(^|\.)connectcre\.com(\/|$)/i,
  /(^|\.)citybiz\.co(\/|$)/i,
  /(^|\.)jayparsons\.com(\/|$)/i,
  /(^|\.)therealdeal\.com(\/|$)/i,
  /(^|\.)wolfstreet\.com(\/|$)/i,
  // Real estate research + analyst houses
  /(^|\.)capright\.com(\/|$)/i,
  /(^|\.)hl\.com(\/|$)/i,
  /(^|\.)cdn\.hl\.com(\/|$)/i,
  /(^|\.)chandan\.com(\/|$)/i,
  /(^|\.)costar\.com(\/|$)/i,
  /(^|\.)yardimatrix\.com(\/|$)/i,
  /(^|\.)cbre\.com(\/|$)/i,
  /(^|\.)jll\.com(\/|$)/i,
  /(^|\.)realpageanalytics\.com(\/|$)/i,
  // PE-watch / antitrust + accountability
  /(^|\.)pestakeholder\.org(\/|$)/i,
  /(^|\.)privateequitystakeholder\.org(\/|$)/i,
  /(^|\.)propublica\.org(\/|$)/i,
  // Stock + market-cap analytics
  /(^|\.)stockanalysis\.com(\/|$)/i,
  /(^|\.)koalagains\.com(\/|$)/i,
  /(^|\.)weissratings\.com(\/|$)/i,
  // SaaS pricing + comparison sites for PMS
  /(^|\.)vendr\.com(\/|$)/i,
  /(^|\.)bcsolut\.com(\/|$)/i,
  /(^|\.)softwaresuggest\.com(\/|$)/i,
  /(^|\.)spotsaas\.com(\/|$)/i,
  /(^|\.)getapp\.com(\/|$)/i,
  /(^|\.)trustradius\.com(\/|$)/i,
  // Funding databases / startup news
  /(^|\.)parsers\.vc(\/|$)/i,
  /(^|\.)pulse2\.com(\/|$)/i,
  /(^|\.)pulse2\.0\.com(\/|$)/i,
  /(^|\.)techcompanynews\.com(\/|$)/i,
  /(^|\.)finsmes\.com(\/|$)/i,
  // Distress + bankruptcy news
  /(^|\.)distressedpro\.com(\/|$)/i,
  // Law firms + regulatory commentary
  /(^|\.)cooley\.com(\/|$)/i,
  /(^|\.)gibsondunn\.com(\/|$)/i,
  /(^|\.)ropesgray\.com(\/|$)/i,
  /(^|\.)skadden\.com(\/|$)/i,
];

const THERAPIST_AI_SCRIBE_PRIMARY_PATTERNS: RegExp[] = [
  // AI scribe vendors corporate / IR
  /(^|\.)mentalyc\.com(\/|$)/i,
  /(^|\.)trytwofold\.com(\/|$)/i,
  /(^|\.)twofoldhealth\.com(\/|$)/i,
  /(^|\.)upheal\.io(\/|$)/i,
  /(^|\.)blueprint\.ai(\/|$)/i,
  /(^|\.)blueprint-health\.com(\/|$)/i,
  /(^|\.)eleos\.health(\/|$)/i,
  /(^|\.)freed\.ai(\/|$)/i,
  /(^|\.)athelas\.com(\/|$)/i,
  /(^|\.)berries\.health(\/|$)/i,
  /(^|\.)deepcura\.com(\/|$)/i,
  /(^|\.)joinheard\.com(\/|$)/i,
  /(^|\.)heard\.com(\/|$)/i,
  /(^|\.)heardtech\.com(\/|$)/i,
  // EHR vendors corporate
  /(^|\.)simplepractice\.com(\/|$)/i,
  /(^|\.)support\.simplepractice\.com(\/|$)/i,
  /(^|\.)therapynotes\.com(\/|$)/i,
  /(^|\.)jane\.app(\/|$)/i,
  /(^|\.)sessionshealth\.com(\/|$)/i,
  /(^|\.)icanotes\.com(\/|$)/i,
  /(^|\.)theranest\.com(\/|$)/i,
  /(^|\.)valant\.io(\/|$)/i,
  /(^|\.)practicebetter\.io(\/|$)/i,
  /(^|\.)kareo\.com(\/|$)/i,
  /(^|\.)nextgen\.com(\/|$)/i,
  /(^|\.)advancedmd\.com(\/|$)/i,
  // Network/platform corporate
  /(^|\.)headway\.co(\/|$)/i,
  /(^|\.)sondermind\.com(\/|$)/i,
  /(^|\.)alma\.com(\/|$)/i,
  /(^|\.)helloalma\.com(\/|$)/i,
  /(^|\.)growtherapy\.com(\/|$)/i,
  /(^|\.)rula\.com(\/|$)/i,
  /(^|\.)talkspace\.com(\/|$)/i,
  /(^|\.)betterhelp\.com(\/|$)/i,
  /(^|\.)spring\.health(\/|$)/i,
  /(^|\.)ableto\.com(\/|$)/i,
  /(^|\.)openloop\.com(\/|$)/i,
  // Professional associations (primary issuer of membership data)
  /(^|\.)aamft\.org(\/|$)/i,
  /(^|\.)apa\.org(\/|$)/i,
  /(^|\.)connectguide\.apa\.org(\/|$)/i,
  /(^|\.)socialworkers\.org(\/|$)/i,
  /(^|\.)counseling\.org(\/|$)/i,
  /(^|\.)nbcc\.org(\/|$)/i,
  /(^|\.)amftrb\.org(\/|$)/i,
  /(^|\.)aappp\.org(\/|$)/i,
  /(^|\.)aapc\.org(\/|$)/i,
  /(^|\.)aatbs\.com(\/|$)/i,
  // Federal agencies + regulators (HHS, SAMHSA, CMS, BLS, ecfr already covered in default PRIMARY but reinforce)
  /(^|\.)samhsa\.gov(\/|$)/i,
  /(^|\.)nimh\.nih\.gov(\/|$)/i,
  /(^|\.)data\.bls\.gov(\/|$)/i,
  /(^|\.)akaprod-www\.hhs\.gov(\/|$)/i,
  /(^|\.)careeronestop\.org(\/|$)/i,
  // VC + investor primary publications on portfolio cos
  /(^|\.)ensemble\.vc(\/|$)/i,
  /(^|\.)footwork\.vc(\/|$)/i,
  /(^|\.)summitpartners\.com(\/|$)/i,
  /(^|\.)spark\.capital(\/|$)/i,
  /(^|\.)thrivecap\.com(\/|$)/i,
  /(^|\.)f-prime\.com(\/|$)/i,
  /(^|\.)eightroads\.com(\/|$)/i,
  /(^|\.)menlovc\.com(\/|$)/i,
  /(^|\.)greenfield\.com(\/|$)/i,
  /(^|\.)amoonfund\.com(\/|$)/i,
  /(^|\.)loolventures\.com(\/|$)/i,
  /(^|\.)berkeleyskydeck\.com(\/|$)/i,
];

const THERAPIST_AI_SCRIBE_SECONDARY_PATTERNS: RegExp[] = [
  // Behavioral health trade press
  /(^|\.)bhbusiness\.com(\/|$)/i,
  /(^|\.)beckersbehavioralhealth\.com(\/|$)/i,
  /(^|\.)beckershospitalreview\.com(\/|$)/i,
  /(^|\.)mobihealthnews\.com(\/|$)/i,
  /(^|\.)firstwordhealthtech\.com(\/|$)/i,
  /(^|\.)healthtechmagazines\.com(\/|$)/i,
  /(^|\.)hitconsultant\.net(\/|$)/i,
  /(^|\.)hitconsultant\.com(\/|$)/i,
  /(^|\.)medcitynews\.com(\/|$)/i,
  /(^|\.)healthcareitnews\.com(\/|$)/i,
  /(^|\.)healthcaredive\.com(\/|$)/i,
  /(^|\.)fiercehealthcare\.com(\/|$)/i,
  // Funding databases / company profiles
  /(^|\.)finsmes\.com(\/|$)/i,
  /(^|\.)geekwire\.com(\/|$)/i,
  // Therapy-vendor blogs (peer review of competitors)
  /(^|\.)awesomeagents\.ai(\/|$)/i,
  /(^|\.)commure\.com(\/|$)/i,
  /(^|\.)leveragerx\.com(\/|$)/i,
  // EHR comparison sites
  /(^|\.)ehrinsider\.com(\/|$)/i,
  /(^|\.)ehrsource\.com(\/|$)/i,
  /(^|\.)softwareadvice\.com(\/|$)/i,
  /(^|\.)capterra\.com(\/|$)/i,
  /(^|\.)g2\.com(\/|$)/i,
  // CPT / billing trade press
  /(^|\.)medsolercm\.com(\/|$)/i,
  /(^|\.)neolytix\.com(\/|$)/i,
  /(^|\.)behavehealth\.com(\/|$)/i,
  /(^|\.)medfeeschedule\.com(\/|$)/i,
  /(^|\.)drherz\.us(\/|$)/i,
  /(^|\.)psychotherapynotes\.com(\/|$)/i,
  /(^|\.)apaservices\.org(\/|$)/i,
  // Healthcare law firms / regulatory commentary
  /(^|\.)crowell\.com(\/|$)/i,
  /(^|\.)hhcs\.org(\/|$)/i,
  /(^|\.)samhsa-gov\.org(\/|$)/i,
  // Mental-health-vertical newsletters
  /(^|\.)moderntherapist\.com(\/|$)/i,
  /(^|\.)psychotherapyacademy\.org(\/|$)/i,
];

const LOCAL_SERVICE_AGGREGATORS_PRIMARY_PATTERNS: RegExp[] = [
  // FSM SaaS corporate / IR
  /(^|\.)servicetitan\.com(\/|$)/i,
  /(^|\.)investors\.servicetitan\.com(\/|$)/i,
  /(^|\.)ir\.servicetitan\.com(\/|$)/i,
  /(^|\.)housecallpro\.com(\/|$)/i,
  /(^|\.)getjobber\.com(\/|$)/i,
  /(^|\.)workiz\.com(\/|$)/i,
  /(^|\.)fieldedge\.com(\/|$)/i,
  /(^|\.)servicefusion\.com(\/|$)/i,
  /(^|\.)fieldroutes\.com(\/|$)/i,
  // PE / IB corporate (sponsor publications on portfolio companies are primary issuer disclosures)
  /(^|\.)apax\.com(\/|$)/i,
  /(^|\.)blackstone\.com(\/|$)/i,
  /(^|\.)kkr\.com(\/|$)/i,
  /(^|\.)harvestpartners\.com(\/|$)/i,
  /(^|\.)alpineinvestors\.com(\/|$)/i,
  /(^|\.)alpine-investors\.com(\/|$)/i,
  /(^|\.)summitpartners\.com(\/|$)/i,
  /(^|\.)leadedge\.com(\/|$)/i,
  /(^|\.)permira\.com(\/|$)/i,
  /(^|\.)generalatlantic\.com(\/|$)/i,
  /(^|\.)leonardgreen\.com(\/|$)/i,
  /(^|\.)goldmansachs\.com(\/|$)/i,
  /(^|\.)gs\.com(\/|$)/i,
  /(^|\.)baincapital\.com(\/|$)/i,
  /(^|\.)mubadala\.com(\/|$)/i,
  /(^|\.)americansecurities\.com(\/|$)/i,
  /(^|\.)odysseyinvestment\.com(\/|$)/i,
  /(^|\.)oakhillcapital\.com(\/|$)/i,
  /(^|\.)tsgconsumer\.com(\/|$)/i,
  /(^|\.)gryphoninvestors\.com(\/|$)/i,
  /(^|\.)skyknightcapital\.com(\/|$)/i,
  /(^|\.)ares\.com(\/|$)/i,
  /(^|\.)riversidecompany\.com(\/|$)/i,
  /(^|\.)roarkcapital\.com(\/|$)/i,
  /(^|\.)hl\.com(\/|$)/i,
  // PE-backed roll-up / franchise platform corporate
  /(^|\.)apexservicepartners\.com(\/|$)/i,
  /(^|\.)wrenchgroup\.com(\/|$)/i,
  /(^|\.)silaservices\.com(\/|$)/i,
  /(^|\.)championsgroup\.com(\/|$)/i,
  /(^|\.)servicelogic\.com(\/|$)/i,
  /(^|\.)oriongroupholdings\.com(\/|$)/i,
  /(^|\.)oriongrp\.com(\/|$)/i,
  /(^|\.)firstcallmechanical\.com(\/|$)/i,
  /(^|\.)southernhomeservices\.com(\/|$)/i,
  /(^|\.)coolsysinc\.com(\/|$)/i,
  /(^|\.)authoritybrands\.com(\/|$)/i,
  /(^|\.)neighborly\.com(\/|$)/i,
  /(^|\.)neighborlybrands\.com(\/|$)/i,
  /(^|\.)premiumservicebrands\.com(\/|$)/i,
  /(^|\.)servpro\.com(\/|$)/i,
  /(^|\.)belfor\.com(\/|$)/i,
  /(^|\.)servicemasterbrands\.com(\/|$)/i,
  /(^|\.)rotorooter\.com(\/|$)/i,
  /(^|\.)chemed\.com(\/|$)/i,
  // Marketplaces corporate / IR
  /(^|\.)yelp\.com(\/|$)/i,
  /(^|\.)business\.yelp\.com(\/|$)/i,
  /(^|\.)yelp-ir\.com(\/|$)/i,
  /(^|\.)angi\.com(\/|$)/i,
  /(^|\.)thumbtack\.com(\/|$)/i,
  /(^|\.)porchgroup\.com(\/|$)/i,
  /(^|\.)homeadvisor\.com(\/|$)/i,
  /(^|\.)frontdoor\.com(\/|$)/i,
  // AI vision corporate
  /(^|\.)tractable\.ai(\/|$)/i,
  /(^|\.)cccis\.com(\/|$)/i,
  /(^|\.)prod\.cccis\.com(\/|$)/i,
  /(^|\.)ir\.cccis\.com(\/|$)/i,
  // State-level contractor licensing regulators (federal already in default PRIMARY_PATTERNS)
  /(^|\.)cslb\.ca\.gov(\/|$)/i,
  /(^|\.)web\.cslb\.ca\.gov(\/|$)/i,
  /(^|\.)www2\.cslb\.ca\.gov(\/|$)/i,
  /(^|\.)tdlr\.texas\.gov(\/|$)/i,
  /(^|\.)dshs\.texas\.gov(\/|$)/i,
  /(^|\.)dbpr\.state\.fl\.us(\/|$)/i,
  /(^|\.)myfloridalicense\.com(\/|$)/i,
  /(^|\.)dcwp\.nyc\.gov(\/|$)/i,
  /(^|\.)nyc\.gov(\/|$)/i,
  /(^|\.)dol\.ny\.gov(\/|$)/i,
  // Press wires (treated as primary because they re-publish issuer text verbatim)
  /(^|\.)businesswire\.com(\/|$)/i,
  /(^|\.)prnewswire\.com(\/|$)/i,
  /(^|\.)globenewswire\.com(\/|$)/i,
];

const LOCAL_SERVICE_AGGREGATORS_SECONDARY_PATTERNS: RegExp[] = [
  // Analyst / market-sizing firms
  /(^|\.)mordorintelligence\.com(\/|$)/i,
  /(^|\.)giiresearch\.com(\/|$)/i,
  /(^|\.)researchandmarkets\.com(\/|$)/i,
  /(^|\.)marketdataenterprises\.com(\/|$)/i,
  /(^|\.)nationalhomeservicesauthority\.com(\/|$)/i,
  /(^|\.)homeguild\.ai(\/|$)/i,
  /(^|\.)kpmg\.com(\/|$)/i,
  /(^|\.)deloitte\.com(\/|$)/i,
  /(^|\.)ey\.com(\/|$)/i,
  /(^|\.)pwc\.com(\/|$)/i,
  /(^|\.)mckinsey\.com(\/|$)/i,
  /(^|\.)bain\.com(\/|$)/i,
  /(^|\.)bcg\.com(\/|$)/i,
  // M&A databases / sponsor research / IB blogs
  /(^|\.)privsource\.com(\/|$)/i,
  /(^|\.)privatemarketsminute\.com(\/|$)/i,
  /(^|\.)ctacquisitions\.com(\/|$)/i,
  /(^|\.)theadvisoryib\.com(\/|$)/i,
  /(^|\.)talk24\.ai(\/|$)/i,
  /(^|\.)lightningpathpartners\.com(\/|$)/i,
  /(^|\.)peprofessional\.com(\/|$)/i,
  /(^|\.)pehub\.com(\/|$)/i,
  /(^|\.)pe-insights\.com(\/|$)/i,
  /(^|\.)privateequityinternational\.com(\/|$)/i,
  /(^|\.)mergr\.com(\/|$)/i,
  /(^|\.)mergermarket\.com(\/|$)/i,
  /(^|\.)mergerlinks\.com(\/|$)/i,
  /(^|\.)craftflow\.com(\/|$)/i,
  /(^|\.)houlihanlokey\.com(\/|$)/i,
  /(^|\.)capstonepartners\.com(\/|$)/i,
  /(^|\.)dubinclark\.com(\/|$)/i,
  /(^|\.)gfdata\.com(\/|$)/i,
  // Trade press (HVAC / plumbing / electrical / restoration)
  /(^|\.)randrmagonline\.com(\/|$)/i,
  /(^|\.)hvacinsider\.com(\/|$)/i,
  /(^|\.)achrnews\.com(\/|$)/i,
  /(^|\.)contractormag\.com(\/|$)/i,
  /(^|\.)pmengineer\.com(\/|$)/i,
  /(^|\.)plumbingperspective\.com(\/|$)/i,
  /(^|\.)reevesjournal\.com(\/|$)/i,
  /(^|\.)ecmag\.com(\/|$)/i,
  /(^|\.)tedmag\.com(\/|$)/i,
  /(^|\.)nrcaonline\.org(\/|$)/i,
  /(^|\.)roofingcontractor\.com(\/|$)/i,
  /(^|\.)cleanlink\.com(\/|$)/i,
  /(^|\.)cmmonline\.com(\/|$)/i,
  /(^|\.)isaa\.org(\/|$)/i,
  /(^|\.)cleaningandmaintenancemanagement\.com(\/|$)/i,
  // Lead-gen / marketplace trade press + research
  /(^|\.)leadgen-economy\.com(\/|$)/i,
  /(^|\.)leadtruffle\.co(\/|$)/i,
  /(^|\.)miracuves\.com(\/|$)/i,
  /(^|\.)geo\.sig\.ai(\/|$)/i,
  /(^|\.)beltstack\.com(\/|$)/i,
  /(^|\.)foundationinc\.co(\/|$)/i,
  // Law firms / regulatory commentary
  /(^|\.)dale\.legal(\/|$)/i,
  /(^|\.)haynesboone\.com(\/|$)/i,
  /(^|\.)foley\.com(\/|$)/i,
  /(^|\.)gibsondunn\.com(\/|$)/i,
  /(^|\.)mwe\.com(\/|$)/i,
  /(^|\.)kslaw\.com(\/|$)/i,
  /(^|\.)dlapiper\.com(\/|$)/i,
  /(^|\.)proskauer\.com(\/|$)/i,
  /(^|\.)littler\.com(\/|$)/i,
  /(^|\.)seyfarth\.com(\/|$)/i,
  /(^|\.)natlawreview\.com(\/|$)/i,
  /(^|\.)jdsupra\.com(\/|$)/i,
  /(^|\.)law360\.com(\/|$)/i,
  // PE firm corporate marketing / blog (treat as secondary — analyst-level commentary, not primary issuer disclosures)
  /(^|\.)neweracp\.com(\/|$)/i,
  /(^|\.)riverside\.com(\/|$)/i,
  // Yelp partner intelligence sites
  /(^|\.)reviewtrackers\.com(\/|$)/i,
];

const SECONDARY_PATTERNS: RegExp[] = [
  // Tier-1 general business + tech press
  /(^|\.)bloomberg\.com(\/|$)/i,
  /(^|\.)reuters\.com(\/|$)/i,
  /(^|\.)wsj\.com(\/|$)/i,
  /(^|\.)ft\.com(\/|$)/i,
  /(^|\.)nytimes\.com(\/|$)/i,
  /(^|\.)washingtonpost\.com(\/|$)/i,
  /(^|\.)economist\.com(\/|$)/i,
  /(^|\.)theatlantic\.com(\/|$)/i,
  /(^|\.)newyorker\.com(\/|$)/i,
  /(^|\.)techcrunch\.com(\/|$)/i,
  /(^|\.)theverge\.com(\/|$)/i,
  /(^|\.)wired\.com(\/|$)/i,
  /(^|\.)theinformation\.com(\/|$)/i,
  /(^|\.)fortune\.com(\/|$)/i,
  /(^|\.)forbes\.com(\/|$)/i,
  /(^|\.)businessinsider\.com(\/|$)/i,
  /(^|\.)cnbc\.com(\/|$)/i,
  /(^|\.)siliconangle\.com(\/|$)/i,
  /(^|\.)axios\.com(\/|$)/i,
  /(^|\.)protocol\.com(\/|$)/i,
  /(^|\.)stratechery\.com(\/|$)/i,
  /(^|\.)platformer\.news(\/|$)/i,
  // Funding + market data
  /(^|\.)crunchbase\.com(\/|$)/i,
  /(^|\.)pitchbook\.com(\/|$)/i,
  /(^|\.)tracxn\.com(\/|$)/i,
  /(^|\.)dealroom\.co(\/|$)/i,
  // Top-tier VC research / publications (treat as secondary — equity holders, not journalists)
  /(^|\.)a16z\.com(\/|$)/i,
  /(^|\.)sequoiacap\.com(\/|$)/i,
  /(^|\.)bessemer\.com(\/|$)/i,
  /(^|\.)bvp\.com(\/|$)/i,
  /(^|\.)greylock\.com(\/|$)/i,
  /(^|\.)kleinerperkins\.com(\/|$)/i,
  /(^|\.)benchmark\.com(\/|$)/i,
  /(^|\.)foundersfund\.com(\/|$)/i,
  /(^|\.)gv\.com(\/|$)/i,
  /(^|\.)indexventures\.com(\/|$)/i,
  /(^|\.)thrivecap\.com(\/|$)/i,
  /(^|\.)redpoint\.com(\/|$)/i,
  /(^|\.)ycombinator\.com(\/|$)/i,
  /(^|\.)blog\.ycombinator\.com(\/|$)/i,
  // Academic centers / labs (when not on .edu)
  /(^|\.)crfm\.stanford\.edu(\/|$)/i,
  /(^|\.)hai\.stanford\.edu(\/|$)/i,
  /(^|\.)csail\.mit\.edu(\/|$)/i,
  // Vertical trade press
  /(^|\.)agfundernews\.com(\/|$)/i,
  /(^|\.)agtechnavigator\.com(\/|$)/i,
  /(^|\.)hospitalitynet\.org(\/|$)/i,
  /(^|\.)phocuswire\.com(\/|$)/i,
  /(^|\.)skift\.com(\/|$)/i,
  /(^|\.)kitces\.com(\/|$)/i,
  /(^|\.)investmentnews\.com(\/|$)/i,
  /(^|\.)financial-planning\.com(\/|$)/i,
  /(^|\.)wealthmanagement\.com(\/|$)/i,
  /(^|\.)pymnts\.com(\/|$)/i,
  /(^|\.)hospitalitytech\.com(\/|$)/i,
  /(^|\.)achrnews\.com(\/|$)/i,
  /(^|\.)pmmag\.com(\/|$)/i,
  /(^|\.)ecmweb\.com(\/|$)/i,
  // Strategy + research firms
  /(^|\.)hbr\.org(\/|$)/i,
  /(^|\.)mckinsey\.com(\/|$)/i,
  /(^|\.)bcg\.com(\/|$)/i,
  /(^|\.)bain\.com(\/|$)/i,
  /(^|\.)deloitte\.com(\/|$)/i,
  /(^|\.)pwc\.com(\/|$)/i,
  /(^|\.)kpmg\.com(\/|$)/i,
  /(^|\.)ey\.com(\/|$)/i,
  /(^|\.)accenture\.com(\/|$)/i,
  /(^|\.)oliverwyman\.com(\/|$)/i,
  /(^|\.)rolandberger\.com(\/|$)/i,
  /(^|\.)gartner\.com(\/|$)/i,
  /(^|\.)forrester\.com(\/|$)/i,
  /(^|\.)idc\.com(\/|$)/i,
  /(^|\.)cbinsights\.com(\/|$)/i,
  // Cybersecurity + IT trade press
  /(^|\.)crn\.com(\/|$)/i,
  /(^|\.)darkreading\.com(\/|$)/i,
  /(^|\.)bleepingcomputer\.com(\/|$)/i,
  /(^|\.)scmagazine\.com(\/|$)/i,
  /(^|\.)securityweek\.com(\/|$)/i,
  /(^|\.)threatpost\.com(\/|$)/i,
  /(^|\.)thehackernews\.com(\/|$)/i,
  /(^|\.)cyberscoop\.com(\/|$)/i,
  /(^|\.)cybersecuritydive\.com(\/|$)/i,
  /(^|\.)securitybrief\.ca(\/|$)/i,
  /(^|\.)securitybrief\.com\.au(\/|$)/i,
  /(^|\.)securitybrief\.co\.nz(\/|$)/i,
  /(^|\.)securitybrief\.eu(\/|$)/i,
  /(^|\.)yahoo\.com(\/|$)/i,
  /(^|\.)finance\.yahoo\.com(\/|$)/i,
  /(^|\.)cnet\.com(\/|$)/i,
  /(^|\.)infosecurity-magazine\.com(\/|$)/i,
  /(^|\.)siliconrepublic\.com(\/|$)/i,
  /(^|\.)theregister\.com(\/|$)/i,
  /(^|\.)zdnet\.com(\/|$)/i,
  /(^|\.)computerworld\.com(\/|$)/i,
  /(^|\.)infoworld\.com(\/|$)/i,
  // CB-Insights / VC analyst publications
  /(^|\.)notablecap\.com(\/|$)/i,
  /(^|\.)cognitionhub\.com(\/|$)/i,
  /(^|\.)iris\.vc(\/|$)/i,
  // Reuters wire syndication (MarketScreener carries Reuters wires)
  /(^|\.)marketscreener\.com(\/|$)/i,
  // 1099 freelance finance vertical secondary press + analysts
  /(^|\.)avalara\.com(\/|$)/i,
  /(^|\.)www1\.avalara\.com(\/|$)/i,
  /(^|\.)investopedia\.com(\/|$)/i,
  /(^|\.)cpapracticeadvisor\.com(\/|$)/i,
  /(^|\.)withum\.com(\/|$)/i,
  /(^|\.)finsmes\.com(\/|$)/i,
  /(^|\.)betakit\.com(\/|$)/i,
  /(^|\.)fintechfutures\.com(\/|$)/i,
  /(^|\.)theaiinsider\.tech(\/|$)/i,
  /(^|\.)techcompanynews\.com(\/|$)/i,
  /(^|\.)thepaypers\.com(\/|$)/i,
  /(^|\.)techstartups\.com(\/|$)/i,
  /(^|\.)statista\.com(\/|$)/i,
  /(^|\.)messari\.io(\/|$)/i,
  /(^|\.)gate\.io(\/|$)/i,
  /(^|\.)seedtable\.com(\/|$)/i,
  /(^|\.)wbur\.org(\/|$)/i,
  /(^|\.)bostonglobe\.com(\/|$)/i,
  /(^|\.)nbcboston\.com(\/|$)/i,
  /(^|\.)boston\.com(\/|$)/i,
  /(^|\.)commonwealthbeacon\.org(\/|$)/i,
  /(^|\.)reason\.org(\/|$)/i,
  /(^|\.)secondtalent\.com(\/|$)/i,
  /(^|\.)finanzwire\.com(\/|$)/i,
  /(^|\.)accesswire\.com(\/|$)/i,
  /(^|\.)bestaitoolsforfinance\.com(\/|$)/i,
  /(^|\.)last10k\.com(\/|$)/i,
  /(^|\.)eaglerockcfo\.com(\/|$)/i,
  /(^|\.)tax1099\.com(\/|$)/i,
  /(^|\.)formpros\.com(\/|$)/i,
  /(^|\.)trpsumner\.com(\/|$)/i,
  /(^|\.)seilersingleton\.com(\/|$)/i,
  /(^|\.)en\.wikipedia\.org(\/|$)/i,
  /(^|\.)wikipedia\.org(\/|$)/i,
  /(^|\.)cspa\.tufts\.edu(\/|$)/i,
  /(^|\.)bankingdive\.com(\/|$)/i,
  /(^|\.)pymnts\.com(\/|$)/i,
  /(^|\.)natlawreview\.com(\/|$)/i,
  /(^|\.)wagehourblog\.com(\/|$)/i,
  /(^|\.)nolo\.com(\/|$)/i,
  /(^|\.)boomtax\.com(\/|$)/i,
  /(^|\.)serendiblaw\.com(\/|$)/i,
  /(^|\.)401kspecialistmag\.com(\/|$)/i,
  /(^|\.)startuphub\.ai(\/|$)/i,
  /(^|\.)reqodata\.com(\/|$)/i,
  /(^|\.)rocketreach\.co(\/|$)/i,
  /(^|\.)at\.linkedin\.com(\/|$)/i,
  /(^|\.)blog\.dustyhotz\.io(\/|$)/i,
  /(^|\.)everlance\.com(\/|$)/i,
  /(^|\.)onehealthplus\.com(\/|$)/i,
  /(^|\.)ten99health\.com(\/|$)/i,
  /(^|\.)freelancersunion\.org(\/|$)/i,
  /(^|\.)blog\.freelancersunion\.org(\/|$)/i,
  /(^|\.)sacra\.com(\/|$)/i,
  /(^|\.)alphatax\.com(\/|$)/i,
  /(^|\.)bluedun\.com(\/|$)/i,
  // Inc Magazine + Fast Company + Business Insider tier business press
  /(^|\.)inc\.com(\/|$)/i,
  /(^|\.)fastcompany\.com(\/|$)/i,
  // Sales / RevOps / Salesforce trade press
  /(^|\.)salesforceben\.com(\/|$)/i,
  /(^|\.)digitalcommerce360\.com(\/|$)/i,
  // Crunchbase News (in addition to crunchbase.com base)
  /(^|\.)news\.crunchbase\.com(\/|$)/i,
  // Spark Capital / VC firm portfolio pages
  /(^|\.)sparkcapital\.com(\/|$)/i,
  // Financial-news aggregators that carry primary Reuters/AP wires
  /(^|\.)inforcapital\.com(\/|$)/i,
  // Analyst-style sales/GTM blogs (cited at tertiary tier elsewhere; treat as secondary when used for category framing)
  /(^|\.)gtmlens\.com(\/|$)/i,
  // The Next Web (tier-1 tech press)
  /(^|\.)thenextweb\.com(\/|$)/i,
  // TechStartups (sector trade press)
  /(^|\.)techstartups\.com(\/|$)/i,
  // FinSMEs (M&A/funding tracker)
  /(^|\.)finsmes\.com(\/|$)/i,
  // Built In (named tech publication)
  /(^|\.)builtin\.com(\/|$)/i,
  // LA TechWatch (regional tech press)
  /(^|\.)latechwatch\.com(\/|$)/i,
  // The AI Insider (AI publication)
  /(^|\.)theaiinsider\.tech(\/|$)/i,
  // Field service / specialty trade vertical press
  /(^|\.)achrnews\.com(\/|$)/i,
  /(^|\.)hvac-insider\.com(\/|$)/i,
  /(^|\.)landscapemanagement\.net(\/|$)/i,
  /(^|\.)franchisetimes\.com(\/|$)/i,
  /(^|\.)pctonline\.com(\/|$)/i,
  /(^|\.)refrigerationschool\.com(\/|$)/i,
  // Industry research data providers
  /(^|\.)ibisworld\.com(\/|$)/i,
  /(^|\.)isg-one\.com(\/|$)/i,
  /(^|\.)landbase\.com(\/|$)/i,
  /(^|\.)sacra\.com(\/|$)/i,
  /(^|\.)getlatka\.com(\/|$)/i,
  /(^|\.)privsource\.com(\/|$)/i,
  /(^|\.)ct-acquisitions\.com(\/|$)/i,
  /(^|\.)home-service-hound\.com(\/|$)/i,
  /(^|\.)homeservicehound\.com(\/|$)/i,
  /(^|\.)homeservicemillionaire\.com(\/|$)/i,
  // Calcalist CTech (tier-1 international tech press)
  /(^|\.)calcalistech\.com(\/|$)/i,
  /(^|\.)calcalist\.co\.il(\/|$)/i,
  // Stock filing aggregators (Reuters wires)
  /(^|\.)stocktitan\.net(\/|$)/i,
  /(^|\.)last10k\.com(\/|$)/i,
  // Canaccord Genuity (financial advisor disclosures)
  /(^|\.)canaccordgenuity\.com(\/|$)/i,
  // Financial Post (Canadian Tier-1 trade)
  /(^|\.)financialpost\.com(\/|$)/i,
  // The AI Journal
  /(^|\.)aijourn\.com(\/|$)/i,
  // ABC Money (UK financial press)
  /(^|\.)abcmoney\.co\.uk(\/|$)/i,
  // VentureBeat
  /(^|\.)venturebeat\.com(\/|$)/i,
  // Property management trade press
  /(^|\.)multifamilydive\.com(\/|$)/i,
  /(^|\.)multifamilyexecutive\.com(\/|$)/i,
  /(^|\.)multifamilypress\.com(\/|$)/i,
  /(^|\.)bisnow\.com(\/|$)/i,
  /(^|\.)yieldpro\.com(\/|$)/i,
  /(^|\.)housingwire\.com(\/|$)/i,
  /(^|\.)seniorhousingnews\.com(\/|$)/i,
  /(^|\.)multifamily\.\w+(\/|$)/i,
  /(^|\.)multifamilybiz\.com(\/|$)/i,
  /(^|\.)nareit\.com(\/|$)/i,
  /(^|\.)builtinnyc\.com(\/|$)/i,
  /(^|\.)deseret\.com(\/|$)/i,
  // Funding aggregators (TexAu, Clay, StartupIntros, MergerLinks, GetLatka, Datanyze, iDataLabs, FinLedger, Realty Trends)
  /(^|\.)texau\.com(\/|$)/i,
  /(^|\.)clay\.com(\/|$)/i,
  /(^|\.)startupintros\.com(\/|$)/i,
  /(^|\.)mergerlinks\.com(\/|$)/i,
  /(^|\.)app\.mergerlinks\.com(\/|$)/i,
  /(^|\.)getlatka\.com(\/|$)/i,
  /(^|\.)datanyze\.com(\/|$)/i,
  /(^|\.)idatalabs\.com(\/|$)/i,
  /(^|\.)finledger\.com(\/|$)/i,
  /(^|\.)realtytrends\.co(\/|$)/i,
  /(^|\.)privsource\.com(\/|$)/i,
  /(^|\.)cbinsights\.com(\/|$)/i,
  // Market research firms (TAM and forecast publishers)
  /(^|\.)ibisworld\.com(\/|$)/i,
  /(^|\.)mordorintelligence\.com(\/|$)/i,
  /(^|\.)grandviewresearch\.com(\/|$)/i,
  /(^|\.)technavio\.com(\/|$)/i,
  /(^|\.)revenuememo\.com(\/|$)/i,
  // Insurance Journal (regulatory + class-action news)
  /(^|\.)insurancejournal\.com(\/|$)/i,
  // Cohen Milstein (plaintiffs' firm; secondary regulatory disclosure)
  /(^|\.)cohenmilstein\.com(\/|$)/i,
  /(^|\.)blog\.liebatlaw\.com(\/|$)/i,
  // Mental-health trade press
  /(^|\.)fiercehealthcare\.com(\/|$)/i,
  /(^|\.)mobihealthnews\.com(\/|$)/i,
  /(^|\.)statnews\.com(\/|$)/i,
  /(^|\.)beckersbehavioralhealth\.com(\/|$)/i,
  /(^|\.)thehemingwayreport\.com(\/|$)/i,
  /(^|\.)medcitynews\.com(\/|$)/i,
  /(^|\.)healthcareittoday\.com(\/|$)/i,
  /(^|\.)slice(of)?healthcare\.com(\/|$)/i,
  /(^|\.)sliceofhealthcare\.com(\/|$)/i,
  /(^|\.)behavioralhealthbusiness\.com(\/|$)/i,
  /(^|\.)psychcentral\.com(\/|$)/i,
  /(^|\.)reit\.com(\/|$)/i,
  // EHR comparison + analytics secondary press
  /(^|\.)ehrsource\.com(\/|$)/i,
  /(^|\.)ehrinsider\.com(\/|$)/i,
  /(^|\.)usecortexa\.com(\/|$)/i,
  /(^|\.)trysignalbase\.com(\/|$)/i,
  // Healthcare market research firms
  /(^|\.)bccresearch\.com(\/|$)/i,
  /(^|\.)healthcareforesights\.com(\/|$)/i,
  /(^|\.)marketintelo\.com(\/|$)/i,
  /(^|\.)futuremarketinsights\.com(\/|$)/i,
  /(^|\.)giiresearch\.com(\/|$)/i,
  /(^|\.)imarcgroup\.com(\/|$)/i,
  // Aggregators + SEC filing mirror sites
  /(^|\.)companiesmarketcap\.com(\/|$)/i,
  /(^|\.)techstartups\.com(\/|$)/i,
  /(^|\.)asiatechdaily\.com(\/|$)/i,
  /(^|\.)tracxn\.com(\/|$)/i,
  /(^|\.)pitchbook\.com(\/|$)/i,
  /(^|\.)sacra\.com(\/|$)/i,
  /(^|\.)growjo\.com(\/|$)/i,
];

export interface Reference {
  index: number;
  rawLine: string;
  url: string | null;
  domain: string | null;
  tier: Tier;
  classifyReason: string;
}

export interface ClaimSpan {
  type: "dollar" | "percent" | "named-funding" | "named-count";
  matchedText: string;
  surroundingContext: string;
  forwardDated: boolean;
  hasInlineCitation: boolean;
  citationIds: number[];
}

export function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function classifyTier(
  url: string | null,
  domain: string | null,
): { tier: Tier; reason: string } {
  if (!url || !domain) return { tier: "unknown", reason: "no parseable URL" };
  for (const re of PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `primary domain: ${domain}` };
  }
  for (const re of PROPERTY_MGMT_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `property-mgmt primary: ${domain}` };
  }
  for (const re of MENTAL_HEALTH_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `mental-health primary: ${domain}` };
  }
  for (const re of FREELANCE_FINANCE_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `freelance-finance primary: ${domain}` };
  }
  for (const re of MARKETPLACE_SELLER_OPS_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `marketplace-seller-ops primary: ${domain}` };
  }
  for (const re of PORTABLE_BENEFITS_LEGISLATION_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `portable-benefits-legislation primary: ${domain}` };
  }
  for (const re of CASTELLANOS_CLASSIFICATION_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `castellanos-classification primary: ${domain}` };
  }
  for (const re of SENIOR_CARE_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `senior-care primary: ${domain}` };
  }
  for (const re of DENTAL_OPS_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `dental-ops primary: ${domain}` };
  }
  for (const re of BOOTCAMP_CREDENTIALING_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `bootcamp-credentialing primary: ${domain}` };
  }
  for (const re of LOCAL_SERVICE_AGGREGATORS_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `local-service-aggregators primary: ${domain}` };
  }
  for (const re of THERAPIST_AI_SCRIBE_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `therapist-ai-scribe primary: ${domain}` };
  }
  for (const re of CONSTRUCTION_COMPLIANCE_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `construction-compliance primary: ${domain}` };
  }
  for (const re of MULTIFAMILY_PROPMGMT_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `multifamily-propmgmt primary: ${domain}` };
  }
  for (const re of MARKETPLACE_AMAZON_SELLER_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `marketplace-amazon-seller primary: ${domain}` };
  }
  for (const re of MCP_OAUTH_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: "domain:mcp-oauth-primary" };
  }
  for (const re of IDEMPOTENCY_ORCHESTRATION_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: "domain:idempotency-orchestration-primary" };
  }
  for (const re of FRIA_METHODOLOGY_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: "domain:fria-methodology-primary" };
  }
  for (const re of VENDOR_CONTRACT_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: "domain:vendor-contract-primary" };
  }
  for (const re of UNIFIED_GOVERNANCE_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: "domain:unified-governance-primary" };
  }
  for (const re of SPECIALIZED_JUDGE_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: "domain:specialized-judge-primary" };
  }
  for (const re of KNOWLEDGE_DISTILLATION_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: "domain:knowledge-distillation-primary" };
  }
  for (const re of EDGE_AI_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: "domain:edge-ai-primary" };
  }
  for (const re of GDPR_CCPA_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: "domain:gdpr-ccpa-primary" };
  }
  for (const re of AIBOM_SUPPLY_CHAIN_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: "domain:aibom-supply-chain-primary" };
  }
  for (const re of BROWSER_AGENT_SECURITY_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: "domain:browser-agent-security-primary" };
  }
  for (const re of CAPABILITY_AGENT_SECURITY_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: "domain:capability-agent-security-primary" };
  }
  for (const re of VIBECODING_PRACTITIONER_PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `vibecoding-practitioner primary: ${domain}` };
  }
  // Hoist topic-specific secondary domain matches above path-fragment heuristic
  // so that explicit secondary classification beats incidental "/resources/" matches.
  for (const re of MCP_OAUTH_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:mcp-oauth-secondary" };
  }
  for (const re of IDEMPOTENCY_ORCHESTRATION_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:idempotency-orchestration-secondary" };
  }
  for (const re of FRIA_METHODOLOGY_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:fria-methodology-secondary" };
  }
  for (const re of VENDOR_CONTRACT_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:vendor-contract-secondary" };
  }
  for (const re of UNIFIED_GOVERNANCE_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:unified-governance-secondary" };
  }
  for (const re of SPECIALIZED_JUDGE_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:specialized-judge-secondary" };
  }
  for (const re of KNOWLEDGE_DISTILLATION_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:knowledge-distillation-secondary" };
  }
  for (const re of EDGE_AI_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:edge-ai-secondary" };
  }
  for (const re of GDPR_CCPA_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:gdpr-ccpa-secondary" };
  }
  for (const re of AIBOM_SUPPLY_CHAIN_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:aibom-supply-chain-secondary" };
  }
  for (const re of BROWSER_AGENT_SECURITY_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:browser-agent-security-secondary" };
  }
  for (const re of CAPABILITY_AGENT_SECURITY_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:capability-agent-security-secondary" };
  }
  for (const fragment of PRIMARY_PATH_FRAGMENTS) {
    if (url.toLowerCase().includes(fragment)) {
      return { tier: "primary", reason: `primary path fragment: ${fragment}` };
    }
  }
  for (const re of MARKETPLACE_SELLER_OPS_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `marketplace-seller-ops secondary: ${domain}` };
  }
  for (const re of PORTABLE_BENEFITS_LEGISLATION_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `portable-benefits-legislation secondary: ${domain}` };
  }
  for (const re of CASTELLANOS_CLASSIFICATION_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `castellanos-classification secondary: ${domain}` };
  }
  for (const re of SENIOR_CARE_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `senior-care secondary: ${domain}` };
  }
  for (const re of DENTAL_OPS_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `dental-ops secondary: ${domain}` };
  }
  for (const re of BOOTCAMP_CREDENTIALING_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `bootcamp-credentialing secondary: ${domain}` };
  }
  for (const re of LOCAL_SERVICE_AGGREGATORS_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `local-service-aggregators secondary: ${domain}` };
  }
  for (const re of THERAPIST_AI_SCRIBE_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `therapist-ai-scribe secondary: ${domain}` };
  }
  for (const re of CONSTRUCTION_COMPLIANCE_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `construction-compliance secondary: ${domain}` };
  }
  for (const re of MULTIFAMILY_PROPMGMT_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `multifamily-propmgmt secondary: ${domain}` };
  }
  for (const re of FREELANCE_FINANCE_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `freelance-finance secondary: ${domain}` };
  }
  for (const re of MARKETPLACE_AMAZON_SELLER_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `marketplace-amazon-seller secondary: ${domain}` };
  }
  for (const re of CAPABILITY_AGENT_SECURITY_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: "domain:capability-agent-security-secondary" };
  }
  for (const re of VIBECODING_PRACTITIONER_SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `vibecoding-practitioner secondary: ${domain}` };
  }
  for (const re of SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `secondary domain: ${domain}` };
  }
  return { tier: "tertiary", reason: `unrecognized domain: ${domain}` };
}

function findReferencesSection(lines: string[]): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(/^#{1,3}\s+(References|Sources|Citations|Footnotes|Notes)\s*$/i);
    if (m) return i;
  }
  return -1;
}

export function extractReferences(body: string): {
  refs: Reference[];
  sectionStart: number;
} {
  const lines = body.split("\n");
  const refs: Reference[] = [];

  // Pass 1: footnote-definition syntax `[^N]: text URL`.
  const footnoteRe = /^\[\^([\w-]+)\]:\s+(.*)$/;
  let earliestFootnoteLine = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(footnoteRe);
    if (!m) continue;
    if (earliestFootnoteLine < 0) earliestFootnoteLine = i;
    const idStr = m[1];
    const idNum = /^\d+$/.test(idStr) ? parseInt(idStr, 10) : refs.length + 1;
    let rawLine = m[2];
    let j = i + 1;
    while (j < lines.length && /^\s{2,}\S/.test(lines[j])) {
      rawLine += " " + lines[j].trim();
      j++;
    }
    const urlMatch = rawLine.match(/https?:\/\/[^\s)]+/);
    const url = urlMatch ? urlMatch[0].replace(/[.,;:]+$/, "") : null;
    const domain = url ? extractDomain(url) : null;
    const { tier, reason } = classifyTier(url, domain);
    refs.push({ index: idNum, rawLine, url, domain, tier, classifyReason: reason });
  }
  if (refs.length > 0) return { refs, sectionStart: earliestFootnoteLine };

  // Pass 2: heading-delimited references list. Read all remaining lines (sub-
  // headings within are category labels, not section terminators).
  const sectionStart = findReferencesSection(lines);
  if (sectionStart < 0) return { refs: [], sectionStart: -1 };

  const refLines: string[] = [];
  for (let i = sectionStart + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^#{1,3}\s+/.test(line)) continue;
    if (line.trim().length > 0) refLines.push(line);
  }

  let currentRef: string[] = [];
  let currentIndex = 0;
  const flush = () => {
    if (currentRef.length === 0) return;
    const rawLine = currentRef.join(" ").trim();
    const urlMatch = rawLine.match(/https?:\/\/[^\s)]+/);
    const url = urlMatch ? urlMatch[0].replace(/[.,;:]+$/, "") : null;
    const domain = url ? extractDomain(url) : null;
    const { tier, reason } = classifyTier(url, domain);
    refs.push({ index: currentIndex, rawLine, url, domain, tier, classifyReason: reason });
    currentRef = [];
  };
  for (const line of refLines) {
    const numberedStart = line.match(/^\s*(\d+)\.\s+/);
    if (numberedStart) {
      flush();
      currentIndex = parseInt(numberedStart[1], 10);
      currentRef.push(line.replace(/^\s*\d+\.\s+/, ""));
    } else if (/^\s*[-*]\s+/.test(line)) {
      flush();
      currentIndex += 1;
      currentRef.push(line.replace(/^\s*[-*]\s+/, ""));
    } else {
      currentRef.push(line);
    }
  }
  flush();
  return { refs, sectionStart };
}

const CLAIM_PATTERNS: { type: ClaimSpan["type"]; pattern: RegExp }[] = [
  { type: "dollar", pattern: /\$[\d.,]+\s?(?:M|B|T|million|billion|trillion)\b/gi },
  { type: "percent", pattern: /\b\d+(?:\.\d+)?%/g },
  { type: "named-funding", pattern: /\bSeries\s[A-G]\b/g },
  {
    type: "named-count",
    pattern: /\b\d{1,3}(?:,\d{3})+\s+(?:customers|users|professionals|members|employees|contractors|advisors|hospitals|firms|institutions|locations|attendees|farms|stores|properties)\b/gi,
  },
];

function scanInlineCitation(ctx: string): {
  hasInlineCitation: boolean;
  citationIds: number[];
} {
  const ids = new Set<number>();
  for (const m of ctx.matchAll(/\[\^(\d+)\]/g)) ids.add(parseInt(m[1], 10));
  for (const m of ctx.matchAll(/\[(\d+)\](?!\()/g)) ids.add(parseInt(m[1], 10));
  return { hasInlineCitation: ids.size > 0, citationIds: [...ids] };
}

export function extractClaims(body: string, refsSectionStart: number): ClaimSpan[] {
  const lines = body.split("\n");
  const bodyOnly =
    refsSectionStart >= 0 ? lines.slice(0, refsSectionStart).join("\n") : body;
  const claims: ClaimSpan[] = [];
  const seen = new Set<string>();
  for (const { type, pattern } of CLAIM_PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(bodyOnly)) !== null) {
      const matchedText = m[0];
      const idx = m.index;
      const bucket = `${type}:${matchedText}:${Math.floor(idx / 200)}`;
      if (seen.has(bucket)) continue;
      seen.add(bucket);
      const ctx = bodyOnly.slice(Math.max(0, idx - 80), idx + matchedText.length + 80);
      const forwardDated = /\b20(?:2[6-9]|3\d)\b/.test(ctx);
      const { hasInlineCitation, citationIds } = scanInlineCitation(ctx);
      claims.push({
        type,
        matchedText,
        surroundingContext: ctx.replace(/\n+/g, " "),
        forwardDated,
        hasInlineCitation,
        citationIds,
      });
    }
  }
  return claims;
}

export interface ClaimAuditMetrics {
  refsTotal: number;
  refsByTier: Record<Tier, number>;
  refsWithUrl: number;
  primarySecondaryShare: number;
  tertiaryShare: number;
  claimsDetected: number;
  claimsCited: number;
  citationCoverage: number;
  forwardDatedClaims: number;
  forwardDatedUncited: number;
  orphanCitations: number[];
}

export function computeMetrics(refs: Reference[], claims: ClaimSpan[]): ClaimAuditMetrics {
  const refsByTier: Record<Tier, number> = {
    primary: 0,
    secondary: 0,
    tertiary: 0,
    unknown: 0,
  };
  for (const r of refs) refsByTier[r.tier]++;
  const refsWithUrl = refs.filter((r) => r.url).length;
  const refsTotal = refs.length;
  const primarySecondaryShare =
    refsTotal > 0 ? (refsByTier.primary + refsByTier.secondary) / refsTotal : 0;
  const tertiaryShare =
    refsTotal > 0 ? (refsByTier.tertiary + refsByTier.unknown) / refsTotal : 0;

  const claimsDetected = claims.length;
  const claimsCited = claims.filter((c) => c.hasInlineCitation).length;
  const citationCoverage = claimsDetected > 0 ? claimsCited / claimsDetected : 1;

  let forwardDatedUncited = 0;
  const refIndex = new Set(refs.map((r) => r.index));
  const orphanSet = new Set<number>();
  for (const c of claims) {
    if (!c.forwardDated) continue;
    if (c.citationIds.length === 0) {
      forwardDatedUncited++;
      continue;
    }
    const cited = c.citationIds.map((id) => refs.find((r) => r.index === id)).filter(Boolean);
    if (
      cited.length === 0 ||
      cited.every((r) => r!.tier === "tertiary" || r!.tier === "unknown")
    ) {
      forwardDatedUncited++;
    }
    for (const id of c.citationIds) {
      if (!refIndex.has(id)) orphanSet.add(id);
    }
  }
  const forwardDatedClaims = claims.filter((c) => c.forwardDated).length;

  return {
    refsTotal,
    refsByTier,
    refsWithUrl,
    primarySecondaryShare,
    tertiaryShare,
    claimsDetected,
    claimsCited,
    citationCoverage,
    forwardDatedClaims,
    forwardDatedUncited,
    orphanCitations: [...orphanSet],
  };
}

export interface VerifyGateResult {
  pass: boolean;
  failures: string[];
  metrics: ClaimAuditMetrics;
  profile: PaperProfile;
}

/**
 * Source-count quotas + word-count ceilings keyed off paper profile. The profile
 * is declared in frontmatter (`profile: authority-survey | field-manual |
 * technical-playbook | failure-mode | hedged`) and selects the verify-gate
 * thresholds.
 */
export type PaperProfile =
  | "authority-survey"
  | "field-manual"
  | "technical-playbook"
  | "failure-mode"
  | "hedged";

export interface ProfileQuotas {
  primaryMin: number;
  secondaryMin: number;
  tertiaryShareMax: number;          // tertiary+unknown / total
  primarySecondaryShareMin: number;  // primary+secondary / total
  citationCoverageMin: number;       // claimsCited / claimsDetected
  wordCeilingMultiplier: number;     // 1.0 = strict, >1 = lenient
  hedgedProseRequired: boolean;      // every numeric claim must be in attributed form
}

export const PROFILE_QUOTAS: Record<PaperProfile, ProfileQuotas> = {
  "authority-survey": {
    primaryMin: 30,
    secondaryMin: 20,
    tertiaryShareMax: 0.25,
    primarySecondaryShareMin: 0.65,
    citationCoverageMin: 0.85,
    wordCeilingMultiplier: 1.0,
    hedgedProseRequired: false,
  },
  "field-manual": {
    primaryMin: 25,
    secondaryMin: 15,
    tertiaryShareMax: 0.20,
    primarySecondaryShareMin: 0.60,
    citationCoverageMin: 0.80,
    wordCeilingMultiplier: 1.0,
    hedgedProseRequired: false,
  },
  "technical-playbook": {
    primaryMin: 20,
    secondaryMin: 15,
    tertiaryShareMax: 0.15,
    primarySecondaryShareMin: 0.65,
    citationCoverageMin: 0.80,
    wordCeilingMultiplier: 1.0,
    hedgedProseRequired: false,
  },
  "failure-mode": {
    primaryMin: 15,
    secondaryMin: 12,
    tertiaryShareMax: 0.20,
    primarySecondaryShareMin: 0.60,
    citationCoverageMin: 0.80,
    wordCeilingMultiplier: 1.0,
    hedgedProseRequired: false,
  },
  hedged: {
    primaryMin: 5,
    secondaryMin: 5,
    tertiaryShareMax: 0.50,
    primarySecondaryShareMin: 0.30,
    citationCoverageMin: 0.95,         // tightest — every claim must be cited
    wordCeilingMultiplier: 0.7,         // shorter papers
    hedgedProseRequired: true,           // every numeric claim must be in attributed prose form
  },
};

export function wordCeiling(metrics: ClaimAuditMetrics, profile: PaperProfile): number {
  const base =
    200 * metrics.refsByTier.primary +
    100 * metrics.refsByTier.secondary +
    50 * (metrics.refsByTier.tertiary + metrics.refsByTier.unknown);
  return Math.round(base * PROFILE_QUOTAS[profile].wordCeilingMultiplier);
}

/**
 * Detect whether the body uses hedged-prose pattern: "Per X, Y" / "Per X's
 * announcement," / "According to X" — i.e., the source is in the prose, not
 * orphaned in the footnote. Returns the share of forward-dated claims whose
 * surrounding context contains an attribution phrase.
 */
function hedgedProseShare(claims: ClaimSpan[]): number {
  const fwd = claims.filter((c) => c.forwardDated);
  if (fwd.length === 0) return 1;
  const attributionRe =
    /\b(per|according to|as reported by|reported by|announced by|filed by|cited by|via)\b/i;
  const attributed = fwd.filter((c) => attributionRe.test(c.surroundingContext)).length;
  return attributed / fwd.length;
}

/**
 * Layer 1+2 hard gate. Returns pass=false with failure list on any blocking issue.
 * Quotas vary by `profile` (declared in frontmatter); defaults to `authority-survey`.
 */
export function runVerifyGate(
  refs: Reference[],
  claims: ClaimSpan[],
  profile: PaperProfile = "authority-survey",
  bodyWordCount?: number,
): VerifyGateResult {
  const metrics = computeMetrics(refs, claims);
  const quotas = PROFILE_QUOTAS[profile];
  const failures: string[] = [];

  // Layer 1 — references
  if (refs.length === 0) {
    failures.push(
      "Layer 1: no references section detected (need `[^N]:` footnotes or `## References` numbered list)",
    );
  } else if (metrics.refsWithUrl === 0) {
    failures.push(
      `Layer 1: ${refs.length} references found but ZERO have URLs — references are not sources`,
    );
  } else {
    if (metrics.refsByTier.primary < quotas.primaryMin) {
      failures.push(
        `Layer 1: only ${metrics.refsByTier.primary} primary refs (need ≥${quotas.primaryMin} for profile=${profile})`,
      );
    }
    if (metrics.refsByTier.secondary < quotas.secondaryMin) {
      failures.push(
        `Layer 1: only ${metrics.refsByTier.secondary} secondary refs (need ≥${quotas.secondaryMin} for profile=${profile})`,
      );
    }
    if (metrics.primarySecondaryShare < quotas.primarySecondaryShareMin) {
      failures.push(
        `Layer 1: primary+secondary share ${(metrics.primarySecondaryShare * 100).toFixed(0)}% < ${(quotas.primarySecondaryShareMin * 100).toFixed(0)}% required for profile=${profile}`,
      );
    }
    if (metrics.tertiaryShare > quotas.tertiaryShareMax) {
      failures.push(
        `Layer 1: tertiary+unknown share ${(metrics.tertiaryShare * 100).toFixed(0)}% > ${(quotas.tertiaryShareMax * 100).toFixed(0)}% cap for profile=${profile}`,
      );
    }
  }

  // Layer 2 — coverage
  if (metrics.claimsDetected >= 10 && metrics.citationCoverage < quotas.citationCoverageMin) {
    failures.push(
      `Layer 2: inline citation coverage ${(metrics.citationCoverage * 100).toFixed(1)}% < ${(quotas.citationCoverageMin * 100).toFixed(0)}% required (${metrics.claimsCited}/${metrics.claimsDetected})`,
    );
  }
  if (metrics.forwardDatedUncited > 0) {
    failures.push(
      `Layer 2: ${metrics.forwardDatedUncited} forward-dated claims uncited or backed only by tertiary sources`,
    );
  }
  if (metrics.orphanCitations.length > 0) {
    failures.push(
      `Layer 2: orphan citations [${metrics.orphanCitations.slice(0, 10).join(", ")}] reference IDs that don't exist in References section`,
    );
  }

  // Layer 2b — hedged-prose (only enforced when profile demands it)
  if (quotas.hedgedProseRequired) {
    const share = hedgedProseShare(claims);
    if (share < 0.9) {
      failures.push(
        `Layer 2b: hedged profile requires attributed-prose pattern ("Per X, Y") on ≥90% of forward-dated claims; only ${(share * 100).toFixed(0)}% qualify`,
      );
    }
  }

  // Layer 3 — word ceiling
  if (typeof bodyWordCount === "number") {
    const ceiling = wordCeiling(metrics, profile);
    if (bodyWordCount > ceiling && ceiling > 0) {
      failures.push(
        `Layer 3: word count ${bodyWordCount} exceeds source-supported ceiling ${ceiling} (formula: 200×primary + 100×secondary + 50×tertiary, profile multiplier ${quotas.wordCeilingMultiplier})`,
      );
    }
  }

  return { pass: failures.length === 0, failures, metrics, profile };
}

// ----------------------------------------------------------------------------
// Layer 4 — URL liveness check (env-gated, optional)
// ----------------------------------------------------------------------------

export interface FidelityResult {
  url: string;
  refIndex: number;
  status: number | null;
  ok: boolean;
  error?: string;
}

/**
 * HEAD-request each cited URL with the given timeout. Returns per-URL liveness.
 * Off by default; gate this behind `VERIFY_CLAIM_FIDELITY=1` in the caller.
 *
 * Note: HEAD-only is intentional V1. Some sites block HEAD (will need GET fallback);
 * some sites are SPA-rendered (text-content match would require headless browser).
 * Both are V2 work.
 */
export async function checkUrlLiveness(
  refs: Reference[],
  options: { timeoutMs?: number; concurrency?: number } = {},
): Promise<FidelityResult[]> {
  const timeoutMs = options.timeoutMs ?? 8000;
  const concurrency = options.concurrency ?? 4;
  const queue = refs.filter((r) => r.url);
  const results: FidelityResult[] = [];

  async function fetchOne(ref: Reference): Promise<FidelityResult> {
    const url = ref.url!;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: ctl.signal,
        headers: {
          "User-Agent": "perea-research-engine/1.0 (+https://perea.ai)",
        },
      });
      clearTimeout(timer);
      // Some servers return 403/405 to HEAD but serve GET; treat 4xx (not 404)
      // as soft-pass when liveness is the only question.
      const ok = res.ok || res.status === 403 || res.status === 405 || res.status === 401;
      return { url, refIndex: ref.index, status: res.status, ok };
    } catch (err) {
      clearTimeout(timer);
      return {
        url,
        refIndex: ref.index,
        status: null,
        ok: false,
        error: (err as Error).message,
      };
    }
  }

  // Simple chunked concurrency
  for (let i = 0; i < queue.length; i += concurrency) {
    const batch = queue.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fetchOne));
    results.push(...batchResults);
  }
  return results;
}
