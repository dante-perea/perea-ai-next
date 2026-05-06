import { ClerkProvider } from "@clerk/nextjs";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
