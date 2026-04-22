"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { SERVICES } from '../data/constants';

const ServicesSection: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 2, SERVICES.length));
  };
  return (
    <section className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-['Montserrat',Helvetica] font-semibold text-white text-2xl md:text-3xl lg:text-[40px] leading-tight lg:leading-[56px] text-center mb-12 lg:mb-[104px]">
          Services we offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          {SERVICES.slice(0, visibleCount).map((service, index) => (
            <a href={service.href} key={index} className="block h-full">
              <Card
                className="bg-transparent rounded-2xl hover:bg-white/5 transition-all duration-200 p-[2px] cursor-pointer transform hover:scale-105 h-full"
                style={{
                  background: 'linear-gradient(90deg, var(--primary-accent), #186EB4)'
                }}
              >
                <div className="bg-black rounded-2xl h-full w-full min-h-[220px] flex items-center justify-center">
                  <CardContent className="flex flex-col items-center justify-center gap-3 px-8 py-8 w-full h-full">
                    <Image
                      className="w-16 h-16 mb-4"
                      alt={`${service.title} icon`}
                      src={service.icon}
                      width={64}
                      height={64}
                      draggable={false}
                    />
                    <div className="text-center">
                      <h3 className="font-['Montserrat',Helvetica] font-semibold text-2xl lg:text-3xl leading-tight bg-gradient-to-r from-[var(--primary-accent)] to-[#186EB4] bg-clip-text text-transparent">
                        {service.title}
                      </h3>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </a>
          ))}
        </div>
        {visibleCount < SERVICES.length && (
          <div className="flex justify-center mt-12 lg:mt-[72px]">
            <Button onClick={handleLoadMore} className="bg-[var(--primary-accent)] text-black rounded-lg px-6 lg:px-[30px] py-3 lg:py-[17px] font-['Montserrat',Helvetica] font-bold text-sm lg:text-base tracking-[0.80px] leading-[26.2px] flex items-center gap-2 hover:bg-[var(--primary-accent)]/90 transition-all duration-200 transform hover:scale-105">
              Load More
              <div className="w-[22.79px] h-[13.83px] bg-[url(/vector.svg)] bg-[100%_100%]" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection; 