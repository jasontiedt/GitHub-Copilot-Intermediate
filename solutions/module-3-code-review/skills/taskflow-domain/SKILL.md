---
name: taskflow-domain
description: Core TaskFlow domain facts — task statuses, priority semantics, the in-memory store, and the no-auth constraint. Use whenever a task touches task state, priority ordering, the data store, or API behavior in this repo.
---

# TaskFlow domain facts

- **Valid task statuses** are exactly `todo`, `in_progress`, and `done` (see `VALID_STATUS` in `api/taskflow/service.py`). Reject anything else.
- **Priority is higher-is-more-important.** A task with `priority: 5` outranks `priority: 1`. Any "top" or "focus" view must sort **descending** by priority and tie-break by `id`. (This is the planted `top_priority` bug.)
- **The data store is in-memory** (`api/taskflow/store.py`) — there is no database. State resets on restart; don't assume persistence or write migrations.
- **There is no authentication or authorization yet.** Don't invent auth flows unless a task explicitly asks for them, and flag any data-mutating route that assumes an authenticated user.
- **Where things live:** domain logic in `api/taskflow/service.py` (keep it pure and unit-testable); HTTP layer in `api/taskflow/app.py`; web API client in `web/src/api.ts` with types in `web/src/types.ts`.
