import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Confetti from 'react-confetti';
import './ResultsScreen.css';

const ResultsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetHearts } = useApp();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const { correctAnswers = 0, totalQuestions = 0, xpEarned = 0 } = location.state || {};
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Stop confetti after 4 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    // Reset hearts if lesson completed successfully
    if (accuracy >= 80) {
      resetHearts();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [accuracy, resetHearts]);

  const handleContinue = () => {
    navigate('/lessons');
  };

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "Perfect! You're a star!", icon: "🌟" };
    if (accuracy >= 80) return { message: "Great job! Keep it up!", icon: "🎉" };
    if (accuracy >= 60) return { message: "Good work! Practice makes perfect!", icon: "👍" };
    return { message: "Keep practicing! You've got this!", icon: "💪" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="results-screen">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={accuracy >= 80 ? 300 : 150}
          gravity={0.1}
        />
      )}

      <div className="results-content">
        <div className="celebration-section">
          <div className="owl-celebration">🦉</div>
          <div className="performance-icon">{performance.icon}</div>
          <h1 className="results-title">Lesson Complete!</h1>
          <p className="performance-message">{performance.message}</p>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{accuracy}%</div>
              <div className="stat-label">Accuracy</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-value">{correctAnswers}/{totalQuestions}</div>
              <div className="stat-label">Correct</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <div className="stat-value">+{xpEarned}</div>
              <div className="stat-label">XP Earned</div>
            </div>
          </div>
        </div>

        <div className="progress-circle">
          <svg className="progress-ring" width="120" height="120">
            <circle
              className="progress-ring-circle-bg"
              stroke="#e5e5e5"
              strokeWidth="8"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
            />
            <circle
              className="progress-ring-circle"
              stroke="#58cc02"
              strokeWidth="8"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - accuracy / 100)}`}
            />
          </svg>
          <div className="progress-text">
            <span className="progress-percentage">{accuracy}%</span>
          </div>
        </div>

        <div className="achievements-section">
          {accuracy === 100 && (
            <div className="achievement">
              <span className="achievement-icon">🏅</span>
              <span className="achievement-text">Perfect Score!</span>
            </div>
          )}
          {accuracy >= 80 && (
            <div className="achievement">
              <span className="achievement-icon">❤️</span>
              <span className="achievement-text">Hearts Restored!</span>
            </div>
          )}
        </div>

        <div className="results-actions">
          <button className="continue-btn" onClick={handleContinue}>
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen; 