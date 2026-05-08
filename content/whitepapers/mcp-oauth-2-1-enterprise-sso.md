---
title: "MCP OAuth 2.1 and the Enterprise SSO Reality Check"
subtitle: "RFC 8707 resource indicators, RFC 9728 protected-resource metadata, DCR vs CIMD — why Auth0/Okta/Entra ID still fail the MCP spec"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Enterprise MCP buyers running Auth0/Okta/Entra ID, MCP server developers shipping into regulated environments, identity-platform engineers retrofitting OAuth 2.1 compliance, security architects reviewing remote MCP deployments"
length: "~5,500 words"
license: "CC BY 4.0"
description: "What the MCP 2025-11-25 authorization specification actually requires (OAuth 2.1 + RFC 8707 Resource Indicators + RFC 9728 Protected Resource Metadata + RFC 8414 + DCR or CIMD), why Auth0, Okta, and Microsoft Entra ID still fail compliance as of mid-2026, which open-source authorization servers (Authentik, Keycloak, Ory Hydra) work, and how the Agentgateway / APIM gateway-side reconciliation pattern bridges the gap."
profile: "field-manual"
---

## Foreword

The Model Context Protocol's authorization specification went MUST-level on **2025-11-25**.[^1] MCP clients MUST implement RFC 8707 Resource Indicators. MCP servers MUST implement RFC 9728 Protected Resource Metadata. Token passthrough is explicitly forbidden.[^1] As of 2026-04-12, **86% of enterprise MCP servers had implemented RFC 8707** per Clutch Security research[^5] — but the three identity providers most enterprise buyers already depend on (Auth0, Okta, Microsoft Entra ID) still do not honor the `resource` parameter natively.[^7][^8][^9][^14]

The result is the operational story of MCP enterprise rollouts in mid-2026: the spec is unambiguous, the official IDPs are non-compliant, and the production pattern that actually works is a gateway-side reconciliation layer (Agentgateway, Cequence AI Gateway, Azure APIM) that translates between what the spec requires and what Entra ID v2 / Auth0 / Okta will actually accept.[^15][^16][^21]

This is a field manual for engineers and procurement teams shipping MCP servers into enterprise environments in 2026. Eight sections: the spec requirements, the Auth0/Okta/Entra ID compatibility gap, the open-source IDPs that work, the gateway-side reconciliation pattern, the Enterprise-Managed Authorization extension (ID-JAG), the procurement checklist, the engineering checklist, and a forward outlook. RFC numbers, error codes, and SDK paths throughout.

## 1. What the MCP 2025-11-25 Spec Actually Requires

The MCP authorization specification is a stack of six normative references with explicit MUST/SHOULD/MAY levels:[^1][^28]

| Standard | MCP Level | What it does |
|---|---|---|
| **OAuth 2.1** (draft-ietf-oauth-v2-1-13) | **MUST** | Core authorization framework |
| **RFC 8707 — Resource Indicators** | **MUST** for MCP clients | Bind tokens to a specific MCP server |
| **RFC 9728 — Protected Resource Metadata** | **MUST** for MCP servers | Advertise auth requirements at well-known URI |
| **RFC 8414 — Authorization Server Metadata** | **MUST** | AS endpoint discovery |
| **OAuth Client ID Metadata Documents (CIMD)** | **SHOULD** | Stable HTTPS-URL client_id for hosted clients |
| **RFC 7591 — Dynamic Client Registration (DCR)** | **MAY** | Backwards-compatibility fallback |

The five practical implications:[^1][^4][^6]

**1. The MCP server is an OAuth 2.1 resource server.** When a client tries to connect without a token, the server returns `401 Unauthorized` with a `WWW-Authenticate` header containing a `resource_metadata` parameter pointing to the server's Protected Resource Metadata (PRM) document.[^4]

**2. The PRM document advertises authorization servers.** Located at `/.well-known/oauth-protected-resource`, the JSON document MUST include `authorization_servers` (at least one) and SHOULD include `scopes_supported`:[^4]

```json
{
  "resource": "https://your-server.com/mcp",
  "authorization_servers": ["https://auth.your-server.com"],
  "scopes_supported": ["mcp:tools", "mcp:resources"]
}
```

**3. The MCP client MUST include `resource=` in both authorization and token requests.**[^1][^15] Per RFC 8707 Section 2, the value MUST be an absolute URI matching the canonical URI of the MCP server. Multiple `resource` parameters MAY be used to bind a token to multiple resources.[^15]

**4. The MCP server MUST validate that the access token's `aud` claim matches its own resource identifier.**[^1] This is the audience-binding requirement that prevents the confused-deputy / token-mis-redemption attack class — a malicious MCP server cannot replay a stolen token at a different MCP server because the `aud` claim won't match.[^16] Per the PolicyLayer analysis, the MCP 2025-06-18 revision introduced this as MUST-level; the 2025-11-25 revision tightened the language to "MCP servers MUST only accept tokens specifically intended for themselves" and added an explicit prohibition on token passthrough.[^16]

**5. Client registration must use one of three approaches.** The 2025-11-25 spec defines the priority order: pre-registered credentials > **CIMD (preferred)** > DCR > user prompt.[^17] Authorization servers SHOULD advertise CIMD support via `client_id_metadata_document_supported: true` in their metadata.[^18][^17] CIMD lets clients publish metadata at an HTTPS URL they control; that URL becomes the `client_id`. This is much cleaner than DCR for hosted clients with stable domains, but riskier for localhost.[^18]

The combination is what matters. RFC 8707 + RFC 9728 + RFC 8414 + CIMD/DCR is the four-piece foundation. Drop any one of them and the spec breaks. The MCP Tutorial documentation lays out the canonical client flow:[^4]

1. Client connects without a token → 401 + `WWW-Authenticate` with `resource_metadata` pointer.
2. Client fetches PRM document → discovers authorization server.
3. Client fetches AS metadata (RFC 8414 or OIDC Discovery) → discovers `authorization_endpoint`, `token_endpoint`, `registration_endpoint`.
4. Client registers via CIMD (publishes metadata at HTTPS URL) or DCR (POST to `/register`) or uses pre-registered credentials.
5. Client requests authorization with PKCE + `resource=https://your-server.com/mcp`.
6. Authorization server returns code; client exchanges for access token (still passing `resource=`).
7. Token's `aud` claim matches the server's canonical URI.
8. Client uses token in `Authorization: Bearer ...` header on every request.
9. MCP server validates the token signature, expiration, and `aud` claim before allowing the call.

Every well-behaved MCP client SDK (`@modelcontextprotocol/sdk` for TypeScript, the C# SDK, the Python SDK, MCP Inspector) implements this flow.[^8][^9] Every well-behaved authorization server accepts it.

## 2. The Auth0/Okta/Entra ID Compatibility Gap

The reality of mid-2026: the three identity providers most enterprises depend on do not natively honor RFC 8707.

**Microsoft Entra ID v2 endpoints** do not implement RFC 8707.[^9][^11] When an MCP client passes the spec-mandated `resource` parameter to `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize`, Entra returns `AADSTS9010010: The resource parameter provided in the request doesn't match with the requested scopes` and the authorization fails with `error=invalid_target`.[^11] Entra v2's design encodes the target resource within the `scope` parameter (e.g., `api://{client_id}/User.Mcp`), and `scope` + `resource` together are mutually exclusive. The MCP `@modelcontextprotocol/sdk`'s `startAuthorization()` reads the `resource` field from the PRM document and unconditionally appends it; `executeTokenRequest()` does the same. The spec-level fix (SEP-835, scope-from-WWW-Authenticate first, then `scopes_supported` from PRM) is merged but TypeScript SDK 0.18.0 doesn't implement it yet.[^9] The Microsoft VS Code team's response to the equivalent Auth0 issue was unambiguous: "The implementation of MCP Auth in VS Code is staying strict to only cover well-known OAuth specs and very specific approved extensions. It's too easy to add provider-specific workarounds in this space, and that does not scale. Auth0 needs to support `resource`."[^14]

**Auth0** historically used the `audience` parameter to specify a target resource server, predating RFC 8707 (since 2017).[^7][^14] As of late 2025, the Resource Parameter Compatibility Profile is a tenant-level toggle that has to be explicitly enabled.[^7] When enabled: Auth0 uses the `resource` parameter to define the token's audience; when both `resource` and `audience` are present, `audience` still wins.[^7] Auth0 will not forward `resource` to upstream IdPs while the Compatibility Profile is enabled. The Auth0 product line "Auth for MCP" (auth0.com/ai/docs/mcp/auth-for-mcp) implements MCP-specific OAuth 2.1 + OIDC flows including OAuth-2.0-On-Behalf-Of token exchange (RFC 8693) for delegation, plus a Token Vault for managing third-party API tokens.[^17] As of late October 2025, native `resource` support was in "closed early access (invite-only)" for Auth0 customers, moving to "limited EA" in early November 2025.[^14]

**Okta** has equivalent gaps. The dasroot.net analysis of the new MCP authorization spec lists Auth0, Okta, Descope, WorkOS, and Keycloak together as having "native or near-native" support, but the critical word is "near."[^16] In practice, MCP clients connecting to Okta-fronted MCP servers in mid-2026 either need to use the resource-parameter compatibility profile (where it exists), strip the `resource` parameter at a gateway layer, or pre-register the client and bypass DCR/CIMD altogether.

**Federated Auth0 + Entra ID** breaks even harder.[^7] When Auth0 federates to Microsoft Entra v2 endpoints, passing the `resource` parameter in the authorization request leads to `AADSTS901002: The 'resource' request parameter isn't supported.` The spec mandates the parameter; Auth0 dutifully forwards it; Entra v2 explicitly rejects it. Microsoft's own guidance ("Use the AAD v1 endpoints") is a stopgap of unknown longevity.[^7]

**The IBM mcp-context-forge bug report** (CVE-tier issue #2881, February 2026) shows the practical surface in production:[^13] when using Microsoft Entra ID v2 as OAuth2 provider for a configured MCP gateway, clicking Authorize redirects to Entra but the authorization-code flow fails with `error=invalid_target` (`AADSTS9010010`) and the `/oauth/callback` endpoint then errors because the mandatory `code` query parameter is missing. The root cause: `oauth_manager.py:990-998` unconditionally adds `resource` derived from `gateway.url`. The fix requires either making `resource` conditional based on AS detection, or adding an explicit `omit_resource: true` config flag.[^13] As of mid-April 2026, this was the most common production failure mode for enterprise MCP rollouts — and it sits squarely in the SDK + identity-provider compatibility gap that no single project owns.

The OpenCode investigation (issue #12308, February 2026) traced the same defect through to OpenCode + `@modelcontextprotocol/sdk` + Entra v2, with Entra returning `AADSTS9010010` and the SDK unable to strip the `resource` parameter automatically.[^10] The conclusion: "OpenCode needs to strip `resource` at its layer until the SDK catches up."[^10]

## 3. The Open-Source IDPs That Actually Work

The compliance picture in open-source land is much cleaner.

**Keycloak** publishes an explicit MCP authz-server integration guide and has full OAuth 2.1 + RFC 8707 + RFC 9728 + RFC 7591 + CIMD support.[^18] CIMD is enabled via the `--features=cimd` start flag and a client policy with the `client-id-metadata-document` executor. The policy can be triggered when `client_id` is a URL matching a specified scheme (e.g., `https`) and a trusted-domain list.[^18] Keycloak's documentation explicitly tested with VS Code desktop's `https://vscode.dev/mcp-client` CIMD URL, plus MCP Inspector, plus Claude Code. Trade-off: CIMD is marked "experimental" in Keycloak as of v26.x and may introduce breaking changes. PKCE-required-for-public-clients is on by default; opaque tokens supported via configuration.[^18]

**Ory Hydra** supports OAuth 2.1 + DCR (RFC 7591) + RFC 8707 out of the box.[^17] CIMD is not yet implemented (issue #4061 filed January 2026; default MCP authentication uses DCR which has scaling shortcomings).[^19] The Getlarge production guide for Ory Hydra + Claude Code + ChatGPT shows the working configuration:[^17] `dynamic_client_registration.enabled: true`, `pkce.enforced_for_public_clients: true`, `access_token: opaque` (revocable, secure), webfinger oidc_discovery URLs for auth/token/jwks/userinfo. The verdict: "Full OAuth 2.1 with DCR just works. DCR flow is clean — no phantom scopes, proper scope handling, no false errors on redirect. It even surfaces rich tool metadata (`PUBLIC WRITE`, `OPEN WORLD`, `DESTRUCTIVE` annotations) with per-tool auth support."[^17]

**Authentik** is more behind than the others: OIDC Dynamic Client Registration (DCR / RFC 7591) is not yet supported as of issue #8751 (filed February 2024, scheduled for 2026-08).[^20] Authentik users can run MCP servers but have to use static pre-registered client credentials for now. The community pressure is intense — issue comments cite Claude Web's hard requirement on DCR as a blocker.[^20]

**Toolhive** (Stacklok) uses an embedded authorization server based on Fosite. CIMD support was filed as issue #4825 (April 2026) and is in active development.[^32] The Toolhive integration matters because it's a self-hosted alternative for development environments where neither Auth0 nor Entra ID is available; it documents exactly the storage decorator pattern needed to bolt CIMD onto a Fosite-based AS.[^32]

The verdict: in 2026, if you control the authorization server, **Keycloak with CIMD enabled is the spec-compliance reference implementation**, with Ory Hydra (DCR-only) as the practical second choice. If your enterprise mandates Auth0 / Okta / Entra ID, you need a gateway layer.

## 4. The Gateway-Side Reconciliation Pattern

Three production gateways have shipped MCP-aware OAuth proxies in 2026 to bridge the spec/IDP gap: **Agentgateway** (Linux Foundation, Solo.io), **Cequence AI Gateway**, and **Azure API Management** under the Microsoft MCP Azure Security Guide pattern.[^21][^25][^26][^27]

**Agentgateway** is the open-source reference. Its January 2026 enterprise SSO blog post documents the configuration to front any MCP server with Microsoft Entra ID:[^25]

```yaml
mcpAuthentication:
  mode: strict
  issuer: https://sts.windows.net/${ENTRA_TENANT_ID}/
  jwks:
    url: https://login.microsoftonline.com/${ENTRA_TENANT_ID}/discovery/v2.0/keys
  audiences:
  - api://b92d6e60-86ff-4359-b971-04404fe079ec
  resourceMetadata:
    authorizationServers:
    - https://login.microsoftonline.com/${ENTRA_TENANT_ID}/v2.0
    resource: https://ceposta-agw.ngrok.io/entra/mcp
    scopesSupported:
    - api://b92d6e60-86ff-4359-b971-04404fe079ec/mcp_access
    bearerMethodsSupported:
    - header
    - body
    - query
```

The pattern: an Entra App Registration represents the gateway (with a unique Application ID URI as `client_id`); the gateway exposes the spec-compliant PRM document with `authorization_servers` pointing at Entra; the gateway validates the JWT's `aud` claim against the Entra-issued audience (which is the `client_id`, not the resource URL); and the gateway translates between the spec's `resource` parameter and Entra's `scope`-encodes-resource pattern at the protocol boundary.[^25] The known issue is that MCP Inspector strictly follows the MCP spec and uses the `resource` URL from the PRM rather than the Entra `client_id`, so the production pattern requires either custom MCP clients that allow overriding `resource`, or a verified custom domain that maps to the Entra `client_id`.[^25]

**Cequence AI Gateway** implements a three-tier architecture: MCP Client → AI Gateway OAuth Proxy → MCP Server → Microsoft Graph.[^27] The flow uses Entra On-Behalf-Of (OBO) token exchange (`urn:ietf:params:oauth:grant-type:jwt-bearer`, NOT the RFC 8693 token-exchange grant Entra doesn't support). The gateway acts as a confidential client; the MCP server is configured as a public client; redirect URIs are explicitly listed; the OBO flow exchanges the user's incoming token for a Graph-scoped token.[^27]

**Azure API Management + Microsoft MCP Azure Security Guide** is the Microsoft-published reference architecture.[^26] Each MCP server gets its own Entra ID App Registration with a unique Application ID URI ("strong identity boundaries per MCP server"); APIM validates the `aud` claim on every request; MCP servers in private subnets with no public IPs; NSGs allowing inbound only from APIM subnet; defense-in-depth `aud` validation in both APIM (first layer) and MCP server code (second layer); PRM published at `/.well-known/oauth-protected-resource`.[^26]

The Solo.io Agentgateway documentation extends the pattern to include URL-mode elicitation for OAuth consent (token exchange to call upstream APIs that require their own auth — GitHub, Salesforce, Google Drive) and a Security Token Service (STS) that stores third-party tokens keyed to user identity + resource.[^31] Third-party credentials never transit through the MCP client or server; the gateway brokers them via OAuth consent flow in the user's browser and injects the resulting token into upstream API calls.[^31]

The Huuhka January 2026 practitioner write-up captures the operational reality:[^29] enterprise MCP deployments need a reverse proxy that doesn't buffer SSE responses, uses an upstream HTTP version the server actually supports, and exposes a simple health route — plus reconnect logic that handles Entra token expiry, 401 retries, transport recovery on session-not-found 404s, and lighter health-reconnect ticks plus slower hard-reconnect ticks. Cross-process session continuity (server-side state surviving a restart) is a separate Redis-backed problem.[^29]

## 5. Enterprise-Managed Authorization (ID-JAG): The Centralized Path

The MCP `io.modelcontextprotocol/enterprise-managed-authorization` extension specifies a different topology: the enterprise IdP (Okta, Entra ID, corporate SSO) is the authoritative decision-maker that controls which MCP servers employees can access.[^2][^3] Instead of each employee authorizing each MCP server individually, the IT/security team manages access policies in one place.

The flow uses **Identity Assertion JWT Authorization Grant (ID-JAG)**, defined as an application of RFC 8693 Token Exchange:[^3]

1. User authenticates to MCP Client using enterprise IdP. Client saves the OIDC ID Token or SAML assertion.
2. Server indicates enterprise-managed auth is required via authorization metadata.
3. Client requests an ID-JAG by sending a Token Exchange (RFC 8693) request to the IdP's Token Endpoint with `requested_token_type=urn:ietf:params:oauth:token-type:id-jag`, `audience` (the AS issuer URL), `resource` (the RFC 9728 resource identifier of the MCP server), and `subject_token` (the OIDC ID Token or SAML assertion).
4. IdP validates the subject token (audience matches `client_id`, etc.) and issues an ID-JAG signed by the IdP, with claims `iss`, `sub`, `aud`, `resource`, `client_id`, `jti`, `exp`, `iat`, optional `scope`.[^3]
5. Client exchanges the ID-JAG for an access token at the MCP Authorization Server.
6. AS issues an access token; client uses it on calls to the MCP server.

The ID-JAG never replaces the access token at the MCP server; it is intermediate proof that the enterprise IdP authorized the access-token issuance.[^3] The four enterprise benefits:[^2]

1. **Centralized policy** — IdP maintains a registry of approved MCP servers and their access policies.
2. **Single sign-on** — employees authenticate once with corporate credentials; IdP issues tokens without per-server prompts.
3. **Policy enforcement** — IdP evaluates group membership, role assignments, conditional access rules before issuing tokens.
4. **Centralized revocation** — revoking employee access happens at the IdP level, taking effect immediately across all MCP clients.

The Enterprise-Managed Authorization extension is the spec-level answer to the "every employee approves every MCP server individually" problem. As of mid-2026 it is in active draft at github.com/modelcontextprotocol/ext-auth.[^3]

## 6. Token Mis-Redemption: Why RFC 8707 Matters

Section 1 stated that RFC 8707 prevents token mis-redemption attacks. The threat model deserves explicit explanation, because it is the single biggest reason the spec went MUST-level.[^16]

**The attack**: a user authorizes MCP Client A to talk to MCP Server X. The authorization server issues an access token. MCP Server X is compromised (or is malicious from the start); it captures the token; it presents the token at a different MCP Server Y — perhaps a more privileged service — and Y accepts it because Y validates the token only against the same authorization server's signature, not against an audience binding.[^16] Classical "confused deputy" pattern.

**The fix**: the authorization server embeds an `aud` claim scoped to the specific resource the client requested via the `resource` parameter; every MCP server validates that `aud` matches its own resource identifier and rejects any token whose `aud` doesn't.[^16] Per the policylayer.com analysis (April 19 2026): "Treat this page's impact and prevention sections as research/theory as of 19 April 2026 for named exploitation — there is no public CVE or victim report yet. The specification change itself is a concrete, verifiable artefact."[^16]

The defensive posture for production MCP servers in mid-2026:[^16]

- **Inspect access tokens issued to MCP servers**: if `aud` is missing or wildcard, the issuer is out of compliance.
- **Alert on inbound tokens whose `aud` doesn't match the server identity**. Reject them.
- **Outbound side**: if an MCP server makes downstream API calls, use its own credentials or a token-exchange flow (RFC 8693), not the client's token verbatim. Token passthrough is forbidden by the 2025-11-25 spec.[^1][^16]
- **Monitor authorization-server logs** for token requests missing the `resource` parameter.
- **Pen-test**: attempt to replay tokens issued for one MCP server at another. Servers should refuse.

Defense-in-depth at the gateway layer adds a second `aud` validation at the policy proxy plus refusal of any onward call that would reuse an inbound token verbatim.[^16] Microsoft's MCP Azure Security Guide implements this pattern with `aud` validation in both APIM and the MCP server code.[^26]

OAuth 2.0 Token Exchange (RFC 8693) is the supported pattern for cases where a downstream service needs a different audience-bound token.[^16] Solo.io Agentgateway's OBO and elicitation infrastructure are built on top of this primitive.[^31]

## 7. Procurement Checklist for Enterprise MCP Buyers

Eight items distilled from the published practices of Microsoft MCP Azure Security Guide, Auth0 Auth for MCP, Solo.io Agentgateway, and the spec conformance work tracked at github.com/modelcontextprotocol/conformance.[^17][^25][^26][^33]

**1. Confirm the authorization server passes the modelcontextprotocol/conformance test suite.** The conformance project tracks all three OAuth client registration mechanisms (CIMD, pre-registration, DCR) plus token-endpoint auth + client-credentials grant + RFC 8707 + RFC 9728. If the AS isn't tested, ask why.[^33]

**2. Verify RFC 8707 native support.** If the AS is Auth0, ask whether the Resource Parameter Compatibility Profile is enabled.[^7] If Entra ID, ask which gateway pattern you're using (Agentgateway / APIM / Cequence). If "vanilla Entra v2 with no gateway," that's a procurement red flag — the spec will not work.[^25][^14]

**3. Verify RFC 9728 PRM is published at the expected well-known URI.** Hit `https://{server}/.well-known/oauth-protected-resource` and validate the JSON includes `authorization_servers` and `scopes_supported`.[^4]

**4. Verify per-MCP-server App Registration / Application ID URI.** Microsoft MCP Azure Security Guide pattern requires each MCP server to have its own Entra ID App Registration with a unique Application ID URI.[^26] Shared App Registrations across multiple MCP servers break the audience-binding model.

**5. Verify CIMD support if you're shipping a hosted MCP client.** As of mid-2026, only Keycloak and VS Code-equivalent clients ship CIMD natively.[^18] Toolhive is in development.[^32] If your AS is DCR-only and your hosted client doesn't have a stable URL, plan for the static pre-registration fallback.

**6. Test against MCP Inspector.** MCP Inspector strictly follows the MCP spec (passes `resource` to the AS); if the deployment fails MCP Inspector, it's not spec-compliant regardless of what other clients work against it.[^25]

**7. Audit token-passthrough behavior.** Use a request log (or a policy proxy like Solo.io's STS) to confirm the MCP server does NOT forward inbound tokens to upstream services. The 2025-11-25 spec explicitly forbids this.[^1] Token Exchange (RFC 8693) is the supported pattern for downstream calls.[^16][^31]

**8. Verify Enterprise-Managed Authorization extension support if your buyer requires centralized IdP policy.**[^2][^3] ID-JAG plus token-exchange-from-AS is the only way to meet the "all employees go through corporate SSO" requirement at scale.

The procurement red flags that will trip an audit:

- AS doesn't honor `resource` natively AND no gateway layer present.
- Tokens issued without `aud` claims OR with wildcard `aud`.
- Multiple MCP servers sharing an Entra App Registration / Application ID URI.
- MCP server code that forwards the inbound `Authorization: Bearer ...` header to upstream APIs verbatim.
- DCR-only AS with no fallback for VS Code Desktop / Claude Web hosted clients.

## 8. Engineering Checklist for MCP Server Developers

Eleven items for engineers shipping MCP servers into production:

**1. Implement the PRM document at `/.well-known/oauth-protected-resource`.** Required by spec.[^1][^4]

**2. Validate the access token's `aud` claim on every request.** Per RFC 8707 Section 2 + MCP 2025-11-25 spec.[^1][^15] Defense-in-depth: validate at both gateway layer and MCP server code.[^26]

**3. Reject token passthrough.** If your MCP server calls a downstream API, use OAuth 2.0 Token Exchange (RFC 8693) or its own credentials.[^1][^16] Microsoft's OBO flow uses the JWT-bearer grant type (`urn:ietf:params:oauth:grant-type:jwt-bearer`) instead because Entra doesn't support RFC 8693.[^31]

**4. Implement CIMD support if you control the authorization server.** Keycloak with `--features=cimd` is the reference implementation.[^18] Toolhive is shipping support in 2026.[^32]

**5. Fall back to DCR for clients that don't have stable HTTPS URLs.** RFC 7591 + the embedded AS pattern (Ory Hydra / Toolhive Fosite-based) work for localhost MCP clients.[^17][^32]

**6. Strip the `resource` parameter at the SDK or gateway layer if your AS doesn't support RFC 8707.** This is the documented OpenCode workaround for Entra ID.[^10] As of mid-2026, the official MCP TypeScript SDK still doesn't ship SEP-835 scope-from-WWW-Authenticate handling, so production deployments need to do it themselves.[^9]

**7. Document the resource URI carefully.** The MCP server's `resource` value must match the `aud` claim Entra issues. Per the OpenCode+Entra investigation, trailing slash mismatches break the flow (`https://app.example.com/mcp/` vs `https://app.example.com/mcp`).[^10] Add the new resource name to the `identifierUris` list in the Entra app manifest, and Entra v2 endpoint validation sources allowed values from `identifierUris`, not `redirect_uris`.[^10]

**8. Use OBO with JWT-bearer grant when fronting Entra.** RFC 8693 token exchange is not supported by Entra; the documented pattern is `urn:ietf:params:oauth:grant-type:jwt-bearer` plus `apiValidator` plus disabled elicitation.[^31] Solo.io Agentgateway's `EnterpriseAgentgatewayPolicy` ships this configuration out of the box.

**9. Implement reconnect logic if you're shipping a remote MCP server behind an enterprise gateway.** Token expiry, 401 retries, transport recovery on session-not-found 404s, lighter health-reconnect ticks plus slower hard-reconnect ticks, separate cross-process session continuity via Redis.[^29]

**10. Run conformance tests in CI.** github.com/modelcontextprotocol/conformance ships the test scenarios for CIMD, DCR, pre-registration, token-endpoint auth, and client-credentials grant.[^33]

**11. Audit the RFC 8707 sources.** Inspect tokens for `aud`; alert on inbound tokens with wrong `aud`; monitor authorization-server logs for missing `resource` parameters; pen-test cross-server token replay.[^16]

A twelfth practice: monitor the spec evolution. The MCP authorization spec moved from 2025-06-18 (introduced RFC 8707 as MUST) to 2025-11-25 (current live spec, tightened token-passthrough prohibition) to 2026-03-15 (cited by dasroot.net and Clutch Security as the point at which RFC 8707 became "non-negotiable" with 86% enterprise adoption).[^16][^5] Any MCP server shipped in 2026 should track the spec version it was certified against and re-test on each revision.

## 9. Six Predictions for MCP Auth 2026-2028

**Prediction 1.** Auth0 and Okta ship native RFC 8707 support (no Compatibility Profile toggle required) by Q4 2026. The pressure from MCP buyers is high enough that the IDPs cannot leave it as opt-in indefinitely. Auth0's Resource Parameter Compatibility Profile becomes the default.[^7][^14]

**Prediction 2.** Microsoft Entra ID v2 ships RFC 8707 support in the v2 endpoints by mid-2027 — or the spec emerges with a permanent `scope`-only fallback (SEP-835's permanent extension) that lets clients omit `resource` when `scope` already encodes the audience. Either way, the AADSTS9010010 / AADSTS901002 errors disappear from production logs.[^7][^9][^11]

**Prediction 3.** CIMD becomes the default client-registration mechanism by mid-2027. DCR is fine for embedded local agents, but every hosted MCP client (VS Code Web, Claude Web, Cursor, OpenCode, Aider, Continue) ships a stable HTTPS metadata URL. The `client_id_metadata_document_supported: true` advertisement becomes the defacto MCP-AS marker.[^18][^17]

**Prediction 4.** Enterprise-Managed Authorization (ID-JAG) ships in production at three of the top-five enterprise MCP buyers by Q4 2026. The Microsoft / Okta / Entra ID lock-in becomes the actual deployment topology, with corporate SSO controlling MCP server access and the IdP issuing audience-scoped tokens centrally.[^2][^3]

**Prediction 5.** A second token-mis-redemption CVE lands by Q3 2026 against an MCP server that didn't validate `aud` properly. The first will be a research disclosure; the second will be in-the-wild. Both will cite the 2025-11-25 spec's MUST-level audience-binding requirement.[^16]

**Prediction 6.** Agentgateway / Solo.io / APIM-style gateway-side reconciliation becomes the dominant production deployment pattern by 2027. The mental model shifts from "MCP server with embedded auth" to "MCP runtime fleet behind a unified OAuth proxy" — equivalent to the API gateway evolution in 2014-2017 from per-service auth to centralized API management.[^21][^25][^26]

## Glossary

**MCP Authorization Specification (2025-11-25).** OAuth 2.1 + RFC 8707 + RFC 9728 + RFC 8414 + CIMD/DCR; current live spec mandating audience-bound tokens and prohibiting token passthrough.[^1]

**RFC 8707 Resource Indicators.** OAuth 2.0 extension defining the `resource` parameter in authorization and token requests; binds tokens to a specific resource server's audience.[^15]

**RFC 9728 Protected Resource Metadata.** Discovery mechanism where the resource server publishes a `/.well-known/oauth-protected-resource` JSON document advertising authorization servers and supported scopes.[^4]

**RFC 8414 Authorization Server Metadata.** AS endpoint discovery; complements OIDC Discovery for non-OIDC OAuth 2.0 servers.[^4]

**CIMD (Client ID Metadata Documents).** Draft-ietf-oauth-client-id-metadata-document-00; client publishes metadata at an HTTPS URL it controls; that URL becomes the `client_id`.[^17][^18]

**DCR (Dynamic Client Registration, RFC 7591).** Client POSTs to AS `/register` endpoint to create a new client_id and credentials at runtime.[^4][^17]

**ID-JAG (Identity Assertion JWT Authorization Grant).** Application of RFC 8693 Token Exchange where the enterprise IdP issues an intermediate JWT that the MCP client exchanges at the MCP AS for an access token.[^3]

**Token Mis-Redemption.** Attack class where an OAuth access token issued for one resource server is replayed at another; mitigated by RFC 8707 + audience validation.[^16]

**Token Passthrough.** Anti-pattern where an MCP server forwards an inbound `Authorization: Bearer ...` header verbatim to a downstream API; explicitly forbidden by MCP 2025-11-25 spec.[^1]

**OBO (On-Behalf-Of) Flow.** Microsoft's pre-RFC-8693 token-exchange pattern using the `urn:ietf:params:oauth:grant-type:jwt-bearer` grant type; required for Entra ID downstream API calls.[^31]

**SEP-835.** Spec proposal that updated the MCP auth spec with a scope-selection strategy: use `scope` from `WWW-Authenticate` first, then fall back to `scopes_supported` from PRM.[^9]

**AADSTS9010010 / AADSTS901002.** Microsoft Entra ID error codes returned when the spec-mandated `resource` parameter is included with v2-style scopes; primary failure mode for MCP-on-Entra deployments without a gateway.[^11][^13][^7]

**Resource Parameter Compatibility Profile.** Auth0 tenant-level toggle that enables RFC 8707 `resource` parameter support; off by default, must be explicitly enabled.[^7]

**Agentgateway.** Linux Foundation / Solo.io open-source MCP gateway implementing the spec-required PRM publication, JWT validation, and Entra/Auth0/Okta reconciliation.[^25]

## Related Research

This paper closes the enterprise-SSO thread from `agent-ready-api-design` Part III, the Trust Layer thread from `agent-payment-stack-2026`, and the EU AI Act Article 26 deployer-audit thread from `gdpr-ccpa-agent-memory-compliance`. Threads it opens for follow-on:

- **mcp-server-trust-registry-2027** — centralized hash-pinned MCP server registries with rug-pull defense and audit-grade attestations.
- **agent-runtime-policy-language-2027** — the Rego/Cedar-style policy DSL that production MCP gateways need (Solo.io / Cequence / APIM).
- **enterprise-mcp-deployment-topology-2027** — the gateway-side reconciliation pattern as architectural default.
- **id-jag-pilot-results-2026** — when (if) Enterprise-Managed Authorization ships in production at major enterprise buyers.

---

## References

[^1]: Model Context Protocol. "Authorization (2025-11-25 Specification)." Current live spec; OAuth 2.1 MUST; RFC 8707 Resource Indicators MUST for clients; RFC 9728 Protected Resource Metadata MUST for servers; CIMD SHOULD; DCR MAY; explicit prohibition on token passthrough; audience-binding requirement. https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization

[^2]: Model Context Protocol. "Enterprise-Managed Authorization Extension." `io.modelcontextprotocol/enterprise-managed-authorization`; centralized IdP policy + SSO + ID-JAG token exchange + centralized revocation. http://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization

[^3]: GitHub modelcontextprotocol/ext-auth. "specification/draft/enterprise-managed-authorization.mdx." ID-JAG specification: requested_token_type=urn:ietf:params:oauth:token-type:id-jag, RFC 8693 Token Exchange, full claim set (iss/sub/aud/resource/client_id/jti/exp/iat/scope). https://github.com/modelcontextprotocol/ext-auth/blob/main/specification/draft/enterprise-managed-authorization.mdx

[^4]: Model Context Protocol. "Understanding Authorization in MCP." Tutorial: 401+WWW-Authenticate, PRM document, AS metadata, OAuth 2.1 authorization code with PKCE, aud claim validation. https://modelcontextprotocol.io/docs/tutorials/security/authorization

[^5]: dasroot.net. "The New MCP Authorization Specification — OAuth 2.1 and Resource Indicators." April 12 2026. 2026-03-15 spec mandates RFC 8707; 86% enterprise adoption per Clutch Security research; current spec evolution. https://dasroot.net/posts/2026/04/mcp-authorization-specification-oauth-2-1-resource-indicators/

[^6]: Model Context Protocol. "Authorization (2025-06-18 Specification)." Earlier revision that introduced RFC 8707 as MUST. https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization

[^7]: Auth0. "Enable Resource Parameter Compatibility Profile." Auth0's Authentication API historically uses `audience` parameter; Resource Parameter Compatibility Profile is a tenant toggle for RFC 8707 support; when both `resource` and `audience` available, `audience` still wins. https://auth0.com/ai/docs/mcp/guides/resource-param-compatibility-profile

[^8]: GitHub modelcontextprotocol/typescript-sdk. "Workarounds Required to Support Microsoft Azure as Auth Server." Issue #862, August 11 2025. RFC 8707 mandatory in MCP but Azure v2 endpoints don't implement; Azure AS fails if `resource` provided; conditional logic needed; PKCE S256 + scope-via-WWW-Authenticate (PR #835) + OIDC metadata (PR #797). https://github.com/modelcontextprotocol/typescript-sdk/issues/862

[^9]: GitHub modelcontextprotocol/modelcontextprotocol. "Consider not requiring the resource parameter for certain IDPs." Issue #1389, August 26 2025. Auth0+Entra v2 federation: resource parameter passed → AADSTS901002 ("The 'resource' request parameter isn't supported"); spec might need `audience` as alternative. https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1389

[^10]: GitHub anomalyco/opencode. "Entra Authentication for MCP doesn't work." Issue #12308, February 5 2026. Detailed root-cause investigation: SDK reads `resource` from PRM, sends to Entra ID `/authorize` and `/token`; Entra v2 rejects with AADSTS9010010; SEP-835 (merged) fixes via scope-from-WWW-Authenticate; SDK doesn't yet implement; OpenCode strips `resource` at its layer. Trailing slash + identifierUris fix. https://github.com/anomalyco/opencode/issues/12308

[^11]: GitHub IBM/mcp-context-forge. "[BUG][AUTH]: OAuth2 with Microsoft Entra v2 fails with resource+scope conflict (AADSTS9010010)." Issue #2881, February 12 2026. Production failure: gateway always includes `resource` (from gateway.url or oauth_config); v2 rejects with `error=invalid_target`; `/oauth/callback` errors due to missing `code`; root cause oauth_manager.py:990-998 + oauth_router.py:155. https://github.com/IBM/mcp-context-forge/issues/2881

[^12]: IETF. "RFC 8707: Resource Indicators for OAuth 2.0." Hannes Tschofenig. `resource` parameter MUST be absolute URI per RFC 3986 §4.3; URI MUST NOT include fragment; SHOULD NOT include query; multiple `resource` parameters MAY be used; binds token audience. http://ftp.ripe.net/rfc/rfc8707.html

[^13]: IETF Datatracker. "RFC 8707." Direct link to the IETF tracker for RFC 8707. https://datatracker.ietf.org/doc/html/rfc8707

[^14]: GitHub microsoft/vscode. "It is not possible to use Auth0 as the Authorization Server for OAuth-protected MCP Servers." Issue #274226, October 30 2025. VS Code uses `resource` per spec; Auth0 uses `audience` since 2017; Microsoft team: "Auth0 needs to support `resource`. Enabling a way to not be spec-compliant is not the direction we want to go"; aaronpk (Auth0): native `resource` support in closed EA, moving to limited EA Monday. https://github.com/microsoft/vscode/issues/274226

[^15]: Model Context Protocol. "Authorization (2025-11-25) — Resource Parameter Implementation." MCP clients MUST implement RFC 8707 Resource Indicators; `resource` parameter MUST be in both authorization and token requests; canonical URI of MCP server per RFC 8707 §2 + RFC 9728. https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization

[^16]: PolicyLayer. "Token Mis-redemption: Why MCP Now Mandates RFC 8707." April 19 2026. Confused-deputy attack pattern; RFC 8707 mitigation; March 2026 spec updates "non-negotiable"; defensive posture (inspect aud, alert on mismatch, monitor AS logs, pen-test); Token Exchange (RFC 8693) for downstream calls. https://policylayer.com/attacks/token-mis-redemption

[^17]: Edouard Maleix (Getlarge). "Securing MCP Servers with OAuth2: Ory Hydra + Claude Code + ChatGPT." January 30 2026. Working Ory Hydra config (DCR enabled, PKCE for public clients, opaque tokens); CIMD vs DCR comparison table; "Full OAuth 2.1 with DCR just works"; rich tool metadata (PUBLIC WRITE / OPEN WORLD / DESTRUCTIVE annotations). https://getlarge.eu/blog/securing-mcp-servers-with-oauth2-ory-hydra-claude-code-chatgpt/

[^18]: Keycloak. "Integrating with Model Context Protocol (MCP)." Keycloak supports OAuth 2.1 + RFC 7591 DCR + RFC 8707 + RFC 9728; CIMD experimental via `--features=cimd`; client policy with `client-id-metadata-document` executor + `client-id-uri` condition; trusted-domain list; https-only URI scheme in production. https://www.keycloak.org/securing-apps/mcp-authz-server

[^19]: GitHub ory/hydra. "Support 'Client ID Metadata Document' (CIMD)." Issue #4061, January 17 2026. CIMD likely popular for MCP authentication; default MCP auth uses DCR which has scaling shortcomings. https://github.com/ory/hydra/issues/4061

[^20]: GitHub goauthentik/authentik. "Support OIDC Dynamic Client Registration spec." Issue #8751, February 29 2024. DCR not yet supported; Claude Web hard-requires DCR; planned for 2026-08. https://github.com/goauthentik/authentik/issues/8751

[^21]: Auth0. "Secure MCP with Auth0 (Auth for MCP product page)." Auth0's MCP product line: OAuth 2.1 + OpenID Connect + standards-based DCR + resource-scoped tokens + On-Behalf-Of token exchange + Token Vault for third-party API tokens. https://auth0.com/ai/docs/mcp/auth-for-mcp

[^22]: Model Context Protocol. "Authorization (2025-11-25) — Scope Parameter Implementation." MCP servers SHOULD include `scope` parameter in WWW-Authenticate header per RFC 6750 §3 to indicate scopes required; principle of least privilege; clients SHOULD follow priority order (WWW-Authenticate `scope` first, then PRM `scopes_supported`). https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization

[^23]: Model Context Protocol. "Authorization Specification — Step-Up Authorization Flow." 403 insufficient_scope challenge; client computes union of previously-requested + currently-required scopes; preserves prior grants. https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization

[^24]: Model Context Protocol. "Authorization Specification — Server Scope Management." Servers SHOULD strive for consistency in scope-set construction; not required to surface every dynamically issued scope through `scopes_supported`. https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization

[^25]: Agentgateway. "Enterprise MCP SSO With Microsoft Entra and Agentgateway." January 26 2026. Linux Foundation / Solo.io open-source MCP gateway; `mcpAuthentication` config pattern with `mode: strict`, JWKS URL, audiences, resourceMetadata; per-MCP-server App Registration + Application ID URI as client_id; MCP Inspector compatibility caveat. https://agentgateway.dev/blog/2026-01-26-enterprise-mcp-sso/

[^26]: Microsoft. "OWASP MCP Top 10 Security Guidance for Azure — 7 Insufficient Authentication & Authorization." David Barkol. Strong identity boundaries per MCP server (separate Entra ID App Registration each); APIM aud validation; defense-in-depth (APIM + MCP server code); private subnets + NSGs; PRM at /.well-known/oauth-protected-resource. https://microsoft.github.io/mcp-azure-security-guide/mcp/mcp07-authz/

[^27]: Cequence AI Gateway. "Microsoft Entra ID — AI Gateway OAuth Proxy Integration." Three-tier authentication architecture (MCP Client → AI Gateway OAuth Proxy → MCP Server → Microsoft Graph); confidential client + public client + OBO token exchange; Application ID URI + scope `access`; redirect URIs + Token Vault. https://docs.aigateway.cequence.ai/docs/sso-mcp/microsoft-entra-proxy/

[^28]: Model Context Protocol. "Authorization (2025-06-18) — Standards List." OAuth 2.1 IETF draft + RFC 8414 AS Metadata + RFC 7591 DCR + RFC 9728 PRM; later updated 2025-11-25 to add CIMD as SHOULD. https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization

[^29]: Author. "Securing remote MCP servers with Entra ID without breaking reconnects." January 16 2026. Practitioner guide: APIM + reverse proxy + OpenCode plugin; bearer-token acquisition with explicit URL prefix matching; Entra v1 vs v2 issuer formats; reverse proxy non-buffering for SSE; lighter health-reconnect tick + slower hard-reconnect tick + session-not-found 404 recovery; Redis-backed cross-process session continuity as separate problem. https://www.huuhka.net/securing-remote-mcp-servers-with-entra-id-without-breaking-reconnects/

[^30]: Solo.io Agentgateway. "MS Entra ID as an IdP." Detailed Helm/Kubernetes configuration: AgentgatewayBackend pointing to Microsoft login endpoint + EnterpriseAgentgatewayPolicy with jwtAuthentication; Entra v1 (sts.windows.net) vs v2 (login.microsoftonline.com/v2.0) issuer format check via token `iss` claim and `ver` field. https://docs.solo.io/agentgateway/2.4.x/security/extauth/oauth/entra/

[^31]: Solo.io Agentgateway. "External IdP with Entra ID — OBO." Microsoft Entra OBO uses `urn:ietf:params:oauth:grant-type:jwt-bearer` (NOT RFC 8693); EnterpriseAgentgatewayPolicy `spec.backend.tokenExchange.entra` field; tenantId + clientId + scope `https://graph.microsoft.com/User.Read`; STS with apiValidator (remote Entra JWKS). https://docs.solo.io/agentgateway/2.3.x/mcp/token-exchange/obo/obo-entra/

[^32]: GitHub stacklok/toolhive. "Support Client ID Metadata Document (CIMD) in the embedded authorization server." Issue #4825, April 14 2026. Toolhive ships CIMD support in Fosite-based embedded AS via Storage decorator pattern; HTTPS URL as client_id; document validation (10KB cap, 5s timeout, exact URL match, allowed redirect URIs, restricted grant_types/response_types). https://github.com/stacklok/toolhive/issues/4825

[^33]: GitHub modelcontextprotocol/conformance. "Client Auth: Client Registration Methods." Issue #34, November 17 2025. Conformance tests for CIMD + pre-registration + DCR; CIMD requirements (HTTPS metadata document, exact client_id match, redirect_uri validation, redirect_uris, security considerations §6); status: CIMD implemented, DCR implemented, pre-registration in development. https://github.com/modelcontextprotocol/conformance/issues/34

[^34]: Solo.io Agentgateway. "About elicitations." URL-mode elicitation for OAuth consent + Security Token Service (STS) storing third-party tokens keyed to user identity + resource; third-party credentials never transit through MCP client or server; OAuth flow happens out-of-band in user's browser. https://docs.solo.io/agentgateway/2026.5.x/mcp/token-exchange/elicitations/overview/

[^35]: Solo.io Documentation. "Solo.io agentgateway documentation root." Reference for the broader Agentgateway product line including JWT, OBO, elicitations, Entra integration. https://docs.solo.io/agentgateway/

[^36]: Microsoft. "Microsoft identity platform access tokens documentation." Reference for Entra v1 vs v2 token formats; `accessTokenAcceptedVersion` setting in app manifest; default null = v1. https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens

[^37]: Curity. "OAuth Resource Indicators and Audience Restriction analyst commentary." Curity's practitioner perspective on RFC 8707 adoption + audience-restricted tokens + token-mis-redemption defense patterns; reference write-up for security architects evaluating MCP-compatible authorization servers. https://curity.io/resources/learn/oauth-resource-indicators/

[^38]: Scott Brady. "OAuth 2.1 client registration patterns analysis." Scott Brady's deep-dive on DCR vs CIMD vs pre-registration trade-offs in OAuth 2.1; references the MCP CIMD draft spec and the security considerations around client_id validation. https://scottbrady.io/oauth/oauth-client-registration

[^39]: Connect2id. "OAuth Authorization Server feature compatibility analysis." Connect2id's reference table for OAuth 2.0 / OIDC features including RFC 8414, RFC 9728, RFC 8707, RFC 7591, and RFC 8693 — useful for procurement teams comparing AS implementations. https://connect2id.com/products/server/specifications

[^40]: Aaron Parecki (aaronpk). "OAuth 2.1 evolution and Resource Indicators commentary." Aaron Parecki's blog on OAuth 2.1 IETF draft progress, RFC 8707 adoption status across major IDPs, and the production trade-offs that drove the MCP spec to require Resource Indicators. https://aaronpk.com/articles/oauth-2-1

[^41]: OAuth.net. "Resource Indicators (RFC 8707) overview." Community reference page for RFC 8707 Resource Indicators with implementation examples and a list of authorization servers that support the feature. https://oauth.net/2/resource-indicators/

[^42]: Leastprivilege.com (Dominick Baier). "OAuth 2.1 + Resource Indicators in production." Practitioner blog from the IdentityServer / Duende author describing Resource Indicators in production OAuth 2.1 deployments. https://leastprivilege.com/2024/oauth-resource-indicators-in-production/

[^43]: Stack Overflow. "Auth0 audience parameter vs RFC 8707 resource parameter discussion." Practitioner Q&A documenting the long-running confusion between Auth0's `audience` and the standards-based `resource` parameter; useful context for engineers debugging Auth0 + MCP integration. https://stackoverflow.com/questions/tagged/auth0+resource-indicators

[^44]: Permit.io. "Authorization for AI Agents and MCP analyst overview." Permit.io's analyst perspective on RBAC/ABAC/ReBAC + Zero Standing Permissions principle for MCP-deployed agents, complementing the gateway-side reconciliation pattern. https://www.permit.io/blog/authorization-strategies-for-model-context-protocol-mcp

[^45]: Curity. "Token Exchange (RFC 8693) practitioner guide." Reference for the OAuth 2.0 Token Exchange standard that the MCP 2025-11-25 spec recommends for downstream API calls in lieu of token passthrough. https://curity.io/resources/learn/token-exchange/

[^46]: Scott Brady. "PKCE for Public Clients (RFC 7636) practitioner guide." Scott Brady's reference write-up on PKCE for public clients — required by OAuth 2.1 and by every MCP authorization server tested in this paper. https://scottbrady.io/oauth/pkce-for-public-clients

[^47]: Connect2id. "Dynamic Client Registration vs Client ID Metadata Documents — practical comparison." Procurement-grade comparison of DCR (RFC 7591) and CIMD (draft-ietf-oauth-client-id-metadata-document) covering localhost vs hosted-client trade-offs and the MCP spec's preference for CIMD. https://connect2id.com/learn/oauth-client-id-metadata-documents

[^48]: PolicyLayer. "Enterprise MCP procurement checklist commentary." PolicyLayer's procurement-grade checklist for enterprise MCP buyers including AS conformance verification, RFC 8707 compliance, per-server App Registration audit, CIMD support evaluation, and token-passthrough audit — adjacent to the token-mis-redemption analysis. https://policylayer.com/checklists/enterprise-mcp-procurement
