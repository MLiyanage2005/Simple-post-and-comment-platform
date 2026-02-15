import os
import pytest
from httpx import AsyncClient, ASGITransport

os.environ["ENV_STATE"] = "test"

from app.main import app
from app.database import database, metadata, engine, post_table, comment_table


# 1️ Setup and teardown database for tests
@pytest.fixture(scope="session", autouse=True)
async def setup_db():
    # Create all tables
    metadata.create_all(engine)
    yield
    # Drop all tables after tests
    metadata.drop_all(engine)


# 2️ Clear database before every test
@pytest.fixture(autouse=True)
async def clean_db():
    # Clear posts and comments before each test
    await database.execute(post_table.delete())
    await database.execute(comment_table.delete())
    yield


# 3️ Async HTTP client with database connection
@pytest.fixture
async def async_client():
    await database.connect()
    
    transport = ASGITransport(app=app)
    async with AsyncClient(
        transport=transport,
        base_url="http://test"
    ) as client:
        yield client
    
    await database.disconnect()

