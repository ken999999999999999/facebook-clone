from apps.test.client import facebook_clone_test_client, auth_headers


def test_get_reaction():
    response = facebook_clone_test_client.get(
        "/users", headers=auth_headers)
    assert response.status_code == 200
