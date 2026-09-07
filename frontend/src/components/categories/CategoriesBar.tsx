'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  Waves, 
  TreePine, 
  Building2, 
  Building, 
  Mountain, 
  Compass, 
  Sparkles, 
  Home, 
  Trees, 
  Sun,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { Category } from '@/types';
import { getCategories } from '@/services/api';
import FiltersModal from '../filters/FiltersModal';

interface CategoriesBarProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onApplyFilters: (filters: any) => void;
  activeFilterCount: number;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Waves: <Waves className="w-6 h-6" />,
  TreePine: <TreePine className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  Building: <Building className="w-6 h-6" />,
  Mountain: <Mountain className="w-6 h-6" />,
  Compass: <Compass className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Home: <Home className="w-6 h-6" />,
  Trees: <Trees className="w-6 h-6" />,
  Sun: <Sun className="w-6 h-6" />,
};

export default function CategoriesBar({
  selectedCategory,
  onSelectCategory,
  onApplyFilters,
  activeFilterCount,
}: CategoriesBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    async function loadCats() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories, using fallback options:", err);
        setCategories([
          { id: "beachfront", name: "Beachfront", icon: "Waves" },
          { id: "cabins", name: "Cabins", icon: "TreePine" },
          { id: "mansions", name: "Mansions", icon: "Building2" },
          { id: "iconic_cities", name: "Iconic Cities", icon: "Building" },
          { id: "countryside", name: "Countryside", icon: "Mountain" },
          { id: "lakefront", name: "Lakefront", icon: "Compass" },
          { id: "pools", name: "Amazing Pools", icon: "Sparkles" },
          { id: "tiny_homes", name: "Tiny Homes", icon: "Home" },
          { id: "treehouses", name: "Treehouses", icon: "Trees" },
          { id: "tropical", name: "Tropical", icon: "Sun" },
        ]);
      }
    }
    loadCats();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="sticky top-20 z-20 bg-white border-b border-neutral-200 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Scrollable Categories List Container */}
          <div className="relative flex-1 overflow-hidden group">
            
            {/* Left Scroll Button */}
            {showLeftArrow && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white border border-neutral-300 shadow-md hover:scale-110 transition-transform text-neutral-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Scroll Track */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex items-center gap-8 overflow-x-auto no-scrollbar scroll-smooth py-1 px-2"
            >
              {/* All Listings Option */}
              <button
                onClick={() => onSelectCategory('all')}
                className={`flex flex-col items-center gap-2 pb-2 border-b-2 transition-all shrink-0 ${
                  selectedCategory === 'all'
                    ? 'border-neutral-900 text-neutral-900 opacity-100 font-bold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 opacity-70'
                }`}
              >
                <LayoutGrid className="w-6 h-6" />
                <span className="text-xs tracking-tight whitespace-nowrap">All Homes</span>
              </button>

              {/* Dynamic DB Categories */}
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`flex flex-col items-center gap-2 pb-2 border-b-2 transition-all shrink-0 ${
                      isSelected
                        ? 'border-neutral-900 text-neutral-900 font-bold opacity-100'
                        : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div>{ICON_MAP[cat.icon] || <Home className="w-6 h-6" />}</div>
                    <span className="text-xs tracking-tight whitespace-nowrap">{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Button */}
            {showRightArrow && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white border border-neutral-300 shadow-md hover:scale-110 transition-transform text-neutral-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters Modal Trigger Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-800 hover:border-neutral-900 transition-all shrink-0 bg-white shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-neutral-700" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-extrabold">
                {activeFilterCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <FiltersModal
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={(filters) => {
            setIsFilterModalOpen(false);
            onApplyFilters(filters);
          }}
        />
      )}
    </>
  );
}
