/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-green': '#39ff14',
            },
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
