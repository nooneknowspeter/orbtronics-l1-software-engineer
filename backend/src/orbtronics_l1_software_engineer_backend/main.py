from fastapi import FastAPI
from orbtronics_l1_software_engineer_backend.routes import (auth, health,
                                                            tasks, users)

app = FastAPI(
    title="Orbtronics L1 Software Engineer Backend",
    description="Technical Design Round Backend",
    version="0.1.0",
    openapi_tags=[
        {"name": "users", "description": "user accounts"},
        {"name": "tasks", "description": "user tasks"},
    ],
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(health.router)
