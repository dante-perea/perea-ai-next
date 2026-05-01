import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { findClient } from "@/lib/oauth/db";
import { OAuthAuthorizeForm } from "@/components/oauth/OAuthAuthorizeForm";

export const dynamic = "force-dynamic";

function ErrorPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-white)] p-8 text-center">
        <p className="text-2xl">⚠️</p>
        <h1 className="mt-3 text-base font-semibold text-[var(--color-ink)]">{title}</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{description}</p>
      </div>
    </div>
  );
}

export default async function AuthorizePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;

  const client_id            = p.client_id as string | undefined;
  const redirect_uri         = p.redirect_uri as string | undefined;
  const response_type        = p.response_type as string | undefined;
  const state                = (p.state as string | undefined) ?? "";
  const code_challenge       = p.code_challenge as string | undefined;
  const code_challenge_method = p.code_challenge_method as string | undefined;

  // Per RFC 6749 §4.1.2.1 — errors with missing/invalid client info must NOT redirect
  if (response_type !== "code") {
    return <ErrorPage title="Unsupported response type" description="Only response_type=code is supported." />;
  }
  if (code_challenge_method !== "S256") {
    return <ErrorPage title="Invalid request" description="Only S256 PKCE is supported." />;
  }
  if (!client_id || !redirect_uri || !code_challenge) {
    return <ErrorPage title="Invalid request" description="Missing required OAuth parameters." />;
  }

  const client = await findClient(client_id);
  if (!client) {
    return <ErrorPage title="Unknown client" description="This application is not registered." />;
  }
  if (!client.redirect_uris.includes(redirect_uri)) {
    return <ErrorPage title="Invalid redirect URI" description="The redirect URI does not match the registered client." />;
  }

  const { userId } = await auth();
  if (!userId) {
    const qs = new URLSearchParams({
      client_id,
      redirect_uri,
      response_type: "code",
      state,
      code_challenge,
      code_challenge_method: "S256",
    }).toString();
    redirect(`/login?redirect_url=${encodeURIComponent(`/oauth/authorize?${qs}`)}`);
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";

  return (
    <OAuthAuthorizeForm
      clientId={client_id}
      clientName={client.client_name ?? "Claude Code"}
      redirectUri={redirect_uri}
      state={state}
      codeChallenge={code_challenge}
      userEmail={email}
    />
  );
}
