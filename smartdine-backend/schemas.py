# schemas.py
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr 
    password: str

class TokenResponse(BaseModel):
    token: str
    user_id: int
    username: str
    message: str

class FeedbackCreate(BaseModel):
    user_id: int | None = None
    restaurant_id: str
    query_text: str
    feedback: str  # "up" or "down"
