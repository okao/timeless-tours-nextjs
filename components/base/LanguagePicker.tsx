'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

interface LanguagePickerProps {
  onLanguageChange?: () => void;
}

export default function LanguagePicker({ onLanguageChange }: LanguagePickerProps) {
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
    setIsOpen(false);
    
    // Call the callback to close mobile menu if needed
    if (onLanguageChange) {
      onLanguageChange();
    }
    
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: languageCode } 
    }));
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-teal-300 hover:text-teal-600 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
        aria-label="Select language"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium hidden sm:block">{currentLang.name}</span>
        <i className={`ri-arrow-down-s-line text-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-20 animate-fade-in">
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-teal-50 transition-colors duration-200 ${
                    currentLanguage === language.code 
                      ? 'bg-teal-50 text-teal-600 border-r-2 border-teal-600 font-medium' 
                      : 'text-gray-700 hover:text-teal-600'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                  {currentLanguage === language.code && (
                    <i className="ri-check-line text-teal-600 ml-auto"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}