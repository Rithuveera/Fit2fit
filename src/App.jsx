import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import Classes from './components/Classes';
import Membership from './components/Membership';
import About from './components/About';
import GamificationDashboard from './components/GamificationDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboardNew';
import WorkoutLogger from './components/WorkoutLogger';
import MealReminders from './components/MealReminders';
import ScrollProgress from './components/ScrollProgress';

import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <ScrollProgress />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/about" element={<About />} />
          <Route path="/meal-reminders" element={<MealReminders />} />
          <Route path="/dashboard" element={<AnalyticsDashboard />} />
          <Route path="/log-workout" element={<WorkoutLogger />} />
          <Route path="/gamification" element={<GamificationDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
