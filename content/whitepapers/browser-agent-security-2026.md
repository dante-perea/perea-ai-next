---
title: 'Browser Agent Security: The 2026 State of the Art'
subtitle: >-
  Cognitive Firewall, Atlas hardening, Claude for Chrome — defending agents that
  see screens
publication: perea.ai Research
authors:
  - Dante Perea
version: '1.0'
status: Public draft
date: 2026-05
audience: >-
  Browser-agent platform engineers, AI security architects, founders shipping
  agentic browsers, security teams reviewing Claude for Chrome / ChatGPT Atlas /
  Perplexity Comet deployments
length: '~6,000 words'
license: CC BY 4.0
description: >-
  How three production browser agents (Anthropic Claude for Chrome, OpenAI
  ChatGPT Atlas, Perplexity Comet) actually defend against indirect prompt
  injection in 2026 — the published numbers, the attacks observed in the wild,
  the architectures that work, and the ones that didn't. Cognitive Firewall
  (arXiv:2603.23791) Defense Funnel pattern, Anthropic Opus 4.5 1% ASR, OpenAI's
  RL-trained automated attacker, EchoLeak (CVE-2025-32711), and Unit 42's first
  documented IDPI campaign in the wild.
profile: field-manual
---

## Foreword

Three things changed in 2025 that turn browser agents into a security category of their own. Anthropic launched Claude for Chrome on August 25 2025 to 1,000 Max-plan pilot users with a published 23.6% baseline attack success rate.[^6] OpenAI shipped ChatGPT Atlas later that year and disclosed its automated red-teaming approach on December 22 2025.[^11] Perplexity's Comet, the first agentic browser to reach broad consumer launch, was publicly compromised by Brave's security team within weeks.[^17] By March 2026, Palo Alto Unit 42 had documented the first observed indirect-prompt-injection attacks in the wild — 12 real campaigns, 22 distinct payload techniques.[^22]

This is a field manual for engineers shipping browser agents in 2026. Six sections: the threat model that actually fires in production, the three architectures vendors are betting on (Anthropic RL + classifiers, OpenAI rapid-response loop, Cognitive Firewall split-compute), the published measurements, the attack catalogue from the wild, the design checklist, and a forward look. Numbers and CVE IDs throughout. The thesis: browser agents are not yet safe to ship without explicit user-action gates, but the architectural patterns that make them defensible are now well-defined.

## 1. The Threat Model: Indirect Prompt Injection on the Open Web

Indirect prompt injection (IPI) is the structural vulnerability of LLM-based browser agents.[^25] The attack: a webpage contains hidden instructions; the agent reads the page; the agent executes the hidden instructions as if the user issued them. The attacker and the user are different people. Same-origin policy and CORS — the foundations of web security since 1995 — provide no protection because the agent operates with the user's full authenticated privileges across every logged-in session.[^17]

Anthropic's framing in their November 24 2025 research post crystallizes why browser use amplifies the risk class. First: the attack surface is vast — every webpage, embedded document, advertisement, and dynamically loaded script is a potential vector for malicious instructions.[^7] Second: browser agents take heterogeneous actions — navigating URLs, filling forms, clicking buttons, downloading files — that attackers can repurpose for exfiltration, account takeover, or destructive operations.[^7] OpenAI agreed in December 2025: "Agents within browsers operate, by design, across the full scope of a user's digital life, including email, social media, webpages, and online calendars. Each of those represents a potential attack vector."[^11]

The CSA's April 2026 research note pushes the framing further for computer-use agents specifically: "agents perceive the entire rendered screen as trusted instruction context, making any on-screen content — web pages, documents, pop-up windows, hidden CSS text — a potential attack vector that bypasses traditional input validation controls."[^24] Browser agents are a specific class of computer-use agent with the hostile-content surface dialed up to eleven.

The core mechanism is well-understood. As Simon Willison (who coined the term in 2022) put it after reviewing the Brave-Comet disclosure: "to an LLM the trusted instructions and untrusted content are concatenated together into the same stream of tokens, and to date nobody has demonstrated a convincing and effective way of distinguishing between the two."[^39] The defenses described in this paper do not solve that problem — they architect around it.

## 2. The Catalogue of Attacks Observed in the Wild

By March 2026, Unit 42 (Palo Alto Networks) had published the first documented observation of IPI attacks deployed against production AI systems in the wild.[^22] The catalogue spans 12 real-world case studies and 22 distinct payload construction techniques. The earliest confirmed detection was an attack designed to bypass an AI-based product advertisement review system, recorded in December 2025.[^22]

The Unit 42 distribution of techniques observed across live campaigns:[^22]

- **37.8%** visible plaintext placed in page footers or other low-attention areas
- **19.8%** HTML attribute cloaking (`data-*`, `alt`, `title` attributes containing instructions)
- **16.9%** CSS rendering suppression (`display:none`, `visibility:hidden`, `opacity:0`, `font-size:0`)
- Remaining 25.5% spans visual concealment + character manipulation + encoding obfuscation + plaintext low-attention embedding + dynamic execution

Five technique categories are catalogued.[^22] **Visual concealment** (CSS-based hiding) covers zero-sizing (`font-size: 0px` and `line-height: 0`), off-screen positioning (`position: absolute` with `left: -9999px`), opacity manipulation (`opacity: 0`), and color camouflage (white text on white background). **Character manipulation** covers invisible zero-width Unicode (U+200B[^22] zero-width space, U+200D zero-width joiner, U+00AD soft hyphen) for keyword fragmentation, homoglyph substitution (Cyrillic 'а' U+0430 for Latin 'a' U+0061), and bidirectional override characters (U+202E). **HTML attribute cloaking** uses non-rendered DOM attributes. **Encoding obfuscation** wraps payloads in Base64 or JavaScript-DOM-injected strings. **Plaintext embedding** in low-attention areas like footers or comment threads remains the most common vector — Forcepoint X-Labs's April 22 2026 telemetry confirmed this across live infrastructure.[^23]

The most severe payloads observed in 2025-2026 are not subtle. Zylos's April 2026 state-of-the-art survey documented attacks instructing agents to execute `rm -rf --no-preserve-root` on backend systems, initiate $5,000 unauthorized financial transfers, and install command-and-control callbacks.[^25] Forcepoint X-Labs's Incident 4 documented a CSS concealment + traffic hijacking campaign at kassoon[.]com using 1px font + 1px height + near-transparent white-on-white color, with a "Stop here" terminating phrase as truncation attempt.[^23]

Three landmark vulnerabilities anchor the threat-model picture. **EchoLeak (CVE-2025-32711)**, disclosed by Aim Labs in June 2025, was the first real-world zero-click prompt-injection exploit in a production LLM system — Microsoft 365 Copilot.[^17_echo][^14] It chained four bypasses: XPIA classifier evasion (phrasing the email's malicious instructions as if directed at the human recipient rather than the AI), reference-style Markdown link bypass (`[link][ref]` syntax, which Microsoft had failed to filter), auto-fetched image exfiltration via Markdown image syntax, and Microsoft Teams proxy abuse via an open-redirect on `*.teams.microsoft.com` that was on the CSP allowlist.[^17_echo][^40] CVSS scores: NIST 7.5 HIGH (`AV:N/AC:L/PR:N/UI:N/S:U/C:H`), Microsoft CNA 9.3 CRITICAL with Scope:Changed, CWE-74/CWE-77.[^15]

**The Perplexity Comet vulnerability** disclosed by Brave on August 20 2025 demonstrated end-to-end account takeover via Reddit comment.[^17] The attack: malicious instructions hidden behind a Reddit "spoiler" tag → user asks Comet to "summarize this thread" → Comet navigates to `perplexity.ai/account/details` to extract email → triggers OTP login → reads OTP from authenticated Gmail tab → exfiltrates email + OTP via Reddit reply. Same-origin policy was useless because Comet operates with user privileges across all logged-in sessions.[^17] Brave's August 20 update revealed Perplexity's initial fix was incomplete and the vulnerability remained.[^36] Brave's October 21 2025 follow-up disclosed a screenshot-OCR variant: faint blue text on yellow background within an image triggers prompt injection when OCR-extracted by Comet's screenshot question feature.[^18]

**ShadowPrompt** (Koi Security, October 2025) compromised the Anthropic Claude Chrome Extension itself.[^29] The attack chained two flaws: an overly-permissive `*.claude.ai` origin allowlist in the extension's `chrome.runtime.sendMessage()` handler, and a DOM-based XSS in an Arkose Labs CAPTCHA component hosted on `a-cdn.claude.ai`. Together: any website could send a `postMessage` with HTML payload to the vulnerable Arkose component, get JavaScript execution on `a-cdn.claude.ai`, and fire `chrome.runtime.sendMessage(extensionId, {type: 'onboarding_task', payload: {prompt: ATTACKER_CONTROLLED}})` — silent prompt injection with no clicks. Anthropic shipped a strict `https://claude.ai` origin check on disclosure.[^29]

Two follow-on attacks. **PerplexedComet** (Zenity Labs, March 3 2026) demonstrated zero-click local-file-system exfiltration via calendar-content indirect injection — Comet was manipulated into navigating to `file://` URLs, traversing directories, opening sensitive files, and exfiltrating contents through ordinary browser navigation.[^20] Perplexity classified critical, fixed January 23 2026; Zenity confirmed February 13 2026 + bypass found via `view-source:file:///Users/` traversal.[^20] **LayerX font-rendering attack** (Bleeping Computer, March 17 2026) inverted the standard CSS hiding trick: HTML benign for AI but rendered malicious for human via custom-font glyph substitution. Successful December 2025 against ChatGPT, Claude, Copilot, Gemini, Leo, Grok, Perplexity, Sigma, Dia, Fellou, and Genspark.[^26] Microsoft accepted and fixed; Google initially accepted then downgraded as "couldn't cause significant user harm."[^26]

**Glassworm**, first discovered October 2025, is the proof-of-scale for invisible-Unicode payloads. By March 2026 it had compromised 151 GitHub repositories in a single week (March 3-9), spread across npm packages, and infected 35,800+ VS Code extensions using zero-width Unicode Tag block characters (U+E0000-U+E007F).[^44] Same character class shows up in Microsoft 365 Copilot data-exfil channels, EchoLeak, AWS's 2025 defense bulletin on Unicode smuggling, and the BreakMyAgent CSS-injection PoC.[^45]

## 3. Anthropic Claude for Chrome: RL Training + Classifier Stack

Anthropic launched Claude for Chrome as a research preview on August 25 2025 to 1,000 Max-plan users.[^6] The launch post published numbers explicitly: 123 test cases representing 29 different attack scenarios; 23.6%[^6] baseline attack success rate when browser use operates without safety mitigations; one example attack instructing Claude to delete a user's emails for "mailbox hygiene" purposes was followed without confirmation.[^6]

The launch-day mitigations dropped the ASR from 23.6% to 11.2% in autonomous mode. Specific mitigations:[^6]

- **Site-level permissions**: users grant or revoke Claude's access to specific websites
- **Action confirmations**: high-risk actions (publish, purchase, share personal data) require user confirmation
- **Default-blocked categories**: financial services, adult content, pirated content
- **System-prompt hardening**: explicit instructions for handling sensitive data + responding to action requests
- **Browser-specific challenge set**: 4 attack types (DOM hidden form fields invisible to humans, URL text only the agent sees, tab title injection, hard-to-catch DOM-only injections) → ASR reduced from 35.7% → 0% on this challenge set

Three months later (November 24 2025), Anthropic shipped Claude Opus 4.5 with a documented further reduction.[^7][^2] The November release reports ~1% attack success rate against an internal adaptive "Best-of-N" attacker that combines many known-effective prompt-injection techniques, with 100 attempts per environment.[^7] The Opus 4.5 system card §5.2 documents the Gray Swan Agent Red Teaming benchmark for tool use plus adaptive-attacker robustness across coding, computer-use, and browser-use surfaces.[^10] WebArena: Claude Opus 4.5 hit 65.3% (state-of-the-art among single-policy-model systems), evaluated using the Computer Use API + browser tools + general-purpose system prompts.[^10]

The Anthropic stack has three layers:[^7]

1. **RL training for prompt-injection robustness**: during model training, Claude is exposed to prompt injections embedded in simulated web content and rewarded when it correctly identifies and refuses to comply with malicious instructions — even when those instructions appear authoritative or urgent. This bakes robustness into model weights.

2. **Classifier stack**: scans all untrusted content entering the model's context window, flags potential prompt injections, and adjusts Claude's behavior when an attack is detected. Detects hidden text, manipulated images, and deceptive UI elements.[^7] Anthropic's own help-center documentation explicitly cautions: "these filters are not a security boundary."[^9]

3. **Continuous red teaming**: human security researchers continuously probe; external benchmark challenges feed novel attack patterns into training.[^7]

The honest assessment from Anthropic: "A 1%[^7] attack success rate — while a significant improvement — still represents meaningful risk. No browser agent is immune to prompt injection."[^7] Forge's analysis amplifies the math: at hundreds of web requests per day, a 1% rate produces multiple successful attacks per week.[^27] Independent AI researcher Simon Willison called the original 11.2% rate "catastrophic" and wrote, "I strongly expect that the entire concept of an agentic browser extension is fatally flawed and cannot be built safely."[^28]

## 4. OpenAI ChatGPT Atlas: The Rapid Response Loop

OpenAI's December 22 2025 hardening post describes a fundamentally different posture than Anthropic's static evaluation — Atlas defends through a continuous discovery-to-fix loop powered by an LLM-based automated attacker trained end-to-end with reinforcement learning.[^11]

The architecture has three pieces:[^11]

1. **The RL-trained attacker**: an LLM trained to hunt prompt injections that successfully attack a browser agent, learning from its own successes and failures over many iterations. Reinforcement learning fits because real-world attacks unfold over many steps with delayed payoffs — pass/fail signals don't capture the long-horizon nature of agent exploits.[^31]

2. **The try-before-ship simulator**: during chain-of-thought reasoning, the attacker proposes a candidate injection and sends it to an external simulator. The simulator runs a counterfactual rollout of how the targeted victim agent would behave if it encountered the injection and returns the full reasoning + action trace. The attacker uses that trace as feedback, iterates, and reruns the simulation — multiple loop iterations before committing to a final attack.[^11] OpenAI explicitly notes the asymmetric advantage: "privileged access to the reasoning traces (that we don't disclose to external users) of the defender gives our internal attacker an asymmetric advantage — raising the odds that it can outrun external adversaries."[^11]

3. **Adversarial training feedback**: when the automated attacker discovers a new vulnerability class, OpenAI immediately uses those traces to adversarially train an updated agent model. The goal: teach the system to ignore adversarial instructions and stick to user intent, baking robustness into the model's weights. A newly adversarially trained browser-agent checkpoint has already been deployed to all ChatGPT Atlas users.[^11][^32]

The published demos show the loop in action. In one trace, the automated attacker seeded a prompt injection into Atlas, directing a simulated user's email account to send a resignation email to their CEO. The agent caught the injection attempt and notified the user before the automated email was sent.[^30] Another OpenAI internal trace: an injected email caused the agent, when later asked to draft an out-of-office reply to an unrelated message, to attempt to resign on behalf of the user — a long-horizon attack that crossed sessions.[^34]

OpenAI's framing is honest about limits. "We expect adversaries to keep adapting. Prompt injection, much like scams and social engineering on the web, is unlikely to ever be fully 'solved'."[^11] Zenity's December 30 2025 analysis amplifies: the industry is "trying to stabilize an inherently unstable security surface, and the tension is showing."[^21] Zenity also documents an attack class where the injection shapes the confirmation-prompt UX itself: the attacker can cause Atlas to surface a harmless-sounding confirmation while the actual malicious instruction is hidden behind it. The user approves what looks harmless and authorizes an action they never agreed to.[^21]

## 5. The Cognitive Firewall: Three-Stage Split-Compute Defense

The most rigorous architectural defense for browser agents in 2026 is the Cognitive Firewall, published as arXiv:2603.23791 on March 24 2026 by Lan and Kaul.[^1] The architecture distributes security checks across three stages and combines deterministic enforcement with probabilistic semantic analysis. Across 1,000 adversarial samples, the full hybrid architecture reduces overall ASR to **0.88%[^1] under static evaluation and 0.67% under adaptive evaluation**, with 99.1% aggregate interception rate.[^1] Edge-only defenses fail to detect 86.9% of semantic attacks; cloud-only defenses are too slow for real-time browser interaction. The hybrid solves both.

**Layer 1: The Edge Sentinel** runs on the client and applies visual + DOM-level heuristics to detect presentation-layer attacks at sub-millisecond overhead (~0.02ms per check, ~0.06ms for full screening).[^3] The Sentinel is backed by a small language model (Gemini Nano or equivalent) and catches obvious injection patterns: known attack signatures, suspicious formatting, encoded payloads. Per the published evaluation, the Sentinel blocks 13.1% of presentation-layer attacks at negligible latency.[^3] The latency advantage over cloud-only baselines is approximately **17,000× lower**, and the layer reduces cloud token usage by the same 13.1% margin while filtering high-frequency visual threats.[^1]

**Layer 2: The Deep Planner** runs in a server-side enclave backed by a large model (Llama 3 8B or GPT-4 in the published evaluation).[^3] Inputs that pass the Sentinel are forwarded to the Planner, which performs semantic inspection and plan generation. The Planner evaluates high-level intent and identifies jailbreak-style manipulations difficult to detect on-device — role-playing prompts, multi-turn social engineering, logical-coherence attacks. System aggregate latency including Layer 2 averages ~517ms per request.[^3]

**Layer 3: The Origin Guard** is the final fail-closed enforcement point.[^1] It is a client-side execution monitor independent of the generative models, relying on deterministic checks. After the Deep Planner outputs a plan P (e.g., POST `https://api.com/data`), the browser validates P against a local policy π before dispatch. The Guard uses a Synchronous JavaScript Interceptor to enforce two constraints: the target origin must be in a trusted domain set W, and the HTTP verb (e.g., DELETE) must be consistent with the user's declared intent (e.g., a read-only goal). Even if the Planner is manipulated into producing a malicious plan, the Guard blocks the request whenever the destination violates W or the action falls outside the user's declared intent.[^1] The Origin Guard intercepts 38.2% of attacks — including cases that pass the cloud Layer 2 — yielding the 99.1% aggregate interception rate.[^1][^42]

The Defense Funnel mental model is the architectural takeaway.[^42] Inexpensive checks at the edge filter high-volume low-complexity cases; semantic analysis is reserved for inputs that need it; deterministic execution-time policy at the boundary is the final gate. "Safety-critical actions should be gated by rules, not probabilities."[^42] Two complementary academic defenses round out the picture. **PlanGuard** (arXiv:2604.10134) is a training-free Context Isolation defense with an isolated Planner generating a reference set of valid actions from user instructions, plus a Hierarchical Verification Mechanism (hard constraints + Intent Verifier); on the InjecAgent benchmark, ASR drops 72.8% → 0% with 1.49% false-positive rate.[^4] **WebSentinel** (arXiv:2602.03792) is a two-step approach: Step 1 extracts segments of interest that may be contaminated; Step 2 evaluates each segment by checking consistency with the broader webpage content as context.[^5]

## 6. Perplexity Comet: A Defense-in-Depth Retrofit

Perplexity's October 22 2025 mitigation post documents the response to the August Brave disclosure.[^19] The Perplexity defense stack is closer to Anthropic's pattern than to the Cognitive Firewall — ML classifiers running parallel to the reasoning pipeline, structured prompts as guardrails, user confirmation for sensitive actions. Three layers:[^19]

1. **Classifier library**: trained specifically to detect malicious instructions hidden in sites the user interacts with. Every time Comet retrieves new content, classifier checks fire before the assistant takes action. Operates in parallel with Comet's reasoning pipeline to avoid latency. Continuously updated from bug bounty + red-team + real-world detection events.

2. **Structured guardrail prompts**: inserted at key decision points in the task lifecycle to remind the model and tools to stay focused on user intent.

3. **Human-in-the-loop confirmation** for actions like sending email or making account changes, regardless of whether classifiers flag suspicious activity. Transparent notifications when Comet's security systems block a potential injection.

The honest measurement gap: Perplexity does not publish the equivalent of Anthropic's 23.6%[^17] / 11.2%[^17] / 1%[^17] numbers or OpenAI's published trace examples. Brave's August 20 disclosure update — *after* Perplexity's first fix — documents the patch was incomplete and the vulnerability remained.[^17][^36] Brave's October 21 follow-up demonstrated the screenshot-OCR variant.[^18] Zenity's March 3 2026 PerplexedComet attack required a hard `file://`-boundary fix at the code level, with a `view-source:file:///Users/` bypass found and fixed in February.[^20] Alice.io's March 25 2026 disclosure documented persistent injection via Google Workspace docs that survived the published mitigations.[^38]

The Comet pattern demonstrates the iterative-disclosure pressure that defines browser-agent security in 2026: a vendor publishes a defense post; researchers find a bypass within weeks; the vendor patches; another bypass surfaces. Brave's eventual recommendation: "browsers should isolate agentic browsing from regular browsing and initiate agentic browsing actions (opening websites, reading emails, etc.) only when the user explicitly invokes them."[^18]

## 7. The Engineering Checklist for Browser Agents in 2026

Consolidating the published defenses across Anthropic, OpenAI, Cognitive Firewall, Brave, Perplexity, Forcepoint, Zylos, and the OpenClaw sanitizer audit, the engineering checklist for shipping a browser agent in 2026 has eleven items:

**1. Sanitize hidden CSS at content-extraction time.**[^45] Strip `display:none`, `visibility:hidden`, `opacity:0`, `font-size:0`, `color:transparent`, `text-indent:-9999px`, `clip-path`, `transform:scale(0)`, and `width:0;height:0;overflow:hidden`.[^16] Add a same-foreground-background color check (parse `white`, `#fff`, `rgb(255,255,255)` to canonical form, compare to background-color) — this catches the general case regardless of specific color values.[^16] Add a tiny-font threshold (`font-size:1-3px`, `font-size:0.1em`) — humans cannot meaningfully read text at that size.[^16]

**2. Strip invisible Unicode before tokenization.** Reject Unicode Tag block (U+E0000-U+E007F), zero-width characters (U+200B[^44]-200F, U+2060-206F), bidirectional override (U+202A-202E), variation selectors (U+FE00-FE0F), and soft hyphens (U+00AD).[^44][^25] These render as nothing but tokenize as text. AWS published a dedicated defense bulletin in 2025; Glassworm proves the scale at 35,800+ infected VS Code extensions.[^44]

**3. Distinguish trusted instructions from untrusted content in prompts.** Use randomized markers around untrusted regions; instruct the model to never execute as commands. This is necessary but not sufficient — Brave's Comet research demonstrated it can be defeated, and Simon Willison's framing is correct: nobody has demonstrated a convincing way to make LLMs reliably distinguish at the token level.[^39] But raising the cost is still useful.

**4. Process accessibility tree, not raw HTML.** Per the BreakMyAgent recommendation: "Process web page accessibility tree (semantic content) rather than raw HTML. Apply injection detection to all extracted page text including hidden elements. Do not trust style-based visibility when evaluating page content."[^45]

**5. Apply both DOM and rendered-page analysis, then compare.** LayerX's font-rendering attack works precisely because most agents see only one of the two. The defense: extract both representations and flag discrepancies.[^26]

**6. Block reference-style Markdown links and image syntax in agent outputs.** EchoLeak's exfiltration channel used `[link][ref]` and `![image][ref]` syntax that Microsoft's filter forgot to handle. Block these unless the destination is a known-trusted internal target.[^17_echo][^40][^25]

**7. Disable auto-rendering of external images in agent response surfaces.** Markdown image rendering with attacker-controlled URL is a zero-click exfil channel.[^25][^40]

**8. Enforce a Strict Content Security Policy with a tight allowlist.** EchoLeak abused `*.teams.microsoft.com` because it was on the CSP allowlist but contained an open redirect. Audit every domain on the allowlist for redirect endpoints; the allowlist should be specific subdomains, not wildcards.[^17_echo]

**9. Origin-Guard execution-time enforcement.** Per the Cognitive Firewall Layer 3 pattern: validate every outbound request against a trusted-origin set + verb consistency with declared user intent. A read-only goal should never produce a DELETE or POST. The Synchronous JavaScript Interceptor pattern works in any agent runtime, not just the published architecture.[^1]

**10. Require human confirmation for state-changing actions.** Anthropic site-level permissions + action confirmations + default-blocked categories. Perplexity human-in-the-loop for email send + account changes. OWASP LLM06 mitigation 5: track user authorization + execute extensions in user's context with minimum scope.[^6][^19]

**11. Audit your origin allowlist + Chrome extension messaging surface.** ShadowPrompt was possible because Anthropic's `*.claude.ai` allowlist included `a-cdn.claude.ai` (third-party Arkose code) and the extension didn't distinguish origins on `chrome.runtime.sendMessage()`. Strict origin checks (`https://claude.ai` exactly) are the fix.[^29]

A twelfth item from the OpenAI Atlas playbook is operational rather than architectural: build a rapid-response loop that runs an automated red team continuously and can ship adversarially trained checkpoints to all users when novel attack classes are discovered.[^11] No static set of mitigations survives 2026; the discovery-to-fix loop must be a first-class engineering investment.

## 8. Six Predictions for Browser Agent Security 2026-2028

**Prediction 1.** All three production browser agents (Claude for Chrome,[^6] ChatGPT Atlas,[^11] Perplexity Comet[^19]) ship some flavor of Origin Guard / Synchronous-Interceptor execution-time enforcement by end of 2026.[^1] The Cognitive Firewall result (99.1% interception, 0.88% ASR) is too compelling to ignore once integrated into vendor evaluations.[^1] Microsoft 365 Copilot ships a CSP-allowlist audit + reference-style-Markdown filter as a direct EchoLeak post-mortem.[^12][^17_echo]

**Prediction 2.** A second EchoLeak-class CVE lands by Q3 2026 — zero-click data exfiltration from a major LLM-integrated productivity suite. Aim Labs's "lethal trifecta" framing (private data + malicious tokens + exfil vector) is structural, not specific to Microsoft. The pressure on Google Workspace + Salesforce Einstein + Notion AI is identical.

**Prediction 3.** Browser agents add a "trusted browsing mode" toggle by mid-2027. Default off. When on, the agent operates with attenuated capabilities — read-only tools, no form submission, no file:// access — and only escalates capability scope when the user explicitly authorizes a specific action. This matches Brave's recommendation that "agentic browsing should be isolated from regular browsing and initiated only when the user explicitly invokes it."[^18]

**Prediction 4.** Cybersecurity insurance carriers start requiring evidence of automated-red-team adversarial training (the OpenAI Atlas pattern) as a precondition for browser-agent deployment in regulated industries by 2027. Static sanitizer + classifier stack alone fails the audit.

**Prediction 5.** Indirect prompt injection becomes a named attack class in the 2027 OWASP Top 10 update, joining LLM06 Excessive Agency as a co-equal entry rather than a sub-bullet of LLM01 Prompt Injection. The Unit 42 in-the-wild data crosses a threshold where the practitioner community demands its own slot.[^22][^23]

**Prediction 6.** The Defense Funnel pattern (Cognitive Firewall) becomes the reference architecture cited in security RFCs the way "Zero Trust" became reference architecture for network security circa 2019-2021. Vendors publish "Defense Funnel posture statements" and the AGT/Permit.io-style policy-decision-point ecosystem extends to browser-runtime-specific policy languages by mid-2027.

## Glossary

**Indirect Prompt Injection (IPI / IDPI).** Attack pattern where malicious instructions arrive through external content the agent processes as data — a webpage, document, retrieved memory record, tool output, or email — rather than from the user. The attacker and the user are different people.[^25]

**Defense Funnel.** Layered architecture (Cognitive Firewall): inexpensive checks at the edge filter high-volume cases; semantic analysis is reserved for inputs that need it; deterministic execution-time policy at the boundary is the final gate.[^42]

**Origin Guard.** Client-side execution monitor that validates every outbound request against a trusted-origin set + HTTP verb consistency with declared user intent before dispatch. Independent of the generative model. From Cognitive Firewall Layer 3.[^1]

**Synchronous JavaScript Interceptor.** The implementation mechanism for the Origin Guard — a synchronous handler that intercepts outbound browser API calls and validates them before the request leaves the client.[^1]

**XPIA (Cross Prompt Injection Attempt).** Microsoft's term and classifier name for prompt-injection attacks. EchoLeak's first bypass was XPIA evasion via authority-recipient framing.[^17_echo]

**LLM Scope Violation.** Aim Labs's term for an attack that tricks an LLM into violating its trust boundary and leaking internal data — for example, EchoLeak's exfiltration of user context via attacker-crafted reference-style Markdown.[^40]

**Lethal Trifecta.** Simon Willison's framing: any system that combines (1) access to private data, (2) exposure to malicious tokens, and (3) an exfiltration vector exhibits the same prompt-injection security issue.[^40]

**Best-of-N Adaptive Attacker.** Anthropic's internal evaluation methodology: an adaptive attacker is given N attempts per environment (typically 100) and tries-and-combines many known-effective prompt-injection techniques. ASR is computed as percentage of attacks succeeding.[^7]

**Try-Before-Ship Simulator.** OpenAI's mechanism for the Atlas RL-trained automated attacker: during chain-of-thought reasoning, the attacker proposes a candidate injection, sends it to a simulator, gets back a counterfactual reasoning + action trace of the victim agent, iterates, and reruns before committing to a final attack.[^11]

**Attack Success Rate (ASR).** Percentage of attempted attacks that successfully cause the agent to perform the attacker-specified action. Lower is better. Anthropic 23.6% baseline → 11.2% mitigated → 1% Opus 4.5; Cognitive Firewall 100% → 0.88%.[^6][^7][^1]

**Unicode Tag Block.** U+E0000-U+E007F. Originally designed for language tagging, now deprecated. Renders as zero-width invisible characters in every standard display environment but tokenizes as ordinary text in most LLMs.[^44]

**Reference-Style Markdown.** Markdown link/image syntax `[text][ref]` / `![image][ref]` with the URL defined separately. EchoLeak's primary exfiltration channel because Microsoft's filter handled `[text](url)` but not `[text][ref]`.[^40]

**Same-Origin Policy (SOP) / CORS.** Foundational web security mechanisms that restrict cross-origin resource access. Both are rendered useless against browser agents because the agent operates with the user's full authenticated privileges across all logged-in sessions.[^17]

## Related Research

This paper closes the "browser-specific defenses" thread complementing `capability-based-agent-security`. Threads it opens for follow-on:

- **agent-runtime-observability-stack** — what monitoring + tracing architectures detect the Defense-Funnel-Layer-2-bypass attacks that Origin Guard catches.
- **mcp-browser-agent-policy-language** — the policy-language layer (YAML/Rego/Cedar style) that production agent runtimes will need to encode the eleven-item engineering checklist.
- **enterprise-browser-agent-deployment-2027** — IT admin policy for shipping Claude for Chrome / Atlas / Comet at scale: domain allowlists, action-confirmation defaults, audit trails.
- **adversarial-red-team-as-compliance** — the rapid-response-loop pattern (OpenAI Atlas) becoming a regulatory or insurance compliance requirement.

---

## References

[^1]: Qianlong Lan & A. Kaul. "The Cognitive Firewall: Securing Browser Based AI Agents Against Indirect Prompt Injection Via Hybrid Edge Cloud Defense." arXiv:2603.23791, March 24 2026. Three-stage split-compute architecture (Sentinel + Deep Planner + Origin Guard); 99.1% interception across 1,000 adversarial samples; ASR 100% → 0.88% static / 0.67% adaptive; ~17,000× latency advantage. https://arxiv.org/abs/2603.23791

[^2]: Anthropic. "Mitigating the risk of prompt injections in browser use." November 24 2025. Claude Opus 4.5 ~1% ASR vs internal Best-of-N adaptive attacker (100 attempts/environment); RL training + classifier stack + ongoing red teaming. https://www.anthropic.com/news/prompt-injection-defenses

[^3]: Qianlong Lan & A. Kaul. "The Cognitive Firewall (HTML)." arXiv:2603.23791v1. Layer-by-layer breakdown: Edge Sentinel ~0.02-0.06ms (13.1% block), Cloud Planner Llama 3 8B / GPT-4 (~517ms aggregate), Origin Guard 38.2% intercept via Synchronous JavaScript Interceptor. https://arxiv.org/html/2603.23791v1

[^4]: Anonymous. "PlanGuard: Defending Agents against Indirect Prompt Injection via Planning-based Consistency Verification." arXiv:2604.10134v1. Training-free Context Isolation; isolated Planner; Hierarchical Verification (hard constraints + Intent Verifier); InjecAgent ASR 72.8% → 0% with 1.49% FPR. https://arxiv.org/abs/2604.10134v1

[^5]: Anonymous. "WebSentinel: Detecting and Localizing Prompt Injection Attacks for Web Agents." arXiv:2602.03792v1. Two-step approach: extract segments of interest + check consistency with webpage context. https://arxiv.org/abs/2602.03792v1

[^6]: Anthropic. "Piloting Claude in Chrome." August 25 2025. 1,000 Max-plan pilot users; 23.6% baseline ASR (123 test cases / 29 attack scenarios) → 11.2% with mitigations; 35.7% → 0% on 4 browser-specific attack types. https://www.anthropic.com/news/claude-for-chrome

[^7]: Anthropic. "Mitigating the risk of prompt injections in browser use" (research mirror). November 24 2025. RL training builds prompt-injection robustness into Claude's capabilities; classifiers scan untrusted content; "1% ASR while a significant improvement still represents meaningful risk." https://www.anthropic.com/research/prompt-injection-defenses

[^8]: PDF version of Cognitive Firewall paper. arXiv:2603.23791. https://arxiv.org/pdf/2603.23791

[^9]: Anthropic Help Center. "Using Claude in Chrome safely." Notes on multi-layer protection (model training + content classifiers + ongoing red teaming); explicit caveat: "these filters are not a security boundary." https://support.claude.com/en/articles/12902428-using-claude-in-chrome-safely

[^10]: Anthropic. "Claude Opus 4.5 System Card." November 24 2025. §5.2 prompt injection risk in agentic systems; Gray Swan Agent Red Teaming benchmark; WebArena 65.3% (single-policy SOTA) using Computer Use API. https://www.anthropic.com/claude-opus-4-5-system-card

[^11]: OpenAI. "Continuously hardening ChatGPT Atlas against prompt injection." December 22 2025. RL-trained automated attacker + try-before-ship simulator with counterfactual rollouts; rapid-response loop; novel attack strategies discovered internally before external adversaries; new adversarially trained browser-agent checkpoint deployed to all Atlas users. https://openai.com/index/hardening-atlas-against-prompt-injection/

[^12]: Microsoft Security Response Center. "CVE-2025-32711 Vulnerability Advisory." Microsoft MSRC update guide. AI command injection in M365 Copilot allows an unauthorized attacker to disclose information over a network. https://msrc.microsoft.com/update-guide/vulnerability/CVE-2025-32711

[^13]: Aim Security. "Aim Labs EchoLeak M365 Disclosure Page." June 2025 disclosure of CVE-2025-32711; LLM Scope Violation framing; full attack chain from XPIA bypass through CSP-permitted Teams open-redirect; original technical writeup of the first real-world zero-click LLM exfil. https://www.aim.security/lp/aim-labs-echoleak-m365

[^14]: arXiv full paper for EchoLeak. https://arxiv.org/html/2509.10540v1

[^15]: NIST National Vulnerability Database. "CVE-2025-32711." Published June 11 2025; updated February 20 2026. CVSS 3.x: NIST 7.5 HIGH (AV:N/AC:L/PR:N/UI:N/S:U/C:H), Microsoft CNA 9.3 CRITICAL with Scope:Changed; CWE-74/CWE-77. https://nvd.nist.gov/vuln/detail/cve-2025-32711

[^16]: openclaw. "[Security] web-fetch-visibility: near-invisible CSS patterns not covered by sanitizer." Issue #48486, March 16 2026. Audit gaps: color:white / color:#fefefe / color:snow / color:ghostwhite (not filtered); font-size:1px / 2px / 0.1em (not filtered); same-fg-bg combinations (not detected). https://github.com/openclaw/openclaw/issues/48486

[^17]: Artem Chaikin & Shivan Kaul Sahib (Brave). "Agentic Browser Security: Indirect Prompt Injection in Perplexity Comet." August 20 2025. PoC: Reddit comment hidden behind spoiler tag → Comet exfils OTP from authenticated Gmail tab → reply to Reddit; same-origin policy + CORS rendered useless because agent operates with user's full authenticated privileges. https://brave.com/blog/comet-prompt-injection/

[^17_echo]: Pavan Reddy & Anuj Singh Gujral. "EchoLeak: The First Real-World Zero-Click Prompt Injection Exploit in a Production LLM System." Proceedings of the AAAI Symposium Series, 7(1), 303-311 (2025). CVE-2025-32711; XPIA classifier evasion + reference-style Markdown link bypass + auto-fetched images + Microsoft Teams proxy CSP abuse → full privilege escalation across LLM trust boundaries with zero user interaction. https://ojs.aaai.org/index.php/AAAI-SS/article/view/36899

[^18]: Artem Chaikin & Shivan Kaul Sahib (Brave). "Unseeable prompt injections in screenshots: more vulnerabilities in Comet and other AI browsers." October 21 2025. Faint blue text on yellow background within image → OCR-extracted by Comet screenshot feature → passed to LLM as command. Recommendation: "browsers should isolate agentic browsing from regular browsing and initiate agentic actions only when the user explicitly invokes them." https://brave.com/blog/unseeable-prompt-injections/

[^19]: Perplexity. "Mitigating Prompt Injection in Comet." October 22 2025. ML classifier library running parallel to reasoning pipeline; structured prompts as guardrails at key decision points; user confirmation for sensitive actions; bug bounty + red team continuous learning. https://www.perplexity.ai/hub/blog/mitigating-prompt-injection-in-comet

[^20]: Stav Cohen (Zenity Labs). "PerplexedBrowser: Perplexity's Agent Browser Can Leak Your PC's Local Files." March 3 2026. Zero-click attack via calendar indirect prompt injection; agent navigates to file:// paths, traverses dirs, opens local files; Perplexity classified critical, hard boundary fix Jan 23 2026; Zenity confirmed Feb 13 2026 + view-source:file:/// bypass found. https://labs.zenity.io/p/perplexedbrowser-perplexity-s-agent-browser-can-leak-your-personal-pc-local-files

[^21]: Stav Cohen (Zenity Labs). "Hardening Atlas: The Relentless Challenge of Securing an Untrusted Browser Agent." December 30 2025. "Industry trying to stabilize an inherently unstable security surface"; attack class where injection shapes confirmation-prompt UX. https://labs.zenity.io/p/hardening-atlas-the-relentless-challenge-of-securing-an-untrusted-browser-agent

[^22]: RAXE Labs. "RAXE-2026-016: Web-Based Indirect Prompt Injection Against AI Agents: Observed in the Wild." March 6 2026. Unit 42 (Palo Alto Networks) first documented IDPI in the wild; 12 case studies + 22 distinct payload techniques; earliest detection Dec 2025; 37.8% visible plaintext / 19.8% HTML attribute cloak / 16.9% CSS rendering suppression. https://raxe.ai/labs/advisories/RAXE-2026-016

[^23]: Forcepoint X-Labs. "Indirect Prompt Injection in the Wild: X-Labs Finds 10 IPI Payloads." April 22 2026. 10 verified IPI indicators across live infrastructure; CSS concealment + HTML comments + accessibility attribute abuse + meta tag injection + system prompt tag impersonation; financial fraud + data destruction + API key exfil + AI DoS targets. https://www.forcepoint.com/blog/x-labs/indirect-prompt-injection-payloads

[^24]: Cloud Security Alliance Lab Space. "Computer-Use Agent Safety Blind Spots." April 15 2026. Agents perceive entire rendered screen as trusted instruction context; Unicode Tag block (U+E0000-U+E007F) covert channel; AWS published dedicated defense guide 2025. https://labs.cloudsecurityalliance.org/research/csa-research-note-computer-use-agent-safety-blindspots-20260/

[^25]: Zylos Research. "Indirect Prompt Injection: Attacks, Defenses, and the 2026 State of the Art." April 12 2026. CSS concealment + zero-width Unicode + Markdown image syntax exfil channel; defense recipe: strip U+E0000-U+E007F before model + reject Markdown image syntax + block reference-style links + monitor tool invocations. https://zylos.ai/research/2026-04-12-indirect-prompt-injection-defenses-agents-untrusted-content

[^26]: Bill Toulas (Bleeping Computer). "New font-rendering trick hides malicious commands from AI tools." March 17 2026. LayerX PoC: custom-font glyph substitution; HTML benign for AI but rendered malicious for human; successful December 2025 against ChatGPT, Claude, Copilot, Gemini, Leo, Grok, Perplexity, Sigma, Dia, Fellou, Genspark; Microsoft accepted + fixed; Google downgraded. https://www.bleepingcomputer.com/news/security/new-font-rendering-trick-hides-malicious-commands-from-ai-tools/

[^27]: Forge.ai. "Mitigating Prompt Injection in Browser-Based Agents." Forge analysis of Anthropic November 2025 research: "1% ASR sounds low — at hundreds of web requests/day means multiple successful attacks/week"; defense-in-depth + least-privilege + monitoring + user awareness. https://forge.ai/resources/prompt-injection-browser-agents

[^28]: Benj Edwards (Ars Technica). "Anthropic's auto-clicking AI Chrome extension raises browser-hijacking concerns." August 27 2025. Simon Willison: "11.2% attack rate is catastrophic"; "I strongly expect that the entire concept of an agentic browser extension is fatally flawed and cannot be built safely." https://arstechnica.com/information-technology/2025/08/new-ai-browser-agents-create-risks-if-sites-hijack-them-with-hidden-instructions/

[^29]: Koi Security. "ShadowPrompt: How Any Website Could Have Hijacked Claude's Chrome Extension." Chained overly-permissive *.claude.ai origin allowlist + DOM-based XSS in Arkose Labs CAPTCHA on a-cdn.claude.ai → silent prompt injection; Anthropic fixed with strict claude.ai origin check. https://koi.security/blog/shadowprompt-how-any-website-could-have-hijacked-anthropic-claude-chrome-extension

[^30]: ZDNET. "How OpenAI is defending ChatGPT Atlas from attacks now." December 23 2025. RL-trained attacker considers multiple strategies + runs scenarios in external simulation; resignation-email demo; "agentic web browsers are intrinsically vulnerable and will likely remain so." http://www.zdnet.com/article/openai-artificial-intelligence-protect-chatgpt-atlas-prompt-injection-attacks/

[^31]: TMC Insight. "OpenAI Pushes New Security Update for ChatGPT Atlas as Automated RL Red Team Uncovers Sophisticated Prompt-Injection Attacks." December 23 2025. "Agent security expectations starting to look like expectations for human employees." https://insight.tmcnet.com/insight/openai-pushes-new-security-update-for-chatgpt-atlas-as-automated-rl-red-team-uncovers-sophisticated-prompt-injection-attacks-1766503930648

[^32]: NewsDefused. "OpenAI hardens ChatGPT Atlas browser agent after uncovering new prompt-injection attacks." December 22 2025. Counterfactual simulator + adversarially trained checkpoint deployed to all Atlas users. https://www.newsdefused.com/openai-hardens-chatgpt-atlas-browser-agent-after-uncovering-new-prompt-injection-attacks/

[^34]: AI News Today. "ChatGPT Atlas Security Strengthens Prompt Injection Defense." December 24 2025. Resignation-out-of-office demo: injected email caused agent to attempt to resign on behalf of user when later asked to draft an OOO reply. https://ainewstoday.org/chatgpt-atlas-security-strengthens-prompt-injection-defense/

[^36]: Thomas Claburn (The Register). "Perplexity's Comet browser faced prompt injection vuln." August 20 2025. Brave spokesperson: "We cannot guarantee Comet has completely fixed all possible prompt injection attacks." https://www.theregister.com/2025/08/20/perplexity_comet_browser_prompt_injection/

[^38]: Alice. "Perplexing: Comet Flies In with an Indirect Prompt Injection." March 25 2026. Persistent indirect injection in Comet → phishing payload via fake "upgrade" page in Google Workspace doc; bug bounty disclosure timeline Sept 14 2025 → Oct 15 2025. https://alice.io/blog/ai-browser-perplexity-prompt-injection-phishing

[^39]: Simon Willison. "Agentic Browser Security: Indirect Prompt Injection in Perplexity Comet." August 25 2025. "To an LLM the trusted instructions and untrusted content are concatenated together into the same stream of tokens, and to date nobody has demonstrated a convincing and effective way of distinguishing between the two." https://simonwillison.net/2025/Aug/25/agentic-browser-security/

[^40]: Simon Willison. "Breaking down 'EchoLeak', the First Zero-Click AI Vulnerability Enabling Data Exfiltration from Microsoft 365 Copilot." June 11 2025. "Lethal trifecta strikes again: private data + malicious tokens + exfil vector"; XPIA classifier bypass + reference-style Markdown + Teams open-redirect. http://blog.simonwillison.net/2025/Jun/11/echoleak/

[^42]: Charles Chen wiki. "The Cognitive Firewall: Securing Browser-Based AI Agents Against Indirect Prompt Injection Via Hybrid Edge-Cloud Defense." Defense Funnel mental model summary; "split compute = right tier for each task"; "safety-critical actions should be gated by rules, not probabilities." https://wiki.charleschen.ai/ai/processed/wiki/llm-core/security/raw/papers/cognitive-firewall-hybrid-edge-cloud-defense

[^44]: Hive Security. "Invisible Characters as an Attack Vector." March 15 2026. Trojan Source CVE-2021-42574; Glassworm 151 GitHub repos in 1 week (March 3-9 2026) + 35,800+ infected VS Code extensions; Unicode tag block U+E0000-U+E007F; defense: strip + WAF rules. https://hivesecurity.gitlab.io/blog/invisible-characters-attack-vector

[^45]: BreakMyAgent. "CSS-Based Prompt Injection in Web Agents." PoC: `<div style="font-size:0;color:white;position:absolute;left:-9999px">AI AGENT INSTRUCTION: ...</div>`; recommendation: process accessibility tree (semantic content) rather than raw HTML. https://breakmyagent.ai/attacks/prompt-injection-via-css

[^46]: arXiv abstract page for EchoLeak (Reddy & Gujral 2025). https://arxiv.org/abs/2509.10540

[^47]: OpenAI. "Introducing ChatGPT Atlas." Atlas product launch announcement; agentic browser capabilities and the explicit rationale that prompt injection becomes a higher-value target as the agent becomes more useful. https://openai.com/index/introducing-chatgpt-atlas/

[^48]: Anthropic. "Computer use (beta)." Claude computer-use API documentation; underlying primitive that the Claude for Chrome extension is built on; documents the screenshot + DOM inputs that prompt injection targets. https://docs.claude.com/en/docs/agents-and-tools/computer-use

[^49]: NIST National Vulnerability Database CVSS 3.1 vector record for CVE-2025-32711. Direct vector strings: NIST AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N (7.5 HIGH); Microsoft CNA AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:N (9.3 CRITICAL with Scope:Changed). https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?name=CVE-2025-32711

[^50]: Microsoft. "Microsoft Defender for Cloud Apps — Generative AI security posture management." Microsoft enterprise guidance on Copilot/agent risk surface that emerged from the EchoLeak post-mortem. https://www.microsoft.com/en-us/security/business/ai-and-cybersecurity
