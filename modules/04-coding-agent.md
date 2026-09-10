# Module 4: Coding Agent at Scale

**Goal:** Delegate real work to the **Copilot coding agent** and get good results — which is mostly a skill of **scoping and writing agent-ready issues**, plus giving the agent the right **tools (MCP)**, **environment**, and **custom agents**. You'll fix TaskFlow's planted `top_priority` bug *by delegation*, not by hand.

**Estimated Time:** ~25 min core (Stages 1–3 + ship). **Optional stretch:** Stages 4–5 (+~18 min).
**Branch:**
```bash
git checkout main && git pull
git checkout -b USERNAME/module-4-agent
```

## What You'll Learn
- [ ] Write an **agent-ready issue** (scope, acceptance criteria, repro)
- [ ] Delegate to the **coding agent** and review its PR
- [ ] Build **custom agents** the coding agent can run
- [ ] Configure **MCP** for the agent
- [ ] Give the agent a working **environment** (`copilot-setup-steps.yml`)
- [ ] **Ship it**: PR + Copilot review

## 🎯 Stage 1: Write an agent-ready issue (8 min)

Vague issues get vague PRs. Create a reusable template — `.github/ISSUE_TEMPLATE/agent_task.md`:
```markdown
---
name: Agent task
about: A well-scoped task for the Copilot coding agent
title: "[Agent] "
labels: agent
---

## Context
(What & why. Link the relevant files.)

## Acceptance criteria
- [ ]
- [ ]

## Reproduction / current behavior
1.

## Scope
- In scope:
- Out of scope:

## Verification
(How the agent should prove it's done — tests to add/run.)
```

Then draft an issue for the planted bug using it — e.g. *"`/focus` returns the lowest-priority tasks; `top_priority` sorts ascending. Expected: highest priority first, ties by id. Add a test."*

**✅ Checkpoint:** An issue a stranger could act on without asking questions.

## 🎯 Stage 2: Delegate to the coding agent (7 min)

**1.** Create the issue on GitHub (or via the GitHub MCP server — see Stage 4). Include the acceptance criteria and verification.
**2.** **Assign it to Copilot.** The coding agent starts working in the background and opens a **draft PR**.
**3.** Watch it via the PR's **View session** link.

**✅ Checkpoint:** The coding agent is working and has opened a PR.

## 🎯 Stage 3: Review the agent's PR (6 min)

1. Open the PR. Read the **session** to see how it diagnosed the bug.
2. Confirm it made the sort **descending**, handled ties, and **added a test**.
3. Review like a human: approve, comment, or push back on scope. Request changes if it over-reached.

**✅ Checkpoint:** A correct, tested fix — delegated, not hand-written.

## 🧧 Stage 4 (Optional stretch): Custom agents + MCP (+10 min)

**Your goal:** Give the agent sharper tools.

**Done when:**
- [ ] You built a focused custom agent (e.g. `.github/agents/test-author.agent.md`) that writes tests for a target file and nothing else.
- [ ] You configured **MCP** in `.vscode/mcp.json` so Copilot can create/query issues:
  ```json
  {
    "servers": {
      "github": { "url": "https://api.githubcopilot.com/mcp/" }
    }
  }
  ```
- [ ] From **Agent** mode, you created an issue *through* the GitHub MCP server (instead of the web UI).

<details><summary>💡 Stuck? Reveal a hint</summary>

Create the agent via `/agents` → **New Agent** with read + edit + test tools. Start the MCP server from `.vscode/mcp.json` (**Start** → **Allow**), then ask Agent mode: "Create an issue titled … with these acceptance criteria." Confirm the tools appear in the tools picker.

</details>

## 🧧 Stage 5 (Optional stretch): Give the agent an environment (+8 min)

**Your goal:** Ensure the coding agent (and Copilot code review) can build and test TaskFlow by preinstalling dependencies.

**Done when `.github/workflows/copilot-setup-steps.yml`:**
- [ ] Has a job **named exactly `copilot-setup-steps`**.
- [ ] Installs Node + web deps and Python + api deps.

<details><summary>💡 Stuck? Reveal a hint</summary>

```yaml
name: Copilot Setup Steps
on: workflow_dispatch
jobs:
  copilot-setup-steps:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm install
        working-directory: web
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install -r requirements.txt
        working-directory: api
```

</details>

## 🚀 Ship it (4 min)
1. **Commit** the issue template, custom agent(s), `mcp.json`, and `copilot-setup-steps.yml`.
2. **Push:** `git push -u origin USERNAME/module-4-agent`
3. **Open a PR** and request a **Copilot review**.

## ✅ Completion Checklist
- [ ] Created an agent-ready issue template
- [ ] Delegated the `top_priority` fix and reviewed the agent's PR
- [ ] *(Optional stretch)* Built a focused custom agent
- [ ] *(Optional stretch)* Configured MCP and created an issue through it
- [ ] *(Optional stretch)* Added `copilot-setup-steps.yml`
- [ ] Opened a PR and got a Copilot review

## 🔀 Try it another way
Delegation has a few front doors — try a couple and pick your default:
- **Local vs. background:** fix `top_priority` yourself in **Agent** mode first, then delegate the same bug to the **coding agent** and compare the diffs. One is instant; the other frees you up and opens a reviewable PR.
- **Web UI vs. MCP:** create the task issue on github.com, then create an equivalent one *through* the GitHub MCP server from chat. Same result, two workflows — handy when you want to stay in the editor.

## 🧠 Advanced sidebar

- **Subagents:** a custom agent can delegate to other agents for multi-step work — useful for large refactors.
- **Automations:** start agent sessions automatically on events (issue opened, failing Actions run) or on a schedule.
- **Keeping it safe:** give the agent only the **tools** it needs, configure the **firewall** (allowed domains), and require review before merge. Keep the agent's environment consistent via the setup-steps file.
- **Where agents run:** the same custom agents work locally, on the coding agent, and on cloud harnesses — write them once.

## 🏁 What's Next?
Continue to [Module 5: Capstone — Team Enablement Playbook](05-capstone.md).

### 🌟 Take-home challenge
Take a genuinely messy ticket from your backlog, rewrite it with your `agent_task` template, delegate it to the coding agent, and measure how many review round-trips it takes to merge. Refine the template from what you learn.
