import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PaymentModal from './PaymentModal';

const plans = [
    {
        name: 'Basic',
        price: '$29',
        features: ['Access to gym floor', 'Locker room access', 'Free WiFi'],
        recommended: false
    },
    {
        name: 'Pro',
        price: '$59',
        features: ['All Basic features', 'Unlimited classes', 'Guest pass (1/month)', 'Sauna access'],
        recommended: true
    },
    {
        name: 'Elite',
        price: '$99',
        features: ['All Pro features', 'Personal training (2x/month)', 'Nutrition consultation', 'Priority support'],
        recommended: false
    }
];

const Membership = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);

    return (
        <section id="membership" className="py-20 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300"
                    >
                        MEMBERSHIP <span className="text-neon-green">PLANS</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300"
                    >
                        Choose the plan that fits your lifestyle.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            whileHover={{
                                scale: 1.05,
                                y: -10,
                                boxShadow: plan.recommended ? "0px 0px 30px rgba(57, 255, 20, 0.4)" : "0px 0px 20px rgba(0, 0, 0, 0.1)"
                            }}
                            className={`relative bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 ${plan.recommended ? 'border-neon-green transform scale-105 shadow-[0_0_20px_rgba(57,255,20,0.3)]' : 'border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600'} transition duration-300 flex flex-col`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neon-green text-black font-bold px-4 py-1 rounded-full text-sm">
                                    MOST POPULAR
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{plan.name}</h3>
                            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
                                {plan.price}<span className="text-xl text-gray-500 font-normal">/mo</span>
                            </div>
                            <ul className="mb-8 flex-grow space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-gray-600 dark:text-gray-300 transition-colors duration-300">
                                        <svg className="w-5 h-5 text-neon-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setSelectedPlan(plan)}
                                className={`w-full py-3 rounded-xl font-bold transition duration-300 ${plan.recommended ? 'bg-neon-green text-black hover:bg-green-400' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'}`}
                            >
                                Choose Plan
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {selectedPlan && (
                <PaymentModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
            )}
        </section>
    );
};

export default Membership;
