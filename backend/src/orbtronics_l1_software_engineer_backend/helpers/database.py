import pymongo
from orbtronics_l1_software_engineer_backend.helpers import environment

client = pymongo.MongoClient(environment.variables.get("MONGO_CONNECTION_URI"))

production_database = client[str(environment.variables.get("MONGO_DATABASE_NAME"))]
test_database = client["test"]
