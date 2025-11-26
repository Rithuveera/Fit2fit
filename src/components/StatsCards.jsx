import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const StatsCards = ({ stats }) => {
    const { isDark } = useContext(ThemeContext);

    if (!stats) {
        return null;
    }

    const cards = [
        {
            title: 'This Month',
            value: stats.month_workouts,
            icon: '📅',
            gradient: 'from-blue-500 to-cyan-500',
            suffix: 'workouts'
        },
        {
            title: 'This Year',
            value: stats.year_workouts,
            icon: '🗓️',
            gradient: 'from-purple-500 to-pink-500',
            suffix: 'workouts'
        },
        {
            title: 'Total Calories',
            value: stats.total_calories?.toLocaleString() || 0,
            icon: '🔥',
            gradient: 'from-orange-500 to-red-500',
            suffix: 'kcal'
        },
        {
            title: 'Current Streak',
            value: stats.current_streak,
            icon: '⚡',
            gradient: 'from-yellow-500 to-orange-500',
            suffix: 'days',
            animated: true
        },
        {
            title: 'Longest Streak',
            value: stats.longest_streak,
            icon: '🏆',
            gradient: 'from-green-500 to-emerald-500',
            suffix: 'days'
        },
        {
            title: 'Total Workouts',
            value: stats.total_workouts,
            icon: '💪',
            gradient: 'from-indigo-500 to-purple-500',
            suffix: 'sessions'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`p-6 rounded-2xl ${isDark
                            ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700'
                            : 'bg-white border border-gray-200'
                        } shadow-xl hover:shadow-2xl transition-all duration-300`}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                {card.title}
                            </p>
                            <div className="flex items-baseline gap-2">
                                <motion.h3
                                    className={`text-4xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
                                    animate={card.animated ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                >
                                    {card.value}
                                </motion.h3>
                                <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {card.suffix}
                                </span>
                            </div>
                        </div>
                        <motion.div
                            className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${card.gradient} bg-opacity-10`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            {card.icon}
                        </motion.div>
                    </div>

                    {/* Progress bar for visual appeal */}
                    <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                        <motion.div
                            className={`h-full bg-gradient-to-r ${card.gradient}`}
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 1 }}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsCards;
