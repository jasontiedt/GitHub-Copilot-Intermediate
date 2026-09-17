from fastapi.testclient import TestClient

from taskflow.app import app

client = TestClient(app)


def test_get_task_returns_task():
    res = client.get("/tasks/1")
    assert res.status_code == 200
    body = res.json()
    assert body["id"] == 1
    assert body["title"] == "Set up CI pipeline"


def test_get_task_missing_returns_404():
    res = client.get("/tasks/9999")
    assert res.status_code == 404
    assert res.json()["detail"] == "task not found"
