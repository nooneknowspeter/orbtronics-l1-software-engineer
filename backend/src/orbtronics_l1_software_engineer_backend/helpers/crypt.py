from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hashPassword(password: str) -> str:
    return pwd_context.hash(password)


def verifyPassword(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
