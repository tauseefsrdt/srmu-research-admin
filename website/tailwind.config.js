/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SRMU-inspired palette
        'deep-teal': '#0A4A8F',       // Primary navy blue
        'pine-shadow': '#0C2F44',     // Deep dark navy
        'sage': '#FFB703',            // Gold/amber accent
        'lake-teal': '#0C5CA8',       // Medium navy (hover)
        'forest-floor': '#083658',    // Dark navy (btn hover)
        'ink-navy': '#0C2F44',        // Deep navy
        'dusty-rose': '#FFC107',      // Amber yellow
        'mint-mist': '#bfd3ea',       // Light blue-grey border
        'sea-foam': '#E5E7EB',        // Light grey border
        'paper-white': '#F5F7FA',     // Off-white background
        'card-mint': '#EEF3FA',       // Light blue-tinted card bg
        'blush-sand': '#FFF8E7',      // Warm amber-tinted card bg
        'charcoal-navy': '#1F2937',   // Dark body text
        'slate-body': '#6B7280',      // Muted/secondary text
        'illustration-ink': '#0A4A8F', // Illustration outlines
      },
      fontFamily: {
        serif: ['Source Serif 4', 'Georgia', 'ui-serif', 'serif'],
        sans: ['Rubik', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'btn': '48px',
        'nav': '88px',
        'tag': '100px',
        'card': '12px',
        'pill': '1000px',
      },
      maxWidth: {
        'page': '1200px',
      }
    },
  },
  plugins: [],
}
