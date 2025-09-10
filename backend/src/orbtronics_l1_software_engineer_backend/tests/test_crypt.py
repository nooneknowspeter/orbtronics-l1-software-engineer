from orbtronics_l1_software_engineer_backend.helpers.crypt import (
    hashPassword, verifyPassword)

plain_password = "test"


def testPasswordHashing():
    hashed_password = hashPassword(password=plain_password)

    assert verifyPassword(plain=plain_password, hashed=hashed_password)

    print()
    print(f"plain_password: {plain_password}")
    print(f"hashed_password: {hashed_password}")
