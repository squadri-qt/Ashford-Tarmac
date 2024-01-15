/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
      extend: {
        colors: {
          neutral: {
            400: '#8E8E8E',
            800: '#2B2B2B',
          },
          red: {
            600:'#ED1C24',
          }
        },
        fontSize: {
          'h1': '4rem',
          'h2': '3rem',
          'h3': '2.5rem',
          'h4': '2rem',
          'h5': '1.5rem',
          'h6': '1.25rem',
        },
        padding: {
          'h1': '2rem 0',
          'h2': '1.5rem 0',
          'h3': '1.25rem 0',
          'h4': '1rem 0',
          'h5': '0.75rem 0',
          'h6': '0.5rem 0',
          'li': '0.5rem 0',
          'ul': '1rem 0',
          'div': '1rem 0',
          'a': '0.5rem 0',
        },
      },
    },
    plugins: [],
  };