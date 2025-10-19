// app/about/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { getText } = useLanguage();

  // Page transition effect (same pattern as tours page)
  useEffect(() => {
    document.body.classList.add('page-transition');
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      document.body.classList.remove('page-transition');
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  // Team members and values state
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: number;
    name: string;
    role: string;
    bio: string;
    image: string;
    position: number;
  }>>([]);
  const [values, setValues] = useState<Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    position: number;
  }>>([]);


  useEffect(() => {
    let mounted = true;
    async function loadTeamMembers() {
      try {
        const res = await fetch('/api/team-members');
        if (!res.ok) throw new Error('Failed to load team members');
        const data = (await res.json()) as Array<{
          id: number;
          name: string;
          role: string;
          bio: string;
          image: string;
          position: number;
        }>;
        if (mounted) {
          setTeamMembers(data);
        }
      } catch {
        // keep empty array fallback
      }
    }
    loadTeamMembers();
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadValues() {
      try {
        const res = await fetch('/api/values');
        if (!res.ok) throw new Error('Failed to load values');
        const data = (await res.json()) as Array<{
          id: number;
          title: string;
          description: string;
          icon: string;
          position: number;
        }>;
        if (mounted) {
          setValues(data);
        }
      } catch {
        // keep empty array fallback
      }
    }
    loadValues();
    return () => { mounted = false };
  }, []);

  // Scroll reveal effect (same pattern as tours page)
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const promiseRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const refs = [heroRef, storyRef, teamRef, valuesRef, promiseRef];
    const observers: IntersectionObserver[] = [];

    refs.forEach((ref) => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative py-32 text-white text-center scroll-reveal parallax-bg"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Traditional%20Maldivian%20dhoni%20boats%20on%20crystal%20clear%20turquoise%20water%2C%20local%20fishermen%2C%20authentic%20island%20culture%2C%20tropical%20paradise%2C%20golden%20hour%20lighting%2C%20cultural%20heritage%20photography&width=1920&height=600&seq=about-hero-1&orientation=landscape')",
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            {getText('about.hero.title', 'About Timeless Tours')}
          </h1>
          <p className="text-xl text-gray-200">{getText('about.hero.subtitle', 'Your gateway to authentic Maldivian experiences')}</p>
        </div>
      </section>

      {/* Our Story */}
      <section ref={storyRef} className="py-20 scroll-reveal">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold text-slate-800 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                {getText('about.story.title', 'Our Story')}
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">{getText('about.story.para1', "Founded in the heart of Malé, Timeless Tours Maldives was born from a passion for sharing the untouched beauty and rich culture of our island nation. We believe that travel should be more than just visiting places – it should be about creating connections, understanding cultures, and making memories that last a lifetime.")}</p>
              <p className="text-lg text-slate-600 leading-relaxed">{getText('about.story.para2', 'Our team of local experts brings decades of combined experience in hospitality and marine adventures, ensuring every guest experiences the authentic spirit of the Maldives while enjoying the highest standards of safety and comfort.')}</p>
            </div>
            <div className="animate-slide-in-right">
              <Image
                src="https://readdy.ai/api/search-image?query=Maldivian%20local%20guide%20showing%20tourists%20around%20traditional%20island%20village%2C%20authentic%20cultural%20experience%2C%20friendly%20local%20people%2C%20tropical%20island%20setting%2C%20warm%20hospitality%2C%20community%20tourism&width=600&height=400&seq=about-story-1&orientation=landscape"
                alt="Our Story"
                width={600}
                height={400}
                className="rounded-lg shadow-lg hover-scale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef} className="py-20 bg-white scroll-reveal">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {getText('about.team.title', 'Meet Our Team')}
            </h2>
            <p className="text-lg text-slate-600">{getText('about.team.subtitle', 'Passionate locals dedicated to sharing the beauty of the Maldives')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                <div className="relative mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={192}
                    height={192}
                    className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors duration-500">{member.name}</h3>
                <p className="text-teal-600 font-medium mb-3 group-hover:text-teal-700 transition-colors duration-500">{member.role}</p>
                <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-20 scroll-reveal">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {getText('about.values.title', 'Our Values')}
            </h2>
            <p className="text-lg text-slate-600">{getText('about.values.subtitle', 'The principles that guide everything we do')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={value.id}
                className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                <div
                  className="w-16 h-16 bg-teal-100 group-hover:bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-gentle-float group-hover:scale-110 transition-all duration-500"
                  style={{ animationDelay: `${index}s` }}
                >
                  <i className={`${value.icon} text-2xl text-teal-600 group-hover:text-white transition-colors duration-500`}></i>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors duration-500">{value.title}</h3>
                <p className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section
        ref={promiseRef}
        className="py-20 text-white scroll-reveal parallax-bg"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://readdy.ai/api/search-image?query=Pristine%20coral%20reef%20in%20Maldives%20with%20colorful%20tropical%20fish%2C%20crystal%20clear%20water%2C%20marine%20conservation%2C%20underwater%20paradise%2C%20vibrant%20coral%20formations%2C%20sustainable%20tourism&width=1920&height=600&seq=about-promise-1&orientation=landscape')",
        }}
      >
        <div className="animate-subtle-zoom max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
            {getText('about.promise.title', 'Our Promise to You')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <h3 className="text-xl font-semibold mb-4 group-hover:text-teal-300 transition-colors duration-500">{getText('about.promise.sustainable.title', 'Sustainable Tourism')}</h3>
              <p className="text-gray-200 group-hover:text-white transition-colors duration-500">{getText('about.promise.sustainable.desc', "We're committed to responsible tourism that benefits local communities and preserves our pristine marine environment.")}</p>
            </div>
            <div className="group p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <h3 className="text-xl font-semibold mb-4 group-hover:text-teal-300 transition-colors duration-500">{getText('about.promise.comfort.title', 'Comfort & Luxury')}</h3>
              <p className="text-gray-200 group-hover:text-white transition-colors duration-500">{getText('about.promise.comfort.desc', 'Every detail is carefully planned to ensure your comfort while maintaining the authentic spirit of the Maldives.')}</p>
            </div>
            <div className="group p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <h3 className="text-xl font-semibold mb-4 group-hover:text-teal-300 transition-colors duration-500">{getText('about.promise.experiences.title', 'Unforgettable Experiences')}</h3>
              <p className="text-gray-200 group-hover:text-white transition-colors duration-500">{getText('about.promise.experiences.desc', "We create moments that will stay with you long after you leave our beautiful islands.")}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


