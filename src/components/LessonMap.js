import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getLessonsForLanguage } from '../data/lessonsData';
import './LessonMap.css';

const LessonMap = () => {
  const navigate = useNavigate();
  const { 
    selectedLanguage, 
    userStats, 
    isLessonCompleted, 
    getLessonCompletion,
    getLanguageProgress 
  } = useApp();
  
  const lessons = getLessonsForLanguage(selectedLanguage?.id);
  const languageProgress = getLanguageProgress();

  const handleLessonClick = (lessonId) => {
    navigate(`/lesson/${lessonId}`);
  };

  const handleBackToLanguages = () => {
    navigate('/language-selection');
  };

  const isLessonUnlocked = (lessonIndex) => {
    // Make all lessons available from the start
    return true;
  };

  const getLessonStatus = (lessonId) => {
    const completion = getLessonCompletion(lessonId);
    if (!completion) return null;
    
    return {
      completed: true,
      accuracy: completion.accuracy,
      xpEarned: completion.xpEarned,
      completedAt: completion.completedAt
    };
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
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <span className="stat-value">{userStats.totalXP}</span>
            <span className="stat-label">XP</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{userStats.currentStreak}</span>
            <span className="stat-label">Streak</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{userStats.level}</span>
            <span className="stat-label">Level</span>
          </div>
        </div>
      </div>

      {/* Language Progress Overview */}
      {languageProgress && (
        <div className="language-progress-overview">
          <h3>📊 Your Progress</h3>
          <div className="progress-stats">
            <div className="progress-stat">
              <span className="progress-number">{languageProgress.lessonsCompleted.length}</span>
              <span className="progress-label">Lessons Completed</span>
            </div>
            <div className="progress-stat">
              <span className="progress-number">{languageProgress.totalXP}</span>
              <span className="progress-label">Language XP</span>
            </div>
            <div className="progress-stat">
              <span className="progress-number">{languageProgress.overallAccuracy}%</span>
              <span className="progress-label">Accuracy</span>
            </div>
            <div className="progress-stat">
              <span className="progress-number">{Math.round(languageProgress.timeSpent)}</span>
              <span className="progress-label">Minutes</span>
            </div>
          </div>
        </div>
      )}

      <div className="map-content">
        <div className="map-path">
          {lessons.map((lesson, index) => {
            const unlocked = isLessonUnlocked(index);
            const lessonStatus = getLessonStatus(lesson.id);
            const completed = lessonStatus?.completed || false;
            
            return (
              <div key={lesson.id} className="lesson-node-container">
                <div
                  className={`lesson-node ${completed ? 'completed' : ''} ${unlocked ? 'unlocked' : 'locked'}`}
                  onClick={() => unlocked && handleLessonClick(lesson.id)}
                >
                  <div className="lesson-icon">
                    {completed ? (
                      lessonStatus.accuracy === 100 ? '⭐' : '✓'
                    ) : unlocked ? '📚' : '🔒'}
                  </div>
                  <div className="lesson-number">{lesson.id}</div>
                  
                  {/* Progress indicator for completed lessons */}
                  {completed && (
                    <div className="lesson-progress-badge">
                      <span className="accuracy-badge">{lessonStatus.accuracy}%</span>
                    </div>
                  )}
                </div>
                
                <div className="lesson-info">
                  <h3 className="lesson-title">
                    {lesson.title}
                    {completed && lessonStatus.accuracy === 100 && (
                      <span className="perfect-badge">Perfect!</span>
                    )}
                  </h3>
                  <p className="lesson-description">{lesson.description}</p>
                  <div className="lesson-meta">
                    <div className="lesson-xp">+{lesson.xp} XP</div>
                    <div className="lesson-difficulty">{lesson.difficulty}</div>
                    {completed && (
                      <div className="completion-info">
                        <span className="earned-xp">Earned: {lessonStatus.xpEarned} XP</span>
                        <span className="completion-date">
                          {new Date(lessonStatus.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {index < lessons.length - 1 && (
                  <div className={`path-connector ${completed ? 'completed' : ''}`}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Achievements Display */}
        {userStats.recentAchievements && userStats.recentAchievements.length > 0 && (
          <div className="recent-achievements">
            <h3>🏆 Recent Achievements</h3>
            <div className="achievement-list">
              {userStats.recentAchievements.map((achievement, index) => (
                <div key={achievement.id} className="achievement-item">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <div className="achievement-text">
                    <span className="achievement-name">{achievement.name}</span>
                    <span className="achievement-desc">{achievement.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {userStats.currentStreak > 0 && (
          <div className="streak-display">
            <div className="streak-flame">🔥</div>
            <div className="streak-text">
              <strong>{userStats.currentStreak} day streak!</strong>
              <p>Keep it up! Longest: {userStats.longestStreak} days</p>
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