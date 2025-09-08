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
