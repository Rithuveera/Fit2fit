import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ClassDetailsModal from './ClassDetailsModal';
import hiitImage from '../assets/hiit.png';

const classes = [
    {
        title: 'High Intensity Interval Training',
        description: 'Push your limits with our signature HIIT classes designed to burn fat and build muscle.',
        image: hiitImage,
        dietChart: {
            preWorkout: {
                meal: 'Banana with dates & black coffee',
                timing: '30-45 minutes before workout',
                calories: '200-250 kcal'
            },
            postWorkout: {
                meal: 'Whey protein shake with banana & poha',
                timing: 'Within 30 minutes after workout',
                calories: '300-350 kcal'
            },
            macros: {
                protein: '30-35%',
                carbs: '40-45%',
                fats: '20-25%',
                description: 'High carb intake for energy, moderate protein for recovery'
            },
            dailyMeals: [
                { name: 'Breakfast', meal: 'Poha with peanuts, curry leaves & lemon OR Moong dal chilla with mint chutney', time: '7:00 AM' },
                { name: 'Mid-Morning', meal: 'Curd (dahi) with roasted chana & fruits', time: '10:00 AM' },
                { name: 'Lunch', meal: 'Grilled chicken/paneer, brown rice, dal, sabzi & salad', time: '1:00 PM' },
                { name: 'Pre-Workout', meal: 'Banana with dates OR upma (small portion)', time: '4:30 PM' },
                { name: 'Post-Workout', meal: 'Protein shake with banana', time: '6:30 PM' },
                { name: 'Dinner', meal: 'Grilled fish/chicken tikka, roti, dal & sautéed vegetables', time: '8:30 PM' }
            ],
            hydration: '3-4 liters daily, increase during intense sessions',
            tips: [
                'Focus on complex carbs for sustained energy',
                'Time your meals around workout sessions',
                'Stay hydrated throughout the day',
                'Include electrolytes during long sessions'
            ],
            goals: {
                fatLoss: {
                    title: '🔥 Fat Loss Focus',
                    calorieTarget: '1,800-2,000 kcal/day',
                    macroAdjustment: 'Increase protein to 35-40%, reduce carbs to 30-35%',
                    strategy: 'HIIT is excellent for fat burning. Create a 300-500 calorie deficit while maintaining protein intake to preserve muscle mass.',
                    mealTiming: 'Consider intermittent fasting (16:8) - skip breakfast and have your first meal post-workout',
                    supplements: 'Green tea extract, L-carnitine, BCAAs during fasted training'
                },
                muscleGain: {
                    title: '💪 Muscle Building Focus',
                    calorieTarget: '2,500-2,800 kcal/day',
                    macroAdjustment: 'Increase protein to 35-40%, maintain carbs at 40-45%',
                    strategy: 'HIIT combined with strength training. Maintain a 300-500 calorie surplus with emphasis on post-workout nutrition.',
                    mealTiming: 'Eat 5-6 meals daily, never skip post-workout meal, add a pre-bed protein shake',
                    supplements: 'Whey protein, creatine monohydrate, mass gainer if needed'
                }
            }
        }
    },
    {
        title: 'Yoga Flow',
        description: 'Find your balance and improve flexibility with our calming yet challenging yoga sessions.',
        image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        dietChart: {
            preWorkout: {
                meal: 'Coconut water with soaked almonds OR herbal tea',
                timing: '1-2 hours before practice',
                calories: '100-150 kcal'
            },
            postWorkout: {
                meal: 'Fresh fruit bowl with flax seeds & coconut',
                timing: '30-60 minutes after practice',
                calories: '200-250 kcal'
            },
            macros: {
                protein: '20-25%',
                carbs: '50-55%',
                fats: '25-30%',
                description: 'Balanced nutrition with emphasis on whole foods'
            },
            dailyMeals: [
                { name: 'Breakfast', meal: 'Idli with sambar & coconut chutney OR oats upma with vegetables', time: '7:30 AM' },
                { name: 'Mid-Morning', meal: 'Handful of soaked almonds, walnuts & green tea', time: '10:30 AM' },
                { name: 'Lunch', meal: 'Brown rice, dal, paneer/tofu curry, sabzi & raita', time: '1:00 PM' },
                { name: 'Afternoon', meal: 'Sprouts chaat OR roasted makhana', time: '4:00 PM' },
                { name: 'Post-Yoga', meal: 'Fresh fruit bowl with chia/flax seeds', time: '7:00 PM' },
                { name: 'Dinner', meal: 'Moong dal khichdi with ghee, curd & papad', time: '8:30 PM' }
            ],
            hydration: '2.5-3 liters daily, sip water during practice',
            tips: [
                'Eat light before practice to avoid discomfort',
                'Focus on plant-based whole foods',
                'Include anti-inflammatory foods like turmeric',
                'Practice mindful eating habits'
            ],
            goals: {
                fatLoss: {
                    title: '🔥 Fat Loss Focus',
                    calorieTarget: '1,600-1,800 kcal/day',
                    macroAdjustment: 'Increase protein to 25-30%, reduce carbs to 45-50%',
                    strategy: 'Yoga aids fat loss through stress reduction and mindful eating. Focus on whole, unprocessed foods and portion control.',
                    mealTiming: 'Practice on an empty stomach (morning), eat your largest meal at lunch, light dinner before 7 PM',
                    supplements: 'Ashwagandha for stress management, digestive enzymes, probiotics'
                },
                muscleGain: {
                    title: '💪 Muscle Building Focus',
                    calorieTarget: '2,200-2,400 kcal/day',
                    macroAdjustment: 'Increase protein to 30%, maintain carbs at 50%',
                    strategy: 'While yoga isn\'t primarily for muscle building, power yoga combined with proper nutrition supports lean muscle development.',
                    mealTiming: 'Eat protein-rich breakfast, post-yoga protein smoothie, balanced meals every 3-4 hours',
                    supplements: 'Plant-based protein powder, spirulina, hemp seeds, chia seeds'
                }
            }
        }
    },
    {
        title: 'Strength & Conditioning',
        description: 'Build raw power and functional strength with expert-led weightlifting classes.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        dietChart: {
            preWorkout: {
                meal: 'Peanut butter chikki with banana OR rice flakes (poha) with peanuts',
                timing: '60-90 minutes before workout',
                calories: '300-350 kcal'
            },
            postWorkout: {
                meal: 'Grilled chicken/paneer with brown rice & vegetables',
                timing: 'Within 45 minutes after workout',
                calories: '500-600 kcal'
            },
            macros: {
                protein: '35-40%',
                carbs: '35-40%',
                fats: '20-25%',
                description: 'High protein for muscle building, adequate carbs for energy'
            },
            dailyMeals: [
                { name: 'Breakfast', meal: 'Egg bhurji (4 eggs) with multigrain roti & avocado/paneer', time: '7:00 AM' },
                { name: 'Mid-Morning', meal: 'Whey protein shake with banana & soaked almonds', time: '10:00 AM' },
                { name: 'Lunch', meal: 'Chicken/mutton curry, brown rice, dal & mixed vegetable sabzi', time: '12:30 PM' },
                { name: 'Pre-Workout', meal: 'Peanut butter chikki with banana OR sweet potato chaat', time: '3:30 PM' },
                { name: 'Post-Workout', meal: 'Grilled chicken tikka/paneer with brown rice & stir-fried veggies', time: '6:00 PM' },
                { name: 'Dinner', meal: 'Fish curry/chicken keema, quinoa/roti, dal & cucumber raita', time: '8:30 PM' }
            ],
            hydration: '3.5-4.5 liters daily, especially during heavy lifting',
            tips: [
                'Prioritize protein intake for muscle recovery',
                'Consume carbs around workout times',
                'Include healthy fats for hormone production',
                'Consider creatine supplementation'
            ],
            goals: {
                fatLoss: {
                    title: '🔥 Fat Loss Focus',
                    calorieTarget: '2,000-2,200 kcal/day',
                    macroAdjustment: 'High protein 40-45%, moderate carbs 30-35%, fats 20-25%',
                    strategy: 'Strength training preserves muscle during fat loss. Maintain high protein intake and lift heavy to prevent muscle loss while in deficit.',
                    mealTiming: 'Carb cycling - high carbs on training days, low carbs on rest days. Never skip post-workout meal.',
                    supplements: 'Whey isolate, BCAAs, fat burners (caffeine, green tea), CLA'
                },
                muscleGain: {
                    title: '💪 Muscle Building Focus',
                    calorieTarget: '2,800-3,200 kcal/day',
                    macroAdjustment: 'Very high protein 40-45%, high carbs 35-40%, moderate fats 20%',
                    strategy: 'Optimal for muscle building. Progressive overload with adequate nutrition. Aim for 1g protein per lb of body weight.',
                    mealTiming: 'Eat every 2-3 hours (6-7 meals), large post-workout meal, casein protein before bed',
                    supplements: 'Whey protein, creatine (5g daily), mass gainer, beta-alanine, citrulline malate'
                }
            }
        }
    }
];

const TiltCard = ({ item, index, onClick }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const xPct = (e.clientX - rect.left) / width - 0.5;
        const yPct = (e.clientY - rect.top) / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="relative h-[450px] w-full cursor-pointer perspective-1000 group"
        >
            {/* Neon Glow Effect */}
            <div className="absolute inset-0 bg-neon-green/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 transform translate-y-4" />

            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 group-hover:border-neon-green transition-colors duration-300 bg-white dark:bg-gray-900">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 z-10" />

                <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    style={{ scale: 1.1 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 z-20" />

                <div className="absolute bottom-0 left-0 p-8 w-full z-30 transform translate-z-20">
                    <h3 className="text-2xl font-bold text-white mb-2 font-orbitron group-hover:text-neon-green transition-colors">{item.title}</h3>
                    <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        {item.description}
                    </p>
                    <motion.button
                        className="mt-4 text-neon-green font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 transform translate-y-4 group-hover:translate-y-0"
                        whileHover={{ x: 5 }}
                    >
                        Learn More <span>&rarr;</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

const Classes = () => {
    const [selectedClass, setSelectedClass] = useState(null);

    return (
        <section id="classes" className="py-20 bg-gray-100 dark:bg-gray-950 relative overflow-hidden min-h-screen flex flex-col justify-center transition-colors duration-300">
            {/* Scrolling Background Text */}
            <div className="absolute top-20 left-0 w-full overflow-hidden opacity-10 dark:opacity-30 pointer-events-none select-none transition-opacity duration-300">
                <motion.div
                    className="whitespace-nowrap text-[10rem] font-black text-transparent stroke-text"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    style={{ WebkitTextStroke: "2px #39ff14" }}
                >
                    TRAIN • SWEAT • REPEAT • TRAIN • SWEAT • REPEAT •
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl font-black text-gray-900 dark:text-white mb-4 font-orbitron tracking-wider transition-colors duration-300"
                    >
                        OUR <span className="text-neon-green">CLASSES</span>
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-1 w-24 bg-neon-green mx-auto mb-6"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg transition-colors duration-300"
                    >
                        Designed for all fitness levels, our classes will help you reach your goals.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-2000">
                    {classes.map((item, index) => (
                        <TiltCard
                            key={index}
                            item={item}
                            index={index}
                            onClick={() => setSelectedClass(item)}
                        />
                    ))}
                </div>
            </div>

            {selectedClass && (
                <ClassDetailsModal classItem={selectedClass} onClose={() => setSelectedClass(null)} />
            )}
        </section>
    );
};

export default Classes;
