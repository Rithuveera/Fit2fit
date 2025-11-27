const sql = `INSERT INTO body_measurements (user_id, weight, body_fat_percentage, muscle_mass, measurement_date) 
                 VALUES (?,?,?,?,?)`;
const params = [user_id, weight || null, body_fat_percentage || null, muscle_mass || null, measurement_date || null];

db.run(sql, params, function (err) {
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    res.json({
        message: 'success',
        data: { id: this.lastID }
    });
});
});

// Get measurement history
app.get('/api/analytics/measurements/:userId', (req, res) => {
    const { userId } = req.params;

    const sql = `SELECT * FROM body_measurements WHERE user_id = ? 
                 ORDER BY measurement_date DESC, created_at DESC`;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Create a fitness goal
app.post('/api/analytics/goal', (req, res) => {
    const { user_id, goal_type, title, description, target_value, target_date } = req.body;

    if (!user_id || !title || !goal_type) {
        return res.status(400).json({ error: 'User ID, title, and goal type are required' });
    }

    const sql = `INSERT INTO fitness_goals (user_id, goal_type, title, description, target_value, target_date) 
                 VALUES (?,?,?,?,?,?)`;
    const params = [user_id, goal_type, title, description || '', target_value || 0, target_date || null];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { id: this.lastID }
        });
    });
});

// Get all goals for a user
app.get('/api/analytics/goals/:userId', (req, res) => {
    const { userId } = req.params;

    const sql = `SELECT * FROM fitness_goals WHERE user_id = ? 
                 ORDER BY status ASC, target_date ASC`;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Update goal progress
app.put('/api/analytics/goal/:goalId', (req, res) => {
    const { goalId } = req.params;
    const { current_value, status } = req.body;

    let sql = 'UPDATE fitness_goals SET ';
    const params = [];
    const updates = [];

    if (current_value !== undefined) {
        updates.push('current_value = ?');
        params.push(current_value);
    }

    if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);

        if (status === 'completed') {
            updates.push('completed_at = CURRENT_TIMESTAMP');
        }
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No updates provided' });
    }

    sql += updates.join(', ') + ' WHERE id = ?';
    params.push(goalId);

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { updated: this.changes }
        });
    });
});

// Delete a goal
app.delete('/api/analytics/goal/:goalId', (req, res) => {
    const { goalId } = req.params;

    db.run('DELETE FROM fitness_goals WHERE id = ?', [goalId], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { deleted: this.changes }
        });
    });
});

// Generate report for a period
app.get('/api/analytics/report/:userId/:period', (req, res) => {
    const { userId, period } = req.params; // period: 'month' or 'year'

    const dateFilter = period === 'month'
        ? "strftime('%Y-%m', workout_date) = strftime('%Y-%m', 'now')"
        : "strftime('%Y', workout_date) = strftime('%Y', 'now')";

    // Get workout stats
    db.get(`SELECT 
                COUNT(*) as total_workouts,
                SUM(calories) as total_calories,
                AVG(duration) as avg_duration,
                exercise as most_common_exercise
            FROM workout_sessions 
            WHERE user_id = ? AND ${dateFilter}
            GROUP BY user_id
            ORDER BY COUNT(*) DESC
            LIMIT 1`,
        [userId], (err, workoutStats) => {
            if (err) return res.status(400).json({ error: err.message });

            // Get exercise breakdown
            db.all(`SELECT exercise, COUNT(*) as count, SUM(calories) as calories
                FROM workout_sessions 
                WHERE user_id = ? AND ${dateFilter}
                GROUP BY exercise
                ORDER BY count DESC`,
                [userId], (err, exerciseBreakdown) => {
                    if (err) return res.status(400).json({ error: err.message });

                    // Get most active day of week
                    db.get(`SELECT strftime('%w', workout_date) as day_of_week, COUNT(*) as count
                    FROM workout_sessions 
                    WHERE user_id = ? AND ${dateFilter}
                    GROUP BY day_of_week
                    ORDER BY count DESC
                    LIMIT 1`,
                        [userId], (err, mostActiveDay) => {
                            if (err) return res.status(400).json({ error: err.message });

                            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                            res.json({
                                message: 'success',
                                data: {
                                    period,
                                    workout_stats: workoutStats || {},
                                    exercise_breakdown: exerciseBreakdown || [],
                                    most_active_day: mostActiveDay ? dayNames[mostActiveDay.day_of_week] : 'N/A'
                                }
                            });
                        });
                });
        });
});

// Serve static files from the dist directory (Vite build output)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve index.html for client-side routing
app.get(/(.*)/, (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Initialize meal reminder scheduler
    initializeScheduler();
});
