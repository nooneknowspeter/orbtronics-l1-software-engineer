from orbtronics_l1_software_engineer_backend.helpers.database import \
    test_database

collection = test_database["test_collection"]


def test_databaseConnection():
    assert test_database.name == "test"

    print()
    print(f"database_name: {test_database.name}")


def test_createDatabaseDocument():
    expected_document = {"key": "test"}
    test_database_entry = collection.insert_one(expected_document)
    test_database_document = collection.find_one(
        {"_id": test_database_entry.inserted_id}
    )

    assert test_database_document["key"] == expected_document["key"]

    print()
    for key in test_database_document:
        print(f"{key}: {test_database_document[key]}")
