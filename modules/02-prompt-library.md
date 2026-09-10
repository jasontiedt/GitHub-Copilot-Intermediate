# Module 2: Designing a Reusable Prompt Library

**Goal:** Build a **prompt library** that turns your team's common tasks into one-command slash prompts — so anyone joining the project can be productive on day one. Instructions shape *every* response; **prompt files** handle *specific, repeatable tasks* you run on demand.

> **Current compatibility:** `.prompt.md` files run with VS Code's **Local** harness. They are deprecated for **Agent Host** sessions, which do not load them. This module teaches prompt files because they remain useful locally; convert the finished prompts to **Agent Skills** before adopting Agent Host.

**Estimated Time:** ~25 min core (Stages 1–3 + ship). **Optional stretch:** Stages 4–5 (+~15 min).
**Branch:**
```bash
git checkout main && git pull
git checkout -b USERNAME/module-2-prompts
```

## What You'll Learn
- [ ] Identify the repeatable tasks worth encoding
- [ ] Author prompt files with `agent:`, `description`, and `argument-hint`
- [ ] Parameterize prompts with input variables
- [ ] Build an **onboarding** prompt that helps anyone new get started
- [ ] **Ship it**: PR + Copilot review

## 🎯 Stage 1: Inventory the repeatable work (5 min)

Select **Ask** from the agent picker:
```markdown
Search this workspace. What tasks does a developer repeat often in this repo (adding an API endpoint, adding a web component, writing tests, preparing a PR)? For each, list the steps and the files touched.
```
Pick 3–4 to turn into prompts. Good candidates: **scaffold an endpoint**, **scaffold a component**, **write tests**, **prep a PR**, **onboard a newcomer**.

**✅ Checkpoint:** A short list of prompts worth building.

## 🎯 Stage 2: Your first prompt — scaffold an API endpoint (8 min)

Create `.github/prompts/scaffold-endpoint.prompt.md`:
```markdown
---
agent: 'agent'
description: 'Scaffold a FastAPI endpoint with service function and a test'
argument-hint: '<HTTP method> <path> — e.g. GET /tasks/{id}'
tools: ['search', 'edit']
---

# Scaffold an API endpoint

Add the endpoint I describe to the TaskFlow API, following `.github/instructions/api.instructions.md`:
1. A pure function in `taskflow/service.py` (type-hinted, unit-testable).
2. A route in `taskflow/app.py` using a Pydantic model for any body; validate input and raise `HTTPException` on bad data.
3. A pytest in `tests/` covering the happy path and one edge case.

Ask me for the method/path if I didn't provide it, then implement and stop.
```
Run it: `/scaffold-endpoint GET /tasks/{id}`.

**✅ Checkpoint:** One command scaffolds service + route + test.

## 🎯 Stage 3: A web component prompt (6 min)

Create `.github/prompts/scaffold-component.prompt.md`:
```markdown
---
agent: 'agent'
description: 'Scaffold a typed React component with loading/error states'
argument-hint: '<ComponentName> and what it renders'
tools: ['search', 'edit']
---

# Scaffold a web component

Create a React + TypeScript component under `web/src/components/`, following `.github/instructions/web.instructions.md`:
- Typed props (no `any`); data typed via `src/types.ts`.
- Explicit loading and error states for any async data.
- A colocated test using React Testing Library + `userEvent`.

Ask me for the component name and purpose if missing, then implement and stop.
```
Try it: `/scaffold-component TaskFilter that filters the list by status`.

**✅ Checkpoint:** Generated components follow your web conventions by default.

## 🧧 Stage 4 (Optional stretch): The onboarding prompt (+10 min)

**Your goal:** Create `.github/prompts/onboard-me.prompt.md` — the *first thing* a new hire runs. It should explain the repo without them reading every file.

**Done when your prompt:**
- [ ] Uses `agent: 'ask'` (it explains; it doesn't edit).
- [ ] Summarizes the architecture (web ↔ api), how to run both, and the key conventions.
- [ ] Points to where things live and lists the current known rough edges.
- [ ] Ends by suggesting a good first task.

<details><summary>💡 Stuck? Reveal a hint</summary>

With the **Local** harness selected, create it via `/prompts`, or open **Configure Chat** (gear) → **Prompts** → **New Prompt (Workspace)**. To generate it with AI, type `/create-prompt`. Have the body tell Copilot to search the codebase, read the READMEs and instruction files, then produce a 1-page overview. Test it by running `/onboard-me`.

</details>

## 🧧 Stage 5 (Optional stretch): A workflow prompt — prep a PR (+6 min)

**Your goal:** Create `.github/prompts/prep-pr.prompt.md` that gets a change ready to ship.

**Done when it:**
- [ ] Summarizes the current diff, flags missing tests, and drafts a PR title + description.
- [ ] Reminds the author to run `pytest` (api) and `npm run typecheck` (web).

<details><summary>💡 Stuck? Reveal a hint</summary>

Use the `changes` context and `agent: 'agent'`. Body: "Summarize staged changes, list any logic without tests, and output a PR title + description with a testing checklist."

</details>

## 🚀 Ship it (4 min)
1. **Commit** your `.github/prompts/` library.
2. **Push:** `git push -u origin USERNAME/module-2-prompts`
3. **Open a PR** and request a **Copilot review**.

## ✅ Completion Checklist
- [ ] Built `scaffold-endpoint` and `scaffold-component`
- [ ] *(Optional stretch)* Built the `onboard-me` prompt
- [ ] *(Optional stretch)* Built `prep-pr`
- [ ] Opened a PR and got a Copilot review

## 🔀 Try it another way
Prompts aren't the only way to package a task — compare a couple:
- **Prompt file vs. ad-hoc:** run `/scaffold-endpoint GET /tasks/{id}`, then in a fresh chat describe the same task by hand. The prompt should win on consistency — that's the whole point of turning it into one.
- **Author it two ways:** hand-write a `.prompt.md`, or run `/create-prompt` and let Copilot scaffold the frontmatter for you. Try both on your `prep-pr` prompt and keep the cleaner result.

## 🧠 Advanced sidebar

- **Prompts vs. instructions vs. skills vs. agents:** *instructions* shape responses automatically; *prompts* run a specific Local-harness task on demand; *skills* package reusable workflows and resources that Copilot loads when relevant; *custom agents* bundle instructions and tools into a specialized agent. Use the [customization decision matrix](https://code.visualstudio.com/docs/agents/concepts/customization) when unsure.
- **Input variables:** `${input:name}` / `${input:name:placeholder}` and `argument-hint` make prompts parameterized and discoverable.
- **Sharing & sync:** workspace prompts live in `.github/prompts` (versioned with the repo); user prompts sync across your devices via Settings Sync. Browse community examples in [Awesome Copilot](https://github.com/github/awesome-copilot).
- **Agent Host migration:** select the target Agent Host, open **Configure Chat** → **Overview** → **Migrate Prompt Files** → **Convert to Skills...**, choose the prompts, and select **Convert to Skills**. Review the result because some prompt frontmatter does not have an equivalent skill property.

## 🏁 What's Next?
Continue to [Module 3: Code Review Mastery](03-code-review.md).

### 🌟 Take-home challenge
Encode your real team's "definition of done" as a `prep-pr` prompt, and write an `onboard-me` prompt for your actual repo. Hand it to the next new hire and see how far it gets them before they ask a human.
