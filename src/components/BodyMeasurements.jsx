import React, { useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ThemeContext } from '../context/ThemeContext';

const BodyMeasurements = ({ userId, measurements, onMeasurementAdded }) => {
    const { isDark } = useContext(ThemeContext);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        weight: '',
        body_fat_percentage: '',
        muscle_mass: '',
        measurement_date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:3000/api/analytics/measurement', {
                user_id: userId,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
                muscle_mass: formData.muscle_mass ? parseFloat(formData.muscle_mass) : null,
                measurement_date: formData.measurement_date
            });

            setShowForm(false);
            setFormData({
                weight: '',
                body_fat_percentage: '',
                muscle_mass: '',
                measurement_date: new Date().toISOString().split('T')[0]
            });
            onMeasurementAdded();
        } catch (error) {
            console.error('Error logging measurement:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = measurements
        .slice()
        .reverse()
        .map(m => ({
            date: new Date(m.measurement_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            weight: m.weight,
            bodyFat: m.body_fat_percentage,
            muscle: m.muscle_mass
        }));

    const latestMeasurement = measurements[0];

    const chartTheme = {
        textColor: isDark ? '#9ca3af' : '#6b7280',
        gridColor: isDark ? '#374151' : '#e5e7eb',
        tooltipBg: isDark ? '#1f2937' : '#ffffff',
        tooltipBorder: isDark ? '#374151' : '#e5e7eb'
    };

    return (
        <div className="space-y-6">
            {/* Log Measurement Button */}
            <motion.button
                onClick={() => setShowForm(!showForm)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
            >
                <span className="text-2xl">{showForm ? '✖️' : '📏'}</span>
                {showForm ? 'Cancel' : 'Log New Measurement'}
            </motion.button>

            {/* Measurement Form */}
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
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
                                        } border focus:ring-2 focus:ring-purple-500 transition`}
                                    placeholder="70.5"
                                />
                            </div>

                            <div>
                                <label className={`block mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Body Fat (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.body_fat_percentage}
                                    onChange={(e) => setFormData({ ...formData, body_fat_percentage: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
                                        } border focus:ring-2 focus:ring-purple-500 transition`}
                                    placeholder="15.5"
                                />
                            </div>

                            <div>
                                <label className={`block mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Muscle Mass (kg)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.muscle_mass}
                                    onChange={(e) => setFormData({ ...formData, muscle_mass: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
                                        } border focus:ring-2 focus:ring-purple-500 transition`}
                                    placeholder="35.0"
                                />
                            </div>

                            <div>
                                <label className={`block mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.measurement_date}
                                    onChange={(e) => setFormData({ ...formData, measurement_date: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
                                        } border focus:ring-2 focus:ring-purple-500 transition`}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition transform hover:scale-105 disabled:opacity-50"
                        >
                            {loading ? 'Logging...' : 'Log Measurement'}
                        </button>
                    </form>
                </motion.div>
            )}

            {/* Latest Stats */}
            {latestMeasurement && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {latestMeasurement.weight && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                                } shadow-lg`}
                        >
                            <div className="text-3xl mb-2">⚖️</div>
                            <h4 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                Current Weight
                            </h4>
                            <p className={`text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent`}>
                                {latestMeasurement.weight} kg
                            </p>
                        </motion.div>
                    )}

                    {latestMeasurement.body_fat_percentage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                                } shadow-lg`}
                        >
                            <div className="text-3xl mb-2">📊</div>
                            <h4 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                Body Fat
                            </h4>
                            <p className={`text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent`}>
                                {latestMeasurement.body_fat_percentage}%
                            </p>
                        </motion.div>
                    )}

                    {latestMeasurement.muscle_mass && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                                } shadow-lg`}
                        >
                            <div className="text-3xl mb-2">💪</div>
                            <h4 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                Muscle Mass
                            </h4>
                            <p className={`text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent`}>
                                {latestMeasurement.muscle_mass} kg
                            </p>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Progress Chart */}
            {chartData.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                        } shadow-xl`}
                >
                    <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Progress Over Time
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
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
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                name="Weight (kg)"
                            />
                            <Line
                                type="monotone"
                                dataKey="bodyFat"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={{ fill: '#ef4444', r: 4 }}
                                name="Body Fat (%)"
                            />
                            <Line
                                type="monotone"
                                dataKey="muscle"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ fill: '#10b981', r: 4 }}
                                name="Muscle Mass (kg)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            )}

            {/* Measurement History */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                } shadow-xl`}>
                <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Measurement History
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Date</th>
                                <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Weight</th>
                                <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Body Fat</th>
                                <th className={`text-left py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Muscle Mass</th>
                            </tr>
                        </thead>
                        <tbody>
                            {measurements.length > 0 ? (
                                measurements.slice(0, 10).map((m, index) => (
                                    <motion.tr
                                        key={m.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-50 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {new Date(m.measurement_date).toLocaleDateString()}
                                        </td>
                                        <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {m.weight ? `${m.weight} kg` : '-'}
                                        </td>
                                        <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {m.body_fat_percentage ? `${m.body_fat_percentage}%` : '-'}
                                        </td>
                                        <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {m.muscle_mass ? `${m.muscle_mass} kg` : '-'}
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        No measurements logged yet. Start tracking your body composition!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BodyMeasurements;
