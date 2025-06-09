import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import LanguageSelection from './components/LanguageSelection';
import LessonMap from './components/LessonMap';
import LessonInterface from './components/LessonInterface';
import ResultsScreen from './components/ResultsScreen';
import AchievementNotification from './components/AchievementNotification';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { AppProvider, useApp } from './context/AppContext';
import './App.css';

// Loading component
const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-content">
      <div className="owl-loading">🦉</div>
      <h2>DuolingoDupe</h2>
      <div className="loading-spinner">Loading...</div>
    </div>
  </div>
);

// Main app content component
const AppContent = () => {
  const { user, userData, loading, authChecked, handleAuthSuccess, handleLogout } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading screen while checking authentication
  if (!authChecked || loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container">
      {/* Top navigation bar */}
      <div className="top-nav">
        <div className="nav-left">
          <h1 className="app-title">
            <span className="owl-icon">🦉</span>
            DuolingoDupe
          </h1>
        </div>
        <div className="nav-right">
          {user ? (
            <UserProfile 
              user={user} 
              userData={userData} 
              onLogout={handleLogout} 
            />
          ) : (
            <button 
              className="login-btn"
              onClick={() => setShowAuthModal(true)}
            >
              <span>👤</span>
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/language-selection" element={<LanguageSelection />} />
          <Route path="/lessons" element={<LessonMap />} />
          <Route path="/lesson/:lessonId" element={<LessonInterface />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Notifications and modals */}
      <AchievementNotification />
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          handleAuthSuccess(user);
          setShowAuthModal(false);
        }}
      />

      {/* User benefits banner for guests */}
      {!user && (
        <div className="guest-banner">
          <div className="banner-content">
            <span className="banner-icon">🔥</span>
            <span className="banner-text">
              Sign up to save your progress and sync across devices!
            </span>
            <button 
              className="banner-btn"
              onClick={() => setShowAuthModal(true)}
            >
              Create Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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