import { auth } from "@clerk/nextjs/server";
import { listAllFiles } from "@/lib/data-lake/meta";
import { DataLakeClient } from "@/components/data-lake/DataLakeClient";

export const dynamic = "force-dynamic";

export default async function DataLakePage() {
  const { sessionClaims } = await auth();
  const email = (sessionClaims?.email as string | undefined) ?? "";

  const files = await listAllFiles().catch(() => []);
  files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  return <DataLakeClient files={files} currentUser={email} />;
}
