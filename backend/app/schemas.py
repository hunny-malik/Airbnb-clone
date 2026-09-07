from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    name: str
    email: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    is_host: bool = False
    is_superhost: bool = False

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    joined_date: str

    class Config:
        from_attributes = True


# Category Schemas
class CategoryResponse(BaseModel):
    id: str
    name: str
    icon: str

    class Config:
        from_attributes = True


# Photo Schemas
class PhotoBase(BaseModel):
    url: str
    is_primary: bool = False
    display_order: int = 0

class PhotoCreate(PhotoBase):
    pass

class PhotoResponse(PhotoBase):
    id: int

    class Config:
        from_attributes = True


# Review Schemas
class ReviewCreate(BaseModel):
    listing_id: int
    user_id: int
    rating: float = Field(..., ge=1, le=5)
    cleanliness_rating: float = 5.0
    accuracy_rating: float = 5.0
    check_in_rating: float = 5.0
    communication_rating: float = 5.0
    location_rating: float = 5.0
    value_rating: float = 5.0
    comment: str

class ReviewResponse(BaseModel):
    id: int
    listing_id: int
    user_id: int
    rating: float
    cleanliness_rating: float
    accuracy_rating: float
    check_in_rating: float
    communication_rating: float
    location_rating: float
    value_rating: float
    comment: str
    created_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True


# Listing Schemas
class ListingBase(BaseModel):
    title: str
    description: str
    category_id: str
    property_type: str
    room_type: str = "Entire place"
    address: str
    city: str
    state: Optional[str] = ""
    country: str
    lat: float
    lng: float
    price_per_night: float
    cleaning_fee: float = 50.0
    service_fee: float = 30.0
    max_guests: int = 2
    bedrooms: int = 1
    beds: int = 1
    bathrooms: float = 1.0
    amenities: List[str] = []

class ListingCreate(ListingBase):
    host_id: int
    photos: List[str] # List of image URLs

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    property_type: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    price_per_night: Optional[float] = None
    cleaning_fee: Optional[float] = None
    max_guests: Optional[int] = None
    bedrooms: Optional[int] = None
    beds: Optional[int] = None
    bathrooms: Optional[float] = None
    amenities: Optional[List[str]] = None
    photos: Optional[List[str]] = None

class ListingResponse(ListingBase):
    id: int
    host_id: int
    rating: float
    reviews_count: int
    created_at: datetime
    host: UserResponse
    photos: List[PhotoResponse]
    category: CategoryResponse

    class Config:
        from_attributes = True


# Booking Schemas
class BookingCreate(BaseModel):
    listing_id: int
    guest_id: int
    check_in: str # YYYY-MM-DD
    check_out: str # YYYY-MM-DD
    guests_count: int = 1
    adults: int = 1
    children: int = 0
    infants: int = 0
    pets: int = 0

class BookingResponse(BaseModel):
    id: int
    listing_id: int
    guest_id: int
    check_in: str
    check_out: str
    guests_count: int
    adults: int
    children: int
    infants: int
    pets: int
    total_nights: int
    nightly_rate: float
    cleaning_fee: float
    service_fee: float
    total_price: float
    status: str
    created_at: datetime
    listing: ListingResponse
    guest: UserResponse

    class Config:
        from_attributes = True


# Wishlist Schemas
class WishlistToggle(BaseModel):
    user_id: int
    listing_id: int

class WishlistResponse(BaseModel):
    id: int
    user_id: int
    listing_id: int
    listing: ListingResponse

    class Config:
        from_attributes = True
