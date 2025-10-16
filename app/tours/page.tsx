'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

interface Tour {
  id: number;
  title: string;
  destination: string;
  duration: string;
  price: string | number;
  type: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
}

export default function Tours() {
  const { getText } = useLanguage();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Refs for scroll reveal
  const headerRef = useRef<HTMLElement>(null);
  const filtersRef = useRef<HTMLElement>(null);
  const toursRef = useRef<HTMLElement>(null);

  // Page transition effect
  useEffect(() => {
    document.body.classList.add('page-transition');
    window.scrollTo(0, 0);
    
    const timer = setTimeout(() => {
      document.body.classList.remove('page-transition');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Scroll reveal effect
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    [headerRef, filtersRef, toursRef].forEach(ref => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
              }
            });
          },
          {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
          }
        );

        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  // Load tours
  useEffect(() => {
    async function loadTours() {
      try {
        setIsLoading(true);
        console.log('Fetching tours from /api/tours...');
        const response = await fetch('/api/tours');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Tours data received:', data);
          setTours(data);
          setFilteredTours(data);
        } else {
          console.error('Failed to fetch tours:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error loading tours:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTours();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = tours;

    if (selectedDestination !== 'all') {
      filtered = filtered.filter(tour => 
        tour.destination.toLowerCase().includes(selectedDestination.toLowerCase())
      );
    }

    if (selectedDuration !== 'all') {
      filtered = filtered.filter(tour => {
        const duration = tour.duration.toLowerCase();
        switch (selectedDuration) {
          case 'half-day':
            return duration.includes('half');
          case 'full-day':
            return duration.includes('day') && !duration.includes('half');
          case 'multi-day':
            return duration.includes('days') || parseInt(duration) > 1;
          default:
            return true;
        }
      });
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(tour => 
        tour.type.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    setFilteredTours(filtered);
  }, [selectedDestination, selectedDuration, selectedType, tours]);

  // Get unique values for filters
  const destinations = ['all', ...new Set(tours.map(tour => tour.destination))];
  const types = ['all', ...new Set(tours.map(tour => tour.type))];

  const clearFilters = () => {
    setSelectedDestination('all');
    setSelectedDuration('all');
    setSelectedType('all');
    setFilteredTours(tours);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={headerRef}
        className="relative py-32 text-white text-center scroll-reveal"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Multiple%20tropical%20islands%20in%20Maldives%20from%20aerial%20view%2C%20turquoise%20lagoons%2C%20white%20sand%20beaches%2C%20coral%20reefs%2C%20paradise%20archipelago%2C%20professional%20travel%20photography%2C%20bright%20blue%20ocean&width=1920&height=600&seq=tours-header-1&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="animate-ocean-wave max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif hero-title">
            Maldives Experiences
          </h1>
          <p className="text-xl text-gray-200 hero-subtitle">
            Discover the beauty of tropical paradise through our curated tours
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section ref={filtersRef} className="py-12 bg-white scroll-reveal">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Destination Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Destination
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white outline-none ring-0 focus:outline-none focus:ring-0 focus:border-teal-500 transition-all duration-300 text-slate-800 placeholder-slate-600"
              >
                <option value="all">All Destinations</option>
                {destinations.slice(1).map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duration
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white outline-none ring-0 focus:outline-none focus:ring-0 focus:border-teal-500 transition-all duration-300 text-slate-800 placeholder-slate-600"
              >
                <option value="all">All Durations</option>
                <option value="half-day">Half Day</option>
                <option value="full-day">Full Day</option>
                <option value="multi-day">Multi Day</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white outline-none ring-0 focus:outline-none focus:ring-0 focus:border-teal-500 transition-all duration-300 text-slate-800 placeholder-slate-600"
              >
                <option value="all">All Types</option>
                {types.slice(1).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
              >
                <i className="ri-refresh-line mr-2"></i>
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Showing <span className="font-semibold text-teal-600">{filteredTours.length}</span> of{' '}
              <span className="font-semibold">{tours.length}</span> tours
            </p>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section ref={toursRef} className="py-16 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-20">
              <i className="ri-search-line text-6xl text-slate-300 mb-4"></i>
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">No tours found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your filters to see more results</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour, index) => (
                <div 
                  key={tour.id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-slate-800">{tour.duration}</span>
                    </div>
                    <div className="absolute top-4 left-4 bg-teal-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-white">{tour.type}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-slate-500 text-sm mb-2">
                      <i className="ri-map-pin-line mr-1"></i>
                      <span>{tour.destination}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                      {tour.title}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {tour.shortDescription}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-teal-600">
                        ${tour.price}
                      </span>
                      <div className="flex items-center text-yellow-500">
                        <i className="ri-star-fill text-sm"></i>
                        <i className="ri-star-fill text-sm"></i>
                        <i className="ri-star-fill text-sm"></i>
                        <i className="ri-star-fill text-sm"></i>
                        <i className="ri-star-half-fill text-sm"></i>
                        <span className="ml-1 text-sm text-slate-600">(4.8)</span>
                      </div>
                    </div>
                    <Link
                      href={`/tour/${tour.id}`}
                      className="block w-full bg-teal-600 hover:bg-teal-700 text-white text-center py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1"
                    >
                      View Details
                      <i className="ri-arrow-right-line ml-2"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}