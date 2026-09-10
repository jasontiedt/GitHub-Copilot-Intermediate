---
name: code-review
description: TaskFlow code review checklist. Use when reviewing a pull request, a diff, or a code selection to flag security, correctness, API-design, typing, and testing issues specific to this repo.
---

# TaskFlow review checklist

Apply these checks to every change — they mirror `.github/instructions/code-review.instructions.md`. Group findings as **Blocking / Suggestion / Nit** with file and line, and suggest a concrete fix.

## Security
- No secrets, tokens, or credentials in code or config.
- No tokens or sensitive data in URLs or query strings — they leak into logs and browser history.
- Data-mutating API routes must require auth; flag any that don't.
- No `dangerouslySetInnerHTML` or other unescaped user/server content rendered to the DOM (XSS).
- No bare `except:` — it hides errors; catch specific exceptions.

## Correctness
- Ranking/sorting logic: confirm direction and tie-breaking (e.g. `top_priority` must return highest-priority first, ties by `id`).
- No mutable default arguments (`def f(x=[])`); default to `None` and create inside.
- Guard missing/`None` lookups instead of assuming a value exists.

## API design & types
- Validate input at the boundary with Pydantic models; reject invalid `status`/`priority`.
- Raise specific `HTTPException`s; never return `None` from a route to signal failure.
- No `any` in TypeScript — type API data via `web/src/types.ts`. Use concrete types (`list[int]`, not bare `list`).

## Quality & tests
- Every logic change has a matching test (happy path + at least one edge case).
- No hard-coded URLs or magic numbers — read the API base URL from one place.
- Async UI handles loading and error states; lists render with stable React `key`s.
