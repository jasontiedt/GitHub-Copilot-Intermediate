---
applyTo: "**"
---
# What reviewers (human and Copilot) must flag
- Any `any` in TypeScript, or missing loading/error handling on async UI.
- `dangerouslySetInnerHTML` or any unescaped user/server content rendered to the DOM.
- API routes that don't validate input, don't raise specific HTTP errors, or mutate data without auth.
- Secrets in code, tokens passed in URLs/query strings, or a bare `except:` that hides errors.
- Ranking/sorting logic — confirm direction and tie-breaking are correct.
- Logic changes without a matching test; hard-coded URLs or magic numbers.