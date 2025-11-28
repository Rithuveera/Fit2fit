import axios from 'axios';

// ⚠️ REPLACE WITH YOUR DETAILS
const EMAIL = 'veeramanibatharvellai@gmail.com'; // The email you used to subscribe
const CLASS_TYPE = 'HIIT'; // The class you subscribed to (HIIT, Yoga, or Strength)
const LIVE_URL = 'https://fit2fit-gym-api.onrender.com'; // Your Render URL

async function triggerReminder() {
    console.log(`Triggering reminder for ${EMAIL} (${CLASS_TYPE})...`);

    try {
        const response = await axios.post(`${LIVE_URL}/api/test-meal-reminder`, {
            email: EMAIL,
            class_type: CLASS_TYPE
        });

        const data = response.data;

        if (response.status === 200) {
            console.log('✅ Success! Reminder triggered.');
            console.log('Response:', data);
            console.log('👉 Check your Email and WhatsApp now!');
        }
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('❌ Error:', error.response.data.error || 'Unknown error');
            if (error.response.data.error && error.response.data.error.includes('No active subscription')) {
                console.log('💡 Tip: Make sure you have subscribed on the website first!');
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('❌ Network Error: No response received');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('❌ Error:', error.message);
        }
    }
}

triggerReminder();
