import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import './AchievementNotification.css';

const AchievementNotification = () => {
  const { achievements, dismissAchievements } = useApp();
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      dismissAchievements();
      setCurrentIndex(0);
    }, 300);
  }, [dismissAchievements]);

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

  if (!visible || achievements.length === 0) {
    return null;
  }

  const currentAchievement = achievements[currentIndex];

  return (
    <div className={`achievement-notification ${visible ? 'show' : ''}`}>
      <div className="achievement-content">
        <button className="close-achievement" onClick={handleClose}>
          ×
        </button>
        <div className="achievement-icon">
          {currentAchievement.icon}
        </div>
        <div className="achievement-text">
          <h3>Achievement Unlocked!</h3>
          <p>{currentAchievement.name}</p>
          <small>{currentAchievement.description}</small>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification; 