from fastapi import FastAPI
from app.routers.routers_post import router as post_router
from app.database import database

app = FastAPI()

app.include_router(post_router)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
