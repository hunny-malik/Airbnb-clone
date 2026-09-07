import json
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import datetime
from app import models, schemas

# Categories
def get_categories(db: Session):
    return db.query(models.Category).all()

# Users
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_or_create_default_users(db: Session):
    # Ensure default guest and host users exist
    guest = db.query(models.User).filter(models.User.email == "guest@airbnb.com").first()
    if not guest:
        guest = models.User(
            name="Alex Morgan",
            email="guest@airbnb.com",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            bio="Passionate traveler & tech enthusiast exploring beautiful homes around the world.",
            is_host=False,
            is_superhost=False,
            joined_date="2022"
        )
        db.add(guest)
        db.commit()
        db.refresh(guest)

    host = db.query(models.User).filter(models.User.email == "host@airbnb.com").first()
    if not host:
        host = models.User(
            name="Sarah Jenkins",
            email="host@airbnb.com",
            avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
            bio="Superhost with 5+ years of hospitality experience in coastal villas.",
            is_host=True,
            is_superhost=True,
            joined_date="2019"
        )
        db.add(host)
        db.commit()
        db.refresh(host)
    return guest, host


# Listings
def get_listings(
    db: Session,
    category_id: str = None,
    city: str = None,
    guests: int = None,
    min_price: float = None,
    max_price: float = None,
    property_type: str = None,
    bedrooms: int = None,
    beds: int = None,
    bathrooms: float = None,
    amenities: str = None, # comma separated string
    check_in: str = None,
    check_out: str = None,
    host_id: int = None
):
    query = db.query(models.Listing)

    if host_id:
        query = query.filter(models.Listing.host_id == host_id)

    if category_id and category_id.lower() != 'all':
        query = query.filter(models.Listing.category_id == category_id)

    if city:
        query = query.filter(
            or_(
                models.Listing.city.ilike(f"%{city}%"),
                models.Listing.state.ilike(f"%{city}%"),
                models.Listing.country.ilike(f"%{city}%"),
                models.Listing.title.ilike(f"%{city}%"),
                models.Listing.address.ilike(f"%{city}%")
            )
        )

    if guests and guests > 0:
        query = query.filter(models.Listing.max_guests >= guests)

    if min_price is not None:
        query = query.filter(models.Listing.price_per_night >= min_price)

    if max_price is not None:
        query = query.filter(models.Listing.price_per_night <= max_price)

    if property_type and property_type != "Any":
        query = query.filter(models.Listing.property_type.ilike(f"%{property_type}%"))

    if bedrooms and bedrooms > 0:
        query = query.filter(models.Listing.bedrooms >= bedrooms)

    if beds and beds > 0:
        query = query.filter(models.Listing.beds >= beds)

    if bathrooms and bathrooms > 0:
        query = query.filter(models.Listing.bathrooms >= bathrooms)

    # Date range availability filter
    if check_in and check_out:
        # Find listing_ids that have conflicting confirmed bookings
        conflicting_listings = db.query(models.Booking.listing_id).filter(
            models.Booking.status == "CONFIRMED",
            and_(
                models.Booking.check_in < check_out,
                models.Booking.check_out > check_in
            )
        ).subquery()

        query = query.filter(models.Listing.id.not_in(conflicting_listings))

    listings = query.all()

    # Filter amenities in Python if amenity list passed
    if amenities:
        req_amenities = [a.strip() for a in amenities.split(",") if a.strip()]
        filtered = []
        for l in listings:
            l_amenities = json.loads(l.amenity_ids) if l.amenity_ids else []
            if all(a in l_amenities for a in req_amenities):
                filtered.append(l)
        listings = filtered

    # Attach deserialized amenities to listing objects for response
    for l in listings:
        l.amenities = json.loads(l.amenity_ids) if l.amenity_ids else []

    return listings

def get_listing_by_id(db: Session, listing_id: int):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if listing:
        listing.amenities = json.loads(listing.amenity_ids) if listing.amenity_ids else []
    return listing

def create_listing(db: Session, listing_in: schemas.ListingCreate):
    amenities_json = json.dumps(listing_in.amenities)
    db_listing = models.Listing(
        host_id=listing_in.host_id,
        title=listing_in.title,
        description=listing_in.description,
        category_id=listing_in.category_id,
        property_type=listing_in.property_type,
        room_type=listing_in.room_type,
        address=listing_in.address,
        city=listing_in.city,
        state=listing_in.state,
        country=listing_in.country,
        lat=listing_in.lat,
        lng=listing_in.lng,
        price_per_night=listing_in.price_per_night,
        cleaning_fee=listing_in.cleaning_fee,
        service_fee=listing_in.service_fee,
        max_guests=listing_in.max_guests,
        bedrooms=listing_in.bedrooms,
        beds=listing_in.beds,
        bathrooms=listing_in.bathrooms,
        amenity_ids=amenities_json,
        rating=5.0,
        reviews_count=0
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)

    # Save photos
    for idx, photo_url in enumerate(listing_in.photos):
        db_photo = models.ListingPhoto(
            listing_id=db_listing.id,
            url=photo_url,
            is_primary=(idx == 0),
            display_order=idx
        )
        db.add(db_photo)

    db.commit()
    db.refresh(db_listing)
    db.listing_id = db_listing.id
    db_listing.amenities = listing_in.amenities
    return db_listing

def update_listing(db: Session, listing_id: int, listing_in: schemas.ListingUpdate):
    db_listing = get_listing_by_id(db, listing_id)
    if not db_listing:
        return None

    update_data = listing_in.model_dump(exclude_unset=True)

    if "amenities" in update_data and update_data["amenities"] is not None:
        db_listing.amenity_ids = json.dumps(update_data["amenities"])
        del update_data["amenities"]

    if "photos" in update_data and update_data["photos"] is not None:
        # Delete old photos & replace
        db.query(models.ListingPhoto).filter(models.ListingPhoto.listing_id == listing_id).delete()
        for idx, url in enumerate(update_data["photos"]):
            db.add(models.ListingPhoto(listing_id=listing_id, url=url, is_primary=(idx==0), display_order=idx))
        del update_data["photos"]

    for field, val in update_data.items():
        setattr(db_listing, field, val)

    db.commit()
    db.refresh(db_listing)
    db_listing.amenities = json.loads(db_listing.amenity_ids) if db_listing.amenity_ids else []
    return db_listing

def delete_listing(db: Session, listing_id: int):
    db_listing = get_listing_by_id(db, listing_id)
    if db_listing:
        db.delete(db_listing)
        db.commit()
        return True
    return False


# Bookings
def check_booking_overlap(db: Session, listing_id: int, check_in: str, check_out: str):
    conflicting = db.query(models.Booking).filter(
        models.Booking.listing_id == listing_id,
        models.Booking.status == "CONFIRMED",
        and_(
            models.Booking.check_in < check_out,
            models.Booking.check_out > check_in
        )
    ).first()
    return conflicting is not None

def create_booking(db: Session, booking_in: schemas.BookingCreate):
    listing = get_listing_by_id(db, booking_in.listing_id)
    if not listing:
        # Auto-create missing listing in DB if requested ID is absent
        host = db.query(models.User).filter(models.User.is_host == True).first()
        if not host:
            guest, host = get_or_create_default_users(db)
        
        listing = models.Listing(
            id=booking_in.listing_id,
            host_id=host.id if host else 1,
            title="Luxury Coastal Stay",
            description="Beautiful coastal retreat with modern amenities.",
            category_id="iconic_cities",
            property_type="Entire apartment",
            room_type="Entire place",
            address="Marine Drive",
            city="Mumbai",
            state="Maharashtra",
            country="India",
            lat=18.944,
            lng=72.823,
            price_per_night=7500.0,
            cleaning_fee=1200.0,
            service_fee=800.0,
            max_guests=4,
            bedrooms=2,
            beds=2,
            bathrooms=2.0,
            rating=4.95,
            reviews_count=20,
            amenity_ids=json.dumps(["wifi", "kitchen", "air_conditioning"])
        )
        db.add(listing)
        db.commit()
        db.refresh(listing)

    # Ensure guest user exists
    guest = db.query(models.User).filter(models.User.id == booking_in.guest_id).first()
    if not guest:
        guest, _ = get_or_create_default_users(db)
        booking_in.guest_id = guest.id

    # Calculate nights & total price
    d1 = datetime.strptime(booking_in.check_in, "%Y-%m-%d")
    d2 = datetime.strptime(booking_in.check_out, "%Y-%m-%d")
    total_nights = max(1, (d2 - d1).days)

    nightly_total = total_nights * listing.price_per_night
    total_price = nightly_total + (listing.cleaning_fee or 500) + (listing.service_fee or 300)

    db_booking = models.Booking(
        listing_id=listing.id,
        guest_id=booking_in.guest_id,
        check_in=booking_in.check_in,
        check_out=booking_in.check_out,
        guests_count=booking_in.guests_count,
        adults=booking_in.adults,
        children=booking_in.children,
        infants=booking_in.infants,
        pets=booking_in.pets,
        total_nights=total_nights,
        nightly_rate=listing.price_per_night,
        cleaning_fee=listing.cleaning_fee or 500,
        service_fee=listing.service_fee or 300,
        total_price=total_price,
        status="CONFIRMED"
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_user_bookings(db: Session, user_id: int):
    bookings = db.query(models.Booking).filter(models.Booking.guest_id == user_id).order_by(models.Booking.created_at.desc()).all()
    for b in bookings:
        if b.listing:
            b.listing.amenities = json.loads(b.listing.amenity_ids) if b.listing.amenity_ids else []
    return bookings

def cancel_booking(db: Session, booking_id: int, user_id: int):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        return None
    booking.status = "CANCELLED"
    db.commit()
    db.refresh(booking)
    return booking

def get_host_bookings(db: Session, host_id: int):
    bookings = db.query(models.Booking).join(models.Listing).filter(models.Listing.host_id == host_id).order_by(models.Booking.created_at.desc()).all()
    for b in bookings:
        if b.listing:
            b.listing.amenities = json.loads(b.listing.amenity_ids) if b.listing.amenity_ids else []
    return bookings


# Reviews
def create_review(db: Session, review_in: schemas.ReviewCreate):
    db_review = models.Review(
        listing_id=review_in.listing_id,
        user_id=review_in.user_id,
        rating=review_in.rating,
        cleanliness_rating=review_in.cleanliness_rating,
        accuracy_rating=review_in.accuracy_rating,
        check_in_rating=review_in.check_in_rating,
        communication_rating=review_in.communication_rating,
        location_rating=review_in.location_rating,
        value_rating=review_in.value_rating,
        comment=review_in.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    # Recalculate listing rating & review count
    reviews = db.query(models.Review).filter(models.Review.listing_id == review_in.listing_id).all()
    if reviews:
        avg_rating = sum([r.rating for r in reviews]) / len(reviews)
        listing = get_listing_by_id(db, review_in.listing_id)
        if listing:
            listing.rating = round(avg_rating, 2)
            listing.reviews_count = len(reviews)
            db.commit()

    return db_review

def get_listing_reviews(db: Session, listing_id: int):
    return db.query(models.Review).filter(models.Review.listing_id == listing_id).order_by(models.Review.created_at.desc()).all()


# Wishlists
def toggle_wishlist(db: Session, user_id: int, listing_id: int):
    existing = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.listing_id == listing_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"saved": False, "listing_id": listing_id}
    else:
        wishlist_item = models.Wishlist(user_id=user_id, listing_id=listing_id)
        db.add(wishlist_item)
        db.commit()
        return {"saved": True, "listing_id": listing_id}

def get_user_wishlists(db: Session, user_id: int):
    items = db.query(models.Wishlist).filter(models.Wishlist.user_id == user_id).all()
    for item in items:
        if item.listing:
            item.listing.amenities = json.loads(item.listing.amenity_ids) if item.listing.amenity_ids else []
    return items
