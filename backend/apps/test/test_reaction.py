from fastapi.testclient import TestClient

from apps.main import app


client = TestClient(app)

headers = {"X-Token": "coneofsilence"}


def test_read_item():
    response = client.get("/users", headers=headers)
    assert response.status_code == 200
    assert response.json() == {
        "id": "foo",
        "title": "Foo",
        "description": "There goes my hero",
    }
