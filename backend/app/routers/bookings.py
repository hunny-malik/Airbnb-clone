from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

@router.post("", response_model=schemas.BookingResponse, status_code=201)
def create_booking(booking_in: schemas.BookingCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_booking(db, booking_in)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}", response_model=List[schemas.BookingResponse])
def get_user_trips(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_bookings(db, user_id)

@router.get("/host/{host_id}", response_model=List[schemas.BookingResponse])
def get_host_reservations(host_id: int, db: Session = Depends(get_db)):
    return crud.get_host_bookings(db, host_id)

@router.post("/{booking_id}/cancel", response_model=schemas.BookingResponse)
def cancel_trip(booking_id: int, user_id: int = Query(...), db: Session = Depends(get_db)):
    updated = crud.cancel_booking(db, booking_id, user_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Booking not found")
    return updated
