import React, { useState, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const GoalTracker = ({ userId, goals, onGoalsUpdated, stats }) => {
    const { isDark } = useContext(ThemeContext);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        goal_type: 'workout_count',
        title: '',
        description: '',
        target_value: 0,
        target_date: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/api/analytics/goal', {
                user_id: userId,
                ...formData
            });

            setShowForm(false);
            setFormData({
                goal_type: 'workout_count',
                title: '',
                description: '',
                target_value: 0,
                target_date: ''
            });
            onGoalsUpdated();
        } catch (error) {
            console.error('Error creating goal:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateGoal = async (goalId, updates) => {
        try {
            await axios.put(`/api/analytics/goal/${goalId}`, updates);
            onGoalsUpdated();
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };

    const handleDeleteGoal = async (goalId) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await axios.delete(`/api/analytics/goal/${goalId}`);
                onGoalsUpdated();
            } catch (error) {
                console.error('Error deleting goal:', error);
            }
        }
    };

    const calculateProgress = (goal) => {
        let current = goal.current_value || 0;

        // Auto-calculate based on stats for certain goal types
        if (goal.goal_type === 'workout_count' && stats) {
            current = stats.month_workouts || 0;
        } else if (goal.goal_type === 'calories' && stats) {
            current = stats.total_calories || 0;
        }

        const progress = Math.min((current / goal.target_value) * 100, 100);
        return { current, progress };
    };

    const getDaysRemaining = (targetDate) => {
        if (!targetDate) return null;
        const today = new Date();
        const target = new Date(targetDate);
        const diffTime = target - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const goalTypes = [
        { value: 'workout_count', label: 'Workout Count', icon: '💪' },
        { value: 'calories', label: 'Calories Burned', icon: '🔥' },
        { value: 'weight_loss', label: 'Weight Loss', icon: '⚖️' },
        { value: 'streak', label: 'Workout Streak', icon: '⚡' },
        { value: 'custom', label: 'Custom Goal', icon: '🎯' }
    ];

    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');

    return (
        <div className="space-y-6">
            {/* Create Goal Button */}
            <motion.button
                onClick={() => setShowForm(!showForm)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
            >
                <span className="text-2xl">{showForm ? '✖️' : '🎯'}</span>
                {showForm ? 'Cancel' : 'Create New Goal'}
            </motion.button>

            {/* Goal Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                            } shadow-xl`}
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Goal Type *
                                    </label>
                                    <select
                                        value={formData.goal_type}
                                        onChange={(e) => setFormData({ ...formData, goal_type: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
                                            } border focus:ring-2 focus:ring-purple-500 transition`}
                                        required
                                    >
                                        {goalTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.icon} {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={`block mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Target Value *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.target_value}
                                        onChange={(e) => setFormData({ ...formData, target_value: parseFloat(e.target.value) })}
                                        className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
                                            } border focus:ring-2 focus:ring-purple-500 transition`}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={`block mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Goal Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
                                            } border focus:ring-2 focus:ring-purple-500 transition`}
                                        placeholder="e.g., Workout 20 times this month"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={`block mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Target Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.target_date}
                                        onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
                                            } border focus:ring-2 focus:ring-purple-500 transition`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Description (optional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
                                        } border focus:ring-2 focus:ring-purple-500 transition`}
                                    rows="2"
                                    placeholder="Why is this goal important to you?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition transform hover:scale-105 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Goal'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Goals */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                } shadow-xl`}>
                <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Active Goals ({activeGoals.length})
                </h3>
                <div className="space-y-4">
                    {activeGoals.length > 0 ? (
                        activeGoals.map((goal, index) => {
                            const { current, progress } = calculateProgress(goal);
                            const daysRemaining = getDaysRemaining(goal.target_date);
                            const isCompleted = progress >= 100;

                            return (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-5 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                                        } hover:shadow-lg transition`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {goal.title}
                                            </h4>
                                            {goal.description && (
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                                    {goal.description}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteGoal(goal.id)}
                                            className={`ml-4 p-2 rounded-lg ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                                                } transition`}
                                        >
                                            🗑️
                                        </button>
                                    </div>

                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                                {current} / {goal.target_value}
                                            </span>
                                            <span className={`font-semibold ${isCompleted ? 'text-green-500' : isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                                {progress.toFixed(0)}%
                                            </span>
                                        </div>
                                        <div className={`h-3 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'} overflow-hidden`}>
                                            <motion.div
                                                className={`h-full ${isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-600'}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        {daysRemaining !== null && (
                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {daysRemaining > 0 ? `${daysRemaining} days remaining` : daysRemaining === 0 ? 'Due today!' : 'Overdue'}
                                            </span>
                                        )}
                                        {isCompleted && (
                                            <button
                                                onClick={() => handleUpdateGoal(goal.id, { status: 'completed' })}
                                                className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-500 hover:to-emerald-600 transition transform hover:scale-105"
                                            >
                                                ✓ Mark Complete
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            No active goals. Create one to start tracking your progress!
                        </p>
                    )}
                </div>
            </div>

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                    } shadow-xl`}>
                    <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Completed Goals 🎉 ({completedGoals.length})
                    </h3>
                    <div className="space-y-3">
                        {completedGoals.map((goal, index) => (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`p-4 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className={`font-semibold ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                                            ✓ {goal.title}
                                        </h4>
                                        <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                            Completed on {new Date(goal.completed_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteGoal(goal.id)}
                                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-green-100'
                                            } transition`}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoalTracker;
