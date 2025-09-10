from fastapi import APIRouter, status

router = APIRouter(prefix="/api")


@router.get("/ping", status_code=status.HTTP_200_OK)
def ping():
    return {"status": status.HTTP_200_OK}
