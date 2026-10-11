import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)"],
        poppins: ["var(--font-poppins)"],
        outfit: ["var(--font-outfit)"],
      },
      colors: {
        // Unified Dark Blue Palette
        'bg-primary': '#07101F',
        'bg-secondary': '#0A1528',
        'card-bg': '#111D34',
        'secondary-card': '#162440',
        'navbar-bg': '#0C162B',
        'sidebar-bg': '#0B1628',

        'primary-blue': '#2563EB',
        'secondary-blue': '#3B82F6',
        'accent-blue': '#60A5FA',
        'highlight-blue': '#4F7DFF',
        'hover-blue': '#5D8CFF',
        'active-blue': '#2F6FFF',

        'text-subheading': '#9CAEC9',

        // Radix / Shadcn tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "24px",
        md: "14px",
        sm: "10px",
        'card': '24px',
        'btn': '14px',
        'input': '14px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
