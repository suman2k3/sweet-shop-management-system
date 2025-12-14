def test_get_sweets(client):
    # login
    login = client.post(
        "/login",
        params={"username": "testuser", "password": "test123"}
    )
    token = login.json()["access_token"]

    # access protected endpoint
    response = client.get(
        "/sweets",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
