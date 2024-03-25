/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
      fontSize: {
        xs: ['0.6rem', {
          lineHeight: '1.2rem',
          letterSpacing: '0.05rem',
          fontWeight: '500',
        }],
        smh: ['0.7rem', {
          lineHeight: '1.2rem',
          letterSpacing: '0.05rem',
          fontWeight: '500',
        }],
        sm: ['0.8rem', {
          lineHeight: '1.2rem',
          letterSpacing: '0.05rem',
          fontWeight: '500',
        }],
        base: ['1rem', {
          lineHeight: '1.5rem',
          letterSpacing: '0.05rem',
          fontWeight: '500',
        }],
        lg: ['0.9rem', {
          lineHeight: '1.8rem',
          letterSpacing: '0.05rem',
          fontWeight: '600',
        }],
        xl: ['1.25rem', {
          lineHeight: '1.5rem',
          letterSpacing: '0.05rem',
          fontWeight: '500',
        }],
        '2xl': ['1.5rem', {
          lineHeight: '2rem',
          letterSpacing: '0.05rem',
          fontWeight: '500',
        }],
        '3xl': ['1.953rem', {
          lineHeight: '2.5rem',
          letterSpacing: '0.02rem',
          fontWeight: '700',
        }],
        '3x2': ['1.8rem', {
          lineHeight: '2rem',
          letterSpacing: '0.06rem',
          fontWeight: '900',
        }],
        '4xl': ['2.441rem', {
          lineHeight: '3rem',
          letterSpacing: '0.05rem',
          fontWeight: '700',
        }],
        '5xl': ['3.052rem', {
          lineHeight: '3.2rem',
          letterSpacing: '0.05rem',
          fontWeight: '700',
        }],
        '6xl': ['4.2rem', {
          lineHeight: '4rem',
          letterSpacing: '-0.04rem',
          fontWeight: '300',
        }],
        '7xl': ['7rem', {
          lineHeight: '7rem',
          letterSpacing: '-0.04rem',
          fontWeight: '900',
        }],
        'thint': ['2rem', {
          lineHeight: '2rem',
          letterSpacing: '0.01rem',
          fontWeight: '100',
        }],
      },
      borderWidth: {
        DEFAULT: '1px',
      },
      extend: {
        fontFamily: {
          'sans': ['Roboto', 'ui-sans-serif', 'system-ui'],
          'serif': ['Roboto Slab', 'ui-serif'],
          'mono': ['Roboto Mono', 'ui-monospace'],
        },
        colors: {
          'gray-dark': '#2B2B2B',
          'gray-border': '#3A3A3A',
          'gray': '#8E8E8E',
          'gray-light': '#F2F2F2',
          'red': '#af1010',
          'red-dark': '#D2131B',
        },
        width: {
          '50': '58px',
        },
        boxShadow:{
          '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
          '4xl': '0 35px 60px -15px rgba(0, 0, 0, 0.5)',
          'est': '0 0 30px 5px rgba(0.5, 0.5, 0.5, 0.5)',
        },
        rotate: {
          '18': '18deg',
        }
      },
    },
    plugins: [
      plugin(({addUtilities}) =>
        addUtilities({'.vertical-lr': { 'writing-mode': 'vertical-lr' }, '.vertical-rl': { 'writing-mode': 'vertical-rl' }, '.all-unset' : {all: 'unset'}})
      ),
    ],
  };