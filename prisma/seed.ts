import { Prisma, PrismaClient } from '@prisma/client';
import { tours } from '../mocks/tours';

const prisma = new PrismaClient();

async function main() {
  // Languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'it', name: 'Italiano' },
    { code: 'es', name: 'Español' },
  ];
  await prisma.language.createMany({ data: languages, skipDuplicates: true });

  console.log('Languages created ===========================================');

  // Remove testimonials from navigation
  await prisma.navigation.deleteMany({
    where: { key: 'testimonials' }
  });

  // Navigation
  const navItems = [
    { key: 'home', path: '/', position: 1, isCta: false, label: 'Home' },
    { key: 'tours', path: '/tours', position: 2, isCta: false, label: 'Tours' },
    { key: 'about', path: '/about', position: 3, isCta: false, label: 'About' },
    // { key: 'testimonials', path: '/testimonials', position: 4, isCta: false, label: 'Testimonials' },
    { key: 'faq', path: '/faq', position: 4, isCta: false, label: 'FAQ' },
    { key: 'contact', path: '/contact', position: 5, isCta: false, label: 'Contact' },
    { key: 'book_now', path: '/contact', position: 6, isCta: true, label: 'Book Now' },
  ];
  for (const n of navItems) {
    const nav = await prisma.navigation.upsert({
      where: { key: n.key },
      create: { key: n.key, path: n.path, position: n.position, isCta: n.isCta },
      update: { path: n.path, position: n.position, isCta: n.isCta },
    });
    await prisma.navigationI18n.upsert({
      where: { navId_langCode: { navId: nav.id, langCode: 'en' } },
      create: { navId: nav.id, langCode: 'en', label: n.label },
      update: { label: n.label },
    });
  }

  console.log('Navigation items created ===========================================');

  // Hero slides
  const heroImages = [
    "https://readdy.ai/api/search-image?query=Beautiful%20Maldives%20beach%20with%20palm%20trees%20swaying%20over%20crystal%20clear%20blue%20water%2C%20white%20sand%2C%20tropical%20paradise%2C%20peaceful%20serenity%2C%20golden%20hour%20lighting%2C%20professional%20travel%20photography&width=1920&height=1080&seq=hero-maldives-2&orientation=landscape",
    "https://readdy.ai/api/search-image?query=Maldives%20underwater%20coral%20reef%20with%20colorful%20tropical%20fish%2C%20snorkeling%20paradise%2C%20crystal%20clear%20water%2C%20vibrant%20marine%20life%2C%20tropical%20diving%20destination%2C%20professional%20underwater%20photography&width=1920&height=1080&seq=hero-maldives-3&orientation=landscape",
    "https://readdy.ai/api/search-image?query=Traditional%20Maldivian%20dhoni%20boat%20sailing%20on%20calm%20turquoise%20waters%20at%20sunset%2C%20golden%20hour%20%2C%20peaceful%20ocean%2C%20tropical%20paradise%2C%20romantic%20atmosphere%2C%20professional%20travel%20photography&width=1920&height=1080&seq=hero-maldives-4&orientation=landscape",
    "https://readdy.ai/api/search-image?query=Maldives%20sandbank%20surrounded%20by%20crystal%20clear%20turquoise%20water%2C%20pristine%20white%20sand%2C%20tropical%20paradise%2C%20aerial%20view%2C%20perfect%20beach%20destination%2C%20professional%20travel%20photography&width=1920&height=1080&seq=hero-maldives-5&orientation=landscape"
  ];
  await prisma.heroSlide.deleteMany();
  await prisma.heroSlide.createMany({ data: heroImages.map((image, i) => ({ image, position: i + 1 })) });

  console.log('Hero slides created ===========================================');

  // Minimal texts (EN)
  const texts = [
    { key: 'navbar.home', context: 'Navbar label', value: 'Home' },
    { key: 'navbar.tours', context: 'Navbar label', value: 'Tours' },
    { key: 'navbar.about', context: 'Navbar label', value: 'About' },
    { key: 'navbar.testimonials', context: 'Navbar label', value: 'Testimonials' },
    { key: 'navbar.faq', context: 'Navbar label', value: 'FAQ' },
    { key: 'navbar.contact', context: 'Navbar label', value: 'Contact' },
    { key: 'navbar.book', context: 'Navbar label', value: 'Book Now' },
    { key: 'footer.copyright', context: 'Footer', value: '© Timeless Tours' },
    { key: 'hero.title', context: 'Home hero title', value: 'Explore the Unforgettable Maldives' },
    { key: 'hero.subtitle', context: 'Home hero subtitle', value: 'Discover pristine islands, crystal waters, and thrilling water sports adventures' },
    { key: 'hero.cta', context: 'Home hero button', value: 'Explore Tours' },
    { key: 'about.title', context: 'Home about title', value: 'Welcome to Paradise' },
    { key: 'about.body', context: 'Home about body', value: 'Timeless Tours Maldives specializes in creating unforgettable experiences across the pristine islands of the Maldives. From luxury resort visits to authentic local island adventures, we bring you the very best of tropical paradise with personalized service and deep local knowledge.' },
    { key: 'featured.title', context: 'Home featured title', value: 'Featured Experiences' },
    { key: 'featured.subtitle', context: 'Home featured subtitle', value: 'Discover our most popular Maldivian adventures' },
    { key: 'featured.button', context: 'Home featured button', value: 'More Info' },
    { key: 'why.title', context: 'Home why choose title', value: 'Why Choose Timeless Tours' },
    { key: 'why.subtitle', context: 'Home why choose subtitle', value: 'Experience the Maldives like never before' },
    { key: 'why.expertise.title', context: 'Why choose expertise title', value: 'Local Expertise' },
    { key: 'why.expertise.desc', context: 'Why choose expertise description', value: 'Deep knowledge of hidden gems and authentic Maldivian experiences' },
    { key: 'why.safety.title', context: 'Why choose safety title', value: 'Safety First' },
    { key: 'why.safety.desc', context: 'Why choose safety description', value: 'Certified guides and equipment for worry‑free adventures' },
    { key: 'why.service.title', context: 'Why choose service title', value: 'Personalized Service' },
    { key: 'why.service.desc', context: 'Why choose service description', value: 'Tailored experiences to create your perfect Maldivian getaway' },
    { key: 'testimonials.title', context: 'Home testimonials title', value: 'What Our Guests Say' },
    { key: 'cta.title', context: 'Home CTA title', value: 'Ready for Your Maldivian Adventure?' },
    { key: 'cta.subtitle', context: 'Home CTA subtitle', value: 'Let us create unforgettable memories in paradise' },
    { key: 'cta.button', context: 'Home CTA button', value: 'Plan Your Adventure' },
    { key: 'footer.company', context: 'Footer company name', value: 'Timeless Tours Maldives' },
    { key: 'footer.description', context: 'Footer company description', value: 'Creating unforgettable Maldivian experiences that connect you with pristine coral reefs, authentic island culture, and the natural beauty of our tropical paradise.' },
    { key: 'footer.quicklinks', context: 'Footer quick links title', value: 'Quick Links' },
    { key: 'footer.contact', context: 'Footer contact title', value: 'Contact Info' },
    { key: 'footer.newsletter', context: 'Footer newsletter title', value: 'Newsletter' },
    { key: 'footer.newsletter.desc', context: 'Footer newsletter description', value: 'Subscribe to get Maldivian travel tips and exclusive island experiences.' },
    { key: 'footer.newsletter.placeholder', context: 'Footer newsletter placeholder', value: 'Your email address' },
    { key: 'footer.newsletter.button', context: 'Footer newsletter button', value: 'Subscribe' },
    { key: 'footer.copyright', context: 'Footer copyright', value: '© 2024 Timeless Tours Maldives. All rights reserved.' },
    // About page content
    { key: 'about.hero.title', context: 'About hero title', value: 'About Timeless Tours' },
    { key: 'about.hero.subtitle', context: 'About hero subtitle', value: 'Your gateway to authentic Maldivian experiences' },
    { key: 'about.story.title', context: 'About story title', value: 'Our Story' },
    { key: 'about.story.para1', context: 'About story paragraph 1', value: 'Founded in the heart of Malé, Timeless Tours Maldives was born from a passion for sharing the untouched beauty and rich culture of our island nation. We believe that travel should be more than just visiting places – it should be about creating connections, understanding cultures, and making memories that last a lifetime.' },
    { key: 'about.story.para2', context: 'About story paragraph 2', value: 'Our team of local experts brings decades of combined experience in hospitality and marine adventures, ensuring every guest experiences the authentic spirit of the Maldives while enjoying the highest standards of safety and comfort.' },
    { key: 'about.team.title', context: 'About team title', value: 'Meet Our Team' },
    { key: 'about.team.subtitle', context: 'About team subtitle', value: 'Passionate locals dedicated to sharing the beauty of the Maldives' },
    { key: 'about.values.title', context: 'About values title', value: 'Our Values' },
    { key: 'about.values.subtitle', context: 'About values subtitle', value: 'The principles that guide everything we do' },
    { key: 'about.promise.title', context: 'About promise title', value: 'Our Promise to You' },
    { key: 'about.promise.sustainable.title', context: 'Promise title', value: 'Sustainable Tourism' },
    { key: 'about.promise.sustainable.desc', context: 'Promise description', value: 'We\'re committed to responsible tourism that benefits local communities and preserves our pristine marine environment.' },
    { key: 'about.promise.comfort.title', context: 'Promise title', value: 'Comfort & Luxury' },
    { key: 'about.promise.comfort.desc', context: 'Promise description', value: 'Every detail is carefully planned to ensure your comfort while maintaining the authentic spirit of the Maldives.' },
    { key: 'about.promise.experiences.title', context: 'Promise title', value: 'Unforgettable Experiences' },
    { key: 'about.promise.experiences.desc', context: 'Promise description', value: 'We create moments that will stay with you long after you leave our beautiful islands.' },
    
    // Contact page texts
    { key: 'contact.hero.title', context: 'Contact hero title', value: 'Get In Touch' },
    { key: 'contact.hero.subtitle', context: 'Contact hero subtitle', value: 'Ready to plan your perfect Maldivian adventure?' },
    { key: 'contact.form.title', context: 'Contact form title', value: 'Plan Your Adventure' },
    { key: 'contact.form.name.label', context: 'Form name label', value: 'Full Name' },
    { key: 'contact.form.name.placeholder', context: 'Form name placeholder', value: 'Your full name' },
    { key: 'contact.form.email.label', context: 'Form email label', value: 'Email Address' },
    { key: 'contact.form.email.placeholder', context: 'Form email placeholder', value: 'your.email@example.com' },
    { key: 'contact.form.phone.label', context: 'Form phone label', value: 'Phone Number' },
    { key: 'contact.form.phone.placeholder', context: 'Form phone placeholder', value: '+1 (555) 123-4567' },
    { key: 'contact.form.tour.label', context: 'Form tour label', value: 'Tour of Interest' },
    { key: 'contact.form.tour.placeholder', context: 'Form tour placeholder', value: 'Select a tour' },
    { key: 'contact.form.message.label', context: 'Form message label', value: 'Message' },
    { key: 'contact.form.message.placeholder', context: 'Form message placeholder', value: 'Tell us about your dream Maldives experience...' },
    { key: 'contact.form.submit', context: 'Form submit button', value: 'Send Message' },
    { key: 'contact.form.success.title', context: 'Success message title', value: 'Thank You!' },
    { key: 'contact.form.success.message', context: 'Success message text', value: 'We\'ve received your message and will get back to you within 24 hours.' },
    { key: 'contact.info.title', context: 'Contact info title', value: 'Contact Information' },
    { key: 'contact.info.phone.title', context: 'Phone section title', value: 'Phone' },
    { key: 'contact.info.phone.number', context: 'Phone number', value: '+960 9990377' },
    { key: 'contact.info.phone.desc', context: 'Phone description', value: 'Available 24/7 for emergencies' },
    { key: 'contact.info.email.title', context: 'Email section title', value: 'Email' },
    { key: 'contact.info.email.address', context: 'Email address', value: 'info@timelesstours.mv' },
    { key: 'contact.info.email.desc', context: 'Email description', value: 'We respond within 24 hours' },
    { key: 'contact.info.whatsapp.title', context: 'WhatsApp section title', value: 'WhatsApp' },
    { key: 'contact.info.whatsapp.number', context: 'WhatsApp number', value: '+960 7778899' },
    { key: 'contact.info.whatsapp.desc', context: 'WhatsApp description', value: 'Quick responses and booking' },
    { key: 'contact.info.location.title', context: 'Location section title', value: 'Location' },
    { key: 'contact.info.location.address', context: 'Location address', value: 'Marine Drive, Malé 20026, Maldives' },
    { key: 'contact.info.location.desc', context: 'Location description', value: 'Visit our office in the capital' },
    
    // Testimonials page texts
    { key: 'testimonials.hero.title', context: 'Testimonials hero title', value: 'Traveler Stories' },
    { key: 'testimonials.hero.subtitle', context: 'Testimonials hero subtitle', value: 'Real experiences from our valued travelers' },
    { key: 'testimonials.featured.title', context: 'Featured testimonials title', value: 'What Our Travelers Say' },
    { key: 'testimonials.featured.subtitle', context: 'Featured testimonials subtitle', value: 'Discover why thousands of travelers choose Timeless Tours for their most important journeys' },
    { key: 'testimonials.more.title', context: 'More testimonials title', value: 'More Traveler Reviews' },
    { key: 'testimonials.more.subtitle', context: 'More testimonials subtitle', value: 'Join thousands of satisfied travelers who have experienced the Timeless Tours difference' },
    { key: 'testimonials.stats.title', context: 'Statistics title', value: 'Trusted by Thousands' },
    { key: 'testimonials.stats.subtitle', context: 'Statistics subtitle', value: 'Our commitment to excellence speaks for itself' },
    { key: 'testimonials.stats.travelers', context: 'Happy travelers stat', value: 'Happy Travelers' },
    { key: 'testimonials.stats.rating', context: 'Average rating stat', value: 'Average Rating' },
    { key: 'testimonials.stats.destinations', context: 'Destinations stat', value: 'Destinations' },
    { key: 'testimonials.stats.recommend', context: 'Recommendation stat', value: 'Would Recommend' },
    { key: 'testimonials.cta.title', context: 'CTA title', value: 'Ready to Create Your Own Story?' },
    { key: 'testimonials.cta.subtitle', context: 'CTA subtitle', value: 'Join thousands of satisfied travelers and start planning your unforgettable journey today.' },
    { key: 'testimonials.cta.browse', context: 'Browse tours button', value: 'Browse Tours' },
    { key: 'testimonials.cta.contact', context: 'Contact us button', value: 'Contact Us' },
    
    // FAQ page texts
    { key: 'faq.hero.title', context: 'FAQ hero title', value: 'Frequently Asked Questions' },
    { key: 'faq.hero.subtitle', context: 'FAQ hero subtitle', value: 'Everything you need to know about traveling with us' },
    { key: 'faq.section.title', context: 'FAQ section title', value: 'Common Questions' },
    { key: 'faq.section.subtitle', context: 'FAQ section subtitle', value: 'Find answers to the most frequently asked questions about our tours and services' },
    { key: 'faq.help.title', context: 'Help section title', value: 'Still Have Questions?' },
    { key: 'faq.help.subtitle', context: 'Help section subtitle', value: 'Our travel experts are here to help you plan the perfect journey' },
    { key: 'faq.help.call.title', context: 'Call us title', value: 'Call Us' },
    { key: 'faq.help.call.desc', context: 'Call us description', value: 'Speak directly with our travel experts' },
    { key: 'faq.help.call.number', context: 'Call us number', value: '+1 (555) 123-4567' },
    { key: 'faq.help.call.hours', context: 'Call us hours', value: 'Mon-Fri: 9AM-6PM EST' },
    { key: 'faq.help.email.title', context: 'Email us title', value: 'Email Us' },
    { key: 'faq.help.email.desc', context: 'Email us description', value: 'Get detailed answers to your questions' },
    { key: 'faq.help.email.address', context: 'Email us address', value: 'info@timelesstours.com' },
    { key: 'faq.help.email.response', context: 'Email us response time', value: 'Response within 24 hours' },
    { key: 'faq.help.chat.title', context: 'Live chat title', value: 'Live Chat' },
    { key: 'faq.help.chat.desc', context: 'Live chat description', value: 'Instant support for quick questions' },
    { key: 'faq.help.chat.button', context: 'Live chat button', value: 'Start Chat' },
    { key: 'faq.help.chat.availability', context: 'Live chat availability', value: 'Available 24/7' },
    { key: 'faq.topics.title', context: 'Popular topics title', value: 'Popular Help Topics' },
    { key: 'faq.topics.subtitle', context: 'Popular topics subtitle', value: 'Quick access to the information you need most' },
    
    // Tour detail page texts
    { key: 'tour.notFound.title', context: 'Tour not found title', value: 'Tour Not Found' },
    { key: 'tour.notFound.back', context: 'Back to tours link', value: 'Back to Tours' },
    { key: 'tour.overview.title', context: 'Tour overview title', value: 'Tour Overview' },
    { key: 'tour.inclusions.title', context: 'What\'s included title', value: 'What\'s Included' },
    { key: 'tour.exclusions.title', context: 'What\'s not included title', value: 'What\'s Not Included' },
    { key: 'tour.itinerary.title', context: 'Itinerary title', value: 'Detailed Itinerary' },
    { key: 'tour.itinerary.day', context: 'Day label', value: 'Day' },
    { key: 'tour.gallery.title', context: 'Photo gallery title', value: 'Photo Gallery' },
    { key: 'tour.price.perPerson', context: 'Price per person', value: 'per person' },
    { key: 'tour.booking.button', context: 'Book tour button', value: 'Book This Tour' },
    { key: 'tour.details.duration', context: 'Duration label', value: 'Duration' },
    { key: 'tour.details.groupSize', context: 'Group size label', value: 'Group Size' },
    { key: 'tour.details.maxPeople', context: 'Max people text', value: 'Max 12 people' },
    { key: 'tour.details.languages', context: 'Languages label', value: 'Languages' },
    { key: 'tour.details.languageList', context: 'Language list', value: 'English, Spanish' },
    { key: 'tour.details.difficulty', context: 'Difficulty label', value: 'Difficulty' },
    { key: 'tour.details.difficultyLevel', context: 'Difficulty level', value: 'Moderate' },
    { key: 'tour.help.title', context: 'Need help title', value: 'Need Help?' },
    { key: 'tour.booking.success', context: 'Booking success message', value: 'Thank you for your booking inquiry! We will contact you within 24 hours.' },
    { key: 'tour.booking.error', context: 'Booking error message', value: 'Something went wrong. Please try again.' },
    { key: 'tour.booking.form.title', context: 'Booking form title', value: 'Book Your Adventure' },
    { key: 'tour.booking.form.subtitle', context: 'Booking form subtitle', value: 'Fill out the form below and we\'ll get back to you within 24 hours' },
    { key: 'tour.booking.form.firstName', context: 'First name label', value: 'First Name' },
    { key: 'tour.booking.form.lastName', context: 'Last name label', value: 'Last Name' },
    { key: 'tour.booking.form.email', context: 'Email label', value: 'Email' },
    { key: 'tour.booking.form.phone', context: 'Phone label', value: 'Phone' },
    { key: 'tour.booking.form.travelers', context: 'Travelers label', value: 'Number of Travelers' },
    { key: 'tour.booking.form.travelers.1', context: '1 person option', value: '1 Person' },
    { key: 'tour.booking.form.travelers.2', context: '2 people option', value: '2 People' },
    { key: 'tour.booking.form.travelers.3', context: '3 people option', value: '3 People' },
    { key: 'tour.booking.form.travelers.4', context: '4 people option', value: '4 People' },
    { key: 'tour.booking.form.travelers.5', context: '5+ people option', value: '5+ People' },
    { key: 'tour.booking.form.date', context: 'Travel date label', value: 'Preferred Travel Date' },
    { key: 'tour.booking.form.message', context: 'Message label', value: 'Special Requests or Questions' },
    { key: 'tour.booking.form.messagePlaceholder', context: 'Message placeholder', value: 'Tell us about any dietary restrictions, accessibility needs, or special occasions...' },
    { key: 'tour.booking.form.maxChars', context: 'Max characters text', value: 'Maximum 500 characters' },
    { key: 'tour.booking.form.submit', context: 'Submit button', value: 'Submit Booking Request' },
    { key: 'tour.related.title', context: 'Related tours title', value: 'More Tours in' },
    { key: 'tour.related.viewDetails', context: 'View details button', value: 'View Details' }
  ];
  for (const t of texts) {
    const text = await prisma.text.upsert({
      where: { key: t.key },
      create: { key: t.key, context: t.context },
      update: { context: t.context },
    });
    await prisma.translation.upsert({
      where: { textId_langCode: { textId: text.id, langCode: 'en' } },
      create: { textId: text.id, langCode: 'en', value: t.value },
      update: { value: t.value },
    });
  }

  console.log('Minimal texts created ===========================================');

  // Tours (EN baseline content)
  await prisma.tour.deleteMany();
  for (const tour of tours) {
    const createdTour = await prisma.tour.create({
      data: {
        id: tour.id,
        destination: tour.destination,
        duration: tour.duration,
        price: tour.price !== undefined && tour.price !== null ? new Prisma.Decimal(tour.price) : null,
        type: tour.type,
        image: tour.image,
      },
    });

    await prisma.tourI18n.upsert({
      where: { tourId_langCode: { tourId: createdTour.id, langCode: 'en' } },
      create: {
        tourId: createdTour.id,
        langCode: 'en',
        title: tour.title,
        shortDescription: tour.shortDescription,
        fullDescription: tour.fullDescription,
      },
      update: {
        title: tour.title,
        shortDescription: tour.shortDescription,
        fullDescription: tour.fullDescription,
      },
    });
  }

  // Team Members
  const teamMembers = [
    {
      name: 'Ahmed Hassan',
      role: 'Founder & Marine Guide',
      bio: 'Born and raised in Malé, Ahmed has over 15 years of experience in marine tourism and is passionate about marine conservation.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20Maldivian%20male%20tour%20guide%2C%20friendly%20smile%2C%20traditional%20island%20background%2C%20tourism%20professional%2C%20authentic%20local%20person%2C%20warm%20personality%2C%20tropical%20setting&width=300&height=300&seq=team-ahmed-1&orientation=squarish',
      position: 1,
    },
    {
      name: 'Fatima Ali',
      role: 'Cultural Experience Manager',
      bio: 'Fatima specializes in authentic cultural experiences and has deep connections with local island communities throughout the Maldives.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20Maldivian%20female%20hospitality%20manager%2C%20warm%20smile%2C%20traditional%20island%20background%2C%20tourism%20professional%2C%20authentic%20local%20person%2C%20welcoming%20personality%2C%20tropical%20setting&width=300&height=300&seq=team-fatima-1&orientation=squarish',
      position: 2,
    },
    {
      name: 'Ibrahim Mohamed',
      role: 'Dive Master & Safety Coordinator',
      bio: "A certified PADI instructor with expertise in the Maldives' best dive sites and marine life encounters.",
      image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20Maldivian%20male%20dive%20instructor%2C%20confident%20smile%2C%20ocean%20background%2C%20scuba%20diving%20professional%2C%20authentic%20local%20person%2C%20adventurous%20personality%2C%20marine%20setting&width=300&height=300&seq=team-ibrahim-1&orientation=squarish',
      position: 3,
    },
  ];
  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({ data: teamMembers });

  // Company Values
  const companyValues = [
    {
      title: 'Sustainability',
      description: 'Protecting our marine environment for future generations',
      icon: 'ri-leaf-line',
      position: 1,
    },
    {
      title: 'Authenticity',
      description: 'Genuine experiences that showcase real Maldivian culture',
      icon: 'ri-heart-line',
      position: 2,
    },
    {
      title: 'Safety',
      description: 'Your safety and comfort are our top priorities',
      icon: 'ri-shield-check-line',
      position: 3,
    },
    {
      title: 'Excellence',
      description: 'Exceeding expectations in every aspect of your journey',
      icon: 'ri-star-line',
      position: 4,
    },
  ];
  await prisma.companyValue.deleteMany();
  await prisma.companyValue.createMany({ data: companyValues });

  // FAQ entries
  const faqData = [
    {
      question: 'What is included in the tour packages?',
      answer:
        'Our tour packages typically include speedboat or dhoni transfers, snorkeling equipment, guided tours, meals as specified, and entrance fees. Specific inclusions vary by tour and are clearly listed on each tour page. Resort transfers from Malé are generally included.',
      position: 1,
    },
    {
      question: 'How far in advance should I book?',
      answer:
        'We recommend booking at least 1-2 weeks in advance, especially during peak season (December to April). However, we can often accommodate last-minute bookings depending on availability. Early booking ensures better boat availability and weather conditions.',
      position: 2,
    },
    {
      question: 'What is your cancellation policy?',
      answer:
        'Cancellations made 48+ hours before the tour receive a full refund. Cancellations 24-48 hours before are subject to a 50% penalty. Same-day cancellations are non-refundable unless due to weather conditions determined unsafe by our guides.',
      position: 3,
    },
    {
      question: 'Do you provide snorkeling equipment?',
      answer:
        "Yes, we provide high-quality snorkeling equipment including masks, fins, and snorkels for all our marine tours. Equipment is sanitized between uses. If you prefer to bring your own equipment, you're welcome to do so.",
      position: 4,
    },
    {
      question: 'Are the tours suitable for non-swimmers?',
      answer:
        "Many of our tours are suitable for non-swimmers. Island hopping and cultural tours don't require swimming. For marine tours, we provide life jackets and have experienced guides to assist. Please inform us of any swimming concerns when booking.",
      position: 5,
    },
    {
      question: 'What should I bring on the tours?',
      answer:
        "We recommend bringing sunscreen (reef-safe), a hat, sunglasses, swimwear, a towel, and a waterproof bag for your belongings. Underwater cameras are available for rent. We'll provide specific packing lists for each tour type.",
      position: 6,
    },
    {
      question: 'Can you accommodate dietary restrictions?',
      answer:
        'Yes, we can accommodate most dietary restrictions including vegetarian, vegan, and halal requirements. Please inform us of any dietary needs when booking so we can arrange appropriate meals with local restaurants and families.',
      position: 7,
    },
    {
      question: 'What happens if weather affects the tour?',
      answer:
        'Safety is our top priority. If weather conditions are unsafe, we\'ll reschedule your tour or provide a full refund. During monsoon season (May-November), we monitor conditions closely and have alternative indoor cultural activities available.',
      position: 8,
    },
  ];
  await prisma.faq.deleteMany();
  await prisma.faq.createMany({ data: faqData });

  // FAQ Topics
  const faqTopics = [
    {
      title: 'Booking Process',
      description: 'Learn how to book and what to expect',
      icon: 'ri-calendar-line',
      position: 1,
    },
    {
      title: 'Travel Insurance',
      description: 'Protection options for your journey',
      icon: 'ri-shield-check-line',
      position: 2,
    },
    {
      title: 'Travel Documents',
      description: 'Passport, visa, and other requirements',
      icon: 'ri-file-text-line',
      position: 3,
    },
    {
      title: 'Packing Tips',
      description: 'What to bring for your destination',
      icon: 'ri-luggage-cart-line',
      position: 4,
    },
    {
      title: 'Payment Options',
      description: 'Flexible payment plans available',
      icon: 'ri-money-dollar-circle-line',
      position: 5,
    },
    {
      title: 'Group Travel',
      description: 'Special rates for groups of 8 or more',
      icon: 'ri-group-line',
      position: 6,
    },
    {
      title: 'Health & Safety',
      description: 'Our commitment to your wellbeing',
      icon: 'ri-heart-pulse-line',
      position: 7,
    },
    {
      title: 'Customer Support',
      description: '24/7 assistance during your travels',
      icon: 'ri-customer-service-2-line',
      position: 8,
    },
  ];
  await prisma.faqTopic.deleteMany();
  await prisma.faqTopic.createMany({ data: faqTopics });

  // ===== Translations from old_db_api/seed-translations.ts =====
  async function addTranslations(langCode: 'zh' | 'it' | 'es', entries: Array<{ key: string; value: string }>) {
    for (const entry of entries) {
      const text = await prisma.text.upsert({
        where: { key: entry.key },
        create: { key: entry.key, context: '' },
        update: {},
      });
      await prisma.translation.upsert({
        where: { textId_langCode: { textId: text.id, langCode } },
        create: { textId: text.id, langCode, value: entry.value },
        update: { value: entry.value },
      });
    }
  }

  const chineseTranslations = [
    { key: 'navbar.home', value: '首页' },
    { key: 'navbar.tours', value: '旅游' },
    { key: 'navbar.about', value: '关于我们' },
    { key: 'navbar.testimonials', value: '客户评价' },
    { key: 'navbar.faq', value: '常见问题' },
    { key: 'navbar.contact', value: '联系我们' },
    { key: 'navbar.book', value: '立即预订' },
    { key: 'footer.company', value: '永恒之旅' },
    { key: 'footer.description', value: '您的马尔代夫真实体验门户' },
    { key: 'footer.quicklinks', value: '快速链接' },
    { key: 'footer.contact', value: '联系我们' },
    { key: 'footer.newsletter', value: '订阅通讯' },
    { key: 'footer.newsletter.desc', value: '获取最新的旅游优惠和目的地信息' },
    { key: 'footer.newsletter.placeholder', value: '输入您的邮箱地址' },
    { key: 'footer.newsletter.button', value: '订阅' },
    { key: 'footer.copyright', value: '© 2024 永恒之旅。保留所有权利。' },
    { key: 'hero.title', value: '发现马尔代夫的真实魅力' },
    { key: 'hero.subtitle', value: '体验当地文化，探索原始岛屿，创造终生难忘的回忆' },
    { key: 'hero.cta', value: '探索旅游' },
    { key: 'about.title', value: '关于永恒之旅' },
    { key: 'about.body', value: '我们致力于提供真实的马尔代夫体验，让您深入了解当地文化、传统和自然美景。' },
    { key: 'featured.title', value: '精选旅游' },
    { key: 'featured.subtitle', value: '发现我们最受欢迎的马尔代夫体验' },
    { key: 'featured.button', value: '查看所有旅游' },
    { key: 'why.title', value: '为什么选择我们' },
    { key: 'why.subtitle', value: '我们致力于为您提供卓越的旅游体验' },
    { key: 'why.expertise.title', value: '当地专业知识' },
    { key: 'why.expertise.desc', value: '我们的团队由马尔代夫本地人组成，对岛屿、文化和最佳体验有着深入的了解。' },
    { key: 'why.safety.title', value: '安全第一' },
    { key: 'why.safety.desc', value: '您的安全是我们的首要任务。我们提供经过认证的设备和经验丰富的导游。' },
    { key: 'why.service.title', value: '个性化服务' },
    { key: 'why.service.desc', value: '我们根据您的兴趣和需求定制每一次体验，确保难忘的旅程。' },
    { key: 'testimonials.title', value: '客户评价' },
    { key: 'cta.title', value: '准备开始您的马尔代夫冒险？' },
    { key: 'cta.subtitle', value: '立即预订，体验马尔代夫的真实魅力' },
    { key: 'cta.button', value: '开始规划' },
    { key: 'contact.hero.title', value: '联系我们' },
    { key: 'contact.hero.subtitle', value: '准备规划您的完美马尔代夫冒险？' },
    { key: 'contact.form.title', value: '规划您的冒险' },
    { key: 'contact.form.name.label', value: '姓名' },
    { key: 'contact.form.name.placeholder', value: '您的全名' },
    { key: 'contact.form.email.label', value: '邮箱地址' },
    { key: 'contact.form.email.placeholder', value: 'your.email@example.com' },
    { key: 'contact.form.phone.label', value: '电话号码' },
    { key: 'contact.form.phone.placeholder', value: '+1 (555) 123-4567' },
    { key: 'contact.form.tour.label', value: '感兴趣的旅游' },
    { key: 'contact.form.tour.placeholder', value: '选择旅游' },
    { key: 'contact.form.message.label', value: '留言' },
    { key: 'contact.form.message.placeholder', value: '告诉我们您梦想的马尔代夫体验...' },
    { key: 'contact.form.submit', value: '发送消息' },
    { key: 'contact.form.success.title', value: '谢谢！' },
    { key: 'contact.form.success.message', value: '我们已收到您的消息，将在24小时内回复您。' },
    { key: 'contact.info.title', value: '联系信息' },
    { key: 'contact.info.phone.title', value: '电话' },
    { key: 'contact.info.phone.number', value: '+960 9990377' },
    { key: 'contact.info.phone.desc', value: '24/7紧急情况可用' },
    { key: 'contact.info.email.title', value: '邮箱' },
    { key: 'contact.info.email.address', value: 'info@timelesstours.mv' },
    { key: 'contact.info.email.desc', value: '我们24小时内回复' },
    { key: 'contact.info.whatsapp.title', value: 'WhatsApp' },
    { key: 'contact.info.whatsapp.number', value: '+960 7778899' },
    { key: 'contact.info.whatsapp.desc', value: '快速回复和预订' },
    { key: 'contact.info.location.title', value: '位置' },
    { key: 'contact.info.location.address', value: '马尔代夫马累20026海洋大道' },
    { key: 'contact.info.location.desc', value: '访问我们在首都的办公室' },
    { key: 'testimonials.hero.title', value: '旅行者故事' },
    { key: 'testimonials.hero.subtitle', value: '来自我们珍贵旅行者的真实体验' },
    { key: 'testimonials.featured.title', value: '我们的旅行者怎么说' },
    { key: 'testimonials.featured.subtitle', value: '发现为什么成千上万的旅行者选择永恒之旅进行他们最重要的旅程' },
    { key: 'testimonials.more.title', value: '更多旅行者评价' },
    { key: 'testimonials.more.subtitle', value: '加入成千上万体验过永恒之旅差异的满意旅行者' },
    { key: 'testimonials.stats.title', value: '受数千人信赖' },
    { key: 'testimonials.stats.subtitle', value: '我们对卓越的承诺不言而喻' },
    { key: 'testimonials.stats.travelers', value: '满意旅行者' },
    { key: 'testimonials.stats.rating', value: '平均评分' },
    { key: 'testimonials.stats.destinations', value: '目的地' },
    { key: 'testimonials.stats.recommend', value: '会推荐' },
    { key: 'testimonials.cta.title', value: '准备创造您自己的故事？' },
    { key: 'testimonials.cta.subtitle', value: '加入成千上万的满意旅行者，今天开始规划您难忘的旅程。' },
    { key: 'testimonials.cta.browse', value: '浏览旅游' },
    { key: 'testimonials.cta.contact', value: '联系我们' },
    { key: 'faq.hero.title', value: '常见问题' },
    { key: 'faq.hero.subtitle', value: '关于与我们旅行的一切您需要了解的信息' },
    { key: 'faq.section.title', value: '常见问题' },
    { key: 'faq.section.subtitle', value: '找到关于我们旅游和服务的最常见问题的答案' },
    { key: 'faq.help.title', value: '还有问题？' },
    { key: 'faq.help.subtitle', value: '我们的旅游专家在这里帮助您规划完美旅程' },
    { key: 'faq.help.call.title', value: '致电我们' },
    { key: 'faq.help.call.desc', value: '直接与我们的旅游专家交谈' },
    { key: 'faq.help.call.number', value: '+1 (555) 123-4567' },
    { key: 'faq.help.call.hours', value: '周一至周五：上午9点-下午6点（东部时间）' },
    { key: 'faq.help.email.title', value: '发邮件给我们' },
    { key: 'faq.help.email.desc', value: '获得您问题的详细答案' },
    { key: 'faq.help.email.address', value: 'info@timelesstours.com' },
    { key: 'faq.help.email.response', value: '24小时内回复' },
    { key: 'faq.help.chat.title', value: '在线聊天' },
    { key: 'faq.help.chat.desc', value: '快速问题的即时支持' },
    { key: 'faq.help.chat.button', value: '开始聊天' },
    { key: 'faq.help.chat.availability', value: '24/7可用' },
    { key: 'faq.topics.title', value: '热门帮助主题' },
    { key: 'faq.topics.subtitle', value: '快速访问您最需要的信息' },
  ];

  const italianTranslations = [
    { key: 'navbar.home', value: 'Home' },
    { key: 'navbar.tours', value: 'Tour' },
    { key: 'navbar.about', value: 'Chi Siamo' },
    { key: 'navbar.testimonials', value: 'Testimonianze' },
    { key: 'navbar.faq', value: 'FAQ' },
    { key: 'navbar.contact', value: 'Contatti' },
    { key: 'navbar.book', value: 'Prenota Ora' },
    { key: 'footer.company', value: 'Timeless Tours' },
    { key: 'footer.description', value: 'Il vostro portale per esperienze autentiche alle Maldive' },
    { key: 'footer.quicklinks', value: 'Link Rapidi' },
    { key: 'footer.contact', value: 'Contatti' },
    { key: 'footer.newsletter', value: 'Newsletter' },
    { key: 'footer.newsletter.desc', value: 'Ricevi le ultime offerte di viaggio e informazioni sulle destinazioni' },
    { key: 'footer.newsletter.placeholder', value: 'Inserisci il tuo indirizzo email' },
    { key: 'footer.newsletter.button', value: 'Iscriviti' },
    { key: 'footer.copyright', value: '© 2024 Timeless Tours. Tutti i diritti riservati.' },
    { key: 'hero.title', value: 'Scopri la Vera Bellezza delle Maldive' },
    { key: 'hero.subtitle', value: 'Vivi la cultura locale, esplora isole incontaminate, crea ricordi indimenticabili' },
    { key: 'hero.cta', value: 'Esplora i Tour' },
    { key: 'about.title', value: 'Su Timeless Tours' },
    { key: 'about.body', value: 'Siamo dedicati a fornire esperienze autentiche delle Maldive che vi permettono di immergervi nella cultura locale, nelle tradizioni e nella bellezza naturale.' },
    { key: 'featured.title', value: 'Tour in Evidenza' },
    { key: 'featured.subtitle', value: 'Scopri le nostre esperienze maldiviane più popolari' },
    { key: 'featured.button', value: 'Vedi Tutti i Tour' },
    { key: 'why.title', value: 'Perché Sceglierci' },
    { key: 'why.subtitle', value: 'Siamo impegnati a fornirvi un\'esperienza di viaggio eccezionale' },
    { key: 'why.expertise.title', value: 'Esperienza Locale' },
    { key: 'why.expertise.desc', value: 'Il nostro team è composto da maldiviani locali con una profonda conoscenza delle isole, della cultura e delle migliori esperienze.' },
    { key: 'why.safety.title', value: 'Sicurezza Prima' },
    { key: 'why.safety.desc', value: 'La vostra sicurezza è la nostra priorità. Forniamo attrezzature certificate e guide esperte.' },
    { key: 'why.service.title', value: 'Servizio Personalizzato' },
    { key: 'why.service.desc', value: 'Personalizziamo ogni esperienza in base ai vostri interessi e alle vostre esigenze, garantendo un viaggio indimenticabile.' },
    { key: 'testimonials.title', value: 'Testimonianze' },
    { key: 'cta.title', value: 'Pronti a Iniziare la Vostra Avventura alle Maldive?' },
    { key: 'cta.subtitle', value: 'Prenotate ora e sperimentate la vera bellezza delle Maldive' },
    { key: 'cta.button', value: 'Inizia a Pianificare' },
    { key: 'contact.hero.title', value: 'Mettetevi in Contatto' },
    { key: 'contact.hero.subtitle', value: 'Pronti a pianificare la vostra perfetta avventura maldiviana?' },
    { key: 'contact.form.title', value: 'Pianificate la Vostra Avventura' },
    { key: 'contact.form.name.label', value: 'Nome Completo' },
    { key: 'contact.form.name.placeholder', value: 'Il vostro nome completo' },
    { key: 'contact.form.email.label', value: 'Indirizzo Email' },
    { key: 'contact.form.email.placeholder', value: 'your.email@example.com' },
    { key: 'contact.form.phone.label', value: 'Numero di Telefono' },
    { key: 'contact.form.phone.placeholder', value: '+1 (555) 123-4567' },
    { key: 'contact.form.tour.label', value: 'Tour di Interesse' },
    { key: 'contact.form.tour.placeholder', value: 'Seleziona un tour' },
    { key: 'contact.form.message.label', value: 'Messaggio' },
    { key: 'contact.form.message.placeholder', value: 'Raccontateci la vostra esperienza maldiviana ideale...' },
    { key: 'contact.form.submit', value: 'Invia Messaggio' },
    { key: 'contact.form.success.title', value: 'Grazie!' },
    { key: 'contact.form.success.message', value: 'Abbiamo ricevuto il vostro messaggio e vi risponderemo entro 24 ore.' },
    { key: 'contact.info.title', value: 'Informazioni di Contatto' },
    { key: 'contact.info.phone.title', value: 'Telefono' },
    { key: 'contact.info.phone.number', value: '+960 9990377' },
    { key: 'contact.info.phone.desc', value: 'Disponibile 24/7 per emergenze' },
    { key: 'contact.info.email.title', value: 'Email' },
    { key: 'contact.info.email.address', value: 'info@timelesstours.mv' },
    { key: 'contact.info.email.desc', value: 'Rispondiamo entro 24 ore' },
    { key: 'contact.info.whatsapp.title', value: 'WhatsApp' },
    { key: 'contact.info.whatsapp.number', value: '+960 7778899' },
    { key: 'contact.info.whatsapp.desc', value: 'Risposte rapide e prenotazioni' },
    { key: 'contact.info.location.title', value: 'Posizione' },
    { key: 'contact.info.location.address', value: 'Marine Drive, Malé 20026, Maldive' },
    { key: 'contact.info.location.desc', value: 'Visitate il nostro ufficio nella capitale' },
    { key: 'testimonials.hero.title', value: 'Storie di Viaggiatori' },
    { key: 'testimonials.hero.subtitle', value: 'Esperienze reali dai nostri preziosi viaggiatori' },
    { key: 'testimonials.featured.title', value: 'Cosa Dicono i Nostri Viaggiatori' },
    { key: 'testimonials.featured.subtitle', value: 'Scoprite perché migliaia di viaggiatori scelgono Timeless Tours per i loro viaggi più importanti' },
    { key: 'testimonials.more.title', value: 'Altre Recensioni di Viaggiatori' },
    { key: 'testimonials.more.subtitle', value: 'Unitevi a migliaia di viaggiatori soddisfatti che hanno sperimentato la differenza di Timeless Tours' },
    { key: 'testimonials.stats.title', value: 'Fidati da Migliaia' },
    { key: 'testimonials.stats.subtitle', value: 'Il nostro impegno per l\'eccellenza parla da sé' },
    { key: 'testimonials.stats.travelers', value: 'Viaggiatori Felici' },
    { key: 'testimonials.stats.rating', value: 'Valutazione Media' },
    { key: 'testimonials.stats.destinations', value: 'Destinazioni' },
    { key: 'testimonials.stats.recommend', value: 'Raccomanderebbe' },
    { key: 'testimonials.cta.title', value: 'Pronti a Creare la Vostra Storia?' },
    { key: 'testimonials.cta.subtitle', value: 'Unitevi a migliaia di viaggiatori soddisfatti e iniziate oggi a pianificare il vostro viaggio indimenticabile.' },
    { key: 'testimonials.cta.browse', value: 'Sfoglia i Tour' },
    { key: 'testimonials.cta.contact', value: 'Contattaci' },
    { key: 'faq.hero.title', value: 'Domande Frequenti' },
    { key: 'faq.hero.subtitle', value: 'Tutto quello che dovete sapere sui viaggi con noi' },
    { key: 'faq.section.title', value: 'Domande Comuni' },
    { key: 'faq.section.subtitle', value: 'Trovate risposte alle domande più frequenti sui nostri tour e servizi' },
    { key: 'faq.help.title', value: 'Avete Ancora Domande?' },
    { key: 'faq.help.subtitle', value: 'I nostri esperti di viaggio sono qui per aiutarvi a pianificare il viaggio perfetto' },
    { key: 'faq.help.call.title', value: 'Chiamateci' },
    { key: 'faq.help.call.desc', value: 'Parlate direttamente con i nostri esperti di viaggio' },
    { key: 'faq.help.call.number', value: '+1 (555) 123-4567' },
    { key: 'faq.help.call.hours', value: 'Lun-Ven: 9:00-18:00 EST' },
    { key: 'faq.help.email.title', value: 'Scriveteci' },
    { key: 'faq.help.email.desc', value: 'Ricevete risposte dettagliate alle vostre domande' },
    { key: 'faq.help.email.address', value: 'info@timelesstours.com' },
    { key: 'faq.help.email.response', value: 'Risposta entro 24 ore' },
    { key: 'faq.help.chat.title', value: 'Chat Live' },
    { key: 'faq.help.chat.desc', value: 'Supporto istantaneo per domande rapide' },
    { key: 'faq.help.chat.button', value: 'Inizia Chat' },
    { key: 'faq.help.chat.availability', value: 'Disponibile 24/7' },
    { key: 'faq.topics.title', value: 'Argomenti di Aiuto Popolari' },
    { key: 'faq.topics.subtitle', value: 'Accesso rapido alle informazioni di cui avete più bisogno' },
  ];

  const spanishTranslations = [
    { key: 'navbar.home', value: 'Inicio' },
    { key: 'navbar.tours', value: 'Tours' },
    { key: 'navbar.about', value: 'Acerca de' },
    { key: 'navbar.testimonials', value: 'Testimonios' },
    { key: 'navbar.faq', value: 'Preguntas Frecuentes' },
    { key: 'navbar.contact', value: 'Contacto' },
    { key: 'navbar.book', value: 'Reservar Ahora' },
    { key: 'footer.company', value: 'Timeless Tours' },
    { key: 'footer.description', value: 'Su portal para experiencias auténticas en Maldivas' },
    { key: 'footer.quicklinks', value: 'Enlaces Rápidos' },
    { key: 'footer.contact', value: 'Contacto' },
    { key: 'footer.newsletter', value: 'Boletín' },
    { key: 'footer.newsletter.desc', value: 'Reciba las últimas ofertas de viaje e información sobre destinos' },
    { key: 'footer.newsletter.placeholder', value: 'Ingrese su dirección de correo electrónico' },
    { key: 'footer.newsletter.button', value: 'Suscribirse' },
    { key: 'footer.copyright', value: '© 2024 Timeless Tours. Todos los derechos reservados.' },
    { key: 'hero.title', value: 'Descubra la Verdadera Belleza de Maldivas' },
    { key: 'hero.subtitle', value: 'Experimente la cultura local, explore islas pristinas, cree recuerdos inolvidables' },
    { key: 'hero.cta', value: 'Explorar Tours' },
    { key: 'about.title', value: 'Acerca de Timeless Tours' },
    { key: 'about.body', value: 'Estamos dedicados a brindar experiencias auténticas de Maldivas que le permiten sumergirse en la cultura local, tradiciones y belleza natural.' },
    { key: 'featured.title', value: 'Tours Destacados' },
    { key: 'featured.subtitle', value: 'Descubra nuestras experiencias más populares de Maldivas' },
    { key: 'featured.button', value: 'Ver Todos los Tours' },
    { key: 'why.title', value: 'Por Qué Elegirnos' },
    { key: 'why.subtitle', value: 'Estamos comprometidos a brindarle una experiencia de viaje excepcional' },
    { key: 'why.expertise.title', value: 'Experiencia Local' },
    { key: 'why.expertise.desc', value: 'Nuestro equipo está compuesto por maldivos locales con un profundo conocimiento de las islas, cultura y mejores experiencias.' },
    { key: 'why.safety.title', value: 'Seguridad Primero' },
    { key: 'why.safety.desc', value: 'Su seguridad es nuestra prioridad. Proporcionamos equipo certificado y guías experimentadas.' },
    { key: 'why.service.title', value: 'Servicio Personalizado' },
    { key: 'why.service.desc', value: 'Personalizamos cada experiencia según sus intereses y necesidades, garantizando un viaje inolvidable.' },
    { key: 'testimonials.title', value: 'Testimonios' },
    { key: 'cta.title', value: '¿Listo para Comenzar Su Aventura en Maldivas?' },
    { key: 'cta.subtitle', value: 'Reserve ahora y experimente la verdadera belleza de Maldivas' },
    { key: 'cta.button', value: 'Comenzar a Planificar' },
    { key: 'contact.hero.title', value: 'Póngase en Contacto' },
    { key: 'contact.hero.subtitle', value: '¿Listo para planificar su perfecta aventura maldiviana?' },
    { key: 'contact.form.title', value: 'Planifique Su Aventura' },
    { key: 'contact.form.name.label', value: 'Nombre Completo' },
    { key: 'contact.form.name.placeholder', value: 'Su nombre completo' },
    { key: 'contact.form.email.label', value: 'Dirección de Correo Electrónico' },
    { key: 'contact.form.email.placeholder', value: 'your.email@example.com' },
    { key: 'contact.form.phone.label', value: 'Número de Teléfono' },
    { key: 'contact.form.phone.placeholder', value: '+1 (555) 123-4567' },
    { key: 'contact.form.tour.label', value: 'Tour de Interés' },
    { key: 'contact.form.tour.placeholder', value: 'Seleccionar un tour' },
    { key: 'contact.form.message.label', value: 'Mensaje' },
    { key: 'contact.form.message.placeholder', value: 'Cuéntenos sobre su experiencia ideal de Maldivas...' },
    { key: 'contact.form.submit', value: 'Enviar Mensaje' },
    { key: 'contact.form.success.title', value: '¡Gracias!' },
    { key: 'contact.form.success.message', value: 'Hemos recibido su mensaje y le responderemos dentro de 24 horas.' },
    { key: 'contact.info.title', value: 'Información de Contacto' },
    { key: 'contact.info.phone.title', value: 'Teléfono' },
    { key: 'contact.info.phone.number', value: '+960 9990377' },
    { key: 'contact.info.phone.desc', value: 'Disponible 24/7 para emergencias' },
    { key: 'contact.info.email.title', value: 'Correo Electrónico' },
    { key: 'contact.info.email.address', value: 'info@timelesstours.mv' },
    { key: 'contact.info.email.desc', value: 'Respondemos dentro de 24 horas' },
    { key: 'contact.info.whatsapp.title', value: 'WhatsApp' },
    { key: 'contact.info.whatsapp.number', value: '+960 7778899' },
    { key: 'contact.info.whatsapp.desc', value: 'Respuestas rápidas y reservas' },
    { key: 'contact.info.location.title', value: 'Ubicación' },
    { key: 'contact.info.location.address', value: 'Marine Drive, Malé 20026, Maldivas' },
    { key: 'contact.info.location.desc', value: 'Visite nuestra oficina en la capital' },
    { key: 'testimonials.hero.title', value: 'Historias de Viajeros' },
    { key: 'testimonials.hero.subtitle', value: 'Experiencias reales de nuestros valiosos viajeros' },
    { key: 'testimonials.featured.title', value: 'Lo Que Dicen Nuestros Viajeros' },
    { key: 'testimonials.featured.subtitle', value: 'Descubra por qué miles de viajeros eligen Timeless Tours para sus viajes más importantes' },
    { key: 'testimonials.more.title', value: 'Más Reseñas de Viajeros' },
    { key: 'testimonials.more.subtitle', value: 'Únase a miles de viajeros satisfechos que han experimentado la diferencia de Timeless Tours' },
    { key: 'testimonials.stats.title', value: 'Confiado por Miles' },
    { key: 'testimonials.stats.subtitle', value: 'Nuestro compromiso con la excelencia habla por sí mismo' },
    { key: 'testimonials.stats.travelers', value: 'Viajeros Felices' },
    { key: 'testimonials.stats.rating', value: 'Calificación Promedio' },
    { key: 'testimonials.stats.destinations', value: 'Destinos' },
    { key: 'testimonials.stats.recommend', value: 'Recomendaría' },
    { key: 'testimonials.cta.title', value: '¿Listo para Crear Su Propia Historia?' },
    { key: 'testimonials.cta.subtitle', value: 'Únase a miles de viajeros satisfechos y comience a planificar su viaje inolvidable hoy.' },
    { key: 'testimonials.cta.browse', value: 'Explorar Tours' },
    { key: 'testimonials.cta.contact', value: 'Contáctanos' },
    { key: 'faq.hero.title', value: 'Preguntas Frecuentes' },
    { key: 'faq.hero.subtitle', value: 'Todo lo que necesita saber sobre viajar con nosotros' },
    { key: 'faq.section.title', value: 'Preguntas Comunes' },
    { key: 'faq.section.subtitle', value: 'Encuentre respuestas a las preguntas más frecuentes sobre nuestros tours y servicios' },
    { key: 'faq.help.title', value: '¿Todavía Tiene Preguntas?' },
    { key: 'faq.help.subtitle', value: 'Nuestros expertos en viajes están aquí para ayudarle a planificar el viaje perfecto' },
    { key: 'faq.help.call.title', value: 'Llámenos' },
    { key: 'faq.help.call.desc', value: 'Hable directamente con nuestros expertos en viajes' },
    { key: 'faq.help.call.number', value: '+1 (555) 123-4567' },
    { key: 'faq.help.call.hours', value: 'Lun-Vie: 9AM-6PM EST' },
    { key: 'faq.help.email.title', value: 'Envíenos un Correo' },
    { key: 'faq.help.email.desc', value: 'Obtenga respuestas detalladas a sus preguntas' },
    { key: 'faq.help.email.address', value: 'info@timelesstours.com' },
    { key: 'faq.help.email.response', value: 'Respuesta dentro de 24 horas' },
    { key: 'faq.help.chat.title', value: 'Chat en Vivo' },
    { key: 'faq.help.chat.desc', value: 'Soporte instantáneo para preguntas rápidas' },
    { key: 'faq.help.chat.button', value: 'Iniciar Chat' },
    { key: 'faq.help.chat.availability', value: 'Disponibile 24/7' },
    { key: 'faq.topics.title', value: 'Temas de Ayuda Populares' },
    { key: 'faq.topics.subtitle', value: 'Acceso rápido a la información que más necesita' },
  ];

  await addTranslations('zh', chineseTranslations);
  await addTranslations('it', italianTranslations);
  await addTranslations('es', spanishTranslations);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Prisma seed completed.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
