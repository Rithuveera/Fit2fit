import cron from 'node-cron';
import { sendMealReminder } from './emailService.js';
import { sendMealReminderWhatsApp } from './whatsappService.js';
import db from './db.js';

// Diet Plan Data (Hardcoded for now, could be in DB)
const dietPlans = {
    'HIIT': {
        'Breakfast': { meal: 'Poha with peanuts, curry leaves & lemon', time: '7:00 AM' },
        'Mid-Morning': { meal: 'Fruit salad with flax seeds', time: '10:00 AM' },
        'Lunch': { meal: 'Brown rice, dal, mixed vegetable sabzi & curd', time: '1:00 PM' },
        'Pre-Workout': { meal: 'Banana & peanut butter toast', time: '4:30 PM' },
        'Post-Workout': { meal: 'Protein shake or boiled eggs', time: '6:30 PM' },
        'Dinner': { meal: 'Grilled chicken/paneer salad with soup', time: '8:30 PM' }
    },
    'Yoga': {
        'Breakfast': { meal: 'Idli with sambar & coconut chutney', time: '7:30 AM' },
        'Mid-Morning': { meal: 'Green tea & roasted makhanas', time: '10:30 AM' },
        'Lunch': { meal: 'Quinoa khichdi with cucumber raita', time: '1:00 PM' },
        'Afternoon': { meal: 'Sprouts salad', time: '4:00 PM' },
        'Post-Yoga': { meal: 'Warm turmeric milk with almonds', time: '7:00 PM' },
        'Dinner': { meal: 'Moong dal soup with sautéed veggies', time: '8:30 PM' }
    },
    'Strength': {
        'Breakfast': { meal: 'Egg bhurji (4 eggs) with multigrain roti', time: '7:00 AM' },
        'Mid-Morning': { meal: 'Greek yogurt with berries', time: '10:00 AM' },
        'Lunch': { meal: 'Chicken breast/Tofu curry with sweet potato', time: '12:30 PM' },
        'Pre-Workout': { meal: 'Oatmeal with whey protein', time: '3:30 PM' },
        'Post-Workout': { meal: 'Whey protein isolate with water', time: '6:00 PM' },
        'Dinner': { meal: 'Grilled fish/paneer with steamed broccoli', time: '8:30 PM' }
    }
};

// Function to check and send reminders
async function checkAndSendReminders(classType, mealName, mealDetails) {
    console.log(`Checking reminders for ${classType} - ${mealName}`);

    try {
        // Fetch active subscribers for this class type
        const result = await db.query(
            'SELECT * FROM diet_reminders WHERE class_type = $1 AND active = TRUE',
            [classType]
        );

        const subscribers = result.rows;

        if (subscribers.length === 0) {
            console.log(`No active subscribers for ${classType}`);
            return;
        }

        console.log(`Found ${subscribers.length} subscribers for ${classType}`);

        for (const subscriber of subscribers) {
            // Send Email
            try {
                await sendMealReminder(subscriber.email, subscriber.name, mealName, mealDetails.meal, mealDetails.time, classType);
                console.log(`Email sent to ${subscriber.email}`);
            } catch (emailError) {
                console.error(`Failed to send email to ${subscriber.email}:`, emailError);
            }

            // Send WhatsApp (if enabled)
            if (subscriber.whatsapp_enabled && subscriber.phone_number) {
                try {
                    await sendMealReminderWhatsApp(subscriber.phone_number, subscriber.name, mealName, mealDetails.meal, mealDetails.time, classType);
                    console.log(`WhatsApp sent to ${subscriber.phone_number}`);
                } catch (waError) {
                    console.error(`Failed to send WhatsApp to ${subscriber.phone_number}:`, waError);
                }
            }
        }
    } catch (err) {
        console.error('Error fetching subscribers:', err);
    }
}

// Initialize Scheduler
export function initializeScheduler() {
    console.log('Initializing Meal Reminder Scheduler (IST Timezone)...');

    // Schedule jobs for each class type and meal
    // Note: Cron times need to be converted to 24-hour format for the scheduler
    // Using explicit timezone "Asia/Kolkata" for all schedules

    // HIIT Schedule
    cron.schedule('0 7 * * *', () => checkAndSendReminders('HIIT', 'Breakfast', dietPlans['HIIT']['Breakfast']), { timezone: "Asia/Kolkata" });
    cron.schedule('0 10 * * *', () => checkAndSendReminders('HIIT', 'Mid-Morning', dietPlans['HIIT']['Mid-Morning']), { timezone: "Asia/Kolkata" });
    cron.schedule('0 13 * * *', () => checkAndSendReminders('HIIT', 'Lunch', dietPlans['HIIT']['Lunch']), { timezone: "Asia/Kolkata" });
    cron.schedule('30 16 * * *', () => checkAndSendReminders('HIIT', 'Pre-Workout', dietPlans['HIIT']['Pre-Workout']), { timezone: "Asia/Kolkata" });
    cron.schedule('30 18 * * *', () => checkAndSendReminders('HIIT', 'Post-Workout', dietPlans['HIIT']['Post-Workout']), { timezone: "Asia/Kolkata" });
    cron.schedule('30 20 * * *', () => checkAndSendReminders('HIIT', 'Dinner', dietPlans['HIIT']['Dinner']), { timezone: "Asia/Kolkata" });

    // Yoga Schedule
    cron.schedule('30 7 * * *', () => checkAndSendReminders('Yoga', 'Breakfast', dietPlans['Yoga']['Breakfast']), { timezone: "Asia/Kolkata" });
    cron.schedule('30 10 * * *', () => checkAndSendReminders('Yoga', 'Mid-Morning', dietPlans['Yoga']['Mid-Morning']), { timezone: "Asia/Kolkata" });
    cron.schedule('0 13 * * *', () => checkAndSendReminders('Yoga', 'Lunch', dietPlans['Yoga']['Lunch']), { timezone: "Asia/Kolkata" });
    cron.schedule('0 16 * * *', () => checkAndSendReminders('Yoga', 'Afternoon', dietPlans['Yoga']['Afternoon']), { timezone: "Asia/Kolkata" });
    cron.schedule('0 19 * * *', () => checkAndSendReminders('Yoga', 'Post-Yoga', dietPlans['Yoga']['Post-Yoga']), { timezone: "Asia/Kolkata" });
    cron.schedule('30 20 * * *', () => checkAndSendReminders('Yoga', 'Dinner', dietPlans['Yoga']['Dinner']), { timezone: "Asia/Kolkata" });

    // Strength Schedule
    cron.schedule('0 7 * * *', () => checkAndSendReminders('Strength', 'Breakfast', dietPlans['Strength']['Breakfast']), { timezone: "Asia/Kolkata" });
    cron.schedule('0 10 * * *', () => checkAndSendReminders('Strength', 'Mid-Morning', dietPlans['Strength']['Mid-Morning']), { timezone: "Asia/Kolkata" });
    cron.schedule('30 12 * * *', () => checkAndSendReminders('Strength', 'Lunch', dietPlans['Strength']['Lunch']), { timezone: "Asia/Kolkata" });
    cron.schedule('30 15 * * *', () => checkAndSendReminders('Strength', 'Pre-Workout', dietPlans['Strength']['Pre-Workout']), { timezone: "Asia/Kolkata" });
    cron.schedule('0 18 * * *', () => checkAndSendReminders('Strength', 'Post-Workout', dietPlans['Strength']['Post-Workout']), { timezone: "Asia/Kolkata" });
    cron.schedule('30 20 * * *', () => checkAndSendReminders('Strength', 'Dinner', dietPlans['Strength']['Dinner']), { timezone: "Asia/Kolkata" });

    console.log('✅ All meal reminders scheduled successfully.');
}

export default initializeScheduler;
