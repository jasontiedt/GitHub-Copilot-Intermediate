# Module 1: Team-Scale Custom Instructions

**Goal:** Turn TaskFlow's thin, generic `copilot-instructions.md` into layered instructions that make Copilot follow *your team's* conventions automatically. Good instructions are one of the most useful things a team can set up: write them once, and every response gets better.

**Estimated Time:** ~45 minutes
**Branch:**
```bash
git checkout main && git pull
git checkout -b USERNAME/module-1-instructions
```

## What You'll Learn
- [ ] Audit an ineffective instruction file and see its impact (or lack of it)
- [ ] Write a **short, focused** repo-wide `copilot-instructions.md`
- [ ] Add **path-scoped** `.instructions.md` for `web/`, `api/`, and tests
- [ ] Use **`AGENTS.md`** for cross-tool, "what's intentional" context
- [ ] Verify instructions actually change Copilot's output
- [ ] **Ship it**: PR + Copilot review

## 🎯 Stage 1: Audit what you have (6 min)

**1.** Open [.github/copilot-instructions.md](../.github/copilot-instructions.md). Notice it's generic — it says *what* the app is but nothing about *how this team works*.

**2.** In **Agent** mode, ask for a change that needs conventions:
```markdown
Add a GET /tasks/{id} endpoint to the API and a matching function in web/src/api.ts.
```
Watch what Copilot produces. Because the instructions are thin, it likely returns `any` in the web client and skips input validation in the API — the very rough edges we want to prevent. **Discard these changes.**

**✅ Checkpoint:** You've seen that weak instructions → weak defaults.

## 🎯 Stage 2: Write lean repo-wide instructions (8 min)

**1.** Draft from the codebase: type `/init` in chat (or **Configure Chat** ⚙ → **Generate Instructions**). It analyzes the repo and proposes a `copilot-instructions.md`.

**2.** **Prune hard.** A good instruction file is short and specific — it captures the *non-obvious, team-specific* rules, not everything a linter already enforces. Replace the file with something like:

```markdown
# TaskFlow — Copilot instructions

TaskFlow is a polyglot task tracker: a **React + TypeScript (Vite)** frontend in `web/`
and a **FastAPI (Python)** backend in `api/`. The web app calls the API at `http://localhost:8000`.

## Conventions that matter here
- Keep PRs small and focused; add or update tests for any logic change.
- Never introduce `any` in TypeScript — model API responses with types from `web/src/types.ts`.
- Validate input at the boundary (API request models / form submit); don't trust callers.
- The API's data store is in-memory (`taskflow/store.py`) — there is no database yet.
- There is no auth yet; don't invent auth flows unless asked.

## Where things live
- Domain logic: `api/taskflow/service.py` (keep it pure and unit-testable).
- HTTP layer: `api/taskflow/app.py`. Web API client: `web/src/api.ts`.
```

> 💡 **Why short?** Long instruction files get ignored and go stale. Each rule should be one idea, non-obvious, and ideally explain *why*.

**✅ Checkpoint:** A short, specific, repo-wide instruction file.

## 🎯 Stage 3: Add path-scoped instructions (8 min)

Repo-wide rules apply everywhere; **path-scoped** rules apply only to matching files via an `applyTo` glob. Create these:

`.github/instructions/web.instructions.md`
```markdown
---
applyTo: "web/**/*.{ts,tsx}"
---
# Web (React + TypeScript)
- Function components with typed props; no `any` — type API data via `src/types.ts`.
- Every data fetch handles loading and error states.
- Read the API base URL from one place (a config/env), never hard-code it per call.
- Use `userEvent` + React Testing Library for component tests.
```

`.github/instructions/api.instructions.md`
```markdown
---
applyTo: "api/**/*.py"
---
# API (FastAPI + Python)
- Type-hint public functions; keep `service.py` pure and unit-testable.
- Validate at the boundary with Pydantic models; reject invalid status/priority.
- Raise specific HTTP errors (`HTTPException`) — never return `None` to signal failure from a route.
- Follow PEP 8; add a one-line docstring to non-trivial functions.
```

**✅ Checkpoint:** Editing a `.tsx` or `.py` file, the matching rules now apply automatically.

## 🧗 Stage 4 (Challenge): Author the remaining layers (8 min)

**Your goal:** Add two more artifacts that round out the team's context.

**Done when:**
- [ ] A **tests** instruction file (`applyTo` for `api/**/test_*.py` and `web/**/*.test.tsx`) captures your pytest/Vitest conventions and says to cover edge cases.
- [ ] A repo-root **`AGENTS.md`** records what's *intentional* and where to be careful (in-memory store, no auth, the known rough edges are deliberate), so any agent has the same context.

<details><summary>💡 Stuck? Reveal a hint</summary>

Create instruction files via `/instructions` → **New Instructions** (or **Configure Chat** ⚙ → **Instructions** tab). For `AGENTS.md`, VS Code auto-detects it at the repo root — keep it to a few paragraphs of "how this project actually works."

</details>

## 🎯 Stage 5: Verify the impact (6 min)

**1.** Re-run the Stage 1 request in **Agent** mode:
```markdown
Add a GET /tasks/{id} endpoint to the API and a matching function in web/src/api.ts.
```
This time it should validate the id, raise `HTTPException(404)`, and type the web client (no `any`).

**2.** Open the chat response's **References** to confirm which instruction files were applied.

**✅ Checkpoint:** Same prompt, clearly better output — because the team's rules are now in context.

## 🚀 Ship it (4 min)
1. **Commit** your instruction pack (generate the message with Copilot).
2. **Push:** `git push -u origin USERNAME/module-1-instructions`
3. **Open a PR**, then under **Reviewers**, next to **Copilot**, click **Request**. Triage its comments.

## ✅ Completion Checklist
- [ ] Rewrote `copilot-instructions.md` to be lean and specific
- [ ] Added `web` and `api` path-scoped instructions
- [ ] Added tests instructions + `AGENTS.md`
- [ ] Verified improved output via References
- [ ] Opened a PR and got a Copilot review

## 🔀 Try it another way
There's more than one path to good instructions — try a couple and keep what sticks:
- **Generate vs. hand-write:** you used `/init`. Now try the opposite — write five rules by hand from the review comments your team actually leaves, then ask Copilot to *"tighten these into a short instructions file."* Compare which reads better.
- **One file vs. layered:** fold your path-scoped rules back into the single `copilot-instructions.md`, then split them out again. Open **References** each time to see which approach Copilot actually pulls in for a `.tsx` vs. a `.py` edit.

## 🧠 Advanced sidebar

- **Precedence:** personal (user) → repository (`copilot-instructions.md` / `AGENTS.md`) → organization. Higher-priority wins on conflict.
- **Organization-level instructions** share standards across every repo (enable `github.copilot.chat.organizationInstructions.enabled`). Great for security/compliance rules.
- **Task-specific settings instructions** still exist for **code review**, **commit messages**, and **PR descriptions** (`github.copilot.chat.reviewSelection.instructions`, etc.) — you'll use the review one in Module 3.
- **Measuring impact:** watch the **References** section, use the chat customization **Diagnostics** view (right-click in Chat → *Diagnostics*), and track whether reviewers stop leaving the same comments.

## 🏁 What's Next?
Continue to [Module 2: Designing a Reusable Prompt Library](02-prompt-library.md).

### 🌟 Take-home challenge
Bring your **own** repo's `copilot-instructions.md` down to 20 focused lines, then add one path-scoped `.instructions.md` for its busiest area. See whether review comments drop over the next week.
