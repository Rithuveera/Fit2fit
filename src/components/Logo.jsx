import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DumbbellIcon = () => (
    <motion.svg
        viewBox="0 0 24 24"
        className="w-5 h-8 mx-0.5 text-neon-green"
        fill="currentColor"
        initial={{ y: 0 }}
        animate={{ y: [0, -6, 0] }}
        transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    >
        <rect x="10" y="4" width="4" height="16" rx="1" />
        <rect x="6" y="2" width="12" height="4" rx="1" />
        <rect x="6" y="18" width="12" height="4" rx="1" />
    </motion.svg>
);

const Logo = () => {
    const containerVariant = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const renderText = () => (
        <motion.div
            variants={containerVariant}
            initial="hidden"
            animate="visible"
            className="flex items-center"
        >
            <span className="text-gray-900 dark:text-white text-2xl font-black tracking-wider transition-colors duration-300">F</span>
            <DumbbellIcon />
            <span className="text-gray-900 dark:text-white text-2xl font-black tracking-wider transition-colors duration-300">T</span>
        </motion.div>
    );

    return (
        <Link to="/" className="flex items-center gap-1 group" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            {renderText()}

            <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
                className="text-neon-green text-3xl font-black mx-0.5"
            >
                2
            </motion.span>

            {renderText()}
        </Link>
    );
};

export default Logo;
