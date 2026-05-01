import { auth } from "@clerk/nextjs/server";
import { listAllFiles } from "@/lib/data-lake/meta";
import { DataLakeClient } from "@/components/data-lake/DataLakeClient";

export const dynamic = "force-dynamic";

export default async function DataLakePage() {
  const { sessionClaims } = await auth();
  const email = (sessionClaims?.email as string | undefined) ?? "";

  let files = await listAllFiles().catch(() => []);
  // Sort newest first
  files = files.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  const allTags = [...new Set(files.flatMap((f) => f.tags))].sort();

  return <DataLakeClient files={files} allTags={allTags} currentUser={email} />;
}
