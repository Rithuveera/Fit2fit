# Push to GitHub - Quick Commands

# Replace YOUR_GITHUB_URL with your actual repository URL
# Example: https://github.com/yourusername/fit2fit-gym-app.git

# Step 1: Add GitHub as remote
git remote add origin YOUR_GITHUB_URL

# Step 2: Rename branch to main (if needed)
git branch -M main

# Step 3: Push code to GitHub
git push -u origin main

# If you get an error about existing remote, remove it first:
# git remote remove origin
# Then run Step 1 again
