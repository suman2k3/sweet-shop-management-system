def test_get_sweets(client):
    response = client.get("/sweets")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
