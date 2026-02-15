from fastapi import APIRouter, HTTPException
from app.database import database, user_table

from PythonProject8.app.models.user import user_in
from PythonProject8.app.security import get_user_by_email, get_password_hash


router=APIRouter()

@router.post("/register",status_code=201)
async def register_user(user:user_in):
    if await get_user_by_email(user.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )\
    hashed_password=get_password_hash(user.password)        
    query=user_table.insert().values(email=user.email,password=user.password)   
    await database.execute(query)
    print("User registered successfully")
     
        
