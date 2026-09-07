'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Listing } from '@/types';
import Link from 'next/link';
import { Star, X } from 'lucide-react';

interface MapViewProps {
  listings: Listing[];
  onClose?: () => void;
}

export default function MapView({ listings, onClose }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      // Load Leaflet CSS dynamically if missing
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Cleanup existing instance if re-rendering
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Determine initial center and zoom level
      let defaultLat = 28.6139; // New Delhi default
      let defaultLng = 77.2090;
      let zoom = 5;

      if (listings.length === 1) {
        defaultLat = listings[0].lat;
        defaultLng = listings[0].lng;
        zoom = 12;
      } else if (listings.length > 1) {
        const avgLat = listings.reduce((sum, l) => sum + l.lat, 0) / listings.length;
        const avgLng = listings.reduce((sum, l) => sum + l.lng, 0) / listings.length;
        defaultLat = avgLat;
        defaultLng = avgLng;
        zoom = 6;
      }

      const container = mapContainerRef.current;
      if (!container) return;

      // Create Leaflet map instance
      const map = L.map(container, {
        center: [defaultLat, defaultLng],
        zoom: zoom,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add markers for all listings
      listings.forEach((listing) => {
        const priceLabel = `₹${Math.round(listing.price_per_night).toLocaleString('en-IN')}`;
        
        // Custom HTML Marker matching Airbnb design
        const customIcon = L.divIcon({
          className: 'custom-price-pin',
          html: `<div style="
            background-color: #ffffff;
            color: #222222;
            font-weight: 800;
            font-size: 12px;
            padding: 4px 10px;
            border-radius: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            border: 1px solid #DDDDDD;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s ease;
            text-align: center;
          " onmouseover="this.style.backgroundColor='#222222'; this.style.color='#ffffff'; this.style.transform='scale(1.1)';" onmouseout="this.style.backgroundColor='#ffffff'; this.style.color='#222222'; this.style.transform='scale(1)';"
          >${priceLabel}</div>`,
          iconSize: [60, 26],
          iconAnchor: [30, 13],
        });

        const marker = L.marker([listing.lat, listing.lng], { icon: customIcon }).addTo(map);

        marker.on('click', () => {
          setSelectedListing(listing);
          map.panTo([listing.lat, listing.lng]);
        });
      });

    }).catch((err) => console.error("Error loading Leaflet map:", err));

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listings]);

  return (
    <div className="relative w-full h-full min-h-[450px] bg-neutral-100 rounded-3xl overflow-hidden shadow-inner flex flex-col">
      
      {/* Overlay header if modal mode */}
      {onClose && (
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-neutral-900">{listings.length} Places in India</span>
        </div>
      )}

      {/* Leaflet Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[450px] flex-1 z-0" />

      {/* Preview Card Popup when pin clicked */}
      {selectedListing && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="relative aspect-video w-full bg-neutral-100">
            <img
              src={selectedListing.photos[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'}
              alt={selectedListing.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-sm text-neutral-900 truncate flex-1">{selectedListing.title}</h4>
              <div className="flex items-center gap-1 text-xs font-bold shrink-0 ml-2">
                <Star className="w-3.5 h-3.5 fill-neutral-900" />
                <span>{selectedListing.rating.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mb-3">{selectedListing.city}, {selectedListing.state || selectedListing.country}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-neutral-900">
                ₹{Math.round(selectedListing.price_per_night).toLocaleString('en-IN')} <span className="text-xs font-normal text-neutral-500">night</span>
              </span>
              <Link
                href={`/rooms/${selectedListing.id}`}
                className="bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-transform active:scale-95 shadow-md"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
