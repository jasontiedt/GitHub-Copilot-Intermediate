# TaskFlow Web (React + TypeScript + Vite)

The frontend for the workshop's sample app. **It is intentionally imperfect** — that's the point.

## Run

```bash
npm install
npm run dev        # http://localhost:5173  (start the API on :8000 first)
npm run typecheck  # tsc --noEmit
```

## ⚠️ Known rough edges (deliberate)

Raw material for the instructions, review, and agent modules — don't fix them yet:

- **`src/api.ts`** returns `any` and has no error handling; the base URL is hard-coded.
- **`NewTaskForm`** hard-codes the assignee (`'me'`), has no loading/error state, and allows empty titles.
- **`TaskList`** has no empty state and swallows update errors.
- No tests, no shared config for the API URL, and inconsistent component/style conventions.
