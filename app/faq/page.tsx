// app/faq/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Accordion from '@/components/base/Accordion';

interface FaqRecord {
  id: number;
  question: string;
  answer: string;
  position: number;
}

interface FaqTopic {
  id: number;
  title: string;
  description: string;
  icon: string;
  position: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const sectionReveal = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const staggerChildren = {
  hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
};

export default function FAQ() {
  const [faqs, setFaqs] = useState<FaqRecord[]>([]);
  const [faqTopics, setFaqTopics] = useState<FaqTopic[]>([]);

  const [faqHeroTitle, setFaqHeroTitle] = useState('Frequently Asked Questions');
  const [faqHeroSubtitle, setFaqHeroSubtitle] = useState('Everything you need to know about traveling with us');
  const [faqSectionTitle, setFaqSectionTitle] = useState('Common Questions');
  const [faqSectionSubtitle, setFaqSectionSubtitle] = useState('Find answers to the most frequently asked questions about our tours and services');
  const [faqHelpTitle, setFaqHelpTitle] = useState('Still Have Questions?');
  const [faqHelpSubtitle, setFaqHelpSubtitle] = useState('Our travel experts are here to help you plan the perfect journey');
  const [faqHelpCallTitle, setFaqHelpCallTitle] = useState('Call Us');
  const [faqHelpCallDesc, setFaqHelpCallDesc] = useState('Speak directly with our travel experts');
  const [faqHelpCallNumber, setFaqHelpCallNumber] = useState('+1 (555) 123-4567');
  const [faqHelpCallHours, setFaqHelpCallHours] = useState('Mon-Fri: 9AM-6PM EST');
  const [faqHelpEmailTitle, setFaqHelpEmailTitle] = useState('Email Us');
  const [faqHelpEmailDesc, setFaqHelpEmailDesc] = useState('Get detailed answers to your questions');
  const [faqHelpEmailAddress, setFaqHelpEmailAddress] = useState('info@timelesstours.com');
  const [faqHelpEmailResponse, setFaqHelpEmailResponse] = useState('Response within 24 hours');
  const [faqHelpChatTitle, setFaqHelpChatTitle] = useState('Live Chat');
  const [faqHelpChatDesc, setFaqHelpChatDesc] = useState('Instant support for quick questions');
  const [faqHelpChatButton, setFaqHelpChatButton] = useState('Start Chat');
  const [faqHelpChatAvailability, setFaqHelpChatAvailability] = useState('Available 24/7');
  const [faqTopicsTitle, setFaqTopicsTitle] = useState('Popular Help Topics');
  const [faqTopicsSubtitle, setFaqTopicsSubtitle] = useState('Quick access to the information you need most');

  const whatsappNumber = '+9607778899';

  useEffect(() => {
    document.body.classList.add('page-transition');
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      document.body.classList.remove('page-transition');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadFaqs() {
      try {
        const res = await fetch('/api/faq');
        if (!res.ok) throw new Error('Failed to load FAQs');
        const data = (await res.json()) as FaqRecord[];
        if (mounted) {
          setFaqs(
            [...data].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          );
        }
      } catch {
        // Keep fallback empty array
      }
    }
    loadFaqs();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadFaqTopics() {
      try {
        const res = await fetch('/api/faq-topics');
        if (!res.ok) throw new Error('Failed to load FAQ topics');
        const data = (await res.json()) as FaqTopic[];
        if (mounted) {
          setFaqTopics(
            [...data].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          );
        }
      } catch {
        // Keep fallback empty array
      }
    }
    loadFaqTopics();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadFaqTexts() {
      try {
        const res = await fetch('/api/texts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keys: [
              'faq.hero.title',
              'faq.hero.subtitle',
              'faq.section.title',
              'faq.section.subtitle',
              'faq.help.title',
              'faq.help.subtitle',
              'faq.help.call.title',
              'faq.help.call.desc',
              'faq.help.call.number',
              'faq.help.call.hours',
              'faq.help.email.title',
              'faq.help.email.desc',
              'faq.help.email.address',
              'faq.help.email.response',
              'faq.help.chat.title',
              'faq.help.chat.desc',
              'faq.help.chat.button',
              'faq.help.chat.availability',
              'faq.topics.title',
              'faq.topics.subtitle',
            ],
          }),
        });
        if (!res.ok) throw new Error('Failed to load FAQ texts');
        const data = (await res.json()) as Record<string, string>;
        if (!mounted) return;
        if (data['faq.hero.title']) setFaqHeroTitle(data['faq.hero.title']);
        if (data['faq.hero.subtitle']) setFaqHeroSubtitle(data['faq.hero.subtitle']);
        if (data['faq.section.title']) setFaqSectionTitle(data['faq.section.title']);
        if (data['faq.section.subtitle']) setFaqSectionSubtitle(data['faq.section.subtitle']);
        if (data['faq.help.title']) setFaqHelpTitle(data['faq.help.title']);
        if (data['faq.help.subtitle']) setFaqHelpSubtitle(data['faq.help.subtitle']);
        if (data['faq.help.call.title']) setFaqHelpCallTitle(data['faq.help.call.title']);
        if (data['faq.help.call.desc']) setFaqHelpCallDesc(data['faq.help.call.desc']);
        if (data['faq.help.call.number']) setFaqHelpCallNumber(data['faq.help.call.number']);
        if (data['faq.help.call.hours']) setFaqHelpCallHours(data['faq.help.call.hours']);
        if (data['faq.help.email.title']) setFaqHelpEmailTitle(data['faq.help.email.title']);
        if (data['faq.help.email.desc']) setFaqHelpEmailDesc(data['faq.help.email.desc']);
        if (data['faq.help.email.address']) setFaqHelpEmailAddress(data['faq.help.email.address']);
        if (data['faq.help.email.response']) setFaqHelpEmailResponse(data['faq.help.email.response']);
        if (data['faq.help.chat.title']) setFaqHelpChatTitle(data['faq.help.chat.title']);
        if (data['faq.help.chat.desc']) setFaqHelpChatDesc(data['faq.help.chat.desc']);
        if (data['faq.help.chat.button']) setFaqHelpChatButton(data['faq.help.chat.button']);
        if (data['faq.help.chat.availability']) setFaqHelpChatAvailability(data['faq.help.chat.availability']);
        if (data['faq.topics.title']) setFaqTopicsTitle(data['faq.topics.title']);
        if (data['faq.topics.subtitle']) setFaqTopicsSubtitle(data['faq.topics.subtitle']);
      } catch {
        // Keep fallback state
      }
    }
    loadFaqTexts();
    return () => {
      mounted = false;
    };
  }, []);

  const faqAccordion = faqs.map((faq) => ({
    id: faq.id,
    title: faq.question,
    content: faq.answer,
  }));

  const sanitizedPhoneNumber =
    faqHelpCallNumber.replace(/[^+\d]/g, '') || whatsappNumber;
  const mailtoHref = `mailto:${faqHelpEmailAddress}`;
  const whatsappDigits = whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    "Hello! I'm interested in learning more about your Maldives tours."
  )}`;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <motion.section
        className="relative h-96 flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://readdy.ai/api/search-image?query=Travel%20consultation%20scene%20with%20helpful%20advisor%20answering%20questions%2C%20friendly%20customer%20service%2C%20travel%20planning%20assistance%2C%20professional%20guidance%20atmosphere&width=1920&height=600&seq=faq-hero&orientation=landscape')",
        }}
        initial="hidden"
        animate="visible"
        variants={sectionReveal}
      >
        <motion.div
          className="text-center text-white max-w-4xl mx-auto px-4"
          variants={staggerChildren}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
            variants={fadeInUp}
          >
            {faqHeroTitle}
          </motion.h1>
          <motion.p className="text-xl md:text-2xl font-light" variants={fadeInUp}>
            {faqHeroSubtitle}
          </motion.p>
        </motion.div>
      </motion.section>

      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={sectionReveal}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={staggerChildren}>
            <motion.h2
              className="text-4xl font-bold text-slate-800 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
              variants={fadeInUp}
            >
              {faqSectionTitle}
            </motion.h2>
            <motion.p className="text-xl text-gray-600" variants={fadeInUp}>
              {faqSectionSubtitle}
            </motion.p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Accordion items={faqAccordion} allowMultiple />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 bg-stone-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={sectionReveal}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={staggerChildren}>
            <motion.h2
              className="text-4xl font-bold text-slate-800 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
              variants={fadeInUp}
            >
              {faqHelpTitle}
            </motion.h2>
            <motion.p className="text-xl text-gray-600" variants={fadeInUp}>
              {faqHelpSubtitle}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 text-center"
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: '0px 25px 45px rgba(13,148,136,0.15)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-phone-line text-2xl text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">{faqHelpCallTitle}</h3>
              <p className="text-gray-600 mb-4">{faqHelpCallDesc}</p>
              <a
                href={`tel:${sanitizedPhoneNumber}`}
                className="inline-flex items-center justify-center text-lg font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-200"
              >
                {faqHelpCallNumber}
              </a>
              <p className="text-sm text-gray-500 mt-2">{faqHelpCallHours}</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 text-center"
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: '0px 25px 45px rgba(13,148,136,0.15)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-mail-line text-2xl text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">{faqHelpEmailTitle}</h3>
              <p className="text-gray-600 mb-4">{faqHelpEmailDesc}</p>
              <a
                href={mailtoHref}
                className="inline-flex items-center justify-center text-lg font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-200 break-all"
              >
                {faqHelpEmailAddress}
              </a>
              <p className="text-sm text-gray-500 mt-2">{faqHelpEmailResponse}</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 text-center"
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: '0px 25px 45px rgba(13,148,136,0.15)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-chat-3-line text-2xl text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">{faqHelpChatTitle}</h3>
              <p className="text-gray-600 mb-4">{faqHelpChatDesc}</p>
              <button
                type="button"
                onClick={() => window.open(whatsappUrl, '_blank')}
                className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition-colors duration-300 whitespace-nowrap"
              >
                {faqHelpChatButton}
              </button>
              <p className="text-sm text-gray-500 mt-2">{faqHelpChatAvailability}</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={sectionReveal}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={staggerChildren}>
            <motion.h2
              className="text-4xl font-bold text-slate-800 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
              variants={fadeInUp}
            >
              {faqTopicsTitle}
            </motion.h2>
            <motion.p className="text-xl text-gray-600" variants={fadeInUp}>
              {faqTopicsSubtitle}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerChildren}
          >
            {faqTopics.map((topic) => (
              <motion.div
                key={topic.id}
                className="bg-stone-50 rounded-lg p-6 hover:bg-stone-100 transition-all duration-300 cursor-pointer"
                variants={cardVariants}
                whileHover={{ y: -6, boxShadow: '0px 20px 35px rgba(15,118,110,0.12)' }}
                whileTap={{ scale: 0.98 }}
              >
                <i className={`${topic.icon} text-2xl text-teal-600 mb-3`} />
                <h3 className="font-semibold text-slate-800 mb-2">{topic.title}</h3>
                <p className="text-gray-600 text-sm">{topic.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
