from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import HTTPException, status
from jwt import PyJWTError
from orbtronics_l1_software_engineer_backend.helpers import environment
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hashPassword(password: str) -> str:
    return pwd_context.hash(password)


def verifyPassword(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def createAccessToken(subject: str, expires_delta: timedelta | None = None) -> str:
    creation_time = datetime.now(timezone.utc)

    if expires_delta is None:
        expires_delta = timedelta(
            minutes=float(
                str(environment.variables.get("ACCESS_TOKEN_EXPIRES_MINUTES"))
            )
        )
    to_encode = {
        "sub": subject,
        "iat": int(creation_time.timestamp()),
        "exp": int((creation_time + expires_delta).timestamp()),
    }

    return jwt.encode(
        to_encode,
        environment.variables.get("JWT_SECRET"),
        algorithm=str(environment.variables.get("JWT_ALGORITHM")),
    )


def decodeAccessToken(token: str) -> dict[str, str]:
    try:
        return jwt.decode(
            token,
            environment.variables.get("JWT_SECRET"),
            algorithms=[str(environment.variables.get("JWT_ALGORITHM"))],
        )
    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid token"
        )
