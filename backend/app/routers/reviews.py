from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

@router.post("", response_model=schemas.ReviewResponse, status_code=201)
def add_review(review_in: schemas.ReviewCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_review(db, review_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/listing/{listing_id}", response_model=List[schemas.ReviewResponse])
def get_reviews_for_listing(listing_id: int, db: Session = Depends(get_db)):
    return crud.get_listing_reviews(db, listing_id)
