# Module 3: Code Review Mastery

**Goal:** Make code review faster and more consistent with Copilot — from inline review while you code, to a **Copilot review on the PR**, to **writing down your team's review standards** so every review (human or AI) checks the same things. TaskFlow's planted bugs and gaps give you plenty to catch.

**Estimated Time:** ~45 minutes
**Branch:**
```bash
git checkout main && git pull
git checkout -b USERNAME/module-3-review
```

## What You'll Learn
- [ ] Use inline review, Source Control review, and **Copilot PR review**
- [ ] Encode custom **review criteria** so Copilot catches *your* issues
- [ ] Build a **Reviewer agent** and a **review skill** tuned to this repo
- [ ] Standardize with a PR template
- [ ] **Ship it**: PR + Copilot review

## 🎯 Stage 1: Review in the editor (6 min)

**1. Inline review.** Open [api/taskflow/service.py](../api/taskflow/service.py), select `top_priority`, right-click → **Copilot → Review and Comment** (the menu may read **Generate Code → Review**). Read the inline comments in the **Comments** panel.

**2. Source Control review.** Make a small edit somewhere, then open **Source Control**, hover **CHANGES**, and click **Code Review - Changes**. Comments appear inline and in the **Problems** tab.

**✅ Checkpoint:** You've reviewed a selection and a set of changes locally.

## 🎯 Stage 2: Copilot review on a PR (7 min)

**1.** Make a real change to review — e.g., ask Agent mode to *"add a `GET /tasks/{id}` endpoint and a web client function"* (it'll likely have gaps).
**2.** Commit, push, and open a PR.
**3.** Under **Reviewers**, next to **Copilot**, click **Request**. Pick a **review effort** (Lite vs. Balanced) if offered.
**4.** Triage: each comment is labeled **High / Medium / Low**. Resolve, reply, or click **Apply suggestion**.

**✅ Checkpoint:** A Copilot review on your PR, with at least one suggestion applied.

## 🎯 Stage 3: Encode your review criteria (8 min)

Out of the box, Copilot review is general. Make it catch *your* issues by adding review instructions the reviewer reads.

Create `.github/instructions/code-review.instructions.md`:
```markdown
---
applyTo: "**"
---
# What reviewers (human and Copilot) must flag
- Any `any` in TypeScript, or missing loading/error handling on async UI.
- API routes that don't validate input or don't raise specific HTTP errors.
- Ranking/sorting logic — confirm direction and tie-breaking are correct.
- Logic changes without a matching test.
- Hard-coded URLs, secrets, or magic numbers.
```

Now run a Source Control review over `api/taskflow/service.py` and `web/src/api.ts`. It should now call out the `top_priority` sort direction, the missing validation, and the `any` returns.

**✅ Checkpoint:** Copilot review flags the planted issues, not just generic ones.

## 🧗 Stage 4 (Challenge): A Reviewer agent (8 min)

**Your goal:** Build a reusable **Reviewer** agent tuned to TaskFlow that reviews changes and **never edits code**.

**Done when `.github/agents/reviewer.agent.md`:**
- [ ] Has frontmatter (`name`, `description`, `tools` — read-only + `changes`).
- [ ] Groups findings by **Blocking / Suggestion / Nit** with file+line.
- [ ] Explicitly checks the criteria from your `code-review.instructions.md`.
- [ ] Returns a checklist and makes no edits.

<details><summary>💡 Stuck? Reveal a hint</summary>

Create it via `/agents` → **New Agent**. Give it `tools: ['search/codebase', 'search/usages', 'changes']` and a body that says "Do not edit. Report Blocking/Suggestion/Nit against our review instructions." Select it from the mode picker and run "Review my staged changes."

</details>

## 🧗 Stage 5 (Challenge): A review skill + PR template (6 min)

**Your goal:** Make your standards discoverable to Copilot's PR reviewer *and* to humans.

**Done when:**
- [ ] `.github/skills/code-review/SKILL.md` captures the team's review checklist (the folder name `code-review` helps Copilot code review pick it up).
- [ ] `.github/pull_request_template.md` prompts for *what/why*, *how to test*, and a checklist that mirrors your review criteria.

<details><summary>💡 Stuck? Reveal a hint</summary>

The skill's frontmatter needs `name` and `description`. Keep the checklist identical to your review instructions so humans and Copilot converge on the same bar.

</details>

## 🚀 Ship it (4 min)
1. **Commit** your review instructions, Reviewer agent, skill, and PR template.
2. **Push:** `git push -u origin USERNAME/module-3-review`
3. **Open a PR** and request a **Copilot review** — notice it now applies your criteria.

## ✅ Completion Checklist
- [ ] Used inline + Source Control review
- [ ] Ran a Copilot PR review and triaged by severity
- [ ] Added `code-review.instructions.md`
- [ ] Built a Reviewer agent + review skill + PR template
- [ ] Opened a PR and got a Copilot review

## 🔀 Try it another way
Copilot review shows up in several places — run the same change through a couple and see what each catches:
- **Three surfaces, one bug:** review `top_priority` as an inline selection, then via **Source Control → Code Review**, then on a **PR**. The PR review sees the whole change; inline stays tightly focused.
- **Agent vs. instructions:** review a diff with just your `code-review.instructions.md` in place, then again using your **Reviewer agent**. Compare how the findings are organized.

## 🧠 Advanced sidebar

- **Automatic reviews:** repository/org **rulesets** can make Copilot review *every* PR, and optionally re-review new pushes.
- **Copilot approvals (preview):** Copilot can leave an *approving* review that counts toward required approvals, configurable per repo/org/path.
- **Review environment:** Copilot review runs in a temporary environment you can customize with `.github/workflows/copilot-setup-steps.yml` (preinstall tools) — the same file you'll add in Module 4.
- **MCP & skills in review:** Copilot code review can use repo skills and MCP servers (GitHub, Playwright) when relevant.

## 🏁 What's Next?
Continue to [Module 4: Coding Agent at Scale](04-coding-agent.md).

### 🌟 Take-home challenge
Turn one recurring review nit from your real team into a `code-review.instructions.md` rule, enable Copilot as an automatic reviewer on a repo, and measure whether that nit stops appearing in human reviews.
