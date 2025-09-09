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
    userId: str
    username: str
    email: EmailStr
    createdAt: str
    updatedAt: str


class UserAuthResponse(BaseModel):
    user: UserData
    accessToken: str
