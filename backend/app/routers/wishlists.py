from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api/wishlists", tags=["wishlists"])

@router.post("/toggle")
def toggle_wishlist_item(payload: schemas.WishlistToggle, db: Session = Depends(get_db)):
    return crud.toggle_wishlist(db, payload.user_id, payload.listing_id)

@router.get("/user/{user_id}", response_model=List[schemas.WishlistResponse])
def get_user_wishlist(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_wishlists(db, user_id)
