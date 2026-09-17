# Module 7: Talk to a Database with MCP (Oracle)

**Goal:** Give Copilot a **new capability** — querying a real Oracle database in natural language — by wiring up an **MCP server** you can read end-to-end. You'll bring up a disposable Oracle **HR sample schema**, connect a small **TypeScript** MCP server to it, and explore the data from **Agent mode** without writing SQL by hand. Along the way you'll see why the *database*, not the model, is what keeps the agent read-only.

**Estimated Time:** ~25 min core (Stages 1–4 + ship). **Optional stretch:** Stage 5 (+~10 min).
**Branch:**
```bash
git checkout main && git pull
git checkout -b USERNAME/module-7-mcp-oracle
```

## What You'll Learn
- [ ] Run a **local (stdio) MCP server** and trust it in VS Code
- [ ] Give Copilot a tool to **query Oracle in natural language**
- [ ] Understand a minimal MCP server written in **TypeScript** (no Java)
- [ ] Enforce **least privilege** so the agent can only read
- [ ] Keep DB credentials **out of source** with an input prompt
- [ ] **Ship it**: PR + Copilot review

## 🧰 Prerequisites — pick a lane

This lab ships a dev container that has **everything** — Node, the MCP server, and a seeded Oracle database. Choose the lane that fits you:

| Lane | Use when | What you need |
| ---- | -------- | ------------- |
| **A — Codespaces / Dev Container** (recommended) | You have Codespaces access, or Docker Desktop + the Dev Containers extension | Nothing else — it's all preinstalled |
| **B — Local Docker** (fallback) | No Codespaces access | Docker Desktop **and** Node.js 20+ on your machine |

> **Everyone drives their own copy.** Each learner gets their own database inside their own container, so nothing is shared and the "try to delete a row" demo in Stage 4 can't affect anyone else.

## 🎯 Stage 1: Bring up the environment (8 min)

### Lane A — Codespaces / Dev Container

1. **Codespaces:** on GitHub, **Code ▸ Codespaces ▸ Create codespace** on your branch. *(If offered a machine size, pick 4-core.)*
   **Local Dev Containers:** open the repo in VS Code and run **Dev Containers: Reopen in Container**.
2. Wait for the build. On first start the Oracle container seeds the HR schema and `postCreate` installs the MCP server's dependencies.
3. **✅ Checkpoint:** the terminal shows `MCP server dependencies installed. The Oracle HR database is seeded and ready.`

### Lane B — Local Docker

1. Start **only** the database (the `app` service is a dev-container construct you don't need locally):
   ```bash
   docker compose -f .devcontainer/docker-compose.yml up -d oracle
   ```
2. Wait until it's healthy (first boot seeds the schema):
   ```bash
   docker compose -f .devcontainer/docker-compose.yml ps
   ```
   Look for `(healthy)` next to the `oracle` service.
3. Install the MCP server's dependencies on your machine:
   ```bash
   cd mcp && npm install && cd ..
   ```
4. **✅ Checkpoint:** `oracle` is healthy and `mcp/node_modules` exists.

## 🎯 Stage 2: Start the MCP server (4 min)

The server config is already committed at [.vscode/mcp.json](../.vscode/mcp.json).

1. Open [.vscode/mcp.json](../.vscode/mcp.json). Above the `"taskflow-oracle"` server you'll see a **Start** code lens — click it.
2. When prompted, **Trust** the server (local MCP servers can run code — you're trusting your own lab).
3. You'll be asked for the **read-only password**. Enter the throwaway lab value from [db/seed/02_readonly_user.sql](../db/seed/02_readonly_user.sql):
   ```
   Workshop_ro_2026
   ```
4. Open **Chat**, switch to **Agent** mode, and open **Configure Tools** — confirm `run_query` (under `taskflow-oracle`) is listed.

**✅ Checkpoint:** the `taskflow-oracle` server is running with its `run_query` tool available.

<details><summary>💡 Why a password prompt instead of a value in the file?</summary>

VS Code's own guidance is to **never hardcode secrets in `mcp.json`** — use input variables. Even though this is a throwaway local database, the lab models the right pattern: the password is entered once per session and never committed. In the real world it would come from a secret manager.

</details>

## 🎯 Stage 3: Explore the HR schema in English (7 min)

In **Agent** mode, ask questions and let Copilot call `run_query`. Approve the tool calls when prompted. Try:

- *"What tables can you see? List them."*
- *"Show the five highest-paid employees with their department names, highest first."*
- *"Which employees have no manager? Who has no department?"*
- *"Average salary by department, highest first."*
- *"Who are the sales reps and what are their commission percentages?"*

**✅ Checkpoint:** you got answers grounded in real query results — King as the manager-less CEO, employee 178 with no department, and salaries straight from the `employees` table.

## 🎯 Stage 4: Prove it's read-only (4 min)

The tool is named `run_query`, but nothing stops the model from *trying* to write. So don't rely on the name — rely on the database.

1. Ask: *"Delete every row from the employees table."*
2. Watch the tool return an Oracle error (insufficient privileges) instead of changing anything.
3. Open [db/seed/02_readonly_user.sql](../db/seed/02_readonly_user.sql) and see why: `hr_ro` was granted only `CREATE SESSION` and `SELECT`. No `DELETE` privilege exists to abuse.

**✅ Checkpoint:** the write was refused **by the database**, and you can point to the exact grant that guarantees it.

> 🔗 This is the same lesson as [.github/instructions/code-review.instructions.md](../.github/instructions/code-review.instructions.md): enforce at the boundary and mutate data only with the right authorization. Here the boundary is a least-privilege DB user — a control string-matching in code could never match.

## 🧧 Stage 5 (Optional stretch): Read the server & add a tool (+10 min)

**Your goal:** understand the server, then extend it.

**Done when:**
- [ ] You've read [mcp/src/server.ts](../mcp/src/server.ts) and can explain how one Zod schema becomes the tool the model sees.
- [ ] You added a second **read-only** tool (e.g. `describe_table` that returns a table's columns from `all_tab_columns`), restarted the server, and called it from chat.

<details><summary>💡 Stuck? Reveal a hint</summary>

Copy the `registerTool` block. Give it a new name, an `inputSchema` of `z.object({ table: z.string() })`, and have the handler run a parameterized query against `all_tab_columns` filtered by `owner = 'HR'`. Keep logging on `console.error` — a single `console.log` corrupts the stdio protocol. Use the **Restart** code lens in `mcp.json` after editing.

</details>

## 🐞 Troubleshooting

| Symptom | Fix |
| ------- | --- |
| `run_query` isn't listed | Click **Start** on the server in [.vscode/mcp.json](../.vscode/mcp.json) and confirm the **Trust** prompt. Run **MCP: List Servers ▸ Show Output** to see logs. |
| `ORA-12541` / `ORA-12514` / connection refused | The database is still starting. Wait for `(healthy)` (Lane B) or for the dev container to finish, then **Restart** the server. |
| `ORA-01017: invalid username/password` | Re-enter the password `Workshop_ro_2026`. Run **MCP: Reset Trust** or restart the server to be re-prompted. |
| `ORACLE_PASSWORD is not set` | Start the server from `mcp.json` (not a raw terminal) so the input prompt is supplied. |
| Lane B: `localhost:1521` unreachable | Confirm the port is published: `docker compose -f .devcontainer/docker-compose.yml ps` should show `0.0.0.0:1521->1521/tcp`. |

## 🚀 Ship it (4 min)
1. **Commit** the lab: `.devcontainer/`, `db/seed/`, `mcp/`, and `.vscode/mcp.json`.
2. **Push:** `git push -u origin USERNAME/module-7-mcp-oracle`
3. **Open a PR** and request a **Copilot review**. *(Expect the review to scrutinize DB access and secrets — exactly the right instinct.)*

## ✅ Completion Checklist
- [ ] Brought up the environment (Codespaces/Dev Container or local Docker)
- [ ] Started and trusted the `taskflow-oracle` MCP server
- [ ] Queried the HR schema in natural language
- [ ] Proved the connection is read-only and found the grant that enforces it
- [ ] *(Optional stretch)* Read the server and added a second tool
- [ ] Opened a PR and got a Copilot review

## 🧠 Advanced sidebar

- **Why SQLcl isn't used here:** Oracle's built-in SQLcl MCP server is excellent but is a **Java** process. This lab stays in TypeScript with a ~50-line server and the pure-JavaScript `node-oracledb` **Thin** driver — no Java, no Oracle client libraries.
- **Least privilege > guardrails in code:** the read-only user is the real control. Treat any "the tool only reads" claim in code as defense-in-depth, never the guarantee.
- **Auditing the agent:** in a real deployment, log every statement the server runs (to stderr or a table) so you can review exactly what the model asked the database to do.
- **Interactive vs. delegated:** this server uses an `${input:...}` password, so it's meant for **interactive editor use**. VS Code does not forward input-prompt servers to the background Agent Host.

## 🏁 What's Next?
Head back to the [module index](README.md) to revisit any artifacts, or fold this MCP server into your team's real repos.

### 🌟 Take-home challenge
Point a copy of this server at a **read-only replica** of a database your team actually uses (with a least-privilege user), and write three natural-language questions your teammates ask constantly. That's a reusable internal tool built on what you did here.
