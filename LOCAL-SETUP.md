# Local Development Setup Guide

## Step 1: Get Your Database URL from Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your PostgreSQL database: **`fit2fit-db`**
3. Scroll down to find **"External Database URL"**
4. Click the **Copy** button (it looks like: `postgres://fit2fit_db_user:...@...`)

## Step 2: Create Your Local .env File

1. In your project root, create a new file called `.env` (note: it starts with a dot)
2. Copy the contents from `.env.example`
3. Replace the `DATABASE_URL` value with the one you copied from Render

Example:
```
PORT=3000
DATABASE_URL=postgres://fit2fit_db_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com/fit2fit_db
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

## Step 3: Restart Your Local Server

1. Stop the current server (Ctrl+C in the terminal running `node server.js`)
2. Start it again: `node server.js`
3. You should see: "Starting Fit2Fit Server with PostgreSQL..."

## Step 4: Test Locally

1. Open `http://localhost:5173` (Vite dev server)
2. Try submitting the "Join Now" form
3. Check if data persists in the Admin panel

---

## Alternative: Test on Render Directly

If you don't want to set up locally, you can test directly on your Render deployment:

1. Go to Render Dashboard → **`fit2fit-gym-api`** → Check if status is **"Live"**
2. Click on the URL (e.g., `https://fit2fit-gym-api.onrender.com`)
3. Test all features there

**Note:** The Render deployment already has the DATABASE_URL configured, so it should work immediately once deployed.

---

## Troubleshooting

### If you see "DATABASE_URL environment variable is not set"
- Make sure your `.env` file exists in the project root
- Make sure it contains the correct `DATABASE_URL`
- Restart the server

### If forms still show errors
- Check the browser console (F12 → Console tab)
- Check the server terminal for error messages
- Share the error message with me for debugging
