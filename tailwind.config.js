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
        lg: '3rem',
        '2xl': '5rem'
      },
      screens: {
        '2xl': '1440px'
      }
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563EB',
          foreground: '#F8FAFC'
        },
        accent: {
          DEFAULT: '#0EA5E9',
          foreground: '#0B1120'
        },
        surface: {
          DEFAULT: '#0F172A',
          muted: '#111827',
          subtle: '#1F2937',
          highlight: '#1E293B'
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5F5',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A'
        }
      },
      backgroundImage: {
        'gradient-mesh':
          'radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.35), transparent 60%), radial-gradient(circle at 80% 10%, rgba(14, 165, 233, 0.35), transparent 50%), radial-gradient(circle at 50% 80%, rgba(7, 89, 133, 0.45), transparent 65%)',
        'glass-panel':
          'linear-gradient(135deg, rgba(15, 23, 42, 0.65), rgba(30, 41, 59, 0.35))'
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
        glass: '24px'
      },
      boxShadow: {
        glow: '0 0 40px rgba(14, 165, 233, 0.35)',
        card: '0 24px 60px rgba(15, 23, 42, 0.35)'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-satoshi)', 'Inter', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace']
      },
      keyframes: {
        'fade-slide-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'parallax-float': {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(2%)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'fade-slide-in': 'fade-slide-in 400ms var(--ease-out-expo)',
        shimmer: 'shimmer 2.5s infinite linear',
        'parallax-float': 'parallax-float 18s ease-in-out infinite'
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)'
      }
    }
  },
  plugins: [animatePlugin]
};

export default config;
