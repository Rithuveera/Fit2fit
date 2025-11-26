import React from 'react';

const Footer = () => {
    return (
        <footer id="about" className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-12 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <span className="font-bold text-2xl tracking-wider text-neon-green block mb-4 font-orbitron">FIT2FIT</span>
                        <p className="text-gray-600 dark:text-gray-400 max-w-sm transition-colors duration-300">
                            Empowering you to reach your peak performance. Join the community that never quits.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white transition-colors duration-300">Quick Links</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                            <li><a href="#" className="hover:text-neon-green transition">Home</a></li>
                            <li><a href="#classes" className="hover:text-neon-green transition">Classes</a></li>
                            <li><a href="#membership" className="hover:text-neon-green transition">Membership</a></li>
                            <li><a href="#about" className="hover:text-neon-green transition">About Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white transition-colors duration-300">Contact</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                            <li>123 Fitness Blvd, Gym City</li>
                            <li>contact@fit2fit.com</li>
                            <li>(555) 123-4567</li>
                        </ul>
                        <div className="mt-4 flex space-x-4">
                            {/* Social Icons placeholders */}
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-neon-green hover:text-black transition cursor-pointer flex items-center justify-center text-xs font-bold transition-colors duration-300">IG</div>
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-neon-green hover:text-black transition cursor-pointer flex items-center justify-center text-xs font-bold transition-colors duration-300">FB</div>
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-neon-green hover:text-black transition cursor-pointer flex items-center justify-center text-xs font-bold transition-colors duration-300">TW</div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm transition-colors duration-300">
                    &copy; {new Date().getFullYear()} Fit2Fit. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
