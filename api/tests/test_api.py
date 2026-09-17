from fastapi.testclient import TestClient

from taskflow.app import app

client = TestClient(app)


def test_get_task_returns_task():
    created = client.post("/tasks", json={"title": "Read the docs", "assignee": "dave"}).json()

    res = client.get(f"/tasks/{created['id']}")

    assert res.status_code == 200
    assert res.json() == created


def test_get_task_missing_returns_404():
    res = client.get("/tasks/9999")
    assert res.status_code == 404
    assert res.json()["detail"] == "task not found"
