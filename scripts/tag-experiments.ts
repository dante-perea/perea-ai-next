import { generateText } from "ai";
import { gateway } from "../lib/ai";
import { getAllExperiments, updateExperimentTags } from "../lib/learning/ghost-db";

async function inferTags(hypothesis: string, learning: string | null, outcome: string): Promise<{
  project_tag: string;
  category: string;
  feature_tag: string | null;
}> {
  const prompt = `You are tagging a startup experiment for a founder who works across multiple products.

Experiment:
Hypothesis: ${hypothesis}
Outcome: ${outcome}
Learning: ${learning ?? "none"}

Classify into exactly this JSON (no extra text):
{
  "project_tag": "infer the startup or project name from the hypothesis content — always provide one, never null (e.g. perea-ai, unifounder, 999x, tierra-flint, or another name if evident)",
  "category": "one of: product | marketing | growth | ops | gtm | distribution | other",
  "feature_tag": "short kebab-case slug of the specific feature or area being tested (e.g. experiment-tracker, linkedin-connector, oauth-flow, mcp-server) — null only if truly impossible to infer"
}`;

  const { text } = await generateText({
    model: gateway("xai/grok-4.3"),
    messages: [{ role: "user", content: prompt }],
    maxOutputTokens: 128,
  });

  const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
  return {
    project_tag: parsed.project_tag ?? "unknown",
    category: parsed.category ?? "other",
    feature_tag: parsed.feature_tag ?? null,
  };
}

async function main() {
  const experiments = await getAllExperiments();
  console.log(`Tagging ${experiments.length} experiments with Grok 4.3...\n`);

  let done = 0;
  for (const exp of experiments) {
    try {
      const tags = await inferTags(exp.hypothesis, exp.learning, exp.outcome);
      await updateExperimentTags(exp.id, {
        project_tag: tags.project_tag,
        experiment_type: tags.category,
        feature_tag: tags.feature_tag,
      });
      done++;
      console.log(`[${done}/${experiments.length}] ${exp.id}`);
      console.log(`  startup: ${tags.project_tag} | type: ${tags.category} | feature: ${tags.feature_tag ?? "—"}`);
    } catch (err) {
      console.warn(`  skipped ${exp.id}: ${err instanceof Error ? err.message : err}`);
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\nDone. Tagged ${done}/${experiments.length} experiments.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
