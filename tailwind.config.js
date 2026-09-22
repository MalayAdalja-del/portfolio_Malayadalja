/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Three colours: white, navy, black. Nothing else.
        paper: '#FFFFFF',
        bone: '#F2F3F6', // the only off-white, for raised surfaces
        ink: {
          DEFAULT: '#0A0B0D',
          soft: '#16181C',
        },
        navy: {
          900: '#070F26',
          800: '#0B1738',
          700: '#14265C',
          600: '#1B3372',
          500: '#1E3A8A', // accent on white — 10.4:1
          400: '#2B52CC',
          300: '#7A9BF5', // accent on black — 7.1:1
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.055em',
        mega: '-0.065em',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        spin3: { to: { transform: 'rotate(360deg)' } },
        flow: {
          '0%': { transform: 'translateX(0)', opacity: '0' },
          '12%': { opacity: '1' },
          '88%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%,-3%,0) scale(1.06)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-slow': 'marquee 64s linear infinite',
        spin3: 'spin3 0.9s linear infinite',
        flow: 'flow 3.3s linear infinite',
        drift: 'drift 16s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
