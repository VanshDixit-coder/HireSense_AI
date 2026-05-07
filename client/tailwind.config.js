/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A0F1E',
        primary: '#3B82F6',
        accent: '#10B981'
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif']
      },
      boxShadow: {
        glow: '0 16px 60px rgba(59, 130, 246, 0.22)'
      }
    }
  },
  plugins: []
};
