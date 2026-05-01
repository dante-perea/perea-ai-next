"use client";

import { useState } from "react";

const SERVER_URL = "https://perea.ai/api/mcp/server";

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      className="shrink-0 rounded px-2 py-1 text-xs font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-colors"
    >
      {copied ? "Copied!" : (label ?? "Copy")}
    </button>
  );
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="relative rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)]">
        <span className="text-xs text-[var(--color-ink-faint)] font-mono">{language ?? "bash"}</span>
        <CopyButton text={code} />
      </div>
      <pre className="px-4 py-3 text-sm font-mono text-[var(--color-ink)] overflow-x-auto whitespace-pre-wrap break-all">
        {code}
      </pre>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-[var(--color-ink)]">{title}</h2>
      {children}
    </section>
  );
}

function Tool({ name, description, params }: { name: string; description: string; params: { name: string; type: string; required: boolean; description: string }[] }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] p-4 space-y-3">
      <div>
        <span className="font-mono text-sm font-semibold text-[var(--color-accent)]">{name}</span>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{description}</p>
      </div>
      {params.length > 0 && (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[var(--color-ink-faint)] uppercase tracking-wide">
              <th className="pb-1 pr-4 font-semibold">Param</th>
              <th className="pb-1 pr-4 font-semibold">Type</th>
              <th className="pb-1 pr-4 font-semibold">Required</th>
              <th className="pb-1 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="text-[var(--color-ink-soft)]">
            {params.map((p) => (
              <tr key={p.name}>
                <td className="py-0.5 pr-4 font-mono text-[var(--color-ink)]">{p.name}</td>
                <td className="py-0.5 pr-4 font-mono text-[var(--color-ink-muted)]">{p.type}</td>
                <td className="py-0.5 pr-4">{p.required ? "yes" : "no"}</td>
                <td className="py-0.5">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function McpDocs() {
  const addCommand = `claude mcp add --transport http perea-knowledge-base ${SERVER_URL}`;

  const mcpJson = JSON.stringify(
    { mcpServers: { "perea-knowledge-base": { type: "http", url: SERVER_URL } } },
    null,
    2
  );

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-ink)]">MCP Server</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Connect Claude Code to your knowledge base. A browser login flow handles authentication automatically.
        </p>
      </div>

      <Section title="Quick add — Claude Code CLI">
        <p className="text-sm text-[var(--color-ink-muted)]">
          Run once in any terminal. Claude Code opens your browser for login, then stores the token automatically.
        </p>
        <CodeBlock code={addCommand} />
      </Section>

      <Section title="Alternative — .mcp.json (per-project)">
        <p className="text-sm text-[var(--color-ink-muted)]">
          Drop a <span className="font-mono text-xs">.mcp.json</span> at the root of any project. Claude Code picks it up automatically and will prompt for login on first use.
        </p>
        <CodeBlock code={mcpJson} language="json" />
      </Section>

      <Section title="Available tools">
        <div className="space-y-3">
          <Tool
            name="list_files"
            description="List all files in the knowledge base. Optionally filter by a tag."
            params={[
              { name: "tag", type: "string", required: false, description: "Only return files that include this tag." },
            ]}
          />
          <Tool
            name="get_file_content"
            description="Fetch a file's raw content by ID. Returns base64-encoded data, filename, and content type."
            params={[
              { name: "id", type: "string", required: true, description: "The file ID from list_files." },
            ]}
          />
        </div>
      </Section>

      <Section title="Example workflows">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--color-ink-soft)]">Download all files to artifacts/</p>
            <CodeBlock code="List all files in my knowledge base, download each one, and save them to the artifacts/ folder." language="prompt" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--color-ink-soft)]">Download by tag</p>
            <CodeBlock code={'Download all files tagged "research" from my knowledge base to artifacts/.'} language="prompt" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--color-ink-soft)]">Build a knowledge graph with graphify</p>
            <CodeBlock code="Download all knowledge base files to artifacts/, then run graphify on the folder to build a knowledge graph." language="prompt" />
          </div>
        </div>
      </Section>

      <Section title="Server endpoint">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] p-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-ink-faint)]">URL</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[var(--color-ink)]">{SERVER_URL}</span>
              <CopyButton text={SERVER_URL} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-ink-faint)]">Auth</span>
            <span className="font-mono text-xs text-[var(--color-ink-muted)]">OAuth 2.0 + PKCE (browser login)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-ink-faint)]">Transport</span>
            <span className="font-mono text-xs text-[var(--color-ink-muted)]">Streamable HTTP (MCP 2025-03-26)</span>
          </div>
        </div>
      </Section>
    </div>
  );
}
