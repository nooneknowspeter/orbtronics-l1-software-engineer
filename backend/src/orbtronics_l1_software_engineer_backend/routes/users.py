from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, status
from orbtronics_l1_software_engineer_backend.helpers.api import \
    userDocumentToResponse
from orbtronics_l1_software_engineer_backend.helpers.crypt import \
    decodeAccessToken
from orbtronics_l1_software_engineer_backend.models.users import \
    users_collection

router = APIRouter(prefix="/api", tags=["users"])


@router.get("/whoami", status_code=status.HTTP_200_OK)
def whoAmI(request: Request) -> dict[str, str]:
    token: str = request.cookies["access_token"]
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="missing token"
        )

    user_id: str = decodeAccessToken(token)["sub"]
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid token payload"
        )

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="user not found"
        )

    return userDocumentToResponse(user)
