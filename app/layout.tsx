// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Pacifico } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import WhatsAppButton2 from '@/components/feature/WhatsAppButton2';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
});

const pacifico = Pacifico({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pacifico',
});

export const metadata: Metadata = {
  title: 'Timeless Tours Maldives — Explore the Unforgettable',
  description: 'Discover authentic Maldivian experiences with Timeless Tours. Island hopping, snorkeling, manta ray encounters, and cultural tours in the pristine Maldives.',
  keywords: 'Maldives tours, island hopping, snorkeling, manta rays, local islands, Maafushi, Thulusdhoo, sandbank picnic, dolphin cruise, authentic Maldivian culture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${pacifico.variable}`}>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          {children}
          <WhatsAppButton2 />
        </LanguageProvider>
      </body>
    </html>
  );
}