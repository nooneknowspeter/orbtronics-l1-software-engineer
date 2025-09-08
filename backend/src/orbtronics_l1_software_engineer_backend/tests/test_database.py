import os

import pymongo
import pytest
from orbtronics_l1_software_engineer_backend.helpers import environment

print(environment.MONGO_CONNECTION_URI)

client = pymongo.MongoClient(environment.MONGO_CONNECTION_URI)
database = client.test
collection = database.test_collection


def test_databaseConnection():
    assert database.name == "test"


def test_createDatabaseDocument():
    test_document = {"key": "test"}
    test_insert = collection.insert_one(test_document)
    assert (
        collection.find_one({"_id": test_insert.inserted_id})["key"]
        == test_document["key"]
    )
