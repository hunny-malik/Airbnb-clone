from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import listings, bookings, reviews, wishlists, users, categories
from app.seed import seed_db

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Airbnb Web App API",
    description="Backend API for Airbnb Clone marketplace replicating listings search, availability, bookings, reviews, and host CRUD.",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow localhost:3000 and any dev origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(listings.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(wishlists.router)
app.include_router(users.router)
app.include_router(categories.router)

@app.on_event("startup")
def startup_event():
    # Automatically seed DB on startup if empty
    from app.database import SessionLocal
    from app import models
    db = SessionLocal()
    try:
        count = db.query(models.Listing).count()
        if count == 0:
            print("No listings found. Automatically seeding database...")
            seed_db()
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Airbnb Clone FastAPI Service",
        "docs": "/docs"
    }
