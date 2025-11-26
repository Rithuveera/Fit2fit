import React, { useState } from 'react';
import DietChart from './DietChart';

const ClassDetailsModal = ({ classItem, onClose }) => {
    const [activeSection, setActiveSection] = useState('details');

    if (!classItem) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black opacity-90" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-white bg-black/50 rounded-full p-1 hover:bg-neon-green hover:text-black transition"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header with Image */}
                <div className="w-full h-48 relative flex-shrink-0">
                    <img
                        src={classItem.image}
                        alt={classItem.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-black/50 to-transparent transition-colors duration-300"></div>
                    <div className="absolute bottom-4 left-6">
                        <h3 className="text-3xl font-bold text-white mb-1 font-orbitron">{classItem.title}</h3>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 px-6 pt-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <button
                        onClick={() => setActiveSection('details')}
                        className={`pb-3 px-2 font-semibold transition-all duration-300 relative ${activeSection === 'details'
                            ? 'text-neon-green'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Class Details
                        {activeSection === 'details' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-green" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveSection('diet')}
                        className={`pb-3 px-2 font-semibold transition-all duration-300 relative ${activeSection === 'diet'
                            ? 'text-neon-green'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Diet Plan
                        {activeSection === 'diet' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-green" />
                        )}
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeSection === 'details' ? (
                        <div className="space-y-6">
                            <div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                                    {classItem.description}
                                    <br /><br />
                                    Experience top-tier coaching and a supportive community. This class is designed to help you achieve your specific fitness goals efficiently.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-neon-green font-bold mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
                                    <span>📅</span> Schedule
                                </h4>
                                <ul className="text-gray-500 dark:text-gray-400 text-sm space-y-2 transition-colors">
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                                        Mon / Wed / Fri: 6:00 AM - 7:00 AM
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                                        Tue / Thu: 6:00 PM - 7:00 PM
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                                        Sat: 9:00 AM - 10:30 AM
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <DietChart dietChart={classItem.dietChart} />
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full bg-neon-green text-black font-bold py-3 px-6 rounded-xl hover:bg-green-400 transition duration-300 text-center"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailsModal;
