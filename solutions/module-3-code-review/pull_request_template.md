## What & why
<!-- What does this change do, and why? Link the related issue. -->

## How to test
<!-- Steps for a reviewer to verify. Include the commands you ran. -->
- [ ] `cd api && pytest`
- [ ] `cd web && npm run typecheck && npm run build`

## Review checklist
- [ ] Input validated at the boundary; routes raise specific `HTTPException`s.
- [ ] No secrets in code; no tokens in URLs/query strings.
- [ ] No `dangerouslySetInnerHTML` or unescaped user/server content.
- [ ] No `any` in TypeScript; API data typed via `src/types.ts`.
- [ ] Sorting/ranking direction and tie-breaks verified.
- [ ] No bare `except:`; no mutable default arguments.
- [ ] Logic changes covered by tests (happy path + edge case).
- [ ] No hard-coded URLs or magic numbers.
