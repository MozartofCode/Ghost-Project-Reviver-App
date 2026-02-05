import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Overgrown Garden Palette
                forest: {
                    DEFAULT: '#2F4839',
                    light: '#4A6B56',
                    dark: '#1A2C22',
                    50: '#F2F5F3',
                    100: '#E1E8E4',
                    200: '#C2D1C9',
                    300: '#9FB9AD',
                    400: '#7D9F90',
                    500: '#5C8474',
                    600: '#406A58',
                    700: '#2F4839',
                    800: '#1F2F26',
                    900: '#101814',
                },
                earth: {
                    DEFAULT: '#8C705F',
                    light: '#D9C3B0',
                    dark: '#5E4B3F',
                    50: '#F9F5F3',
                },
                mint: {
                    DEFAULT: '#98FF98',
                    light: '#C2FFC2',
                    dark: '#4ADE80', // slightly darker for text visibility
                    glow: '#bbf7d0',
                },
                cream: {
                    DEFAULT: '#F5F7F2',
                    dark: '#E1E3DE',
                },

                // Functional Colors mapping
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
            fontFamily: {
                sans: ['var(--font-outfit)', 'sans-serif'],
                display: ['var(--font-outfit)', 'sans-serif'],
            },
            borderRadius: {
                lg: '1.5rem',     // Increased for "organic" feel
                md: '1rem',
                sm: '0.5rem',
                xl: '2rem',
                '2xl': '2.5rem',
            },
            boxShadow: {
                'organic': '0 20px 40px -10px rgba(47, 72, 57, 0.15)',
                'organic-hover': '0 25px 50px -12px rgba(47, 72, 57, 0.25)',
                'glow': '0 0 20px rgba(152, 255, 152, 0.4)',
            },
            backgroundImage: {
                'gradient-hero': 'linear-gradient(to right bottom, #F5F7F2, #E1E8E4, #C2D1C9)', // Soft earthy gradient
                'gradient-lush': 'linear-gradient(135deg, #2F4839 0%, #406A58 100%)',
                'gradient-mint': 'linear-gradient(135deg, #98FF98 0%, #4ADE80 100%)',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
}

export default config
