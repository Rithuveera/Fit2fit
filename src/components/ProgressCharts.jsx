import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ThemeContext } from '../context/ThemeContext';

const ProgressCharts = ({ workouts, measurements }) => {
    const { isDark } = useContext(ThemeContext);

    // Prepare workout frequency data (last 30 days)
    const getLast30DaysData = () => {
        const last30Days = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const count = workouts.filter(w => w.workout_date === dateStr).length;
            const calories = workouts
                .filter(w => w.workout_date === dateStr)
                .reduce((sum, w) => sum + (w.calories || 0), 0);

            last30Days.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                workouts: count,
                calories: calories
            });
        }

        return last30Days;
    };

    // Prepare exercise type distribution
    const getExerciseDistribution = () => {
        const distribution = {};
        workouts.forEach(w => {
            distribution[w.exercise] = (distribution[w.exercise] || 0) + 1;
        });

        return Object.entries(distribution)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    };

    // Prepare body measurements data
    const getMeasurementsData = () => {
        return measurements
            .slice()
            .reverse()
            .slice(0, 10)
            .map(m => ({
                date: new Date(m.measurement_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                weight: m.weight,
                bodyFat: m.body_fat_percentage,
                muscle: m.muscle_mass
            }));
    };

    const last30DaysData = getLast30DaysData();
    const exerciseDistribution = getExerciseDistribution();
    const measurementsData = getMeasurementsData();

    const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

    const chartTheme = {
        textColor: isDark ? '#9ca3af' : '#6b7280',
        gridColor: isDark ? '#374151' : '#e5e7eb',
        tooltipBg: isDark ? '#1f2937' : '#ffffff',
        tooltipBorder: isDark ? '#374151' : '#e5e7eb'
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workout Frequency Line Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                    } shadow-xl`}
            >
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Workout Frequency (Last 30 Days)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={last30DaysData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                        <XAxis
                            dataKey="date"
                            stroke={chartTheme.textColor}
                            tick={{ fontSize: 12 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis stroke={chartTheme.textColor} tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: chartTheme.tooltipBg,
                                border: `1px solid ${chartTheme.tooltipBorder}`,
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="workouts"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ fill: '#8b5cf6', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Calories Burned Bar Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                    } shadow-xl`}
            >
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Calories Burned (Last 30 Days)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={last30DaysData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                        <XAxis
                            dataKey="date"
                            stroke={chartTheme.textColor}
                            tick={{ fontSize: 12 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis stroke={chartTheme.textColor} tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: chartTheme.tooltipBg,
                                border: `1px solid ${chartTheme.tooltipBorder}`,
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="calories" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Exercise Distribution Pie Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                    } shadow-xl`}
            >
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Exercise Distribution
                </h3>
                {exerciseDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={exerciseDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {exerciseDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: chartTheme.tooltipBg,
                                    border: `1px solid ${chartTheme.tooltipBorder}`,
                                    borderRadius: '8px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className={`flex items-center justify-center h-64 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No workout data available
                    </div>
                )}
            </motion.div>

            {/* Body Measurements Area Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                    } shadow-xl`}
            >
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Body Measurements Progress
                </h3>
                {measurementsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={measurementsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                            <XAxis
                                dataKey="date"
                                stroke={chartTheme.textColor}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis stroke={chartTheme.textColor} tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: chartTheme.tooltipBg,
                                    border: `1px solid ${chartTheme.tooltipBorder}`,
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.3}
                            />
                            <Area
                                type="monotone"
                                dataKey="bodyFat"
                                stroke="#ef4444"
                                fill="#ef4444"
                                fillOpacity={0.3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className={`flex items-center justify-center h-64 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No measurement data available
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ProgressCharts;
