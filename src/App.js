import React, { useState } from 'react';
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
  const { user, userData, loading, handleAuthSuccess, handleLogout } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="luna-loading">🦊</div>
    );
  }

  return (
    <div className="App">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          handleAuthSuccess(user);
          setShowAuthModal(false);
        }}
      />
      
      {/* User Header - shown when logged in */}
      {user && (
        <div className="user-header">
          <div className="app-title-small">
            <span className="luna-icon">🦊</span>
            <span>Lulearn</span>
          </div>
          <UserProfile 
            user={user}
            onLogout={handleLogout}
          />
        </div>
      )}
      
      {/* Login Button - shown when NOT logged in */}
      {!user && (
        <div className="guest-header">
          <div className="app-title-small">
            <span className="luna-icon">🦊</span>
            <span>Lulearn</span>
          </div>
          <button 
            className="login-btn"
            onClick={() => setShowAuthModal(true)}
          >
            Login / Sign Up
          </button>
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