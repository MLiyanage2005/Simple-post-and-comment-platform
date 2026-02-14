from pydantic import BaseModel


class first_class(BaseModel):
    body:str


class second_class(first_class):
    id:int

class comment_in(BaseModel):
    body:str
    post_id:int


class comment_out(comment_in):
    id:int

class UserPostWithComments(BaseModel):
    post: second_class
    comments: list[comment_out]



