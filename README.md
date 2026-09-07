# Airbnb Full-Stack Clone Web Application (India Edition)

A pixel-perfect full-stack clone of the **Airbnb** web application built with **Next.js 16 (TypeScript)** on the frontend and **Python (FastAPI)** with **SQLAlchemy & SQLite/PostgreSQL** on the backend. 

This project replicates Airbnb's exact design system (matching `airbnb.co.in`), including Indian destinations (Delhi NCR, Noida, Gurugram, Goa, Mumbai, Manali, Jaipur, Udaipur, Rishikesh, Munnar, Bengaluru, Agra), pricing in **Indian Rupees (₹)**, photo-forward carousels, date overlap protection engine, interactive map price markers, end-to-end booking flow, and host property management.

---

## Technical Architecture Overview

```
Airbnb/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entry point, CORS, exception handlers
│   │   ├── database.py            # SQLite/PostgreSQL connection engine & SessionLocal
│   │   ├── models.py              # SQLAlchemy ORM schemas (User, Listing, Booking, Review, Wishlist, Amenity, Photo)
│   │   ├── schemas.py             # Pydantic request/response validation schemas
│   │   ├── crud.py                # Database query logic & date-range collision filtering
│   │   └── seed.py                # Seed script (12 Indian properties, Rupee pricing, reviews, bookings)
│   ├── requirements.txt           # Python dependencies (FastAPI, Uvicorn, SQLAlchemy, Pydantic)
│   └── run.py                     # Backend server starter (Port 8000)
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # Root layout with Context Providers & Header
│   │   │   ├── page.tsx           # Home explore page (Categories, Regional Carousels, Grid, Map toggle)
│   │   │   ├── rooms/[id]/page.tsx# Property detail page (5-photo grid, Reserve widget, Host, Reviews)
│   │   │   ├── trips/page.tsx     # "My Trips" guest stays & cancellation modal
│   │   │   ├── wishlists/page.tsx # Saved wishlists view
│   │   │   ├── host/page.tsx      # Host Dashboard (Metrics, Property CRUD & incoming reservations)
│   │   │   ├── host/create/page.tsx# Property creation form
│   │   │   └── host/edit/[id]/page.tsx# Property edit form
│   │   ├── components/            # Airbnb UI components
│   │   │   ├── header/            # Navigation header matching airbnb.co.in (Logo, Tabs, Search Pill, Host Mode)
│   │   │   ├── search/            # Interactive search overlay (Where, Dates, Guest Steppers)
│   │   │   ├── categories/        # Scrollable icon category bar
│   │   │   ├── filters/           # Price range & amenities filter modal
│   │   │   ├── listings/          # ListingCard (carousel hover, heart save, ₹ price), ListingGrid
│   │   │   ├── detail/            # PhotoGallery lightbox, ReserveCard, HostCard, ReviewsSection
      │   │   ├── map/               # Leaflet OpenStreetMap with custom Rupee price tag pins
│   │   │   ├── checkout/          # Mock payment modal with test card & celebration confetti
│   │   │   └── trips/             # Trip cards & cancellation dialogs
│   │   ├── context/               # UserContext, WishlistContext, ToastContext
│   │   ├── services/              # API wrapper client targeting FastAPI
│   │   └── types/                 # TypeScript interfaces
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.ts
└── README.md
```

---

## Key Features & User Workflows

### 1. Explore & Search (`airbnb.co.in` UI Alignment)
- **Top Category Navigation Tabs**: "Homes", "Experiences", "Services".
- **Floating 3-Part Search Pill**:
  - **Where**: Search destinations (New Delhi, Noida, Gurugram, Goa, Mumbai, Manali, Jaipur, etc.).
  - **When**: Select check-in & check-out date ranges.
  - **Who**: Guest Stepper (+/- Adults, Children, Infants, Pets).
- **Curated Regional Carousels**: Grouped stays on homepage with section headers and circular `<` `>` scroll controls (Delhi NCR, Goa & Coastal Villas, Himalayan Retreats).
- **Indian Rupee (₹) Formatting**: All prices rendered in `₹` using `en-IN` number formatting (`₹7,500 night`).
- **Interactive Leaflet Map**: Floating button toggles OpenStreetMap view with custom price tag markers (`₹7,500`).

### 2. Property Detail View (`/rooms/[id]`)
- **Photo Gallery**: 5-photo masonry grid + lightbox photo gallery viewer.
- **Sticky Reserve Card**: Date picker with live night & price calculation, date overlap warning, guest dropdown, and **Reserve** button.
- **Host Info & Reviews**: Superhost badge, bio, subcategory review ratings (Cleanliness, Accuracy, Check-in, Communication, Location, Value), and review modal.

### 3. Booking Engine & Protection Algorithm
- **Interval Overlap Check**: Validates check-in/out dates against existing bookings using interval math ($A_{\text{start}} < B_{\text{end}} \land A_{\text{end}} > B_{\text{start}}$).
- **Mock Checkout**: Itemized total (INR), mock payment methods (Credit/Debit/UPI/NetBanking), and celebration confetti animation.
- **My Trips (`/trips`)**: Manage active reservations, view stay details, cancel bookings with automatic date unblocking.

### 4. Host Experience (Full CRUD)
- **Host Mode Guard**: Controls access to `/host` and `/host/create` with a 1-click mode switch.
- **Host Dashboard (`/host`)**: Total Earnings, Active Bookings count, listing grid with View/Edit/Delete actions, and guest booking table.

---

## Setup & Local Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ and pip

### 1. Backend Setup (FastAPI & SQLite)
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Seed SQLite database (Creates airbnb.db with 12 Indian listings, reviews, and bookings)
python -m app.seed

# Start FastAPI backend server on port 8000
python run.py
```
*FastAPI documentation is available at `http://localhost:8000/docs`.*

### 2. Frontend Setup (Next.js TypeScript)
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server on port 3000
npm run dev
```
*Open `http://localhost:3000` in your browser.*

---

## How to Push to GitHub

Follow these commands in your terminal from the project root directory (`d:\Projects\Airbnb`):

```bash
# 1. Initialize Git repository (if not already initialized)
git init

# 2. Add all project files
git add .

# 3. Commit changes with a descriptive message
git commit -m "Feat: Complete Airbnb Full-Stack Clone (India Edition with Rupee pricing, Leaflet maps, and FastAPI backend)"

# 4. Set main branch
git branch -M main

# 5. Add your GitHub remote repository (replace with your actual GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/airbnb-clone.git

# 6. Push code to GitHub
git push -u origin main
```

---

## How to Deploy to Production

Deploying the application requires hosting the **FastAPI Backend** and **Next.js Frontend**.

### Step 1: Deploy Backend (FastAPI) on Render / Railway / Fly.io

#### Option A: Deploy on Render.com (Free Tier Available)
1. Push your repository to GitHub.
2. Log in to [Render.com](https://render.com/) and click **New +** -> **Web Service**.
3. Connect your GitHub repository and select the `backend` folder as the root directory.
4. Set the build settings:
   - **Environment**: Python 3
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt && python -m app.seed`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**. Once deployed, Render will provide your backend URL (e.g. `https://airbnb-backend.onrender.com`).

---

### Step 2: Deploy Frontend (Next.js) on Vercel

1. Log in to [Vercel.com](https://vercel.com/) and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. In the project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
4. Add an **Environment Variable** for the Backend API endpoint:
   - Key: `NEXT_PUBLIC_API_BASE_URL`
   - Value: `https://airbnb-backend.onrender.com/api` (your backend Render URL)
5. Click **Deploy**. Vercel will build and deploy your Next.js frontend to a live domain (e.g. `https://airbnb-clone.vercel.app`).

---

## API Endpoints Summary

- `GET /api/listings`: Search & filter listings by category, location, dates, price, amenities, host
- `GET /api/listings/{id}`: Detailed listing info with photos, amenities, host, and reviews
- `GET /api/listings/{id}/booked-dates`: Returns check-in/out date ranges of confirmed bookings
- `POST /api/listings`: Create a new property listing (Host)
- `PUT /api/listings/{id}`: Update property details (Host)
- `DELETE /api/listings/{id}`: Delete property listing (Host)
- `POST /api/bookings`: Create booking (validates date overlaps)
- `GET /api/bookings/user/{user_id}`: Fetch guest's trip bookings
- `GET /api/bookings/host/{host_id}`: Fetch host's incoming guest reservations
- `POST /api/bookings/{id}/cancel`: Cancel a booking and release dates
- `POST /api/reviews`: Add a review for a stay
- `GET /api/reviews/listing/{id}`: Get reviews for a listing
- `POST /api/wishlists/toggle`: Toggle item in wishlist
- `GET /api/wishlists/user/{user_id}`: Get user wishlist listings
