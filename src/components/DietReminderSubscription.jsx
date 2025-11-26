import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const DietReminderSubscription = ({ classType }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [whatsappEnabled, setWhatsappEnabled] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Check subscription status on mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            checkSubscriptionStatus(savedEmail);
        }
    }, [classType]);

    const checkSubscriptionStatus = async (userEmail) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/reminder-status/${userEmail}/${classType}`);
            if (response.data.data.subscribed) {
                setIsSubscribed(true);
                setName(response.data.data.subscription.name || '');
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email || !validateEmail(email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address' });
            return;
        }

        if (whatsappEnabled && phoneNumber && !validatePhone(phoneNumber)) {
            setMessage({ type: 'error', text: 'Please enter a valid phone number with country code (e.g., +1234567890)' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post('http://localhost:3000/api/subscribe-reminders', {
                email,
                name,
                class_type: classType,
                phone_number: whatsappEnabled ? phoneNumber : null,
                whatsapp_enabled: whatsappEnabled && !!phoneNumber
            });

            if (response.data.message === 'success') {
                setIsSubscribed(true);
                localStorage.setItem('userEmail', email);
                const confirmMsg = response.data.data.whatsapp_enabled
                    ? '✅ Subscribed! Check your email and WhatsApp for confirmation.'
                    : '✅ Subscribed! Check your email for confirmation.';
                setMessage({
                    type: 'success',
                    text: confirmMsg
                });
            }
        } catch (error) {
            console.error('Subscription error:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Subscription failed. Please try again.';
            setMessage({
                type: 'error',
                text: `❌ ${errorMessage}`
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribe = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post('http://localhost:3000/api/unsubscribe-reminders', {
                email,
                class_type: classType
            });

            if (response.data.message === 'success') {
                setIsSubscribed(false);
                setMessage({
                    type: 'success',
                    text: '✅ Unsubscribed successfully'
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: '❌ Unsubscribe failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone) => {
        // E.164 format: +[country code][number]
        return /^\+[1-9]\d{1,14}$/.test(phone);
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📧</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Meal Reminders</h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get email {whatsappEnabled && '& WhatsApp '}reminders for your {classType} diet plan meals throughout the day
            </p>

            {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-3">
                    <div>
                        <input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neon-green transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Your name (optional)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neon-green transition-colors"
                        />
                    </div>

                    {/* WhatsApp Option */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={whatsappEnabled}
                                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                                className="w-4 h-4 text-neon-green bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-neon-green"
                            />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                                <span>💬</span> Also send via WhatsApp
                            </span>
                        </label>

                        {whatsappEnabled && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3"
                            >
                                <input
                                    type="tel"
                                    placeholder="Phone number (e.g., +1234567890)"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neon-green transition-colors"
                                />
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    Include country code (e.g., +1 for US, +91 for India)
                                </p>
                            </motion.div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-neon-green text-black font-bold py-3 px-6 rounded-lg hover:bg-green-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Subscribing...' : '🔔 Subscribe to Reminders'}
                    </button>
                </form>
            ) : (
                <div className="space-y-3">
                    <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-4">
                        <p className="text-sm text-green-800 dark:text-green-200 font-semibold">
                            ✅ You're subscribed to meal reminders!
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                            {email}
                        </p>
                    </div>
                    <button
                        onClick={handleUnsubscribe}
                        disabled={loading}
                        className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Unsubscribing...' : 'Unsubscribe'}
                    </button>
                </div>
            )}

            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mt-3 p-3 rounded-lg text-sm ${message.type === 'success'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DietReminderSubscription;
