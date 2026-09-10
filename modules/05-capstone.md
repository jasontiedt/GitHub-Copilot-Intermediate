# Module 5: Capstone — Team Enablement Playbook

**Goal:** Bring everything together into a **team enablement playbook** — the artifacts and rollout plan that make Copilot a consistent, measurable part of how your team works. By the end you'll have a portable `.github/` pack plus a written plan you could hand to any team.

**Estimated Time:** ~40 minutes
**Branch:**
```bash
git checkout main && git pull
git checkout -b USERNAME/module-5-capstone
```

## What You'll Build
- [ ] A coherent, audited `.github/` customization pack
- [ ] Team plumbing: CODEOWNERS, CI, issue/PR templates
- [ ] An **`ENABLEMENT.md`** playbook (rollout + metrics + governance)
- [ ] A **Copilot Space** for shared team context

## 🎯 Stage 1: Audit & assemble the pack (8 min)

Bring the artifacts from Modules 1–4 onto one branch and sanity-check them together:
```text
.github/
├── copilot-instructions.md        # M1
├── AGENTS.md                      # M1
├── instructions/*.instructions.md # M1, M3
├── prompts/*.prompt.md            # M2
├── skills/code-review/SKILL.md    # M3
├── agents/*.agent.md              # M3, M4
├── ISSUE_TEMPLATE/agent_task.md   # M4
├── pull_request_template.md       # M3
└── workflows/copilot-setup-steps.yml  # M4
```
Ask Copilot: *"Review my `.github/` customization files for overlap, contradictions, and gaps. Suggest what to merge or trim."*

**✅ Checkpoint:** No duplicated or conflicting rules across the pack.

## 🧗 Stage 2 (Challenge): Add team plumbing (10 min)

**Your goal:** Make the standards enforceable, not just advisory.

**Done when you've added:**
- [ ] **`.github/CODEOWNERS`** routing reviews to the right people/areas.
- [ ] **`.github/workflows/ci.yml`** that runs `pytest` (api) and `typecheck` + `build` (web) on every PR.
- [ ] Any missing issue templates (bug, feature) alongside `agent_task`.

<details><summary>💡 Stuck? Reveal a hint</summary>

Ask Agent mode to "add a CI workflow that runs the api tests and the web typecheck/build in two jobs." For CODEOWNERS, map `web/` and `api/` to their owners. (Use `npm ci` with a committed `package-lock.json` in real CI; `npm install` is fine here.)

</details>

## 🧗 Stage 3 (Challenge): Write the enablement playbook (10 min)

**Your goal:** Create `ENABLEMENT.md` at the repo root — the human-readable plan.

**Done when it covers:**
- [ ] **What we standardized** and why (link the `.github/` artifacts).
- [ ] **How to use it** — the prompt library, the Reviewer agent, delegating to the coding agent.
- [ ] **Rollout** — phases (pilot → team → org), who owns the instructions/prompts.
- [ ] **Metrics** — what "working" looks like (fewer repeat review comments, faster PRs, adoption).
- [ ] **Governance** — least-privilege tools, review-before-merge, keeping instructions lean and current.

<details><summary>💡 Stuck? Reveal a hint</summary>

Ask Copilot to "draft an ENABLEMENT.md from the `.github/` artifacts in this repo," then edit it to match how your team actually operates. Keep it to ~2 pages.

</details>

## 🎯 Stage 4: Create a Copilot Space (5 min)

On [github.com/copilot](https://github.com/copilot), create a **Copilot Space** for the team:
1. Add this repository and the key docs (`ENABLEMENT.md`, instruction files) as context.
2. Set the Space's goal (e.g., "Onboard and support TaskFlow contributors").
3. Share it with the team — now anyone can chat with the project's shared context.

**✅ Checkpoint:** A Space that packages the project's context for everyone.

## 🎯 Stage 5: Measure & iterate (3 min)

Decide how you'll keep this alive:
- Track **usage** (org Copilot dashboards) and **review acceptance** (are Copilot's suggestions applied?).
- Watch for **repeat review comments** — each one is a candidate for a new instruction rule.
- Put instructions/prompts on a **review cadence** so they don't go stale.

## 🚀 Ship it (4 min)
1. **Commit** the plumbing + `ENABLEMENT.md`.
2. **Push:** `git push -u origin USERNAME/module-5-capstone`
3. **Open a PR** and request a **Copilot review** — this PR *is* your enablement pack landing.

## ✅ Completion Checklist
- [ ] Audited and assembled the `.github/` pack
- [ ] Added CODEOWNERS + CI + issue templates
- [ ] Wrote `ENABLEMENT.md`
- [ ] Created a Copilot Space
- [ ] Defined metrics + a refresh cadence
- [ ] Opened a PR and got a Copilot review

## 🎉 You're done!

You've turned a messy polyglot repo into one with **team-wide instructions**, a **reusable prompt library**, **codified review standards**, **agent-ready delegation**, and a **rollout plan** — all portable to your real projects.

### 🌟 Take-home challenge
Run this playbook on one of your team's real repositories: land a lean instruction pack + an onboarding prompt + a Reviewer agent + a CI gate in a single "Copilot enablement" PR, and present the before/after to your team.
