import pytest
from orbtronics_l1_software_engineer_backend.helpers import environment


def test_environmentVariables():
    assert environment.FRONTEND_URL != ""
    assert environment.SERVER_PORT != ""
    assert environment.JWT_SECRET != ""
    assert environment.JWT_ALGORITHM != ""
    assert environment.ACCESS_TOKEN_EXPIRES_MINUTES != ""
    assert environment.COOKIE_NAME != ""
    assert environment.MONGO_INITDB_ROOT_USERNAME != ""
    assert environment.MONGO_INITDB_ROOT_PASSWORD != ""
    assert environment.MONGO_DATABASE_NAME != ""
    assert environment.MONGO_CONNECTION_URI != ""
