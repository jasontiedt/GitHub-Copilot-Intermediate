# Module 3: Code Review Mastery

**Goal:** Make code review faster and more consistent with Copilot — from inline review while you code, to a **Copilot review on the PR**, to **writing down your team's review standards** so every review (human or AI) checks the same things. TaskFlow's planted bugs — plus a ready-made **`review-practice`** PR — give you plenty to catch.

**Estimated Time:** ~25 min core (Stages 1–3 + ship). **Optional stretch:** Stages 4–5 (+~15 min).
**Branch:**
```bash
git checkout main && git pull
git checkout -b USERNAME/module-3-review
```

## What You'll Learn
- [ ] Use inline review, Source Control review, and **Copilot PR review**
- [ ] Review a **planted PR** (`review-practice`) and score what Copilot catches
- [ ] Encode custom **review criteria** so Copilot catches *your* issues
- [ ] Build a **Reviewer agent** plus **skills** (a review skill + a domain skill) tuned to this repo
- [ ] Standardize with a PR template
- [ ] **Ship it**: PR + Copilot review

## 🎯 Stage 1: Review in the editor (6 min)

**1. Inline review.** Open [api/taskflow/service.py](../api/taskflow/service.py), select `top_priority`, right-click → **Copilot → Review and Comment** (the menu may read **Generate Code → Review**). Read the inline comments in the **Comments** panel.

**2. Source Control review.** Make a small edit somewhere, then open **Source Control**, hover **CHANGES**, and click **Code Review - Changes**. Comments appear inline and in the **Problems** tab.

**✅ Checkpoint:** You've reviewed a selection and a set of changes locally.

## 🎯 Stage 2: Copilot review on a planted PR (7 min)

This repo ships a branch — **`review-practice`** — that adds a "task search + bulk-complete" feature with **problems deliberately planted** across security, correctness, and TypeScript quality. Review it *with Copilot's help* and see how many you catch.

**1.** Once the branch is on GitHub, open a PR from `review-practice` into `main` (**Compare & pull request**).
**2.** Under **Reviewers**, next to **Copilot**, click **Request**. Pick a **review effort** (Lite vs. Balanced) if offered.
**3.** Read the review. Each comment is labeled **High / Medium / Low** — triage them: resolve, reply, or **Apply suggestion**.
**4.** **Score it:** how many of the planted problems did Copilot find on its own? Note what it missed — you'll close that gap in Stage 3.

<details><summary>🔑 Facilitator answer key — the planted problems</summary>

**Security**
- Hard-coded secret `ADMIN_TOKEN` in `api/taskflow/search.py`.
- `/admin/logs` takes a `token` in the **query string** (leaks into logs/history) and returns every user's search log — broken access control + data exposure.
- `/admin/logs` returns `200` with `{"error": "forbidden"}` instead of `403`.
- `POST /tasks/bulk-complete` mutates data with **no auth**.
- `TaskSearch.tsx` renders server data with `dangerouslySetInnerHTML` → **XSS**.

**Correctness**
- `search_tasks` uses a **mutable default argument** (`tags=[]`).
- `search_tasks` can add the **same task twice**, is case-sensitive, and matches everything on an empty query.
- `bulk_complete` has a **bare `except: pass`** and no `None` check on a missing id.

**API design & types**
- `BulkComplete.ids` is an **untyped `list`** (should be `list[int]`); `q` isn't length-limited.
- `any` return/param types in `web/src/api.ts` and `any[]` state in the component.

**Quality**
- **Hard-coded URL** instead of `BASE`; query built by string concat without `encodeURIComponent`; **no `res.ok`/error handling**; no loading state; missing React `key`.
- **No tests** for any of the new logic.

</details>

**✅ Checkpoint:** A Copilot review on the planted PR, triaged by severity, plus a rough count of what it caught vs. missed.

## 🎯 Stage 3: Encode your review criteria (8 min)

Out of the box, Copilot review is general. Make it catch *your* issues by adding review instructions the reviewer reads.

Create `.github/instructions/code-review.instructions.md`:
```markdown
---
applyTo: "**"
---
# What reviewers (human and Copilot) must flag
- Any `any` in TypeScript, or missing loading/error handling on async UI.
- `dangerouslySetInnerHTML` or any unescaped user/server content rendered to the DOM.
- API routes that don't validate input, don't raise specific HTTP errors, or mutate data without auth.
- Secrets in code, tokens passed in URLs/query strings, or a bare `except:` that hides errors.
- Ranking/sorting logic — confirm direction and tie-breaking are correct.
- Logic changes without a matching test; hard-coded URLs or magic numbers.
```

Now **re-review the `review-practice` PR** with the criteria in place (request Copilot again, or run a Source Control review over the branch's changes). Compare against your Stage 2 score — it should now catch the security and correctness issues it glossed over, because they're spelled out.

**✅ Checkpoint:** With your criteria, Copilot flags the *planted* issues — measurably more than the generic pass in Stage 2.

## 🧧 Stage 4 (Optional stretch): A Reviewer agent (+8 min)

**Your goal:** Build a reusable **Reviewer** agent tuned to TaskFlow that reviews changes and **never edits code**.

**Done when `.github/agents/reviewer.agent.md`:**
- [ ] Has frontmatter (`name`, `description`, `tools` — read-only + `changes`).
- [ ] Groups findings by **Blocking / Suggestion / Nit** with file+line.
- [ ] Explicitly checks the criteria from your `code-review.instructions.md`.
- [ ] Returns a checklist and makes no edits.

<details><summary>💡 Stuck? Reveal a hint</summary>

Create it via `/agents` → **New Agent**. Give it `tools: ['search/codebase', 'search/usages', 'changes']` and a body that says "Do not edit. Report Blocking/Suggestion/Nit against our review instructions." Select it from the mode picker and run "Review my staged changes."

</details>

## 🧧 Stage 5 (Optional stretch): Skills + PR template (+7 min)

**Your goal:** Make your standards discoverable to Copilot's PR reviewer *and* to humans — and see that **skills package any reusable knowledge, not just review rules**.

**Done when:**
- [ ] `.github/skills/code-review/SKILL.md` captures the team's review checklist (the folder name `code-review` helps Copilot code review pick it up).
- [ ] A second, **non-review** skill — `.github/skills/taskflow-domain/SKILL.md` — captures the facts Copilot keeps getting wrong: the valid statuses (`todo`/`in_progress`/`done`), that **higher `priority` means more important** (the sort bug from Module 4!), the in-memory store, and "no auth yet." Copilot pulls it in whenever a task touches those areas.
- [ ] `.github/pull_request_template.md` prompts for *what/why*, *how to test*, and a checklist that mirrors your review criteria.

<details><summary>💡 Stuck? Reveal a hint</summary>

Each skill is a folder under `.github/skills/` with a `SKILL.md` whose frontmatter has `name` and `description` — Copilot reads the description to decide when to pull the skill in, so make it specific. Keep the review checklist identical to your review instructions; for the domain skill, just state the facts plainly ("Priority is higher-is-more-important; the store is in-memory").

</details>

## 🚀 Ship it (4 min)
1. **Commit** your review instructions, Reviewer agent, skills, and PR template.
2. **Push:** `git push -u origin USERNAME/module-3-review`
3. **Open a PR** and request a **Copilot review** — notice it now applies your criteria.

## ✅ Completion Checklist
- [ ] Used inline + Source Control review
- [ ] Reviewed the planted `review-practice` PR and scored Copilot's catch rate
- [ ] Added `code-review.instructions.md`
- [ ] *(Optional stretch)* Built a Reviewer agent + skills (review + domain) + PR template
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
