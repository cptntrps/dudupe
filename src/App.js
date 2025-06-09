import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import LanguageSelection from './components/LanguageSelection';
import LessonMap from './components/LessonMap';
import LessonInterface from './components/LessonInterface';
import ResultsScreen from './components/ResultsScreen';
import AchievementNotification from './components/AchievementNotification';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router basename="/dudupe">
        <div className="container">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/language-selection" element={<LanguageSelection />} />
            <Route path="/lessons" element={<LessonMap />} />
            <Route path="/lesson/:lessonId" element={<LessonInterface />} />
            <Route path="/results" element={<ResultsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <AchievementNotification />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App; 