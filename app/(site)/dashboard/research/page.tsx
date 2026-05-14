import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { listResearch } from "@/lib/research";
import {
  listRoadmap,
  listRecentShipped,
  listXQueue,
  listSeeds,
} from "@/lib/operator-state";
import { ResearchConsoleClient } from "@/components/dashboard/ResearchConsoleClient";

export const dynamic = "force-dynamic";

export default async function ResearchConsolePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/login");

  const email = (sessionClaims?.email as string | undefined) ?? "";
  const operatorEmail = process.env.OPERATOR_EMAIL ?? "";
  const isOperator =
    operatorEmail.length > 0 && email.toLowerCase() === operatorEmail.toLowerCase();

  const { tab } = await searchParams;
  const activeTab = tab === "published" ? "published" : "backlog";

  // Read mirrors from Neon. If the engines haven't synced yet, these come
  // back empty — the client renders a helpful empty state explaining the
  // pending engine-sync change.
  const [roadmap, shipped, xQueue, seeds] = await Promise.all([
    listRoadmap({ statuses: ["backlog", "in_flight"], limit: 50 }).catch(() => []),
    listRecentShipped(10).catch(() => []),
    listXQueue(50).catch(() => []),
    listSeeds(20).catch(() => []),
  ]);

  // Published papers are sourced from the filesystem (content/whitepapers/),
  // not from Neon — they're the authoritative list of what's live, and the
  // remove flow targets a file path anyway.
  const published = listResearch("en").map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title ?? p.slug,
    date: p.frontmatter.date ?? "",
    subtitle: p.frontmatter.subtitle ?? "",
  }));

  return (
    <ResearchConsoleClient
      activeTab={activeTab}
      roadmap={roadmap}
      shipped={shipped}
      xQueue={xQueue}
      seeds={seeds}
      published={published}
      isOperator={isOperator}
      operatorEmailConfigured={operatorEmail.length > 0}
      currentEmail={email}
    />
  );
}
