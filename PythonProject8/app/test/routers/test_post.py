import pytest
from httpx import AsyncClient


async def create_post(body: str, async_client: AsyncClient):
    response = await async_client.post("/", json={"body": body})
    return response.json()


async def create_comment(async_client: AsyncClient, created_post: dict):
    body = "comment_on_post"
    response = await async_client.post(
        "/comment",
        json={"body": body, "post_id": created_post["id"]}
    )
    return response.json()


@pytest.fixture()
async def created_post(async_client: AsyncClient):
    return await create_post("test this", async_client)


@pytest.fixture()
async def created_comment(async_client: AsyncClient, created_post):
    return await create_comment(async_client, created_post)


@pytest.mark.anyio
async def test_get_post(async_client: AsyncClient, created_post: dict):
    response = await async_client.get("/post")
    assert response.status_code == 200
    assert response.json() == [created_post]


@pytest.mark.anyio
async def test_create_post(async_client: AsyncClient):
    body = "test this"
    response = await async_client.post("/", json={"body": body})
    assert response.status_code == 200
    data = response.json()
    assert data["body"] == body
    assert "id" in data
    assert isinstance(data["id"], int)


@pytest.mark.anyio
async def test_create_comment(async_client: AsyncClient, created_post: dict):
    body = "comment_on_post"
    response = await async_client.post(
        "/comment",
        json={"body": body, "post_id": created_post["id"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["body"] == body
    assert data["post_id"] == created_post["id"]
    assert "id" in data
    assert isinstance(data["id"], int)


@pytest.mark.anyio
async def test_get_comment(async_client: AsyncClient, created_post: dict, created_comment: dict):
    response = await async_client.get(f"/comment/{created_post['id']}/post")
    assert response.status_code == 200
    comments = response.json()
    assert len(comments) == 1
    assert comments[0]["id"] == created_comment["id"]
    assert comments[0]["body"] == created_comment["body"]
