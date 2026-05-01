import { SignJWT, jwtVerify } from "jose";

const ISSUER   = "https://perea.ai";
const AUDIENCE = "https://perea.ai/api/mcp/server";

function secret(): Uint8Array {
  const hex = process.env.MCP_JWT_SECRET!;
  return Uint8Array.from({ length: 32 }, (_, i) =>
    parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  );
}

export async function signAccessToken(sub: string, email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret());
}

export async function verifyAccessToken(token: string): Promise<{ sub: string; email: string }> {
  const { payload } = await jwtVerify(token, secret(), {
    issuer: ISSUER,
    audience: AUDIENCE,
    algorithms: ["HS256"],
  });
  return { sub: payload.sub as string, email: payload["email"] as string };
}
