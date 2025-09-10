

def testServerHealthCheck():
    response = requests.get(API_ENDPOINT + "/ping")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": status.HTTP_200_OK}
