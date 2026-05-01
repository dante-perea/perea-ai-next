import { SignIn } from "@clerk/nextjs";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const { redirect_url } = await searchParams;
  const safe =
    redirect_url?.startsWith("/") && !redirect_url.startsWith("//")
      ? redirect_url
      : "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
      <SignIn forceRedirectUrl={safe} />
    </div>
  );
}
