import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { findClient, insertCode } from "@/lib/oauth/db";

export async function POST(request: Request): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const action        = formData.get("action") as string;
  const client_id     = formData.get("client_id") as string;
  const redirect_uri  = formData.get("redirect_uri") as string;
  const state         = formData.get("state") as string ?? "";
  const code_challenge = formData.get("code_challenge") as string;

  if (!client_id || !redirect_uri || !code_challenge) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const client = await findClient(client_id);
  if (!client || !client.redirect_uris.includes(redirect_uri)) {
    return NextResponse.json({ error: "unauthorized_client" }, { status: 400 });
  }

  const callbackUrl = new URL(redirect_uri);

  if (action === "deny") {
    callbackUrl.searchParams.set("error", "access_denied");
    if (state) callbackUrl.searchParams.set("state", state);
    return NextResponse.redirect(callbackUrl.toString(), 302);
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";

  const code = crypto.randomUUID();
  const expires_at = new Date(Date.now() + 10 * 60 * 1000);

  await insertCode({ code, client_id, redirect_uri, user_id: userId, user_email: email, code_challenge, expires_at });

  callbackUrl.searchParams.set("code", code);
  if (state) callbackUrl.searchParams.set("state", state);

  return NextResponse.redirect(callbackUrl.toString(), 302);
}
