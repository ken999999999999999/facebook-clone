from apps.test.client import facebook_clone_test_client


def test_get_relationships():
    response = facebook_clone_test_client.get("/relationship")
