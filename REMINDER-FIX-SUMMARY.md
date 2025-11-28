# Reminder Scheduler Fixes

## Issue Identified
1. **Scheduler Query Bug**: The `reminderScheduler.js` file was using `active = 1` in the SQL query to find subscribers. In PostgreSQL, the `active` column is a `BOOLEAN` type, so this query was failing to match any rows (or causing an error), resulting in no reminders being sent automatically.
2. **Server Sleeping**: On Render's free tier, the server spins down (sleeps) after 15 minutes of inactivity. This stops the scheduler from running.

## Fixes Applied
1. **Updated SQL Query**: Modified `reminderScheduler.js` to use `active = TRUE` instead of `active = 1`.
2. **Implemented Keep-Alive**: Added a self-ping mechanism in `server.js`.
   - The server now pings its own `/api/health` endpoint every 14 minutes.
   - This prevents the Render instance from going to sleep, ensuring the scheduler keeps running.

## Next Steps
To apply these fixes to your live application:
1. **Commit and Push**: You need to commit these changes and push them to your GitHub repository.
   ```bash
   git add .
   git commit -m "Fix reminder scheduler query and add keep-alive"
   git push
   ```
2. **Deploy**: Render should automatically deploy the new version.

## Verification
After deployment:
- The server will log "Starting Keep-Alive ping..." on startup.
- You should see "Keep-Alive ping successful" logs every 14 minutes in your Render dashboard.
- Reminders should now trigger automatically at the scheduled times.
