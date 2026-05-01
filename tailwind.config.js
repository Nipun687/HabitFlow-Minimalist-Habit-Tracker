/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg: {
          dark: '#0e0f11',
          light: '#f5f4f0',
        },
        surface: {
          dark: '#16181c',
          light: '#ffffff',
          dark2: '#1e2128',
          light2: '#f0ede8',
        },
        accent: {
          DEFAULT: '#a8e6cf',
          dark: '#84d4b0',
          muted: 'rgba(168,230,207,0.15)',
        },
        amber: '#f5c87a',
        rose: '#f2847a',
        lavender: '#b8a9f5',
        sky: '#7ac4f5',
      },
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-ring': 'pulseRing 0.5s ease-out',
      },
      keyframes: {
        slideUp: { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        slideIn: { from: { transform: 'translateX(-20px)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        bounceIn: { from: { transform: 'scale(0.8)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: '0.6' }, '100%': { transform: 'scale(1.5)', opacity: '0' } },
      },
    },
  },
  plugins: [],
}
