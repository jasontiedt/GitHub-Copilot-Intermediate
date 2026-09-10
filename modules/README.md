# Workshop Modules

Six modules that take Copilot from individual use to a **team standard** for the TaskFlow project. Work in order — each builds artifacts the later modules reuse.

| # | Module | You'll build |
| - | ------ | ------------ |
| 0 | [Setup & Orientation](00-setup.md) | A running app + a map of its rough edges |
| 1 | [Team-Scale Custom Instructions](01-team-instructions.md) | Repo-wide + path-scoped instructions |
| 2 | [Designing a Reusable Prompt Library](02-prompt-library.md) | An onboarding prompt library |
| 3 | [Code Review Mastery](03-code-review.md) | Review standards + Reviewer agent + PR template |
| 4 | [Coding Agent at Scale](04-coding-agent.md) | Agent-ready issues, custom agents, MCP, agent env |
| 5 | [Capstone: Team Enablement Playbook](05-capstone.md) | A rollout plan that ties it together |

## 🔁 How each module works

- **Branch per module:** `git checkout -b USERNAME/module-N-...`
- **Stages ramp up:** early stages give you the exact steps; later **🧗 Challenge** stages give you a goal + success criteria and let *you* drive (with a collapsible hint).
- **🧠 Advanced sidebars** go deeper for those who want the org-scale picture.
- **Ship it:** end each module by pushing, opening a PR, and requesting a **Copilot review** (under **Reviewers**, next to **Copilot**, click **Request**).
- **Keep your artifacts:** everything under `.github/` is portable to your real repos.

> These modules use current Copilot conventions: `.instructions.md` with `applyTo`, `.prompt.md` with `agent:` frontmatter, custom agents as `.agent.md`, and the **Configure Chat** (⚙) → Agent Customizations editor.

Start with [Module 0: Setup & Orientation](00-setup.md).
