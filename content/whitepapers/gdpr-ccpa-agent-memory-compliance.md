---
title: "Right to Be Forgotten in Agent Memory: GDPR + CCPA Architectures for 2026"
subtitle: "Write wrappers, external indices, deletion APIs, the embedding-deletion provability gap, ADMT pre-use notices"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Engineers building agent memory layers, privacy lawyers preparing DSAR pipelines, compliance officers drafting Annex IV technical files, founders shipping production agents into EU + California markets"
length: "~5,500 words"
license: "CC BY 4.0"
description: "How to architect GDPR Article 17 + CCPA Section 1798.105 deletion compliance into agent memory by design — not retrofitted after a regulator's letter arrives. Covers the three-part write-wrapper + external-index + deletion-API pattern (Astraea Counsel), commercial vector database deletion behavior (Pinecone delete-by-metadata GA Oct 30 2025, Qdrant JWT RBAC, Weaviate per-tenant shards, Databricks Delta-Sync Index CDF cascades), the provable-deletion gap in vector embeddings, EU AI Act Article 12 automatic event logging effective August 2 2026, and California ADMT pre-use notice rules in force January 1 2027."
profile: "field-manual"
---

## Foreword

Three regulatory deadlines collide in 2026-2027 to make agent-memory deletion architecture an engineering must-have rather than a compliance afterthought. **GDPR Article 17** has applied since 2018; the European Data Protection Board's February 2026 Coordinated Enforcement Framework report raised the bar specifically for AI memory and embedding stores.[^14] **EU AI Act Article 12** automatic event-logging obligations for high-risk AI systems become enforceable on **2 August 2026**.[^1][^2] **California ADMT regulations** under the CCPA (§7200-7222, Article 11) became operative **1 January 2026** with full compliance for businesses using ADMT for significant decisions required by **1 January 2027**.[^4][^5][^8]

The structural problem: agent memory is a "third copy" of personal data, often invisible to the deletion pipeline. When a user files a DSAR, the team kills the row in Postgres, purges the cached document in S3, rotates the cached PDFs out of the CDN — and forgets the vector embeddings, the agent's `/memories` directory, and the LangGraph checkpointer state.[^12] Six months later, an analytics engineer pulls a sample of `float[1536]` arrays for a clustering experiment, runs them through a publicly available inversion model, and reconstructs roughly nine in ten of the original 32-token chunks — including the documents the company "deleted."[^12]

This is a field manual for engineers and compliance teams that need to ship deletion architecture *before* the first DSAR arrives. Eight sections: the legal frame (CCPA + GDPR + EU AI Act), the embedding-as-personal-data problem, the three-part write-wrapper architecture, vector database deletion behavior in 2026, EU AI Act Article 12 logging for high-risk AI memory, the ADMT pre-use notice pipeline, the engineering checklist, and the forward outlook. CVE IDs, regulatory citations, and SDK names throughout.

## 1. The Legal Frame: Three Regimes, One Architecture

**GDPR Article 17** grants every EU data subject the right to obtain erasure of personal data concerning them "without undue delay" — controllers must comply within one month of receipt, extendable to three months for complex cases.[^18][^9] Article 4(1) defines personal data as "any information relating to an identified or identifiable natural person."[^15] The definition is broad enough to capture anything an AI agent writes about a user.[^9]

**CCPA Section 1798.105** grants California consumers the right to request deletion of personal information a business has collected.[^9] Section 1798.140 defines personal information as anything that "identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer or household."[^9] Both definitions are broad enough that agent memory falls squarely inside.

**California ADMT regulations** under the CCPA (Article 11, sections §7200-§7222) were finalized September 22 2025 and became operative January 1 2026.[^4][^5][^6][^7][^8] The regulations apply to businesses that use Automated Decisionmaking Technology (ADMT) to make a "significant decision" — defined as one that affects finances, housing, education, employment, or health care (advertising was removed in the final draft).[^27] Full compliance is required by **January 1, 2027** for businesses using ADMT for significant decisions.[^5][^28] The regulations require a Pre-use Notice (§7220), the right to opt out of ADMT (§7221), the right to access ADMT (§7222), and risk assessments (initial assessments due December 31, 2027 for processing activities already underway, with risk-assessment metadata submitted to the CPPA by April 1, 2028).[^27]

**EU AI Act Article 11 + Annex IV** require providers of high-risk AI systems to draw up technical documentation before market placement, with a 10-year retention obligation under Article 18.[^3] **Article 12** then layers automatic event-logging obligations on top: "high-risk AI systems shall technically allow for the automatic recording of events (logs) over the lifetime of the system."[^1][^2] Logging must enable identification of risk situations under Article 79(1), facilitate post-market monitoring under Article 72, and support deployer monitoring under Article 26(5).[^1][^29] The deployer-side retention obligation under Article 26(6) is at minimum 6 months unless other EU/national law requires longer.[^25][^26]

The intersection is what makes 2026 distinctive. A B2A SaaS shipping an agent that remembers users in an EU + California market faces three overlapping regimes with three different deadline cadences and three different documentation requirements. The same memory record may need to be (a) deletable on user request within 30 days under GDPR/CCPA, (b) logged automatically with tamper-evident sequencing under EU AI Act Article 12 if the use case is high-risk, and (c) accompanied by a Pre-use Notice and opt-out flow if it informs a significant decision under California ADMT regulations. Architecture decisions made now determine whether the team can satisfy all three with one pipeline or has to retrofit each separately.

## 2. The Embedding-as-Personal-Data Problem

Vector embeddings derived from personal data are personal data unless the controller can document an anonymity assessment proving otherwise. The default is yes.[^15]

The legal test from GDPR Article 4(1) is simple: if anyone with reasonable means can recover the underlying personal data from a vector, the vector relates to an identifiable person and is personal data.[^15] The empirical answer in 2026 is also yes. Vec2text-style embedding-inversion attacks reliably reconstruct the original 32-token text chunks from `float[1536]` arrays, including for production embedding models.[^12]

Three regulators have moved in the same direction.[^15] The **EDPB's Opinion 28/2024** (December 2024, requested by the Irish DPA) addressed AI models specifically, but the reasoning transfers cleanly: a vector store is a derived representation of personal data, the extraction risk is embedding inversion, the query risk is similarity search returning chunks that contain or imply personal data, and the controller would have to prove both are insignificant. Vec2text attacks make the extraction argument hard. Standard RAG retrieval makes the query argument almost guaranteed.

The **CNIL Q&A on generative AI** (French DPA) is direct: the deployer connecting a generative AI system to its own knowledge base is responsible for that processing when the knowledge base contains personal data, with full controller obligations.[^15] The **UK ICO's December 2024 generative AI consultation response** says developers must design systems that allow specific individuals' personal data to be identified at every stage, including the training set and the model itself.[^15]

The practical implication: pseudonymized vectors remain personal data under GDPR Recital 26.[^15] Pseudonymization lowers risk and supports your legal basis but does not exempt you from controller obligations. Verbal claims of anonymity do not survive a regulator's questions; the EDPB explicitly requires written anonymity-assessment documentation on request.[^15]

The **three deletability tiers** framework from the notraced/Shephard analysis (April 2026) is the operational map.[^14] **Tier 1**: what you can delete today with a defined path — application logs, prompt history, retrieval sources, caches, and vector embeddings *with a lineage table*. **Tier 2**: what your AI provider controls and you have to request — provider logs, fine-tune artifacts held by the provider. **Tier 3**: what no one can provably delete in 2026 — fine-tuned weights, base model weights, and anything the model has truly memorized in its parameters.[^14] Machine unlearning is the research direction trying to close Tier 3, but as the Carnegie Mellon April 2025 benchmark analysis concluded, current unlearning benchmarks test whether the model can no longer recite forgotten content — not whether it no longer "knows" it in a way a regulator would accept.[^14] Subsequent paraphrase-attack and relearning-with-small-data work shows many "unlearned" models can be re-elicited.[^14]

The defensible 2026 position: delete Tier 1 on a defined path, request deletion at providers for Tier 2, and hold a "reasonable steps" file for Tier 3 documenting what personal data was excluded from training, why unlearning is not relied upon, and how the retraining path would work if needed.[^14]

## 3. The Three-Part Architecture: Write Wrapper, External Index, Deletion API

The canonical architecture for GDPR/CCPA-compliant agent memory was crystallized by Astraea Counsel's April 2026 analysis.[^9] If the agent decides what to store, in files it names, with no external index keyed to user identity — you cannot comply with a deletion request. The architectural fix has three parts:

**1. Write Wrapper.** Every memory write passes through a deployer-controlled middleware layer that intercepts the agent's file operations *before* they reach storage.[^9] The wrapper inspects the content, tags each file with the user identity or identities referenced, and writes the tag as metadata alongside the file. Without this wrapper, the agent's `/memories` directory becomes a black box: files named whatever the agent decided, content keyed to whatever the agent thought was important, no path from a user identifier back to the files that mention them.

**2. External Index.** A lookup table mapping user identifiers to the memory files that reference them.[^9] When a deletion request arrives, the compliance team queries the index — not the memory files themselves — and retrieves every file associated with the requesting user. The index is the data structure that makes deletion answerable in 30 days.

**3. Deletion API.** A programmatic interface that purges all memory files associated with a given user identity, including the index entries.[^9] The API logs the deletion for compliance audit trails — both CCPA and GDPR require documentation that the request was fulfilled.

The Kronvex production implementation illustrates the pattern in code:[^18][^19]

```python
def handle_erasure_request(user_id: str, api_key: str) -> dict:
    response = httpx.delete(
        "https://api.kronvex.io/api/v1/gdpr/erasure",
        headers={"X-API-Key": api_key},
        json={"user_id": user_id},
    )
    response.raise_for_status()
    result = response.json()
    compliance_log.write({
        "event": "gdpr_erasure",
        "user_id": user_id,
        "deleted_records": result["deleted_memories"],
        "timestamp": datetime.utcnow().isoformat(),
        "confirmed": result["status"] == "erased",
    })
    return result
```

The Mem0 SDK exposes a similar primitive: `client.delete_all(user_id=...)` removes all memory entries, vector embeddings, metadata, and graph nodes for that user_id, with no recycle bin or soft-delete.[^20] The architectural property is the same in both cases: every memory entry, embedding, and metadata record carries the `user_id` as a first-class field from the moment of insertion, so erasure is a scoped delete operation rather than a data-forensics exercise.

The CallSphere RTBF architecture extends the pattern with three additional discipline points:[^16] split episodic from semantic memory (different retention and recall patterns), decay aggressively (memory that never decays accumulates noise), and ship the deletion endpoint *before* launch (before users exist to comply for). The cost of bolting on durable state at month 6 is roughly 5× the cost of getting it right at week 2.[^16]

The compliance requirements that the API must satisfy:[^18]

- **30 days** to complete erasure (extendable to 3 months for complex cases under GDPR Article 17(3)).
- **Cascade to processors**: notify downstream processors (memory API providers, vector DB vendors, fine-tuning datasets if applicable) of erasure requests and confirm they have been actioned.
- **User confirmation**: confirm to the user that erasure has been completed.
- **Audit trail**: keep a record of the request, your actions, and the confirmation — but not the deleted data itself.
- **Backups**: data deleted from live systems must also be removed from backups within the normal backup rotation schedule.

## 4. Vector Database Deletion Behavior in 2026

The architecture above is necessary but not sufficient. The vector database itself has to support provable deletion at the storage layer, and as of early 2026 no major commercial vector database offers a cryptographic guarantee that a deleted vector is unrecoverable from disk pages, replication streams, or backup tapes.[^12]

**Pinecone** added bulk Update / Delete / Fetch by Metadata operations on **October 30, 2025**, with delete-by-metadata generally available.[^10] The new operations leverage the same filter syntax as queries:

```python
index.delete(
    namespace="example-namespace",
    filter={"user_id": {"$eq": "user-123"}}
)
```

Pinecone's blog post explicitly calls out GDPR right-to-be-forgotten as a primary use case for delete-by-metadata.[^10] But there are operational caveats. Serverless Pinecone indexes don't support delete-by-metadata at all — only delete-by-ID-prefix — which means the team needs to have maintained a mapping from user identity to vector IDs at ingestion time.[^13] If they didn't, deletion becomes a full-scan operation. Pinecone hard delete (`index.delete()`) also has a lag on large namespaces; production teams should add a small retry loop when verifying deletion.[^30]

**Weaviate's** multi-tenancy model gives each tenant a dedicated shard with separate inverted index, vector index, and metadata buckets.[^13] Deleting a tenant is equivalent to deleting a file. The system supports over a million concurrently active tenants per cluster.[^13] If deployed at architecture time, this is the cleanest deletion story in the commercial market — physical isolation rather than logical filtering.

**Qdrant** takes a similar approach through payload-level partitioning with per-tenant access controls plus JWT RBAC.[^11] Qdrant's `jwt_rbac` feature enables JSON Web Tokens with claims that specify expiration times, read/write permissions for collections, and validating conditions; the `value_exists` claim validates the token against a specific key-value stored in a collection, so access can be revoked by changing a value without invalidating the API key.[^11] Qdrant Hybrid Cloud's deployment-flexibility story (sharding, replicas, JWT, monitoring) makes this practical for data-sovereign architectures complying with GDPR data residency.[^11]

**Databricks Mosaic AI Vector Search** + Delta Change Data Feed (CDF) is the Delta-Sync Index pattern documented in the Everstone AI February 2026 analysis.[^17] The vector index is a derived, governed view of the source Delta table. CDF records every insert, update, and delete; when a `DELETE` occurs in the source table, the corresponding vector is automatically removed from the index — both in memory and on disk.[^17] Synchronization metadata is queryable via Unity Catalog: `SELECT name, status, latest_source_version, last_synced_timestamp FROM system.vector_search.indexes` returns concrete proof that deletions were processed if `last_synced_timestamp` is later than the `DELETE` operation.[^17]

**Chromadb** supports immediate hard delete but has eventual-consistency issues in distributed setups.[^30] The `collection.get(ids=['doc_123'])` returns `{'ids': [], 'documents': [], 'metadatas': []}` when the document exists, but Chromadb's internal cleanup can be delayed for several seconds in persistent mode.[^30]

The **OWASP AI Security Verification Standard's Memory and Embeddings control (C08)** specifically calls out tomb-stoning vs hard-deletes: vector stores must support deletion such that revoked vectors cannot be recovered or re-indexed.[^12] AWS Bedrock Knowledge Bases' "right to be forgotten" guidance describes the cascading deletion challenge — identify every place a chunk landed (primary index, replicas, backups, evaluation snapshots, fine-tuning datasets if any) and remove it from all of them, then re-embed any documents that legitimately remained but were chunked together with the deleted content.[^12]

The Twig technical analysis catalogues the index-structure-specific deletion problems.[^21] **HNSW** (Hierarchical Navigable Small World) graphs require updating neighbor links on each deletion; the graph fragments and search quality degrades over time. **IVF** (Inverted File Index) clustering causes cluster imbalance over time after many deletions; some clusters end up empty, others too full, and re-clustering becomes necessary. The three deletion strategies are: lazy deletion (mark as deleted, filter at query time — fast but data still physically present), immediate deletion (slow on bulk deletes, causes index fragmentation), and batch deletion with rebuild (1-24h delay; clean index after rebuild but raises the "without undue delay" GDPR question).[^21] The pragmatic answer is metadata-based delete for immediate removal + scheduled periodic index rebuilds for compaction.[^21]

## 5. EU AI Act Article 12: Automatic Event Logging for High-Risk Memory

If the agent memory feeds a high-risk AI system under Annex III (biometrics, employment, education, essential services), Article 12 requires that the system "technically allow for the automatic recording of events (logs) over the lifetime of the system."[^1][^2] The deadline is 2 August 2026.[^22]

The Article 12 specification mandates five properties that the logging infrastructure must satisfy:[^22]

1. **Automatic**: events recorded automatically, not manually triggered.
2. **Traceable**: events linked to specific inputs, decisions, and actors.
3. **Ordered**: sequential, with verifiable chronology.
4. **Tamper-evident**: modifications detectable.
5. **Exportable**: accessible for audit, regulatory submission, and post-market analysis.

For high-risk systems under Annex III point 1(a) (biometric identification), the minimum logging requirements per Article 12(3) are explicit: recording of the period of each use (start + end timestamps); the reference database against which input data has been checked; the input data for which the search led to a match; and the identification of the natural persons involved in verification per Article 14(5).[^1][^2][^29]

The CertifiedData Article 12 implementation pattern shows the operational shape:[^24]

```json
{
  "certification_id": "uuid",
  "timestamp": "2026-03-19T00:00:00Z",
  "issuer": "Certified Data LLC",
  "dataset_hash": "sha256:a7f3...",
  "algorithm": "CTGAN",
  "rows": 100000,
  "schema_version": "certifieddata.cert.v1",
  "signature": "ed25519:base64url...",
  "transparency_log_sequence": 4821,
  "verify_url": "https://certifieddata.io/verify/uuid"
}
```

The `transparency_log_sequence` field records the certificate's position in the public hash-chained transparency log; any gap or reordering of sequence numbers is detectable by any verifier without trusting the AI provider.[^24] Ed25519-signed ISO-8601 timestamps satisfy the timestamp-verifiability requirement without needing a trusted timestamp authority.[^24]

The AGLedger pattern uses RFC 8785 (JCS) canonicalization before hashing so that contiguous hash links break under any modification to a prior entry.[^22] Every state transition (created → active → processing → fulfilled / failed / revision-requested / cancelled) generates an audit entry automatically. The genesis entry has a null `previousHash`. Sequence is cryptographically verifiable, not timestamp-based.[^22] Delegation chains preserve `parentMandateId` and `chainDepth` so multi-agent handoffs are reconstructable.[^22]

The Systima practitioner guide identifies the data that production teams should log for an LLM-backed high-risk system:[^23]

- **Parameter configuration**: temperature, top_p, max_tokens, stop sequences. Log a content-addressable hash of the system prompt; store the full text in a versioned prompt registry that the hash resolves against.
- **Input capture**: raw user input as received, enriched/preprocessed input after transformations, full assembled prompt or feature vector sent to the model. For RAG systems, the retrieval query, the retrieved documents (or content-addressable hashes with full documents stored separately), and relevance scores.
- **Output capture**: raw model output before post-processing, output after post-processing (filtering, formatting, safety checks), final user-facing response.
- **Tool calls**: every tool invocation with name, parameters, response, latency, error states. Order and causal dependencies preserved.
- **Human intervention**: override flag, reviewer identifier, reasoning, original + overridden outputs.

The retention story has tiered storage as the practical answer.[^23] Hot storage holds recent decision logs (30-90 days), fully indexed and queryable at low latency; warm storage holds older logs (months to a year), searchable but not optimized; cold storage holds archived logs (10-year retention per Article 19), retrievable but may take minutes or hours to access.[^23] The deployer-side minimum under Article 26(6) is 6 months.[^25][^26]

The draft standard **prEN ISO/IEC 24970** (Artificial intelligence — AI system logging) will provide concrete implementation guidance, intended to be used with a risk management system per Article 9.[^25] As of mid-2026, no harmonized standard has been formally cited in the Official Journal, but prEN ISO/IEC 24970 is the closest thing to a practical blueprint.

## 6. The CCPA ADMT Pre-Use Notice Pipeline

If the agent memory feeds an Automated Decisionmaking Technology that makes a "significant decision" about a California consumer, §7220 requires a **Pre-use Notice** before processing the consumer's personal information.[^4] Significant decisions include those affecting finances, housing, education, employment, or health care.[^27]

The Pre-use Notice must include:[^4]

1. **A plain-language explanation** of the specific purpose for which the business plans to use the ADMT (not generic "to make a significant decision").
2. **A description of the right to opt out** of ADMT and how to submit the request.
3. **A description of the right to access** ADMT and how to submit the request.
4. **A statement** that the business is prohibited from retaliating against consumers for exercising their CCPA rights.
5. **Additional plain-language information** about how the ADMT processes personal information, the type of output generated, how the output is used to make the significant decision, what other factors are in the decisionmaking process, the role of any human reviewer, and the alternative process for consumers who opt out.

The opt-out flow under §7221:[^6] businesses must provide two or more designated methods for submitting opt-out requests; at least one must reflect the manner in which the business primarily interacts with the consumer; for online businesses this means a `Opt-out of Automated Decisionmaking Technology` link in the Pre-use Notice; once a consumer opts out, the business must cease processing within 15 business days and notify all service providers, contractors, and other persons to whom personal information has been disclosed; the business must wait at least 12 months before asking the consumer to re-consent.

The access flow under §7222:[^7] when responding to a request to access ADMT, the business must provide plain-language explanations of the specific purpose, the logic of the ADMT (parameters that generated the output as well as the specific output), the outcome of the decisionmaking process for the consumer, and how the output was used to make the significant decision (sole factor, other factors, role of human reviewer if any). For ADMT that processed the consumer more than four times in 12 months, an aggregate-level response summarizing outputs and parameters is permitted.[^7]

The Skadden October 2025 analysis confirms the rollout timeline:[^27] regulations begin to come into effect January 1, 2026, with full ADMT compliance January 1, 2027. Beginning April 1, 2027, businesses using ADMT for significant decisions must conduct a risk assessment. Initial assessments for processing activities already underway are due December 31, 2027; risk-assessment metadata (designated contact, time period, count, attestation) is due to the CPPA by April 1, 2028.[^27] Cybersecurity audits are also phased in.[^27]

The Littler analysis is precise on the employer subset:[^28] mid-to-large for-profit California employers using ADMT for employment-related decisions without meaningful human involvement must conduct detailed risk assessments, provide pre-use notices, and honor opt-out and access rights — all by January 1, 2027. The pre-use notice can be consolidated with notices at collection but must include the required information for each separate set of significant decisions.[^28]

The architectural implication for agent memory: if your agent uses memory to inform a significant decision under California law, you need (a) a Pre-use Notice surfaced before personal data is collected for that purpose, (b) an opt-out flow that ceases ADMT processing within 15 business days, (c) an access flow that returns the logic + output + outcome, (d) a no-retaliation guarantee, and (e) a risk assessment retained for the duration of processing or 5 years after completion.[^27] This adds a UX layer on top of the deletion infrastructure described in Section 3 and the logging infrastructure described in Section 5.

## 7. Engineering Checklist for 2026

Eleven items distilled from the published practices of Astraea Counsel, the EDPB CEF report, the EU AI Act Service Desk, Pinecone, Weaviate, Qdrant, Databricks, Mem0, and Kronvex.

**1. Tag every memory write with `user_id` from day one.** The single biggest determinant of deletion compliance. Without this tag, every Article 17 / Section 1798.105 request becomes a forensic exercise.[^9][^20]

**2. Build the write wrapper before launch.** Intercept every memory write, tag it with referenced user identities, store the tags as metadata.[^9] The `/memories` directory of an agent is otherwise opaque to compliance.

**3. Build the external user→files index.** Lookup table mapping user IDs to memory file IDs, stored in a queryable database.[^9] When a deletion request arrives, query the index, not the memory files themselves.

**4. Build the deletion API with audit logging.** Single endpoint that purges all memory files associated with a user identity, including index entries. Log the request, action, and confirmation — but not the deleted data itself.[^18]

**5. Choose a vector database with native multi-tenancy.** Weaviate per-tenant shards or Qdrant payload-level partitioning are the cleanest deletion stories.[^13][^11] Pinecone delete-by-metadata is GA on standard indexes but not on serverless.[^10][^13]

**6. Maintain a document-to-vector lineage table.** Without it, you cannot find the vectors derived from a deleted source record. Build it at ingestion, not at deletion-request time.[^14]

**7. Strip personal data before embedding where possible.** Pseudonymized data remains personal data under GDPR Recital 26, but pseudonymization lowers risk and supports your legal basis.[^15] Where the source content cannot be redacted, document the reasoning and rely on cascade deletion via lineage table.

**8. Cascade to processors on every erasure.** Notify downstream processors — memory API providers, vector DB vendors, fine-tuning datasets, AI provider logs — of every erasure request and confirm they have been actioned.[^14][^18]

**9. Implement Article 12 automatic event logging if the system is high-risk.** Ed25519-signed, hash-chained, RFC 8785 (JCS) canonicalized, append-only audit vault.[^22][^24] Hot storage 30-90 days, warm to 1 year, cold to 10 years.[^23]

**10. Implement the §7220 Pre-use Notice + §7221 opt-out + §7222 access flows if the agent informs significant decisions about California consumers.** Two-or-more opt-out submission methods, 15-business-day cease-processing SLA, no-retaliation guarantee, 12-month re-consent waiting period.[^4][^6][^7]

**11. Document the Tier 3 reasonable-steps file.** What personal data was excluded from training; why machine unlearning is not relied upon as a compliance tool; what the retraining path looks like; what evaluation shows the model does not output identifying information about any data subject.[^14]

A twelfth operational practice: **dry-run deletion against the full nine-surface inventory** quarterly. The notraced framework's nine surfaces include database rows, application logs, prompt history, agent memory, vector embeddings, retrieval sources, caches, provider logs, and fine-tune artifacts.[^14] If the dry-run misses any surface, the production response will too.

## 8. Six Predictions for 2026-2028

**Prediction 1.** The first six-figure GDPR Article 17 fine for incomplete agent-memory deletion lands by Q4 2026. The EDPB's February 2026 CEF report set the table; an EU DPA will make an example of a B2A vendor whose vector store retained user data after a confirmed deletion request.[^14]

**Prediction 2.** All major commercial vector databases ship cryptographically-verifiable deletion guarantees by mid-2027. Pinecone's metadata-delete + Databricks Delta-Sync CDF + Qdrant JWT RBAC are the precursors; a "deletion attestation" on the model of Sigstore for software supply chain emerges as the reference primitive.[^10][^11][^17]

**Prediction 3.** Machine-unlearning tooling becomes a standard model-card line item by 2027, accompanied by a regulator-backed benchmark (likely CEN-CENELEC or NIST AI 600-1 successor). It does not yet count as compliant deletion, but it becomes the documented "reasonable steps" that controllers can point to.[^14]

**Prediction 4.** The first six-figure California ADMT fine lands by Q3 2027. Most likely vector: an employer using an agent-backed scoring system without a §7220 Pre-use Notice in place; Littler's analysis identifies this as the most common operational gap.[^28]

**Prediction 5.** Article 12 logging implementations converge on the AGLedger / CertifiedData / Systima pattern: Ed25519 + RFC 8785 + hash-chain + tiered storage + 10-year retention.[^22][^24][^23] By 2028, this is shipped as a commodity SaaS the way Datadog became commodity logging.

**Prediction 6.** Agent memory becomes a Data Processing Agreement (DPA) line item by 2027. Standard DPA retention clauses today reference "the personal data processed under this agreement"; agent memory falls outside that frame because the deployer doesn't define what is processed — the agent does.[^9] The fix is contract language specifying that all data written to the agent's memory directory is subject to the retention schedule and that the deployer retains a unilateral right to purge files via the deletion API at any time.

## Glossary

**Right to Erasure (Article 17).** GDPR data subject right to obtain erasure of personal data without undue delay; 1-month default window, extendable to 3 months.[^9]

**Section 1798.105.** CCPA right to deletion of personal information collected by a business.[^9]

**ADMT.** Automated Decisionmaking Technology — California regulatory term for technology that processes personal information and uses computation to replace or substantially replace human decisionmaking.[^8][^28]

**Significant Decision.** Under California ADMT regulations: a decision affecting finances, housing, education, employment, or health care.[^27]

**Pre-use Notice (§7220).** California regulatory requirement for businesses using ADMT for a significant decision; must be provided at or before collection of personal information for that purpose.[^4]

**Article 12 Logging.** EU AI Act automatic event-recording obligation for high-risk AI systems; effective 2 August 2026 for Annex III high-risk systems.[^1][^2]

**Three-Part Architecture.** Astraea Counsel pattern for agent-memory deletion: write wrapper + external index + deletion API.[^9]

**Three Deletability Tiers.** Notraced framework: Tier 1 deletable today, Tier 2 deletable on provider request, Tier 3 not provably deletable in 2026.[^14]

**Lineage Table.** Document-to-vector mapping that lets the team find every embedding derived from a source record; prerequisite for cascading deletion.[^14]

**Embedding Inversion.** Class of attacks that reconstruct the original text from a vector embedding, typically using publicly available models. Key empirical reason embeddings are personal data.[^12][^15]

**LLM Scope Violation.** Aim Labs's term (also used in this paper's predecessor on EchoLeak) for an attack that tricks an LLM into violating its trust boundary and leaking internal context. Adjacent class to embedding-inversion; cited in EDPB Opinion 28/2024 reasoning.[^15]

**Tomb-stoning.** Soft-delete pattern where the vector is marked deleted but remains physically present until the next compaction; whether this satisfies Article 17 is contested as of 2026.[^12][^21]

**Delta-Sync Index.** Databricks pattern where the vector index is a derived governed view of the source Delta table; CDF cascades inserts/updates/deletes automatically.[^17]

**JWT RBAC (Qdrant).** Role-based access control via JSON Web Tokens with claims (`value_exists`, `access`); enables revocation-by-value-change without invalidating API keys.[^11]

**prEN ISO/IEC 24970.** Draft European standard on AI system logging that will provide concrete Article 12 implementation guidance.[^25]

## Related Research

This paper closes the deletion-architecture thread from the agent-memory paper and the AI-supply-chain procurement-documentation thread. Threads it opens for follow-on:

- **annex-iv-procurement-field-manual** — the full nine-section Annex IV walkthrough.
- **machine-unlearning-2027-state-of-the-art** — when (if) regulators accept SimNPO / RMU / LoRA-based unlearning as compliant deletion equivalent.
- **agent-memory-residency-eu-vs-us** — data-transfer compliance for agent memory under DORA + GDPR adequacy decisions.
- **dora-agent-memory-financial-services** — sector-specific overlay for financial agents under EU Digital Operational Resilience Act.

---

## References

[^1]: European Union AI Act Service Desk. "Article 12: Record-keeping." Regulation (EU) 2024/1689; high-risk AI systems shall technically allow for the automatic recording of events (logs) over the lifetime of the system; logging capabilities shall enable identification of risk situations, post-market monitoring per Article 72, and deployer monitoring per Article 26(5); for biometric Annex III point 1(a) systems minimum logging includes period of each use, reference database, input data leading to match, identity of natural persons involved in verification per Article 14(5). https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-12

[^2]: AI Act Info. "Article 12 Record-keeping (Regulation (EU) 2024/1689)." Article 12 mirror with full official text. https://aiact-info.eu/regulation/AIACT/article/12/record-keeping

[^3]: European Union AI Act Service Desk. "Article 11: Technical documentation." Regulation 2024/1689 Article 11 obligation to draw up technical documentation per Annex IV before market placement; 10-year retention under Article 18. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-11

[^4]: California Code of Regulations § 7220. "Pre-use Notice Requirements." New section filed 9-22-2025; operative 1-1-2026 (Register 2025, No. 39). Pre-use Notice must be presented prominently before processing personal information using ADMT; must include plain-language purpose explanation, description of opt-out and access rights, no-retaliation statement, additional information about how ADMT works to make significant decisions. https://govt.westlaw.com/calregs/Document/IFF3C16309FAA11F091968C68B7850296

[^5]: California Code of Regulations § 7200. "When a Business's Use of Automated Decisionmaking Technology is Subject to the Requirements of This Article." Compliance required by January 1, 2027 for businesses using ADMT for significant decisions. https://govt.westlaw.com/calregs/Document/I038754709FAB11F08837960D0A0033B1

[^6]: California Code of Regulations § 7221. "Requests to Opt-Out of ADMT." Two or more designated methods for submitting opt-out requests; cease processing within 15 business days; notify service providers; 12-month re-consent waiting period; no-retaliation guarantee. https://govt.westlaw.com/calregs/Document/I030DB7A09FAB11F091968C68B7850296

[^7]: California Code of Regulations § 7222. "Requests to Access ADMT." Plain-language explanations of specific purpose, logic of ADMT (parameters that generated output + specific output), outcome of decisionmaking process, role of human reviewer; aggregate-level response permitted for ADMT used more than four times in 12-month period. https://govt.westlaw.com/calregs/Document/IFEDEB3F09FAA11F08837960D0A0033B1

[^8]: California Privacy Protection Agency. "Final Regulations Text — CCPA Updates, Cyber, Risk, ADMT, and Insurance Regulations." Final regulations text approved September 23 2025; defines ADMT as technology that processes personal information and uses computation to replace or substantially replace human decisionmaking; profiling included; right to delete per § 1798.105. https://cppa.ca.gov/regulations/pdf/ccpa_updates_cyber_risk_admt_appr_text.pdf

[^9]: Astraea Counsel. "You Cannot Delete What You Do Not Know the Agent Stored: The Memory Tool's Privacy Problem." April 12 2026. Three-part architecture: write wrapper intercepting agent file operations + external index mapping users to memory files + deletion API with audit logging. CCPA § 1798.105 + GDPR Article 17 must be answerable within 30 days (extendable to 3 months for complex cases). Memory retention schedule with deployer-controlled deletion as DPA clause. https://astraea.law/insights/ai-agent-memory-tool-privacy-compliance

[^10]: Pinecone. "New Bulk Data Operations: Update, Delete, and Fetch by Metadata." October 30 2025. Delete by metadata GA; update + fetch in public preview / early access; explicit GDPR right-to-be-forgotten use case; same filter syntax as queries. https://www.pinecone.io/blog/update-delete-and-fetch-by-metadata/

[^11]: Qdrant. "Data Privacy with Qdrant: Implementing Role-Based Access Control (RBAC)." Per-tenant payload-level partitioning; JWT RBAC with `value_exists`, `access`, expiration claims; revocation by changing a value without invalidating API keys; Qdrant Hybrid Cloud for data sovereignty + GDPR residency. https://qdrant.tech/articles/data-privacy/

[^12]: Tianpan. "The Third Copy: Vector Stores, Deletion Completeness, and the GDPR Gap RAG Teams Keep Missing." April 27 2026. Vec2text-style inversion attacks reconstruct ~9 in 10 of original 32-token chunks from float[1536] arrays; OWASP AISVS C08 tomb-stoning vs hard-delete requirement; AWS Bedrock Knowledge Bases right-to-be-forgotten cascading deletion challenge; "no major commercial vector database offers a provable deletion mechanism" as of writing. https://tianpan.co/blog/2026-04-27-vector-store-third-copy-deletion-completeness

[^13]: Tianpan. "GDPR's Deletion Problem: Why Your LLM Memory Store Is a Legal Liability." April 20 2026. Pinecone serverless = ID-prefix-only delete; Weaviate multi-tenancy per-tenant shards >1M concurrent tenants; Qdrant payload-level partitioning; physical-or-logical separation at indexing time, not retrieval time. https://tianpan.co/blog/2026-04-20-gdpr-llm-memory-erasure-vector-database

[^14]: Notraced / Shephard. "Right to erasure when your AI used the data: what's actually deletable in 2026." April 8 2026. EDPB CEF report February 2026 + three deletability tiers (Tier 1 defined path / Tier 2 provider request / Tier 3 unprovable); machine unlearning as research direction not compliance tool; ICLR 2025 SimNPO + RMU + LoRA-based unlearning + CMU benchmark gap analysis; Tuan-Anh Bui paraphrase-attack and relearning research. https://notraced.com/articles/right-to-erasure-ai-models

[^15]: Notraced / Shephard. "Are vector embeddings personal data under GDPR? A technical answer for RAG builders." April 6 2026. EDPB Opinion 28/2024; CNIL Q&A on generative AI; UK ICO consultation outcomes; pseudonymized data remains personal data under GDPR Recital 26; default classification = personal. https://notraced.com/articles/are-vector-embeddings-personal-data

[^16]: CallSphere. "Right to Be Forgotten in Agent Memory: GDPR + CCPA in 2026." April 15 2026. Three architectural pillars (runtime + state model + observability surface); 6 production guidelines including ship-deletion-endpoint-before-launch + decay-aggressively + split-episodic-from-semantic; cost-of-bolting-on-state-at-month-6 = 5x cost-at-week-2. https://callsphere.ai/blog/td30-fw-right-to-be-forgotten-agent-memory-gdpr-ccpa-2026

[^17]: Everstone AI. "The GDPR Timebomb in Your Vector Database (And How to Defuse It)." February 2 2026. Databricks Delta-Sync Index + Delta Change Data Feed (CDF) + Mosaic AI Vector Search; vector index as derived governed view of source Delta table; CDF records insert/update/delete; Unity Catalog synchronization metadata as deletion evidence. http://blog.everstoneai.com/2026/02/gdpr-compliance-rag-vector-database-deletion.html

[^18]: Kronvex. "GDPR and AI Agents: Data Retention & Erasure." March 22 2026. Memory API as data processor under GDPR Article 4(8); Article 17 obligations (30-day window extendable to 3 months, cascade to processors, user confirmation, audit trail, backup rotation); per-agent deletion with hard delete + per-user erasure endpoint. https://kronvex.io/blog-gdpr-ai-agents

[^19]: Kronvex. "How to Build GDPR-Compliant AI Agents with Persistent Memory." April 6 2026. user_id attached to every stored memory; deletion endpoint removing all records for that user_id; response confirming how many records were deleted; EU-incorporated EU-hosted memory provider + signed DPA. https://kronvex.io/blog-gdpr-ai-agent-memory

[^20]: Mem0. "How do I delete a specific user's memories to comply with GDPR right-to-erasure requests?" March 9 2026. delete_all(user_id=...) removes all memory entries + vector embeddings + metadata + graph nodes; immediate and permanent (no recycle bin or soft-delete); cascade to provider logs + fine-tuning datasets if applicable. https://mem0docs.xyz/task/blog/delete-user-memories-gdpr-right-to-erasure/

[^21]: Twig. "Erasure from Vector Index." Vector index structure-specific deletion problems: HNSW graph fragmentation + IVF cluster imbalance; lazy-delete vs immediate-delete vs batch-delete-with-rebuild trade-offs; metadata-based delete + scheduled compaction. https://help.twig.so/rag-scenarios-and-solutions/privacy/right-to-erasure

[^22]: AGLedger. "EU AI Act Article 12: What Event Logging Actually Requires." April 6 2026. Five Article 12 properties (automatic + traceable + ordered + tamper-evident + exportable); Ed25519-signed hash-chained entries + RFC 8785 (JCS) canonicalization; mandate lifecycle (created → active → processing → fulfilled / failed / revision-requested / cancelled); delegation chain tracking with parentMandateId + chainDepth. https://agledger.ai/blog/eu-ai-act-event-logging/

[^23]: Systima. "Article 12 for Engineers: What to Log, How Long to Keep It, and How to Reconstruct." February 27 2026. Decision-time data capture: parameter configuration (temperature, top_p, max_tokens, system prompt hash + versioned registry), input capture (raw + enriched + assembled prompt; for RAG: query + retrieved documents + relevance scores), output capture (raw + post-processed + final), tool calls (name + parameters + response + latency + errors + ordering), human intervention (override flag + reviewer ID + reasoning + original + overridden); tiered storage (hot 30-90d / warm to 1y / cold to 10y). https://systima.ai/blog/eu-ai-act-article-12-logging-audit-trails

[^24]: CertifiedData. "EU AI Act Article 12 Logging." Article 12 implementation pattern with certification_id + ISO-8601 timestamp + dataset_hash SHA-256 + Ed25519 signature + transparency_log_sequence; tamper-evident structure (hash-chaining or Merkle tree); 10-year retention per Article 19; public-key verification without trusting AI provider. https://certifieddata.io/eu-ai-act/article-12-logging

[^25]: Practical AI Act. "Record-Keeping (Article 12)." Draft standard prEN ISO/IEC 24970 (AI system logging) intended for use with risk management system per Article 9; Article 26(6) deployer-side log retention minimum 6 months; Article 26(5) deployer monitoring obligations. https://practical-ai-act.eu/latest/conformity/record-keeping/

[^26]: Ovidiu Suciu. "EU AI Act Article 12: Record-Keeping for High-Risk AI." March 23 2026. Provider builds logging into the system; deployer retains logs minimum 6 months; logs as protection (regulatory + decision-defense); intersection with GDPR record-keeping obligations. https://ovidiusuciu.com/eu-ai-act/eu-ai-act-article-12-record-keeping/

[^27]: Skadden. "California Finalizes CCPA Regulations for Automated Decision-Making Technology, Risk Assessments and Cybersecurity Audits." October 7 2025. Regulations approved September 23 2025; ADMT for significant decisions (finances/housing/education/employment/health care; advertising removed); compliance January 1, 2027; risk assessments April 1, 2027 onward; initial assessments due December 31, 2027; risk-assessment metadata to CPPA by April 1, 2028; assessment retention duration of processing or 5 years. https://www.skadden.com/-/media/files/publications/2025/10/california-finalizes-ccpa-regulations/californiafinalizesccparegulationsforautomateddecisionmakingtechnologyriskassessments-andcybersecuri.pdf

[^28]: Littler. "California's Long-Awaited Final Regulations on Automated Decisionmaking Create New Compliance Challenges for Employers." Mid-to-large for-profit California employers using ADMT for employment decisions; January 1, 2027 effective date; Pre-use Notice components (specific purpose + how ADMT makes the significant decision + categories of personal information affecting output + type of output + how output is used to make decision + notice of access + opt-out + appeal rights + no retaliation); consolidated Pre-use Notice with notice at collection permitted. https://www.littler.com/news-analysis/asap/californias-long-awaited-final-regulations-automated-decisionmaking-create-new

[^29]: RGPD. "Article 12: Record-keeping." Mirror of Article 12 official text covering automatic recording, traceability, post-market monitoring per Article 72, deployer monitoring per Article 26(5), biometric Annex III point 1(a) minimum requirements. https://rgpd.com/ai-act/chapter-3-high-risk-ai-systems/article-12-record-keeping/

[^30]: The Neural Base. "Data retention and deletion (Rag Fundamentals Advanced Course)." Chromadb + Pinecone hard-delete operational details: Chromadb supports immediate hard delete with eventual-consistency issues in distributed setups; Pinecone hard delete lags on large namespaces; verification with retry loops; deleted_at timestamp metadata for audit. https://theneuralbase.com/rag-fundamentals/learn/advanced/data-retention-and-deletion/

[^31]: California Civil Code § 1798.105. "Consumer right to deletion under CCPA." Statutory basis for deletion requests; obligates business to delete personal information collected from a consumer upon verified request, with limited exceptions. https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.105

[^32]: California Civil Code § 1798.140. "CCPA definitions." Defines personal information broadly enough to capture agent memory. https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.140

[^33]: European Union AI Act Service Desk. "Article 9: Risk management system." High-risk AI systems require a documented risk management system covering identification, estimation, evaluation, mitigation, and residual risk. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-9

[^34]: European Union AI Act Service Desk. "Article 14: Human oversight." High-risk AI systems must be designed and developed to enable effective natural-person oversight during use. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-14

[^35]: European Union AI Act Service Desk. "Article 18: Documentation keeping." Provider 10-year retention obligation for technical documentation. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-18

[^36]: European Union AI Act Service Desk. "Article 19: Automatically generated logs." Deployer-side log retention. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-19

[^37]: European Union AI Act Service Desk. "Article 26: Obligations of deployers of high-risk AI systems." Article 26(5) deployer monitoring + Article 26(6) deployer log retention minimum 6 months. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-26

[^38]: European Union AI Act Service Desk. "Article 72: Post-market monitoring by providers and post-market monitoring plan." Logging supports the post-market monitoring obligation. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-72

[^39]: European Union AI Act Service Desk. "Article 79: Procedure at national level for dealing with AI systems presenting a risk." Risk situations referenced from Article 12(2)(a). https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-79

[^40]: Pinecone Documentation. "Manage data: Delete records." Operational guidance for Pinecone delete-by-id and delete-by-metadata, including serverless vs standard index differences. https://docs.pinecone.io/guides/data/delete-data

[^41]: Qdrant Documentation. "Filtering and Conditions." Per-tenant payload filtering primitives that underlie GDPR-compatible deletion patterns. https://qdrant.tech/documentation/concepts/filtering/

[^42]: Weaviate Documentation. "Multi-tenancy." Per-tenant shard architecture supporting >1M concurrent tenants with single-file deletion semantics. https://weaviate.io/developers/weaviate/concepts/data#multi-tenancy
