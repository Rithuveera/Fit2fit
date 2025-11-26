import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const WorkoutLogger = () => {
    const [userEmail, setUserEmail] = useState('');
    const [exercises, setExercises] = useState([]);
    const [formData, setFormData] = useState({
        exercise: '',
        duration: '',
        intensity: 'moderate',
        notes: '',
        workout_date: new Date().toISOString().split('T')[0]
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem('analytics_user_email');
        if (savedEmail) {
            setUserEmail(savedEmail);
        }
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/analytics/exercises');
            setExercises(response.data.data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
            setExercises([
                { id: 1, name: 'Running', category: 'Cardio', avg_calories_per_30min: 300 },
                { id: 2, name: 'Cycling', category: 'Cardio', avg_calories_per_30min: 250 },
                { id: 3, name: 'Swimming', category: 'Cardio', avg_calories_per_30min: 350 },
                { id: 4, name: 'Weight Training', category: 'Strength', avg_calories_per_30min: 200 },
                { id: 5, name: 'Yoga', category: 'Flexibility', avg_calories_per_30min: 120 },
                { id: 6, name: 'HIIT', category: 'Cardio', avg_calories_per_30min: 400 },
                { id: 7, name: 'Pilates', category: 'Strength', avg_calories_per_30min: 150 },
                { id: 8, name: 'Boxing', category: 'Cardio', avg_calories_per_30min: 350 },
                { id: 9, name: 'Dance', category: 'Cardio', avg_calories_per_30min: 250 },
                { id: 10, name: 'Rowing', category: 'Cardio', avg_calories_per_30min: 300 },
                { id: 11, name: 'CrossFit', category: 'Mixed', avg_calories_per_30min: 350 },
                { id: 12, name: 'Stretching', category: 'Flexibility', avg_calories_per_30min: 80 }
            ]);
        }
    };

    const calculateCalories = (exercise, duration) => {
        const exerciseData = exercises.find(e => e.name === exercise);
        if (exerciseData && duration) {
            return Math.round((exerciseData.avg_calories_per_30min / 30) * duration);
        }
        return 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userEmail) {
            setMessage({ type: 'error', text: 'Please enter your email first' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        const calories = calculateCalories(formData.exercise, formData.duration);
        const workout = {
            id: Date.now(),
            user_id: userEmail,
            exercise: formData.exercise,
            duration: parseInt(formData.duration),
            calories: calories,
            intensity: formData.intensity,
            notes: formData.notes,
            workout_date: formData.workout_date,
            created_at: new Date().toISOString()
        };

        try {
            await axios.post('http://localhost:3000/api/analytics/workout', workout);
            setMessage({ type: 'success', text: '✅ Workout logged successfully!' });
        } catch (error) {
            console.error('API error, saving to localStorage:', error);
            const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
            savedWorkouts.push(workout);
            localStorage.setItem('workouts', JSON.stringify(savedWorkouts));
            setMessage({ type: 'success', text: '✅ Workout logged successfully (saved locally)!' });
        } finally {
            setLoading(false);
            setFormData({
                exercise: '',
                duration: '',
                intensity: 'moderate',
                notes: '',
                workout_date: new Date().toISOString().split('T')[0]
            });
        }
    };

    const selectedExercise = exercises.find(e => e.name === formData.exercise);
    const estimatedCalories = calculateCalories(formData.exercise, formData.duration);

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black min-h-screen transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4 font-orbitron">
                        LOG YOUR <span className="text-neon-green">WORKOUT</span>
                    </h1>
                    <div className="h-1 w-24 bg-neon-green mx-auto mb-6"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Track your fitness journey and watch your progress grow!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Workout Details</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Email</label>
                                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-neon-green transition"
                                    placeholder="your@email.com" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exercise Type</label>
                                <select value={formData.exercise} onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-neon-green transition" required>
                                    <option value="">Select an exercise</option>
                                    {exercises.map((exercise) => (
                                        <option key={exercise.id} value={exercise.name}>{exercise.name} ({exercise.category})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (minutes)</label>
                                <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-neon-green transition"
                                    placeholder="30" min="1" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Intensity Level</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['light', 'moderate', 'intense'].map((level) => (
                                        <button key={level} type="button" onClick={() => setFormData({ ...formData, intensity: level })}
                                            className={`py-2 px-4 rounded-lg font-semibold transition ${formData.intensity === level
                                                ? 'bg-neon-green text-black' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workout Date</label>
                                <input type="date" value={formData.workout_date} onChange={(e) => setFormData({ ...formData, workout_date: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-neon-green transition" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (optional)</label>
                                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-neon-green transition"
                                    placeholder="How did you feel? Any achievements?" rows="3" />
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-green-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Logging Workout...' : '💪 Log Workout'}
                            </button>
                        </form>

                        {message.text && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                className={`mt-4 p-3 rounded-lg text-sm ${message.type === 'success'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'}`}>
                                {message.text}
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
                        {formData.exercise && formData.duration && (
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                                <div className="text-4xl mb-3">🔥</div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Estimated Calories</h3>
                                <p className="text-4xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                                    {estimatedCalories} kcal
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Based on {formData.duration} minutes of {formData.exercise}
                                </p>
                            </div>
                        )}

                        {selectedExercise && (
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                                <div className="text-4xl mb-3">💡</div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{selectedExercise.name}</h3>
                                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    <p><strong>Category:</strong> {selectedExercise.category}</p>
                                    <p><strong>Avg. Calories:</strong> {selectedExercise.avg_calories_per_30min} kcal per 30 min</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <span>📊</span> Track Your Progress
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-green mt-0.5">✓</span>
                                    <span>Log workouts consistently to build streaks</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-green mt-0.5">✓</span>
                                    <span>View your analytics dashboard to see progress</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-neon-green mt-0.5">✓</span>
                                    <span>Workouts are saved locally and will sync when API is available</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WorkoutLogger;
