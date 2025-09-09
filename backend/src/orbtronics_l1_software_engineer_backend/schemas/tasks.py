from pydantic import BaseModel


class TaskData(BaseModel):
    taskId: str
    userId: str
    title: str
    description: str | None = None
    priority: str | None = None
    status: str
    dueDate: str | None = None
    createdAt: str | None = None
    updatedAt: str | None = None


class TaskDataInput(BaseModel):
    title: str
    status: str
    description: str | None = None
    priority: str | None = None
    dueDate: str | None = None


class TaskDataPartial(BaseModel):
    title: str | None
    description: str | None
    priority: str | None
    status: str | None
    dueDate: str | None
