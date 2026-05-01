import { auth } from "@clerk/nextjs/server";
import { listAllFiles } from "@/lib/knowledge-base/meta";
import { KnowledgeBaseClient } from "@/components/knowledge-base/KnowledgeBaseClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { sessionClaims } = await auth();
  const email = (sessionClaims?.email as string | undefined) ?? "";

  const files = await listAllFiles().catch(() => []);

  return <KnowledgeBaseClient files={files} currentUser={email} />;
}
