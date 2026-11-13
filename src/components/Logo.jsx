import React from 'react';

export const Logo = () => {
  return (
    <div className="flex items-center space-x-3 cursor-pointer">
      {/* Dynamic Shield M+T Logo Icon */}
      <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10 L85 25 V55 C85 75 50 90 50 90 C50 90 15 75 15 55 V25 L50 10Z" fill="#111827" stroke="#FF6B00" strokeWidth="6" />
        <path d="M30 65 V35 L50 50 L70 35 V65" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 50 V70" stroke="#FF6B00" strokeWidth="6" strokeLinecap="round" />
      </svg>
      
      {/* Brand Text & Tagline */}
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-wider text-white leading-none">
          MEMON <span className="text-brandOrange">TRADERS</span>
        </span>
        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mt-1">
          Tradition of Trust
        </span>
      </div>
    </div>
  );
};