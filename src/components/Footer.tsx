import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6 px-4 md:px-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8 border-b border-[#222] pb-8">
        <div className="flex flex-col md:flex-row w-full">
          {/* Solutions */}
          <div>
            <h3 className="font-bold text-lg mb-4">Solutions</h3>
            <ul className="space-y-2 text-sm">
              <li>Application Services</li>
              <li>Security FireWalls</li>
              <li>Cloud Services</li>
            </ul>
          </div>
          {/* Company */}
          <div className="md:ml-16 mt-8 md:mt-0">
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Contact Us</li>
            </ul>
          </div>
          {/* Social Icons */}
          <div className="flex items-end md:items-center justify-end w-full md:w-auto mt-8 md:mt-0 ml-auto">
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="hover:text-[var(--primary-accent)] transition-colors">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Telegram" className="hover:text-[var(--primary-accent)] transition-colors">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2l-7.5 20.5a1 1 0 0 1-1.9-.1l-2.2-7.2-7.2-2.2a1 1 0 0 1-.1-1.9L22 2z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-[var(--primary-accent)] transition-colors">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="3"/><path d="M17.5 6.5h.01"/></svg>
              </a>
              <a href="#" aria-label="Other" className="hover:text-[var(--primary-accent)] transition-colors">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center pt-6 text-xs text-gray-400">
        <span>© 2024 All Rights Reserved</span>
      </div>
    </footer>
  );
};

export default Footer; 