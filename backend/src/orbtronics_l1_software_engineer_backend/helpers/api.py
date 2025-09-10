from bson import ObjectId


def userDocumentToResponse(document: dict[str, str | ObjectId]) -> dict[str, str]:
    return {
        "user_id": str(document["_id"]),
        "username": str(document["username"]),
        "email": str(document["email"]),
        "created_at": str(document["created_at"]),
        "updated_at": str(document["updated_at"]),
    }


def taskDocumentToResponse(document: dict[str, str | ObjectId]) -> dict[str, str]:
    return {
        "task_id": str(document["_id"]),
        "user_id": str(document["user_id"]),
        "title": str(document["title"]),
        "description": str(document["description"]),
        "status": str(document["status"]),
        "priority": str(document["priority"]),
        "due_date": str(document["due_date"]),
        "created_at": str(document["created_at"]),
        "updated_at": str(document["updated_at"]),
    }
