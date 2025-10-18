import React from 'react';

// Google Logo Component - Original colors and design
export function GoogleLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center`}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    </div>
  );
}

// Microsoft Logo Component - Original colors and design
export function MicrosoftLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center`}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
        <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
        <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
        <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
      </svg>
    </div>
  );
}

// Apple Logo Component - Original design
export function AppleLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center`}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#ffffff"/>
      </svg>
    </div>
  );
}

// Amazon Logo Component - Original design
export function AmazonLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center`}>
      <svg width="40" height="32" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.325 9.6c0 1.425-.375 2.55-1.125 3.375-.75.825-1.8 1.238-3.15 1.238-1.95 0-3.3-1.275-3.3-3.15 0-1.65 1.2-3 3.6-3 .975 0 1.8.225 2.475.525V9.6h1.5zm-1.5 4.05c0-.375-.075-.675-.225-.9-.15-.225-.375-.338-.675-.338-.675 0-1.05.525-1.05 1.2 0 .6.375 1.125 1.05 1.125.3 0 .525-.113.675-.338.15-.225.225-.525.225-.749z" fill="#FF9900"/>
        <path d="M20.7 14.4h-1.5V9.225c0-.9-.375-1.35-1.125-1.35-.375 0-.675.15-.9.45-.225.3-.338.675-.338 1.125V14.4h-1.5V7.2h1.425v.975c.225-.375.525-.675.9-.9.375-.225.8-.337 1.275-.337 1.425 0 2.138.9 2.138 2.7L20.7 14.4z" fill="#FF9900"/>
        <path d="M3.75 15.75c5.7 4.2 13.95 6.45 21.075 6.45 3.525 0 6.825-.525 9.825-1.425.3-.075.525.15.375.45-2.175 1.8-6.975 3-11.1 3-7.425 0-15.15-2.7-20.175-7.425-.45-.375 0-.975.45-.675L3.75 15.75z" fill="#FF9900"/>
        <path d="M36.75 13.8c.75-.975.45-2.25-.675-2.25h-.225c-.3 0-.525.225-.525.525v.075c0 1.275.9 2.325 2.175 2.325.375 0 .75-.225.75-.675z" fill="#FF9900"/>
      </svg>
    </div>
  );
}

// Meta Logo Component - Original design
export function MetaLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center`}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12z" fill="#1877F2"/>
      </svg>
    </div>
  );
}

// Main Component with the 5 most famous companies - Clean and Professional
export function CompanyLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 max-w-4xl mx-auto opacity-70">
      <GoogleLogo />
      <MicrosoftLogo />
      <AppleLogo />
      <AmazonLogo />
      <MetaLogo />
    </div>
  );
}