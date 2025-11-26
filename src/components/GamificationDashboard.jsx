import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const GamificationDashboard = () => {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [showCheckinModal, setShowCheckinModal] = useState(false);
    const [checkinMessage, setCheckinMessage] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Load user ID from localStorage or generate new one
        let storedUserId = localStorage.getItem('gamification_user_id');
        if (!storedUserId) {
            storedUserId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('gamification_user_id', storedUserId);
        }
        setUserId(storedUserId);

        const storedName = localStorage.getItem('gamification_user_name');
        if (storedName) {
            setUserName(storedName);
            loadUserData(storedUserId);
        }
    }, []);

    const loadUserData = async (uid) => {
        try {
            const [profileRes, achievementsRes, leaderboardRes] = await Promise.all([
                axios.get(`/api/profile/${uid}`),
                axios.get(`/api/achievements/${uid}`),
                axios.get(`/api/leaderboard`)
            ]);

            setUserProfile(profileRes.data.data);
            setAchievements(achievementsRes.data.data);
            setLeaderboard(leaderboardRes.data.data);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const handleCheckin = async () => {
        if (!userName.trim()) {
            setCheckinMessage('Please enter your name first!');
            return;
        }

        try {
            const response = await axios.post('/api/checkin', {
                user_id: userId,
                name: userName,
                workout_type: 'general'
            });

            localStorage.setItem('gamification_user_name', userName);

            const data = response.data.data;
            let message = `🎉 +${data.points_earned} points! Streak: ${data.current_streak} days`;

            if (data.new_achievements && data.new_achievements.length > 0) {
                message += `\n🏆 New Achievement: ${data.new_achievements.join(', ')}!`;
            }

            setCheckinMessage(message);
            setTimeout(() => {
                setCheckinMessage('');
                loadUserData(userId);
            }, 3000);
        } catch (error) {
            setCheckinMessage('❌ Check-in failed. Try again!');
        }
    };

    const getLevelName = (level) => {
        const levels = ['', 'Beginner', 'Regular', 'Committed', 'Advanced', 'Elite', 'Legend'];
        return levels[level] || 'Beginner';
    };

    const getProgressToNextLevel = () => {
        if (!userProfile) return 0;
        const levelThresholds = [0, 101, 301, 601, 1001, 1501];
        const currentThreshold = levelThresholds[userProfile.level - 1] || 0;
        const nextThreshold = levelThresholds[userProfile.level] || 2000;
        const progress = ((userProfile.points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
        return Math.min(progress, 100);
    };

    return (
        <section id="gamification" className="py-20 bg-gray-100 dark:bg-gradient-to-br dark:from-black dark:to-gray-900 relative overflow-hidden min-h-screen flex flex-col justify-center transition-colors duration-300">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #39ff14 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4 font-orbitron tracking-wider transition-colors duration-300">
                        GAMIFICATION <span className="text-neon-green">ZONE</span>
                    </h2>
                    <div className="h-1 w-24 bg-neon-green mx-auto mb-6" />
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg transition-colors duration-300">
                        Track your progress, earn achievements, and compete with others!
                    </p>
                </motion.div>

                {/* User Setup / Check-in */}
                {!userProfile && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto bg-gray-800 rounded-2xl p-8 border-2 border-neon-green shadow-2xl mb-12"
                    >
                        <h3 className="text-2xl font-bold text-white mb-4 text-center">Start Your Journey!</h3>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-neon-green focus:outline-none mb-4"
                        />
                        <button
                            onClick={handleCheckin}
                            className="w-full bg-neon-green text-black font-bold py-3 px-6 rounded-lg hover:bg-green-400 transition duration-300"
                        >
                            🏋️ Check In Now
                        </button>
                        {checkinMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-200 text-sm whitespace-pre-line"
                            >
                                {checkinMessage}
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Main Dashboard */}
                {userProfile && (
                    <div className="space-y-8">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-center"
                            >
                                <div className="text-4xl mb-2">⭐</div>
                                <div className="text-3xl font-bold text-white">{userProfile.points}</div>
                                <div className="text-sm text-white/80">Total Points</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-center"
                            >
                                <div className="text-4xl mb-2">🏆</div>
                                <div className="text-3xl font-bold text-white">Level {userProfile.level}</div>
                                <div className="text-sm text-white/80">{getLevelName(userProfile.level)}</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-6 text-center"
                            >
                                <div className="text-4xl mb-2">🔥</div>
                                <div className="text-3xl font-bold text-white">{userProfile.current_streak}</div>
                                <div className="text-sm text-white/80">Day Streak</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-6 text-center"
                            >
                                <div className="text-4xl mb-2">💪</div>
                                <div className="text-3xl font-bold text-white">{userProfile.total_workouts}</div>
                                <div className="text-sm text-white/80">Total Workouts</div>
                            </motion.div>
                        </div>

                        {/* Check-in Button & Progress */}
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2">Welcome back, {userProfile.name}!</h3>
                                    <p className="text-gray-400 text-sm">Progress to Level {userProfile.level + 1}</p>
                                    <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
                                        <div
                                            className="bg-gradient-to-r from-neon-green to-green-400 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${getProgressToNextLevel()}%` }}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckin}
                                    className="bg-neon-green text-black font-bold py-3 px-8 rounded-lg hover:bg-green-400 transition duration-300 whitespace-nowrap"
                                >
                                    🏋️ Check In Today
                                </button>
                            </div>
                            {checkinMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-200 text-sm whitespace-pre-line"
                                >
                                    {checkinMessage}
                                </motion.div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-4 border-b border-gray-700">
                            {['achievements', 'leaderboard'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 px-4 font-semibold transition-all duration-300 relative ${activeTab === tab
                                        ? 'text-neon-green'
                                        : 'text-gray-400 hover:text-gray-300'
                                        }`}
                                >
                                    {tab === 'achievements' ? '🏆 Achievements' : '📊 Leaderboard'}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-green" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            {activeTab === 'achievements' && (
                                <motion.div
                                    key="achievements"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                >
                                    {achievements.map((achievement) => (
                                        <div
                                            key={achievement.id}
                                            className={`rounded-xl p-6 border-2 ${achievement.unlocked
                                                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500'
                                                : 'bg-gray-800 border-gray-700 opacity-60'
                                                }`}
                                        >
                                            <div className="text-5xl mb-3 text-center">{achievement.icon}</div>
                                            <h4 className="text-lg font-bold text-white text-center mb-2">
                                                {achievement.name}
                                            </h4>
                                            <p className="text-sm text-gray-400 text-center mb-3">
                                                {achievement.description}
                                            </p>
                                            <div className="text-center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${achievement.unlocked
                                                    ? 'bg-neon-green text-black'
                                                    : 'bg-gray-700 text-gray-400'
                                                    }`}>
                                                    {achievement.unlocked ? '✓ Unlocked' : `🔒 ${achievement.points_reward} pts`}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'leaderboard' && (
                                <motion.div
                                    key="leaderboard"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-white mb-6">🏆 Top Performers</h3>
                                        <div className="space-y-3">
                                            {leaderboard.map((user, index) => (
                                                <div
                                                    key={user.user_id}
                                                    className={`flex items-center gap-4 p-4 rounded-lg ${user.user_id === userId
                                                        ? 'bg-neon-green/20 border-2 border-neon-green'
                                                        : 'bg-gray-700'
                                                        }`}
                                                >
                                                    <div className={`text-2xl font-bold ${index === 0 ? 'text-yellow-400' :
                                                        index === 1 ? 'text-gray-300' :
                                                            index === 2 ? 'text-orange-400' :
                                                                'text-gray-500'
                                                        }`}>
                                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-white">{user.name}</div>
                                                        <div className="text-sm text-gray-400">
                                                            Level {user.level} • {user.total_workouts} workouts
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-neon-green">{user.points}</div>
                                                        <div className="text-xs text-gray-400">points</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </section>
    );
};

export default GamificationDashboard;
