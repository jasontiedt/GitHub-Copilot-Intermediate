import asyncio
import json

from taskflow import app as taskflow_app
from taskflow.store import TaskStore


def request(monkeypatch, method, path, payload):
    monkeypatch.setattr(taskflow_app, "store", TaskStore())
    messages = []
    body = json.dumps(payload).encode()
    received = False

    async def receive():
        nonlocal received
        if received:
            return {"type": "http.disconnect"}
        received = True
        return {"type": "http.request", "body": body, "more_body": False}

    async def send(message):
        messages.append(message)

    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": method,
        "scheme": "http",
        "path": path,
        "raw_path": path.encode(),
        "query_string": b"",
        "headers": [(b"content-type", b"application/json")],
        "client": ("testclient", 50000),
        "server": ("testserver", 80),
    }

    asyncio.run(taskflow_app.app(scope, receive, send))

    response_body = b"".join(
        message.get("body", b"") for message in messages if message["type"] == "http.response.body"
    )
    status = next(message["status"] for message in messages if message["type"] == "http.response.start")
    return status, json.loads(response_body)


def test_post_task_accepts_valid_priority(monkeypatch):
    status, body = request(
        monkeypatch,
        "POST",
        "/tasks",
        {"title": "New thing", "assignee": "dave", "priority": 4},
    )

    assert status == 200
    assert body["priority"] == 4
    assert body["status"] == "todo"


def test_post_task_rejects_invalid_priority(monkeypatch):
    status, _ = request(
        monkeypatch,
        "POST",
        "/tasks",
        {"title": "New thing", "assignee": "dave", "priority": 99},
    )

    assert status == 422


def test_patch_task_accepts_valid_status(monkeypatch):
    status, body = request(monkeypatch, "PATCH", "/tasks/1", {"status": "done"})

    assert status == 200
    assert body["status"] == "done"


def test_patch_task_rejects_invalid_status(monkeypatch):
    status, _ = request(monkeypatch, "PATCH", "/tasks/1", {"status": "blocked"})

    assert status == 422
