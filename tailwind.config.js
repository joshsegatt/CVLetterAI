import animatePlugin from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './src/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './features/**/*.{ts,tsx,mdx}'
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '3rem',
        xl: '4rem',
        '2xl': '6rem'
      },
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // Premium UK Market Color System - Inspired by Monzo, Revolut, Stripe
        primary: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
          DEFAULT: '#4f46e5',
          foreground: '#ffffff'
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
          DEFAULT: '#22c55e',
          foreground: '#ffffff'
        },
        luxury: {
          50: '#fef7ff',
          100: '#fdeeff',
          200: '#fcdcff',
          300: '#f8b9ff',
          400: '#f085ff',
          500: '#e854f0',
          600: '#d444e0',
          700: '#b128c4',
          800: '#9221a0',
          900: '#771e80',
          950: '#4f0b5a',
          DEFAULT: '#e854f0'
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
          DEFAULT: '#f8fafc',
          muted: '#f1f5f9',
          subtle: '#e2e8f0',
          highlight: '#cbd5e1'
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.8)',
          hover: 'rgba(255, 255, 255, 0.9)',
          border: 'rgba(0, 0, 0, 0.08)',
          'border-hover': 'rgba(0, 0, 0, 0.12)'
        }
      },
      backgroundImage: {
        // Premium UK Market Gradients - Inspired by top fintech brands
        'gradient-brand': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
        'gradient-luxury': 'linear-gradient(135deg, #e854f0 0%, #f97316 50%, #eab308 100%)',
        'gradient-professional': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #374151 100%)',
        'gradient-mesh': 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
        'glass': '20px'
      },
      boxShadow: {
        // Apple-Style Shadow System
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 40px rgba(102, 126, 234, 0.4)',
        'glow-lg': '0 0 60px rgba(102, 126, 234, 0.6)',
        'card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px'
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'],
        display: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'Monaco', 'monospace']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }]
      },
      keyframes: {
        // Apple-Style Animations
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(102, 126, 234, 0.8)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(2px)' }
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(102, 126, 234, 0.6)',
            transform: 'scale(1.02)'
          }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite'
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out': 'cubic-bezier(0.0, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)'
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em'
      }
    }
  },
  plugins: [
    animatePlugin,
    // Custom plugin for glass morphism utilities
    function({ addUtilities, theme }) {
      const glassUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
        },
        '.glass-hover': {
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(0, 0, 0, 0.12)',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.text-gradient-brand': {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }
      }
      addUtilities(glassUtilities)
    }
  ]
};

export default config;
