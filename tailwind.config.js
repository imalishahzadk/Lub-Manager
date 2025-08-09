/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1F3B73",
        accent: "#00BFA5",
        background: "#F5F7FA",
        surface: "#FFFFFF",
        textmain: "#333333",
        bordercol: "#E0E0E0",
        success: "#3CA978",
        warning: "#F29D35",
        error: "#D0342C",
      },
    },
  },
  plugins: [],
}
