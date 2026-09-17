"""Business logic for TaskFlow."""
from .models import Task

VALID_STATUS = {"todo", "in_progress", "done"}


def list_tasks(store, status=None, assignee=None):
    tasks = store.all()
    if status:
        tasks = [t for t in tasks if t.status == status.lower()]
    if assignee:
        tasks = [t for t in tasks if t.assignee == assignee]
    return tasks


def get_task(store, task_id):
    return store.get(task_id)


def create_task(store, title, assignee, priority=3, tags=None):
    # TODO: validate priority range (1..5) and reject empty titles
    task = Task(store.next_id(), title, "todo", assignee, priority, tags or [])
    store.add(task)
    return task


def update_status(store, task_id, status):
    t = store.get(task_id)
    if t is None:
        return None
    t.status = status  # no validation against VALID_STATUS
    return t


def stats(store) -> dict:
    counts = {"todo": 0, "in_progress": 0, "done": 0}
    for t in store.all():
        counts[t.status] += 1
    return counts


# Return the n highest-priority tasks (used by the "focus" view).
def top_priority(store, n):
    ordered = sorted(store.all(), key=lambda t: t.priority)
    return ordered[:n]
