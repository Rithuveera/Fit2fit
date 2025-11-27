# 🧪 Test Meal Reminders NOW

## How to Test Meal Reminders Immediately

I've added a special test endpoint that lets you trigger a meal reminder **right now** without waiting for the scheduled time!

---

## **Step 1: Subscribe to Meal Reminders** (if you haven't already)

1. Go to your Render URL: `https://fit2fit-gym-api.onrender.com`
2. Scroll to the **Classes** section
3. Click **"Get Meal Reminders"** on any class (HIIT, Yoga, or Strength)
4. Fill in:
   - Your email
   - Your name
   - Phone number (optional, for WhatsApp)
   - Enable WhatsApp toggle (if you want WhatsApp reminders)
5. Click **Subscribe**

---

## **Step 2: Test the Reminder Immediately**

### **Option A: Using Browser Console (Easiest)**

1. Open your browser's **Developer Tools** (Press `F12`)
2. Go to the **Console** tab
3. Paste this code (replace with your email and class type):

```javascript
fetch('https://fit2fit-gym-api.onrender.com/api/test-meal-reminder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'your-email@example.com',  // Replace with your email
        class_type: 'HIIT'  // Or 'Yoga' or 'Strength'
    })
})
.then(res => res.json())
.then(data => console.log('✅ Reminder sent!', data))
.catch(err => console.error('❌ Error:', err));
```

4. Press **Enter**
5. Check your **email inbox** (and WhatsApp if enabled)!

---

### **Option B: Using Postman or Thunder Client**

1. **Method:** POST
2. **URL:** `https://fit2fit-gym-api.onrender.com/api/test-meal-reminder`
3. **Headers:** 
   - `Content-Type: application/json`
4. **Body (JSON):**
```json
{
    "email": "your-email@example.com",
    "class_type": "HIIT"
}
```
5. Click **Send**
6. Check your email!

---

### **Option C: Using cURL (Command Line)**

Open your terminal and run:

```bash
curl -X POST https://fit2fit-gym-api.onrender.com/api/test-meal-reminder \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your-email@example.com\",\"class_type\":\"HIIT\"}"
```

---

## **What You'll Receive**

### **Email:**
- ✉️ Subject: "Time for your Breakfast - HIIT Diet Plan"
- 📝 Body: Meal details with motivational message

### **WhatsApp (if enabled):**
- 📱 Message with meal name and details

---

## **Expected Response**

If successful, you'll see:

```json
{
    "message": "success",
    "data": {
        "email_sent": true,
        "whatsapp_sent": true,  // or false if WhatsApp not enabled
        "meal": {
            "name": "Breakfast",
            "meal": "Poha with peanuts, curry leaves & lemon",
            "time": "7:00 AM"
        }
    }
}
```

---

## **Troubleshooting**

### **Error: "No active subscription found"**
- ❌ You haven't subscribed yet
- ✅ **Solution:** Complete Step 1 first

### **Error: "Email and class_type are required"**
- ❌ Missing required fields
- ✅ **Solution:** Make sure you include both `email` and `class_type` in the request

### **Email not received?**
- Check your **spam/junk folder**
- Verify the email address is correct
- Check if EMAIL_USER and EMAIL_PASS are set in Render environment variables

### **WhatsApp not received?**
- Make sure you enabled WhatsApp during subscription
- Verify phone number is correct (include country code)
- For Twilio Sandbox: Send "join [sandbox-name]" to the Twilio WhatsApp number first

---

## **Class Types Available**

- `HIIT` - High-Intensity Interval Training
- `Yoga` - Yoga & Mindfulness
- `Strength` - Strength Training

---

## **Next Steps**

Once you confirm the test reminder works:
1. ✅ **Scheduled reminders** will work automatically at the times listed in `MEAL-REMINDER-SCHEDULE.md`
2. ✅ **No further action needed** - just wait for the scheduled times!

---

**Ready to test?** Follow the steps above and let me know if you receive the reminder! 🎉
