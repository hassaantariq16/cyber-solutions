"use client";

import React from 'react';
import { STATS } from '../data/constants';

const AboutSection: React.FC = () => {
  return (
    <section className="w-full min-h-screen flex flex-col justify-center px-4 md:px-8 lg:px-16 xl:px-24 py-8 md:py-12">
      <div className="max-w-6xl mx-auto text-center">
        <p className="font-[Montserrat] font-normal text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-5xl mx-auto mb-10">
          <span className="text-white">At </span>
          <span className="font-bold text-[#55F4FC]">Ironvelo</span>
          <span className="text-white">, we're dedicated to protecting businesses and individuals from the ever-evolving threats in the digital landscape. With years of experience in the cybersecurity industry, we have honed our expertise to deliver innovative solutions that safeguard your digital assets and maintain your peace of mind.</span>
        </p>
        {/* Stats Section */}
        <div className="w-full rounded-[32px] mt-10 py-8 px-4 bg-[linear-gradient(90deg,_#55F4FC_0%,_#C6F0FF_40%,_#B4F3FF_90%,_#176DB4_100%)] flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
            {STATS.map((stat, index) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <p className="font-['Montserrat',Helvetica] font-extrabold text-black text-5xl md:text-6xl lg:text-7xl tracking-tight mb-2">
                  {stat.value}
                </p>
                <p className="font-['Lato',Helvetica] text-black text-lg md:text-xl lg:text-2xl tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 