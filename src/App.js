import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import WelcomeScreen from './components/WelcomeScreen';
import LanguageSelection from './components/LanguageSelection';
import LessonMap from './components/LessonMap';
import LessonInterface from './components/LessonInterface';
import ResultsScreen from './components/ResultsScreen';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import AchievementNotification from './components/AchievementNotification';
import './App.css';

function AppContent() {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="luna-loading">🦊</div>
    );
  }

  return (
    <div className="App">
      {!user && <AuthModal />}
      {user && (
        <div className="user-header">
          <div className="app-title-small">
            <span className="luna-icon">🦊</span>
            <span>Lulearn</span>
          </div>
          <UserProfile />
        </div>
      )}
      <AchievementNotification />
      
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/language-selection" element={<LanguageSelection />} />
        <Route path="/lessons" element={<LessonMap />} />
        <Route path="/lesson/:lessonId" element={<LessonInterface />} />
        <Route path="/results" element={<ResultsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router basename="/dudupe">
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App; 