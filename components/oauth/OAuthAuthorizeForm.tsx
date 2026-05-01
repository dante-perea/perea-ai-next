"use client";

interface OAuthAuthorizeFormProps {
  clientId: string;
  clientName: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
  userEmail: string;
}

export function OAuthAuthorizeForm({
  clientId,
  clientName,
  redirectUri,
  state,
  codeChallenge,
  userEmail,
}: OAuthAuthorizeFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-white)] p-8 shadow-sm">
        <div className="mb-6 text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-[var(--color-ink-muted)]">
            perea.ai
          </p>
          <h1 className="mt-3 text-lg font-semibold text-[var(--color-ink)]">
            Authorize access
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            <span className="font-medium text-[var(--color-ink)]">{clientName}</span> wants to
            access your Knowledge Base
          </p>
        </div>

        <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
          <p className="text-xs text-[var(--color-ink-faint)]">Signed in as</p>
          <p className="mt-0.5 text-sm font-mono text-[var(--color-ink)]">{userEmail}</p>
        </div>

        <div className="mb-6 space-y-2 text-xs text-[var(--color-ink-muted)]">
          <p className="font-medium text-[var(--color-ink-soft)]">This will allow:</p>
          <ul className="space-y-1 pl-3">
            <li>· List files in your knowledge base</li>
            <li>· Read file contents</li>
          </ul>
        </div>

        <div className="space-y-3">
          <form method="POST" action="/api/oauth/authorize">
            <input type="hidden" name="client_id"      value={clientId} />
            <input type="hidden" name="redirect_uri"   value={redirectUri} />
            <input type="hidden" name="state"          value={state} />
            <input type="hidden" name="code_challenge" value={codeChallenge} />
            <input type="hidden" name="action"         value="approve" />
            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Approve
            </button>
          </form>

          <form method="POST" action="/api/oauth/authorize">
            <input type="hidden" name="client_id"      value={clientId} />
            <input type="hidden" name="redirect_uri"   value={redirectUri} />
            <input type="hidden" name="state"          value={state} />
            <input type="hidden" name="code_challenge" value={codeChallenge} />
            <input type="hidden" name="action"         value="deny" />
            <button
              type="submit"
              className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-bg-card)]"
            >
              Deny
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
