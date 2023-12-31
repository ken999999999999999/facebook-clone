import pytest
from apps.test.client import facebook_clone_test_client


@pytest.fixture()
def get_user1_header():
    response = facebook_clone_test_client.post(
        "/mock-sign-up", json={
            "id": "1",
            "uid": "user1",
            "email": "user1@example.com",
            "display_name": "user1",
            "last_name": "user",
            "first_name": "1",
            "birthdate": "2000-01-01T00:00:00.000Z"
        })
    return {"Authorization": f"Bearer {response.json()}"}


@pytest.fixture()
def get_user2_header():
    response = facebook_clone_test_client.post(
        "/mock-sign-up", json={
            "id": "2",
            "uid": "user2",
            "email": "user2@example.com",
            "display_name": "user2",
            "last_name": "user2",
            "first_name": "2",
            "birthdate": "2000-01-01T00:00:00.000Z"
        })
    return {"Authorization": f"Bearer {response.json()}"}


def test_auth(get_user1_header):
    response = facebook_clone_test_client.get(
        "/users/", headers=get_user1_header)

    response2 = facebook_clone_test_client.get(
        "/users/")

    assert response.status_code == 200

    assert response2.status_code == 403
