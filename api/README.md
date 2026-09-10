# TaskFlow API (FastAPI)

The Python backend for the workshop's sample app. **It is intentionally imperfect** — that's the point.

## Run

```bash
python -m venv .venv && . .venv/Scripts/activate   # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000              # http://localhost:8000/docs
pytest                                             # optional: the thin test suite
```

## Endpoints

| Method | Path | Notes |
| ------ | ---- | ----- |
| GET | `/tasks?status=&assignee=` | list/filter tasks |
| POST | `/tasks` | create a task |
| PATCH | `/tasks/{id}` | update status |
| GET | `/stats` | counts by status |
| GET | `/focus?n=3` | the n highest-priority tasks |

## ⚠️ Known rough edges (deliberate)

You'll practice on these in the review and agent modules — don't fix them yet:

- **`top_priority`** sorts the *wrong direction* (`/focus` returns the **lowest** priority tasks).
- **`update_status`** accepts *any* string — no validation against `todo|in_progress|done`.
- **`create_task`** has a `TODO` and no priority-range validation.
- Inconsistent typing/docstrings across `service.py`.
- The test suite is **thin** — it passes but doesn't cover the bugs above.
