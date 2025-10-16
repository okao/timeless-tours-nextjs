// components/feature/Footer.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { getText } = useLanguage();
  
  // Footer texts with fallback values
  const [footerCompany, setFooterCompany] = useState('Timeless Tours Maldives');
  const [footerDescription, setFooterDescription] = useState('Creating unforgettable Maldivian experiences that connect you with pristine coral reefs, authentic island culture, and the natural beauty of our tropical paradise.');
  const [footerQuicklinks, setFooterQuicklinks] = useState('Quick Links');
  const [footerContact, setFooterContact] = useState('Contact Info');
  const [footerNewsletter, setFooterNewsletter] = useState('Newsletter');
  const [footerNewsletterDesc, setFooterNewsletterDesc] = useState('Subscribe to get Maldivian travel tips and exclusive island experiences.');
  const [footerNewsletterPlaceholder, setFooterNewsletterPlaceholder] = useState('Your email address');
  const [footerNewsletterButton, setFooterNewsletterButton] = useState('Subscribe');
  const [footerCopyright, setFooterCopyright] = useState('© 2024 Timeless Tours Maldives. All rights reserved.');

  useEffect(() => {
    let mounted = true;
    async function loadFooterTexts() {
      try {
        const res = await fetch('/api/texts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            keys: [
              'footer.company', 'footer.description', 'footer.quicklinks', 'footer.contact', 
              'footer.newsletter', 'footer.newsletter.desc', 'footer.newsletter.placeholder', 
              'footer.newsletter.button', 'footer.copyright'
            ] 
          })
        });
        if (!res.ok) throw new Error('Failed to load footer texts');
        const data = await res.json();
        if (!mounted) return;
        if (data['footer.company']) setFooterCompany(data['footer.company']);
        if (data['footer.description']) setFooterDescription(data['footer.description']);
        if (data['footer.quicklinks']) setFooterQuicklinks(data['footer.quicklinks']);
        if (data['footer.contact']) setFooterContact(data['footer.contact']);
        if (data['footer.newsletter']) setFooterNewsletter(data['footer.newsletter']);
        if (data['footer.newsletter.desc']) setFooterNewsletterDesc(data['footer.newsletter.desc']);
        if (data['footer.newsletter.placeholder']) setFooterNewsletterPlaceholder(data['footer.newsletter.placeholder']);
        if (data['footer.newsletter.button']) setFooterNewsletterButton(data['footer.newsletter.button']);
        if (data['footer.copyright']) setFooterCopyright(data['footer.copyright']);
      } catch {
        // keep fallback
      }
    }
    loadFooterTexts();
    return () => { mounted = false };
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const response = await fetch('https://readdy.ai/api/form/d3ii27vuqofrij837p4g', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(Object.fromEntries(
          Array.from(formData.entries()).map(([key, value]) => [key, value.toString()])
        )).toString(),
      });

      if (response.ok) {
        alert('Thank you for subscribing to our newsletter!');
        form.reset();
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
        console.log(error)
        alert('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3
              className="text-2xl font-bold mb-4 font-pacifico"
              style={{ fontFamily: 'Pacifico, serif' }}
            >
              {getText('footer.company', footerCompany)}
            </h3>
            <p className="text-gray-300 mb-6">
              {getText('footer.description', footerDescription)}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors">
                <i className="ri-facebook-fill"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors">
                <i className="ri-instagram-line"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors">
                <i className="ri-twitter-line"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors">
                <i className="ri-youtube-line"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{getText('footer.quicklinks', footerQuicklinks)}</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">{getText('navbar.home', 'Home')}</Link></li>
              <li><Link href="/tours" className="text-gray-300 hover:text-white transition-colors">{getText('navbar.tours', 'Tours')}</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">{getText('navbar.about', 'About Us')}</Link></li>
              <li><Link href="/testimonials" className="text-gray-300 hover:text-white transition-colors">{getText('navbar.testimonials', 'Testimonials')}</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">{getText('navbar.faq', 'FAQ')}</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">{getText('navbar.contact', 'Contact')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{getText('footer.contact', footerContact)}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <i className="ri-phone-line text-teal-400"></i>
                <span className="text-gray-300">+960 9990377</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-mail-line text-teal-400"></i>
                <span className="text-gray-300">info@timelesstours.mv</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-map-pin-line text-teal-400"></i>
                <span className="text-gray-300">Marine Drive, Malé 20026, Maldives</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-whatsapp-line text-teal-400"></i>
                <span className="text-gray-300">+960 7778899</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{getText('footer.newsletter', footerNewsletter)}</h4>
            <p className="text-gray-300 mb-4">{getText('footer.newsletter.desc', footerNewsletterDesc)}</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                name="email"
                placeholder={getText('footer.newsletter.placeholder', footerNewsletterPlaceholder)}
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
              >
                {getText('footer.newsletter.button', footerNewsletterButton)}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {getText('footer.copyright', footerCopyright)}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
            <a href="https://readdy.ai/?origin=logo" className="text-gray-400 hover:text-white text-sm transition-colors">Powered by Readdy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
