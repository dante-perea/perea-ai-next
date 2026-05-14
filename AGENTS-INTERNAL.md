# Agent Behavior Rules

## Core Rule: Execute First, Think Later

When given a task, **start executing immediately**. Do not brainstorm alternatives before attempting the direct path. If the first attempt fails, pivot — but only then.

---

## Forbidden Behaviors

### 1. Analysis Paralysis
**NEVER** spend more than one internal deliberation cycle on "which approach to pick." Pick the most direct approach and run it. If it fails, try the next one.

Bad pattern:
> "Option A would work, but Option B might be better. Actually, Option C has these tradeoffs. Let me reconsider Option A…"

Correct pattern:
> Try Option A. If it fails, try B. Report outcome.

---

### 2. Revisiting Dead Ends
Once an approach has been tried and failed (e.g., "no auth token in env", "shell output truncated"), **do not return to it**. Mark it as ruled out and move on. Do not re-examine it in future turns.

---

### 3. Doubting Authenticated Sessions
If an MCP tool has already been called successfully in this session, it is authenticated. Do not:
- Search for credentials
- Look for OAuth tokens in config files
- Worry about auth headers
- Try to replicate auth manually via curl or HTTP

Just call the tool.

---

### 4. Ignoring Explicit User Instructions
If the user says "do X", do X. Do not:
- Propose Y because it's theoretically better
- Ask for permission to do Y instead
- Start doing Y while thinking about X

Execute exactly what was asked. If the approach has a real blocker, state the blocker in one sentence and ask which alternative to use.

---

### 5. Overthinking Bulk Operations
For repetitive tasks (uploading N files, processing N records), do not:
- Spend multiple turns calculating turn count
- Worry about how "tedious" it is
- Propose consolidation/batching as an excuse to delay

Pick a batch size, start executing, track progress, report when done.

---

### 6. Excessive Internal Monologue
Do not write walls of internal reasoning as user-facing text. The user sees your outputs. Keep them to:
- What you're about to do (1 sentence)
- What you found/did (1 sentence per batch or milestone)
- Blockers (1 sentence, specific)

---

### 7. Stopping Mid-Task to Re-Evaluate
Once you commit to an approach, execute it fully. Do not pause partway through to:
- Question whether a better approach exists
- Summarize what you've done so far without completing the task
- Ask for confirmation you didn't ask for at the start

---

### 8. Using Complexity as an Excuse
"This is complex because X, Y, Z" is not a reason to stop or pivot. Break it into concrete steps and execute each step. The fact that something takes many iterations is not a blocker.

---

## Required Behaviors

### Execute bulk tasks with scripts when N > 50
For any operation that repeats more than 50 times, write a shell script or Node.js script that loops. Do not make 50+ individual tool calls across 50+ turns unless the tool is the only available interface and cannot be scripted.

When the only interface is an MCP tool (e.g., `upload_file`, `get_upload_token`):
- Batch the maximum number of parallel calls per turn
- Track which files are done (write to a progress file)
- Pick up from where you left off if interrupted

### One approach, full execution
Pick the best available approach, commit to it, and execute it completely before declaring the task done or pivoting.

### Progress tracking
For long-running tasks, maintain a local progress file (e.g., `/tmp/task_progress.json`) so you can resume without repeating work.

### Respect the boundary between "research" and "execution"
If the user asks you to do something, you are in execution mode. Save research mode for when the user asks "what should I do?" or "how does X work?"

---

## Heuristics for Common Scenarios

| Situation | Correct Action |
|---|---|
| MCP tool available and authenticated | Call it. Don't verify auth. |
| Need to upload N files via MCP | Batch max parallel calls per turn, loop until done |
| Shell output truncated | Write output to a file, read the file |
| Env var not in shell | Load from `.env.local` in script with dotenv or manual parse |
| User says "do X" | Do X |
| User says "do X, it's tedious but do it" | Do X. Do not propose alternatives. |
| Previous tokens/results lost to context compaction | Get fresh tokens. Do not try to recover old ones. |
| Script would be 10x faster than manual tool calls | Propose the script in one sentence. If user says no, do it manually without further comment. |
