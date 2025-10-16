// app/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Carousel from '@/components/base/Carousel';
import { useLanguage } from '@/contexts/LanguageContext';

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

const heroSectionVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: 'easeOut' as const },
  },
};

const heroContentVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function Home() {
  const { getText } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [tours, setTours] = useState<Tour[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroFallbackSrc, setHeroFallbackSrc] = useState(
    'https://readdy.ai/api/search-image?query=Stunning%20Maldives%20beach%20paradise&width=1920&height=1080'
  );
  const [ctaImageSrc, setCtaImageSrc] = useState(
    'https://readdy.ai/api/search-image?query=Maldives%20sunset%20beach&width=1920&height=600'
  );
  const [heroTitle, setHeroTitle] = useState('Explore the Unforgettable Maldives');
  const [heroSubtitle, setHeroSubtitle] = useState('Discover pristine islands, crystal waters, and thrilling water sports adventures');
  const [heroCta, setHeroCta] = useState('Explore Tours');
  
  const heroRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const { scrollYProgress: ctaScrollYProgress } = useScroll({
    target: ctaRef,
    offset: ['start 85%', 'end 10%'],
  });

  const heroImageScale = useTransform(heroScrollYProgress, [0, 1], [1, 1.08]);
  const heroOverlayOpacity = useTransform(heroScrollYProgress, [0, 1], [0.7, 0.3]);
  const heroContentY = useTransform(heroScrollYProgress, [0, 1], [0, -120]);
  const heroContentOpacity = useTransform(heroScrollYProgress, [0, 1], [1, 0]);

  const ctaImageScale = useTransform(ctaScrollYProgress, [0, 1], [1.15, 1]);
  const ctaOverlayOpacity = useTransform(ctaScrollYProgress, [0, 1], [0.8, 0.5]);
  const ctaContentY = useTransform(ctaScrollYProgress, [0, 1], [60, 0]);
  const ctaContentOpacity = useTransform(ctaScrollYProgress, [0, 1], [0, 1]);

  const testimonials = [
    {
      text: "Our Maldives adventure with Timeless Tours was absolutely magical. The crystal-clear waters and pristine beaches exceeded all expectations!",
      author: "Sarah & Michael",
      location: "Australia",
    },
    {
      text: "The local island experience was authentic and beautiful. Swimming with manta rays was the highlight of our honeymoon!",
      author: "Emma Thompson",
      location: "United Kingdom",
    },
    {
      text: "Professional service, stunning locations, and unforgettable memories. We'll definitely be back to explore more islands!",
      author: "David Chen",
      location: "Singapore",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    async function loadData() {
      try {
        // Load tours
        const toursRes = await fetch('/api/tours');
        if (toursRes.ok) {
          const toursData = await toursRes.json();
          setTours(toursData.slice(0, 3));
        }

        // Load hero slides
        const slidesRes = await fetch('/api/hero-slides');
        if (slidesRes.ok) {
          const slidesData = await slidesRes.json();
          const images = slidesData.map((s: { image: string }) => s.image);
          if (images.length > 0) setHeroImages(images);
        }

        // Load hero texts
        const textsRes = await fetch('/api/texts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            keys: ['hero.title', 'hero.subtitle', 'hero.cta'] 
          })
        });
        if (textsRes.ok) {
          const data = await textsRes.json();
          if (data['hero.title']) setHeroTitle(data['hero.title']);
          if (data['hero.subtitle']) setHeroSubtitle(data['hero.subtitle']);
          if (data['hero.cta']) setHeroCta(data['hero.cta']);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center text-white overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={heroSectionVariants}
        ref={heroRef}
      >
        <motion.div className="absolute inset-0" style={{ scale: heroImageScale }}>
          {heroImages.length > 0 ? (
            <Carousel autoPlay={true} interval={4000} showDots={false} showArrows={false} rounded={false}>
              {heroImages.map((image, index) => (
                <div key={index} className="relative h-screen">
                  <Image
                    src={image}
                    alt={`Maldives Paradise ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <Image
              src={heroFallbackSrc}
              alt="Maldives Paradise"
              fill
              className="object-cover"
              priority
              onError={() =>
                setHeroFallbackSrc(
                  'https://readdy.ai/api/search-image?query=Stunning%20aerial%20view%20of%20Maldives%20crystal%20clear%20turquoise%20lagoon%20with%20overwater%20bungalows%2C%20pristine%20white%20sand%20beaches%2C%20tropical%20paradise%2C%20luxury%20resort%2C%20bright%20sunny%20day%2C%20professional%20travel%20photography&width=1920&height=1080&seq=hero-maldives-1&orientation=landscape'
                )
              }
              />
          )}
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"
          style={{ opacity: heroOverlayOpacity }}
        ></motion.div>

        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          variants={heroContentVariants}
          style={{ opacity: heroContentOpacity, y: heroContentY }}
        >
          <motion.h1
            style={{ fontFamily: '"Playfair Display", serif' }}
            className="text-5xl md:text-7xl font-bold mb-6 font-serif"
            variants={fadeInUpVariants}
          >
            {getText('hero.title', heroTitle)}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-200"
            variants={fadeInUpVariants}
          >
            {getText('hero.subtitle', heroSubtitle)}
          </motion.p>
          <motion.div variants={fadeInUpVariants}>
            <Link
              href="/tours"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {getText('hero.cta', heroCta)}
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-8 font-serif">
            {getText('about.title', 'Welcome to Paradise')}
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {getText('about.body', 'Timeless Tours Maldives specializes in creating unforgettable experiences across the pristine islands of the Maldives.')}
          </p>
        </div>
      </motion.section>

      {/* Featured Tours */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4 font-serif">
              {getText('featured.title', 'Featured Experiences')}
            </h2>
            <p className="text-lg text-slate-600">
              {getText('featured.subtitle', 'Discover our most popular Maldivian adventures')}
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={gridVariants}
          >
            {tours.map((tour) => (
              <motion.div
                key={tour.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {tour.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {tour.shortDescription}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-teal-600">
                      ${tour.price}
                    </span>
                    <span className="text-slate-500">{tour.duration}</span>
                  </div>
                  <Link
                    href={`/tour/${tour.id}`}
                    className="block w-full bg-teal-600 hover:bg-teal-700 text-white text-center py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    {getText('featured.button', 'More Info')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4 font-serif">
              {getText('why.title', 'Why Choose Timeless Tours')}
            </h2>
            <p className="text-lg text-slate-600">
              {getText('why.subtitle', 'Experience the Maldives like never before')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'ri-map-pin-line',
                title: getText('why.expertise.title', 'Local Expertise'),
                desc: getText('why.expertise.desc', 'Deep knowledge of hidden gems and authentic Maldivian experiences'),
              },
              {
                icon: 'ri-shield-check-line',
                title: getText('why.safety.title', 'Safety First'),
                desc: getText('why.safety.desc', 'Certified guides and equipment for worry-free adventures'),
              },
              {
                icon: 'ri-heart-line',
                title: getText('why.service.title', 'Personalized Service'),
                desc: getText('why.service.desc', 'Tailored experiences to create your perfect Maldivian getaway'),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-2xl bg-white border border-gray-100 transition-all duration-500"
                variants={cardVariants}
                whileHover={{ y: -6, boxShadow: '0px 30px 60px rgba(13,148,136,0.15)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${item.icon} text-2xl text-teal-600`}></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-16 font-serif">
            {getText('testimonials.title', 'What Our Guests Say')}
          </h2>

          <div className="relative">
            <motion.div
              className="bg-stone-50 rounded-lg p-8 shadow-lg"
              variants={cardVariants}
            >
              <div className="mb-6">
                <i className="ri-double-quotes-l text-4xl text-teal-600 mb-4"></i>
                <p className="text-lg text-slate-700 italic leading-relaxed">
                  {testimonials[currentTestimonial].text}
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  {testimonials[currentTestimonial].author}
                </p>
                <p className="text-slate-600">
                  {testimonials[currentTestimonial].location}
                </p>
              </div>
            </motion.div>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section - Clean, modern design */}
      <motion.section
        className="py-32 text-white text-center relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={sectionVariants}
        ref={ctaRef}
      >
        <motion.div className="absolute inset-0" style={{ scale: ctaImageScale }}>
          <Image
            src={ctaImageSrc}
            alt="Maldives Sunset"
            fill
            className="object-cover"
            onError={() =>
              setCtaImageSrc(
                'https://readdy.ai/api/search-image?query=Stunning%20aerial%20view%20of%20Maldives%20crystal%20clear%20turquoise%20lagoon%20with%20overwater%20bungalows%2C%20pristine%20white%20sand%20beaches%2C%20tropical%20paradise%2C%20luxury%20resort%2C%20bright%20sunny%20day%2C%20professional%20travel%20photography&width=1920&height=1080&seq=hero-maldives-1&orientation=landscape'
              )
            }
            priority={false}
          />
        </motion.div>
        
        {/* Clean gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>

        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-6"
          style={{ y: ctaContentY, opacity: ctaContentOpacity }}
        >
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                {getText('cta.title', 'Ready for Your Maldivian Adventure?')}
              </h2>
              <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
                {getText('cta.subtitle', 'Let us create unforgettable memories in paradise')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="group bg-teal-600 hover:bg-teal-700 text-white px-10 py-5 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-teal-600/30 flex items-center gap-2"
              >
                {getText('cta.button', 'Plan Your Adventure')}
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
              <Link
                href="/tours"
                className="group text-white border-2 border-white/30 hover:border-white hover:bg-white/10 px-10 py-5 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Explore Tours
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <Footer />
    </div>
  );
}
