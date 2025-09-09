from orbtronics_l1_software_engineer_backend.helpers import database

users_collection = database.production_database["users"]
users_collection.create_index("username", unique=True)
users_collection.create_index("email", unique=True)
