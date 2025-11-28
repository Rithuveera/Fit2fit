import axios from 'axios';

// YOUR DETAILS
const EMAIL = 'veeramanibatharvellai@gmail.com';
const PHONE = '+919677792757';
const LIVE_URL = 'https://fit2fit-gym-api.onrender.com';

async function forceSubscribeAndTrigger() {
    console.log(`🚀 Forcing subscription for ${EMAIL} on ${LIVE_URL}...`);

    try {
        // 1. Subscribe
        console.log('1️⃣  Subscribing...');
        await axios.post(`${LIVE_URL}/api/subscribe-reminders`, {
            email: EMAIL,
            name: 'Veeramani',
            class_type: 'HIIT',
            phone_number: PHONE,
            whatsapp_enabled: true
        });
        console.log('   ✅ Subscribed successfully!');

        // 2. Trigger Reminder
        console.log('\n2️⃣  Triggering immediate reminder...');
        const response = await axios.post(`${LIVE_URL}/api/test-meal-reminder`, {
            email: EMAIL,
            class_type: 'HIIT'
        });

        console.log('   ✅ Success! Reminder triggered.');
        console.log('   🔍 FULL SERVER RESPONSE:');
        console.log(JSON.stringify(response.data, null, 2)); // Print full JSON

    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.response) {
            console.error('   Server Response:', JSON.stringify(err.response.data, null, 2));
        }
    }
}

forceSubscribeAndTrigger();
