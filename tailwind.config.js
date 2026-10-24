/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        game: {
          blue: '#1E40AF',
          lightblue: '#60A5FA',
          mint: '#10B981',
          purple: '#7C3AED',
          lightpurple: '#A78BFA',
          yellow: '#F59E0B',
          gold: '#D97706',
          pink: '#EC4899',
          orange: '#F97316',
        }
      },
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'star-pop': 'starPop 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'confetti': 'confetti 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        starPop: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.3)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        confetti: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1.5) rotate(180deg)', opacity: '0' },
        },
      },
      backgroundImage: {
        'game-gradient': 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 50%, #10B981 100%)',
        'sky-gradient': 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 40%, #93c5fd 70%, #bfdbfe 100%)',
        'forest-gradient': 'linear-gradient(180deg, #065f46 0%, #10b981 50%, #6ee7b7 100%)',
        'mountain-gradient': 'linear-gradient(180deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)',
        'castle-gradient': 'linear-gradient(180deg, #78350f 0%, #d97706 50%, #fcd34d 100%)',
      },
    },
  },
  plugins: [],
}
