from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/default")
def get_default_users(db: Session = Depends(get_db)):
    guest, host = crud.get_or_create_default_users(db)
    return {
        "guest": schemas.UserResponse.model_validate(guest),
        "host": schemas.UserResponse.model_validate(host)
    }

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
