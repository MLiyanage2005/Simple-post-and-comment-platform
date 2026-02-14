from email.policy import HTTP
from http.client import HTTPException

from fastapi import APIRouter
from fastapi.openapi.utils import status_code_ranges
from pydantic import BaseModel
from app.models.ppost import first_class,second_class,comment_in,comment_out

router=APIRouter()

post_table={}
comment_table={}

@router.post("/comment",response_model=comment_out)
async def create_comment(comment:comment_in):
    post=find_post(comment.post_id)
    if not post:
        raise HTTPException()
    data=comment.dict()
    last_rec_id=len(comment_table)
    new_comment={**data,"id":last_rec_id}
    comment_table[last_rec_id]=new_comment
    return new_comment

def find_post(post_id:int):
    return post_table.get(post_id)

@router.post("/",response_model=second_class)
async def create_post(post:first_class):
    data=post.dict()
    last_rec_id=len(post_table)
    new_post={**data,"id":last_rec_id}
    post_table[last_rec_id]=new_post
    return new_post

@router.get("/post",response_model=list[second_class])
async def read_psts():
    return list(post_table.values())

@router.get("/comment/{post_id}/post", response_model=list[comment_out])
async def getCommentsByPostId(post_id: int):
    return [ com
    for com in comment_table
        if com["post_id"]==post_id
            ]
print(post_table)

