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
async def test_create_post(async_client:AsyncClient):
    body="test this"
    respnse=await async_client.post("/",json={"body": body})
    assert respnse.status_code==200
    assert respnse.json()=={"body": body,"id":0}


@pytest.mark.anyio
async def test_create_comment(async_client: AsyncClient, created_post: dict):
    body = "comment_on_post"
    response = await async_client.post(
        "/comment",
        json={"body": body, "post_id": created_post["id"]}
    )
    assert response.status_code == 200
    assert response.json() == {"id": 0, "body": body,"post_id":0}

@pytest.mark.anyio
async def test_get_comment(async_client:AsyncClient,created_post:dict):
    response=await async_client.get("/comment/{post_id}/post")
    assert response.status_code == 422
    assert response.json().items() == [created_post.items()]
