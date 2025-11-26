import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const WorkoutHeatmap = ({ userId }) => {
    const { isDark } = useContext(ThemeContext);
    const [heatmapData, setHeatmapData] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (userId) {
            fetchHeatmapData();
        }
    }, [userId, year]);

    const fetchHeatmapData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/analytics/heatmap/${userId}/${year}`);
            setHeatmapData(response.data.data);
        } catch (error) {
            console.error('Error fetching heatmap data:', error);
        }
    };

    // Create a simple grid-based heatmap
    const generateHeatmapGrid = () => {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        const days = [];

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const dataPoint = heatmapData.find(item => item.date === dateStr);
            days.push({
                date: new Date(d),
                dateStr,
                count: dataPoint ? dataPoint.count : 0
            });
        }

        return days;
    };

    const getColorForCount = (count) => {
        if (count === 0) return isDark ? 'bg-gray-700' : 'bg-gray-200';
        if (count === 1) return 'bg-green-200';
        if (count === 2) return 'bg-green-400';
        if (count === 3) return 'bg-green-600';
        return 'bg-green-800';
    };

    const days = generateHeatmapGrid();
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700' : 'bg-white border border-gray-200'
                } shadow-xl`}
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Workout Frequency Heatmap
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setYear(year - 1)}
                        className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                            } transition`}
                    >
                        ←
                    </button>
                    <span className={`px-4 py-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {year}
                    </span>
                    <button
                        onClick={() => setYear(year + 1)}
                        disabled={year >= new Date().getFullYear()}
                        className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                            } transition disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                    <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
                        {days.map((day, index) => (
                            <div
                                key={index}
                                className={`w-3 h-3 rounded-sm ${getColorForCount(day.count)} hover:ring-2 hover:ring-purple-500 transition cursor-pointer`}
                                title={`${day.dateStr}: ${day.count} workout${day.count !== 1 ? 's' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Less</span>
                <div className="flex gap-1">
                    <div className={`w-4 h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className="w-4 h-4 rounded bg-green-200"></div>
                    <div className="w-4 h-4 rounded bg-green-400"></div>
                    <div className="w-4 h-4 rounded bg-green-600"></div>
                    <div className="w-4 h-4 rounded bg-green-800"></div>
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>More</span>
            </div>
        </motion.div>
    );
};

export default WorkoutHeatmap;
