from datetime import datetime

from pydantic import BaseModel, EmailStr


class ErrorResponse(BaseModel):
    code: int
    message: str


class UserSignupInput(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLoginInput(BaseModel):
    username: str
    password: str


class UserData(BaseModel):
    user_id: str
    username: str
    email: EmailStr
    created_at: datetime | str
    updated_at: datetime | str


class UserAuthResponse(BaseModel):
    user: UserData
    access_token: str
