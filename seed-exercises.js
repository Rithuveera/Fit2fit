import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'gym.db');
const db = new sqlite3.Database(dbPath);

const exercises = [
    { name: 'Running', category: 'Cardio', avg_calories_per_30min: 300, description: 'Outdoor or treadmill running' },
    { name: 'Cycling', category: 'Cardio', avg_calories_per_30min: 250, description: 'Stationary or outdoor cycling' },
    { name: 'Swimming', category: 'Cardio', avg_calories_per_30min: 350, description: 'Lap swimming' },
    { name: 'Weight Training', category: 'Strength', avg_calories_per_30min: 200, description: 'Resistance training with weights' },
    { name: 'Yoga', category: 'Flexibility', avg_calories_per_30min: 120, description: 'Yoga practice' },
    { name: 'HIIT', category: 'Cardio', avg_calories_per_30min: 400, description: 'High-Intensity Interval Training' },
    { name: 'Pilates', category: 'Strength', avg_calories_per_30min: 150, description: 'Core strengthening exercises' },
    { name: 'Boxing', category: 'Cardio', avg_calories_per_30min: 350, description: 'Boxing training' },
    { name: 'Dance', category: 'Cardio', avg_calories_per_30min: 250, description: 'Dance fitness classes' },
    { name: 'Rowing', category: 'Cardio', avg_calories_per_30min: 300, description: 'Rowing machine workout' },
    { name: 'CrossFit', category: 'Mixed', avg_calories_per_30min: 350, description: 'CrossFit WOD' },
    { name: 'Stretching', category: 'Flexibility', avg_calories_per_30min: 80, description: 'Stretching routine' }
];

console.log('🏋️ Seeding exercise library...');

exercises.forEach(exercise => {
    db.run(
        `INSERT OR REPLACE INTO exercise_library (name, category, avg_calories_per_30min, description) 
         VALUES (?, ?, ?, ?)`,
        [exercise.name, exercise.category, exercise.avg_calories_per_30min, exercise.description],
        function (err) {
            if (err) {
                console.error(`❌ Error seeding exercise ${exercise.name}:`, err.message);
            } else {
                console.log(`✅ Added exercise: ${exercise.name}`);
            }
        }
    );
});

setTimeout(() => {
    db.get('SELECT COUNT(*) as count FROM exercise_library', [], (err, row) => {
        if (err) {
            console.error('Error counting exercises:', err.message);
        } else {
            console.log(`\n📊 Total exercises in library: ${row.count}`);
            console.log('✅ Exercise library seeded successfully!');
        }
        db.close();
    });
}, 2000);
