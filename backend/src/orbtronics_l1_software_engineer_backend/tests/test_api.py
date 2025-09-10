from urllib import response

import requests
from faker import Faker
from fastapi import status
from orbtronics_l1_software_engineer_backend.helpers.crypt import \
    decodeAccessToken
from orbtronics_l1_software_engineer_backend.helpers.tests import Task
from orbtronics_l1_software_engineer_backend.schemas.tasks import (
    TaskDueEnum, TaskPriorityEnum)
from requests.utils import cookiejar_from_dict

faker = Faker()

API_ENDPOINT = "http://localhost:8000/api"

test_user = {
    "user_id": "",
    "username": faker.user_name(),
    "email": faker.email(safe=True, domain="orbtronics.co"),
    "password": faker.password(),
    "access_token": "",
}

test_tasks = {
    "no_due_date": Task(),
    "due_today": Task(due=TaskDueEnum.today),
    "due_this_week": Task(due=TaskDueEnum.week),
    "overdue": Task(due=TaskDueEnum.overdue),
}


def testServerHealthCheck():
    response = requests.get(API_ENDPOINT + "/ping")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": status.HTTP_200_OK}


# auth
def testUserSignUp():
    response = requests.post(
        API_ENDPOINT + "/auth/signup",
        json={
            "username": test_user["username"],
            "email": test_user["email"],
            "password": test_user["password"],
        },
    )

    assert response.status_code == status.HTTP_201_CREATED

    response_user_data = response.json()["user"]

    test_user["user_id"] = response_user_data["user_id"]

    print()
    for key in response_user_data:
        print(f"{key}: {response_user_data[key]}")


def testUserLogin():
    response = requests.post(
        API_ENDPOINT + "/auth/login",
        json={
            "username": test_user["username"],
            "password": test_user["password"],
        },
    )

    assert response.status_code == status.HTTP_200_OK

    test_user["access_token"] = response.cookies["access_token"]

    print()
    for key, value in response.cookies.items():
        print(f"{key}: {value}")


def testJWTTokenCryptography():
    decrypted_data = decodeAccessToken(test_user["access_token"])

    assert decrypted_data["sub"] == test_user["user_id"]

    print()
    for key, value in decrypted_data.items():
        print(f"{key}: {value}")


def testGetLoggedInUserData():
    response = requests.get(
        API_ENDPOINT + "/whoami",
        cookies=cookiejar_from_dict({"access_token": test_user["access_token"]}),
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["user_id"] == test_user["user_id"]
    assert response.json()["username"] == test_user["username"]
    assert response.json()["email"] == test_user["email"]


# tasks
def testCreateTasks():
    for task in test_tasks.values():
        response = requests.post(
            API_ENDPOINT + "/tasks",
            cookies=cookiejar_from_dict({"access_token": test_user["access_token"]}),
            json=task.taskToDict(),
        )

        assert response.status_code == status.HTTP_201_CREATED

        task.updateTaskId(task_id=response.json()["task_id"])


def testReadTasks():
    response = requests.get(
        API_ENDPOINT + "/tasks",
        cookies=cookiejar_from_dict({"access_token": test_user["access_token"]}),
    )

    assert response.status_code == status.HTTP_200_OK


def testReadOverdueTasks():
    response = requests.get(
        API_ENDPOINT + f"/tasks?due={TaskDueEnum.overdue.value}",
        cookies=cookiejar_from_dict({"access_token": test_user["access_token"]}),
    )

    assert response.status_code == status.HTTP_200_OK

    print()
    for task in response.json():
        print(task)


def testReadDueWeeklyTasks():
    response = requests.get(
        API_ENDPOINT + f"/tasks?due={TaskDueEnum.week.value}",
        cookies=cookiejar_from_dict({"access_token": test_user["access_token"]}),
    )

    assert response.status_code == status.HTTP_200_OK

    print()
    for task in response.json():
        print(task)


def testReadDueTodayTasks():
    response = requests.get(
        API_ENDPOINT + f"/tasks?due={TaskDueEnum.today.value}",
        cookies=cookiejar_from_dict({"access_token": test_user["access_token"]}),
    )

    assert response.status_code == status.HTTP_200_OK

    print()
    for task in response.json():
        print(task)


def testReadHighPriorityTasks():
    response = requests.get(
        API_ENDPOINT + f"/tasks?priority={TaskPriorityEnum.high.value}",
        cookies=cookiejar_from_dict({"access_token": test_user["access_token"]}),
    )

    assert response.status_code == status.HTTP_200_OK

    print()
    for task in response.json():
        print(task)


def testUpdateTasks():
    for task in test_tasks.values():
        task.randomizeTask()

        response = requests.patch(
            API_ENDPOINT + f"/tasks/{task.id}",
            cookies=cookiejar_from_dict({"access_token": test_user["access_token"]}),
            json=task.taskToDict(),
        )

        assert response.status_code == status.HTTP_200_OK


def testDeleteTasks():
    for task in test_tasks.values():
        response = requests.delete(
            API_ENDPOINT + f"/tasks/{task.id}",
            cookies=cookiejar_from_dict({"access_token": test_user["access_token"]}),
        )

        assert response.status_code == status.HTTP_204_NO_CONTENT
