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


variable_names: list[str] = []

with open(".env.example") as file:
    lines = file.readlines()

    for line in lines:
        env_var = line.split("=")[0]
        variable_names.append(env_var)

variables: dict[str, str] = {
    variables_name: str(os.getenv(variables_name)) for variables_name in variable_names
}
