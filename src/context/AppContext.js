import React, { createContext, useContext, useState, useEffect } from 'react';
import { devLog, devWarn } from '../utils/logger';
import progressTracker from '../utils/progressTracker';
import authService from '../services/authService';

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
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Progress tracking state
  const [userStats, setUserStats] = useState(progressTracker.getUserStats());
  const [achievements, setAchievements] = useState([]);
  const [exerciseStartTime, setExerciseStartTime] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      devLog('=== AUTH STATE CHANGE ===');
      devLog('User:', user ? 'Logged in' : 'Logged out');
      devLog('User ID:', user?.uid);
      devLog('========================');
      
      setLoading(true);
      
      if (user) {
        setUser(user);
        
        // Create user document if it doesn't exist
        await authService.createUserDocument(user);
        
        // Load user data from Firestore
        const userDataResult = await authService.getUserData(user.uid);
        devLog('Firestore user data result:', userDataResult);
        
        if (userDataResult.success) {
          setUserData(userDataResult.data);
          devLog('User data loaded:', userDataResult.data);
          
          // Set language preference from user data
          if (userDataResult.data.preferences?.selectedLanguage) {
            setSelectedLanguage(userDataResult.data.preferences.selectedLanguage);
          }
          
          // Sync cloud progress with local progress tracker
          if (userDataResult.data.progress) {
            devLog('Syncing cloud progress with local tracker...');
            progressTracker.syncWithCloudData(userDataResult.data.progress);
            updateUserStats();
          }
        } else {
          console.error('Failed to load user data:', userDataResult.error);
        }
      } else {
        // User is signed out
        setUser(null);
        setUserData(null);
        
        // Keep local progress but don't sync to cloud
        // This allows guest users to still use the app
      }
      
      setLoading(false);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  // Load saved data from localStorage (legacy support)
  useEffect(() => {
    if (!authChecked) return; // Wait for auth check to complete
    
    const savedData = localStorage.getItem('lulearn-data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        
        // Only apply saved language if user doesn't have a preference
        if (!userData?.preferences?.selectedLanguage) {
          setSelectedLanguage(data.selectedLanguage || null);
        }
        
        setHearts(data.hearts || 5);
        
        // Migrate old progress to new system if exists
        if (data.xp || data.completedLessons?.length > 0) {
          devLog('Migrating legacy progress data...');
          // You could implement migration logic here if needed
        }
      } catch (error) {
        devWarn('Failed to load legacy data:', error);
      }
    }
    
    // Update user stats from progress tracker
    updateUserStats();
  }, [authChecked, userData]);

  // Update user stats from progress tracker
  const updateUserStats = () => {
    devLog('=== UPDATE USER STATS DEBUG ===');
    const newStats = progressTracker.getUserStats();
    devLog('progressTracker.getUserStats() returned:', newStats);
    setUserStats(newStats);
    devLog('userStats state updated to:', newStats);
    devLog('=== END UPDATE USER STATS DEBUG ===');
  };

  // Sync progress to cloud if user is authenticated
  const syncProgressToCloud = async () => {
    if (!user) return;
    
    devLog('=== SYNC TO CLOUD DEBUG ===');
    
    const localProgress = progressTracker.exportProgress();
    const stats = progressTracker.getUserStats();
    
    devLog('Raw progressTracker.getUserStats():', stats);
    devLog('Raw progressTracker.exportProgress():', localProgress);
    
    devLog('Syncing progress to cloud:', {
      totalXP: stats.totalXP,
      currentStreak: stats.currentStreak,
      lessonsCompleted: stats.lessonsCompleted,
      averageAccuracy: stats.averageAccuracy,
      longestStreak: stats.longestStreak,
      totalTimeSpent: stats.totalTimeSpent,
      level: stats.level
    });
    
    const updateData = {
      progress: localProgress,
      totalXP: stats.totalXP,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      lessonsCompleted: stats.lessonsCompleted,
      averageAccuracy: stats.averageAccuracy,
      totalTimeSpent: stats.totalTimeSpent,
      level: stats.level,
      lastSyncAt: new Date().toISOString()
    };
    
    devLog('Full update data being sent to Firestore:', updateData);
    
    try {
      const result = await authService.updateUserData(user.uid, updateData);
      devLog('Firestore update result:', result);
      devLog('Progress synced to cloud successfully');
    } catch (error) {
      console.error('Error syncing to cloud:', error);
    }
    
    devLog('=== END SYNC TO CLOUD DEBUG ===');
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
  const completeLesson = async (lessonId, accuracy = 100, timeSpent = 0) => {
    if (!selectedLanguage) {
      devWarn('No language selected for lesson completion');
      return;
    }

    devLog('=== COMPLETING LESSON ===');
    devLog('Lesson ID:', lessonId);
    devLog('Accuracy:', accuracy);
    devLog('Time spent:', timeSpent);
    devLog('Current userData before:', userData);

    // Calculate XP based on lesson difficulty and accuracy
    const baseXP = currentLesson?.xp || 15;
    const accuracyBonus = Math.floor((accuracy / 100) * baseXP * 0.5);
    const totalXP = baseXP + accuracyBonus;

    devLog('XP calculation:', { baseXP, accuracyBonus, totalXP });

    // Record completion in progress tracker
    const completionData = progressTracker.completeLesson(
      selectedLanguage.id,
      lessonId,
      totalXP,
      accuracy,
      timeSpent
    );

    devLog('Progress tracker updated:', completionData);

    // Check for new achievements
    const newAchievements = progressTracker.checkAchievements(
      selectedLanguage.id, 
      lessonId, 
      accuracy
    );

    if (newAchievements.length > 0) {
      setAchievements(newAchievements);
    }

    // Update user stats from progress tracker
    devLog('Updating user stats from progress tracker...');
    updateUserStats();
    
    // Reset hearts on lesson completion
    resetHearts();

    // Sync to cloud if user is authenticated
    if (user) {
      devLog('Syncing progress to Firestore...');
      await syncProgressToCloud();
      
      // Refresh user data from Firestore to update UI
      devLog('Refreshing user data from Firestore...');
      const userDataResult = await authService.getUserData(user.uid);
      if (userDataResult.success) {
        devLog('Previous userData:', userData);
        devLog('New userData from Firestore:', userDataResult.data);
        setUserData(userDataResult.data);
        devLog('User data state updated');
      } else {
        console.error('Failed to refresh user data:', userDataResult.error);
      }
    }

    devLog('=== LESSON COMPLETION DONE ===');
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

  // Language selection with cloud sync
  const updateSelectedLanguage = async (language) => {
    setSelectedLanguage(language);
    
    // Update user preferences in cloud if authenticated
    if (user) {
      await authService.updateUserData(user.uid, {
        preferences: {
          ...userData?.preferences,
          selectedLanguage: language
        }
      });
      
      // Update local userData state
      setUserData(prev => ({
        ...prev,
        preferences: {
          ...prev?.preferences,
          selectedLanguage: language
        }
      }));
    }
  };

  // Authentication handlers
  const handleAuthSuccess = async (authenticatedUser) => {
    setUser(authenticatedUser);
    
    // Load user data and sync progress
    const userDataResult = await authService.getUserData(authenticatedUser.uid);
    if (userDataResult.success) {
      setUserData(userDataResult.data);
      
      // Sync local progress to cloud
      await syncProgressToCloud();
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUserData(null);
    setSelectedLanguage(null);
    // Keep local progress for guest experience
  };

  const value = {
    // Authentication state
    user,
    userData,
    loading,
    authChecked,
    handleAuthSuccess,
    handleLogout,
    
    // Language and lesson state
    selectedLanguage,
    setSelectedLanguage: updateSelectedLanguage,
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
    syncProgressToCloud,
    
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
    completedLessons: new Set(), // For backward compatibility
    title: "🎉 Welcome to Lulearn!",
    message: "Start your language learning journey with Luna the Fox! Complete lessons, earn XP, and unlock achievements."
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 