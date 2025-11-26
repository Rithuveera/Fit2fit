import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green"
            aria-label="Toggle Dark Mode"
        >
            <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-xs"
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                style={{
                    x: theme === 'dark' ? 24 : 0
                }}
            >
                {theme === 'dark' ? (
                    <span role="img" aria-label="moon">🌙</span>
                ) : (
                    <span role="img" aria-label="sun">☀️</span>
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
