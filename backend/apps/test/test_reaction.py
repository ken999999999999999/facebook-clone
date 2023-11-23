from apps.test.client import facebook_clone_test_client


def test_get_reaction():
    response = facebook_clone_test_client.get(
        "/reactions?post_id=123", headers={"Authorization": "Bearer 123456"})
    assert response.status_code == 200
