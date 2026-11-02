/** Gabungkan `theme.extend` ini ke tailwind.config.js yang sudah ada. Nama token (espresso/gold/cream) tetap sama. */
export default {
    darkMode: 'class',
    content: ['./resources/**/*.{vue,js,blade.php}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                serif: ['"Instrument Serif"', 'Georgia', 'serif'],
            },
            colors: {
                cream:    { 50: '#fcfaf6', 100: '#f5f0e6', 200: '#e8e0d0', 300: '#d6cbb4' },
                espresso: { 500: '#7b6b58', 600: '#5a4a38', 700: '#3d3125', 800: '#261d15', 900: '#17120d' },
                gold:     { 400: '#d2b983', 500: '#bb9a5c', 600: '#856a38' },
            },
            transitionTimingFunction: { DEFAULT: 'cubic-bezier(.22,1,.36,1)' },
            transitionDuration: { DEFAULT: '350ms' },
            boxShadow: {
                soft: '0 1px 2px rgba(23,18,13,.04), 0 12px 32px -12px rgba(23,18,13,.12)',
                lift: '0 2px 4px rgba(23,18,13,.04), 0 24px 48px -16px rgba(23,18,13,.22)',
            },
        },
    },
};
