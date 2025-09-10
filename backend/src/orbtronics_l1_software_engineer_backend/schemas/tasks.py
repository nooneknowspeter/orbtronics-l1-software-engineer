from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel


class TaskPriorityEnum(str, Enum):
    none = "none"
    low = "low"
    medium = "medium"
    high = "high"


class TaskStatusEnum(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"


class TaskDueEnum(Enum):
    none = "none"
    today = "today"
    week = "week"
    overdue = "overdue"


class TaskData(BaseModel):
    task_id: str
    user_id: str
    title: str
    description: str | None = None
    status: str
    priority: str | None = None
    due_date: str | None = None
    created_at: str
    updated_at: str


class TaskDataInput(BaseModel):
    title: str
    description: str | None = None
    status: str = TaskStatusEnum.todo
    priority: str | None = None
    due_date: date | str | None = None


class TaskDataPartial(BaseModel):
    title: str | None
    description: str | None
    status: str | None
    priority: str | None
    due_date: str | None
