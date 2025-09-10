from orbtronics_l1_software_engineer_backend.helpers import environment


def test_environmentVariables():
    print()
    for key in environment.variables:
        assert environment.variables.get(key) != ""

        print(f"{key}: {environment.variables[key]}")
