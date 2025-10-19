// contexts/LanguageContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  getText: (key: string, fallback?: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail.language;
      setCurrentLanguage(newLanguage);
      loadTranslations(newLanguage);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
  }, []);

  useEffect(() => {
    loadTranslations(currentLanguage);
  }, [currentLanguage]);

  const loadTranslations = async (language: string) => {
    if (language === 'en') {
      setTranslations({});
      return;
    }

    setIsLoading(true);
    try {
      const textKeys = [
        'navbar.home', 'navbar.tours', 'navbar.about', 'navbar.testimonials', 
        'navbar.faq', 'navbar.contact', 'navbar.book',
        'footer.company', 'footer.description', 'footer.quicklinks', 
        'footer.contact', 'footer.newsletter', 'footer.newsletter.desc', 
        'footer.newsletter.placeholder', 'footer.newsletter.button', 'footer.copyright',
        // Home page keys
        'hero.title', 'hero.subtitle', 'hero.cta',
        'about.title', 'about.body',
        'featured.title', 'featured.subtitle', 'featured.button',
        'why.title', 'why.subtitle',
        'why.expertise.title', 'why.expertise.desc',
        'why.safety.title', 'why.safety.desc',
        'why.service.title', 'why.service.desc',
        'testimonials.title',
        'cta.title', 'cta.subtitle', 'cta.button',
        // About page keys
        'about.hero.title', 'about.hero.subtitle',
        'about.story.title', 'about.story.para1', 'about.story.para2',
        'about.team.title', 'about.team.subtitle',
        'about.values.title', 'about.values.subtitle',
        'about.promise.title',
        'about.promise.sustainable.title', 'about.promise.sustainable.desc',
        'about.promise.comfort.title', 'about.promise.comfort.desc',
        'about.promise.experiences.title', 'about.promise.experiences.desc',
        // Tour detail page keys
        'tour.notFound.title', 'tour.notFound.back',
        'tour.overview.title', 'tour.inclusions.title', 'tour.exclusions.title',
        'tour.itinerary.title', 'tour.itinerary.day', 'tour.gallery.title',
        'tour.price.perPerson', 'tour.booking.button', 'tour.details.duration',
        'tour.details.groupSize', 'tour.details.maxPeople', 'tour.details.languages',
        'tour.details.languageList', 'tour.details.difficulty', 'tour.details.difficultyLevel',
        'tour.help.title', 'tour.booking.success', 'tour.booking.error',
        'tour.booking.form.title', 'tour.booking.form.subtitle', 'tour.booking.form.firstName',
        'tour.booking.form.lastName', 'tour.booking.form.email', 'tour.booking.form.phone',
        'tour.booking.form.travelers', 'tour.booking.form.travelers.1', 'tour.booking.form.travelers.2',
        'tour.booking.form.travelers.3', 'tour.booking.form.travelers.4', 'tour.booking.form.travelers.5',
        'tour.booking.form.date', 'tour.booking.form.message', 'tour.booking.form.messagePlaceholder',
        'tour.booking.form.maxChars', 'tour.booking.form.submit', 'tour.related.title', 'tour.related.viewDetails'
      ];

      const response = await fetch('/api/texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: textKeys, lang: language })
      });

      if (response.ok) {
        const data = await response.json();
        setTranslations(data);
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getText = (key: string, fallback?: string): string => {
    if (currentLanguage === 'en') {
      return fallback || key;
    }
    return translations[key] || fallback || key;
  };

  const value: LanguageContextType = {
    currentLanguage,
    setCurrentLanguage,
    getText,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}