from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Response, status
from orbtronics_l1_software_engineer_backend.helpers import environment
from orbtronics_l1_software_engineer_backend.helpers.api import \
    userDocumentToResponse
from orbtronics_l1_software_engineer_backend.helpers.crypt import (
    createAccessToken, hashPassword, verifyPassword)
from orbtronics_l1_software_engineer_backend.models.users import \
    users_collection
from orbtronics_l1_software_engineer_backend.schemas.auth import (
    UserAuthResponse, UserLoginInput, UserSignupInput)

router = APIRouter(prefix="/api/auth", tags=["users"])


@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED,
    response_model=UserAuthResponse,
    tags=["users"],
)
def signup(payload: UserSignupInput) -> dict[str, dict[str, str] | str]:
    if users_collection.find_one({"username": payload.username}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="username already exists"
        )

    if users_collection.find_one({"email": payload.email}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="email already exists"
        )

    account_creation_date = datetime.now(timezone.utc)
    hashed_password = hashPassword(payload.password)
    user = {
        "username": payload.username,
        "email": payload.email,
        "hashed_password": hashed_password,
        "created_at": account_creation_date.isoformat(),
        "updated_at": account_creation_date.isoformat(),
    }

    database_entry = users_collection.insert_one(user)
    user["_id"] = database_entry.inserted_id

    token = createAccessToken(subject=str(database_entry.inserted_id))
    response = userDocumentToResponse(user)

    return {"user": response, "access_token": token}


@router.post("/login", response_model=UserAuthResponse, tags=["users"])
def login(
    payload: UserLoginInput, http_response: Response
) -> dict[str, dict[str, str] | str]:
    user = users_collection.find_one({"username": payload.username})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid credentials"
        )

    if not verifyPassword(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid credentials"
        )

    token = createAccessToken(subject=str(user["_id"]))
    max_age = int(str(environment.variables.get("ACCESS_TOKEN_EXPIRES_MINUTES"))) * 60

    http_response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=max_age,
        secure=False,
        samesite="lax",
        path="/",
    )

    response = userDocumentToResponse(user)

    return {"user": response, "access_token": token}
