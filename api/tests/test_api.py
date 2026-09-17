from fastapi.testclient import TestClient

from taskflow.app import app

client = TestClient(app)


def test_create_task_accepts_valid_priority():
    r = client.post(
        "/tasks",
        json={"title": "Valid task", "assignee": "dave", "priority": 5},
    )
    assert r.status_code == 200
    assert r.json()["priority"] == 5


def test_create_task_rejects_priority_out_of_range():
    for priority in (0, 6):
        r = client.post(
            "/tasks",
            json={"title": "Bad task", "assignee": "dave", "priority": priority},
        )
        assert r.status_code == 422


def test_update_status_accepts_valid_status():
    created = client.post("/tasks", json={"title": "Patch me", "assignee": "dave"})
    task_id = created.json()["id"]
    r = client.patch(f"/tasks/{task_id}", json={"status": "done"})
    assert r.status_code == 200
    assert r.json()["status"] == "done"


def test_update_status_rejects_invalid_status():
    created = client.post("/tasks", json={"title": "Patch me too", "assignee": "dave"})
    task_id = created.json()["id"]
    r = client.patch(f"/tasks/{task_id}", json={"status": "nope"})
    assert r.status_code == 422
