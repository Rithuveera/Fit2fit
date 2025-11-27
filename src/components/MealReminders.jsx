import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DietReminderSubscription from './DietReminderSubscription';

const MealReminders = () => {
    const [selectedClass, setSelectedClass] = useState('HIIT');

    const classes = [
        { display: 'HIIT', value: 'HIIT' },
        { display: 'Yoga Flow', value: 'Yoga' },
        { display: 'Strength & Conditioning', value: 'Strength' }
    ];

    return (
        <section id="meal-reminders" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black relative overflow-hidden min-h-screen flex flex-col justify-center transition-colors duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #39ff14 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl font-black text-gray-900 dark:text-white mb-4 font-orbitron tracking-wider transition-colors duration-300"
                    >
                        MEAL <span className="text-neon-green">REMINDERS</span>
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-1 w-24 bg-neon-green mx-auto mb-6"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg transition-colors duration-300"
                    >
                        Never miss a meal! Get timely email & WhatsApp reminders for your diet plan throughout the day.
                    </motion.p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
                    >
                        {/* Class Selection */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span>🏋️</span> Select Your Class
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {classes.map((classItem) => (
                                    <button
                                        key={classItem.value}
                                        onClick={() => setSelectedClass(classItem.value)}
                                        className={`p-4 rounded-xl font-semibold transition-all duration-300 ${selectedClass === classItem.value
                                            ? 'bg-neon-green text-black shadow-lg scale-105'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {classItem.display}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subscription Form */}
                        <DietReminderSubscription classType={selectedClass} />

                        {/* Info Section */}
                        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <span>ℹ️</span> How It Works
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-green mt-0.5">✓</span>
                                    <span>Subscribe with your email (and optionally phone number for WhatsApp)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-green mt-0.5">✓</span>
                                    <span>Get automated reminders at meal times via email and/or WhatsApp</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-green mt-0.5">✓</span>
                                    <span>Each reminder includes the meal details from your selected diet plan</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-green mt-0.5">✓</span>
                                    <span>Unsubscribe anytime directly from this page</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default MealReminders;
