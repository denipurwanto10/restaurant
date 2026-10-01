/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{vue,js}',
        './storage/framework/views/*.php',
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
            },
            colors: {
                cream: {
                    50: '#faf7f1',
                    100: '#f4eee1',
                    200: '#e9ddc6',
                },
                espresso: {
                    500: '#6f5b45',
                    600: '#57462f',
                    700: '#3e3222',
                    800: '#2c2318',
                    900: '#1e170f',
                },
                gold: {
                    400: '#d4a94e',
                    500: '#c29235',
                    600: '#a67c28',
                },
            },
        },
    },
    plugins: [],
};
