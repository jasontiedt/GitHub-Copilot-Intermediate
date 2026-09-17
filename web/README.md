# TaskFlow Web (React + TypeScript + Vite)

The frontend for the workshop's sample app. **It is intentionally imperfect** — that's the point.

## Run

```bash
npm install
npm run dev        # http://localhost:5173  (start the API on :8000 first)
npm run typecheck  # tsc --noEmit
```

## ⚠️ Known rough edges (deliberate)

You'll practice on these in the instructions, review, and agent modules — don't fix them yet:

- **`src/api.ts`** returns `any` and has no error handling.
- **`NewTaskForm`** hard-codes the assignee (`'me'`), has no loading/error state, and allows empty titles.
- **`TaskList`** has no empty state and swallows update errors.
- No tests (beyond `src/config.test.ts`), and inconsistent component/style conventions.

The API base URL now lives in `src/config.ts` and can be overridden with the
`VITE_API_BASE_URL` environment variable (e.g. in a `.env` file); it defaults
to `http://localhost:8000`.
