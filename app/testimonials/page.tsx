// app/testimonials/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Carousel from '@/components/base/Carousel';
import { testimonials } from '@/mocks/tours';

export default function Testimonials() {
  // Testimonials page texts state
  const [testimonialsHeroTitle, setTestimonialsHeroTitle] = useState('Traveler Stories');
  const [testimonialsHeroSubtitle, setTestimonialsHeroSubtitle] = useState('Real experiences from our valued travelers');
  const [testimonialsFeaturedTitle, setTestimonialsFeaturedTitle] = useState('What Our Travelers Say');
  const [testimonialsFeaturedSubtitle, setTestimonialsFeaturedSubtitle] = useState('Discover why thousands of travelers choose Timeless Tours for their most important journeys');
  const [testimonialsMoreTitle, setTestimonialsMoreTitle] = useState('More Traveler Reviews');
  const [testimonialsMoreSubtitle, setTestimonialsMoreSubtitle] = useState('Join thousands of satisfied travelers who have experienced the Timeless Tours difference');
  const [testimonialsStatsTitle, setTestimonialsStatsTitle] = useState('Trusted by Thousands');
  const [testimonialsStatsSubtitle, setTestimonialsStatsSubtitle] = useState('Our commitment to excellence speaks for itself');
  const [testimonialsStatsTravelers, setTestimonialsStatsTravelers] = useState('Happy Travelers');
  const [testimonialsStatsRating, setTestimonialsStatsRating] = useState('Average Rating');
  const [testimonialsStatsDestinations, setTestimonialsStatsDestinations] = useState('Destinations');
  const [testimonialsStatsRecommend, setTestimonialsStatsRecommend] = useState('Would Recommend');
  const [testimonialsCtaTitle, setTestimonialsCtaTitle] = useState('Ready to Create Your Own Story?');
  const [testimonialsCtaSubtitle, setTestimonialsCtaSubtitle] = useState('Join thousands of satisfied travelers and start planning your unforgettable journey today.');
  const [testimonialsCtaBrowse, setTestimonialsCtaBrowse] = useState('Browse Tours');
  const [testimonialsCtaContact, setTestimonialsCtaContact] = useState('Contact Us');

  useEffect(() => {
    let mounted = true;
    async function loadTestimonialsTexts() {
      try {
        const res = await fetch('/api/texts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keys: [
              'testimonials.hero.title', 'testimonials.hero.subtitle',
              'testimonials.featured.title', 'testimonials.featured.subtitle',
              'testimonials.more.title', 'testimonials.more.subtitle',
              'testimonials.stats.title', 'testimonials.stats.subtitle',
              'testimonials.stats.travelers', 'testimonials.stats.rating',
              'testimonials.stats.destinations', 'testimonials.stats.recommend',
              'testimonials.cta.title', 'testimonials.cta.subtitle',
              'testimonials.cta.browse', 'testimonials.cta.contact'
            ]
          })
        });
        if (!res.ok) throw new Error('Failed to load testimonials texts');
        const data = (await res.json()) as Record<string, string>;
        if (!mounted) return;
        if (data['testimonials.hero.title']) setTestimonialsHeroTitle(data['testimonials.hero.title']);
        if (data['testimonials.hero.subtitle']) setTestimonialsHeroSubtitle(data['testimonials.hero.subtitle']);
        if (data['testimonials.featured.title']) setTestimonialsFeaturedTitle(data['testimonials.featured.title']);
        if (data['testimonials.featured.subtitle']) setTestimonialsFeaturedSubtitle(data['testimonials.featured.subtitle']);
        if (data['testimonials.more.title']) setTestimonialsMoreTitle(data['testimonials.more.title']);
        if (data['testimonials.more.subtitle']) setTestimonialsMoreSubtitle(data['testimonials.more.subtitle']);
        if (data['testimonials.stats.title']) setTestimonialsStatsTitle(data['testimonials.stats.title']);
        if (data['testimonials.stats.subtitle']) setTestimonialsStatsSubtitle(data['testimonials.stats.subtitle']);
        if (data['testimonials.stats.travelers']) setTestimonialsStatsTravelers(data['testimonials.stats.travelers']);
        if (data['testimonials.stats.rating']) setTestimonialsStatsRating(data['testimonials.stats.rating']);
        if (data['testimonials.stats.destinations']) setTestimonialsStatsDestinations(data['testimonials.stats.destinations']);
        if (data['testimonials.stats.recommend']) setTestimonialsStatsRecommend(data['testimonials.stats.recommend']);
        if (data['testimonials.cta.title']) setTestimonialsCtaTitle(data['testimonials.cta.title']);
        if (data['testimonials.cta.subtitle']) setTestimonialsCtaSubtitle(data['testimonials.cta.subtitle']);
        if (data['testimonials.cta.browse']) setTestimonialsCtaBrowse(data['testimonials.cta.browse']);
        if (data['testimonials.cta.contact']) setTestimonialsCtaContact(data['testimonials.cta.contact']);
      } catch {
        // keep fallback
      }
    }
    loadTestimonialsTexts();
    return () => { mounted = false };
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-96 flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://readdy.ai/api/search-image?query=Happy%20travelers%20sharing%20stories%20and%20experiences%2C%20group%20of%20diverse%20people%20smiling%2C%20travel%20memories%20and%20friendship%2C%20warm%20social%20atmosphere&width=1920&height=600&seq=testimonials-hero&orientation=landscape')",
        }}
      >
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            {testimonialsHeroTitle}
          </h1>
          <p className="text-xl md:text-2xl font-light">{testimonialsHeroSubtitle}</p>
        </div>
      </section>

      {/* Featured Testimonials Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {testimonialsFeaturedTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{testimonialsFeaturedSubtitle}</p>
          </div>

          <Carousel autoPlay={true} interval={8000} showArrows={true}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-stone-50 rounded-lg p-12 mx-4">
                <div className="text-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-24 h-24 rounded-full object-cover object-top mx-auto mb-6"
                  />
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="ri-star-fill text-yellow-400 text-xl"></i>
                    ))}
                  </div>
                  <blockquote className="text-2xl text-gray-700 leading-relaxed italic mb-6 max-w-4xl mx-auto">
                    &quot;{testimonial.text}&quot;
                  </blockquote>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {testimonialsMoreTitle}
            </h2>
            <p className="text-xl text-gray-600">{testimonialsMoreSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover object-top mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">&quot;{testimonial.text}&quot;</p>
              </div>
            ))}

            {/* Additional testimonials */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20happy%20male%20traveler%20with%20genuine%20smile%2C%20outdoor%20natural%20lighting%2C%20travel%20portrait%20style%2C%20satisfied%20customer%20expression&width=150&height=150&seq=testimonial6&orientation=squarish"
                  alt="James Wilson"
                  className="w-12 h-12 rounded-full object-cover object-top mr-4"
                />
                <div>
                  <h4 className="font-semibold text-slate-800">James Wilson</h4>
                  <p className="text-gray-600 text-sm">Toronto, Canada</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">&quot;The Morocco desert adventure was absolutely incredible. The camel trek, desert camp, and sunrise over the dunes were magical moments I&apos;ll never forget. Exceptional service throughout.&quot;</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20happy%20female%20traveler%20with%20warm%20smile%2C%20natural%20lighting%2C%20travel%20photography%20style%2C%20delighted%20customer%20expression&width=150&height=150&seq=testimonial7&orientation=squarish"
                  alt="Maria Santos"
                  className="w-12 h-12 rounded-full object-cover object-top mr-4"
                />
                <div>
                  <h4 className="font-semibold text-slate-800">Maria Santos</h4>
                  <p className="text-gray-600 text-sm">São Paulo, Brazil</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">&quot;Our family trip to Bali was perfectly organized. The cultural experiences were authentic and educational for our children. The guides were knowledgeable and patient with all our questions.&quot;</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20happy%20elderly%20male%20traveler%20with%20kind%20smile%2C%20natural%20lighting%2C%20travel%20portrait%20style%2C%20satisfied%20senior%20customer&width=150&height=150&seq=testimonial8&orientation=squarish"
                  alt="Robert Taylor"
                  className="w-12 h-12 rounded-full object-cover object-top mr-4"
                />
                <div>
                  <h4 className="font-semibold text-slate-800">Robert Taylor</h4>
                  <p className="text-gray-600 text-sm">Melbourne, Australia</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">&quot;The Iceland Northern Lights tour was a dream come true. Despite challenging weather, the team ensured we had multiple opportunities to see the aurora. The ice caves were breathtaking!&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {testimonialsStatsTitle}
            </h2>
            <p className="text-xl text-gray-600">{testimonialsStatsSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">5,000+</div>
              <p className="text-gray-600">{testimonialsStatsTravelers}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">4.9/5</div>
              <p className="text-gray-600">{testimonialsStatsRating}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">50+</div>
              <p className="text-gray-600">{testimonialsStatsDestinations}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">98%</div>
              <p className="text-gray-600">{testimonialsStatsRecommend}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            {testimonialsCtaTitle}
          </h2>
          <p className="text-xl mb-8 font-light">{testimonialsCtaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tours"
              className="inline-block px-8 py-3 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap"
            >
              {testimonialsCtaBrowse}
            </Link>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-teal-600 transition-colors duration-300 whitespace-nowrap"
            >
              {testimonialsCtaContact}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


