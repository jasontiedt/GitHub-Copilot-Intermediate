# Module 1: Team-Scale Custom Instructions

**Goal:** Turn TaskFlow's thin, generic `copilot-instructions.md` into layered instructions that make Copilot follow *your team's* conventions automatically. Good instructions are one of the most useful things a team can set up: write them once, and every response gets better.

**Estimated Time:** ~30 min core (Stages 1–4, 6 + ship). **Optional stretch:** Stage 5 (+~8 min).
**Branch:**
```bash
git checkout main && git pull
git checkout -b USERNAME/module-1-instructions
```

## What You'll Learn
- [ ] Audit an ineffective instruction file and see its impact (or lack of it)
- [ ] Set up your **personal (user) instructions** and learn the **personal → repo → org** layering
- [ ] Write a **short, focused** repo-wide `copilot-instructions.md`
- [ ] Add **path-scoped** `.instructions.md` for `web/`, `api/`, and tests
- [ ] Use **`AGENTS.md`** for cross-tool, "what's intentional" context
- [ ] Verify instructions actually change Copilot's output
- [ ] **Ship it**: PR + Copilot review

## 🎯 Stage 1: Audit what you have (5 min)

**1.** Open [.github/copilot-instructions.md](../.github/copilot-instructions.md). Notice it's generic — it says *what* the app is but nothing about *how this team works*.

**2.** In **Agent** mode, ask for a change that needs conventions:
```markdown
Add a GET /tasks/{id} endpoint to the API and a matching function in web/src/api.ts.
```
Watch what Copilot produces. Because the instructions are thin, it likely returns `any` in the web client and skips input validation in the API — the very rough edges we want to prevent. **Discard these changes.**

**✅ Checkpoint:** You've seen that weak instructions → weak defaults.

## 🎯 Stage 2: Set up your personal layer (3 min)

Instructions come in three layers — **personal → repo → org** — that stack in that priority order when they conflict. Before you touch the team's file, set up *your own*. Here's the guidance you'd give a new teammate:

> **Coaching a junior:** "Your **personal instructions** capture how *you* like Copilot to respond. They follow you across every repo and are never committed, so they're the safe place for style preferences — keep them about *you*, not the project."

**Do it together:**
1. In the Chat view, select **Configure Chat** (gear) → **Instructions**, then choose **New Instructions (User)** from the **New** dropdown. You can also type `/instructions` to open the **Configure Instructions and Rules** menu.
2. Add a couple of personal preferences, for example:
   ```markdown
   - Explain the tradeoffs of an approach before showing code.
   - Prefer small, reviewable diffs and call out anything risky.
   ```
3. For the Local harness, run **Settings Sync: Configure** from the Command Palette and enable **Prompts and Instructions** to sync this file. Agent Host sessions instead read personal instructions from `~/.copilot/instructions`; they do not read instructions stored only in VS Code profile data.
4. GitHub.com has a separate personal-instructions setting: open [Copilot Chat](https://triwest-healthcare-alliance.ghe.com/copilot), select your profile picture in the lower-left corner → **Personal instructions**, enter the preferences, and click **Save**.

> **The boundary to teach:** anything the *team* must follow belongs in the repo file (next stage), not your personal layer — otherwise teammates never get it.

**✅ Checkpoint:** You have a personal rule that applies in *any* repo, and can explain why it doesn't belong in the team's file.

## 🎯 Stage 3: Write lean repo-wide instructions (6 min)

**1.** Draft from the codebase: type `/init` in chat. You can also open **Configure Chat** (gear), use the Agent Customizations editor's **Overview** tab, and choose **Generate Instructions**. It analyzes the repo and proposes a `copilot-instructions.md`.

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

## 🎯 Stage 4: Add path-scoped instructions (6 min)

Repo-wide rules apply everywhere; **path-scoped** rules apply only to matching files via an `applyTo` glob. Create these:

`.github/instructions/web.instructions.md`
```markdown
---
applyTo: "web/**/*.ts,web/**/*.tsx"
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

## 🧧 Stage 5 (Optional stretch): Author the remaining layers (+8 min)

**Your goal:** Add two more artifacts that round out the team's context.

**Done when:**
- [ ] A **tests** instruction file (`applyTo` for `api/**/test_*.py` and `web/**/*.test.tsx`) captures your pytest/Vitest conventions and says to cover edge cases.
- [ ] A repo-root **`AGENTS.md`** records what's *intentional* and where to be careful (in-memory store, no auth, the known rough edges are deliberate), so any agent has the same context.

<details><summary>💡 Stuck? Reveal a hint</summary>

Create instruction files via `/instructions`, or open **Configure Chat** (gear) → **Instructions** and choose **New Instructions (Workspace)**. For `AGENTS.md`, VS Code auto-detects it at the repo root — keep it to a few paragraphs of "how this project actually works."

</details>

## 🎯 Stage 6: Verify the impact (5 min)

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
- [ ] Set up your personal (user) instructions
- [ ] Rewrote `copilot-instructions.md` to be lean and specific
- [ ] Added `web` and `api` path-scoped instructions
- [ ] *(Optional stretch)* Added tests instructions + `AGENTS.md`
- [ ] Verified improved output via References
- [ ] Opened a PR and got a Copilot review

## 🔀 Try it another way
There's more than one path to good instructions — try a couple and keep what sticks:
- **Generate vs. hand-write:** you used `/init`. Now try the opposite — write five rules by hand from the review comments your team actually leaves, then ask Copilot to *"tighten these into a short instructions file."* Compare which reads better.
- **One file vs. layered:** fold your path-scoped rules back into the single `copilot-instructions.md`, then split them out again. Open **References** each time to see which approach Copilot actually pulls in for a `.tsx` vs. a `.py` edit.

## 🧠 Advanced sidebar

- **Precedence (three layers):** personal (user, highest priority) → repository (`copilot-instructions.md` / `AGENTS.md`) → organization (lowest priority). All relevant instructions are provided to Copilot, so avoid conflicts even though priority resolves them.
- **Organization-level instructions (org owners):** on GitHub.com, select your profile picture → **Your organizations** → your organization → **Settings** → **Copilot**. Add the text under **Preferences and instructions**, then click **Save changes**. GitHub currently supports these instructions in Copilot Chat, code review, and the cloud agent on GitHub.com. VS Code can discover them when `github.copilot.chat.organizationInstructions.enabled` is `true`. Keep this layer **small and universal** — repo-specific detail stays in `copilot-instructions.md`.
- **Task-specific settings instructions** still exist for **code review** (`github.copilot.chat.reviewSelection.instructions`), **commit messages** (`github.copilot.chat.commitMessageGeneration.instructions`), and **PR descriptions** (`github.copilot.chat.pullRequestDescriptionGeneration.instructions`). Settings-based code- and test-generation instructions are deprecated; use instruction files for those tasks.
- **Measuring impact:** watch the **References** section, use the chat customization **Diagnostics** view (right-click in Chat → *Diagnostics*), and track whether reviewers stop leaving the same comments.

## 🏁 What's Next?
Continue to [Module 2: Designing a Reusable Prompt Library](02-prompt-library.md).

### 🌟 Take-home challenge
Bring your **own** repo's `copilot-instructions.md` down to 20 focused lines, then add one path-scoped `.instructions.md` for its busiest area. See whether review comments drop over the next week.
