/**
 * AI lead analysis via OpenAI.
 * Takes Aria's call transcript + optional enrichment data
 * and produces:
 *   - ICP score (0–100) with reasoning
 *   - 1-paragraph executive summary
 *   - 3 tailored talking points for the discovery call
 *   - Recommended engagement tier (Discovery / Project / Retainer)
 */

import { generateText } from "ai";
import { gateway } from "./ai";
import type { LeadEnrichment } from "./enrich-lead";

export interface LeadAnalysis {
  icpScore: number;           // 0–100
  icpLabel: "HOT" | "WARM" | "COLD";
  icpReason: string;          // 1–2 sentence reasoning
  summary: string;            // executive summary of the lead
  talkingPoints: string[];    // exactly 3 points
  recommendedTier: string;    // "Discovery" | "Project" | "Retainer"
}

const SYSTEM_PROMPT = `You are a senior AI consultant at Perea.AI analyzing a lead who just finished a 4-minute qualification call with Aria, our AI assistant.

Perea.AI is an AI consultancy for startups and SMBs. Our ideal client:
- Team size: 5–200 people
- Role: Founder, COO, Head of Ops, Head of Sales, CTO
- Pain: Manual, repetitive workflows eating team time
- AI maturity: Little to no AI deployed
- Timeline: Wants results in 1–8 weeks
- Budget: $2,500–$15,000 for first engagement

Your job: Analyze the transcript and enrichment data, then return a JSON object exactly matching this schema:
{
  "icpScore": <number 0-100>,
  "icpLabel": <"HOT" | "WARM" | "COLD">,
  "icpReason": "<1-2 sentence explanation of the score>",
  "summary": "<2-3 sentence executive summary of this lead: who they are, what they need, and why it matters>",
  "talkingPoints": [
    "<specific talking point 1 based on what they said>",
    "<specific talking point 2>",
    "<specific talking point 3>"
  ],
  "recommendedTier": "<'Discovery' | 'Project' | 'Retainer'>"
}

ICP scoring guide:
- Company size 10–200 people: +20 pts
- Clear, specific pain articulated: +20 pts
- No AI deployed yet (high urgency): +15 pts
- Decision-maker / authority signal: +15 pts
- Timeline 1–8 weeks mentioned: +15 pts
- Budget signal or "investment" language: +10 pts
- Industry fit (B2B SaaS, ops-heavy, services): +5 pts

HOT = 75–100 | WARM = 40–74 | COLD = 0–39

Return ONLY the JSON object, no markdown, no explanation.`;

export async function analyzeLead(
  transcript: string,
  enrichment: LeadEnrichment | null,
  retellSummary?: string,
): Promise<LeadAnalysis | null> {
  const enrichmentBlock = enrichment
    ? `
ENRICHMENT DATA:
- Name: ${enrichment.name ?? "Unknown"}
- Title: ${enrichment.title ?? "Unknown"}
- Company: ${enrichment.companyName ?? "Unknown"} (${enrichment.companySize ?? "size unknown"} employees)
- Industry: ${enrichment.companyIndustry ?? "Unknown"}
- Funding: ${enrichment.companyFunding ?? "Unknown"}
- Location: ${[enrichment.city, enrichment.country].filter(Boolean).join(", ") || "Unknown"}
- Tech stack: ${enrichment.technologies?.join(", ") || "Unknown"}
`
    : "ENRICHMENT DATA: Not available — analyze from transcript only.";

  const userMessage = `
ARIA'S CALL TRANSCRIPT:
${transcript || "No transcript available"}

${retellSummary ? `RETELL AI SUMMARY:\n${retellSummary}` : ""}

${enrichmentBlock}
`;

  try {
    const { text: raw } = await generateText({
      model: gateway("openai/gpt-4.1-mini"),
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: userMessage },
      ],
    });

    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed  = JSON.parse(cleaned);

    return {
      icpScore:        Math.max(0, Math.min(100, Number(parsed.icpScore) || 0)),
      icpLabel:        parsed.icpLabel === "HOT" ? "HOT" : parsed.icpLabel === "WARM" ? "WARM" : "COLD",
      icpReason:       String(parsed.icpReason || ""),
      summary:         String(parsed.summary || ""),
      talkingPoints:   Array.isArray(parsed.talkingPoints) ? parsed.talkingPoints.slice(0, 3).map(String) : [],
      recommendedTier: String(parsed.recommendedTier || "Discovery"),
    };
  } catch (err) {
    console.error("[analyze-lead] Error:", err);
    return null;
  }
}
