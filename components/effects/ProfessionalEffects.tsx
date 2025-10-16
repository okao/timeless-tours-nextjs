'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// Professional card hover effect
export function CardHover({ children, className = "" }: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      className={`group ${className}`}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <motion.div
        className="relative overflow-hidden rounded-xl"
        whileHover={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Elegant image reveal
export function ImageReveal({ 
  src, 
  alt, 
  className = "" 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ 
          scale: isLoaded ? 1 : 1.1, 
          opacity: isLoaded ? 1 : 0 
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onLoad={() => setIsLoaded(true)}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </div>
  );
}

// Smooth scroll reveal
export function ScrollReveal({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 30 
      }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Elegant button animation
export function AnimatedButton({ 
  children, 
  className = "",
  onClick 
}: { 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500"
        initial={{ x: "-100%" }}
        whileHover={{ x: "0%" }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Professional text animation
export function AnimatedText({ 
  text, 
  className = "",
  delay = 0 
}: { 
  text: string; 
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');

  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: delay + index * 0.1,
            ease: "easeOut" 
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

// Subtle background animation
export function AnimatedBackground({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        background: [
          "linear-gradient(45deg, #f0f9ff, #e0f2fe, #bae6fd)",
          "linear-gradient(45deg, #e0f2fe, #bae6fd, #7dd3fc)",
          "linear-gradient(45deg, #bae6fd, #7dd3fc, #38bdf8)",
          "linear-gradient(45deg, #7dd3fc, #38bdf8, #0ea5e9)",
        ],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
