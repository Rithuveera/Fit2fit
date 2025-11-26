import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const ReportGenerator = ({ userId }) => {
    const { isDark } = useContext(ThemeContext);
    const [period, setPeriod] = useState('month');
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReport();
    }, [userId, period]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/analytics/report/${userId}/${period}`);
            setReport(response.data.data);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!report) {
        return null;
    }

    const stats = report.workout_stats || {};
    const exercises = report.exercise_breakdown || [];

    return (
        <div className="space-y-6">
            {/* Period Selector */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => setPeriod('month')}
                    className={`px-8 py-3 rounded-lg font-semibold transition ${period === 'month'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                        : isDark
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    📅 Monthly Report
                </button>
                <button
                    onClick={() => setPeriod('year')}
                    className={`px-8 py-3 rounded-lg font-semibold transition ${period === 'year'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                        : isDark
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    📆 Yearly Report
                </button>
            </div>

            {/* Report Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-2xl ${isDark ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/20' : 'bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200'
                    } shadow-xl text-center`}
            >
                <h2 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {period === 'month' ? '📅 Monthly' : '📆 Yearly'} Fitness Report
                </h2>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your {period === 'month' ? 'this month' : 'this year'} at a glance
                </p>
            </motion.div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                        } shadow-lg`}
                >
                    <div className="text-4xl mb-3">💪</div>
                    <h4 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Total Workouts
                    </h4>
                    <p className={`text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent`}>
                        {stats.total_workouts || 0}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                        } shadow-lg`}
                >
                    <div className="text-4xl mb-3">🔥</div>
                    <h4 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Total Calories
                    </h4>
                    <p className={`text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent`}>
                        {stats.total_calories?.toLocaleString() || 0}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                        } shadow-lg`}
                >
                    <div className="text-4xl mb-3">⏱️</div>
                    <h4 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Avg Duration
                    </h4>
                    <p className={`text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent`}>
                        {stats.avg_duration ? Math.round(stats.avg_duration) : 0} min
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                        } shadow-lg`}
                >
                    <div className="text-4xl mb-3">📅</div>
                    <h4 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Most Active Day
                    </h4>
                    <p className={`text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent`}>
                        {report.most_active_day}
                    </p>
                </motion.div>
            </div>

            {/* Exercise Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                    } shadow-xl`}
            >
                <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Exercise Breakdown
                </h3>
                {exercises.length > 0 ? (
                    <div className="space-y-4">
                        {exercises.map((exercise, index) => {
                            const maxCount = Math.max(...exercises.map(e => e.count));
                            const percentage = (exercise.count / maxCount) * 100;

                            return (
                                <div key={index}>
                                    <div className="flex justify-between mb-2">
                                        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                            {exercise.exercise}
                                        </span>
                                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {exercise.count} sessions • {exercise.calories?.toLocaleString() || 0} kcal
                                        </span>
                                    </div>
                                    <div className={`h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No workout data available for this period
                    </p>
                )}
            </motion.div>

            {/* Insights */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`p-6 rounded-2xl ${isDark ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-lg border border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'
                    } shadow-xl`}
            >
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    💡 Insights & Achievements
                </h3>
                <div className="space-y-3">
                    {stats.total_workouts > 0 && (
                        <div className={`flex items-start gap-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                            <span className="text-2xl">🎉</span>
                            <p>
                                You completed <strong>{stats.total_workouts}</strong> workout{stats.total_workouts !== 1 ? 's' : ''} this {period}!
                            </p>
                        </div>
                    )}
                    {stats.total_calories > 0 && (
                        <div className={`flex items-start gap-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                            <span className="text-2xl">🔥</span>
                            <p>
                                You burned a total of <strong>{stats.total_calories?.toLocaleString()}</strong> calories!
                            </p>
                        </div>
                    )}
                    {report.most_active_day && report.most_active_day !== 'N/A' && (
                        <div className={`flex items-start gap-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                            <span className="text-2xl">📅</span>
                            <p>
                                Your most active day was <strong>{report.most_active_day}</strong>
                            </p>
                        </div>
                    )}
                    {stats.most_common_exercise && (
                        <div className={`flex items-start gap-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                            <span className="text-2xl">⭐</span>
                            <p>
                                Your favorite exercise was <strong>{stats.most_common_exercise}</strong>
                            </p>
                        </div>
                    )}
                    {stats.total_workouts === 0 && (
                        <div className={`flex items-start gap-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="text-2xl">💪</span>
                            <p>
                                No workouts logged this {period}. Start your fitness journey today!
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ReportGenerator;
