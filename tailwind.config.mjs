/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
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
          'red': '#ED1C24',
          'red-dark': '#D2131B',
        },
        width: {
          '50': '58px',
        },
        boxShadow:{
          '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
          '4xl': '0 35px 60px -15px rgba(0, 0, 0, 0.5)',
        },      
      },
    },
    plugins: [],
  };