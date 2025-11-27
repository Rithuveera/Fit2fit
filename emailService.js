import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter with Mailtrap configuration
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // TLS
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

// Email templates
const createMealReminderEmail = (userName, mealName, mealDetails, mealTime, className) => {
    return {
        subject: `🍽️ Meal Reminder: ${mealName} - ${mealTime}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            color: #39ff14;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            color: #ffffff;
            font-size: 14px;
        }
        .content {
            padding: 30px;
        }
        .meal-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-left: 4px solid #39ff14;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .meal-name {
            font-size: 22px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 10px;
        }
        .meal-time {
            font-size: 16px;
            color: #39ff14;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .meal-details {
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
        }
        .class-badge {
            display: inline-block;
            background-color: #39ff14;
            color: #000000;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
        }
        .tips {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .tips h3 {
            margin: 0 0 10px 0;
            color: #856404;
            font-size: 16px;
        }
        .tips p {
            margin: 0;
            color: #856404;
            font-size: 14px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 12px;
        }
        .cta-button {
            display: inline-block;
            background-color: #39ff14;
            color: #000000;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ Meal Time Reminder</h1>
            <p>Fit2Fit Gym - Your Nutrition Partner</p>
        </div>
        
        <div class="content">
            <p>Hi ${userName || 'Fitness Enthusiast'},</p>
            <p>It's time for your <strong>${mealName}</strong>!</p>
            
            <div class="meal-card">
                <div class="meal-name">${mealName}</div>
                <div class="meal-time">⏰ ${mealTime}</div>
                <div class="meal-details">${mealDetails}</div>
                <span class="class-badge">${className} Diet Plan</span>
            </div>
            
            <div class="tips">
                <h3>💡 Quick Tip</h3>
                <p>Stay consistent with your meal timing for best results. Proper nutrition is 70% of your fitness journey!</p>
            </div>
            
            <p style="text-align: center;">
                <a href="https://fit2fit-gym-api.onrender.com/" class="cta-button">View Full Diet Plan</a>
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Fit2Fit Gym</strong></p>
            <p>Building Better Bodies, One Meal at a Time</p>
            <p style="margin-top: 10px; font-size: 11px;">
                You're receiving this because you subscribed to meal reminders.<br>
                To unsubscribe, visit your class diet plan page.
            </p>
        </div>
    </div>
</body>
</html>
        `,
        text: `
Meal Time Reminder - Fit2Fit Gym

Hi ${userName || 'Fitness Enthusiast'},

It's time for your ${mealName}!

⏰ ${mealTime}
📋 ${mealDetails}

Class: ${className} Diet Plan

Quick Tip: Stay consistent with your meal timing for best results. Proper nutrition is 70% of your fitness journey!

Visit https://fit2fit-gym-api.onrender.com/ to view your full diet plan.

---
Fit2Fit Gym - Building Better Bodies, One Meal at a Time
        `
    };
};

// Send meal reminder email
export const sendMealReminder = async (userEmail, userName, mealName, mealDetails, mealTime, className) => {
    try {
        const emailContent = createMealReminderEmail(userName, mealName, mealDetails, mealTime, className);

        const info = await transporter.sendMail({
            from: '"Fit2Fit Gym" <noreply@fit2fit.com>',
            to: userEmail,
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
        });

        console.log(`✅ Meal reminder sent to ${userEmail}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Error sending email to ${userEmail}:`, error);
        return { success: false, error: error.message };
    }
};

// Send welcome/confirmation email
export const sendSubscriptionConfirmation = async (userEmail, userName, className) => {
    try {
        const info = await transporter.sendMail({
            from: '"Fit2Fit Gym" <noreply@fit2fit.com>',
            to: userEmail,
            subject: '✅ Subscribed to Diet Plan Reminders',
            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: #39ff14; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .success-icon { font-size: 60px; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Meal Reminders!</h1>
        </div>
        <div class="content">
            <div class="success-icon">✅</div>
            <h2 style="text-align: center; color: #39ff14;">Subscription Confirmed!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>You've successfully subscribed to meal reminders for the <strong>${className}</strong> diet plan.</p>
            <p>You'll receive timely email reminders for each meal throughout the day to help you stay on track with your nutrition goals.</p>
            <p style="margin-top: 30px;">Stay committed, stay healthy! 💪</p>
        </div>
    </div>
</body>
</html>
            `
        });

        console.log(`✅ Subscription confirmation sent to ${userEmail}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Error sending confirmation to ${userEmail}:`, error);
        return { success: false, error: error.message };
    }
};

export default transporter;
