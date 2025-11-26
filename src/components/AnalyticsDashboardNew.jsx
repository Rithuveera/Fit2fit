import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsDashboard = () => {
    const [userEmail, setUserEmail] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [stats, setStats] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem('analytics_user_email');
        if (savedEmail) {
            setUserEmail(savedEmail);
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated && userEmail) {
            fetchData();
        }
    }, [isAuthenticated, userEmail]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, workoutsRes] = await Promise.all([
                axios.get(`http://localhost:3000/api/analytics/stats/${userEmail}`),
                axios.get(`http://localhost:3000/api/analytics/workouts/${userEmail}`)
            ]);

            setStats(statsRes.data.data);
            setWorkouts(workoutsRes.data.data);
        } catch (error) {
            console.error('Error fetching analytics data, using localStorage:', error);

            // Fallback to localStorage
            const localWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
            const userWorkouts = localWorkouts.filter(w => w.user_id === userEmail);

            // Calculate stats from local data
            const totalWorkouts = userWorkouts.length;
            const totalCalories = userWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);

            // Calculate current month workouts
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const monthWorkouts = userWorkouts.filter(w => {
                const workoutDate = new Date(w.workout_date);
                return workoutDate.getMonth() === currentMonth && workoutDate.getFullYear() === currentYear;
            }).length;

            // Calculate streak
            const sortedDates = [...new Set(userWorkouts.map(w => w.workout_date))].sort().reverse();
            let currentStreak = 0;
            if (sortedDates.length > 0) {
                const today = new Date().toISOString().split('T')[0];
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

                if (sortedDates[0] === today || sortedDates[0] === yesterday) {
                    currentStreak = 1;
                    for (let i = 1; i < sortedDates.length; i++) {
                        const prevDate = new Date(sortedDates[i - 1]);
                        const currDate = new Date(sortedDates[i]);
                        const diffDays = Math.floor((prevDate - currDate) / 86400000);
                        if (diffDays === 1) {
                            currentStreak++;
                        } else {
                            break;
                        }
                    }
                }
            }

            setStats({
                total_workouts: totalWorkouts,
                total_calories: totalCalories,
                current_streak: currentStreak,
                month_workouts: monthWorkouts
            });

            setWorkouts(userWorkouts.sort((a, b) => new Date(b.workout_date) - new Date(a.workout_date)));
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (userEmail) {
            localStorage.setItem('analytics_user_email', userEmail);
            setIsAuthenticated(true);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('analytics_user_email');
        setIsAuthenticated(false);
        setUserEmail('');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md mx-auto">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">📊</div>
                            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                                Analytics Dashboard
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">Track your fitness journey</p>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Email Address</label>
                                <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="your@email.com" required />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Enter the email you used for logging workouts</p>
                            </div>
                            <button type="submit"
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition transform hover:scale-105 shadow-lg">
                                View My Analytics
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                        Analytics Dashboard
                    </h1>
                    <button onClick={handleLogout}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                        Logout
                    </button>
                </div>

                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Welcome, {userEmail}!</p>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-3xl mb-2">💪</div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Workouts</h3>
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                                    {stats?.total_workouts || 0}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-3xl mb-2">🔥</div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Calories</h3>
                                <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                                    {stats?.total_calories?.toLocaleString() || 0}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-3xl mb-2">⚡</div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Current Streak</h3>
                                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
                                    {stats?.current_streak || 0} days
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="text-3xl mb-2">📅</div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">This Month</h3>
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                                    {stats?.month_workouts || 0}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recent Workouts</h2>
                            {workouts.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Date</th>
                                                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Exercise</th>
                                                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Duration</th>
                                                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Calories</th>
                                                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Intensity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {workouts.slice(0, 10).map((workout) => (
                                                <tr key={workout.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                                                        {new Date(workout.workout_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{workout.exercise}</td>
                                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{workout.duration} min</td>
                                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{workout.calories} kcal</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${workout.intensity === 'intense' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                                workout.intensity === 'moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            }`}>
                                                            {workout.intensity}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No workouts logged yet</p>
                                    <p className="text-gray-500 dark:text-gray-500 text-sm">Start logging your workouts to see your progress here!</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 Your Data</h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <span>Your workouts are saved locally in your browser</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <span>Use the same email when logging workouts to see them here</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <span>Stats are calculated automatically from your logged workouts</span>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
