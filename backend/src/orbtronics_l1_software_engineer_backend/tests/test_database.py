import os

import pytest
from orbtronics_l1_software_engineer_backend.helpers.database import \
    test_database

collection = test_database["test_collection"]


def test_databaseConnection():
    assert test_database.name == "test"


def test_createDatabaseDocument():
    test_document = {"key": "test"}
    test_insert = collection.insert_one(test_document)
    assert (
        collection.find_one({"_id": test_insert.inserted_id})["key"]
        == test_document["key"]
    )
