import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  insertRemovalRequest,
  updateRemovalProgress,
  markPaperRemovedInRoadmap,
  removeFromXQueue,
  findScheduledXPostForSlug,
  type RemovalReasonCategory,
} from "@/lib/operator-state";

export const runtime = "nodejs";

const VALID_CATEGORIES: RemovalReasonCategory[] = [
  "quality",
  "topic",
  "stale",
  "duplicate",
  "other",
];

const SAFE_SLUG = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

const REPO_OWNER = "dante-perea";
const REPO_NAME = "perea-ai-next";
const REPO_PATH_PREFIX = "content/whitepapers";

async function ghDeleteWhitepaper(opts: {
  slug: string;
  token: string;
  reason: string;
}): Promise<{ ok: true; sha: string } | { ok: false; error: string }> {
  const path = `${REPO_PATH_PREFIX}/${opts.slug}.md`;
  const headers = {
    Authorization: `Bearer ${opts.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "perea-dashboard",
  };

  // Fetch current SHA — required for the delete API.
  const getRes = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=main`,
    { headers },
  );
  if (!getRes.ok) {
    return {
      ok: false,
      error: `GET contents failed: ${getRes.status} ${await getRes.text()}`,
    };
  }
  const getJson = (await getRes.json()) as { sha?: string };
  if (!getJson.sha) {
    return { ok: false, error: "GET contents returned no sha" };
  }

  const delRes = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
    {
      method: "DELETE",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `chore(operator): remove ${opts.slug} — ${opts.reason}`,
        sha: getJson.sha,
        branch: "main",
      }),
    },
  );
  if (!delRes.ok) {
    return {
      ok: false,
      error: `DELETE contents failed: ${delRes.status} ${await delRes.text()}`,
    };
  }
  const delJson = (await delRes.json()) as { commit?: { sha?: string } };
  return { ok: true, sha: delJson.commit?.sha ?? "unknown" };
}

async function omnisocialsDeletePost(opts: {
  postId: string;
  apiKey: string;
}): Promise<{ ok: boolean; error?: string }> {
  // The omnisocials REST shape mirrors the CLI: DELETE /posts/<id>.
  // Endpoint and auth header documented in the omnisocials skill state.
  const res = await fetch(
    `https://api.omnisocials.com/v1/posts/${encodeURIComponent(opts.postId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        "User-Agent": "perea-dashboard",
      },
    },
  );
  if (!res.ok && res.status !== 404) {
    return { ok: false, error: `${res.status} ${await res.text()}` };
  }
  return { ok: true };
}

export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const email = (sessionClaims?.email as string | undefined) ?? "";
  const operatorEmail = process.env.OPERATOR_EMAIL ?? "";
  if (!operatorEmail) {
    return new NextResponse(
      "OPERATOR_EMAIL not configured on the server.",
      { status: 503 },
    );
  }
  if (email.toLowerCase() !== operatorEmail.toLowerCase()) {
    return new NextResponse("Forbidden: operator-only action.", { status: 403 });
  }

  const ghToken = process.env.GITHUB_PAT;
  if (!ghToken) {
    return new NextResponse(
      "GITHUB_PAT not configured on the server.",
      { status: 503 },
    );
  }

  let body: { slug?: unknown; reasonCategory?: unknown; notes?: unknown };
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!SAFE_SLUG.test(slug)) {
    return new NextResponse("Invalid slug", { status: 400 });
  }
  const reasonCategory =
    typeof body.reasonCategory === "string"
      ? (body.reasonCategory as RemovalReasonCategory)
      : "other";
  if (!VALID_CATEGORIES.includes(reasonCategory)) {
    return new NextResponse("Invalid reason category", { status: 400 });
  }
  const notes =
    typeof body.notes === "string" && body.notes.trim().length > 0
      ? body.notes.trim().slice(0, 2000)
      : null;

  // 1. Audit row
  let removalId: string;
  try {
    removalId = await insertRemovalRequest({
      slug,
      requestedBy: userId,
      reasonCategory,
      notes,
    });
  } catch (err) {
    console.error("audit insert failed:", err);
    return new NextResponse("Audit insert failed", { status: 500 });
  }

  // 2. Find scheduled X post (if any) BEFORE deleting the .md, so we don't
  //    lose the linkage if Neon and gh delete diverge.
  const scheduledX = await findScheduledXPostForSlug(slug).catch(() => null);

  // 3. Delete the .md file from the repo.
  const ghResult = await ghDeleteWhitepaper({
    slug,
    token: ghToken,
    reason: `${reasonCategory}${notes ? ` (${notes.slice(0, 120)})` : ""}`,
  });
  await updateRemovalProgress(removalId, {
    ghDeleteStatus: ghResult.ok ? "success" : "failed",
    ghDeleteCommitSha: ghResult.ok ? ghResult.sha : undefined,
  });
  if (!ghResult.ok) {
    return new NextResponse(
      `gh delete failed; audit row ${removalId} preserved. Detail: ${ghResult.error}`,
      { status: 502 },
    );
  }

  // 4. Delete the scheduled X post if it existed.
  if (scheduledX) {
    const omnisocialsKey = process.env.OMNISOCIALS_API_KEY;
    if (!omnisocialsKey) {
      await updateRemovalProgress(removalId, {
        xPostIdDeleted: scheduledX.omnisocialsPostId,
        xPostDeleteStatus: "skipped:no-key",
      });
    } else {
      const xResult = await omnisocialsDeletePost({
        postId: scheduledX.omnisocialsPostId,
        apiKey: omnisocialsKey,
      });
      await updateRemovalProgress(removalId, {
        xPostIdDeleted: scheduledX.omnisocialsPostId,
        xPostDeleteStatus: xResult.ok ? "success" : `failed:${xResult.error ?? "?"}`,
      });
      if (xResult.ok) {
        await removeFromXQueue(scheduledX.omnisocialsPostId).catch(() => {});
      }
    }
  }

  // 5. Mark roadmap entry as removed.
  await markPaperRemovedInRoadmap(slug).catch(() => {});

  await updateRemovalProgress(removalId, {
    completedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    removalId,
    ghCommitSha: ghResult.sha,
    xPostDeleted: scheduledX?.omnisocialsPostId ?? null,
  });
}
