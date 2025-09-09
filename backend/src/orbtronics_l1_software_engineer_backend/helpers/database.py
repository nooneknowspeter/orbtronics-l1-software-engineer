import pymongo
from orbtronics_l1_software_engineer_backend.helpers import environment

client = pymongo.MongoClient(environment.MONGO_CONNECTION_URI)
