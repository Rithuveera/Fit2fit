import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

console.log('🔍 Checking Twilio Configuration...\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
console.log('   TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
console.log('   TWILIO_WHATSAPP_NUMBER:', process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886 (default)');

// Try to initialize Twilio client
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    console.log('\n2. Initializing Twilio Client...');
    try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        console.log('   ✅ Twilio client initialized successfully');

        // Test sending a message
        console.log('\n3. Testing WhatsApp Message...');
        console.log('   Enter your WhatsApp number when prompted (format: +919677792757)');

        // For testing, you can hardcode your number here temporarily
        const testNumber = 'whatsapp:+919677792757'; // REPLACE WITH YOUR NUMBER

        console.log(`   Sending test message to: ${testNumber}`);

        client.messages.create({
            body: '🧪 Test message from Fit2Fit Gym! If you received this, WhatsApp integration is working! 🎉',
            from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
            to: testNumber
        })
            .then(message => {
                console.log(`   ✅ Message sent successfully!`);
                console.log(`   Message SID: ${message.sid}`);
                console.log(`   Status: ${message.status}`);
                console.log('\n✅ All checks passed! WhatsApp is configured correctly.');
            })
            .catch(error => {
                console.error(`   ❌ Error sending message:`, error.message);
                console.log('\n🔧 Common Issues:');
                console.log('   1. Make sure you joined the Twilio Sandbox:');
                console.log('      - Send "join <your-code>" to +14155238886 on WhatsApp');
                console.log('   2. Check phone number format: whatsapp:+[country code][number]');
                console.log('   3. Verify Twilio credentials are correct');
            });
    } catch (error) {
        console.error('   ❌ Error initializing Twilio:', error.message);
    }
} else {
    console.log('\n❌ Twilio credentials are missing in .env file');
}
