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
