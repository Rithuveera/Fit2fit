// Quick diagnostic script to check WhatsApp setup
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'gym.db');
const db = new sqlite3.Database(dbPath);

console.log('=== WhatsApp Reminder Diagnostic ===\n');

// Check Twilio credentials
console.log('1. Twilio Configuration:');
console.log(`   Account SID: ${process.env.TWILIO_ACCOUNT_SID ? '✓ Set' : '✗ Missing'}`);
console.log(`   Auth Token: ${process.env.TWILIO_AUTH_TOKEN ? '✓ Set' : '✗ Missing'}`);
console.log(`   WhatsApp Number: ${process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'}\n`);

// Check active subscriptions
console.log('2. Active Subscriptions:');
db.all('SELECT * FROM diet_reminders WHERE active = 1', [], (err, rows) => {
    if (err) {
        console.error('   Error:', err.message);
    } else if (rows.length === 0) {
        console.log('   ✗ No active subscriptions found!');
    } else {
        rows.forEach((row, index) => {
            console.log(`\n   Subscription ${index + 1}:`);
            console.log(`   - Email: ${row.email}`);
            console.log(`   - Name: ${row.name || 'N/A'}`);
            console.log(`   - Class: ${row.class_type}`);
            console.log(`   - Phone: ${row.phone_number || '✗ Not set'}`);
            console.log(`   - WhatsApp Enabled: ${row.whatsapp_enabled ? '✓ Yes' : '✗ No'}`);
            console.log(`   - Created: ${row.created_at}`);
        });
    }

    console.log('\n3. Troubleshooting Tips:');
    console.log('   - Make sure you subscribed with WhatsApp enabled');
    console.log('   - Ensure your phone number is in E.164 format (+countrycode + number)');
    console.log('   - Join Twilio WhatsApp Sandbox: send "join <code>" to +14155238886');
    console.log('   - Check server logs for any error messages');
    console.log('   - Server must be running for scheduled reminders to work\n');

    db.close();
});
