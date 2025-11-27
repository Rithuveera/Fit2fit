import cron from 'node-cron';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendMealReminder } from './emailService.js';
import { sendMealReminderWhatsApp } from './whatsappService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const dbPath = path.resolve(__dirname, 'gym.db');
const db = new sqlite3.Database(dbPath);

// Diet plans data (matching Classes.jsx)
const dietPlans = {
    'HIIT': [
        { name: 'Breakfast', meal: 'Poha with peanuts, curry leaves & lemon OR Moong dal chilla with mint chutney', time: '7:00 AM' },
        { name: 'Mid-Morning', meal: 'Curd (dahi) with roasted chana & fruits', time: '10:00 AM' },
        { name: 'Lunch', meal: 'Grilled chicken/paneer, brown rice, dal, sabzi & salad', time: '1:00 PM' },
        { name: 'Pre-Workout', meal: 'Banana with dates OR upma (small portion)', time: '4:30 PM' },
        { name: 'Post-Workout', meal: 'Protein shake with banana', time: '6:30 PM' },
        { name: 'Dinner', meal: 'Grilled fish/chicken tikka, roti, dal & sautéed vegetables', time: '8:30 PM' }
    ],
    'Yoga': [
        { name: 'Breakfast', meal: 'Idli with sambar & coconut chutney OR oats upma with vegetables', time: '7:30 AM' },
        { name: 'Mid-Morning', meal: 'Handful of soaked almonds, walnuts & green tea', time: '10:30 AM' },
        { name: 'Lunch', meal: 'Brown rice, dal, paneer/tofu curry, sabzi & raita', time: '1:00 PM' },
        { name: 'Afternoon', meal: 'Sprouts chaat OR roasted makhana', time: '4:00 PM' },
        { name: 'Post-Yoga', meal: 'Fresh fruit bowl with chia/flax seeds', time: '7:00 PM' },
        { name: 'Dinner', meal: 'Moong dal khichdi with ghee, curd & papad', time: '8:30 PM' }
    ],
    'Strength': [
        { name: 'Breakfast', meal: 'Egg bhurji (4 eggs) with multigrain roti & avocado/paneer', time: '7:00 AM' },
        { name: 'Mid-Morning', meal: 'Whey protein shake with banana & soaked almonds', time: '10:00 AM' },
        { name: 'Lunch', meal: 'Chicken/mutton curry, brown rice, dal & mixed vegetable sabzi', time: '12:30 PM' },
        { name: 'Pre-Workout', meal: 'Peanut butter chikki with banana OR sweet potato chaat', time: '3:30 PM' },
        { name: 'Post-Workout', meal: 'Grilled chicken tikka/paneer with brown rice & stir-fried veggies', time: '6:00 PM' },
        { name: 'Dinner', meal: 'Fish curry/chicken keema, quinoa/roti, dal & cucumber raita', time: '8:30 PM' }
    ]
};

// Function to get active subscribers
const getActiveSubscribers = () => {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM diet_reminders WHERE active = 1',
            [],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
};

// Function to send reminders for a specific meal time
const sendMealReminders = async (targetTime) => {
    try {
        const subscribers = await getActiveSubscribers();

        if (subscribers.length === 0) {
            console.log(`⏰ ${targetTime} - No active subscribers`);
            return;
        }

        console.log(`⏰ ${targetTime} - Sending reminders to ${subscribers.length} subscriber(s)`);

        for (const subscriber of subscribers) {
            const classType = subscriber.class_type;
            const meals = dietPlans[classType];

            if (!meals) {
                console.log(`⚠️ Unknown class type: ${classType}`);
                continue;
            }

            // Find meal matching the target time
            const meal = meals.find(m => m.time === targetTime);

            if (meal) {
                // Send email reminder
                await sendMealReminder(
                    subscriber.email,
                    subscriber.name || 'Fitness Enthusiast',
                    meal.name,
                    meal.meal,
                    meal.time,
                    classType
                );

                // Send WhatsApp reminder if enabled and phone number exists
                if (subscriber.whatsapp_enabled && subscriber.phone_number) {
                    await sendMealReminderWhatsApp(
                        subscriber.phone_number,
                        subscriber.name || 'Fitness Enthusiast',
                        meal.name,
                        meal.meal,
                        meal.time,
                        classType
                    );
                }
            }
        }
    } catch (error) {
        console.error(`❌ Error sending reminders for ${targetTime}:`, error);
    }
};

// Schedule cron jobs for each meal time
export const initializeScheduler = () => {
    console.log('🚀 Initializing meal reminder scheduler...');

    const timezone = "Asia/Kolkata";
    const cronOptions = {
        scheduled: true,
        timezone: timezone
    };

    // Breakfast - 7:00 AM (HIIT, Strength)
    cron.schedule('0 7 * * *', () => {
        sendMealReminders('7:00 AM');
    }, cronOptions);

    // Breakfast - 7:30 AM (Yoga)
    cron.schedule('30 7 * * *', () => {
        sendMealReminders('7:30 AM');
    }, cronOptions);

    // Mid-Morning - 10:00 AM (HIIT, Strength)
    cron.schedule('0 10 * * *', () => {
        sendMealReminders('10:00 AM');
    }, cronOptions);

    // Mid-Morning - 10:30 AM (Yoga)
    cron.schedule('30 10 * * *', () => {
        sendMealReminders('10:30 AM');
    }, cronOptions);

    // Lunch - 12:30 PM (Strength)
    cron.schedule('30 12 * * *', () => {
        sendMealReminders('12:30 PM');
    }, cronOptions);

    // Lunch - 1:00 PM (HIIT, Yoga)
    cron.schedule('0 13 * * *', () => {
        sendMealReminders('1:00 PM');
    }, cronOptions);

    // Pre-Workout - 3:30 PM (Strength)
    cron.schedule('30 15 * * *', () => {
        sendMealReminders('3:30 PM');
    }, cronOptions);

    // Afternoon - 4:00 PM (Yoga)
    cron.schedule('0 16 * * *', () => {
        sendMealReminders('4:00 PM');
    }, cronOptions);

    // Pre-Workout - 4:30 PM (HIIT)
    cron.schedule('30 16 * * *', () => {
        sendMealReminders('4:30 PM');
    }, cronOptions);

    // Post-Workout - 6:00 PM (Strength)
    cron.schedule('0 18 * * *', () => {
        sendMealReminders('6:00 PM');
    }, cronOptions);

    // Post-Workout - 6:30 PM (HIIT)
    cron.schedule('30 18 * * *', () => {
        sendMealReminders('6:30 PM');
    }, cronOptions);

    // Post-Yoga - 7:00 PM (Yoga)
    cron.schedule('0 19 * * *', () => {
        sendMealReminders('7:00 PM');
    }, cronOptions);

    // Dinner - 8:30 PM (All classes)
    cron.schedule('30 20 * * *', () => {
        sendMealReminders('8:30 PM');
    }, cronOptions);

    console.log(`✅ Meal reminder scheduler initialized successfully! (Timezone: ${timezone})`);
    console.log('📅 Scheduled reminders for all meal times');
};

export default initializeScheduler;
