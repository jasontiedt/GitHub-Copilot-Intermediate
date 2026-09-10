from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from . import service
from .search import bulk_complete, is_admin, search_tasks, SEARCH_LOG
from .store import TaskStore

app = FastAPI(title="TaskFlow API")

# Allow the Vite dev server to call us during the workshop.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

store = TaskStore()


class NewTask(BaseModel):
    title: str
    assignee: str
    priority: int = 3
    tags: list[str] = []


class StatusUpdate(BaseModel):
    status: str


class BulkComplete(BaseModel):
    ids: list


def _dump(t):
    return {
        "id": t.id,
        "title": t.title,
        "status": t.status,
        "assignee": t.assignee,
        "priority": t.priority,
        "tags": t.tags,
    }


@app.get("/tasks")
def get_tasks(status: str | None = None, assignee: str | None = None):
    return [_dump(t) for t in service.list_tasks(store, status, assignee)]


@app.post("/tasks")
def post_task(body: NewTask):
    t = service.create_task(store, body.title, body.assignee, body.priority, body.tags)
    return _dump(t)


@app.patch("/tasks/{task_id}")
def patch_task(task_id: int, body: StatusUpdate):
    t = service.update_status(store, task_id, body.status)
    if t is None:
        raise HTTPException(status_code=404, detail="task not found")
    return _dump(t)


@app.get("/stats")
def get_stats():
    return service.stats(store)


@app.get("/focus")
def get_focus(n: int = 3):
    return [_dump(t) for t in service.top_priority(store, n)]


@app.get("/tasks/search")
def get_search(q: str):
    results = search_tasks(store, q)
    return {"query": q, "count": len(results), "results": [_dump(t) for t in results]}


@app.post("/tasks/bulk-complete")
def post_bulk_complete(body: BulkComplete):
    count = bulk_complete(store, body.ids)
    return {"completed": count}


@app.get("/admin/logs")
def get_admin_logs(token: str = ""):
    if not is_admin(token):
        return {"error": "forbidden"}
    return {"log": SEARCH_LOG}
