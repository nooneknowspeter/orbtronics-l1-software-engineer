from datetime import date, datetime, timedelta, timezone

import pymongo
from bson import ObjectId
from fastapi import (APIRouter, Depends, HTTPException, Path, Query, Response,
                     status)
from orbtronics_l1_software_engineer_backend.helpers.api import \
    taskDocumentToResponse
from orbtronics_l1_software_engineer_backend.models.tasks import \
    tasks_collection
from orbtronics_l1_software_engineer_backend.routes.users import whoAmI
from orbtronics_l1_software_engineer_backend.schemas.tasks import (
    TaskData, TaskDataInput, TaskDataPartial, TaskDueEnum, TaskPriorityEnum,
    TaskStatusEnum)

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.post(
    "",
    response_model=TaskData,
    status_code=status.HTTP_201_CREATED,
    tags=["tasks"],
)
def createTask(payload: TaskDataInput, current_user=Depends(whoAmI)):
    datetime_now = datetime.now(timezone.utc)

    task = {
        "user_id": ObjectId(current_user["user_id"]),
        "title": payload.title,
        "description": payload.description,
        "priority": payload.priority,
        "status": TaskStatusEnum.todo.value,
        "due_date": payload.due_date,
        "created_at": datetime_now.isoformat(),
        "updated_at": datetime_now.isoformat(),
    }

    database_entry = tasks_collection.insert_one(task)
    task["_id"] = database_entry.inserted_id

    return taskDocumentToResponse(task)


@router.get("", response_model=list[TaskData], tags=["tasks"])
def readTasks(
    status: TaskStatusEnum | str | None = Query(None, enum=TaskStatusEnum),
    priority: TaskPriorityEnum | str | None = Query(None, enum=TaskPriorityEnum),
    due: str | None = Query(None, enum=["overdue", "week", "today"]),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user=Depends(whoAmI),
):
    query: dict[str, str | ObjectId | dict[str, str]] = {
        "user_id": ObjectId(current_user["user_id"])
    }

    if status:
        query["status"] = status

    if priority:
        query["priority"] = priority

    print(due)

    match due:
        case TaskDueEnum.overdue.value:
            query["due_date"] = {"$eq": date.today().isoformat()}
        case TaskDueEnum.week.value:
            query["due_date"] = {
                "$gte": date.today().isoformat(),
                "$lte": (date.today() + timedelta(weeks=1)).isoformat(),
            }
        case TaskDueEnum.today.value:
            query["due_date"] = {"$eq": date.today().isoformat()}
        case _:
            pass

    tasks = (
        tasks_collection.find(query)
        .skip(offset)
        .limit(limit)
        .sort("due_date", pymongo.ASCENDING)
    )
    response = [taskDocumentToResponse(task) for task in tasks]

    return response


@router.patch(
    "/{task_id}",
    status_code=status.HTTP_200_OK,
    response_model=TaskData,
    tags=["tasks"],
)
def update_task(
    task_id: str = Path(...),
    payload: TaskDataPartial | None = None,
    current_user=Depends(whoAmI),
):

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="no fields to update"
        )

    try:
        task_id: ObjectId = ObjectId(task_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="invalid task_id"
        )

    task = tasks_collection.find_one({"_id": task_id})
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="task not found"
        )

    if str(task["user_id"]) != current_user["user_id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="forbidden")

    task_update = {}
    for key, value in payload.dict(exclude_unset=True).items():
        task_update[key] = value

    if not task_update:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="no fields to update"
        )

    task_update["updated_at"] = datetime.now(timezone.utc).isoformat()

    for key, value in task_update.items():
        tasks_collection.update_one({"_id": task_id}, {"$set": {key: value}})

    response = tasks_collection.find_one({"_id": task_id})

    return taskDocumentToResponse(response)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["tasks"])
def delete_task(task_id: str = Path(...), current_user=Depends(whoAmI)):
    try:
        task_id: ObjectId = ObjectId(task_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="invalid task_id"
        )

    task = tasks_collection.find_one({"_id": task_id})
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="task not found"
        )

    if str(task["user_id"]) != current_user["user_id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="forbidden")

    tasks_collection.delete_one({"_id": task_id})

    return Response(status_code=status.HTTP_204_NO_CONTENT)
