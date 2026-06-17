/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      colors: {
        // Industrial minimal palette — six tokens only.
        canvas: "#09090B",
        surface: "#111113",
        hairline: "#27272A",
        primary: {
          DEFAULT: "#06B6D4", // cyan-500
          hover: "#22D3EE", // cyan-400
          ring: "rgba(6,182,212,0.35)",
        },
        // Aliases retained from prior commits so component code keeps working.
        accent: {
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
        },
      },
      maxWidth: {
        page: "1400px",
      },
      borderRadius: {
        "3xl": "1.5rem", // 24px — cards
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "rec-ring": {
          "0%": { transform: "scale(1)", opacity: "0.35" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "subtle-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out both",
        "fade-in-up": "fade-in 150ms ease-out both",
        "rec-ring": "rec-ring 1.6s ease-out infinite",
        "subtle-pulse": "subtle-pulse 2.4s ease-in-out infinite",
        shimmer: "fade-in 150ms ease-out both",
      },
    },
  },
  plugins: [],
};
