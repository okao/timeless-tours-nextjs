'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Subtle floating animation for hero elements
export function GentleFloat({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Elegant fade-in animation
export function FadeIn({ children, delay = 0, duration = 0.8 }: { 
  children: React.ReactNode; 
  delay?: number; 
  duration?: number; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Smooth scale on hover
export function HoverScale({ children, scale = 1.05 }: { 
  children: React.ReactNode; 
  scale?: number; 
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Elegant text reveal
export function TextReveal({ 
  text, 
  className = "",
  delay = 0 
}: { 
  text: string; 
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {text}
    </motion.span>
  );
}

// Subtle gradient overlay
export function GradientOverlay({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-blue-500/10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Ocean wave effect for backgrounds
export function OceanWave({ children, className = "" }: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
        backgroundSize: '200% 200%',
      }}
    >
      {children}
    </motion.div>
  );
}
