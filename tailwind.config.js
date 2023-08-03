/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      'lato': ['lato']
    },
    extend: {
    },
  },
  daisyui: {
      themes: [
        {
          roadwisetheme: {
                    "primary": "#1b7288",
                    "secondary": "#d0eef6",
                    "accent": " #29afd1",
                    "base-100": "#08242b",
                    "success": "#16a34a",
                    "warning": "#f7bc45",
                    "error": "#dc2626",
                    'background': '#eaf7fb',
                   },
        },
      ],
    },
  plugins: [require("daisyui")],
}


// 'text': '#2e1705',
// 'background': '#fffcfa',
// 'primary': '#cbbf15',
// 'secondary': '#c8e4f9',
// 'accent': '#1724de',

// Blue tint
// 'text': '#08242b',
// 'background': '#eaf7fb',
// 'primary': '#1b7288',
// 'secondary': '#d0eef6',
// 'accent': '#29afd1',