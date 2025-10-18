import React from 'react';

// NHS Logo Component - UK Healthcare
export function NHSLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center`}>
      <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-center">
        <span className="text-blue-600 font-bold text-sm tracking-wider">NHS</span>
      </div>
    </div>
  );
}

// Barclays Logo Component - UK Bank
export function BarclaysLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center`}>
      <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-center">
        <span className="text-blue-700 font-bold text-sm tracking-wider">BARCLAYS</span>
      </div>
    </div>
  );
}

// HSBC Logo Component - UK Bank
export function HSBCLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center`}>
      <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-center">
        <span className="text-red-600 font-bold text-sm tracking-wider">HSBC</span>
      </div>
    </div>
  );
}

// Amazon Logo Component - White version for dark background
export function AmazonLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center`}>
      <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-center">
        <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.325 14.4c0 2.138-.563 3.825-1.688 5.063-1.125 1.238-2.7 1.857-4.725 1.857-2.925 0-4.95-1.913-4.95-4.725 0-2.475 1.8-4.5 5.4-4.5 1.463 0 2.7.338 3.713.788v1.517h2.25zm-2.25 6.075c0-.563-.113-1.013-.338-1.35-.225-.338-.563-.507-1.013-.507-1.013 0-1.575.788-1.575 1.8 0 .9.563 1.688 1.575 1.688.45 0 .788-.17 1.013-.507.225-.338.338-.788.338-1.124z" fill="#232F3E"/>
          <path d="M31.05 21.6h-2.25V13.838c0-1.35-.563-2.025-1.688-2.025-.563 0-1.013.225-1.35.675-.338.45-.507 1.013-.507 1.688V21.6h-2.25V10.8h2.138v1.463c.338-.563.788-1.013 1.35-1.35.563-.338 1.2-.507 1.913-.507 2.138 0 3.207 1.35 3.207 4.05L31.05 21.6z" fill="#232F3E"/>
          <path d="M5.625 23.625c8.55 6.3 20.925 9.675 31.613 9.675 5.288 0 10.238-0.788 14.738-2.138.45-.113.788.225.563.675-3.263 2.7-10.463 4.5-16.65 4.5-11.138 0-22.725-4.05-30.263-11.138-.675-.563 0-1.463.675-1.013L5.625 23.625z" fill="#FF9900"/>
          <path d="M55.125 20.7c1.125-1.463.675-3.375-1.013-3.375h-.338c-.45 0-.788.338-.788.788v.113c0 1.913 1.35 3.488 3.263 3.488.563 0 1.125-.338 1.125-1.013z" fill="#FF9900"/>
        </svg>
      </div>
    </div>
  );
}

// Tesco Logo Component - UK Retailer
export function TescoLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center`}>
      <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-center">
        <span className="text-blue-500 font-bold text-sm tracking-wider">TESCO</span>
      </div>
    </div>
  );
}

// Main Component with NHS, UK Banks, Amazon and UK Companies
export function CompanyLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 max-w-4xl mx-auto opacity-80">
      <NHSLogo />
      <BarclaysLogo />
      <HSBCLogo />
      <AmazonLogo />
      <TescoLogo />
    </div>
  );
}