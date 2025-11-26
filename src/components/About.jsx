import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <section id="about" className="py-20 bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold mb-6 transition-colors duration-300">
                            ABOUT <span className="text-neon-green">FIT2FIT</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed transition-colors duration-300">
                            At Fit2Fit, we believe that fitness is not just a destination, but a journey.
                            Founded in 2023, our mission is to empower individuals to reach their full potential
                            through state-of-the-art facilities, expert coaching, and a supportive community.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed transition-colors duration-300">
                            Whether you are a beginner taking your first steps or an elite athlete pushing your limits,
                            we provide the environment and tools you need to succeed. Join us and redefine what is possible.
                        </p>

                        <div className="grid grid-cols-3 gap-8 border-t border-gray-200 dark:border-gray-800 pt-8 transition-colors duration-300">
                            <div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">24/7</div>
                                <div className="text-sm text-gray-500 uppercase tracking-wider">Access</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">50+</div>
                                <div className="text-sm text-gray-500 uppercase tracking-wider">Trainers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">1000+</div>
                                <div className="text-sm text-gray-500 uppercase tracking-wider">Members</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Image Content */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="absolute -inset-4 bg-neon-green opacity-20 blur-xl rounded-2xl"></div>
                        <img
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="Gym Interior"
                            className="relative rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full object-cover h-[500px] transition-colors duration-300"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
