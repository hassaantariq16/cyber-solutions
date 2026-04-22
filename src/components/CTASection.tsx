"use client";

import React from 'react';

export const CTASection: React.FC = () => {
  return (
    <section className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-12" style={{background: 'linear-gradient(90deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'}}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Heading */}
        <div className="w-full md:w-1/2 text-left">
          <h2 className="font-['Montserrat',Helvetica] font-bold text-white text-2xl md:text-3xl lg:text-4xl leading-tight">
            How to choose<br />cybersecurity<br />solution
          </h2>
        </div>
        {/* Right: Text and Buttons */}
        <div className="w-full md:w-1/2 flex flex-col items-start md:items-end gap-4">
          <p className="font-['Lato',Helvetica] font-normal text-white text-base md:text-lg mb-2 md:mb-4 text-right">
            Having difficulties choosing the right solution for your business?
          </p>
          <div className="flex flex-row gap-3">
            <button className="bg-cyan-400 text-black font-['Montserrat',Helvetica] font-semibold px-6 py-2 rounded hover:bg-cyan-300 transition-all duration-200 transform hover:scale-105 text-xs md:text-sm">
              BOOK AN APPOINTMENT
            </button>
            <button className="border border-cyan-400 text-cyan-400 font-['Montserrat',Helvetica] px-6 py-2 rounded hover:bg-cyan-600 hover:text-white transition-all duration-200 transform hover:scale-105 text-xs md:text-sm">
              TALK WITH US
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}; 