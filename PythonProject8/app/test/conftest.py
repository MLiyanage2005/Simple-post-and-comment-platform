import pytest
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.routers.routers_post import post_table, comment_table


# 1️ Auto-clean database before every test
@pytest.fixture(autouse=True)
def db():
    post_table.clear()
    comment_table.clear()
    yield


# 2️ Async HTTP client (NO TestClient, NO app=)
@pytest.fixture
async def async_client():
    transport = ASGITransport(app=app)

    async with AsyncClient(
        transport=transport,
        base_url="http://test"
    ) as client:
        yield client

