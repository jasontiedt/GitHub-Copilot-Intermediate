# GitHub Copilot for Teams — Intermediate & Advanced Workshop

A hands-on workshop that takes GitHub Copilot **beyond individual productivity** and into **team-scale practices**. You'll learn to standardize Copilot across a real project: effective project-wide **custom instructions**, a reusable **prompt library** for anyone who joins, **code-review mastery**, and **coding-agent** delegation — then roll it out to your whole team.

> **Level:** Intermediate → Advanced. This workshop assumes you already use Copilot day-to-day (chat, inline, agent mode) and want to make it consistent and effective for a whole team.

## 🧪 The sample project: **TaskFlow**

A deliberately **imperfect** polyglot monorepo — a realistic codebase to practice team standards, review, and delegation on:

- **`web/`** — a React + TypeScript (Vite) frontend
- **`api/`** — a FastAPI (Python) backend
- **On purpose:** inconsistent conventions, thin tests, a couple of **planted bugs**, `TODO`s, a weak `copilot-instructions.md`, and **no CI**.

Across the modules you'll **practice Copilot on real scenarios** — bringing TaskFlow up to a team standard and building reusable `.github/` assets your team can keep. The point is the Copilot practice, not getting the app to run.

## 📁 Repository layout

```text
copilot-advanced-workshop/
├── .github/
│   └── copilot-instructions.md      # intentionally thin — you'll fix it in Module 1
├── api/                             # FastAPI backend (Python)
│   ├── taskflow/ (models, store, service, app)
│   ├── main.py
│   └── tests/
├── web/                             # React + TypeScript frontend (Vite)
│   └── src/ (App, api client, components)
└── modules/                         # the workshop (0–5)
```

## 🚀 Run it (optional)

You **don't need the app running** to do the workshop — every module is about practicing Copilot on the code. Run it only if you'd like to see your changes live.

**API** (Python 3.10+):
```bash
cd api
python -m venv .venv && . .venv/Scripts/activate   # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000               # http://localhost:8000/docs
```

**Web** (Node 18+):
```bash
cd web
npm install
npm run dev                                         # http://localhost:5173
```
The web app talks to the API at `http://localhost:8000`.

## 📚 The workshop

Work through the modules in order. Each is intermediate→advanced and **timeboxed to ~20–30 min of core work** (guided stages), with optional 🧧 stretch stages for extra depth. Every module ends by opening a **Pull Request** and requesting a **Copilot review**, and leaves your team with a reusable artifact.

| # | Module | You'll build | Core |
| - | ------ | ------------ | ---- |
| 0 | [Setup & Orientation](modules/00-setup.md) | A tour of the code + its rough edges | ~10 min |
| 1 | [Team-Scale Custom Instructions](modules/01-team-instructions.md) | Repo-wide + path-scoped instructions your whole team benefits from | ~30 min |
| 2 | [Designing a Reusable Prompt Library](modules/02-prompt-library.md) | An onboarding prompt library anyone can run day one | ~25 min |
| 3 | [Code Review Mastery](modules/03-code-review.md) | Review standards + a Reviewer agent + PR template | ~25 min |
| 4 | [Coding Agent at Scale](modules/04-coding-agent.md) | Agent-ready issues, custom agents, MCP, agent env | ~25 min |
| 5 | [Capstone: Roll It Out to Your Team](modules/05-capstone.md) | A rollout plan that ties it all together | ~30 min |

See the [module index](modules/README.md) for details. Times are the **core** path; each module's optional 🧧 stretch stages add ~10–18 min if you want the deeper hands-on.

## 🔁 How the workshop works

1. **Branch per module** so each becomes a clean PR:
   ```bash
   git checkout main && git pull
   git checkout -b USERNAME/module-1-instructions
   ```
2. **Build team artifacts** under `.github/` (instructions, prompts, skills, agents) — these are the real deliverables.
3. **Ship it.** End each module by pushing your branch, opening a PR, and requesting a **Copilot review** (under **Reviewers**, next to **Copilot**, click **Request**).
4. **Keep your artifacts.** Everything under `.github/` is portable — drop it into your team's real repositories.

## 🧰 Prerequisites

- **VS Code** 1.99+ with **GitHub Copilot** + **GitHub Copilot Chat** (Business/Enterprise recommended for org-level features)
- **Node.js** 18+ and **Python** 3.10+
- **Git** and a **GitHub** account with Copilot access
- Familiarity with Copilot **chat, inline suggestions, and agent mode**

Start with [Module 0: Setup & Orientation](modules/00-setup.md).
