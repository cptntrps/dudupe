import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import './AchievementNotification.css';

const AchievementNotification = () => {
  const { achievements, dismissAchievements } = useApp();
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (achievements.length > 0) {
      setVisible(true);
      setCurrentIndex(0);
    }
  }, [achievements]);

  useEffect(() => {
    if (visible && achievements.length > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visible, achievements.length, handleClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      dismissAchievements();
      setCurrentIndex(0);
    }, 300); // Wait for animation to complete
  };

  if (!visible || achievements.length === 0) {
    return null;
  }

  const currentAchievement = achievements[currentIndex];

  return (
    <div className={`achievement-overlay ${visible ? 'visible' : ''}`}>
      <div className="achievement-notification">
        <div className="achievement-header">
          <h2>🎉 Achievement Unlocked!</h2>
          <button 
            className="close-button" 
            onClick={handleClose}
            aria-label="Close achievement notification"
          >
            ×
          </button>
        </div>
        
        <div className="achievement-content">
          <div className="achievement-icon">
            {currentAchievement.icon}
          </div>
          <div className="achievement-details">
            <h3>{currentAchievement.name}</h3>
            <p>{currentAchievement.description}</p>
          </div>
        </div>
        
        <div className="achievement-footer">
          {achievements.length > 1 && (
            <div className="achievement-progress">
              {currentIndex + 1} of {achievements.length}
            </div>
          )}
          <div className="achievement-timestamp">
            Earned {new Date(currentAchievement.earnedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification; 