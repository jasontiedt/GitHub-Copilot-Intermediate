from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from . import service
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


@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    t = service.get_task(store, task_id)
    if t is None:
        raise HTTPException(status_code=404, detail="task not found")
    return _dump(t)


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
