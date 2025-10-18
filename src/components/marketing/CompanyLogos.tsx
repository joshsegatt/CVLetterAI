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

// Amazon Logo Component - Simplified version for better visibility
export function AmazonLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center`}>
      <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <span className="text-black font-bold text-sm tracking-wider">amazon</span>
          <div className="w-8 h-0.5 bg-orange-400 rounded-full mt-0.5 relative">
            <div className="absolute -right-1 -top-1 w-2 h-2 border-r-2 border-b-2 border-orange-400 transform rotate-45"></div>
          </div>
        </div>
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