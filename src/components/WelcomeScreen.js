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
        <div className="logo-section">
          <div className="duolingo-logo">
            <div className="owl-character">🦉</div>
            <h1 className="app-title">EnglishOwl</h1>
          </div>
          <p className="tagline">Aprenda inglês grátis, para sempre</p>
          <p className="subtitle">Learn English free, forever</p>
        </div>

        <div className="illustration">
          <div className="characters">
            <div className="character character-1">🐸</div>
            <div className="character character-2">👨‍💻</div>
            <div className="character character-3">👩‍🎨</div>
          </div>
        </div>

        <div className="welcome-actions">
          <button className="get-started-btn" onClick={handleGetStarted}>
            GET STARTED
          </button>
          <button className="have-account-btn" onClick={handleGetStarted}>
            I ALREADY HAVE AN ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen; 