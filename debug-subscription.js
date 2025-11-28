import axios from 'axios';

const EMAIL = 'veeramanibatharvellai@gmail.com';
const URLS_TO_CHECK = [
    'https://fit2fit-gym-api.onrender.com',
    'https://fit2fit-gym-app.onrender.com'
];
const CLASSES = ['HIIT', 'Yoga', 'Strength'];

async function debugAllUrls() {
    console.log(`🔍 Hunting for subscription for ${EMAIL}...`);

    for (const url of URLS_TO_CHECK) {
        console.log(`\n🌍 Checking Server: ${url}`);

        for (const classType of CLASSES) {
            try {
                const statusUrl = `${url}/api/reminder-status/${EMAIL}/${classType}`;
                const response = await axios.get(statusUrl);

                if (response.data.data.subscribed) {
                    console.log(`\n🎉 FOUND IT! You are using: ${url}`);
                    console.log(`✅ Subscription found for: ${classType}`);

                    // Trigger reminder
                    console.log(`🚀 Triggering reminder...`);
                    await axios.post(`${url}/api/test-meal-reminder`, {
                        email: EMAIL,
                        class_type: classType
                    });
                    console.log('✅ Reminder Sent! Check your email/WhatsApp.');
                    return; // Stop searching
                }
            } catch (error) {
                // Ignore errors, just keep searching
            }
        }
        console.log('   ❌ Not found on this server.');
    }

    console.log('\n---------------------------------------------------');
    console.log('❌ STILL NOT FOUND.');
    console.log('This means either:');
    console.log('1. You are subscribed on Localhost (http://localhost:3000)');
    console.log('2. You are using a completely different URL.');
    console.log('\n👉 PLEASE COPY AND PASTE THE URL FROM YOUR BROWSER ADDRESS BAR.');
    console.log('---------------------------------------------------');
}

debugAllUrls();
