import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F3EFE7", // Warm Ivory
        surface: "#FFFFFF",
        primary: "#292019", // Deep Espresso
        secondary: "#C6A66B", // Primary Champagne Gold
        accent: "#B69A70", // Brushed Gold
        taupe: "#685C50", // Warm Taupe
        gold: {
          primary: "#C6A66B", // Primary Champagne Gold
          antique: "#A88955", // Antique Gold
          brushed: "#B69A70", // Brushed Gold
          muted: "#D1BA91",   // Muted Gold
          bronze: "#80633D",  // Deep Bronze Gold
          pale: "#E2D2B5",    // Pale Champagne
        },
        espresso: {
          DEFAULT: "#292019",
          deep: "#201812",
          surface: "#352A21",
        },
        ivory: {
          DEFAULT: "#F3EFE7",
          warm: "#F7F4EE",
          marble: "#EAE4D9",
        },
        luxury: {
          dark: "#201812",
          espresso: "#292019",
          taupe: "#685C50",
          cream: "#F3EFE7",
          marble: "#EAE4D9",
          gold: "#C6A66B",
          muted: "#685C50",
          border: "#E2D2B5",
          borderMuted: "rgba(209, 186, 145, 0.4)",
          card: "rgba(255, 255, 255, 0.90)",
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        nav: ['"Space Grotesk"', 'sans-serif'],
      },
      letterSpacing: {
        widest: "0.25em",
        ultra: "0.35em",
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
