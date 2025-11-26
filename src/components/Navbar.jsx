import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import JoinModal from './JoinModal';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);

    return (
        <>
            <nav className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white fixed w-full z-50 top-0 left-0 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Logo />
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <Link to="/" className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                                    <Link to="/classes" className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Classes</Link>
                                    <Link to="/membership" className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Membership</Link>
                                    <Link to="/meal-reminders" className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">📧 Meal Reminders</Link>
                                    <Link to="/log-workout" className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">💪 Log Workout</Link>
                                    <Link to="/dashboard" className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">📊 Analytics</Link>
                                    <Link to="/gamification" className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">🏆 Gamification</Link>
                                    <Link to="/about" className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsJoinOpen(true)}
                                className="bg-neon-green text-black font-bold py-2 px-4 rounded hover:bg-green-400 transition duration-300"
                            >
                                Join Now
                            </button>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                className="bg-gray-200 dark:bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-300"
                                aria-controls="mobile-menu"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className="md:hidden bg-gray-100 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300" id="mobile-menu">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/" className="hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
                            <Link to="/classes" className="hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>Classes</Link>
                            <Link to="/membership" className="hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>Membership</Link>
                            <Link to="/meal-reminders" className="hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>📧 Meal Reminders</Link>
                            <Link to="/log-workout" className="hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>💪 Log Workout</Link>
                            <Link to="/dashboard" className="hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>📊 Analytics</Link>
                            <Link to="/gamification" className="hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>🏆 Gamification</Link>
                            <Link to="/about" className="hover:bg-gray-200 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors" onClick={() => setIsOpen(false)}>About</Link>
                        </div>
                    </div>
                )}
            </nav>

            {isJoinOpen && (
                <JoinModal onClose={() => setIsJoinOpen(false)} />
            )}
        </>
    );
};

export default Navbar;
