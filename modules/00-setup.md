# Module 0: Setup & Orientation

Get TaskFlow running and map the rough edges you'll fix with Copilot across the workshop.

**Estimated Time:** ~15 minutes

## What You'll Do
- [ ] Run the API and the web app
- [ ] Confirm Copilot is active and configured
- [ ] Tour the codebase and its deliberate weaknesses
- [ ] Learn the branch-per-module convention

## 🧰 Prerequisites

- **VS Code** 1.99+ with **GitHub Copilot** + **Copilot Chat**
- **Node.js** 18+, **Python** 3.10+, **Git**
- A **GitHub** account with Copilot (Business/Enterprise unlocks org-level features used in the advanced sidebars)

## 🚀 Step 1: Run the app (8 min)

**API** (terminal 1):
```bash
cd api
python -m venv .venv && . .venv/Scripts/activate   # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000              # open http://localhost:8000/docs
```

**Web** (terminal 2):
```bash
cd web
npm install
npm run dev                                        # open http://localhost:5173
```

You should see the TaskFlow board. Create a task, advance one, and hit the API's `/docs`.

**✅ Checkpoint:** Both servers run and the web app lists tasks from the API.

## 🗺️ Step 2: Tour the rough edges (5 min)

This app is **deliberately imperfect** — that's your raw material. Skim these and the "Known rough edges" in [api/README.md](../api/README.md) and [web/README.md](../web/README.md):

- **`api/taskflow/service.py`** — a sort bug in `top_priority`, no validation in `update_status`/`create_task`, inconsistent typing.
- **`web/src/api.ts`** — `any` return types, no error handling, hard-coded base URL.
- **`web/src/components/NewTaskForm.tsx`** — hard-coded assignee, no loading/error state.
- **`.github/copilot-instructions.md`** — thin and generic; Copilot can't follow conventions it doesn't know.
- **No CI, no PR template, no issue templates, no prompt library, no custom agents.**

**✅ Checkpoint:** You can point to at least three concrete weaknesses.

## 🌿 Step 3: Conventions (2 min)

Each module is its own branch and Pull Request:
```bash
git checkout main && git pull
git checkout -b USERNAME/module-1-instructions
```

## ✅ Completion Checklist
- [ ] API and web both run
- [ ] Toured the rough edges
- [ ] Know the branch-per-module flow

## 🏁 What's Next?
Continue to [Module 1: Team-Scale Custom Instructions](01-team-instructions.md).
