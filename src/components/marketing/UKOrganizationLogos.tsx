import React from 'react';

// NHS Logo Component - Simple and Authentic
export function NHSLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center text-surface-400`}>
      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
        NHS
      </div>
    </div>
  );
}

// BBC Logo Component - Simple and Authentic
export function BBCLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center text-surface-400`}>
      <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white font-bold text-xs">
        BBC
      </div>
    </div>
  );
}

// Barclays Logo Component - Simple and Authentic
export function BarclaysLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center text-surface-400`}>
      <div className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center text-white font-bold text-xs">
        B
      </div>
    </div>
  );
}

// HSBC Logo Component - Simple and Authentic
export function HSBCLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center text-surface-400`}>
      <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xs">
        H
      </div>
    </div>
  );
}

// Tesco Logo Component - Simple and Authentic
export function TescoLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center text-surface-400`}>
      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
        T
      </div>
    </div>
  );
}

// Sainsbury's Logo Component - Simple and Authentic
export function SainsburysLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center text-surface-400`}>
      <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center text-white font-bold text-xs">
        S
      </div>
    </div>
  );
}

// BT Logo Component - Simple and Authentic
export function BTLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center text-surface-400`}>
      <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">
        BT
      </div>
    </div>
  );
}

// Rolls Royce Logo Component - Simple and Authentic
export function RollsRoyceLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center text-surface-400`}>
      <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center text-white font-bold text-xs">
        RR
      </div>
    </div>
  );
}

// Main Component with all logos - Simple and Clean
export function UKOrganizationLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 max-w-4xl mx-auto opacity-50">
      <NHSLogo />
      <BBCLogo />
      <BarclaysLogo />
      <HSBCLogo />
      <TescoLogo />
      <SainsburysLogo />
      <BTLogo />
      <RollsRoyceLogo />
    </div>
  );
}