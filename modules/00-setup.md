# Module 0: Setup & Orientation

Get to know TaskFlow — the code you'll practice Copilot on — and spot the rough edges you'll work with across the modules. **You don't need to run anything to do the workshop.**

**Estimated Time:** ~10 minutes

## What You'll Do
- [ ] Tour the codebase and its deliberate weaknesses
- [ ] Confirm Copilot is active
- [ ] Learn the branch-per-module convention
- [ ] (Optional) run the app to see it live

## 🧰 Prerequisites

- The latest stable **VS Code** with **GitHub Copilot** enabled
- **Git** and a **GitHub** account with Copilot (some organization features require an organization owner or administrator)
- To *run* the app (optional): **Node.js** 18+ and **Python** 3.10+

## 🗺️ Step 1: Meet the codebase (5 min)

You'll practice Copilot *on* this code, so get a feel for the layout first:
- **`web/`** — the React + TypeScript frontend (`src/App.tsx`, `src/api.ts`, `src/components/`).
- **`api/`** — the FastAPI backend (`taskflow/service.py` holds the logic).
- **`modules/`** — the workshop itself.

Open a couple of files, then practice with Copilot Chat:
```markdown
Give me a 5-line tour of this workspace: what each folder does and where the main logic lives. Search the codebase before answering.
```

<details><summary>Optional: run the app to see it live</summary>

```bash
# API (terminal 1)
cd api && python -m venv .venv && . .venv/Scripts/activate
pip install -r requirements.txt && uvicorn main:app --reload --port 8000   # http://localhost:8000/docs

# Web (terminal 2)
cd web && npm install && npm run dev                                       # http://localhost:5173
```

</details>

**✅ Checkpoint:** You can say where the frontend, backend, and workshop live.

## 🔎 Step 2: Spot the rough edges with Copilot (3 min)

This app is **deliberately imperfect** — that's the point. Practice using Copilot to find things to improve. Skim the "Known rough edges" in [api/README.md](../api/README.md) and [web/README.md](../web/README.md), then try:
In the Chat view, select **Add Context** → **Files & Folders**, attach `api/taskflow/service.py`, and ask:
```markdown
Point out any bugs or risky spots in this file.
```
See if Copilot flags the sort direction in `top_priority`, the missing validation, and the `any` types over in `web/src/api.ts`.

**✅ Checkpoint:** You can point to at least three concrete weaknesses.

## 🌿 Step 3: Conventions (2 min)

Each module is its own branch and Pull Request:
```bash
git checkout main && git pull
git checkout -b USERNAME/module-1-instructions
```

## ✅ Completion Checklist
- [ ] Toured the codebase and its rough edges
- [ ] Confirmed Copilot is active
- [ ] Know the branch-per-module flow

## 🔀 Try it another way
Same orientation, different Copilot surfaces — try both and notice what each is good at:
- **Inline vs. chat:** put your cursor in `api/taskflow/service.py` and press **Ctrl+I** (inline chat): *"Explain what this file does."* Inline chat is quick for one file; the Chat view is better when the agent needs to search the whole workspace.
- **Second opinion:** switch the chat **model picker** to a different model and re-ask the tour question. Seeing how the answers differ is handy later when you want a second read on a bigger change.

## 🏁 What's Next?
Continue to [Module 1: Team-Scale Custom Instructions](01-team-instructions.md).
