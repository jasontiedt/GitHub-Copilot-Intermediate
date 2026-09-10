from taskflow.store import TaskStore
from taskflow.service import list_tasks, create_task, stats


def test_list_all():
    store = TaskStore()
    assert len(list_tasks(store)) == 7


def test_list_by_status():
    store = TaskStore()
    todos = list_tasks(store, status="todo")
    assert todos and all(t.status == "todo" for t in todos)


def test_create_task_defaults_to_todo():
    store = TaskStore()
    t = create_task(store, "New thing", "dave")
    assert t.status == "todo"
    assert t.id == 8


def test_stats_totals():
    store = TaskStore()
    s = stats(store)
    assert s["todo"] + s["in_progress"] + s["done"] == 7
