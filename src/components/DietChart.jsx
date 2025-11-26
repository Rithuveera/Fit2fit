import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DietChart = ({ dietChart }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!dietChart) return null;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'goals', label: 'Goals', icon: '🎯' },
        { id: 'meals', label: 'Daily Plan', icon: '🍽️' },
        { id: 'tips', label: 'Tips', icon: '💡' }
    ];

    return (
        <div className="w-full">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all duration-300 relative ${activeTab === tab.id
                            ? 'text-neon-green'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <span className="text-xl">{tab.icon}</span>
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-green"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Macronutrients */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">🎯</span>
                                Macronutrient Breakdown
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{dietChart.macros.description}</p>

                            <div className="grid grid-cols-3 gap-4">
                                {/* Protein */}
                                <div className="text-center">
                                    <div className="relative w-20 h-20 mx-auto mb-2">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="35"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                className="text-gray-300 dark:text-gray-700"
                                            />
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="35"
                                                stroke="#39ff14"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeDasharray={`${parseInt(dietChart.macros.protein) * 2.2} 220`}
                                                className="transition-all duration-1000"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{dietChart.macros.protein}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Protein</p>
                                </div>

                                {/* Carbs */}
                                <div className="text-center">
                                    <div className="relative w-20 h-20 mx-auto mb-2">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="35"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                className="text-gray-300 dark:text-gray-700"
                                            />
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="35"
                                                stroke="#39ff14"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeDasharray={`${parseInt(dietChart.macros.carbs) * 2.2} 220`}
                                                className="transition-all duration-1000"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{dietChart.macros.carbs}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Carbs</p>
                                </div>

                                {/* Fats */}
                                <div className="text-center">
                                    <div className="relative w-20 h-20 mx-auto mb-2">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="35"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                className="text-gray-300 dark:text-gray-700"
                                            />
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="35"
                                                stroke="#39ff14"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeDasharray={`${parseInt(dietChart.macros.fats) * 2.2} 220`}
                                                className="transition-all duration-1000"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{dietChart.macros.fats}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Fats</p>
                                </div>
                            </div>
                        </div>

                        {/* Pre & Post Workout */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Pre-Workout */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl">⚡</span>
                                    <h5 className="font-bold text-gray-900 dark:text-white">Pre-Workout</h5>
                                </div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{dietChart.preWorkout.meal}</p>
                                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                    <span>⏰ {dietChart.preWorkout.timing}</span>
                                    <span className="bg-neon-green/20 text-neon-green px-2 py-1 rounded-full font-semibold">
                                        {dietChart.preWorkout.calories}
                                    </span>
                                </div>
                            </div>

                            {/* Post-Workout */}
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl">💪</span>
                                    <h5 className="font-bold text-gray-900 dark:text-white">Post-Workout</h5>
                                </div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{dietChart.postWorkout.meal}</p>
                                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                    <span>⏰ {dietChart.postWorkout.timing}</span>
                                    <span className="bg-neon-green/20 text-neon-green px-2 py-1 rounded-full font-semibold">
                                        {dietChart.postWorkout.calories}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Hydration */}
                        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-5 border border-blue-300 dark:border-blue-700">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">💧</span>
                                <h5 className="font-bold text-gray-900 dark:text-white">Hydration</h5>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{dietChart.hydration}</p>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'goals' && dietChart.goals && (
                    <motion.div
                        key="goals"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Fat Loss Card */}
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border-2 border-orange-300 dark:border-orange-700">
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                {dietChart.goals.fatLoss.title}
                            </h4>

                            <div className="space-y-4">
                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">🎯</span>
                                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">Calorie Target</h5>
                                    </div>
                                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{dietChart.goals.fatLoss.calorieTarget}</p>
                                </div>

                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">📊</span>
                                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">Macro Adjustment</h5>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{dietChart.goals.fatLoss.macroAdjustment}</p>
                                </div>

                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">💡</span>
                                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">Strategy</h5>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{dietChart.goals.fatLoss.strategy}</p>
                                </div>

                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">⏰</span>
                                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">Meal Timing</h5>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{dietChart.goals.fatLoss.mealTiming}</p>
                                </div>

                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">💊</span>
                                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">Supplements</h5>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{dietChart.goals.fatLoss.supplements}</p>
                                </div>
                            </div>
                        </div>

                        {/* Muscle Gain Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-blue-300 dark:border-blue-700">
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                {dietChart.goals.muscleGain.title}
                            </h4>

                            <div className="space-y-4">
                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">🎯</span>
                                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">Calorie Target</h5>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dietChart.goals.muscleGain.calorieTarget}</p>
                                </div>

                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">📊</span>
                                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">Macro Adjustment</h5>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{dietChart.goals.muscleGain.macroAdjustment}</p>
                                </div>

                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">💡</span>
                                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">Strategy</h5>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{dietChart.goals.muscleGain.strategy}</p>
                                </div>

                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">⏰</span>
                                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">Meal Timing</h5>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{dietChart.goals.muscleGain.mealTiming}</p>
                                </div>

                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">💊</span>
                                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">Supplements</h5>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{dietChart.goals.muscleGain.supplements}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'meals' && (
                    <motion.div
                        key="meals"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                    >
                        {dietChart.dailyMeals.map((meal, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-neon-green dark:hover:border-neon-green transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-neon-green font-bold text-sm">{meal.name}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">• {meal.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{meal.meal}</p>
                                    </div>
                                    <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-2xl">🍴</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {activeTab === 'tips' && (
                    <motion.div
                        key="tips"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                    >
                        {dietChart.tips.map((tip, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800 dark:to-transparent rounded-lg p-4 border-l-4 border-neon-green"
                            >
                                <span className="text-neon-green text-xl mt-0.5">✓</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{tip}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DietChart;
