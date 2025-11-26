import React, { useState } from 'react';
import axios from 'axios';

const PaymentModal = ({ plan, onClose }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            await axios.post('http://localhost:3000/api/pay', {
                member_name: formData.cardName,
                plan: plan.name,
                amount: plan.price,
                card_last4: formData.cardNumber.slice(-4)
            });

            setIsProcessing(false);
            setIsSuccess(true);
        } catch (error) {
            console.error('Payment failed:', error);
            setIsProcessing(false);
            alert('Payment failed. Please try again.');
        }
    };

    if (!plan) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black opacity-80" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl transition-colors duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {!isSuccess ? (
                    <>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Checkout</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">You are subscribing to the <span className="text-neon-green font-bold">{plan.name}</span> plan at <span className="text-gray-900 dark:text-white font-bold transition-colors">{plan.price}</span>/mo.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 transition-colors">Cardholder Name</label>
                                <input
                                    type="text"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-neon-green transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 transition-colors">Card Number</label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    required
                                    maxLength="16"
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-neon-green transition-colors"
                                    placeholder="0000 0000 0000 0000"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 transition-colors">Expiry Date</label>
                                    <input
                                        type="text"
                                        name="expiry"
                                        value={formData.expiry}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-neon-green transition-colors"
                                        placeholder="MM/YY"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1 transition-colors">CVC</label>
                                    <input
                                        type="text"
                                        name="cvc"
                                        value={formData.cvc}
                                        onChange={handleChange}
                                        required
                                        maxLength="3"
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-neon-green transition-colors"
                                        placeholder="123"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full py-3 rounded-xl font-bold text-black mt-6 transition duration-300 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-neon-green hover:bg-green-400'}`}
                            >
                                {isProcessing ? 'Processing...' : `Pay ${plan.price}`}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Payment Successful!</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">Welcome to the Fit2Fit family. Your membership is now active.</p>
                        <button
                            onClick={onClose}
                            className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
