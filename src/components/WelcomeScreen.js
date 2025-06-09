import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/language-selection');
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="lulearn-logo">
          <div className="luna-character">🦊</div>
          <h1 className="app-title">Lulearn</h1>
          <p className="app-subtitle">Learn languages with Luna!</p>
        </div>
        <button className="get-started-btn" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen; 