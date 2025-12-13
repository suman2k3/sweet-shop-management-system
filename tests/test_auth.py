def test_register_user(client):
    response = client.post(
        "/register",
        params={"username": "testuser", "password": "test123"}
    )
    assert response.status_code == 200


def test_login_user(client):
    response = client.post(
        "/login",
        params={"username": "testuser", "password": "test123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
