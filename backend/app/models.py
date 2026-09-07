from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, Table, Date
from sqlalchemy.orm import relationship
from app.database import Base

# Association table for Listing <-> Amenity
listing_amenities = Table(
    'listing_amenities',
    Base.metadata,
    Column('listing_id', Integer, ForeignKey('listings.id', ondelete='CASCADE'), primary_key=True),
    Column('amenity_id', String, primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    is_host = Column(Boolean, default=False)
    is_superhost = Column(Boolean, default=False)
    joined_date = Column(String, default="2023")

    listings = relationship("Listing", back_populates="host", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="guest", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True) # e.g. 'beachfront', 'cabins', 'mansions'
    name = Column(String, nullable=False)
    icon = Column(String, nullable=False) # Lucide icon name

    listings = relationship("Listing", back_populates="category")


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    property_type = Column(String, nullable=False) # e.g., 'Entire villa', 'Cabin'
    room_type = Column(String, default="Entire place")
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=True)
    country = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    price_per_night = Column(Float, nullable=False)
    cleaning_fee = Column(Float, default=50.0)
    service_fee = Column(Float, default=30.0)
    max_guests = Column(Integer, default=2)
    bedrooms = Column(Integer, default=1)
    beds = Column(Integer, default=1)
    bathrooms = Column(Float, default=1.0)
    rating = Column(Float, default=5.0)
    reviews_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    host = relationship("User", back_populates="listings")
    category = relationship("Category", back_populates="listings")
    photos = relationship("ListingPhoto", back_populates="listing", cascade="all, delete-orphan", order_by="ListingPhoto.display_order")
    bookings = relationship("Booking", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="listing", cascade="all, delete-orphan")

    # Amenities list string ids stored in association table
    amenity_ids = Column(Text, default="[]") # JSON string fallback for quick serialization


class ListingPhoto(Base):
    __tablename__ = "listing_photos"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    url = Column(String, nullable=False)
    is_primary = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)

    listing = relationship("Listing", back_populates="photos")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    guest_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    check_in = Column(String, nullable=False) # YYYY-MM-DD
    check_out = Column(String, nullable=False) # YYYY-MM-DD
    guests_count = Column(Integer, default=1)
    adults = Column(Integer, default=1)
    children = Column(Integer, default=0)
    infants = Column(Integer, default=0)
    pets = Column(Integer, default=0)
    total_nights = Column(Integer, nullable=False)
    nightly_rate = Column(Float, nullable=False)
    cleaning_fee = Column(Float, default=0.0)
    service_fee = Column(Float, default=0.0)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="CONFIRMED") # CONFIRMED, CANCELLED, COMPLETED
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Float, nullable=False)
    cleanliness_rating = Column(Float, default=5.0)
    accuracy_rating = Column(Float, default=5.0)
    check_in_rating = Column(Float, default=5.0)
    communication_rating = Column(Float, default=5.0)
    location_rating = Column(Float, default=5.0)
    value_rating = Column(Float, default=5.0)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("Listing", back_populates="reviews")
    user = relationship("User", back_populates="reviews")


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="wishlists")
    listing = relationship("Listing", back_populates="wishlists")
