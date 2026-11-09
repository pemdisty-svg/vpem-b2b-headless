import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./locales/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pem: {
          green: '#80BC00', // Pantone 376 C
          red: '#C10230',   // Pantone 200 C
          orange: '#FF6C0E',// Pantone 1585 C
          dark: '#53575A',  // Pantone 425 C
        }
      }
    },
  },
  plugins: [],
};
export default config;