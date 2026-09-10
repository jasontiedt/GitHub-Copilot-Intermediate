# Module 5: AI-Assisted Sprint Delegation

**Goal:** Hand a whole sprint's worth of scoped work to the Copilot coding agent in one batch — the **"Sunday-night kickoff"** — so the team walks in Monday to a queue of **draft PRs ready to review**. The real skill you'll practice: choosing *what* to delegate, keeping unattended runs *safe*, and *triaging* the results fast.

**Estimated Time:** ~30 min core (Stages 1–4 + ship). **Optional stretch:** Stages 5–6 (+~15 min).
**Branch:**
```bash
git checkout main && git pull
git checkout -b USERNAME/module-5-sprint
```

> **Builds on Module 4** (the `agent_task` template, `copilot-setup-steps.yml`) **and Module 3** (CI + review). Unlike earlier modules where you build every artifact from scratch, this one **ships a working kickoff** you'll read, run, and customize.

> **Set expectations up front:** the win is a **reviewed head start**, not "sprint done." Copilot won't nail every item — the value is that Monday begins with PRs to react to instead of a blank backlog.

## What You'll Learn
- [ ] Curate a **sprint backlog** the agent can act on (`.github/sprint/backlog.yml`)
- [ ] **Classify** work: agent-ready vs. human-first
- [ ] Make **unattended runs safe** (required review, CI gate, branch protection, least tools, a scoped token)
- [ ] Run the **Sprint Kickoff** workflow to import + delegate a batch in one go
- [ ] Run a fast **Monday triage** over the returned draft PRs
- [ ] **Ship it**: PR + Copilot review

## The sample sprint (grounded in TaskFlow's rough edges)

| Work item | Delegate? |
| --------- | --------- |
| `top_priority` returns *lowest* priority — sort descending, tie by id, add test | ✅ agent-ready |
| Validate `status`/`priority`; return 422 on bad input + tests | ✅ agent-ready |
| Add `GET /tasks/{id}` (404 on missing) + typed web client fn | ✅ agent-ready |
| Replace `any` in `web/src/api.ts` with `types.ts` models | ✅ agent-ready |
| Add loading/error/empty states to `App.tsx` + `TaskList.tsx` | ✅ agent-ready |
| Extract the hard-coded API base URL into one config | ✅ agent-ready |
| Swap the in-memory store for a real database | ⛔ human-first (architecture) |
| Add authentication/authorization | ⛔ human-first (security) |

## 🎯 Stage 1: Curate the sprint backlog (7 min)

Open [.github/sprint/backlog.yml](../.github/sprint/backlog.yml) — the list the kickoff reads. Each item has a title, a body with **acceptance criteria**, and a `delegate` flag:
```yaml
items:
  - title: "Fix top_priority to return the highest-priority tasks"
    delegate: true
    body: |
      Sort descending by priority; tie-break by id. Add a failing test first.
```

Practice generating it from the code. In **Ask** mode:
```markdown
#codebase From TaskFlow's known rough edges, propose 6 well-scoped sprint items with
acceptance criteria I could hand to a coding agent, plus 2 that a human should own.
Format them as entries for .github/sprint/backlog.yml.
```
Merge the good ones into the file.

**✅ Checkpoint:** a backlog of scoped items, each with acceptance criteria.

## 🎯 Stage 2: Classify for delegation (6 min)

This is the core skill. Set `delegate: true` **only** for work that is scoped, testable, and low-ambiguity — never an architecture or security call.

| Delegate (`true`) | Keep human-first (`false`) |
| ----------------- | -------------------------- |
| Clear bug with a repro | "Improve performance" (vague) |
| Add endpoint/component to an existing pattern | New auth or permissions model |
| Add tests, types, validation | Database/architecture change |
| Small, mechanical refactor | Anything needing a product decision |

**✅ Checkpoint:** every item has a `delegate` flag you can defend.

## 🎯 Stage 3: Make it safe, then kick off (8 min)

Before anything runs while you're away, put the safety rails in place:
- **Required review + branch protection** on `main` so nothing auto-merges.
- A **CI gate** (the `ci.yml` from the capstone) so broken PRs are caught.
- **`copilot-setup-steps.yml`** (Module 4) so the agent can build and test.
- **A scoped token.** The assignment API needs a **user PAT**, *not* the default `GITHUB_TOKEN`. Add a fine-grained PAT as the **`COPILOT_ASSIGN_TOKEN`** secret (Metadata: read; read/write on Actions, Contents, Issues, Pull requests). Without it, the workflow still imports the labeled issues — it just won't assign Copilot.

Open [.github/workflows/sprint-kickoff.yml](../.github/workflows/sprint-kickoff.yml) and read it: `workflow_dispatch` now, `schedule` commented for later. It ensures the labels exist, creates an issue per item, and assigns the `delegate` items to `copilot-swe-agent[bot]` via the `agent_assignment` API.

Run it: **Actions** tab → **Sprint Kickoff** → **Run workflow**. Keep **limit** at `2` the first time, then watch the **Issues** tab fill and draft PRs open on **Pull requests**.

**✅ Checkpoint:** 2 issues created and (with the PAT) 2 draft PRs in progress from Copilot.

## 🎯 Stage 4: Monday triage (5 min)

Reviewing a stack of draft PRs should be quick. Build a triage prompt — `.github/prompts/triage-batch.prompt.md`:
```markdown
---
agent: 'agent'
description: 'Triage the open draft PRs from the sprint kickoff'
tools: ['codebase', 'changes']
---

# Triage the batch
For each open draft PR from the sprint kickoff, give a one-line verdict —
**merge-ready**, **needs-iteration**, or **close** — with the reason and any missing
tests, following `.github/instructions/code-review.instructions.md`.
Do not edit code; output a table.
```
(Or reuse your **Reviewer agent** from Module 3 on each PR.) Then route each one: approve, request changes, or close. **Nothing merges without a human.**

**✅ Checkpoint:** a ranked review queue you could hand to the team.

## 🚀 Ship it (4 min)
1. **Commit** your customized `backlog.yml` + the `triage-batch` prompt.
2. **Push:** `git push -u origin USERNAME/module-5-sprint`
3. **Open a PR** and request a **Copilot review**.

## 🧗 Stage 5 (Optional stretch): Turn on the schedule (+8 min)

**Your goal:** make the kickoff run itself.

**Done when one of these is true:**
- [ ] You uncomment the `schedule:` cron in `sprint-kickoff.yml` so it runs every Sunday night, and add a step that posts a **Monday summary** of the new issues + draft PRs.
- [ ] Or you recreate the same flow as a native **Copilot Automation** (repo **Agents** tab → **Automations**) with a weekly trigger.

<details><summary>💡 Note</summary>

Native automations need a **private/internal** repo on **Copilot Business/Enterprise** — the Actions workflow here is the portable option that also works on public repos.

</details>

## 🧗 Stage 6 (Optional stretch): Score it & close the loop (+7 min)

**Your goal:** turn the batch into a process that improves each sprint.

**Done when:**
- [ ] You track a simple **scorecard** — how many PRs merged as-is, needed one round, or were discarded.
- [ ] You turn the top recurring failure into a **new rule** in `copilot-instructions.md` or the `agent_task` template. That feedback loop is the actual process improvement.

## ✅ Completion Checklist
- [ ] Curated a scoped sprint backlog
- [ ] Classified every item agent-ready vs. human-first
- [ ] Put the safety rails + scoped PAT in place
- [ ] Ran the Sprint Kickoff and got draft PRs
- [ ] Built a `triage-batch` prompt and ranked the PRs
- [ ] *(Optional stretch)* Turned on the schedule / Monday summary
- [ ] *(Optional stretch)* Scored the batch + fed a learning back
- [ ] Opened a PR and got a Copilot review

## 🔀 Try it another way
Batch delegation has a few front doors — try a couple and pick your default:
- **Import path:** run the workflow vs. create the same issues from chat through the **GitHub MCP** (Module 4) vs. `gh issue create` in a loop.
- **Kickoff:** assign Copilot from the workflow vs. from the issue's **Assignees → Copilot** in the UI vs. `gh agent-task create` for a one-off.

## 🧠 Advanced sidebar
- **Keep it safe:** required reviews + branch protection so nothing auto-merges; give the agent only the tools it needs and set the firewall allowlist; never put secrets in issue or prompt text — use repo secrets.
- **Tokens:** the assignment API takes a **user PAT**, not `GITHUB_TOKEN`; scope it down and store it as a secret.
- **Concurrency & cost:** sessions may queue, and each delegated item uses premium requests — start with `limit: 2` and grow.
- **Native automations:** the **Agents → Automations** feature runs Copilot on a schedule or on events (issue opened, PR opened) without a workflow file — on private/internal repos with Business/Enterprise.
- **Right work only:** delegate scoped, testable items; keep architecture, security, and ambiguous work human-first.

## 🏁 What's Next?
Continue to [Module 6: Capstone — Roll It Out to Your Team](06-capstone.md).

### 🌟 Take-home challenge
Next sprint, put 5 genuinely-scoped items in `backlog.yml`, add the PAT secret, and run the kickoff Friday afternoon. Monday, measure how many PRs merge with ≤1 round of changes — and turn the most common gap into a new instruction rule.
