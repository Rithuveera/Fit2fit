import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initializeScheduler } from './reminderScheduler.js';
import { sendSubscriptionConfirmation, sendMealReminder } from './emailService.js';
import { sendSubscriptionConfirmationWhatsApp, testWhatsAppConnection, sendMealReminderWhatsApp } from './whatsappService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Setup
const dbPath = path.resolve(__dirname, 'gym.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Members Table
        db.run(`CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      goal TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Transactions Table
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_name TEXT NOT NULL,
      plan TEXT NOT NULL,
      amount TEXT NOT NULL,
      card_last4 TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Diet Reminders Table
        db.run(`CREATE TABLE IF NOT EXISTS diet_reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      name TEXT,
      phone_number TEXT,
      whatsapp_enabled INTEGER DEFAULT 0,
      class_type TEXT NOT NULL,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(email, class_type)
    )`);

        // Migration: Add phone_number and whatsapp_enabled columns if they don't exist
        db.all("PRAGMA table_info(diet_reminders)", (err, columns) => {
            if (err) {
                console.error('Error checking diet_reminders columns:', err);
                return;
            }

            const hasPhoneNumber = columns.some(col => col.name === 'phone_number');
            const hasWhatsappEnabled = columns.some(col => col.name === 'whatsapp_enabled');

            if (!hasPhoneNumber) {
                db.run("ALTER TABLE diet_reminders ADD COLUMN phone_number TEXT", (err) => {
                    if (err) console.error('Error adding phone_number column:', err);
                    else console.log('✅ Added phone_number column to diet_reminders table');
                });
            }

            if (!hasWhatsappEnabled) {
                db.run("ALTER TABLE diet_reminders ADD COLUMN whatsapp_enabled INTEGER DEFAULT 0", (err) => {
                    if (err) console.error('Error adding whatsapp_enabled column:', err);
                    else console.log('✅ Added whatsapp_enabled column to diet_reminders table');
                });
            }
        });

        // User Profiles (Gamification)
        db.run(`CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      points INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      total_workouts INTEGER DEFAULT 0,
      last_checkin DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Achievements
        db.run(`CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      category TEXT,
      points_reward INTEGER,
      requirement_type TEXT,
      requirement_value INTEGER
    )`);

        // User Achievements
        db.run(`CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      achievement_id INTEGER NOT NULL,
      unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (achievement_id) REFERENCES achievements(id)
    )`);

        // Workout Logs
        db.run(`CREATE TABLE IF NOT EXISTS workout_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      checkin_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      workout_type TEXT,
      points_earned INTEGER
    )`);

        // ============ ANALYTICS TABLES ============

        // Detailed Workout Sessions
        db.run(`CREATE TABLE IF NOT EXISTS workout_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      exercise TEXT NOT NULL,
      duration INTEGER,
      calories INTEGER,
      intensity TEXT,
      notes TEXT,
      workout_date DATE DEFAULT (date('now')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Body Measurements
        db.run(`CREATE TABLE IF NOT EXISTS body_measurements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      weight REAL,
      body_fat_percentage REAL,
      muscle_mass REAL,
      measurement_date DATE DEFAULT (date('now')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Fitness Goals
        db.run(`CREATE TABLE IF NOT EXISTS fitness_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      goal_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      target_value REAL,
      current_value REAL DEFAULT 0,
      target_date DATE,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    )`);

        // Exercise Library
        db.run(`CREATE TABLE IF NOT EXISTS exercise_library (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      category TEXT,
      avg_calories_per_30min INTEGER,
      description TEXT
    )`);

        // Seed achievements data
        seedAchievements();

        // Seed exercise library
        seedExerciseLibrary();
    });
}

// Seed exercise library
function seedExerciseLibrary() {
    const exercises = [
        { name: 'Running', category: 'Cardio', avg_calories_per_30min: 300, description: 'Outdoor or treadmill running' },
        { name: 'Cycling', category: 'Cardio', avg_calories_per_30min: 250, description: 'Stationary or outdoor cycling' },
        { name: 'Swimming', category: 'Cardio', avg_calories_per_30min: 350, description: 'Lap swimming' },
        { name: 'Weight Training', category: 'Strength', avg_calories_per_30min: 200, description: 'Resistance training with weights' },
        { name: 'Yoga', category: 'Flexibility', avg_calories_per_30min: 120, description: 'Yoga practice' },
        { name: 'HIIT', category: 'Cardio', avg_calories_per_30min: 400, description: 'High-Intensity Interval Training' },
        { name: 'Pilates', category: 'Strength', avg_calories_per_30min: 150, description: 'Core strengthening exercises' },
        { name: 'Boxing', category: 'Cardio', avg_calories_per_30min: 350, description: 'Boxing training' },
        { name: 'Dance', category: 'Cardio', avg_calories_per_30min: 250, description: 'Dance fitness classes' },
        { name: 'Rowing', category: 'Cardio', avg_calories_per_30min: 300, description: 'Rowing machine workout' },
        { name: 'CrossFit', category: 'Mixed', avg_calories_per_30min: 350, description: 'CrossFit WOD' },
        { name: 'Stretching', category: 'Flexibility', avg_calories_per_30min: 80, description: 'Stretching routine' }
    ];

    exercises.forEach(exercise => {
        db.run(
            `INSERT OR IGNORE INTO exercise_library (name, category, avg_calories_per_30min, description) 
             VALUES (?, ?, ?, ?)`,
            [exercise.name, exercise.category, exercise.avg_calories_per_30min, exercise.description]
        );
    });
}

// Seed achievements
function seedAchievements() {
    const achievements = [
        { name: 'First Step', description: 'Complete your first workout', icon: '🎯', category: 'Beginner', points_reward: 25, requirement_type: 'workouts', requirement_value: 1 },
        { name: 'Week Warrior', description: 'Maintain a 7-day workout streak', icon: '🔥', category: 'Intermediate', points_reward: 50, requirement_type: 'streak', requirement_value: 7 },
        { name: 'Month Master', description: 'Maintain a 30-day workout streak', icon: '👑', category: 'Advanced', points_reward: 100, requirement_type: 'streak', requirement_value: 30 },
        { name: 'Century Club', description: 'Complete 100 total workouts', icon: '💯', category: 'Elite', points_reward: 100, requirement_type: 'workouts', requirement_value: 100 },
        { name: 'Early Bird', description: 'Complete 10 morning workouts (before 8 AM)', icon: '🌅', category: 'Intermediate', points_reward: 40, requirement_type: 'morning_workouts', requirement_value: 10 },
        { name: 'Night Owl', description: 'Complete 10 evening workouts (after 7 PM)', icon: '🌙', category: 'Intermediate', points_reward: 40, requirement_type: 'evening_workouts', requirement_value: 10 },
        { name: 'Class Champion', description: 'Attend 50 classes', icon: '🏆', category: 'Advanced', points_reward: 75, requirement_type: 'workouts', requirement_value: 50 },
        { name: 'Diet Disciple', description: 'Subscribe to meal reminders', icon: '🥗', category: 'Beginner', points_reward: 20, requirement_type: 'meal_subscription', requirement_value: 1 },
        { name: 'Social Butterfly', description: 'Refer 5 friends', icon: '🦋', category: 'Advanced', points_reward: 80, requirement_type: 'referrals', requirement_value: 5 }
    ];

    achievements.forEach(achievement => {
        db.run(
            `INSERT OR IGNORE INTO achievements (name, description, icon, category, points_reward, requirement_type, requirement_value) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [achievement.name, achievement.description, achievement.icon, achievement.category, achievement.points_reward, achievement.requirement_type, achievement.requirement_value]
        );
    });
}

// API Routes

// Get all members
app.get('/api/members', (req, res) => {
    db.all('SELECT * FROM members ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Add a new member (Join Now)
app.post('/api/join', (req, res) => {
    const { name, email, phone, goal } = req.body;
    const sql = 'INSERT INTO members (name, email, phone, goal) VALUES (?,?,?,?)';
    const params = [name, email, phone, goal];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: { id: this.lastID }
        });
    });
});

// Get all transactions
app.get('/api/transactions', (req, res) => {
    db.all('SELECT * FROM transactions ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Add a new transaction (Payment)
app.post('/api/pay', (req, res) => {
    const { member_name, plan, amount, card_last4 } = req.body;
    const sql = 'INSERT INTO transactions (member_name, plan, amount, card_last4) VALUES (?,?,?,?)';
    const params = [member_name, plan, amount, card_last4];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: { id: this.lastID }
        });
    });
});

// Subscribe to diet reminders
app.post('/api/subscribe-reminders', async (req, res) => {
    const { email, name, class_type, phone_number, whatsapp_enabled } = req.body;

    if (!email || !class_type) {
        return res.status(400).json({ error: 'Email and class type are required' });
    }

    const sql = `INSERT INTO diet_reminders (email, name, class_type, phone_number, whatsapp_enabled, active) 
                 VALUES (?,?,?,?,?,1) 
                 ON CONFLICT(email, class_type) 
                 DO UPDATE SET active = 1, name = ?, phone_number = ?, whatsapp_enabled = ?`;
    const params = [email, name, class_type, phone_number || null, whatsapp_enabled ? 1 : 0, name, phone_number || null, whatsapp_enabled ? 1 : 0];

    db.run(sql, params, async function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        // Send confirmation email
        await sendSubscriptionConfirmation(email, name, class_type);

        // Send WhatsApp confirmation if enabled and phone number provided
        if (whatsapp_enabled && phone_number) {
            const whatsappResult = await sendSubscriptionConfirmationWhatsApp(phone_number, name, class_type);
            console.log('WhatsApp confirmation result:', whatsappResult);
        }

        res.json({
            message: 'success',
            data: {
                id: this.lastID,
                subscribed: true,
                whatsapp_enabled: whatsapp_enabled && !!phone_number
            }
        });
    });
});

// Unsubscribe from diet reminders
app.post('/api/unsubscribe-reminders', (req, res) => {
    const { email, class_type } = req.body;

    if (!email || !class_type) {
        return res.status(400).json({ error: 'Email and class type are required' });
    }

    const sql = 'UPDATE diet_reminders SET active = 0 WHERE email = ? AND class_type = ?';
    const params = [email, class_type];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: { unsubscribed: true }
        });
    });
});

// Get reminder status
app.get('/api/reminder-status/:email/:classType', (req, res) => {
    const { email, classType } = req.params;

    const sql = 'SELECT * FROM diet_reminders WHERE email = ? AND class_type = ? AND active = 1';
    const params = [email, classType];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: { subscribed: !!row, subscription: row }
        });
    });
});

// Test WhatsApp connection
app.post('/api/test-whatsapp', async (req, res) => {
    const { phone_number } = req.body;

    if (!phone_number) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    const result = await testWhatsAppConnection(phone_number);

    if (result.success) {
        res.json({
            message: 'success',
            data: { sent: true, messageId: result.messageId }
        });
    } else {
        res.status(500).json({
            message: 'error',
            error: result.error
        });
    }
});

// Test meal reminder (manual trigger)
app.post('/api/test-meal-reminder', async (req, res) => {
    const { email, phone_number, class_type } = req.body;

    if (!email || !class_type) {
        return res.status(400).json({ error: 'Email and class_type are required' });
    }

    try {
        // Get first meal for the class type
        const dietPlans = {
            'HIIT': { name: 'Breakfast', meal: 'Poha with peanuts, curry leaves & lemon', time: '7:00 AM' },
            'Yoga': { name: 'Breakfast', meal: 'Idli with sambar & coconut chutney', time: '7:30 AM' },
            'Strength': { name: 'Breakfast', meal: 'Egg bhurji (4 eggs) with multigrain roti', time: '7:00 AM' }
        };

        const meal = dietPlans[class_type];
        if (!meal) {
            return res.status(400).json({ error: 'Invalid class_type. Use: HIIT, Yoga, or Strength' });
        }

        // Send email
        await sendMealReminder(email, 'Test User', meal.name, meal.meal, meal.time, class_type);

        // Send WhatsApp if phone number provided
        let whatsappSent = false;
        if (phone_number) {
            const result = await sendMealReminderWhatsApp(phone_number, 'Test User', meal.name, meal.meal, meal.time, class_type);
            whatsappSent = result.success;
        }

        res.json({
            message: 'success',
            data: {
                email_sent: true,
                whatsapp_sent: whatsappSent,
                meal: meal
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'error',
            error: error.message
        });
    }
});

// ============ GAMIFICATION API ENDPOINTS ============

// Workout Check-in
app.post('/api/checkin', (req, res) => {
    const { user_id, name, email, workout_type } = req.body;

    if (!user_id || !name) {
        return res.status(400).json({ error: 'User ID and name are required' });
    }

    const today = new Date().toISOString().split('T')[0];
    const points_earned = workout_type === 'class' ? 15 : 10;

    // Get or create user profile
    db.get('SELECT * FROM user_profiles WHERE user_id = ?', [user_id], (err, user) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!user) {
            // Create new user profile
            db.run(
                'INSERT INTO user_profiles (user_id, name, email, points, level, current_streak, total_workouts, last_checkin) VALUES (?,?,?,?,1,1,1,?)',
                [user_id, name, email, points_earned, today],
                function (err) {
                    if (err) return res.status(400).json({ error: err.message });

                    // Log workout
                    db.run('INSERT INTO workout_logs (user_id, workout_type, points_earned) VALUES (?,?,?)',
                        [user_id, workout_type, points_earned]);

                    // Check for first workout achievement
                    checkAndUnlockAchievement(user_id, 'First Step');

                    res.json({
                        message: 'success',
                        data: { points_earned, current_streak: 1, total_workouts: 1, level: 1, new_achievements: ['First Step'] }
                    });
                }
            );
        } else {
            // Update existing user
            const lastCheckin = new Date(user.last_checkin);
            const todayDate = new Date(today);
            const daysDiff = Math.floor((todayDate - lastCheckin) / (1000 * 60 * 60 * 24));

            let newStreak = user.current_streak;
            let bonusPoints = 0;

            if (daysDiff === 1) {
                // Consecutive day
                newStreak = user.current_streak + 1;

                // Streak bonuses
                if (newStreak === 7) bonusPoints = 50;
                if (newStreak === 30) bonusPoints = 200;
            } else if (daysDiff > 1) {
                // Streak broken
                newStreak = 1;
            } else if (daysDiff === 0) {
                // Same day, no streak change
                newStreak = user.current_streak;
            }

            const totalPoints = user.points + points_earned + bonusPoints;
            const newLevel = calculateLevel(totalPoints);
            const longestStreak = Math.max(user.longest_streak, newStreak);
            const totalWorkouts = user.total_workouts + 1;

            db.run(
                `UPDATE user_profiles SET points = ?, level = ?, current_streak = ?, longest_streak = ?, 
                 total_workouts = ?, last_checkin = ? WHERE user_id = ?`,
                [totalPoints, newLevel, newStreak, longestStreak, totalWorkouts, today, user_id],
                (err) => {
                    if (err) return res.status(400).json({ error: err.message });

                    // Log workout
                    db.run('INSERT INTO workout_logs (user_id, workout_type, points_earned) VALUES (?,?,?)',
                        [user_id, workout_type, points_earned + bonusPoints]);

                    // Check for achievements
                    const newAchievements = [];
                    if (newStreak === 7) {
                        checkAndUnlockAchievement(user_id, 'Week Warrior');
                        newAchievements.push('Week Warrior');
                    }
                    if (newStreak === 30) {
                        checkAndUnlockAchievement(user_id, 'Month Master');
                        newAchievements.push('Month Master');
                    }
                    if (totalWorkouts === 50) {
                        checkAndUnlockAchievement(user_id, 'Class Champion');
                        newAchievements.push('Class Champion');
                    }
                    if (totalWorkouts === 100) {
                        checkAndUnlockAchievement(user_id, 'Century Club');
                        newAchievements.push('Century Club');
                    }

                    res.json({
                        message: 'success',
                        data: {
                            points_earned: points_earned + bonusPoints,
                            current_streak: newStreak,
                            total_workouts: totalWorkouts,
                            level: newLevel,
                            new_achievements: newAchievements
                        }
                    });
                }
            );
        }
    });
});

// Get user profile
app.get('/api/profile/:userId', (req, res) => {
    const { userId } = req.params;

    db.get('SELECT * FROM user_profiles WHERE user_id = ?', [userId], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: row || null
        });
    });
});

// Get user achievements
app.get('/api/achievements/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `
        SELECT a.*, ua.unlocked_at,
        CASE WHEN ua.id IS NOT NULL THEN 1 ELSE 0 END as unlocked
        FROM achievements a
        LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
        ORDER BY a.category, a.id
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
    const { period } = req.query; // 'weekly', 'monthly', 'all'

    let query = `
        SELECT user_id, name, points, level, current_streak, total_workouts
        FROM user_profiles
        ORDER BY points DESC
        LIMIT 10
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Helper function to calculate level
function calculateLevel(points) {
    if (points >= 1501) return 6; // Legend
    if (points >= 1001) return 5; // Elite
    if (points >= 601) return 4; // Advanced
    if (points >= 301) return 3; // Committed
    if (points >= 101) return 2; // Regular
    return 1; // Beginner
}

// Helper function to check and unlock achievement
function checkAndUnlockAchievement(userId, achievementName) {
    db.get('SELECT id FROM achievements WHERE name = ?', [achievementName], (err, achievement) => {
        if (err || !achievement) return;

        db.get(
            'SELECT * FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
            [userId, achievement.id],
            (err, existing) => {
                if (err || existing) return;

                // Unlock achievement
                db.run(
                    'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?,?)',
                    [userId, achievement.id]
                );

                // Award points
                db.run(
                    'UPDATE user_profiles SET points = points + ? WHERE user_id = ?',
                    [achievement.points_reward || 0, userId]
                );
            }
        );
    });
}

// ============ ANALYTICS API ENDPOINTS ============

// Get exercise library
app.get('/api/analytics/exercises', (req, res) => {
    db.all('SELECT * FROM exercise_library ORDER BY category, name', [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Log a workout session
app.post('/api/analytics/workout', (req, res) => {
    const { user_id, exercise, duration, calories, intensity, notes, workout_date } = req.body;

    if (!user_id || !exercise) {
        return res.status(400).json({ error: 'User ID and exercise are required' });
    }

    const sql = `INSERT INTO workout_sessions (user_id, exercise, duration, calories, intensity, notes, workout_date) 
                 VALUES (?,?,?,?,?,?,?)`;
    const params = [user_id, exercise, duration || 30, calories || 0, intensity || 'moderate', notes || '', workout_date || null];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { id: this.lastID }
        });
    });
});

// Get all workouts for a user
app.get('/api/analytics/workouts/:userId', (req, res) => {
    const { userId } = req.params;
    const { limit, offset } = req.query;

    const sql = `SELECT * FROM workout_sessions WHERE user_id = ? 
                 ORDER BY workout_date DESC, created_at DESC 
                 LIMIT ? OFFSET ?`;
    const params = [userId, limit || 100, offset || 0];

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get comprehensive stats for a user
app.get('/api/analytics/stats/:userId', (req, res) => {
    const { userId } = req.params;

    // Get total workouts
    db.get('SELECT COUNT(*) as total_workouts FROM workout_sessions WHERE user_id = ?', [userId], (err, workoutCount) => {
        if (err) return res.status(400).json({ error: err.message });

        // Get total calories
        db.get('SELECT SUM(calories) as total_calories FROM workout_sessions WHERE user_id = ?', [userId], (err, caloriesSum) => {
            if (err) return res.status(400).json({ error: err.message });

            // Get this month's workouts
            db.get(`SELECT COUNT(*) as month_workouts FROM workout_sessions 
                    WHERE user_id = ? AND strftime('%Y-%m', workout_date) = strftime('%Y-%m', 'now')`,
                [userId], (err, monthCount) => {
                    if (err) return res.status(400).json({ error: err.message });

                    // Get this year's workouts
                    db.get(`SELECT COUNT(*) as year_workouts FROM workout_sessions 
                        WHERE user_id = ? AND strftime('%Y', workout_date) = strftime('%Y', 'now')`,
                        [userId], (err, yearCount) => {
                            if (err) return res.status(400).json({ error: err.message });

                            // Get user profile for streak info
                            db.get('SELECT current_streak, longest_streak FROM user_profiles WHERE user_id = ?', [userId], (err, profile) => {
                                if (err) return res.status(400).json({ error: err.message });

                                res.json({
                                    message: 'success',
                                    data: {
                                        total_workouts: workoutCount.total_workouts || 0,
                                        total_calories: caloriesSum.total_calories || 0,
                                        month_workouts: monthCount.month_workouts || 0,
                                        year_workouts: yearCount.year_workouts || 0,
                                        current_streak: profile?.current_streak || 0,
                                        longest_streak: profile?.longest_streak || 0
                                    }
                                });
                            });
                        });
                });
        });
    });
});

// Get workout heatmap data for a year
app.get('/api/analytics/heatmap/:userId/:year', (req, res) => {
    const { userId, year } = req.params;

    const sql = `SELECT workout_date as date, COUNT(*) as count 
                 FROM workout_sessions 
                 WHERE user_id = ? AND strftime('%Y', workout_date) = ? 
                 GROUP BY workout_date 
                 ORDER BY workout_date`;

    db.all(sql, [userId, year], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Log body measurement
app.post('/api/analytics/measurement', (req, res) => {
    const { user_id, weight, body_fat_percentage, muscle_mass, measurement_date } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const sql = `INSERT INTO body_measurements (user_id, weight, body_fat_percentage, muscle_mass, measurement_date) 
                 VALUES (?,?,?,?,?)`;
    const params = [user_id, weight || null, body_fat_percentage || null, muscle_mass || null, measurement_date || null];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { id: this.lastID }
        });
    });
});

// Get measurement history
app.get('/api/analytics/measurements/:userId', (req, res) => {
    const { userId } = req.params;

    const sql = `SELECT * FROM body_measurements WHERE user_id = ? 
                 ORDER BY measurement_date DESC, created_at DESC`;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Create a fitness goal
app.post('/api/analytics/goal', (req, res) => {
    const { user_id, goal_type, title, description, target_value, target_date } = req.body;

    if (!user_id || !title || !goal_type) {
        return res.status(400).json({ error: 'User ID, title, and goal type are required' });
    }

    const sql = `INSERT INTO fitness_goals (user_id, goal_type, title, description, target_value, target_date) 
                 VALUES (?,?,?,?,?,?)`;
    const params = [user_id, goal_type, title, description || '', target_value || 0, target_date || null];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { id: this.lastID }
        });
    });
});

// Get all goals for a user
app.get('/api/analytics/goals/:userId', (req, res) => {
    const { userId } = req.params;

    const sql = `SELECT * FROM fitness_goals WHERE user_id = ? 
                 ORDER BY status ASC, target_date ASC`;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Update goal progress
app.put('/api/analytics/goal/:goalId', (req, res) => {
    const { goalId } = req.params;
    const { current_value, status } = req.body;

    let sql = 'UPDATE fitness_goals SET ';
    const params = [];
    const updates = [];

    if (current_value !== undefined) {
        updates.push('current_value = ?');
        params.push(current_value);
    }

    if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);

        if (status === 'completed') {
            updates.push('completed_at = CURRENT_TIMESTAMP');
        }
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No updates provided' });
    }

    sql += updates.join(', ') + ' WHERE id = ?';
    params.push(goalId);

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { updated: this.changes }
        });
    });
});

// Delete a goal
app.delete('/api/analytics/goal/:goalId', (req, res) => {
    const { goalId } = req.params;

    db.run('DELETE FROM fitness_goals WHERE id = ?', [goalId], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { deleted: this.changes }
        });
    });
});

// Generate report for a period
app.get('/api/analytics/report/:userId/:period', (req, res) => {
    const { userId, period } = req.params; // period: 'month' or 'year'

    const dateFilter = period === 'month'
        ? "strftime('%Y-%m', workout_date) = strftime('%Y-%m', 'now')"
        : "strftime('%Y', workout_date) = strftime('%Y', 'now')";

    // Get workout stats
    db.get(`SELECT 
                COUNT(*) as total_workouts,
                SUM(calories) as total_calories,
                AVG(duration) as avg_duration,
                exercise as most_common_exercise
            FROM workout_sessions 
            WHERE user_id = ? AND ${dateFilter}
            GROUP BY user_id
            ORDER BY COUNT(*) DESC
            LIMIT 1`,
        [userId], (err, workoutStats) => {
            if (err) return res.status(400).json({ error: err.message });

            // Get exercise breakdown
            db.all(`SELECT exercise, COUNT(*) as count, SUM(calories) as calories
                FROM workout_sessions 
                WHERE user_id = ? AND ${dateFilter}
                GROUP BY exercise
                ORDER BY count DESC`,
                [userId], (err, exerciseBreakdown) => {
                    if (err) return res.status(400).json({ error: err.message });

                    // Get most active day of week
                    db.get(`SELECT strftime('%w', workout_date) as day_of_week, COUNT(*) as count
                    FROM workout_sessions 
                    WHERE user_id = ? AND ${dateFilter}
                    GROUP BY day_of_week
                    ORDER BY count DESC
                    LIMIT 1`,
                        [userId], (err, mostActiveDay) => {
                            const sql = `SELECT workout_date as date, COUNT(*) as count 
                 FROM workout_sessions 
                 WHERE user_id = ? AND strftime('%Y', workout_date) = ? 
                 GROUP BY workout_date 
                 ORDER BY workout_date`;

                            db.all(sql, [userId, year], (err, rows) => {
                                if (err) {
                                    return res.status(400).json({ error: err.message });
                                }
                                res.json({
                                    message: 'success',
                                    data: rows
                                });
                            });
                        });

                    // Log body measurement
                    app.post('/api/analytics/measurement', (req, res) => {
                        const { user_id, weight, body_fat_percentage, muscle_mass, measurement_date } = req.body;

                        if (!user_id) {
                            return res.status(400).json({ error: 'User ID is required' });
                        }

                        const sql = `INSERT INTO body_measurements (user_id, weight, body_fat_percentage, muscle_mass, measurement_date) 
                 VALUES (?,?,?,?,?)`;
                        const params = [user_id, weight || null, body_fat_percentage || null, muscle_mass || null, measurement_date || null];

                        db.run(sql, params, function (err) {
                            if (err) {
                                return res.status(400).json({ error: err.message });
                            }
                            res.json({
                                message: 'success',
                                data: { id: this.lastID }
                            });
                        });
                    });

                    // Get measurement history
                    app.get('/api/analytics/measurements/:userId', (req, res) => {
                        const { userId } = req.params;

                        const sql = `SELECT * FROM body_measurements WHERE user_id = ? 
                 ORDER BY measurement_date DESC, created_at DESC`;

                        db.all(sql, [userId], (err, rows) => {
                            if (err) {
                                return res.status(400).json({ error: err.message });
                            }
                            res.json({
                                message: 'success',
                                data: rows
                            });
                        });
                    });

                    // Create a fitness goal
                    app.post('/api/analytics/goal', (req, res) => {
                        const { user_id, goal_type, title, description, target_value, target_date } = req.body;

                        if (!user_id || !title || !goal_type) {
                            return res.status(400).json({ error: 'User ID, title, and goal type are required' });
                        }

                        const sql = `INSERT INTO fitness_goals (user_id, goal_type, title, description, target_value, target_date) 
                 VALUES (?,?,?,?,?,?)`;
                        const params = [user_id, goal_type, title, description || '', target_value || 0, target_date || null];

                        db.run(sql, params, function (err) {
                            if (err) {
                                return res.status(400).json({ error: err.message });
                            }
                            res.json({
                                message: 'success',
                                data: { id: this.lastID }
                            });
                        });
                    });

                    // Get all goals for a user
                    app.get('/api/analytics/goals/:userId', (req, res) => {
                        const { userId } = req.params;

                        const sql = `SELECT * FROM fitness_goals WHERE user_id = ? 
                 ORDER BY status ASC, target_date ASC`;

                        db.all(sql, [userId], (err, rows) => {
                            if (err) {
                                return res.status(400).json({ error: err.message });
                            }
                            res.json({
                                message: 'success',
                                data: rows
                            });
                        });
                    });

                    // Update goal progress
                    app.put('/api/analytics/goal/:goalId', (req, res) => {
                        const { goalId } = req.params;
                        const { current_value, status } = req.body;

                        let sql = 'UPDATE fitness_goals SET ';
                        const params = [];
                        const updates = [];

                        if (current_value !== undefined) {
                            updates.push('current_value = ?');
                            params.push(current_value);
                        }

                        if (status !== undefined) {
                            updates.push('status = ?');
                            params.push(status);

                            if (status === 'completed') {
                                updates.push('completed_at = CURRENT_TIMESTAMP');
                            }
                        }

                        if (updates.length === 0) {
                            return res.status(400).json({ error: 'No updates provided' });
                        }

                        sql += updates.join(', ') + ' WHERE id = ?';
                        params.push(goalId);

                        db.run(sql, params, function (err) {
                            if (err) {
                                return res.status(400).json({ error: err.message });
                            }
                            res.json({
                                message: 'success',
                                data: { updated: this.changes }
                            });
                        });
                    });

                    // Delete a goal
                    app.delete('/api/analytics/goal/:goalId', (req, res) => {
                        const { goalId } = req.params;

                        db.run('DELETE FROM fitness_goals WHERE id = ?', [goalId], function (err) {
                            if (err) {
                                return res.status(400).json({ error: err.message });
                            }
                            res.json({
                                message: 'success',
                                data: { deleted: this.changes }
                            });
                        });
                    });

                    // Generate report for a period
                    app.get('/api/analytics/report/:userId/:period', (req, res) => {
                        const { userId, period } = req.params; // period: 'month' or 'year'

                        const dateFilter = period === 'month'
                            ? "strftime('%Y-%m', workout_date) = strftime('%Y-%m', 'now')"
                            : "strftime('%Y', workout_date) = strftime('%Y', 'now')";

                        // Get workout stats
                        db.get(`SELECT 
                COUNT(*) as total_workouts,
                SUM(calories) as total_calories,
                AVG(duration) as avg_duration,
                exercise as most_common_exercise
            FROM workout_sessions 
            WHERE user_id = ? AND ${dateFilter}
            GROUP BY user_id
            ORDER BY COUNT(*) DESC
            LIMIT 1`,
                            [userId], (err, workoutStats) => {
                                if (err) return res.status(400).json({ error: err.message });

                                // Get exercise breakdown
                                db.all(`SELECT exercise, COUNT(*) as count, SUM(calories) as calories
                FROM workout_sessions 
                WHERE user_id = ? AND ${dateFilter}
                GROUP BY exercise
                ORDER BY count DESC`,
                                    [userId], (err, exerciseBreakdown) => {
                                        if (err) return res.status(400).json({ error: err.message });

                                        // Get most active day of week
                                        db.get(`SELECT strftime('%w', workout_date) as day_of_week, COUNT(*) as count
                    FROM workout_sessions 
                    WHERE user_id = ? AND ${dateFilter}
                    GROUP BY day_of_week
                    ORDER BY count DESC
                    LIMIT 1`,
                                            [userId], (err, mostActiveDay) => {
                                                if (err) return res.status(400).json({ error: err.message });

                                                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                                                res.json({
                                                    message: 'success',
                                                    data: {
                                                        period,
                                                        workout_stats: workoutStats || {},
                                                        exercise_breakdown: exerciseBreakdown || [],
                                                        most_active_day: mostActiveDay ? dayNames[mostActiveDay.day_of_week] : 'N/A'
                                                    }
                                                });
                                            });
                                    });
                            });
                    });

                    // Serve static files from the dist directory (Vite build output)
                    app.use(express.static(path.join(__dirname, 'dist')));

                    // Catch-all route to serve index.html for client-side routing
                    app.get('*', (req, res) => {
                        // Don't serve index.html for API routes
                        if (req.path.startsWith('/api')) {
                            return res.status(404).json({ error: 'API endpoint not found' });
                        }
                        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
                    });

                    // Start Server
                    app.listen(PORT, () => {
                        console.log(`Server running on port ${PORT}`);

                        // Initialize meal reminder scheduler
                        initializeScheduler();
                    });
