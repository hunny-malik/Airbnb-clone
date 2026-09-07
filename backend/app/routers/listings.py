from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api/listings", tags=["listings"])

@router.get("", response_model=List[schemas.ListingResponse])
def read_listings(
    category_id: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    guests: Optional[int] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    property_type: Optional[str] = Query(None),
    bedrooms: Optional[int] = Query(None),
    beds: Optional[int] = Query(None),
    bathrooms: Optional[float] = Query(None),
    amenities: Optional[str] = Query(None),
    check_in: Optional[str] = Query(None),
    check_out: Optional[str] = Query(None),
    host_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    return crud.get_listings(
        db,
        category_id=category_id,
        city=city,
        guests=guests,
        min_price=min_price,
        max_price=max_price,
        property_type=property_type,
        bedrooms=bedrooms,
        beds=beds,
        bathrooms=bathrooms,
        amenities=amenities,
        check_in=check_in,
        check_out=check_out,
        host_id=host_id
    )

@router.get("/{listing_id}", response_model=schemas.ListingResponse)
def read_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = crud.get_listing_by_id(db, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@router.get("/{listing_id}/booked-dates")
def get_booked_dates(listing_id: int, db: Session = Depends(get_db)):
    bookings = db.query(crud.models.Booking).filter(
        crud.models.Booking.listing_id == listing_id,
        crud.models.Booking.status == "CONFIRMED"
    ).all()
    return [{"check_in": b.check_in, "check_out": b.check_out} for b in bookings]

@router.post("", response_model=schemas.ListingResponse, status_code=201)
def create_listing(listing_in: schemas.ListingCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_listing(db, listing_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{listing_id}", response_model=schemas.ListingResponse)
def update_listing(listing_id: int, listing_in: schemas.ListingUpdate, db: Session = Depends(get_db)):
    updated = crud.update_listing(db, listing_id, listing_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Listing not found")
    return updated

@router.delete("/{listing_id}")
def delete_listing(listing_id: int, db: Session = Depends(get_db)):
    success = crud.delete_listing(db, listing_id)
    if not success:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"message": "Listing deleted successfully"}
