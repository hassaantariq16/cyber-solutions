"use client";

import React, { useState, useEffect } from 'react';
import { AvatarRoot, AvatarFallback, AvatarImage } from './ui/avatar';
import { TESTIMONIALS } from '../data/constants';

export const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-8 md:py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-['Montserrat',Helvetica] font-semibold text-white text-2xl md:text-3xl lg:text-[40px] leading-tight lg:leading-[56px] mb-12">
          Customer Testimonials
        </h2>

        <div className="relative">
          {/* Navigation arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[var(--primary-accent)]/20 hover:bg-[var(--primary-accent)]/40 rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6 text-[var(--primary-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[var(--primary-accent)]/20 hover:bg-[var(--primary-accent)]/40 rounded-full flex items-center justify-center transition-colors"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6 text-[var(--primary-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Testimonial content */}
          <div className="px-16">
            <AvatarRoot className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-8">
              <AvatarImage src={TESTIMONIALS[currentTestimonial].avatar} alt={TESTIMONIALS[currentTestimonial].name} />
              <AvatarFallback className="bg-[var(--primary-accent)] text-black">
                {TESTIMONIALS[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </AvatarRoot>

            <div className="min-h-[200px] flex flex-col justify-center">
              <blockquote className="font-['Lato',Helvetica] font-normal text-lg md:text-xl lg:text-2xl leading-relaxed text-[#d7d7d7] mb-8 italic">
                "{TESTIMONIALS[currentTestimonial].quote}"
              </blockquote>

              <h3 className="font-['Lato',Helvetica] font-bold text-white text-xl md:text-2xl lg:text-[32px] leading-tight lg:leading-[44.8px]">
                {TESTIMONIALS[currentTestimonial].name}
              </h3>
              <p className="font-['Lato',Helvetica] font-light text-white text-lg md:text-xl lg:text-2xl leading-relaxed lg:leading-[33.6px] mt-2">
                {TESTIMONIALS[currentTestimonial].position}
              </p>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-4 h-4 rounded-full transition-colors ${
                  index === currentTestimonial ? "bg-[var(--primary-accent)]" : "bg-[var(--primary-accent)]/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 