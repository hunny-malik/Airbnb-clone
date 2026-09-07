import json
from datetime import datetime, timedelta
from app.database import SessionLocal, engine, Base
from app import models

def seed_db():
    # Recreate tables cleanly
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        print("Seeding Airbnb Indian database...")

        # 1. Seed Categories
        categories_data = [
            {"id": "beachfront", "name": "Beachfront", "icon": "Waves"},
            {"id": "cabins", "name": "Cabins", "icon": "TreePine"},
            {"id": "mansions", "name": "Mansions", "icon": "Building2"},
            {"id": "iconic_cities", "name": "Iconic Cities", "icon": "Building"},
            {"id": "countryside", "name": "Countryside", "icon": "Mountain"},
            {"id": "lakefront", "name": "Lakefront", "icon": "Compass"},
            {"id": "pools", "name": "Amazing Pools", "icon": "Sparkles"},
            {"id": "tiny_homes", "name": "Tiny Homes", "icon": "Home"},
            {"id": "treehouses", "name": "Treehouses", "icon": "Trees"},
            {"id": "tropical", "name": "Tropical", "icon": "Sun"},
        ]

        for c in categories_data:
            cat = models.Category(**c)
            db.add(cat)

        db.commit()

        # 2. Seed Indian Users (Hosts & Guests)
        host1 = models.User(
            id=1,
            name="Rajesh Sharma",
            email="rajesh.sharma@airbnb.com",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
            bio="Superhost running premier heritage stays and luxury penthouses across Delhi NCR & Goa.",
            is_host=True,
            is_superhost=True,
            joined_date="2018"
        )
        host2 = models.User(
            id=2,
            name="Priya Patel",
            email="priya.patel@airbnb.com",
            avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
            bio="Hospitality designer passionate about authentic mountain cabins in Himachal & Uttarakhand.",
            is_host=True,
            is_superhost=True,
            joined_date="2019"
        )
        host3 = models.User(
            id=3,
            name="Vikramaditya Singh",
            email="vikram.singh@airbnb.com",
            avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
            bio="Royal heritage estate host preserving Rajasthani architecture and royal experiences.",
            is_host=True,
            is_superhost=False,
            joined_date="2020"
        )

        guest_user = models.User(
            id=4,
            name="Aarav Verma",
            email="guest@airbnb.com",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            bio="Tech professional based in Gurugram exploring stays across India.",
            is_host=False,
            is_superhost=False,
            joined_date="2022"
        )

        db.add_all([host1, host2, host3, guest_user])
        db.commit()

        # 3. Seed 12 Detailed Indian Listings
        listings_data = [
            {
                "id": 1,
                "host_id": 1,
                "title": "Luxury Glass Penthouse with City Views",
                "description": "Located in the heart of South Delhi near Hauz Khas Village. Features floor-to-ceiling glass windows, private terrace garden, modern chef's kitchen, high-speed fiber WiFi, and 24/7 power backup.",
                "category_id": "iconic_cities",
                "property_type": "Entire penthouse",
                "room_type": "Entire place",
                "address": "Hauz Khas Enclave",
                "city": "New Delhi",
                "state": "Delhi NCR",
                "country": "India",
                "lat": 28.5494,
                "lng": 77.2001,
                "price_per_night": 7500.0,
                "cleaning_fee": 1200.0,
                "service_fee": 800.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.96,
                "reviews_count": 54,
                "amenities": ["wifi", "kitchen", "air_conditioning", "free_parking", "workspace", "tv", "elevator"],
                "photos": [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "id": 2,
                "host_id": 1,
                "title": "Modern Executive Suite near Expressway",
                "description": "Ultra-modern luxury studio apartment in Noida Sector 62. Steps away from IT parks and metro station. Equipped with high-speed WiFi, smart TV, modular kitchen, and gym access.",
                "category_id": "iconic_cities",
                "property_type": "Entire apartment",
                "room_type": "Entire place",
                "address": "Sector 62",
                "city": "Noida",
                "state": "Uttar Pradesh",
                "country": "India",
                "lat": 28.6280,
                "lng": 77.3649,
                "price_per_night": 3500.0,
                "cleaning_fee": 600.0,
                "service_fee": 400.0,
                "max_guests": 3,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1.0,
                "rating": 4.92,
                "reviews_count": 38,
                "amenities": ["wifi", "kitchen", "air_conditioning", "free_parking", "workspace", "gym", "tv"],
                "photos": [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "id": 3,
                "host_id": 1,
                "title": "Cyber City Skylight Loft on Golf Course Road",
                "description": "Premium duplex apartment situated in Gurugram's prime financial corridor. Features Italian marble flooring, plunge pool on private balcony, EV charger, and 24/7 security concierge.",
                "category_id": "mansions",
                "property_type": "Entire loft",
                "room_type": "Entire place",
                "address": "Golf Course Road, Sector 54",
                "city": "Gurugram",
                "state": "Haryana",
                "country": "India",
                "lat": 28.4393,
                "lng": 77.1006,
                "price_per_night": 8900.0,
                "cleaning_fee": 1500.0,
                "service_fee": 900.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.5,
                "rating": 4.98,
                "reviews_count": 67,
                "amenities": ["wifi", "pool", "kitchen", "air_conditioning", "free_parking", "workspace", "gym", "ev_charger"],
                "photos": [
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "id": 4,
                "host_id": 1,
                "title": "Portuguese Style Beach Villa with Private Pool",
                "description": "Nestled in North Goa near Vagator Beach, Villa Sunset features Portuguese architecture, private swimming pool, lush tropical garden, open-air pavilion, and dedicated chef service.",
                "category_id": "beachfront",
                "property_type": "Entire villa",
                "room_type": "Entire place",
                "address": "Ozran Beach Road, Vagator",
                "city": "Goa",
                "state": "Goa",
                "country": "India",
                "lat": 15.5991,
                "lng": 73.7445,
                "price_per_night": 18500.0,
                "cleaning_fee": 2500.0,
                "service_fee": 1800.0,
                "max_guests": 8,
                "bedrooms": 4,
                "beds": 4,
                "bathrooms": 4.0,
                "rating": 4.99,
                "reviews_count": 120,
                "amenities": ["wifi", "pool", "kitchen", "air_conditioning", "free_parking", "bbq_grill", "patio"],
                "photos": [
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "id": 5,
                "host_id": 2,
                "title": "Bandra Sea Face Luxury Apartment",
                "description": "Panoramas of the Arabian Sea from Bandra West, Mumbai's most vibrant coastal neighborhood. Steps away from Carter Road promenade, coffee shops, and nightlife.",
                "category_id": "beachfront",
                "property_type": "Entire apartment",
                "room_type": "Entire place",
                "address": "Carter Road, Bandra West",
                "city": "Mumbai",
                "state": "Maharashtra",
                "country": "India",
                "lat": 19.0596,
                "lng": 72.8295,
                "price_per_night": 14500.0,
                "cleaning_fee": 2000.0,
                "service_fee": 1500.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.95,
                "reviews_count": 84,
                "amenities": ["wifi", "kitchen", "air_conditioning", "free_parking", "workspace", "tv", "elevator"],
                "photos": [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "id": 6,
                "host_id": 2,
                "title": "Snow Peak Cedar Chalet with Fireplace",
                "description": "Wooden A-frame cabin surrounded by pine tree forests in Old Manali. Features a stone fireplace, heated cedar jacuzzi, balcony overlooking snow-capped Himalayan peaks, and apple orchard paths.",
                "category_id": "cabins",
                "property_type": "Entire cabin",
                "room_type": "Entire place",
                "address": "Log Huts Area, Old Manali",
                "city": "Manali",
                "state": "Himachal Pradesh",
                "country": "India",
                "lat": 32.2492,
                "lng": 77.1802,
                "price_per_night": 9800.0,
                "cleaning_fee": 1400.0,
                "service_fee": 1000.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.97,
                "reviews_count": 91,
                "amenities": ["wifi", "kitchen", "fireplace", "hot_tub", "heating", "workspace", "free_parking"],
                "photos": [
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "id": 7,
                "host_id": 3,
                "title": "Royal Haveli Suite in Pink City",
                "description": "Authentic 200-year-old Rajasthani heritage palace suite with jharokha balconies, hand-painted frescoes, courtyard garden, and traditional Rajasthani thali dining experience.",
                "category_id": "mansions",
                "property_type": "Heritage haveli",
                "room_type": "Entire place",
                "address": "Johari Bazar, Old City",
                "city": "Jaipur",
                "state": "Rajasthan",
                "country": "India",
                "lat": 26.9196,
                "lng": 75.8243,
                "price_per_night": 11200.0,
                "cleaning_fee": 1600.0,
                "service_fee": 1200.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.96,
                "reviews_count": 105,
                "amenities": ["wifi", "kitchen", "air_conditioning", "patio", "free_parking", "breakfast_included"],
                "photos": [
                    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "id": 8,
                "host_id": 3,
                "title": "Lake Pichola Waterfront Heritage Villa",
                "description": "Perched directly on the waters of Lake Pichola in Udaipur with views of Lake Palace and Jagmandir. Includes private boat transfers and rooftop sunset dining.",
                "category_id": "lakefront",
                "property_type": "Entire villa",
                "room_type": "Entire place",
                "address": "Hanuman Ghat",
                "city": "Udaipur",
                "state": "Rajasthan",
                "country": "India",
                "lat": 24.5800,
                "lng": 73.6800,
                "price_per_night": 16900.0,
                "cleaning_fee": 2200.0,
                "service_fee": 1700.0,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": 3.0,
                "rating": 4.98,
                "reviews_count": 78,
                "amenities": ["wifi", "pool", "kitchen", "air_conditioning", "patio", "breakfast_included"],
                "photos": [
                    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "id": 9,
                "host_id": 2,
                "title": "Ganges Riverfront Eco Sanctuary",
                "description": "Peaceful riverside eco-resort in Tapovan, Rishikesh with direct Ganges river access, yoga shala, organic cafe, and panoramic views of the Himalayan foothills.",
                "category_id": "countryside",
                "property_type": "Cottage",
                "room_type": "Entire place",
                "address": "Badrinath Road, Tapovan",
                "city": "Rishikesh",
                "state": "Uttarakhand",
                "country": "India",
                "lat": 30.1264,
                "lng": 78.3242,
                "price_per_night": 4800.0,
                "cleaning_fee": 800.0,
                "service_fee": 500.0,
                "max_guests": 3,
                "bedrooms": 1,
                "beds": 2,
                "bathrooms": 1.0,
                "rating": 4.94,
                "reviews_count": 64,
                "amenities": ["wifi", "kitchen", "workspace", "patio", "free_parking", "breakfast_included"],
                "photos": [
                    "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "id": 10,
                "host_id": 2,
                "title": "Munnar Tea Estate Heritage Bungalow",
                "description": "Colonial-era planter's bungalow nestled amidst misty green tea gardens of Munnar, Kerala. Features wood-paneled fireplaces, plantation walks, and fresh estate tea.",
                "category_id": "tropical",
                "property_type": "Entire bungalow",
                "room_type": "Entire place",
                "address": "Tea Estate Road",
                "city": "Munnar",
                "state": "Kerala",
                "country": "India",
                "lat": 10.0889,
                "lng": 77.0595,
                "price_per_night": 8500.0,
                "cleaning_fee": 1200.0,
                "service_fee": 900.0,
                "max_guests": 5,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": 2.5,
                "rating": 4.96,
                "reviews_count": 52,
                "amenities": ["wifi", "kitchen", "fireplace", "patio", "free_parking", "breakfast_included"],
                "photos": [
                    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "id": 11,
                "host_id": 1,
                "title": "Indiranagar Modernist Garden Duplex",
                "description": "Architect-designed penthouse duplex in Indiranagar, Bengaluru. Surrounded by top cafes and tech hubs. Features private garden balcony, high-speed fiber WiFi, and smart home automation.",
                "category_id": "iconic_cities",
                "property_type": "Entire apartment",
                "room_type": "Entire place",
                "address": "100 Feet Road, Indiranagar",
                "city": "Bengaluru",
                "state": "Karnataka",
                "country": "India",
                "lat": 12.9784,
                "lng": 77.6408,
                "price_per_night": 6900.0,
                "cleaning_fee": 1000.0,
                "service_fee": 700.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2.0,
                "rating": 4.93,
                "reviews_count": 71,
                "amenities": ["wifi", "kitchen", "air_conditioning", "workspace", "gym", "free_parking", "tv"],
                "photos": [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                "id": 12,
                "host_id": 3,
                "title": "Taj Mahal View Luxury Villa",
                "description": "Boutique villa located 1.5 km from the Taj Mahal in Agra. Offers direct rooftop Taj Mahal sunset view, marble courtyard, and private chef preparing Mughlai delicacies.",
                "category_id": "mansions",
                "property_type": "Entire villa",
                "room_type": "Entire place",
                "address": "Taj East Gate Road",
                "city": "Agra",
                "state": "Uttar Pradesh",
                "country": "India",
                "lat": 27.1739,
                "lng": 78.0421,
                "price_per_night": 12500.0,
                "cleaning_fee": 1800.0,
                "service_fee": 1300.0,
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": 3.0,
                "rating": 4.97,
                "reviews_count": 89,
                "amenities": ["wifi", "pool", "kitchen", "air_conditioning", "free_parking", "breakfast_included"],
                "photos": [
                    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
                ]
            }
        ]

        for item in listings_data:
            photos = item.pop("photos")
            amenities = item.pop("amenities")
            item["amenity_ids"] = json.dumps(amenities)

            listing = models.Listing(**item)
            db.add(listing)
            db.commit()

            for idx, p_url in enumerate(photos):
                db_photo = models.ListingPhoto(
                    listing_id=listing.id,
                    url=p_url,
                    is_primary=(idx == 0),
                    display_order=idx
                )
                db.add(db_photo)

        db.commit()

        # 4. Seed Reviews
        reviews_data = [
            {
                "listing_id": 1,
                "user_id": 4,
                "rating": 5.0,
                "cleanliness_rating": 5.0,
                "accuracy_rating": 5.0,
                "check_in_rating": 5.0,
                "communication_rating": 5.0,
                "location_rating": 5.0,
                "value_rating": 5.0,
                "comment": "Exceptional pentouse stay in South Delhi! Superhost Rajesh was so accommodating and the terrace view of Hauz Khas was lovely.",
                "created_at": datetime.utcnow() - timedelta(days=12)
            },
            {
                "listing_id": 2,
                "user_id": 4,
                "rating": 5.0,
                "cleanliness_rating": 5.0,
                "accuracy_rating": 5.0,
                "check_in_rating": 5.0,
                "communication_rating": 5.0,
                "location_rating": 5.0,
                "value_rating": 5.0,
                "comment": "Perfect location in Noida Sector 62. Super clean studio, fast internet for work, and seamless check-in.",
                "created_at": datetime.utcnow() - timedelta(days=20)
            },
            {
                "listing_id": 4,
                "user_id": 4,
                "rating": 5.0,
                "cleanliness_rating": 5.0,
                "accuracy_rating": 5.0,
                "check_in_rating": 5.0,
                "communication_rating": 5.0,
                "location_rating": 5.0,
                "value_rating": 4.8,
                "comment": "The private pool and Portuguese villa vibe in Vagator Goa made our vacation unforgettable!",
                "created_at": datetime.utcnow() - timedelta(days=35)
            }
        ]

        for r in reviews_data:
            db_review = models.Review(**r)
            db.add(db_review)

        db.commit()

        # 5. Seed Pre-existing Bookings for Guest (Aarav Verma)
        booking1 = models.Booking(
            id=1,
            listing_id=1,
            guest_id=4,
            check_in="2026-10-15",
            check_out="2026-10-20",
            guests_count=2,
            adults=2,
            children=0,
            infants=0,
            pets=0,
            total_nights=5,
            nightly_rate=7500.0,
            cleaning_fee=1200.0,
            service_fee=800.0,
            total_price=39500.0,
            status="CONFIRMED"
        )
        db.add(booking1)
        db.commit()

        print("Airbnb Indian Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
