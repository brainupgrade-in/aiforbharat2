/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          deep: '#0A6E6E',
          medium: '#0E8C8C',
          light: '#12ABAB',
          pale: '#E0F5F5',
          ghost: '#F0FAFA',
        },
        amber: {
          warm: '#F5A623',
          light: '#FFF3DC',
          deep: '#E09000',
        },
        mango: {
          green: '#4CAF50',
          light: '#E8F5E9',
        },
        kumkum: {
          red: '#D32F2F',
          light: '#FFEBEE',
        },
        ivory: '#FAF7F2',
        'ivory-dark': '#F2EDE5',
        ink: '#1A1A2E',
        'ink-light': '#4A4A5A',
        'ink-muted': '#8A8A9A',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        body: ['"Noto Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        'caption': ['0.875rem', { lineHeight: '1.25rem' }],
        'body': ['1rem', { lineHeight: '1.5rem' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'heading': ['1.5rem', { lineHeight: '2rem' }],
        'display': ['2rem', { lineHeight: '2.5rem' }],
        'display-lg': ['2.5rem', { lineHeight: '3rem' }],
      },
      animation: {
        'iris-expand': 'irisExpand 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'iris-spin': 'irisSpin 2s linear infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'petal-grow': 'petalGrow 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'marigold-fall': 'marigoldFall 3s ease-in forwards',
        'pulse-border': 'pulseBorder 2s ease-in-out infinite',
        'odometer': 'odometer 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fadeUp 500ms ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        irisExpand: {
          '0%': { clipPath: 'circle(0% at 50% 50%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { clipPath: 'circle(75% at 50% 50%)', opacity: '1' },
        },
        irisSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.08)', opacity: '0.8' },
        },
        petalGrow: {
          '0%': { transform: 'scale(0) rotate(-30deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        marigoldFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        pulseBorder: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(211, 47, 47, 0)' },
        },
        odometer: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
      backgroundSize: {
        'shimmer': '200% 100%',
      },
    },
  },
  plugins: [],
}
