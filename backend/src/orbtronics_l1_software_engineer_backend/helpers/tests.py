import random
from datetime import date, timedelta

from faker import Faker
from orbtronics_l1_software_engineer_backend.schemas.tasks import (
    TaskDueEnum, TaskPriorityEnum, TaskStatusEnum)

faker = Faker()
MAX_TEXT_LENGTH = 10


class Task:
    id: str = ""
    title: str = ""
    description: str = ""
    status: str = ""
    priority: str = ""
    due_date: str = ""

    def __init__(self, due: TaskDueEnum | None = None):
        self.title = faker.text(max_nb_chars=MAX_TEXT_LENGTH)
        self.description = faker.text(max_nb_chars=MAX_TEXT_LENGTH)
        self.status = TaskStatusEnum.todo.value
        self.priority = random.choice(list(TaskPriorityEnum)).value

        match due:
            case TaskDueEnum.today:
                self.due_date = date.today().isoformat()
            case TaskDueEnum.week:
                self.due_date = (date.today() + timedelta(weeks=1)).isoformat()
            case TaskDueEnum.overdue:
                self.due_date = (
                    date.today() + timedelta(days=float(random.randint(-50, -5)))
                ).isoformat()
            case _:
                self.due_date = ""

    def updateTaskId(self, task_id: str):
        self.id = task_id

    def completeTask(self):
        self.status = TaskStatusEnum.done.value

    def randomizeTask(self):
        self.title = faker.text(max_nb_chars=MAX_TEXT_LENGTH)
        self.description = faker.text(max_nb_chars=MAX_TEXT_LENGTH)
        self.status = random.choice(list(TaskStatusEnum)).value
        self.priority = random.choice(list(TaskPriorityEnum)).value
        self.due_date = (
            date.today() + timedelta(days=float(random.randint(-50, 50)))
        ).isoformat()

    def taskToDict(self) -> dict[str, str]:
        return {
            "title": self.title,
            "description": self.description,
            "status": str(self.status),
            "priority": str(self.priority),
            "due_date": self.due_date,
        }

    def __str__(self) -> str:
        return f"""
            title: { self.title },
            description: { self.description },
            status: { str(self.status) },
            priority: { str(self.priority) },
            due_date: { self.due_date },
        """
