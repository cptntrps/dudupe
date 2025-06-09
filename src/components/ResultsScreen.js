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

  const { 
    correctAnswers = 0, 
    totalQuestions = 0, 
    xpEarned = 0, 
    accuracy = 0,
    timeSpent = 0,
    completionData 
  } = location.state || {};

  // Calculate accuracy if not provided
  const finalAccuracy = accuracy || (totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0);

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
    if (finalAccuracy >= 80) {
      resetHearts();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [finalAccuracy, resetHearts]);

  const handleContinue = () => {
    navigate('/lessons');
  };

  const getPerformanceMessage = () => {
    if (finalAccuracy >= 90) return { message: "Perfect! You're a star!", icon: "🌟" };
    if (finalAccuracy >= 80) return { message: "Great job! Keep it up!", icon: "🎉" };
    if (finalAccuracy >= 60) return { message: "Good work! Practice makes perfect!", icon: "👍" };
    return { message: "Keep practicing! You've got this!", icon: "💪" };
  };

  const formatTime = (minutes) => {
    if (minutes < 1) return `${Math.round(minutes * 60)}s`;
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${Math.round(minutes % 60)}m`;
  };

  const performance = getPerformanceMessage();

  return (
    <div className="results-screen">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={finalAccuracy >= 80 ? 300 : 150}
          gravity={0.1}
        />
      )}

      <div className="results-content">
        <div className="celebration-section">
          <div className="luna-celebration">🦊🎉</div>
          <div className="performance-icon">{performance.icon}</div>
          <h1 className="results-title">Lesson Complete!</h1>
          <p className="performance-message">{performance.message}</p>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{finalAccuracy}%</div>
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

          {timeSpent > 0 && (
            <div className="stat-item">
              <div className="stat-icon">⏱️</div>
              <div className="stat-info">
                <div className="stat-value">{formatTime(timeSpent)}</div>
                <div className="stat-label">Time Spent</div>
              </div>
            </div>
          )}
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
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - finalAccuracy / 100)}`}
            />
          </svg>
          <div className="progress-text">
            <span className="progress-percentage">{finalAccuracy}%</span>
          </div>
        </div>

        <div className="achievements-section">
          {finalAccuracy === 100 && (
            <div className="achievement">
              <span className="achievement-icon">🏅</span>
              <span className="achievement-text">Perfect Score!</span>
            </div>
          )}
          {finalAccuracy >= 80 && (
            <div className="achievement">
              <span className="achievement-icon">❤️</span>
              <span className="achievement-text">Hearts Restored!</span>
            </div>
          )}
          {completionData?.achievements?.map((achievement, index) => (
            <div key={index} className="achievement">
              <span className="achievement-icon">{achievement.icon}</span>
              <span className="achievement-text">{achievement.name}</span>
            </div>
          ))}
          {timeSpent > 0 && timeSpent < 2 && (
            <div className="achievement">
              <span className="achievement-icon">⚡</span>
              <span className="achievement-text">Speed Demon!</span>
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