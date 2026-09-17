from fastapi.testclient import TestClient

from taskflow.app import app
from taskflow.models import Task
from taskflow.store import TaskStore
from taskflow.service import list_tasks, create_task, stats, top_priority


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


def test_top_priority_is_descending():
    store = TaskStore()
    top = top_priority(store, 3)
    assert [t.priority for t in top] == [5, 5, 4]


def test_top_priority_breaks_ties_by_id():
    store = TaskStore([
        Task(2, "Second", "todo", "alice", 4, []),
        Task(1, "First", "todo", "bob", 4, []),
    ])
    assert [t.id for t in top_priority(store, 2)] == [1, 2]


def test_top_priority_n_larger_than_task_count():
    store = TaskStore()
    assert len(top_priority(store, 99)) == 7


def test_focus_endpoint_rejects_invalid_n():
    client = TestClient(app)
    assert client.get("/focus", params={"n": 0}).status_code == 422
    assert client.get("/focus", params={"n": -1}).status_code == 422
    assert client.get("/focus", params={"n": "abc"}).status_code == 422
