import React, { createContext, useContext, useState, useEffect } from 'react';
import progressTracker from '../utils/progressTracker';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [hearts, setHearts] = useState(5);
  const [currentLesson, setCurrentLesson] = useState(null);
  
  // Progress tracking state
  const [userStats, setUserStats] = useState(progressTracker.getUserStats());
  const [achievements, setAchievements] = useState([]);
  const [exerciseStartTime, setExerciseStartTime] = useState(null);

  // Load saved data from localStorage (legacy support)
  useEffect(() => {
    const savedData = localStorage.getItem('duolingo-clone-data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setSelectedLanguage(data.selectedLanguage || null);
        setHearts(data.hearts || 5);
        
        // Migrate old progress to new system if exists
        if (data.xp || data.completedLessons?.length > 0) {
          console.log('Migrating legacy progress data...');
          // You could implement migration logic here if needed
        }
      } catch (error) {
        console.warn('Failed to load legacy data:', error);
      }
    }
    
    // Update user stats from progress tracker
    updateUserStats();
  }, []);

  // Update user stats from progress tracker
  const updateUserStats = () => {
    setUserStats(progressTracker.getUserStats());
  };

  // Heart management
  const loseHeart = () => {
    setHearts(prev => Math.max(0, prev - 1));
  };

  const resetHearts = () => {
    setHearts(5);
  };

  // XP and progress functions using new tracker
  const gainXP = (amount) => {
    // XP is now handled by progressTracker.completeLesson()
    updateUserStats();
  };

  // Complete lesson with comprehensive tracking
  const completeLesson = (lessonId, accuracy = 100, timeSpent = 0) => {
    if (!selectedLanguage) {
      console.warn('No language selected for lesson completion');
      return;
    }

    // Calculate XP based on lesson difficulty and accuracy
    const baseXP = currentLesson?.xp || 15;
    const accuracyBonus = Math.floor((accuracy / 100) * baseXP * 0.5);
    const totalXP = baseXP + accuracyBonus;

    // Record completion in progress tracker
    const completionData = progressTracker.completeLesson(
      selectedLanguage.id,
      lessonId,
      totalXP,
      accuracy,
      timeSpent
    );

    // Check for new achievements
    const newAchievements = progressTracker.checkAchievements(
      selectedLanguage.id, 
      lessonId, 
      accuracy
    );

    if (newAchievements.length > 0) {
      setAchievements(newAchievements);
    }

    // Update user stats
    updateUserStats();
    
    // Reset hearts on lesson completion
    resetHearts();

    return completionData;
  };

  // Record exercise performance
  const recordExerciseResult = (exerciseType, correct, timeSpent = 0) => {
    progressTracker.recordExercisePerformance(exerciseType, correct, timeSpent);
    updateUserStats();
  };

  // Start timing an exercise
  const startExercise = () => {
    setExerciseStartTime(Date.now());
  };

  // End timing an exercise and record result
  const endExercise = (exerciseType, correct) => {
    const timeSpent = exerciseStartTime ? (Date.now() - exerciseStartTime) / 1000 : 0;
    recordExerciseResult(exerciseType, correct, timeSpent);
    setExerciseStartTime(null);
    return timeSpent;
  };

  // Check if lesson is completed
  const isLessonCompleted = (lessonId) => {
    return selectedLanguage ? 
      progressTracker.isLessonCompleted(selectedLanguage.id, lessonId) : 
      false;
  };

  // Get lesson completion data
  const getLessonCompletion = (lessonId) => {
    return selectedLanguage ? 
      progressTracker.getLessonCompletion(selectedLanguage.id, lessonId) : 
      null;
  };

  // Get language-specific progress
  const getLanguageProgress = () => {
    return selectedLanguage ? 
      progressTracker.getLanguageProgress(selectedLanguage.id) : 
      null;
  };

  // Get exercise performance stats
  const getExerciseStats = () => {
    return progressTracker.getExerciseStats();
  };

  // Clear all progress (with confirmation)
  const clearAllProgress = () => {
    if (progressTracker.clearAllProgress()) {
      updateUserStats();
      setAchievements([]);
      return true;
    }
    return false;
  };

  // Export/Import progress
  const exportProgress = () => {
    return progressTracker.exportProgress();
  };

  const importProgress = (progressData) => {
    if (progressTracker.importProgress(progressData)) {
      updateUserStats();
      return true;
    }
    return false;
  };

  // Dismiss achievements notification
  const dismissAchievements = () => {
    setAchievements([]);
  };

  const value = {
    // Language and lesson state
    selectedLanguage,
    setSelectedLanguage,
    currentLesson,
    setCurrentLesson,
    
    // Hearts system
    hearts,
    setHearts,
    loseHeart,
    resetHearts,
    
    // Progress and stats
    userStats,
    achievements,
    dismissAchievements,
    updateUserStats,
    
    // Lesson management
    completeLesson,
    isLessonCompleted,
    getLessonCompletion,
    getLanguageProgress,
    
    // Exercise tracking
    startExercise,
    endExercise,
    recordExerciseResult,
    getExerciseStats,
    
    // Progress management
    clearAllProgress,
    exportProgress,
    importProgress,
    
    // Legacy support
    gainXP,
    xp: userStats.totalXP,
    streak: userStats.currentStreak,
    completedLessons: new Set() // For backward compatibility
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 