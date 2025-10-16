// app/about/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

export default function About() {
  // Page transition effect (same pattern as tours page)
  useEffect(() => {
    document.body.classList.add('page-transition');
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      document.body.classList.remove('page-transition');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // About page texts with fallback values
  const [aboutHeroTitle, setAboutHeroTitle] = useState('About Timeless Tours');
  const [aboutHeroSubtitle, setAboutHeroSubtitle] = useState('Your gateway to authentic Maldivian experiences');
  const [aboutStoryTitle, setAboutStoryTitle] = useState('Our Story');
  const [aboutStoryPara1, setAboutStoryPara1] = useState("Founded in the heart of Malé, Timeless Tours Maldives was born from a passion for sharing the untouched beauty and rich culture of our island nation. We believe that travel should be more than just visiting places – it should be about creating connections, understanding cultures, and making memories that last a lifetime.");
  const [aboutStoryPara2, setAboutStoryPara2] = useState('Our team of local experts brings decades of combined experience in hospitality and marine adventures, ensuring every guest experiences the authentic spirit of the Maldives while enjoying the highest standards of safety and comfort.');
  const [aboutTeamTitle, setAboutTeamTitle] = useState('Meet Our Team');
  const [aboutTeamSubtitle, setAboutTeamSubtitle] = useState('Passionate locals dedicated to sharing the beauty of the Maldives');
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: number;
    name: string;
    role: string;
    bio: string;
    image: string;
    position: number;
  }>>([]);
  const [aboutValuesTitle, setAboutValuesTitle] = useState('Our Values');
  const [aboutValuesSubtitle, setAboutValuesSubtitle] = useState('The principles that guide everything we do');
  const [values, setValues] = useState<Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    position: number;
  }>>([]);
  const [aboutPromiseTitle, setAboutPromiseTitle] = useState('Our Promise to You');
  const [aboutPromiseSustainableTitle, setAboutPromiseSustainableTitle] = useState('Sustainable Tourism');
  const [aboutPromiseSustainableDesc, setAboutPromiseSustainableDesc] = useState("We're committed to responsible tourism that benefits local communities and preserves our pristine marine environment.");
  const [aboutPromiseComfortTitle, setAboutPromiseComfortTitle] = useState('Comfort & Luxury');
  const [aboutPromiseComfortDesc, setAboutPromiseComfortDesc] = useState('Every detail is carefully planned to ensure your comfort while maintaining the authentic spirit of the Maldives.');
  const [aboutPromiseExperiencesTitle, setAboutPromiseExperiencesTitle] = useState('Unforgettable Experiences');
  const [aboutPromiseExperiencesDesc, setAboutPromiseExperiencesDesc] = useState('We create moments that will stay with you long after you leave our beautiful islands.');

  useEffect(() => {
    let mounted = true;
    async function loadAboutTexts() {
      try {
        const res = await fetch('/api/texts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keys: [
              'about.hero.title', 'about.hero.subtitle',
              'about.story.title', 'about.story.para1', 'about.story.para2',
              'about.team.title', 'about.team.subtitle',
              'about.values.title', 'about.values.subtitle',
              'about.promise.title',
              'about.promise.sustainable.title', 'about.promise.sustainable.desc',
              'about.promise.comfort.title', 'about.promise.comfort.desc',
              'about.promise.experiences.title', 'about.promise.experiences.desc'
            ]
          })
        });
        if (!res.ok) throw new Error('Failed to load about texts');
        const data = (await res.json()) as Record<string, string>;
        if (!mounted) return;
        if (data['about.hero.title']) setAboutHeroTitle(data['about.hero.title']);
        if (data['about.hero.subtitle']) setAboutHeroSubtitle(data['about.hero.subtitle']);
        if (data['about.story.title']) setAboutStoryTitle(data['about.story.title']);
        if (data['about.story.para1']) setAboutStoryPara1(data['about.story.para1']);
        if (data['about.story.para2']) setAboutStoryPara2(data['about.story.para2']);
        if (data['about.team.title']) setAboutTeamTitle(data['about.team.title']);
        if (data['about.team.subtitle']) setAboutTeamSubtitle(data['about.team.subtitle']);
        if (data['about.values.title']) setAboutValuesTitle(data['about.values.title']);
        if (data['about.values.subtitle']) setAboutValuesSubtitle(data['about.values.subtitle']);
        if (data['about.promise.title']) setAboutPromiseTitle(data['about.promise.title']);
        if (data['about.promise.sustainable.title']) setAboutPromiseSustainableTitle(data['about.promise.sustainable.title']);
        if (data['about.promise.sustainable.desc']) setAboutPromiseSustainableDesc(data['about.promise.sustainable.desc']);
        if (data['about.promise.comfort.title']) setAboutPromiseComfortTitle(data['about.promise.comfort.title']);
        if (data['about.promise.comfort.desc']) setAboutPromiseComfortDesc(data['about.promise.comfort.desc']);
        if (data['about.promise.experiences.title']) setAboutPromiseExperiencesTitle(data['about.promise.experiences.title']);
        if (data['about.promise.experiences.desc']) setAboutPromiseExperiencesDesc(data['about.promise.experiences.desc']);
      } catch {
        // keep fallback
      }
    }
    loadAboutTexts();
    return () => { mounted = false };
  }, []);

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
            {aboutHeroTitle}
          </h1>
          <p className="text-xl text-gray-200">{aboutHeroSubtitle}</p>
        </div>
      </section>

      {/* Our Story */}
      <section ref={storyRef} className="py-20 scroll-reveal">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold text-slate-800 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                {aboutStoryTitle}
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">{aboutStoryPara1}</p>
              <p className="text-lg text-slate-600 leading-relaxed">{aboutStoryPara2}</p>
            </div>
            <div className="animate-slide-in-right">
              <img
                src="https://readdy.ai/api/search-image?query=Maldivian%20local%20guide%20showing%20tourists%20around%20traditional%20island%20village%2C%20authentic%20cultural%20experience%2C%20friendly%20local%20people%2C%20tropical%20island%20setting%2C%20warm%20hospitality%2C%20community%20tourism&width=600&height=400&seq=about-story-1&orientation=landscape"
                alt="Our Story"
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
              {aboutTeamTitle}
            </h2>
            <p className="text-lg text-slate-600">{aboutTeamSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
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
              {aboutValuesTitle}
            </h2>
            <p className="text-lg text-slate-600">{aboutValuesSubtitle}</p>
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
            {aboutPromiseTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <h3 className="text-xl font-semibold mb-4 group-hover:text-teal-300 transition-colors duration-500">{aboutPromiseSustainableTitle}</h3>
              <p className="text-gray-200 group-hover:text-white transition-colors duration-500">{aboutPromiseSustainableDesc}</p>
            </div>
            <div className="group p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <h3 className="text-xl font-semibold mb-4 group-hover:text-teal-300 transition-colors duration-500">{aboutPromiseComfortTitle}</h3>
              <p className="text-gray-200 group-hover:text-white transition-colors duration-500">{aboutPromiseComfortDesc}</p>
            </div>
            <div className="group p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <h3 className="text-xl font-semibold mb-4 group-hover:text-teal-300 transition-colors duration-500">{aboutPromiseExperiencesTitle}</h3>
              <p className="text-gray-200 group-hover:text-white transition-colors duration-500">{aboutPromiseExperiencesDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


