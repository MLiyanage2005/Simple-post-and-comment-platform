from fastapi import APIRouter, HTTPException

from app.models.ppost import first_class, second_class, comment_in, comment_out
from app.database import database, post_table, comment_table

router = APIRouter()

@router.post("/comment", response_model=comment_out)
async def create_comment(comment: comment_in):
    # Check if post exists
    query = post_table.select().where(post_table.c.id == comment.post_id)
    post = await database.fetch_one(query)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Insert comment into database
    query = comment_table.insert().values(body=comment.body, post_id=comment.post_id)
    comment_id = await database.execute(query)
    
    return {**comment.dict(), "id": comment_id}

@router.post("/", response_model=second_class)
async def create_post(post: first_class):
    # Insert post into database
    query = post_table.insert().values(body=post.body)
    post_id = await database.execute(query)
    
    return {**post.dict(), "id": post_id}

@router.get("/post", response_model=list[second_class])
async def read_posts():
    # Fetch all posts from database
    query = post_table.select()
    posts = await database.fetch_all(query)
    return posts

@router.get("/comment/{post_id}/post", response_model=list[comment_out])
async def getCommentsByPostId(post_id: int):
    # Check if post exists
    query = post_table.select().where(post_table.c.id == post_id)
    post = await database.fetch_one(query)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Fetch comments for this post
    query = comment_table.select().where(comment_table.c.post_id == post_id)
    comments = await database.fetch_all(query)
    return comments

