export function getAllowedEmails(): string[] {
  return (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export function isAllowed(email: string): boolean {
  const allowed = getAllowedEmails();
  // If no allowlist configured, deny all (fail safe)
  if (allowed.length === 0) return false;
  return allowed.includes(email);
}

export function assertAllowed(email: string): void {
  if (!isAllowed(email)) {
    throw new Error("Forbidden: email not in allowlist");
  }
}
