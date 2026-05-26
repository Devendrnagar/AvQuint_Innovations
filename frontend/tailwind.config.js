export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(15,23,42,0.35)'
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top, rgba(56,189,248,0.18), transparent 40%), radial-gradient(circle at bottom right, rgba(251,191,36,0.14), transparent 35%)'
      }
    }
  },
  plugins: []
};
