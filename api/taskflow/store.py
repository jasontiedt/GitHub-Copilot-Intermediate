from .models import Task


def seed():
    return [
        Task(1, "Set up CI pipeline", "todo", "alice", 5, ["infra"]),
        Task(2, "Fix login redirect", "in_progress", "bob", 4, ["bug", "auth"]),
        Task(3, "Write API docs", "todo", "carol", 2, ["docs"]),
        Task(4, "Add task filters", "done", "alice", 3, ["feature"]),
        Task(5, "Upgrade dependencies", "todo", "bob", 3, ["chore"]),
        Task(6, "Design board view", "in_progress", "carol", 4, ["feature", "ui"]),
        Task(7, "Add unit tests", "todo", "alice", 5, ["quality"]),
    ]


class TaskStore:
    def __init__(self, tasks=None):
        self._tasks = tasks if tasks is not None else seed()

    def all(self):
        return list(self._tasks)

    def add(self, task):
        self._tasks.append(task)

    def get(self, task_id):
        for t in self._tasks:
            if t.id == task_id:
                return t
        return None

    def next_id(self):
        return max((t.id for t in self._tasks), default=0) + 1
