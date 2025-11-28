import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import { initializeScheduler } from './reminderScheduler.js';
import { sendSubscriptionConfirmation, sendMealReminder } from './emailService.js';
import { sendSubscriptionConfirmationWhatsApp, sendMealReminderWhatsApp } from './whatsappService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Database Tables
async function initDb() {
    try {
        console.log('Initializing Database...');

        // Members Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS members (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(50),
                goal VARCHAR(255),
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Transactions Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                member_id INTEGER REFERENCES members(id),
                amount DECIMAL(10, 2) NOT NULL,
                type VARCHAR(50) NOT NULL,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Diet Reminders Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS diet_reminders (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                class_type VARCHAR(50) NOT NULL,
                phone_number VARCHAR(50),
                whatsapp_enabled BOOLEAN DEFAULT FALSE,
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(email, class_type)
            )
        `);

        // Gamification Tables
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_profiles (
                user_id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                points INTEGER DEFAULT 0,
                level INTEGER DEFAULT 1,
                current_streak INTEGER DEFAULT 0,
                longest_streak INTEGER DEFAULT 0,
                total_workouts INTEGER DEFAULT 0,
                last_checkin DATE
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS workout_logs (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) REFERENCES user_profiles(user_id),
                workout_type VARCHAR(50),
                points_earned INTEGER,
                logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS achievements (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                icon VARCHAR(50),
                category VARCHAR(50)
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS user_achievements (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) REFERENCES user_profiles(user_id),
                achievement_id INTEGER REFERENCES achievements(id),
                unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, achievement_id)
            )
        `);

        // Analytics Tables
        await db.query(`
            CREATE TABLE IF NOT EXISTS body_measurements (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                weight DECIMAL(5,2),
                body_fat_percentage DECIMAL(4,1),
                muscle_mass DECIMAL(5,2),
                measurement_date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS fitness_goals (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                goal_type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                target_value DECIMAL(10,2),
                current_value DECIMAL(10,2) DEFAULT 0,
                start_date DATE DEFAULT CURRENT_DATE,
                target_date DATE,
                status VARCHAR(20) DEFAULT 'in_progress',
                completed_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS workout_sessions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                exercise VARCHAR(255) NOT NULL,
                duration INTEGER,
                calories INTEGER,
                workout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Seed Achievements
        const achievementsCount = await db.query('SELECT COUNT(*) FROM achievements');
        if (parseInt(achievementsCount.rows[0].count) === 0) {
            console.log('Seeding achievements...');
            const achievements = [
                ['First Step', 'Complete your first workout', '🎯', 'milestone'],
                ['Week Warrior', 'Maintain a 7-day streak', '🔥', 'streak'],
                ['Month Master', 'Maintain a 30-day streak', '👑', 'streak'],
                ['Class Champion', 'Complete 50 workouts', '💪', 'milestone'],
                ['Century Club', 'Complete 100 workouts', '💯', 'milestone']
            ];
            for (const [name, desc, icon, cat] of achievements) {
                await db.query(
                    'INSERT INTO achievements (name, description, icon, category) VALUES ($1, $2, $3, $4)',
                    [name, desc, icon, cat]
                );
            }
        }

        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

// --- API Endpoints ---

// Members
app.get('/api/members', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM members ORDER BY joined_at DESC');
        res.json({ message: 'success', data: result.rows });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/join', async (req, res) => {
    const { name, email, phone, goal } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO members (name, email, phone, goal) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, email, phone, goal]
        );
        res.json({ message: 'success', data: { id: result.rows[0].id } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM transactions ORDER BY date DESC');
        res.json({ message: 'success', data: result.rows });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/pay', async (req, res) => {
    const { member_id, amount, type } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO transactions (member_id, amount, type) VALUES ($1, $2, $3) RETURNING id',
            [member_id, amount, type]
        );
        res.json({ message: 'success', data: { id: result.rows[0].id } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Reminders
app.post('/api/subscribe-reminders', async (req, res) => {
    const { email, name, class_type, phone_number, whatsapp_enabled } = req.body;
    if (!email || !class_type) return res.status(400).json({ error: 'Email and class type required' });

    try {
        const result = await db.query(
            `INSERT INTO diet_reminders (email, name, class_type, phone_number, whatsapp_enabled, active) 
             VALUES ($1, $2, $3, $4, $5, TRUE) 
             ON CONFLICT(email, class_type) 
             DO UPDATE SET active = TRUE, name = $6, phone_number = $7, whatsapp_enabled = $8
             RETURNING id`,
            [email, name, class_type, phone_number || null, whatsapp_enabled ? true : false, name, phone_number || null, whatsapp_enabled ? true : false]
        );

        // Send confirmations
        try {
            await sendSubscriptionConfirmation(email, name, class_type);
            if (whatsapp_enabled && phone_number) {
                await sendSubscriptionConfirmationWhatsApp(phone_number, name, class_type);
            }
        } catch (msgErr) {
            console.error("Error sending confirmation:", msgErr);
        }

        res.json({ message: 'success', data: { id: result.rows[0].id, subscribed: true } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/reminder-status/:email/:classType', async (req, res) => {
    const { email, classType } = req.params;
    try {
        const result = await db.query(
            'SELECT * FROM diet_reminders WHERE email = $1 AND class_type = $2 AND active = TRUE',
            [email, classType]
        );
        res.json({ message: 'success', data: { subscribed: result.rows.length > 0, subscription: result.rows[0] } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/unsubscribe-reminders', async (req, res) => {
    const { email, class_type } = req.body;
    if (!email || !class_type) return res.status(400).json({ error: 'Email and class type required' });

    try {
        await db.query(
            'UPDATE diet_reminders SET active = FALSE WHERE email = $1 AND class_type = $2',
            [email, class_type]
        );
        res.json({ message: 'success', data: { unsubscribed: true } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Test endpoint to send a meal reminder immediately
app.post('/api/test-meal-reminder', async (req, res) => {
    const { email, class_type } = req.body;

    if (!email || !class_type) {
        return res.status(400).json({ error: 'Email and class_type are required' });
    }

    try {
        // Get subscriber info
        const result = await db.query(
            'SELECT * FROM diet_reminders WHERE email = $1 AND class_type = $2 AND active = TRUE',
            [email, class_type]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No active subscription found for this email and class type' });
        }

        const subscriber = result.rows[0];

        // Sample meal data for testing
        const testMeals = {
            'HIIT': { name: 'Breakfast', meal: 'Poha with peanuts, curry leaves & lemon', time: '7:00 AM' },
            'Yoga': { name: 'Breakfast', meal: 'Idli with sambar & coconut chutney', time: '7:30 AM' },
            'Strength': { name: 'Breakfast', meal: 'Egg bhurji (4 eggs) with multigrain roti', time: '7:00 AM' }
        };

        const testMeal = testMeals[class_type] || testMeals['HIIT'];

        // Send email reminder
        const emailResult = await sendMealReminder(
            subscriber.email,
            subscriber.name || 'Fitness Enthusiast',
            testMeal.name,
            testMeal.meal,
            testMeal.time,
            class_type
        );

        // Send WhatsApp reminder if enabled
        let whatsappResult = { success: false, skipped: true };
        if (subscriber.whatsapp_enabled && subscriber.phone_number) {
            whatsappResult = await sendMealReminderWhatsApp(
                subscriber.phone_number,
                subscriber.name || 'Fitness Enthusiast',
                testMeal.name,
                testMeal.meal,
                testMeal.time,
                class_type
            );
        }

        res.json({
            message: (emailResult.success || whatsappResult.success) ? 'success' : 'partial_failure',
            data: {
                email_sent: emailResult.success,
                email_error: emailResult.error,
                whatsapp_sent: whatsappResult.success,
                whatsapp_error: whatsappResult.error,
                meal: testMeal
            }
        });
    } catch (err) {
        console.error('Test reminder error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Gamification
function calculateLevel(points) {
    return Math.floor(points / 100) + 1;
}

async function checkAndUnlockAchievement(userId, achievementName) {
    try {
        const achResult = await db.query('SELECT id FROM achievements WHERE name = $1', [achievementName]);
        if (achResult.rows.length === 0) return;
        const achievementId = achResult.rows[0].id;

        await db.query(
            'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userId, achievementId]
        );
    } catch (err) {
        console.error('Error unlocking achievement:', err);
    }
}

app.post('/api/checkin', async (req, res) => {
    const { user_id, name, email, workout_type } = req.body;
    if (!user_id || !name) return res.status(400).json({ error: 'User ID and name required' });

    const today = new Date().toISOString().split('T')[0];
    const points_earned = workout_type === 'class' ? 15 : 10;

    try {
        const userResult = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [user_id]);
        let user = userResult.rows[0];

        if (!user) {
            await db.query(
                'INSERT INTO user_profiles (user_id, name, email, points, level, current_streak, total_workouts, last_checkin) VALUES ($1, $2, $3, $4, 1, 1, 1, $5)',
                [user_id, name, email, points_earned, today]
            );
            await db.query('INSERT INTO workout_logs (user_id, workout_type, points_earned) VALUES ($1, $2, $3)', [user_id, workout_type, points_earned]);
            await checkAndUnlockAchievement(user_id, 'First Step');

            res.json({ message: 'success', data: { points_earned, current_streak: 1, total_workouts: 1, level: 1, new_achievements: ['First Step'] } });
        } else {
            const lastCheckin = new Date(user.last_checkin);
            const todayDate = new Date(today);
            const daysDiff = Math.floor((todayDate - lastCheckin) / (1000 * 60 * 60 * 24));

            let newStreak = user.current_streak;
            let bonusPoints = 0;

            if (daysDiff === 1) {
                newStreak += 1;
                if (newStreak === 7) bonusPoints = 50;
                if (newStreak === 30) bonusPoints = 200;
            } else if (daysDiff > 1) {
                newStreak = 1;
            }

            const totalPoints = user.points + points_earned + bonusPoints;
            const newLevel = calculateLevel(totalPoints);
            const longestStreak = Math.max(user.longest_streak, newStreak);
            const totalWorkouts = user.total_workouts + 1;

            await db.query(
                `UPDATE user_profiles SET points = $1, level = $2, current_streak = $3, longest_streak = $4, total_workouts = $5, last_checkin = $6 WHERE user_id = $7`,
                [totalPoints, newLevel, newStreak, longestStreak, totalWorkouts, today, user_id]
            );
            await db.query('INSERT INTO workout_logs (user_id, workout_type, points_earned) VALUES ($1, $2, $3)', [user_id, workout_type, points_earned + bonusPoints]);

            const newAchievements = [];
            if (newStreak === 7) { await checkAndUnlockAchievement(user_id, 'Week Warrior'); newAchievements.push('Week Warrior'); }
            if (newStreak === 30) { await checkAndUnlockAchievement(user_id, 'Month Master'); newAchievements.push('Month Master'); }
            if (totalWorkouts === 50) { await checkAndUnlockAchievement(user_id, 'Class Champion'); newAchievements.push('Class Champion'); }
            if (totalWorkouts === 100) { await checkAndUnlockAchievement(user_id, 'Century Club'); newAchievements.push('Century Club'); }

            res.json({ message: 'success', data: { points_earned: points_earned + bonusPoints, current_streak: newStreak, total_workouts: totalWorkouts, level: newLevel, new_achievements: newAchievements } });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/profile/:userId', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [req.params.userId]);
        res.json({ message: 'success', data: result.rows[0] || null });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/achievements/:userId', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT a.*, ua.unlocked_at, CASE WHEN ua.id IS NOT NULL THEN 1 ELSE 0 END as unlocked
            FROM achievements a
            LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
            ORDER BY a.category, a.id
        `, [req.params.userId]);
        res.json({ message: 'success', data: result.rows });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const result = await db.query('SELECT user_id, name, points, level, current_streak, total_workouts FROM user_profiles ORDER BY points DESC LIMIT 10');
        res.json({ message: 'success', data: result.rows });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Analytics (Measurements & Goals)
app.post('/api/analytics/measurement', async (req, res) => {
    const { user_id, weight, body_fat_percentage, muscle_mass, measurement_date } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO body_measurements (user_id, weight, body_fat_percentage, muscle_mass, measurement_date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [user_id, weight || null, body_fat_percentage || null, muscle_mass || null, measurement_date || null]
        );
        res.json({ message: 'success', data: { id: result.rows[0].id } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/analytics/measurements/:userId', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM body_measurements WHERE user_id = $1 ORDER BY measurement_date DESC', [req.params.userId]);
        res.json({ message: 'success', data: result.rows });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/analytics/goal', async (req, res) => {
    const { user_id, goal_type, title, description, target_value, target_date } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO fitness_goals (user_id, goal_type, title, description, target_value, target_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [user_id, goal_type, title, description || '', target_value || 0, target_date || null]
        );
        res.json({ message: 'success', data: { id: result.rows[0].id } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/analytics/goals/:userId', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM fitness_goals WHERE user_id = $1 ORDER BY status ASC, target_date ASC', [req.params.userId]);
        res.json({ message: 'success', data: result.rows });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/analytics/goal/:goalId', async (req, res) => {
    const { goalId } = req.params;
    const { current_value, status } = req.body;

    let updates = [];
    let values = [];
    let idx = 1;

    if (current_value !== undefined) { updates.push(`current_value = $${idx++}`); values.push(current_value); }
    if (status !== undefined) {
        updates.push(`status = $${idx++}`); values.push(status);
        if (status === 'completed') { updates.push(`completed_at = CURRENT_TIMESTAMP`); }
    }

    if (updates.length === 0) return res.status(400).json({ error: 'No updates provided' });

    values.push(goalId);
    try {
        await db.query(`UPDATE fitness_goals SET ${updates.join(', ')} WHERE id = $${idx}`, values);
        res.json({ message: 'success', data: { updated: true } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/analytics/goal/:goalId', async (req, res) => {
    try {
        await db.query('DELETE FROM fitness_goals WHERE id = $1', [req.params.goalId]);
        res.json({ message: 'success', data: { deleted: true } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Serve static files from the dist directory (Vite build output)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve index.html for client-side routing
app.get(/(.*)/, (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

// Keep-Alive Mechanism
function startKeepAlive() {
    // Use the Render external URL if available, otherwise fallback to the hardcoded one
    const url = process.env.RENDER_EXTERNAL_URL || 'https://fit2fit-gym-api.onrender.com';
    // Ping every 14 minutes (Render sleeps after 15 mins of inactivity)
    const interval = 14 * 60 * 1000;

    console.log(`Starting Keep-Alive ping to ${url} every 14 minutes...`);

    const ping = async () => {
        try {
            await axios.get(`${url}/api/health`);
            console.log(`Keep-Alive ping successful: ${new Date().toISOString()}`);
        } catch (err) {
            console.error(`Keep-Alive ping failed: ${err.message}`);
        }
    };

    // Initial ping
    ping();

    setInterval(ping, interval);
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Starting Fit2Fit Server with PostgreSQL...");
    initDb();
    initializeScheduler();
    startKeepAlive();
});
