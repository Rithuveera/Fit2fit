import React from 'react';
import Hero3D from './Hero3D';
import Classes from './Classes';
import About from './About';
import MealReminders from './MealReminders';
import Membership from './Membership';

const Home = () => {
    return (
        <>
            <Hero3D />
            <Classes />
            <About />
            <MealReminders />
            <Membership />
        </>
    );
};

export default Home;
