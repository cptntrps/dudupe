import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getLessonsForLanguage } from '../data/lessonsData';
import './LessonMap.css';

const LessonMap = () => {
  const navigate = useNavigate();
  const { selectedLanguage, completedLessons, xp, streak } = useApp();
  
  const lessons = getLessonsForLanguage(selectedLanguage?.id);

  const handleLessonClick = (lessonId) => {
    navigate(`/lesson/${lessonId}`);
  };

  const handleBackToLanguages = () => {
    navigate('/language-selection');
  };

  const isLessonUnlocked = (lessonIndex) => {
    if (lessonIndex === 0) return true;
    const previousLessonId = lessons[lessonIndex - 1]?.id;
    return completedLessons.has(previousLessonId);
  };

  const isLessonCompleted = (lessonId) => {
    return completedLessons.has(lessonId);
  };

  if (!selectedLanguage) {
    navigate('/language-selection');
    return null;
  }

  return (
    <div className="lesson-map">
      <div className="map-header">
        <button className="back-button" onClick={handleBackToLanguages}>
          ←
        </button>
        <div className="language-info">
          <span className="language-flag">{selectedLanguage.flag}</span>
          <span className="language-name">{selectedLanguage.name}</span>
        </div>
        <div className="stats">
          <div className="xp-display">
            <span className="xp-icon">🏆</span>
            <span>{xp}</span>
          </div>
        </div>
      </div>

      <div className="map-content">
        <div className="map-path">
          {lessons.map((lesson, index) => {
            const unlocked = isLessonUnlocked(index);
            const completed = isLessonCompleted(lesson.id);
            
            return (
              <div key={lesson.id} className="lesson-node-container">
                <div
                  className={`lesson-node ${completed ? 'completed' : ''} ${unlocked ? 'unlocked' : 'locked'}`}
                  onClick={() => unlocked && handleLessonClick(lesson.id)}
                >
                  <div className="lesson-icon">
                    {completed ? '✓' : unlocked ? '📚' : '🔒'}
                  </div>
                  <div className="lesson-number">{lesson.id}</div>
                </div>
                
                <div className="lesson-info">
                  <h3 className="lesson-title">{lesson.title}</h3>
                  <p className="lesson-description">{lesson.description}</p>
                  <div className="lesson-xp">+{lesson.xp} XP</div>
                </div>

                {index < lessons.length - 1 && (
                  <div className="path-connector"></div>
                )}
              </div>
            );
          })}
        </div>

        {streak > 0 && (
          <div className="streak-display">
            <div className="streak-flame">🔥</div>
            <div className="streak-text">
              <strong>{streak} day streak!</strong>
              <p>Keep it up!</p>
            </div>
          </div>
        )}
      </div>

      <div className="bottom-nav">
        <div className="nav-item active">
          <span className="nav-icon">🏠</span>
          <span>Learn</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📖</span>
          <span>Stories</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">🏆</span>
          <span>Leagues</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">💎</span>
          <span>Shop</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">👤</span>
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default LessonMap; 