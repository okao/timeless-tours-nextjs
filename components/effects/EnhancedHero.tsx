'use client';

import { motion } from 'framer-motion';
import { GentleFloat, FadeIn, GradientOverlay } from './ElegantEffects';
import { ParallaxLayer } from './FloatingElements';

interface EnhancedHeroProps {
  children: React.ReactNode;
  backgroundImage?: string;
  className?: string;
}

export default function EnhancedHero({ 
  children, 
  backgroundImage, 
  className = "" 
}: EnhancedHeroProps) {
  return (
    <section className={`relative h-screen overflow-hidden ${className}`}>
      {/* Background Image with Parallax */}
      <ParallaxLayer speed={0.3} className="absolute inset-0">
        {backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
      </ParallaxLayer>

      {/* Animated Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2), rgba(0,0,0,0.5))",
            "linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.4), rgba(0,0,0,0.3))",
            "linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2), rgba(0,0,0,0.5))",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle floating elements */}
      <GentleFloat delay={0}>
        <div className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full" />
      </GentleFloat>
      <GentleFloat delay={1}>
        <div className="absolute top-40 right-20 w-3 h-3 bg-teal-300/30 rounded-full" />
      </GentleFloat>
      <GentleFloat delay={2}>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-blue-300/40 rounded-full" />
      </GentleFloat>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        {children}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
