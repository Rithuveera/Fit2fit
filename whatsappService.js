import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Default Twilio Sandbox

let client = null;

// Initialize client only if credentials are provided
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
    console.log('✅ Twilio WhatsApp client initialized');
} else {
    console.warn('⚠️  Twilio credentials not found. WhatsApp notifications will be disabled.');
}

// Format phone number to WhatsApp format
const formatWhatsAppNumber = (phoneNumber) => {
    // Remove any spaces, dashes, or parentheses
    let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

    // Add + if not present
    if (!cleaned.startsWith('+')) {
        cleaned = '+' + cleaned;
    }

    // Add whatsapp: prefix
    return `whatsapp:${cleaned}`;
};

// Create meal reminder message
const createMealReminderMessage = (userName, mealName, mealDetails, mealTime, className) => {
    return `🍽️ *Meal Time Reminder - Fit2Fit Gym*

Hi ${userName || 'Fitness Enthusiast'}! ⏰

It's time for your *${mealName}*!

⏰ *Time:* ${mealTime}
📋 *Details:* ${mealDetails}
🏋️ *Plan:* ${className} Diet Plan

💡 *Quick Tip:* Stay consistent with your meal timing for best results. Proper nutrition is 70% of your fitness journey!

Visit your diet plan: http://localhost:5173/

---
Fit2Fit Gym - Building Better Bodies, One Meal at a Time 💪`;
};

// Create subscription confirmation message
const createSubscriptionMessage = (userName, className) => {
    return `✅ *Subscription Confirmed - Fit2Fit Gym*

Hi ${userName || 'there'}! 🎉

You've successfully subscribed to meal reminders for the *${className}* diet plan.

You'll receive timely WhatsApp reminders for each meal throughout the day to help you stay on track with your nutrition goals.

Stay committed, stay healthy! 💪

---
Fit2Fit Gym`;
};

// Send WhatsApp message
export const sendWhatsAppMessage = async (phoneNumber, message) => {
    if (!client) {
        console.error('❌ Twilio client not initialized. Check your credentials.');
        return { success: false, error: 'Twilio not configured' };
    }

    try {
        const formattedNumber = formatWhatsAppNumber(phoneNumber);

        const messageResponse = await client.messages.create({
            body: message,
            from: whatsappNumber,
            to: formattedNumber
        });

        console.log(`✅ WhatsApp message sent to ${phoneNumber}: ${messageResponse.sid}`);
        return { success: true, messageId: messageResponse.sid };
    } catch (error) {
        console.error(`❌ Error sending WhatsApp to ${phoneNumber}:`, error.message);
        return { success: false, error: error.message };
    }
};

// Send meal reminder via WhatsApp
export const sendMealReminderWhatsApp = async (phoneNumber, userName, mealName, mealDetails, mealTime, className) => {
    const message = createMealReminderMessage(userName, mealName, mealDetails, mealTime, className);
    return await sendWhatsAppMessage(phoneNumber, message);
};

// Send subscription confirmation via WhatsApp
export const sendSubscriptionConfirmationWhatsApp = async (phoneNumber, userName, className) => {
    const message = createSubscriptionMessage(userName, className);
    return await sendWhatsAppMessage(phoneNumber, message);
};

// Test WhatsApp connectivity
export const testWhatsAppConnection = async (phoneNumber) => {
    const testMessage = `🧪 *Test Message - Fit2Fit Gym*

This is a test message to verify your WhatsApp connection is working correctly.

If you received this, you're all set! 🎉`;

    return await sendWhatsAppMessage(phoneNumber, testMessage);
};

export default {
    sendWhatsAppMessage,
    sendMealReminderWhatsApp,
    sendSubscriptionConfirmationWhatsApp,
    testWhatsAppConnection
};
