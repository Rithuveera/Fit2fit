import React from 'react';

const Hero = () => {
    return (
        <div className="relative bg-gray-900 h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Gym Background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90"></div>
            </div>

            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4">
                    UNLEASH YOUR <span className="text-neon-green">POTENTIAL</span>
                </h1>
                <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                    Join Fit2Fit and experience the ultimate fitness journey. Premium equipment, expert trainers, and a community that drives you forward.
                </p>
                <div className="flex justify-center gap-4">
                    <a href="#membership" className="bg-neon-green text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-green-400 transition transform hover:scale-105 duration-300 inline-block">
                        Start Your Journey
                    </a>
                    <a href="#classes" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-white hover:text-black transition transform hover:scale-105 duration-300 inline-block">
                        View Classes
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Hero;
