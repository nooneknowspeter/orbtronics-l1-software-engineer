router = APIRouter(prefix="/api", tags=["users"])


@router.post(
    "/auth/signup",
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

    account_creation_date = datetime.now(timezone.utc).isoformat()
    hashed_password = hashPassword(payload.password)
    user_document = {
        "username": payload.username,
        "email": payload.email,
        "hashed_password": hashed_password,
        "created_at": account_creation_date,
        "updated_at": account_creation_date,
    }

    database_entry = users_collection.insert_one(user_document)
    user_document["_id"] = database_entry.inserted_id

    token = createAccessToken(subject=str(database_entry.inserted_id))
    response = userDocumentToResponse(user_document)

    return {"user": response, "access_token": token}
