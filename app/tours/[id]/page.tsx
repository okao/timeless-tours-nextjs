'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import ImageGallery from '@/components/base/ImageGallery';
import Accordion from '@/components/base/Accordion';

interface Tour {
  id: number;
  title: string;
  destination: string;
  duration: string;
  price: number;
  type: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
}

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export default function TourDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Mock data for features that would come from API
  const inclusions = [
    "Speedboat transfers from/to Malé",
    "Professional English-speaking guide",
    "High-quality snorkeling equipment",
    "Delicious local lunch with beverages",
    "Beach access and leisure time",
    "Underwater photography session",
    "All entrance fees and permits"
  ];

  const exclusions = [
    "Personal expenses and souvenirs",
    "Alcoholic beverages",
    "Additional water sports activities",
    "Travel insurance (recommended)",
    "Hotel pick-up/drop-off (available on request)"
  ];

  const itinerary: ItineraryItem[] = [
    {
      day: 1,
      title: "Morning Departure & Island Arrival",
      description: "Depart from Malé at 8:30 AM via speedboat. Enjoy the scenic 45-minute journey through crystal-clear waters. Upon arrival, receive a traditional Maldivian welcome with refreshing coconut water and a brief orientation about the island and day's activities."
    },
    {
      day: 1,
      title: "Snorkeling Adventure",
      description: "Explore vibrant coral reefs teeming with tropical fish, sea turtles, and colorful marine life. Our experienced guides will take you to the best snorkeling spots, ensuring a safe and unforgettable underwater experience. Equipment provided and maintained to the highest standards."
    },
    {
      day: 1,
      title: "Traditional Maldivian Lunch",
      description: "Savor an authentic Maldivian feast prepared by local families. Enjoy fresh seafood, fragrant curries, tropical fruits, and traditional dishes while learning about Maldivian culinary culture. Vegetarian and special dietary options available upon request."
    },
    {
      day: 1,
      title: "Island Exploration & Beach Time",
      description: "Take a guided walking tour of the island, visiting local shops, the mosque, and traditional homes. Then relax on pristine white sand beaches, swim in turquoise waters, or explore more of the island at your own pace."
    },
    {
      day: 1,
      title: "Sunset Return to Malé",
      description: "Depart around 5:00 PM for your return journey to Malé. Watch the stunning Maldivian sunset from the speedboat while reflecting on an incredible day of island life, marine exploration, and cultural immersion."
    }
  ];

  // Load tour data
  useEffect(() => {
    async function loadTourData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tours');
        if (response.ok) {
          const tours = await response.json();
          const currentTour = tours.find((t: Tour) => t.id === parseInt(id));
          
          if (currentTour) {
            setTour(currentTour);
            
            // Get related tours (same destination, different tour)
            const related = tours
              .filter((t: Tour) => t.destination === currentTour.destination && t.id !== currentTour.id)
              .slice(0, 3);
            setRelatedTours(related);
          }
        }
      } catch (error) {
        console.error('Error loading tour:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTourData();
  }, [id]);

  // Page transition effect
  useEffect(() => {
    document.body.classList.add('page-transition');
    window.scrollTo(0, 0);
    
    const timer = setTimeout(() => {
      document.body.classList.remove('page-transition');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const galleryImages = tour ? [
    tour.image,
    `https://readdy.ai/api/search-image?query=${encodeURIComponent(tour.destination)}%20beautiful%20landscape%20scenic%20view&width=800&height=600&seq=gallery${tour.id}1&orientation=landscape`,
    `https://readdy.ai/api/search-image?query=${encodeURIComponent(tour.destination)}%20cultural%20experience%20local%20traditions&width=800&height=600&seq=gallery${tour.id}2&orientation=landscape`,
    `https://readdy.ai/api/search-image?query=${encodeURIComponent(tour.destination)}%20luxury%20accommodation&width=800&height=600&seq=gallery${tour.id}3&orientation=landscape`,
    `https://readdy.ai/api/search-image?query=${encodeURIComponent(tour.destination)}%20adventure%20activities&width=800&height=600&seq=gallery${tour.id}4&orientation=landscape`,
    `https://readdy.ai/api/search-image?query=${encodeURIComponent(tour.destination)}%20local%20cuisine&width=800&height=600&seq=gallery${tour.id}5&orientation=landscape`
  ] : [];

  const itineraryAccordion = itinerary.map(item => ({
    id: item.day,
    title: `Day ${item.day}: ${item.title}`,
    content: item.description
  }));

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const response = await fetch('https://readdy.ai/api/form/d3ii27vuqofrij837p40', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(Object.fromEntries(
          Array.from(formData.entries()).map(([key, value]) => [key, value.toString()])
        )).toString(),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        form.reset();
        setTimeout(() => {
          setShowBookingForm(false);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToBooking = () => {
    setShowBookingForm(true);
    setTimeout(() => {
      const element = document.getElementById('booking-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <i className="ri-error-warning-line text-6xl text-slate-300 mb-4"></i>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Tour Not Found</h1>
          <p className="text-slate-600 mb-8">The tour you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link 
            href="/tours" 
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all duration-300"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Tours
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="relative h-96 flex items-end"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${tour.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="w-full bg-gradient-to-t from-black/60 to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-white">
              <div className="flex items-center space-x-4 mb-4">
                <Link 
                  href="/tours"
                  className="flex items-center text-white/80 hover:text-white transition-colors duration-300"
                >
                  <i className="ri-arrow-left-line mr-2"></i>
                  Back to Tours
                </Link>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif animate-fade-in">
                {tour.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <span className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <i className="ri-map-pin-line mr-2"></i>
                  {tour.destination}
                </span>
                <span className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <i className="ri-time-line mr-2"></i>
                  {tour.duration}
                </span>
                <span className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <i className="ri-price-tag-3-line mr-2"></i>
                  {tour.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Overview */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-3xl font-bold text-slate-800 mb-6 font-serif">Tour Overview</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {tour.fullDescription}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                      <i className="ri-check-double-line text-green-500 mr-2 text-2xl"></i>
                      What&apos;s Included
                    </h3>
                    <ul className="space-y-2">
                      {inclusions.map((item, index) => (
                        <li key={index} className="flex items-start text-gray-700">
                          <i className="ri-check-line text-green-500 mr-3 mt-1 flex-shrink-0"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                      <i className="ri-close-circle-line text-red-500 mr-2 text-2xl"></i>
                      What&apos;s Not Included
                    </h3>
                    <ul className="space-y-2">
                      {exclusions.map((item, index) => (
                        <li key={index} className="flex items-start text-gray-700">
                          <i className="ri-close-line text-red-500 mr-3 mt-1 flex-shrink-0"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Important Information */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <i className="ri-information-line mr-2 text-2xl"></i>
                  Important Information
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <i className="ri-time-line mr-2 mt-1 flex-shrink-0"></i>
                    <span>Please arrive 15 minutes before departure time</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-sun-line mr-2 mt-1 flex-shrink-0"></i>
                    <span>Bring sunscreen, sunglasses, and a hat for sun protection</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-t-shirt-line mr-2 mt-1 flex-shrink-0"></i>
                    <span>Wear comfortable clothing and swimwear</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-camera-line mr-2 mt-1 flex-shrink-0"></i>
                    <span>Don&apos;t forget your camera or waterproof phone case</span>
                  </li>
                </ul>
              </div>

              {/* Itinerary */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-3xl font-bold text-slate-800 mb-6 font-serif">Detailed Itinerary</h2>
                <Accordion items={itineraryAccordion} />
              </div>

              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-3xl font-bold text-slate-800 mb-6 font-serif">Photo Gallery</h2>
                <ImageGallery images={galleryImages} title={tour.title} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Booking Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="inline-block bg-teal-50 px-4 py-2 rounded-full mb-2">
                    <span className="text-sm text-teal-600 font-medium">From</span>
                  </div>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-teal-600">${tour.price}</span>
                    <span className="text-gray-600 ml-2">per person</span>
                  </div>
                </div>
                
                <button
                  onClick={scrollToBooking}
                  className="w-full px-6 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all duration-300 mb-4 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center"
                >
                  <i className="ri-calendar-check-line mr-2 text-xl"></i>
                  Book This Tour
                </button>

                <a
                  href={`https://wa.me/9607778899?text=${encodeURIComponent(`Hi! I'm interested in the ${tour.title} tour.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 mb-6 flex items-center justify-center"
                >
                  <i className="ri-whatsapp-line mr-2 text-xl"></i>
                  WhatsApp Inquiry
                </a>
                
                <div className="space-y-3 text-sm text-gray-600 border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <i className="ri-time-line mr-2 text-teal-600"></i>
                      Duration:
                    </span>
                    <span className="font-medium text-slate-800">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <i className="ri-group-line mr-2 text-teal-600"></i>
                      Group Size:
                    </span>
                    <span className="font-medium text-slate-800">Max 12 people</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <i className="ri-translate-2 mr-2 text-teal-600"></i>
                      Languages:
                    </span>
                    <span className="font-medium text-slate-800">English, Spanish</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <i className="ri-star-line mr-2 text-teal-600"></i>
                      Difficulty:
                    </span>
                    <span className="font-medium text-slate-800">Moderate</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                    <i className="ri-question-line mr-2 text-teal-600"></i>
                    Need Help?
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <i className="ri-phone-line mr-2 text-teal-600"></i>
                      +960 9990377
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="ri-mail-line mr-2 text-teal-600"></i>
                      info@timelesstours.mv
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <i className="ri-shield-check-line text-2xl text-green-500 mb-1"></i>
                      <p className="text-xs text-gray-600">Secure Booking</p>
                    </div>
                    <div>
                      <i className="ri-refund-line text-2xl text-blue-500 mb-1"></i>
                      <p className="text-xs text-gray-600">Best Price</p>
                    </div>
                    <div>
                      <i className="ri-customer-service-2-line text-2xl text-purple-500 mb-1"></i>
                      <p className="text-xs text-gray-600">24/7 Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      {showBookingForm && (
        <section id="booking-form" className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4 font-serif">Book Your Adventure</h2>
              <p className="text-xl text-gray-600">Fill out the form below and we&apos;ll get back to you within 24 hours</p>
            </div>

            {submitSuccess ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded-r-lg animate-fade-in">
                <div className="flex items-center">
                  <i className="ri-check-double-line text-4xl text-green-500 mr-4"></i>
                  <div>
                    <h3 className="text-xl font-semibold text-green-900 mb-2">Booking Request Submitted!</h3>
                    <p className="text-green-700">Thank you for your interest. We&apos;ll contact you within 24 hours to confirm your booking.</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="bg-stone-50 rounded-lg p-8 shadow-lg">
                <input type="hidden" name="tour" value={tour.title} />
                <input type="hidden" name="price" value={tour.price} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-300 transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-300 transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-300 transition-colors"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-300 transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers *</label>
                    <select 
                      name="travelers" 
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-300 transition-colors cursor-pointer"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5+">5+ People</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Travel Date *</label>
                    <input
                      type="date"
                      name="travelDate"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-300 transition-colors cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests or Questions</label>
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 hover:border-teal-300 transition-colors resize-none"
                    placeholder="Tell us about any dietary restrictions, accessibility needs, or special occasions..."
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">Maximum 500 characters</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-4 bg-teal-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700 hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line mr-2"></i>
                      Submit Booking Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Related Tours */}
      {relatedTours.length > 0 && (
        <section className="py-16 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center font-serif">
              More Tours in {tour.destination}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedTours.map((relatedTour) => (
                <div 
                  key={relatedTour.id} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="relative overflow-hidden h-48">
                    <Image
                      src={relatedTour.image}
                      alt={relatedTour.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-slate-800">
                      {relatedTour.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                      {relatedTour.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{relatedTour.shortDescription}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-teal-600">${relatedTour.price}</span>
                    </div>
                    <Link
                      href={`/tour/${relatedTour.id}`}
                      className="block w-full text-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}