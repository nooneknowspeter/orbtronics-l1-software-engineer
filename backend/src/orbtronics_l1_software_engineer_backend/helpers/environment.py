import os

from dotenv import load_dotenv


def loadEnvironmentFiles():
    mono_repo_env_file = ".env"

    if not os.path.exists(mono_repo_env_file):
        print("environment file does not exist")
        return

    try:
        if not load_dotenv(mono_repo_env_file):
            raise Exception
        else:
            load_dotenv(mono_repo_env_file)
            print("successfully loaded environment variables")
    except Exception as e:
        print("failed to load environment variables", e)


loadEnvironmentFiles()

FRONTEND_URL = os.getenv("FRONTEND_URL")
SERVER_PORT = os.getenv("SERVER_PORT")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRES_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRES_MINUTES")
COOKIE_NAME = os.getenv("COOKIE_NAME")
MONGO_INITDB_ROOT_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME")
MONGO_INITDB_ROOT_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
MONGO_DATABASE_NAME = os.getenv("MONGO_DATABASE_NAME")
MONGO_CONNECTION_URI = os.getenv("MONGO_CONNECTION_URI")
