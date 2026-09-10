from fastapi.testclient import TestClient

from taskflow.app import app


def test_get_task_returns_task():
    response = TestClient(app).get("/tasks/1")

    assert response.status_code == 200
    assert response.json()["id"] == 1
    assert response.json()["title"] == "Set up CI pipeline"


def test_get_task_returns_404_when_missing():
    response = TestClient(app).get("/tasks/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "task not found"}
