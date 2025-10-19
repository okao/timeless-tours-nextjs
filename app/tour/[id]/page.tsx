'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../../components/feature/Navbar';
import Footer from '../../../components/feature/Footer';
import ImageGallery from '../../../components/base/ImageGallery';
import Accordion from '../../../components/base/Accordion';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Tour {
  id: number;
  title: string | null;
  destination: string | null;
  duration: string | null;
  type: string | null;
  price: number | null;
  image: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
}

export default function TourDetail() {
  const params = useParams();
  const { getText } = useLanguage();
  const [tour, setTour] = useState<Tour | null>(null);
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Page transition effect
  useEffect(() => {
    document.body.classList.add('page-transition');
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      document.body.classList.remove('page-transition');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Fetch tour data
  useEffect(() => {
    async function fetchTour() {
      try {
        console.log('Fetching tour with ID:', params.id);
        const res = await fetch('/api/tours');
        if (!res.ok) throw new Error('Failed to load tours');
        const tours = await res.json();
        console.log('Fetched tours:', tours);
        
        const tourId = parseInt(params.id as string);
        console.log('Looking for tour ID:', tourId);
        const foundTour = tours.find((t: Tour) => t.id === tourId);
        console.log('Found tour:', foundTour);
        
        if (foundTour) {
          setTour(foundTour);
          // Get related tours from same destination
          const related = tours.filter((t: Tour) => t.id !== tourId && t.destination === foundTour.destination).slice(0, 3);
          setRelatedTours(related);
        } else {
          console.log('Tour not found, setting loading to false');
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchTour();
    } else {
      setIsLoading(false);
    }
  }, [params.id]);

  // Refs for sections (keeping for potential future use)
  const heroRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    console.log('No tour found, showing not found page');
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">{getText('tour.notFound.title', 'Tour Not Found')}</h1>
          <Link href="/tours" className="text-teal-600 hover:text-teal-700">
            {getText('tour.notFound.back', 'Back to Tours')}
          </Link>
        </div>
      </div>
    );
  }

  // Fallback images for hero section and related tours
  const heroFallbackImage = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=600&fit=crop&crop=center';
  const relatedTourFallbackImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=192&fit=crop&crop=center';

  // Use reliable fallback images instead of the failing readdy.ai API
  const galleryImages = [
    tour.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&crop=center'
  ];

  console.log('Tour loaded:', tour);
  console.log('Gallery images:', galleryImages);

  // Since itinerary data is not available in the current database schema,
  // we'll create a placeholder itinerary based on the tour duration
  const itineraryAccordion = tour.duration ? [
    {
      id: 1,
      title: `${getText('tour.itinerary.day', 'Day')} 1: ${getText('tour.itinerary.arrival', 'Arrival & Welcome')}`,
      content: getText('tour.itinerary.arrival.desc', 'Arrive at your destination and get settled into your accommodation. Meet your guide and fellow travelers for a welcome briefing.')
    },
    {
      id: 2,
      title: `${getText('tour.itinerary.day', 'Day')} 2: ${getText('tour.itinerary.exploration', 'Exploration & Adventure')}`,
      content: getText('tour.itinerary.exploration.desc', 'Full day of exploration and adventure activities. Experience the best of your destination with guided tours and activities.')
    },
    {
      id: 3,
      title: `${getText('tour.itinerary.day', 'Day')} 3: ${getText('tour.itinerary.departure', 'Departure')}`,
      content: getText('tour.itinerary.departure.desc', 'Final day with optional activities before departure. Transfer to airport or next destination.')
    }
  ] : [];

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(Array.from(formData.entries()).map(([key, value]) => [key, value.toString()])).toString(),
      });

      if (response.ok) {
        alert(getText('tour.booking.success', 'Thank you! We\'ll get back to you within 24 hours.'));
        form.reset();
      } else {
        alert(getText('tour.booking.error', 'Something went wrong. Please try again.'));
      }
    } catch {
      alert(getText('tour.booking.error', 'Something went wrong. Please try again.'));
    }
  };

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-96 flex items-end bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${tour.image || heroFallbackImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="w-full bg-gradient-to-t from-black/60 to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                {tour.title || getText('tour.title.fallback', 'Amazing Tour Experience')}
              </h1>
              <div className="flex flex-wrap gap-4 text-lg">
                {tour.destination && (
                  <span className="flex items-center">
                    <i className="ri-map-pin-line mr-2"></i>
                    {tour.destination}
                  </span>
                )}
                {tour.duration && (
                  <span className="flex items-center">
                    <i className="ri-time-line mr-2"></i>
                    {tour.duration}
                  </span>
                )}
                {tour.type && (
                  <span className="flex items-center">
                    <i className="ri-price-tag-3-line mr-2"></i>
                    {tour.type}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">{getText('tour.overview.title', 'Tour Overview')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {tour.fullDescription || tour.shortDescription || getText('tour.description.fallback', 'Experience an unforgettable journey with our expertly crafted tour. Discover amazing destinations and create lasting memories.')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">{getText('tour.inclusions.title', 'What\'s Included')}</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <i className="ri-check-line text-green-500 mr-3"></i>
                      {getText('tour.inclusions.transport', 'Transportation to and from activities')}
                    </li>
                    <li className="flex items-center text-gray-700">
                      <i className="ri-check-line text-green-500 mr-3"></i>
                      {getText('tour.inclusions.guide', 'Professional local guide')}
                    </li>
                    <li className="flex items-center text-gray-700">
                      <i className="ri-check-line text-green-500 mr-3"></i>
                      {getText('tour.inclusions.equipment', 'All necessary equipment')}
                    </li>
                    <li className="flex items-center text-gray-700">
                      <i className="ri-check-line text-green-500 mr-3"></i>
                      {getText('tour.inclusions.meals', 'Meals as specified')}
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">{getText('tour.exclusions.title', 'What\'s Not Included')}</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <i className="ri-close-line text-red-500 mr-3"></i>
                      {getText('tour.exclusions.flights', 'International flights')}
                    </li>
                    <li className="flex items-center text-gray-700">
                      <i className="ri-close-line text-red-500 mr-3"></i>
                      {getText('tour.exclusions.insurance', 'Travel insurance')}
                    </li>
                    <li className="flex items-center text-gray-700">
                      <i className="ri-close-line text-red-500 mr-3"></i>
                      {getText('tour.exclusions.personal', 'Personal expenses')}
                    </li>
                    <li className="flex items-center text-gray-700">
                      <i className="ri-close-line text-red-500 mr-3"></i>
                      {getText('tour.exclusions.tips', 'Tips and gratuities')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            {itineraryAccordion.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">{getText('tour.itinerary.title', 'Detailed Itinerary')}</h2>
                <Accordion items={itineraryAccordion} />
              </div>
            )}

            {/* Image Gallery */}
            <div ref={galleryRef} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">{getText('tour.gallery.title', 'Photo Gallery')}</h2>
              <ImageGallery images={galleryImages} title={tour.title || 'Tour Gallery'} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-teal-600">
                  {tour.price ? `$${tour.price.toLocaleString()}` : getText('tour.price.contact', 'Contact for Price')}
                </span>
                <p className="text-gray-600">{getText('tour.price.perPerson', 'per person')}</p>
              </div>
              
              <button
                onClick={scrollToBooking}
                className="w-full px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-300 mb-4 whitespace-nowrap cursor-pointer"
              >
                {getText('tour.booking.button', 'Book This Tour')}
              </button>
              
              <div className="space-y-3 text-sm text-gray-600">
                {tour.duration && (
                  <div className="flex justify-between">
                    <span>{getText('tour.details.duration', 'Duration')}:</span>
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{getText('tour.details.groupSize', 'Group Size')}:</span>
                  <span className="font-medium">{getText('tour.details.maxPeople', 'Max 12 people')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{getText('tour.details.difficulty', 'Difficulty')}:</span>
                  <span className="font-medium">{getText('tour.details.level', 'Easy to Moderate')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{getText('tour.details.age', 'Age Range')}:</span>
                  <span className="font-medium">{getText('tour.details.ageRange', 'All Ages')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div id="booking-section" className="mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">{getText('tour.booking.form.title', 'Book Your Adventure')}</h2>
              <p className="text-xl text-gray-600">{getText('tour.booking.form.subtitle', 'Fill out the form below and we\'ll get back to you within 24 hours')}</p>
            </div>

            <form onSubmit={handleBookingSubmit} data-readdy-form className="bg-stone-50 rounded-lg p-8">
              <input type="hidden" name="tour" value={tour.title || 'Tour'} />
              <input type="hidden" name="price" value={tour.price?.toString() || '0'} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('tour.booking.form.firstName', 'First Name')} *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('tour.booking.form.lastName', 'Last Name')} *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('tour.booking.form.email', 'Email')} *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('tour.booking.form.phone', 'Phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('tour.booking.form.travelDate', 'Preferred Travel Date')}</label>
                  <input
                    type="date"
                    name="travelDate"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('tour.booking.form.guests', 'Number of Guests')}</label>
                  <select
                    name="guests"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="1">1 {getText('tour.booking.form.guest', 'Guest')}</option>
                    <option value="2">2 {getText('tour.booking.form.guests', 'Guests')}</option>
                    <option value="3">3 {getText('tour.booking.form.guests', 'Guests')}</option>
                    <option value="4">4 {getText('tour.booking.form.guests', 'Guests')}</option>
                    <option value="5+">5+ {getText('tour.booking.form.guests', 'Guests')}</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{getText('tour.booking.form.message', 'Special Requests or Questions')}</label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder={getText('tour.booking.form.messagePlaceholder', 'Tell us about your travel preferences, dietary restrictions, or any special requests...')}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-300"
              >
                {getText('tour.booking.form.submit', 'Send Booking Request')}
              </button>
            </form>
          </div>
        </div>

        {/* Related Tours */}
        {relatedTours.length > 0 && (
          <div ref={relatedRef} className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                {getText('tour.related.title', 'You Might Also Like')}
              </h2>
              <p className="text-xl text-gray-600">
                {getText('tour.related.subtitle', 'Discover more amazing experiences')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-product-shop>
              {relatedTours.map((relatedTour) => (
                <div key={relatedTour.id} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <Image
                      src={relatedTour.image || relatedTourFallbackImage}
                      alt={relatedTour.title || 'Tour'}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-slate-800">
                      {relatedTour.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{relatedTour.title || 'Tour'}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{relatedTour.shortDescription || 'Amazing tour experience'}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-teal-600">
                        {relatedTour.price ? `$${relatedTour.price.toLocaleString()}` : getText('tour.price.contact', 'Contact for Price')}
                      </span>
                    </div>
                    <Link
                      href={`/tour/${relatedTour.id}`}
                      className="block w-full text-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-300 whitespace-nowrap cursor-pointer"
                    >
                      {getText('tour.related.viewDetails', 'View Details')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
