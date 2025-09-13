from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from orbtronics_l1_software_engineer_backend.helpers import environment
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

origins = [environment.variables["FRONTEND_URL"]]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(health.router)
