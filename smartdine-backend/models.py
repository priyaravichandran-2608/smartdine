# models.py
from database import Base
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)  # hashed password
    

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    query_text = Column(Text)
    ai_response = Column(Text)
    restaurants_json = Column(JSON)  # JSON stored as text
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

class RecommendationFeedback(Base):
    __tablename__ = "recommendation_feedback"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    restaurant_id = Column(String(100), nullable=False)
    query_text = Column(Text, nullable=False)
    feedback = Column(String(10), nullable=False)  # "up" or "down"
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
